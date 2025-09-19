export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValidDate(dateObj)) return '';

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const toISOString = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isValidDate(dateObj) ? dateObj.toISOString() : '';
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};