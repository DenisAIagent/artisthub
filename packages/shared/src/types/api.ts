// =============================================================================
// API TYPES FOR CRESCENDOCRM
// =============================================================================

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// API Request/Response Types
export interface ApiRequest<T = unknown> {
  body?: T;
  query?: Record<string, string | string[] | undefined>;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: ValidationError[];
  stack?: string; // Only in development
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

// Pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface PaginatedApiResponse<T> extends ApiSuccessResponse<T[]> {
  pagination: PaginationInfo;
}

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantName?: string;
  tenantSlug?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

// Contact API Types
export interface CreateContactRequest {
  type: 'person' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  jobTitle?: string;
  tags?: string[];
  marketingConsent?: boolean;
  customFields?: Record<string, unknown>;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {}

export interface ContactsQuery extends PaginationQuery {
  search?: string;
  type?: 'person' | 'company';
  tags?: string[];
  hasEmail?: boolean;
  marketingConsent?: boolean;
}

// Artist API Types
export interface CreateArtistRequest {
  stageName: string;
  realName?: string;
  bio?: string;
  genres?: string[];
  originCountry?: string;
  website?: string;
  baseFee?: number;
  feeCurrency?: string;
  territories?: string[];
  socialLinks?: Record<string, string>;
  tags?: string[];
}

export interface UpdateArtistRequest extends Partial<CreateArtistRequest> {}

export interface ArtistsQuery extends PaginationQuery {
  search?: string;
  genres?: string[];
  territories?: string[];
  isActive?: boolean;
  hasUpcomingShows?: boolean;
}

// Deal API Types
export interface CreateDealRequest {
  title: string;
  artistId: string;
  venueId?: string;
  contactId?: string;
  status?: string;
  priority?: string;
  eventDate?: Date;
  guarantee?: number;
  currency?: string;
  probability?: number;
  assignedTo?: string;
}

export interface UpdateDealRequest extends Partial<CreateDealRequest> {}

export interface DealsQuery extends PaginationQuery {
  search?: string;
  status?: string[];
  artistId?: string;
  assignedTo?: string;
  eventDateFrom?: Date;
  eventDateTo?: Date;
  minGuarantee?: number;
  maxGuarantee?: number;
}

export interface DealActivityRequest {
  activityType: 'call' | 'email' | 'meeting' | 'note' | 'document' | 'status_change';
  title: string;
  description?: string;
  scheduledAt?: Date;
  metadata?: Record<string, unknown>;
}

// Campaign API Types
export interface CreateCampaignRequest {
  name: string;
  type: string;
  artistId?: string;
  budget?: number;
  budgetCurrency?: string;
  startDate?: Date;
  endDate?: Date;
  objectives?: string[];
  platforms?: string[];
  assignedTo?: string;
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {}

export interface CampaignsQuery extends PaginationQuery {
  search?: string;
  type?: string[];
  status?: string[];
  artistId?: string;
  assignedTo?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
}

// Invoice API Types
export interface CreateInvoiceRequest {
  contactId: string;
  dealId?: string;
  issueDate: Date;
  dueDate: Date;
  currency?: string;
  taxRate?: number;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {}

export interface InvoicesQuery extends PaginationQuery {
  search?: string;
  status?: string[];
  contactId?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  amountFrom?: number;
  amountTo?: number;
}

export interface SendInvoiceRequest {
  email?: string;
  message?: string;
}

// File Upload Types
export interface FileUploadRequest {
  entityType: string;
  entityId: string;
  associationType?: string;
  isPublic?: boolean;
  expiresAt?: Date;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  signedUrl?: string;
  expiresAt?: Date;
}

// Import/Export Types
export interface ImportRequest {
  file: File;
  mapping: Record<string, string>;
  skipDuplicates?: boolean;
  dryRun?: boolean;
}

export interface ImportResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  preview?: unknown[];
}

export interface ImportStatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total?: number;
  processed?: number;
  errors?: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  result?: {
    created: number;
    updated: number;
    skipped: number;
    failed: number;
  };
}

export interface ExportRequest {
  format: 'csv' | 'excel' | 'json';
  filters?: Record<string, unknown>;
  fields?: string[];
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: Date;
}

// Analytics API Types
export interface AnalyticsQuery {
  startDate: Date;
  endDate: Date;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics?: string[];
  filters?: Record<string, unknown>;
}

export interface AnalyticsResponse {
  period: {
    startDate: Date;
    endDate: Date;
  };
  data: Array<{
    date: string;
    metrics: Record<string, number>;
  }>;
  summary: Record<string, number>;
  comparison?: {
    period: string;
    change: Record<string, number>;
  };
}

// Webhook API Types
export interface CreateWebhookRequest {
  url: string;
  events: string[];
  secret?: string;
  isActive?: boolean;
}

export interface UpdateWebhookRequest extends Partial<CreateWebhookRequest> {}

export interface WebhookDelivery {
  id: string;
  eventType: string;
  status: 'pending' | 'delivered' | 'failed';
  statusCode?: number;
  attemptCount: number;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

// Search API Types
export interface SearchQuery {
  q: string;
  type?: ('contacts' | 'artists' | 'deals' | 'campaigns')[];
  limit?: number;
  filters?: Record<string, unknown>;
}

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  score: number;
  highlight?: Record<string, string[]>;
}

export interface SearchResponse {
  query: string;
  total: number;
  maxScore: number;
  results: SearchResult[];
  facets?: Record<string, Array<{ value: string; count: number }>>;
}

// Settings API Types
export interface UpdateTenantSettingsRequest {
  general?: {
    companyName?: string;
    timezone?: string;
    locale?: string;
    currency?: string;
  };
  billing?: {
    taxRate?: number;
    paymentTerms?: number;
    invoicePrefix?: string;
  };
  notifications?: {
    emailSignature?: string;
  };
  security?: {
    passwordPolicy?: {
      minLength?: number;
      requireUppercase?: boolean;
      requireNumbers?: boolean;
      requireSymbols?: boolean;
    };
    sessionTimeout?: number;
  };
}

export interface UpdateUserPreferencesRequest {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  notifications?: {
    email?: boolean;
    browser?: boolean;
    mobile?: boolean;
  };
}

// Integration API Types
export interface CreateIntegrationRequest {
  name: string;
  provider: string;
  type: 'oauth' | 'api_key' | 'webhook';
  configuration: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

export interface UpdateIntegrationRequest extends Partial<CreateIntegrationRequest> {}

export interface IntegrationSyncRequest {
  integrationId: string;
  syncType?: 'full' | 'incremental';
  options?: Record<string, unknown>;
}

// Audit Log Types
export interface AuditLogQuery extends PaginationQuery {
  action?: string[];
  entityType?: string;
  entityId?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: Date;
}

// Data Subject Request Types (GDPR)
export interface CreateDataSubjectRequestRequest {
  email: string;
  requestType: 'access' | 'portability' | 'rectification' | 'erasure' | 'restrict';
  description?: string;
}

export interface DataSubjectRequestResponse {
  id: string;
  email: string;
  requestType: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  description?: string;
  identityVerified: boolean;
  responseData?: Record<string, unknown>;
  createdAt: Date;
  completedAt?: Date;
}