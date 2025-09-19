const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 8002;
const JWT_SECRET = process.env.JWT_SECRET || 'artisthub-dev-secret-key-2024';

// Simple in-memory user storage for authentication
const users = [
  {
    id: 1,
    email: 'demo@artisthub.com',
    password: '$2a$10$xE6fiaP5VOBoVigzQD0I6.iQr/lNQfYcKA71yZxgsS4rzTJTxuYTa', // password: 'demo123'
    name: 'Démo Artist',
    role: 'artist',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'manager@artisthub.com',
    password: '$2a$10$xE6fiaP5VOBoVigzQD0I6.iQr/lNQfYcKA71yZxgsS4rzTJTxuYTa', // password: 'demo123'
    name: 'Démo Manager',
    role: 'manager',
    createdAt: new Date().toISOString()
  }
];

// JWT Token validation middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
    req.user = user;
    next();
  });
};

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3004',
    'http://localhost:3000',
    'https://artisthub-web.railway.app',
    /\.railway\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ArtistHub API',
    version: '1.0.0'
  });
});

// Authentication endpoints
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'artist' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/v1/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });
});

// Artists endpoint
app.get('/api/v1/artists', authenticateToken, (req, res) => {
  const mockArtists = [
    {
      id: 1,
      name: 'Luna Rivera',
      genre: 'Indie Pop',
      status: 'active',
      monthlyListeners: 125420,
      totalStreams: 2840000,
      lastActivity: '2024-01-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna'
    },
    {
      id: 2,
      name: 'Echo Collective',
      genre: 'Electronic',
      status: 'active',
      monthlyListeners: 89350,
      totalStreams: 1920000,
      lastActivity: '2024-01-12',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Echo'
    },
    {
      id: 3,
      name: 'Midnight Serenade',
      genre: 'Jazz Fusion',
      status: 'inactive',
      monthlyListeners: 45680,
      totalStreams: 890000,
      lastActivity: '2023-12-28',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight'
    }
  ];

  res.json({
    success: true,
    data: mockArtists
  });
});

// Dashboard stats endpoint
app.get('/api/v1/dashboard/stats', authenticateToken, (req, res) => {
  const mockStats = {
    totalArtists: 12,
    totalRevenue: 45280,
    activeProjects: 8,
    monthlyGrowth: 12.5,
    recentActivities: [
      {
        id: 1,
        type: 'new_release',
        artist: 'Luna Rivera',
        description: 'Released new single "Midnight Dreams"',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        type: 'concert',
        artist: 'Echo Collective',
        description: 'Live performance at Blue Note NYC',
        timestamp: '2024-01-14T20:00:00Z'
      }
    ]
  };

  res.json({
    success: true,
    data: mockStats
  });
});

// Analytics overview endpoint
app.get('/api/v1/statistics/overview', authenticateToken, (req, res) => {
  const mockAnalytics = {
    totalRevenue: 125430,
    totalStreams: 8450000,
    totalArtists: 12,
    growthRate: 15.2,
    monthlyData: [
      { month: 'Jan', revenue: 12500, streams: 850000 },
      { month: 'Feb', revenue: 14200, streams: 920000 },
      { month: 'Mar', revenue: 13800, streams: 880000 },
      { month: 'Apr', revenue: 15600, streams: 1100000 },
      { month: 'May', revenue: 17200, streams: 1200000 },
      { month: 'Jun', revenue: 16800, streams: 1150000 }
    ],
    topArtists: [
      { name: 'Luna Rivera', revenue: 35000, streams: 2840000 },
      { name: 'Echo Collective', revenue: 28000, streams: 1920000 },
      { name: 'Midnight Serenade', revenue: 18000, streams: 890000 }
    ],
    revenueBySource: {
      streaming: 65000,
      concerts: 35000,
      merchandise: 15000,
      licensing: 10430
    }
  };

  res.json({
    success: true,
    data: mockAnalytics
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ArtistHub API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;