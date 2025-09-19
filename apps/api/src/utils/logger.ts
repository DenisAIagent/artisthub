import winston from 'winston';
import config from '../config';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({
    all: true
  }),
  winston.format.printf(
    ({ level, message, timestamp, stack, ...meta }) => {
      const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      if (stack) {
        return `${timestamp} [${level}]: ${message}\n${stack}${metaString}`;
      }
      return `${timestamp} [${level}]: ${message}${metaString}`;
    }
  )
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport
if (config.logging.console) {
  transports.push(
    new winston.transports.Console({
      format: logFormat,
    })
  );
}

// File transports
if (config.logging.file) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'artisthub-api',
    version: config.app.version,
    environment: config.app.env
  },
  transports,
  exceptionHandlers: transports,
  rejectionHandlers: transports,
});

// Request logger middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || 'anonymous',
    };

    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
};

// Security logger for authentication events
export const securityLogger = {
  loginAttempt: (email: string, success: boolean, ip: string, userAgent: string) => {
    logger.info('Login Attempt', {
      event: 'login_attempt',
      email,
      success,
      ip,
      userAgent,
    });
  },

  passwordReset: (email: string, ip: string) => {
    logger.info('Password Reset', {
      event: 'password_reset_request',
      email,
      ip,
    });
  },

  tokenRefresh: (userId: string, ip: string) => {
    logger.info('Token Refresh', {
      event: 'token_refresh',
      userId,
      ip,
    });
  },

  unauthorizedAccess: (ip: string, url: string, method: string) => {
    logger.warn('Unauthorized Access', {
      event: 'unauthorized_access',
      ip,
      url,
      method,
    });
  },
};

export default logger;