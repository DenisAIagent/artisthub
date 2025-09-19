export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const copy = {} as T;
    Object.keys(obj).forEach(key => {
      (copy as any)[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  return obj;
};

export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

export const isNotEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length > 0;
};

export const hasProperty = (obj: any, property: string): boolean => {
  return obj && typeof obj === 'object' && property in obj;
};

export const getValue = (obj: any, path: string, defaultValue?: any): any => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }

  return result;
};

export const setValue = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
};

export const mergeDeep = <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};