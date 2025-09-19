import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole, PERMISSIONS, DEFAULT_PERMISSIONS } from '@/types/auth';
import { ResponseHelper, ERROR_CODES } from '@/types/api';
import JWTService from '@/utils/jwt';
import { securityLogger } from '@/utils/logger';
import { User, Artist, TeamMembership } from '@/models';

/**
 * JWT Authentication Middleware
 * Verifies the JWT token and attaches user to request
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.get('Authorization');
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      securityLogger.unauthorizedAccess(
        req.ip || 'unknown',
        req.originalUrl,
        req.method
      );
      return ResponseHelper.unauthorized(res, 'No authentication token provided');
    }

    const payload = JWTService.verifyAccessToken(token);
    if (!payload) {
      securityLogger.unauthorizedAccess(
        req.ip || 'unknown',
        req.originalUrl,
        req.method
      );
      return ResponseHelper.unauthorized(res, 'Invalid or expired token');
    }

    // Fetch user from database
    const user = await User.findByPk(payload.userId, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user || !user.isActive) {
      securityLogger.unauthorizedAccess(
        req.ip || 'unknown',
        req.originalUrl,
        req.method
      );
      return ResponseHelper.unauthorized(res, 'User not found or inactive');
    }

    if (!user.emailVerified) {
      return ResponseHelper.error(
        res,
        'Email not verified',
        401,
        ERROR_CODES.EMAIL_NOT_VERIFIED
      );
    }

    // Fetch user's team memberships
    const teamMemberships = await TeamMembership.findAll({
      where: {
        userId: user.id,
        isActive: true,
      },
      include: [
        {
          model: Artist,
          attributes: ['id', 'stageName'],
        },
      ],
    });

    // Attach user and memberships to request
    req.user = user.toJSON();
    req.teamMemberships = teamMemberships.map(tm => tm.toJSON());

    // Add permission checking helper
    req.hasPermission = (permission: string, artistId?: string) => {
      return checkUserPermission(req.teamMemberships!, permission, artistId);
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return ResponseHelper.error(res, 'Authentication failed', 500);
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user to request if token is provided and valid, but doesn't fail if not
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.get('Authorization');
  const token = JWTService.extractTokenFromHeader(authHeader);

  if (token) {
    // If token is provided, try to authenticate
    return authenticate(req, res, next);
  }

  // No token provided, continue without authentication
  next();
};

/**
 * Role-based Authorization Middleware
 */
export const requireRole = (roles: UserRole[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user || !req.teamMemberships) {
      return ResponseHelper.unauthorized(res, 'Authentication required');
    }

    const artistId = req.params.artistId || req.currentArtistId;
    if (!artistId) {
      return ResponseHelper.error(res, 'Artist context required', 400);
    }

    const membership = req.teamMemberships.find(
      tm => tm.artistId === artistId && roles.includes(tm.role as UserRole)
    );

    if (!membership) {
      securityLogger.unauthorizedAccess(
        req.ip || 'unknown',
        req.originalUrl,
        req.method
      );
      return ResponseHelper.forbidden(res, 'Insufficient role permissions');
    }

    req.currentArtistId = artistId;
    next();
  };
};

/**
 * Permission-based Authorization Middleware
 */
export const requirePermission = (permission: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user || !req.teamMemberships || !req.hasPermission) {
      return ResponseHelper.unauthorized(res, 'Authentication required');
    }

    const artistId = req.params.artistId || req.currentArtistId;

    if (!req.hasPermission(permission, artistId)) {
      securityLogger.unauthorizedAccess(
        req.ip || 'unknown',
        req.originalUrl,
        req.method
      );
      return ResponseHelper.forbidden(res, 'Insufficient permissions');
    }

    if (artistId) {
      req.currentArtistId = artistId;
    }

    next();
  };
};

/**
 * Artist Owner Authorization Middleware
 * Ensures user is the owner of the artist or has admin role
 */
