export interface CurrencyOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatCurrencyAdvanced = (
  amount: number,
  options: CurrencyOptions = {}
): string => {
  const {
    locale = 'fr-FR',
    currency = 'EUR',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

export const formatCompactCurrency = (
  amount: number,
  options: CurrencyOptions = {}
): string => {
  const { locale = 'fr-FR', currency = 'EUR' } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
};

export const parseCurrencyString = (currencyString: string): number => {
  const numericString = currencyString.replace(/[^\d.,]/g, '');
  const normalized = numericString.replace(/,/g, '.');
  return parseFloat(normalized) || 0;
};

export const convertCents = (cents: number): number => {
  return cents / 100;
};

export const toCents = (amount: number): number => {
  return Math.round(amount * 100);
};

export const formatRevenue = (amount: number): string => {
  if (amount >= 1000000) {
    return formatCompactCurrency(amount);
  }
  return formatCurrency(amount);
};

export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

export const formatPercentageChange = (current: number, previous: number): string => {
  if (previous === 0) return '+∞%';
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};