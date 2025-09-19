import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper, ValidationError } from '@/types/api';

// Common validation schemas
export const commonSchemas = {
  uuid: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')
  ).required().messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  url: Joi.string().uri().optional(),
  date: Joi.date().iso().optional(),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid('ASC', 'DESC').default('ASC'),
    search: Joi.string().optional(),
  },
  dateRange: {
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    period: Joi.string().valid('7d', '30d', '90d', '1y').optional(),
  },
};

// Auth validation schemas
export const authSchemas = {
  register: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: commonSchemas.phone,
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: commonSchemas.email,
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: commonSchemas.password,
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password,
  }),
};

// User validation schemas
export const userSchemas = {
  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: commonSchemas.phone,
    profileImageUrl: commonSchemas.url,
  }),
};

// Artist validation schemas
export const artistSchemas = {
  create: Joi.object({
    stageName: Joi.string().min(2).max(255).required(),
    legalName: Joi.string().min(2).max(255).optional(),
    genre: Joi.string().max(100).optional(),
    bio: Joi.string().max(5000).optional(),
    websiteUrl: commonSchemas.url,
    spotifyId: Joi.string().max(100).optional(),
    appleMusicId: Joi.string().max(100).optional(),
    instagramHandle: Joi.string().max(100).optional(),
    twitterHandle: Joi.string().max(100).optional(),
  }),

  update: Joi.object({
    stageName: Joi.string().min(2).max(255).optional(),
    legalName: Joi.string().min(2).max(255).optional(),
    genre: Joi.string().max(100).optional(),
    bio: Joi.string().max(5000).optional(),
    websiteUrl: commonSchemas.url,
    spotifyId: Joi.string().max(100).optional(),
    appleMusicId: Joi.string().max(100).optional(),
    instagramHandle: Joi.string().max(100).optional(),
    twitterHandle: Joi.string().max(100).optional(),
  }),
};

// Team validation schemas
export const teamSchemas = {
  invite: Joi.object({
    email: commonSchemas.email,
    role: Joi.string().valid(
      'marketing_manager',
      'tour_manager',
      'album_manager',
      'financial_manager',
      'press_officer'
    ).required(),
    permissions: Joi.object().optional(),
  }),

  updateRole: Joi.object({
    role: Joi.string().valid(
      'marketing_manager',
      'tour_manager',
      'album_manager',
      'financial_manager',
      'press_officer'
    ).required(),
    permissions: Joi.object().optional(),
  }),
};

// Marketing validation schemas
export const marketingSchemas = {
  createCampaign: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(5000).optional(),
    campaignType: Joi.string().valid('album_launch', 'tour_promotion', 'brand_partnership').optional(),
    budget: Joi.number().precision(2).min(0).optional(),
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    targetAudience: Joi.object().optional(),
    platforms: Joi.array().items(Joi.string()).optional(),
    kpis: Joi.object().optional(),
  }),

  updateCampaign: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    description: Joi.string().max(5000).optional(),
    campaignType: Joi.string().valid('album_launch', 'tour_promotion', 'brand_partnership').optional(),
    status: Joi.string().valid('planning', 'active', 'paused', 'completed').optional(),
    budget: Joi.number().precision(2).min(0).optional(),
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    targetAudience: Joi.object().optional(),
    platforms: Joi.array().items(Joi.string()).optional(),
    kpis: Joi.object().optional(),
  }),

  socialStats: Joi.object({
    platform: Joi.string().valid('instagram', 'twitter', 'tiktok', 'youtube', 'facebook').required(),
    metricType: Joi.string().valid('followers', 'engagement_rate', 'reach', 'impressions').required(),
    value: Joi.number().min(0).required(),
    recordedDate: commonSchemas.date.default(() => new Date(), 'current date'),
    campaignId: commonSchemas.uuid.optional(),
  }),
};

// Tour validation schemas
export const tourSchemas = {
  createTour: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(5000).optional(),
    tourType: Joi.string().valid('headlining', 'supporting', 'festival').optional(),
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    totalBudget: Joi.number().precision(2).min(0).optional(),
  }),

  updateTour: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    description: Joi.string().max(5000).optional(),
    tourType: Joi.string().valid('headlining', 'supporting', 'festival').optional(),
    status: Joi.string().valid('planning', 'announced', 'on_sale', 'active', 'completed').optional(),
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    totalBudget: Joi.number().precision(2).min(0).optional(),
  }),

  createTourDate: Joi.object({
    venueId: commonSchemas.uuid.required(),
    date: commonSchemas.date.required(),
    doorsTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    showTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    ticketPriceMin: Joi.number().precision(2).min(0).optional(),
    ticketPriceMax: Joi.number().precision(2).min(0).optional(),
    capacity: Joi.number().integer().min(1).optional(),
  }),
};

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[source];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const validationErrors: ValidationError[] = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }));

      return ResponseHelper.validation(res, validationErrors);
    }

    // Replace validated data
    req[source] = value;
    next();
  };
};

// UUID parameter validation middleware
export const validateUuidParam = (paramName: string) => {
  return validate(
    Joi.object({
      [paramName]: commonSchemas.uuid,
    }),
    'params'
  );
};

// Query validation for pagination and common filters
export const validateQuery = (additionalSchema?: Joi.ObjectSchema) => {
  const baseSchema = Joi.object({
    ...commonSchemas.pagination,
    ...commonSchemas.dateRange,
    include: Joi.array().items(Joi.string()).optional(),
    filter: Joi.string().optional(), // JSON string that will be parsed
  });

  const schema = additionalSchema ? baseSchema.concat(additionalSchema) : baseSchema;

  return validate(schema, 'query');
};

// Custom validation helpers
export const customValidators = {
  isAfterDate: (startDateField: string) => {
    return Joi.date().greater(Joi.ref(startDateField)).messages({
      'date.greater': `End date must be after ${startDateField}`,
    });
  },

  isValidEnum: (enumObject: any, errorMessage?: string) => {
    const validValues = Object.values(enumObject);
    return Joi.string().valid(...validValues).messages({
      'any.only': errorMessage || `Value must be one of: ${validValues.join(', ')}`,
    });
  },

  isPositiveNumber: (precision: number = 2) => {
    return Joi.number().precision(precision).min(0).messages({
      'number.min': 'Value must be a positive number',
    });
  },

  isValidJson: () => {
    return Joi.string().custom((value, helpers) => {
      try {
        JSON.parse(value);
        return value;
      } catch (error) {
        return helpers.error('string.invalidJson');
      }
    }).messages({
      'string.invalidJson': 'Must be a valid JSON string',
    });
  },
};

export default {
  commonSchemas,
  authSchemas,
  userSchemas,
  artistSchemas,
  teamSchemas,
  marketingSchemas,
  tourSchemas,
  validate,
  validateUuidParam,
  validateQuery,
  customValidators,
};