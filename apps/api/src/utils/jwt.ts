import jwt from 'jsonwebtoken';
import { JWTPayload, RefreshTokenPayload } from '../types/auth';
import config from '../config';
import logger from './logger';

export class JWTService {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss'>): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
      issuer: config.jwt.issuer,
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp' | 'iss'>): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshTokenExpiry,
      issuer: config.jwt.issuer,
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(userId: string, email: string, tokenVersion: number = 0) {
    const accessToken = this.generateAccessToken({ userId, email });
    const refreshToken = this.generateRefreshToken({ userId, tokenVersion });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpiryInSeconds(config.jwt.accessTokenExpiry),
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

      // Validate issuer
      if (decoded.iss !== config.jwt.issuer) {
        logger.warn('Invalid token issuer', { issuer: decoded.iss });
        return null;
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid JWT token', { error: error.message });
      } else if (error instanceof jwt.TokenExpiredError) {
        logger.debug('JWT token expired', { error: error.message });
      } else {
        logger.error('JWT verification error', { error });
      }
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as RefreshTokenPayload;

      // Validate issuer
      if (decoded.iss !== config.jwt.issuer) {
        logger.warn('Invalid refresh token issuer', { issuer: decoded.iss });
        return null;
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid refresh token', { error: error.message });
      } else if (error instanceof jwt.TokenExpiredError) {
        logger.debug('Refresh token expired', { error: error.message });
      } else {
        logger.error('Refresh token verification error', { error });
      }
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Get token expiry time in seconds
   */
  static getTokenExpiryInSeconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 900; // Default 15 minutes
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 900;
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error('Token decode error', { error });
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiry date
   */
  static getTokenExpiryDate(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return null;
      }

      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate email verification token
   */
  static generateEmailVerificationToken(email: string): string {
    return jwt.sign(
      { email, purpose: 'email_verification' },
      config.jwt.secret,
      { expiresIn: '24h', issuer: config.jwt.issuer }
    );
  }

  /**
   * Verify email verification token
   */
  static verifyEmailVerificationToken(token: string): { email: string } | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;

      if (decoded.iss !== config.jwt.issuer || decoded.purpose !== 'email_verification') {
        return null;
      }

      return { email: decoded.email };
    } catch (error) {
      logger.warn('Invalid email verification token', { error: error.message });
      return null;
    }
  }

  /**
   * Generate password reset token
   */
  static generatePasswordResetToken(email: string): string {
    return jwt.sign(
      { email, purpose: 'password_reset' },
      config.jwt.secret,
      { expiresIn: '1h', issuer: config.jwt.issuer }
    );
  }

  /**
   * Verify password reset token
   */
  static verifyPasswordResetToken(token: string): { email: string } | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;

      if (decoded.iss !== config.jwt.issuer || decoded.purpose !== 'password_reset') {
        return null;
      }

      return { email: decoded.email };
    } catch (error) {
      logger.warn('Invalid password reset token', { error: error.message });
      return null;
    }
  }

  /**
   * Generate team invitation token
   */
  static generateTeamInvitationToken(
    email: string,
    artistId: string,
    role: string,
    invitedBy: string
  ): string {
    return jwt.sign(
      {
        email,
        artistId,
        role,
        invitedBy,
        purpose: 'team_invitation',
      },
      config.jwt.secret,
      { expiresIn: '7d', issuer: config.jwt.issuer }
    );
  }

  /**
   * Verify team invitation token
   */
  static verifyTeamInvitationToken(token: string): {
    email: string;
    artistId: string;
    role: string;
    invitedBy: string;
  } | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;

      if (decoded.iss !== config.jwt.issuer || decoded.purpose !== 'team_invitation') {
        return null;
      }

      return {
        email: decoded.email,
        artistId: decoded.artistId,
        role: decoded.role,
        invitedBy: decoded.invitedBy,
      };
    } catch (error) {
      logger.warn('Invalid team invitation token', { error: error.message });
      return null;
    }
  }
}

export default JWTService;