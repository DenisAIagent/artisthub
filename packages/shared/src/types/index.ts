// =============================================================================
// SHARED TYPES FOR CRESCENDOCRM
// =============================================================================

// User & Authentication Types
export type UserRole = 'owner' | 'admin' | 'manager' | 'collaborator' | 'readonly' | 'external';
export type TenantPlan = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise';

// Contact Types
export type ContactType = 'person' | 'company';

// Deal & Booking Types
export type DealStatus = 'prospecting' | 'proposal' | 'negotiation' | 'confirmed' | 'cancelled' | 'completed';
export type DealPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TourStatus = 'planning' | 'announced' | 'on_sale' | 'sold_out' | 'ongoing' | 'completed' | 'cancelled';

// Campaign Types
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CampaignType = 'social_media' | 'advertising' | 'email' | 'pr' | 'influencer' | 'other';

// Billing Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'BRL';

// Common Types
export interface TimestampFields {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface TenantScoped {
  tenantId: string;
}

export interface UserScoped {
  createdBy?: string | null;
  updatedBy?: string | null;
}

// API Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

// File Types
export interface FileUpload {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  metadata?: Record<string, unknown>;
}

// Address Types
export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string; // ISO 3166-1 alpha-2
}

// Social Links
export interface SocialLinks {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  spotify?: string;
  appleMusic?: string;
  soundcloud?: string;
  bandcamp?: string;
}

// Contact Types
export interface Contact extends TimestampFields, TenantScoped, UserScoped {
  id: string;
  type: ContactType;
  companyId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  website?: string | null;
  address?: Address;
  timezone?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  bio?: string | null;
  notes?: string | null;
  avatarUrl?: string | null;
  socialLinks?: SocialLinks;
  tags?: string[];
  customFields?: Record<string, unknown>;
  source?: string | null;
  sourceDetails?: Record<string, unknown>;
  marketingConsent?: boolean;
  marketingConsentDate?: Date | null;
  gdprConsent?: Record<string, unknown>;
  leadScore?: number;
  lastContactDate?: Date | null;
}

// Artist Types
export interface Artist extends TimestampFields, TenantScoped, UserScoped {
  id: string;
  contactId?: string | null;
  stageName: string;
  realName?: string | null;
  bio?: string | null;
  genres?: string[];
  originCountry?: string | null;
  originCity?: string | null;
  formationDate?: Date | null;
  website?: string | null;
  bookingEmail?: string | null;
  managementEmail?: string | null;
  pressEmail?: string | null;
  socialLinks?: SocialLinks;
  streamingLinks?: Record<string, string>;
  pressKitUrl?: string | null;
  images?: FileUpload[];
  videos?: FileUpload[];
  audioSamples?: FileUpload[];
  pressQuotes?: Array<{
    quote: string;
    source: string;
    date?: Date;
    url?: string;
  }>;
  achievements?: Array<{
    title: string;
    description?: string;
    date?: Date;
    category?: string;
  }>;
  teamMembers?: Array<{
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }>;
  territories?: string[];
  baseFee?: number | null;
  feeCurrency?: CurrencyCode;
  technicalRider?: string | null;
  hospitalityRider?: string | null;
  stagePlotUrl?: string | null;
  inputListUrl?: string | null;
  tags?: string[];
  customFields?: Record<string, unknown>;
  isActive?: boolean;
}

