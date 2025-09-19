export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const getBaseUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch (_) {
    return '';
  }
};

export const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (_) {
    return '';
  }
};

export const buildUrl = (base: string, path: string, params?: Record<string, string>): string => {
  const url = new URL(path, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
};

export const getUrlParams = (url: string): Record<string, string> => {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  } catch (_) {
    return {};
  }
};

export const addTrailingSlash = (url: string): string => {
  return url.endsWith('/') ? url : `${url}/`;
};

export const removeTrailingSlash = (url: string): string => {
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const createApiUrl = (endpoint: string, version = 'v1'): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${baseUrl}/api/${version}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};