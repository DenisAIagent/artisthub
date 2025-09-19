# ARTISTHUB CRM AUTHENTICATION & AUTHORIZATION ARCHITECTURE

## AUTHENTICATION FLOW OVERVIEW

The authentication system implements a **JWT-based approach** with **role-based access control (RBAC)** and **fine-grained permissions**:

- **JWT tokens** for stateless authentication
- **Refresh token rotation** for enhanced security
- **Multi-tenant architecture** (artist-scoped access)
- **Role-based permissions** with granular controls
- **Session management** with concurrent session limits

---

## AUTHENTICATION FLOW DIAGRAM

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Client    │    │  API Gateway │    │ Auth Service│    │  Database    │
│ (Frontend)  │    │              │    │             │    │              │
└─────┬───────┘    └──────┬───────┘    └─────┬───────┘    └──────┬───────┘
      │                   │                  │                   │
      │ 1. Login Request  │                  │                   │
      ├──────────────────►│                  │                   │
      │                   │ 2. Validate &    │                   │
      │                   │    Forward       │                   │
      │                   ├─────────────────►│                   │
      │                   │                  │ 3. Verify User    │
      │                   │                  ├──────────────────►│
      │                   │                  │ 4. User Data      │
      │                   │                  │◄──────────────────┤
      │                   │ 5. JWT + Refresh │                   │
      │                   │◄─────────────────┤                   │
      │ 6. Auth Response  │                  │                   │
      │◄──────────────────┤                  │                   │
      │                   │                  │                   │
      │ 7. API Request    │                  │                   │
      │   + JWT Token     │                  │                   │
      ├──────────────────►│ 8. Verify JWT    │                   │
      │                   ├─────────────────►│                   │
      │                   │ 9. User Context  │                   │
      │                   │◄─────────────────┤                   │
      │ 10. Response      │                  │                   │
      │◄──────────────────┤                  │                   │
```

---

## JWT TOKEN STRUCTURE

### Access Token Payload
```json
{
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "role": "marketing_manager",
  "artists": [
    {
      "id": "artist-uuid-1",
      "role": "marketing_manager",
      "permissions": ["view_campaigns", "create_campaigns", "edit_campaigns"]
    }
  ],
  "permissions": [
    "view_campaigns",
    "create_campaigns",
    "edit_campaigns",
    "view_social_stats"
  ],
  "iat": 1642780800,
  "exp": 1642784400,
  "iss": "artisthub-api",
  "aud": "artisthub-client"
}
```

### Refresh Token Payload
```json
{
  "sub": "user-uuid-here",
  "type": "refresh",
  "jti": "refresh-token-id",
  "iat": 1642780800,
  "exp": 1645372800
}
```

---

## ROLE-BASED ACCESS CONTROL (RBAC)

### User Roles Hierarchy

```typescript
enum UserRole {
  ARTIST = 'artist',
  MARKETING_MANAGER = 'marketing_manager',
  TOUR_MANAGER = 'tour_manager',
  ALBUM_MANAGER = 'album_manager',
  FINANCIAL_MANAGER = 'financial_manager',
  PRESS_OFFICER = 'press_officer',
  ADMIN = 'admin'
}

