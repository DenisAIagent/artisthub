import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import config from '../config';
import logger from './logger';

export class CryptoService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(config.security.bcryptRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      logger.error('Password hashing error', { error });
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Password verification error', { error });
      return false;
    }
  }

  /**
   * Generate a secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a secure random UUID
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Create a hash of data using SHA-256
   */
  static createHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Create HMAC signature
   */
  static createHMAC(data: string, key: string): string {
    return crypto.createHmac('sha256', key).update(data).digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  static verifyHMAC(data: string, signature: string, key: string): boolean {
    const expectedSignature = this.createHMAC(data, key);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Encrypt sensitive data (for database storage)
   */
  static encrypt(text: string, key?: string): string {
    try {
      const encryptionKey = key || config.jwt.secret;
      const algorithm = 'aes-256-gcm';
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipher(algorithm, encryptionKey);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
    } catch (error) {
      logger.error('Encryption error', { error });
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedText: string, key?: string): string {
    try {
      const encryptionKey = key || config.jwt.secret;
      const algorithm = 'aes-256-gcm';

      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipher(algorithm, encryptionKey);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption error', { error });
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Generate a cryptographically secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /**
   * Generate a secure OTP (One-Time Password)
   */
  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex];
    }

    return otp;
  }

  /**
   * Create a deterministic hash for data deduplication
   */
  static createDataHash(data: any): string {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    return this.createHash(jsonString);
  }

  /**
   * Generate API key
   */
  static generateAPIKey(): string {
    const prefix = 'ah_'; // ArtistHub prefix
    const randomPart = this.generateSecureToken(24);
    return prefix + randomPart;
  }

  /**
   * Mask sensitive data for logging
   */
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars * 2) {
      return '*'.repeat(data.length);
    }

    const start = data.substring(0, visibleChars);
    const end = data.substring(data.length - visibleChars);
    const middle = '*'.repeat(data.length - visibleChars * 2);

    return start + middle + end;
  }

  /**
   * Time-safe string comparison
   */
  static timingSafeEquals(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  }

  /**
   * Generate file checksum
   */
  static generateFileChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    // Uppercase letter
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one uppercase letter');
    }

    // Lowercase letter
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one lowercase letter');
    }

    // Number
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one number');
    }

    // Special character
    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one special character (@$!%*?&)');
    }

    // Additional length bonus
    if (password.length >= 12) {
      score += 1;
    }

    // Common password patterns (basic check)
    const commonPatterns = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'dragon', 'master', 'login'
    ];

    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      score -= 2;
      feedback.push('Password contains common patterns');
    }

    return {
      isValid: score >= 4 && feedback.length === 0,
      score: Math.max(0, score),
      feedback,
    };
  }
}

export default CryptoService;