import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 8002;
const JWT_SECRET = process.env.JWT_SECRET || 'artisthub-dev-secret-key-2024';

// Simple in-memory user storage for authentication
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'artist' | 'manager' | 'admin';
  createdAt: string;
}

const users: User[] = [
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
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
    (req as any).user = user;
    next();
  });
};

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

// Authentication routes
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during login'
    });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'artist' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password and name are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role: role as 'artist' | 'manager' | 'admin',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during registration'
    });
  }
});

app.get('/api/v1/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === (req as any).user.id);
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User account no longer exists'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

app.post('/api/v1/auth/logout', authenticateToken, (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ArtistHub API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Protected API routes
app.get('/api/v1/users', authenticateToken, (req, res) => {
  // Return users without passwords
  const safeUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));

  res.json({
    success: true,
    users: safeUsers
  });
});

app.get('/api/v1/artists', (req, res) => {
  res.json({
    artists: [
      {
        id: 1,
        name: 'The Midnight',
        genre: 'Synthwave',
        followers: 125000,
        status: 'active'
      },
      {
        id: 2,
        name: 'Carpenter Brut',
        genre: 'Darksynth',
        followers: 89000,
        status: 'active'
      }
    ]
  });
});

app.get('/api/v1/dashboard/stats', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      totalArtists: 15,
      totalUsers: users.length,
      activeCampaigns: 8,
      totalRevenue: 125000,
      monthlyGrowth: 12.5
    }
  });
});

app.get('/api/v1/statistics/overview', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      analytics: {
        totalStreams: 2450000,
        monthlyListeners: 185000,
        revenueGrowth: 15.8,
        engagementRate: 8.4
      },
      platforms: [
        {
          name: 'Spotify',
          streams: 1200000,
          growth: 18.2,
          revenue: 4800
        },
        {
          name: 'Apple Music',
          streams: 650000,
          growth: 12.5,
          revenue: 3200
        },
        {
          name: 'YouTube Music',
          streams: 600000,
          growth: 22.1,
          revenue: 1200
        }
      ],
      recentActivity: [
        {
          date: '2024-03-15',
          type: 'release',
          title: 'Nouvelle sortie: "Midnight Dreams"',
          impact: '+15K streams'
        },
        {
          date: '2024-03-10',
          type: 'campaign',
          title: 'Campagne Instagram lancée',
          impact: '+2.3K followers'
        },
        {
          date: '2024-03-05',
          type: 'performance',
          title: 'Concert au Bataclan',
          impact: '+500 followers'
        }
      ]
    }
  });
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ArtistHub API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎵 API base URL: http://localhost:${PORT}/api/v1`);
});

export default app;