export const requireArtistOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || !req.teamMemberships) {
    return ResponseHelper.unauthorized(res, 'Authentication required');
  }

  const artistId = req.params.artistId;
  if (!artistId) {
    return ResponseHelper.error(res, 'Artist ID required', 400);
  }

  // Check if user is the artist owner
  const ownerMembership = req.teamMemberships.find(
    tm => tm.artistId === artistId && tm.role === UserRole.ARTIST
  );

  // Or if user has admin role
  const adminMembership = req.teamMemberships.find(
    tm => tm.artistId === artistId && tm.role === UserRole.ADMIN
  );

  if (!ownerMembership && !adminMembership) {
    securityLogger.unauthorizedAccess(
      req.ip || 'unknown',
      req.originalUrl,
      req.method
    );
    return ResponseHelper.forbidden(res, 'Only artist owner or admin can perform this action');
  }

  req.currentArtistId = artistId;
  next();
};

/**
 * Team Access Authorization Middleware
 * Ensures user has any valid team membership for the artist
 */
export const requireTeamAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || !req.teamMemberships) {
    return ResponseHelper.unauthorized(res, 'Authentication required');
  }

  const artistId = req.params.artistId;
  if (!artistId) {
    return ResponseHelper.error(res, 'Artist ID required', 400);
  }

  const membership = req.teamMemberships.find(
    tm => tm.artistId === artistId && tm.isActive
  );

  if (!membership) {
    securityLogger.unauthorizedAccess(
      req.ip || 'unknown',
      req.originalUrl,
      req.method
    );
    return ResponseHelper.forbidden(res, 'Team access required');
  }

  req.currentArtistId = artistId;
  next();
};

/**
 * Self or Admin Authorization Middleware
 * Allows access if user is accessing their own data or has admin permissions
 */
export const requireSelfOrAdmin = (userIdParam: string = 'userId') => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, 'Authentication required');
    }

    const targetUserId = req.params[userIdParam];
    const isAccessingSelf = req.user.id === targetUserId;
    const hasAdminRole = req.teamMemberships?.some(
      tm => tm.role === UserRole.ADMIN
    );

    if (!isAccessingSelf && !hasAdminRole) {
      securityLogger.unauthorizedAccess(
        req.ip || 'unknown',
        req.originalUrl,
        req.method
      );
      return ResponseHelper.forbidden(res, 'Can only access own data or admin required');
    }

    next();
  };
};

/**
 * Helper function to check user permissions
 */
function checkUserPermission(
  teamMemberships: any[],
  permission: string,
  artistId?: string
): boolean {
  // If no artist context and permission doesn't require it, check global permissions
  if (!artistId) {
    return teamMemberships.some(tm => {
      const rolePermissions = DEFAULT_PERMISSIONS[tm.role as UserRole] || [];
      const customPermissions = Object.keys(tm.permissions || {});

      return rolePermissions.includes(permission) ||
             customPermissions.includes(permission) ||
             rolePermissions.includes(PERMISSIONS.ADMIN_ALL);
    });
  }

  // Check permissions for specific artist
  const membership = teamMemberships.find(tm => tm.artistId === artistId);
  if (!membership) {
    return false;
  }

  const rolePermissions = DEFAULT_PERMISSIONS[membership.role as UserRole] || [];
  const customPermissions = Object.keys(membership.permissions || {});

  return rolePermissions.includes(permission) ||
         customPermissions.includes(permission) ||
         rolePermissions.includes(PERMISSIONS.ADMIN_ALL);
}

/**
 * Refresh Token Middleware
 * Validates refresh token for token refresh endpoints
 */
export const validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return ResponseHelper.error(res, 'Refresh token required', 400);
    }

    const payload = JWTService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return ResponseHelper.unauthorized(res, 'Invalid or expired refresh token');
    }

    // Check if user still exists and is active
    const user = await User.findByPk(payload.userId);
    if (!user || !user.isActive) {
      return ResponseHelper.unauthorized(res, 'User not found or inactive');
    }

    // Attach payload to request for use in controller
    (req as any).refreshTokenPayload = payload;
    next();
  } catch (error) {
    console.error('Refresh token validation error:', error);
    return ResponseHelper.error(res, 'Token validation failed', 500);
  }
};

export default {
  authenticate,
  optionalAuth,
  requireRole,
  requirePermission,
  requireArtistOwner,
  requireTeamAccess,
  requireSelfOrAdmin,
  validateRefreshToken,
};