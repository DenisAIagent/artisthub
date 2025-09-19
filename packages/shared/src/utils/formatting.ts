// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

import { format, parseISO, isValid } from 'date-fns';
import { CurrencyCode } from '../types';

/**
 * Format currency amount with proper symbol and locale
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'EUR',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to basic formatting
    const symbols: Record<CurrencyCode, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£',
      CAD: 'CAD$',
      AUD: 'AUD$',
      JPY: '¥',
      BRL: 'R$',
    };

    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export function formatNumber(
  num: number,
  options: {
    precision?: number;
    locale?: string;
    compact?: boolean;
  } = {}
): string {
  const { precision = 1, locale = 'en-US', compact = false } = options;

  if (compact && Math.abs(num) >= 1000) {
    try {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: precision,
      }).format(num);
    } catch (error) {
      // Fallback for unsupported locales
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
      const scaledNum = num / Math.pow(1000, magnitude);
      return `${scaledNum.toFixed(precision)}${suffixes[magnitude] || ''}`;
    }
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: precision,
  }).format(num);
}

/**
 * Format percentage with proper symbol
 */
export function formatPercentage(
  value: number,
  options: {
    precision?: number;
    locale?: string;
    showSign?: boolean;
  } = {}
): string {
  const { precision = 1, locale = 'en-US', showSign = false } = options;

  const formatted = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    signDisplay: showSign ? 'always' : 'auto',
  }).format(value / 100);

  return formatted;
}

/**
 * Format date with locale support
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'MMM dd, yyyy',
  options: {
    locale?: any;
    timezone?: string;
  } = {}
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    // For timezone support, we'd need additional libraries like date-fns-tz
    return format(dateObj, formatString, options);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format date and time for specific locales
 */
export function formatDateTime(
  date: Date | string,
  options: {
    locale?: string;
    timezone?: string;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
  } = {}
): string {
  const {
    locale = 'en-US',
    timezone = 'UTC',
    dateStyle = 'medium',
    timeStyle = 'short',
  } = options;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
      dateStyle,
      timeStyle,
      timeZone: timezone,
    }).format(dateObj);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(
  date: Date | string,
  options: {
    locale?: string;
    numeric?: 'always' | 'auto';
  } = {}
): string {
  const { locale = 'en-US', numeric = 'auto' } = options;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric });

    // Define time units in seconds
    const units: Array<[string, number]> = [
      ['year', 31536000],
      ['month', 2592000],
      ['week', 604800],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
      ['second', 1],
    ];

    for (const [unit, secondsInUnit] of units) {
      const amount = Math.floor(Math.abs(diffInSeconds) / secondsInUnit);
      if (amount >= 1) {
        return rtf.format(diffInSeconds < 0 ? amount : -amount, unit as Intl.RelativeTimeFormatUnit);
      }
    }

    return rtf.format(0, 'second');
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(
  bytes: number,
  options: {
    binary?: boolean;
    precision?: number;
    locale?: string;
  } = {}
): string {
  const { binary = false, precision = 1, locale = 'en-US' } = options;

  if (bytes === 0) return '0 B';

  const base = binary ? 1024 : 1000;
  const units = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  const size = bytes / Math.pow(base, unitIndex);

  return `${size.toLocaleString(locale, {
    maximumFractionDigits: precision,
  })} ${units[unitIndex]}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(
  phoneNumber: string,
  countryCode: string = 'US'
): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Basic formatting for common patterns
  if (countryCode === 'US' && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (countryCode === 'FR' && digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }

  // Fallback: just return with international prefix if applicable
  if (digits.length > 10 && !digits.startsWith('1')) {
    return `+${digits}`;
  }

  return phoneNumber; // Return original if no pattern matches
}

/**
 * Format name for display
 */
export function formatName(
  firstName?: string | null,
  lastName?: string | null,
  options: {
    format?: 'first-last' | 'last-first' | 'first-only' | 'last-only' | 'initials';
    fallback?: string;
  } = {}
): string {
  const { format = 'first-last', fallback = 'Unknown' } = options;

  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';

  if (!first && !last) return fallback;

  switch (format) {
    case 'first-last':
      return [first, last].filter(Boolean).join(' ');
    case 'last-first':
      return [last, first].filter(Boolean).join(', ');
    case 'first-only':
      return first || last || fallback;
    case 'last-only':
      return last || first || fallback;
    case 'initials':
      const firstInitial = first.charAt(0).toUpperCase();
      const lastInitial = last.charAt(0).toUpperCase();
      return (firstInitial + lastInitial) || fallback;
    default:
      return [first, last].filter(Boolean).join(' ');
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string,
  maxLength: number,
  options: {
    ellipsis?: string;
    wordBoundary?: boolean;
  } = {}
): string {
  const { ellipsis = '...', wordBoundary = true } = options;

  if (text.length <= maxLength) return text;

  let truncated = text.slice(0, maxLength);

  if (wordBoundary) {
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      truncated = truncated.slice(0, lastSpace);
    }
  }

  return truncated + ellipsis;
}

/**
 * Format list of items with proper conjunctions
 */
export function formatList(
  items: string[],
  options: {
    style?: 'long' | 'short' | 'narrow';
    type?: 'conjunction' | 'disjunction' | 'unit';
    locale?: string;
  } = {}
): string {
  const { style = 'long', type = 'conjunction', locale = 'en-US' } = options;

  if (items.length === 0) return '';
  if (items.length === 1) return items[0] || '';

  try {
    const formatter = new Intl.ListFormat(locale, { style, type });
    return formatter.format(items);
  } catch (error) {
    // Fallback for unsupported locales
    if (items.length === 2) {
      return items.join(' and ');
    }
    return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
  }
}

/**
 * Format duration in human readable format
 */
export function formatDuration(
  seconds: number,
  options: {
    format?: 'long' | 'short' | 'compact';
    locale?: string;
  } = {}
): string {
  const { format = 'long', locale = 'en-US' } = options;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (format === 'compact') {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${format === 'short' ? 'h' : hours === 1 ? 'hour' : 'hours'}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${format === 'short' ? 'm' : minutes === 1 ? 'minute' : 'minutes'}`);
  }

  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds} ${format === 'short' ? 's' : remainingSeconds === 1 ? 'second' : 'seconds'}`);
  }

  return formatList(parts, { locale });
}