// Role hierarchy (higher roles inherit lower role permissions)
const ROLE_HIERARCHY = {
  admin: ['all_permissions'],
  artist: ['view_own_data', 'edit_own_profile'],
  marketing_manager: ['view_marketing', 'create_campaigns', 'edit_campaigns'],
  tour_manager: ['view_tours', 'create_tours', 'edit_tours', 'manage_logistics'],
  album_manager: ['view_albums', 'create_albums', 'edit_albums', 'manage_production'],
  financial_manager: ['view_financials', 'create_transactions', 'approve_expenses'],
  press_officer: ['view_press', 'create_campaigns', 'manage_interviews']
};
```

### Permission Matrix

| Permission | Artist | Marketing | Tour | Album | Financial | Press | Admin |
|------------|--------|-----------|------|-------|-----------|-------|-------|
| view_own_data | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| edit_own_profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| view_marketing | ✓ | ✓ | - | - | - | ✓ | ✓ |
| create_marketing_campaigns | - | ✓ | - | - | - | - | ✓ |
| edit_marketing_campaigns | - | ✓ | - | - | - | - | ✓ |
| view_tours | ✓ | - | ✓ | - | - | - | ✓ |
| create_tours | - | - | ✓ | - | - | - | ✓ |
| manage_tour_logistics | - | - | ✓ | - | - | - | ✓ |
| view_albums | ✓ | ✓ | - | ✓ | - | ✓ | ✓ |
| create_albums | - | - | - | ✓ | - | - | ✓ |
| manage_production | - | - | - | ✓ | - | - | ✓ |
| view_financials | ✓ | - | - | - | ✓ | - | ✓ |
| create_transactions | - | - | - | - | ✓ | - | ✓ |
| approve_expenses | - | - | - | - | ✓ | - | ✓ |
| view_press | ✓ | ✓ | - | - | - | ✓ | ✓ |
| create_press_campaigns | - | - | - | - | - | ✓ | ✓ |
| manage_interviews | - | - | - | - | - | ✓ | ✓ |
| manage_team | - | - | - | - | - | - | ✓ |
| view_all_artists | - | - | - | - | - | - | ✓ |

---

## BACKEND AUTHENTICATION IMPLEMENTATION

### Authentication Middleware
```typescript
// middleware/auth.ts
interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  artists: ArtistAccess[];
  permissions: string[];
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'MISSING_TOKEN', message: 'Access token required' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // Verify token is not blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_REVOKED', message: 'Token has been revoked' }
      });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      artists: decoded.artists,
      permissions: decoded.permissions
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Access token expired' }
      });
    }

    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid access token' }
    });
  }
};
```

### Authorization Middleware
```typescript
// middleware/authorization.ts
export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    if (req.user.role === 'admin') {
      return next(); // Admins have all permissions
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Permission required: ${permission}`
        }
      });
    }

    next();
  };
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_ROLE',
          message: `Role required: ${roles.join(' or ')}`
        }
      });
    }

    next();
  };
};

export const requireArtistAccess = (artistIdParam: string = 'artistId') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const artistId = req.params[artistIdParam];

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    // Admin can access all artists
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user has access to this specific artist
    const hasAccess = req.user.artists.some(artist => artist.id === artistId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ARTIST_ACCESS_DENIED',
          message: 'Access denied for this artist'
        }
      });
    }

    next();
  };
};
```

---

## AUTHENTICATION SERVICE

```typescript
// services/AuthService.ts
class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    // 1. Validate user credentials
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      throw new AuthenticationError('Invalid credentials');
    }

    // 2. Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Account is disabled');
    }

    // 3. Get user's team memberships and permissions
    const memberships = await TeamMembership.findAll({
      where: { userId: user.id, isActive: true },
      include: [Artist]
    });

    // 4. Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user, memberships);

    // 5. Store refresh token
    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // 6. Update last login
    await user.update({ lastLogin: new Date() });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      expiresIn: 3600 // 1 hour
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // 1. Verify refresh token
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [User]
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // 2. Generate new tokens
    const memberships = await TeamMembership.findAll({
      where: { userId: tokenRecord.userId, isActive: true },
      include: [Artist]
    });

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(tokenRecord.user, memberships);

    // 3. Rotate refresh token
    await tokenRecord.update({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    return {
      user: this.sanitizeUser(tokenRecord.user),
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600
    };
  }

  async logout(refreshToken: string, accessToken: string): Promise<void> {
    // 1. Remove refresh token
    await RefreshToken.destroy({ where: { token: refreshToken } });

    // 2. Blacklist access token
    const decoded = jwt.decode(accessToken) as JWTPayload;
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      await redis.setex(`blacklist:${accessToken}`, ttl, 'true');
    }
  }

  private async generateTokens(user: User, memberships: TeamMembership[]) {
    const artists = memberships.map(m => ({
      id: m.artistId,
      role: m.role,
      permissions: this.getPermissionsForRole(m.role)
    }));

    const allPermissions = new Set<string>();
    artists.forEach(artist => {
      artist.permissions.forEach(permission => allPermissions.add(permission));
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      artists,
      permissions: Array.from(allPermissions)
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
      issuer: 'artisthub-api',
      audience: 'artisthub-client'
    });

    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh', jti: uuidv4() },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }
}
```

---

## FRONTEND AUTHENTICATION IMPLEMENTATION

### Auth Context & Hooks
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  hasArtistAccess: (artistId: string) => boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));

  const isAuthenticated = !!user && !!token;

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);

      setUser(response.user);
      setToken(response.accessToken);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set up automatic token refresh
      setupTokenRefresh(response.expiresIn);

    } catch (error) {
      throw new AuthenticationError('Login failed');
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && token) {
        await authAPI.logout(refreshToken, token);
      }
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role || user?.role === 'admin';
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || user?.role === 'admin';
  };

  const hasArtistAccess = (artistId: string): boolean => {
    return user?.artists?.some(artist => artist.id === artistId) || user?.role === 'admin';
  };

  // Auto-refresh token setup
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeToExpiry = decoded.exp - currentTime;

      if (timeToExpiry > 300) { // If more than 5 minutes left
        setupTokenRefresh(timeToExpiry - 300); // Refresh 5 minutes before expiry
      } else {
        refreshAccessToken(); // Refresh immediately
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasRole,
      hasPermission,
      hasArtistAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## SECURITY CONSIDERATIONS

### 1. Token Security
- **Short-lived access tokens** (1 hour) to minimize exposure
- **Refresh token rotation** to prevent replay attacks
- **Token blacklisting** for immediate revocation
- **Secure storage** using httpOnly cookies for refresh tokens

### 2. Password Security
- **bcrypt hashing** with salt rounds ≥ 12
- **Password complexity requirements** (minimum 8 characters, mixed case, numbers, symbols)
- **Rate limiting** on login attempts (5 attempts per 15 minutes)
- **Account lockout** after multiple failed attempts

### 3. Session Management
- **Concurrent session limits** (max 3 active sessions per user)
- **Session timeout** after 24 hours of inactivity
- **Device tracking** and suspicious activity detection

### 4. API Security
- **Rate limiting** by user and IP address
- **CORS configuration** for allowed origins
- **Request validation** and sanitization
- **SQL injection prevention** through parameterized queries

### 5. Audit Logging
- **Authentication events** (login, logout, failed attempts)
- **Authorization failures** and permission violations
- **Sensitive data access** (financial records, personal information)
- **Administrative actions** (role changes, user management)