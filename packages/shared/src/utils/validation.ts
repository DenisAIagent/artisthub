import { z } from 'zod';

export const emailSchema = z
  .string()
  .email({ message: 'Invalid email address' });

export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s\-\(\)]+$/, { message: 'Invalid phone number' });

export const urlSchema = z
  .string()
  .url({ message: 'Invalid URL' });

export const uuidSchema = z
  .string()
  .uuid({ message: 'Invalid UUID' });

export const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const isValidPhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success;
};

export const isValidUrlSchema = (url: string): boolean => {
  return urlSchema.safeParse(url).success;
};

export const isValidUuid = (id: string): boolean => {
  return uuidSchema.safeParse(id).success;
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');
};