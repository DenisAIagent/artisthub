import { Request, Response } from 'express';

// Standard API Response Format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message: string;
  meta: {
    timestamp: string;
    version: string;
    pagination?: PaginationMeta;
  };
}

// Error Response Format
export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
  stack?: string; // Only in development
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Pagination Metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Pagination Query Parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
  filter?: Record<string, any>;
}

// Date Range Query Parameters
export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
  period?: '7d' | '30d' | '90d' | '1y';
}

// Common Query Parameters
export interface BaseQuery extends PaginationQuery, DateRangeQuery {
  include?: string[];
}

// Generic Controller Interface
export interface Controller {
  [key: string]: (req: Request, res: Response) => Promise<void>;
}

// Service Response Interface
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// File Upload Interface
export interface FileUploadResponse {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

// Bulk Operation Response
export interface BulkOperationResponse {
  total: number;
  success: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

// Error Codes
export const ERROR_CODES = {
  // Authentication Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',

  // Resource Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',

  // Permission Errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  TEAM_ACCESS_DENIED: 'TEAM_ACCESS_DENIED',

  // Business Logic Errors
  INVALID_OPERATION: 'INVALID_OPERATION',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',

  // System Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // File Upload Errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

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
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Response Helper Functions
export class ResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operation completed successfully',
    statusCode: number = HTTP_STATUS.OK,
    pagination?: PaginationMeta
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
        pagination,
      },
    };

    res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string | ApiError,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code?: ErrorCode
  ): void {
    const apiError: ApiError = typeof error === 'string'
      ? { code: code || ERROR_CODES.INTERNAL_SERVER_ERROR, message: error }
      : error;

    const response: ApiResponse = {
      success: false,
      error: apiError,
      message: apiError.message,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    };

    res.status(statusCode).json(response);
  }

  static validation(
    res: Response,
    details: ValidationError[],
    message: string = 'Validation failed'
  ): void {
    const error: ApiError = {
      code: ERROR_CODES.VALIDATION_ERROR,
      message,
      details,
    };

    ResponseHelper.error(res, error, HTTP_STATUS.VALIDATION_ERROR);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): void {
    const error: ApiError = {
      code: ERROR_CODES.UNAUTHORIZED,
      message,
    };

    ResponseHelper.error(res, error, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(
    res: Response,
    message: string = 'Insufficient permissions'
  ): void {
    const error: ApiError = {
      code: ERROR_CODES.FORBIDDEN,
      message,
    };

    ResponseHelper.error(res, error, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): void {
    const error: ApiError = {
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message,
    };

    ResponseHelper.error(res, error, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(
    res: Response,
    message: string = 'Resource conflict'
  ): void {
    const error: ApiError = {
      code: ERROR_CODES.RESOURCE_CONFLICT,
      message,
    };

    ResponseHelper.error(res, error, HTTP_STATUS.CONFLICT);
  }
}