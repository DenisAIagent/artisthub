export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const generateShortId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const hashString = async (str: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // Browser environment
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Node.js environment (simplified)
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(str).digest('hex');
  }
};

export const generateApiKey = (): string => {
  return `ak_${generateShortId(32)}`;
};

export const generateWebhookSecret = (): string => {
  return `whsec_${generateShortId(40)}`;
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
};

export const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;

  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  return `${masked}${lastFour}`;
};

export const isValidHash = (hash: string, algorithm = 'sha256'): boolean => {
  const lengths: Record<string, number> = {
    md5: 32,
    sha1: 40,
    sha256: 64,
    sha512: 128,
  };

  const expectedLength = lengths[algorithm];
  return hash.length === expectedLength && /^[a-f0-9]+$/i.test(hash);
};