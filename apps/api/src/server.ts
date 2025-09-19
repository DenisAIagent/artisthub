import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import logger from './utils/logger';
import { testConnection, syncDatabase } from './models';

// Import routes
import dashboardRoutes from './routes/dashboard';
// import authRoutes from './routes/auth';
// import userRoutes from './routes/users';
// import artistRoutes from './routes/artists';

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimiting.windowMs,
  max: config.security.rateLimiting.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: config.app.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.app.env,
    version: config.app.version,
  });
});

// API routes
app.use(config.app.apiPrefix, (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// API routes
app.use(`${config.app.apiPrefix}/dashboard`, dashboardRoutes);
// TODO: Add remaining routes when they are created
// app.use(`${config.app.apiPrefix}/auth`, authRoutes);
// app.use(`${config.app.apiPrefix}/users`, userRoutes);
// app.use(`${config.app.apiPrefix}/artists`, artistRoutes);

// Temporary endpoint to test database connection
app.get(`${config.app.apiPrefix}/test-db`, async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      success: true,
      message: 'Database connection test completed',
      connected: isConnected,
    });
  } catch (error) {
    logger.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: config.app.env === 'development' ? err.message : 'Internal server error',
    ...(config.app.env === 'development' && { stack: err.stack }),
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  // TODO: Close database connections, cleanup resources
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  // TODO: Close database connections, cleanup resources
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const isDbConnected = await testConnection();
    if (!isDbConnected) {
      logger.error('Failed to connect to database, exiting...');
      process.exit(1);
    }

    // Sync database (only in development)
    if (config.app.env === 'development') {
      await syncDatabase(false); // Set to true to force recreate tables
      logger.info('Database synchronized');
    }

    // Start listening
    app.listen(config.app.port, () => {
      logger.info(`🚀 ${config.app.name} v${config.app.version} started successfully!`);
      logger.info(`📡 Server running on port ${config.app.port}`);
      logger.info(`🌍 Environment: ${config.app.env}`);
      logger.info(`🔗 API Prefix: ${config.app.apiPrefix}`);
      logger.info(`📊 Health check: http://localhost:${config.app.port}/health`);
      logger.info(`🧪 DB Test: http://localhost:${config.app.port}${config.app.apiPrefix}/test-db`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Export app for testing
export default app;

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}