// Deal Types
export interface Deal extends TimestampFields, TenantScoped, UserScoped {
  id: string;
  tourId?: string | null;
  artistId: string;
  venueId?: string | null;
  contactId?: string | null;
  title: string;
  description?: string | null;
  status: DealStatus;
  priority: DealPriority;
  eventDate?: Date | null;
  eventTimezone?: string | null;
  doorsTime?: string | null; // Time format
  showTime?: string | null;
  endTime?: string | null;
  guarantee?: number | null;
  percentage?: number | null;
  expenses?: number | null;
  currency: CurrencyCode;
  capacity?: number | null;
  ticketPriceRange?: string | null;
  dealTerms?: string | null;
  technicalRequirements?: string | null;
  hospitalityRequirements?: string | null;
  marketingCommitments?: string | null;
  contractSigned?: boolean;
  contractDate?: Date | null;
  contractUrl?: string | null;
  depositAmount?: number | null;
  depositDueDate?: Date | null;
  depositPaid?: boolean;
  balanceDueDate?: Date | null;
  balancePaid?: boolean;
  cancellationTerms?: string | null;
  forceMajeureTerms?: string | null;
  probability?: number;
  expectedCloseDate?: Date | null;
  pipelineStage?: string | null;
  lastActivityDate?: Date | null;
  nextFollowUpDate?: Date | null;
  tags?: string[];
  customFields?: Record<string, unknown>;
  assignedTo?: string | null;
}

// Campaign Types
export interface Campaign extends TimestampFields, TenantScoped, UserScoped {
  id: string;
  artistId?: string | null;
  name: string;
  description?: string | null;
  type: CampaignType;
  status: CampaignStatus;
  budget?: number | null;
  budgetCurrency?: CurrencyCode;
  startDate?: Date | null;
  endDate?: Date | null;
  targetAudience?: Record<string, unknown>;
  objectives?: string[];
  kpis?: Record<string, unknown>;
  platforms?: string[];
  creativeAssets?: FileUpload[];
  utmParameters?: Record<string, string>;
  trackingPixels?: Record<string, string>;
  results?: Record<string, unknown>;
  notes?: string | null;
  tags?: string[];
  assignedTo?: string | null;
}

// Invoice Types
export interface Invoice extends TimestampFields, TenantScoped, UserScoped {
  id: string;
  dealId?: string | null;
  contactId?: string | null;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  currency: CurrencyCode;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  paidAmount?: number;
  paymentTerms?: string | null;
  notes?: string | null;
  footerText?: string | null;
  billingAddress?: Address;
  shippingAddress?: Address;
  metadata?: Record<string, unknown>;
  stripeInvoiceId?: string | null;
  sentAt?: Date | null;
  paidAt?: Date | null;
  lineItems?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  metadata?: Record<string, unknown>;
}

// Analytics Types
export interface DashboardMetrics {
  totalRevenue: number;
  totalDeals: number;
  activeDeals: number;
  conversionRate: number;
  averageDealValue: number;
  revenueGrowth: number;
  dealsByStatus: Record<DealStatus, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  previousPeriodRevenue: number;
  growth: number;
  currency: CurrencyCode;
  breakdown: Array<{
    period: string;
    revenue: number;
    dealCount: number;
  }>;
}

// Webhook Types
export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
  tenantId: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  status?: string[];
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  assignedTo?: string[];
  [key: string]: unknown;
}

// User Preferences
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  currency?: CurrencyCode;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  notifications?: {
    email?: boolean;
    browser?: boolean;
    mobile?: boolean;
  };
  dashboard?: {
    layout?: string;
    widgets?: string[];
  };
}

// Tenant Settings
export interface TenantSettings {
  general?: {
    companyName?: string;
    logo?: string;
    timezone?: string;
    locale?: string;
    currency?: CurrencyCode;
  };
  billing?: {
    taxRate?: number;
    paymentTerms?: number;
    invoicePrefix?: string;
    invoiceNumbering?: 'sequential' | 'year-based';
  };
  notifications?: {
    emailSignature?: string;
    webhookEndpoints?: WebhookEndpoint[];
  };
  security?: {
    passwordPolicy?: {
      minLength?: number;
      requireUppercase?: boolean;
      requireNumbers?: boolean;
      requireSymbols?: boolean;
    };
    sessionTimeout?: number;
    allowedDomains?: string[];
    ipAllowlist?: string[];
  };
  integrations?: {
    stripe?: {
      publicKey?: string;
      webhookSecret?: string;
    };
    sendgrid?: {
      apiKey?: string;
      fromEmail?: string;
    };
    google?: {
      clientId?: string;
      calendarSync?: boolean;
    };
  };
}

export type * from './api';
export type * from './components';