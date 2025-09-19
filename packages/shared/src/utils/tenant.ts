export interface TenantContext {
  tenantId: string;
  tenantType: 'agency' | 'label' | 'independent';
  subdomain?: string;
  customDomain?: string;
}

export const createTenantContext = (
  tenantId: string,
  tenantType: 'agency' | 'label' | 'independent',
  subdomain?: string,
  customDomain?: string
): TenantContext => {
  return {
    tenantId,
    tenantType,
    subdomain,
    customDomain,
  };
};

export const getTenantFromDomain = (domain: string): { subdomain?: string; isCustomDomain: boolean } => {
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'artisthub.com';

  if (domain === mainDomain || domain === `www.${mainDomain}`) {
    return { isCustomDomain: false };
  }

  if (domain.endsWith(`.${mainDomain}`)) {
    const subdomain = domain.replace(`.${mainDomain}`, '');
    return { subdomain, isCustomDomain: false };
  }

  return { isCustomDomain: true };
};

export const buildTenantUrl = (subdomain: string, path = ''): string => {
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'artisthub.com';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const port = process.env.NODE_ENV === 'development' ? ':3000' : '';

  return `${protocol}://${subdomain}.${mainDomain}${port}${path}`;
};

export const validateSubdomain = (subdomain: string): boolean => {
  // Subdomain rules: 3-63 characters, alphanumeric and hyphens, no consecutive hyphens
  const regex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
  const reservedNames = [
    'www', 'api', 'admin', 'app', 'mail', 'ftp', 'staging', 'dev', 'test',
    'support', 'help', 'docs', 'blog', 'news', 'cdn', 'static', 'assets',
  ];

  return regex.test(subdomain) && !reservedNames.includes(subdomain);
};

export const generateSubdomain = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
};

export const getTenantDbPrefix = (tenantId: string): string => {
  return `tenant_${tenantId}`;
};

export const isTenantFeatureEnabled = (
  feature: string,
  tenantType: TenantContext['tenantType']
): boolean => {
  const featureMatrix: Record<string, string[]> = {
    advanced_analytics: ['agency', 'label'],
    white_label: ['agency'],
    custom_domain: ['agency', 'label'],
    unlimited_artists: ['agency', 'label'],
    api_access: ['agency', 'label'],
    priority_support: ['agency', 'label'],
    custom_integrations: ['agency'],
  };

  return featureMatrix[feature]?.includes(tenantType) || false;
};