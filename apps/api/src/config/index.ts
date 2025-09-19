import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  app: {
    name: string;
    version: string;
    env: string;
    port: number;
    apiPrefix: string;
    corsOrigin: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    dialect: 'postgres';
    logging: boolean;
    pool: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
    };
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  jwt: {
    secret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
  };
  aws: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    s3BucketName: string;
  };
  email: {
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };
  security: {
    bcryptRounds: number;
    rateLimiting: {
      windowMs: number;
      maxRequests: number;
    };
  };
  logging: {
    level: string;
    file: boolean;
    console: boolean;
  };
}

const config: Config = {
  app: {
    name: process.env.APP_NAME || 'ArtistHub API',
    version: process.env.APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'artisthub_dev',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
      idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10),
    },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: process.env.JWT_ISSUER || 'artisthub-api',
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3BucketName: process.env.AWS_S3_BUCKET_NAME || 'artisthub-uploads',
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    from: process.env.EMAIL_FROM || 'noreply@artisthub.com',
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    rateLimiting: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE === 'true',
    console: process.env.LOG_CONSOLE !== 'false',
  },
};

// Validation for required environment variables
const requiredEnvVars = ['JWT_SECRET'];

if (config.app.env === 'production') {
  requiredEnvVars.push(
    'DB_HOST',
    'DB_NAME',
    'DB_USERNAME',
    'DB_PASSWORD',
    'REDIS_HOST'
  );
}

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

export default config;