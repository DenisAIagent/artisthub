
export const roundToDecimals = (num: number, decimals = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

export const isValidNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const parseFloat = (value: string | number): number => {
  if (typeof value === 'number') return value;
  const parsed = globalThis.parseFloat(value.replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

