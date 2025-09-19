import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import sequelize, { syncDatabase, testConnection } from './models';
import { seedDatabase } from './database/seedData';

// Routes
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3004',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ArtistHub API is running with SQLite database',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'connected'
  });
});

// API routes
app.use('/api/v1/dashboard', dashboardRoutes);

// Basic API routes with real data
app.get('/api/v1/users', async (req, res) => {
  try {
    const { User } = await import('./models');
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive']
    });

    res.json({
      users: users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/v1/artists', async (req, res) => {
  try {
    const { Artist } = await import('./models');
    const artists = await Artist.findAll({
      attributes: ['id', 'stageName', 'genre', 'totalFollowers', 'status']
    });

    res.json({
      artists: artists.map(artist => ({
        id: artist.id,
        name: artist.stageName,
        genre: artist.genre,
        followers: artist.totalFollowers,
        status: artist.status
      }))
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

app.get('/api/v1/dashboard/stats', async (req, res) => {
  try {
    const { User, Artist, MarketingCampaign, RevenueStream } = await import('./models');

    const [totalUsers, totalArtists, activeCampaigns, revenueData] = await Promise.all([
      User.count({ where: { isActive: true } }),
      Artist.count({ where: { status: 'active' } }),
      MarketingCampaign.count({ where: { status: 'active' } }),
      RevenueStream.findAll({
        where: { status: 'confirmed' },
        attributes: ['amount']
      })
    ]);

    const totalRevenue = revenueData.reduce((sum, rev) => sum + parseFloat(rev.amount.toString()), 0);

    res.json({
      totalArtists,
      totalUsers,
      activeCampaigns,
      totalRevenue: Math.round(totalRevenue),
      monthlyGrowth: 12.5 // Would be calculated from historical data
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Catch-all route
app.get('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Database initialization and server startup
const startServer = async () => {
  try {
    console.log('🔗 Testing database connection...');
    const isConnected = await testConnection();

    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    console.log('🔄 Synchronizing database...');
    await syncDatabase(false); // Don't force recreate tables

    // Check if database is empty and seed if needed
    const { User } = await import('./models');
    const userCount = await User.count();

    if (userCount === 0) {
      console.log('📦 Database is empty, seeding with initial data...');
      await seedDatabase();
    } else {
      console.log(`📊 Database contains ${userCount} users`);
    }

    app.listen(PORT, () => {
      console.log(`🚀 ArtistHub API Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🎵 API base URL: http://localhost:${PORT}/api/v1`);
      console.log(`💾 Database: SQLite (${userCount} users loaded)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await sequelize.close();
    console.log('💾 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();

export default app;