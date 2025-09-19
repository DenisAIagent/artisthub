import { Request } from 'express';

export enum UserRole {
  ARTIST = 'artist',
  MARKETING_MANAGER = 'marketing_manager',
  TOUR_MANAGER = 'tour_manager',
  ALBUM_MANAGER = 'album_manager',
  FINANCIAL_MANAGER = 'financial_manager',
  PRESS_OFFICER = 'press_officer',
  ADMIN = 'admin',
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  iss: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat: number;
  exp: number;
  iss: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMembership {
  id: string;
  userId: string;
  artistId: string;
  role: UserRole;
  permissions: Record<string, any>;
  isActive: boolean;
  invitedBy?: string;
  invitedAt: Date;
  joinedAt?: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  teamMemberships?: TeamMembership[];
  currentArtistId?: string;
  hasPermission?: (permission: string, artistId?: string) => boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthenticatedUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  message: string;
}

export interface PermissionMatrix {
  [UserRole.ARTIST]: string[];
  [UserRole.MARKETING_MANAGER]: string[];
  [UserRole.TOUR_MANAGER]: string[];
  [UserRole.ALBUM_MANAGER]: string[];
  [UserRole.FINANCIAL_MANAGER]: string[];
  [UserRole.PRESS_OFFICER]: string[];
  [UserRole.ADMIN]: string[];
}

// Permission constants
export const PERMISSIONS = {
  // Artist permissions
  ARTIST_VIEW: 'artist:view',
  ARTIST_EDIT: 'artist:edit',
  ARTIST_DELETE: 'artist:delete',

  // Marketing permissions
  MARKETING_VIEW: 'marketing:view',
  MARKETING_CREATE: 'marketing:create',
  MARKETING_EDIT: 'marketing:edit',
  MARKETING_DELETE: 'marketing:delete',

  // Tour permissions
  TOUR_VIEW: 'tour:view',
  TOUR_CREATE: 'tour:create',
  TOUR_EDIT: 'tour:edit',
  TOUR_DELETE: 'tour:delete',

  // Album permissions
  ALBUM_VIEW: 'album:view',
  ALBUM_CREATE: 'album:create',
  ALBUM_EDIT: 'album:edit',
  ALBUM_DELETE: 'album:delete',

  // Financial permissions
  FINANCIAL_VIEW: 'financial:view',
  FINANCIAL_CREATE: 'financial:create',
  FINANCIAL_EDIT: 'financial:edit',
  FINANCIAL_DELETE: 'financial:delete',
  FINANCIAL_APPROVE: 'financial:approve',

  // Press permissions
  PRESS_VIEW: 'press:view',
  PRESS_CREATE: 'press:create',
  PRESS_EDIT: 'press:edit',
  PRESS_DELETE: 'press:delete',

  // Team permissions
  TEAM_VIEW: 'team:view',
  TEAM_INVITE: 'team:invite',
  TEAM_EDIT_ROLES: 'team:edit_roles',
  TEAM_REMOVE_MEMBERS: 'team:remove_members',

  // Admin permissions
  ADMIN_ALL: 'admin:all',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Default permission matrix
export const DEFAULT_PERMISSIONS: PermissionMatrix = {
  [UserRole.ARTIST]: [
    PERMISSIONS.ARTIST_VIEW,
    PERMISSIONS.ARTIST_EDIT,
    PERMISSIONS.MARKETING_VIEW,
    PERMISSIONS.TOUR_VIEW,
    PERMISSIONS.ALBUM_VIEW,
    PERMISSIONS.FINANCIAL_VIEW,
    PERMISSIONS.PRESS_VIEW,
    PERMISSIONS.TEAM_VIEW,
    PERMISSIONS.TEAM_INVITE,
    PERMISSIONS.TEAM_EDIT_ROLES,
    PERMISSIONS.TEAM_REMOVE_MEMBERS,
  ],
  [UserRole.MARKETING_MANAGER]: [
    PERMISSIONS.ARTIST_VIEW,
    PERMISSIONS.MARKETING_VIEW,
    PERMISSIONS.MARKETING_CREATE,
    PERMISSIONS.MARKETING_EDIT,
    PERMISSIONS.MARKETING_DELETE,
    PERMISSIONS.PRESS_VIEW,
    PERMISSIONS.TEAM_VIEW,
  ],
  [UserRole.TOUR_MANAGER]: [
    PERMISSIONS.ARTIST_VIEW,
    PERMISSIONS.TOUR_VIEW,
    PERMISSIONS.TOUR_CREATE,
    PERMISSIONS.TOUR_EDIT,
    PERMISSIONS.TOUR_DELETE,
    PERMISSIONS.FINANCIAL_VIEW,
    PERMISSIONS.TEAM_VIEW,
  ],
  [UserRole.ALBUM_MANAGER]: [
    PERMISSIONS.ARTIST_VIEW,
    PERMISSIONS.ALBUM_VIEW,
    PERMISSIONS.ALBUM_CREATE,
    PERMISSIONS.ALBUM_EDIT,
    PERMISSIONS.ALBUM_DELETE,
    PERMISSIONS.FINANCIAL_VIEW,
    PERMISSIONS.TEAM_VIEW,
  ],
  [UserRole.FINANCIAL_MANAGER]: [
    PERMISSIONS.ARTIST_VIEW,
    PERMISSIONS.FINANCIAL_VIEW,
    PERMISSIONS.FINANCIAL_CREATE,
    PERMISSIONS.FINANCIAL_EDIT,
    PERMISSIONS.FINANCIAL_DELETE,
    PERMISSIONS.FINANCIAL_APPROVE,
    PERMISSIONS.TEAM_VIEW,
  ],
  [UserRole.PRESS_OFFICER]: [
    PERMISSIONS.ARTIST_VIEW,
    PERMISSIONS.PRESS_VIEW,
    PERMISSIONS.PRESS_CREATE,
    PERMISSIONS.PRESS_EDIT,
    PERMISSIONS.PRESS_DELETE,
    PERMISSIONS.MARKETING_VIEW,
    PERMISSIONS.TEAM_VIEW,
  ],
  [UserRole.ADMIN]: [
    PERMISSIONS.ADMIN_ALL,
  ],
};