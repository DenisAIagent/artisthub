# ARTISTHUB CRM IMPLEMENTATION GUIDELINES

## PROJECT SETUP & DEVELOPMENT WORKFLOW

### 1. INITIAL PROJECT STRUCTURE

```bash
artisthub-crm/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Route handlers by domain
│   │   ├── services/          # Business logic layer
│   │   ├── models/            # Database models (Sequelize)
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration files
│   │   ├── routes/            # Route definitions
│   │   └── types/             # TypeScript type definitions
│   ├── tests/                 # Backend tests
│   ├── migrations/            # Database migrations
│   ├── seeders/              # Database seed data
│   ├── docs/                 # API documentation
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── features/         # Feature-based modules
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   └── constants/        # Application constants
│   ├── public/               # Static assets
│   ├── tests/                # Frontend tests
│   └── package.json
├── shared/                   # Shared types and utilities
├── docker-compose.yml        # Local development setup
├── README.md
└── .github/                  # CI/CD workflows
```

### 2. NAMING CONVENTIONS

#### Database Tables
- Use lowercase with underscores: `marketing_campaigns`, `tour_dates`
- Primary keys: Always `id` (UUID)
- Foreign keys: `table_name_id` (e.g., `artist_id`, `campaign_id`)
- Timestamps: `created_at`, `updated_at`

#### API Endpoints
- RESTful conventions: `GET /api/artists/:artistId/tours`
- Use kebab-case for multi-word resources: `tour-dates`, `social-stats`
- Version all APIs: `/api/v1/...`

#### Frontend Components
- PascalCase for components: `ArtistDashboard`, `CampaignForm`
- camelCase for functions and variables: `handleSubmit`, `campaignData`
- UPPER_SNAKE_CASE for constants: `API_ENDPOINTS`, `USER_ROLES`

#### TypeScript Interfaces
- PascalCase with descriptive names: `User`, `MarketingCampaign`, `TourDate`
- Props interfaces: `ComponentNameProps`
- API response types: `GetCampaignsResponse`, `CreateTourRequest`

---

## BACKEND DEVELOPMENT GUIDELINES

### 1. PROJECT INITIALIZATION

```bash
# Initialize backend project
mkdir backend && cd backend
npm init -y
npm install express typescript ts-node @types/node @types/express
npm install sequelize pg pg-hstore @types/pg
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
npm install helmet cors express-rate-limit
npm install redis ioredis @types/ioredis
npm install winston morgan
npm install joi express-validator
npm install socket.io @types/socket.io

# Development dependencies
npm install -D nodemon jest supertest @types/jest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

### 2. ENVIRONMENT CONFIGURATION

```typescript
// config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'artisthub_dev',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// config/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
});
```

### 3. MODEL DEFINITIONS

```typescript
// models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public profileImageUrl?: string;
  public isActive!: boolean;
  public emailVerified!: boolean;
  public lastLogin?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: DataTypes.STRING(20),
    profileImageUrl: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLogin: DataTypes.DATE,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);

export { User, UserAttributes, UserCreationAttributes };
```

### 4. SERVICE LAYER IMPLEMENTATION

```typescript
// services/ArtistService.ts
import { Artist, ArtistCreationAttributes } from '../models/Artist';
import { TeamMembership } from '../models/TeamMembership';
import { UserRole } from '../types/auth';

export class ArtistService {
  async getArtistsByUser(userId: string, userRole: UserRole): Promise<Artist[]> {
    if (userRole === 'admin') {
      return Artist.findAll();
    }

    const memberships = await TeamMembership.findAll({
      where: { userId, isActive: true },
      include: [Artist]
    });

    return memberships.map(m => m.artist);
  }

  async createArtist(artistData: ArtistCreationAttributes, createdBy: string): Promise<Artist> {
    const artist = await Artist.create(artistData);

    // Create team membership for the creator
    await TeamMembership.create({
      userId: createdBy,
      artistId: artist.id,
      role: 'admin',
      isActive: true,
      joinedAt: new Date()
    });

    return artist;
  }

  async updateArtist(
    artistId: string,
    updates: Partial<ArtistCreationAttributes>,
    userId: string
  ): Promise<Artist> {
    // Verify user has permission to update this artist
    await this.verifyArtistAccess(artistId, userId, 'edit');

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    return artist.update(updates);
  }

  private async verifyArtistAccess(
    artistId: string,
    userId: string,
    action: string
  ): Promise<boolean> {
    const membership = await TeamMembership.findOne({
      where: { artistId, userId, isActive: true }
    });

    if (!membership) {
      throw new ForbiddenError('Access denied to this artist');
    }

    // Add permission checking logic here
    return true;
  }
}
```

### 5. CONTROLLER IMPLEMENTATION

```typescript
// controllers/ArtistController.ts
import { Request, Response, NextFunction } from 'express';
import { ArtistService } from '../services/ArtistService';
import { AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createArtistSchema, updateArtistSchema } from '../validators/artist';

export class ArtistController {
  private artistService: ArtistService;

  constructor() {
    this.artistService = new ArtistService();
  }

  getArtists = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const artists = await this.artistService.getArtistsByUser(
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        data: artists,
        meta: {
          timestamp: new Date().toISOString(),
          count: artists.length
        }
      });
    } catch (error) {
      next(error);
    }
  };

  createArtist = [
    validateRequest(createArtistSchema),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const artist = await this.artistService.createArtist(
          req.body,
          req.user!.id
        );

        res.status(201).json({
          success: true,
          data: artist,
          message: 'Artist created successfully'
        });
      } catch (error) {
        next(error);
      }
    }
  ];

  updateArtist = [
    validateRequest(updateArtistSchema),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const artist = await this.artistService.updateArtist(
          req.params.artistId,
          req.body,
          req.user!.id
        );

        res.json({
          success: true,
          data: artist,
          message: 'Artist updated successfully'
        });
      } catch (error) {
        next(error);
      }
    }
  ];
}
```

---

## FRONTEND DEVELOPMENT GUIDELINES

### 1. PROJECT INITIALIZATION

```bash
# Initialize frontend project
npx create-react-app frontend --template typescript
cd frontend

# Install additional dependencies
npm install @reduxjs/toolkit react-redux
npm install @hookform/resolvers react-hook-form yup
npm install axios
npm install tailwindcss @tailwindcss/forms @tailwindcss/typography
npm install recharts lucide-react
npm install socket.io-client
npm install date-fns

# Development dependencies
npm install -D @testing-library/jest-dom @testing-library/user-event
npm install -D cypress
npm install -D eslint-config-prettier prettier
```

### 2. REDUX STORE SETUP

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. API SERVICE SETUP

```typescript
// store/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Artist', 'Campaign', 'Tour', 'Album', 'Transaction'],
  endpoints: () => ({}),
});
```

### 4. FEATURE-BASED API DEFINITIONS

```typescript
// features/artists/api/artistsApi.ts
import { apiSlice } from '../../../store/api/apiSlice';
import { Artist, CreateArtistRequest, UpdateArtistRequest } from '../types';

export const artistsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArtists: builder.query<Artist[], void>({
      query: () => '/artists',
      providesTags: ['Artist'],
    }),
    getArtist: builder.query<Artist, string>({
      query: (artistId) => `/artists/${artistId}`,
      providesTags: (result, error, artistId) => [{ type: 'Artist', id: artistId }],
    }),
    createArtist: builder.mutation<Artist, CreateArtistRequest>({
      query: (artistData) => ({
        url: '/artists',
        method: 'POST',
        body: artistData,
      }),
      invalidatesTags: ['Artist'],
    }),
    updateArtist: builder.mutation<Artist, { artistId: string; updates: UpdateArtistRequest }>({
      query: ({ artistId, updates }) => ({
        url: `/artists/${artistId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { artistId }) => [{ type: 'Artist', id: artistId }],
    }),
  }),
});

export const {
  useGetArtistsQuery,
  useGetArtistQuery,
  useCreateArtistMutation,
  useUpdateArtistMutation,
} = artistsApi;
```

### 5. COMPONENT IMPLEMENTATION STANDARDS

```typescript
// features/artists/components/ArtistCard.tsx
import React from 'react';
import { Artist } from '../types';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/common/Button';

interface ArtistCardProps {
  artist: Artist;
  onEdit?: (artist: Artist) => void;
  onView?: (artist: Artist) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onEdit,
  onView
}) => {
  const { hasPermission } = useAuth();

  const canEdit = hasPermission('edit_artist_profile');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {artist.stageName}
          </h3>
          {artist.legalName && (
            <p className="text-sm text-gray-600 mt-1">
              {artist.legalName}
            </p>
          )}
          {artist.genre && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
              {artist.genre}
            </span>
          )}
        </div>

        {artist.profileImageUrl && (
          <img
            src={artist.profileImageUrl}
            alt={artist.stageName}
            className="w-16 h-16 rounded-full object-cover ml-4"
          />
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {onView && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(artist)}
          >
            View Details
          </Button>
        )}
        {canEdit && onEdit && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(artist)}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};
```

---

## TESTING IMPLEMENTATION

### 1. BACKEND TESTING SETUP

```typescript
// tests/setup.ts
import { sequelize } from '../src/config/database';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

// tests/services/ArtistService.test.ts
import { ArtistService } from '../../src/services/ArtistService';
import { User } from '../../src/models/User';
import { Artist } from '../../src/models/Artist';

describe('ArtistService', () => {
  let artistService: ArtistService;
  let testUser: User;

  beforeEach(async () => {
    artistService = new ArtistService();
    testUser = await User.create({
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User'
    });
  });

  describe('createArtist', () => {
    it('should create artist and team membership', async () => {
      const artistData = {
        userId: testUser.id,
        stageName: 'Test Artist',
        genre: 'Pop'
      };

      const artist = await artistService.createArtist(artistData, testUser.id);

      expect(artist.stageName).toBe('Test Artist');
      expect(artist.genre).toBe('Pop');
    });
  });
});
```

### 2. FRONTEND TESTING SETUP

```typescript
// src/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// src/components/__tests__/ArtistCard.test.tsx
import { render, screen, fireEvent } from '../../test-utils';
import { ArtistCard } from '../ArtistCard';

const mockArtist = {
  id: '1',
  stageName: 'Test Artist',
  genre: 'Pop',
  profileImageUrl: 'https://example.com/image.jpg'
};

describe('ArtistCard', () => {
  it('renders artist information correctly', () => {
    render(<ArtistCard artist={mockArtist} />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<ArtistCard artist={mockArtist} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockArtist);
  });
});
```

---

## DEPLOYMENT & DEVOPS

### 1. DOCKER SETUP

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]

# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. DOCKER COMPOSE FOR DEVELOPMENT

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: artisthub_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3000
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## QUALITY ASSURANCE CHECKLIST

### 1. CODE QUALITY STANDARDS

#### Backend Checklist
- [ ] All endpoints have proper authentication middleware
- [ ] Input validation using Joi or express-validator
- [ ] Error handling with appropriate HTTP status codes
- [ ] Database queries use parameterized statements
- [ ] Logging implemented for all major operations
- [ ] Unit tests cover business logic (>80% coverage)
- [ ] Integration tests for API endpoints
- [ ] OpenAPI documentation updated

#### Frontend Checklist
- [ ] Components have proper TypeScript types
- [ ] Responsive design works on mobile devices
- [ ] Error boundaries implemented for error handling
- [ ] Loading states for all async operations
- [ ] Form validation with user-friendly error messages
- [ ] Accessibility attributes (ARIA labels, roles)
- [ ] Unit tests for components and hooks
- [ ] E2E tests for critical user flows

### 2. SECURITY CHECKLIST

- [ ] All API endpoints require authentication
- [ ] Role-based permissions enforced
- [ ] Input sanitization prevents XSS attacks
- [ ] SQL injection prevention verified
- [ ] Rate limiting implemented
- [ ] HTTPS enforced in production
- [ ] Secrets stored in environment variables
- [ ] CORS properly configured

### 3. PERFORMANCE CHECKLIST

- [ ] Database queries optimized with proper indexes
- [ ] API response times <200ms for standard operations
- [ ] Frontend bundle size optimized
- [ ] Images optimized and properly sized
- [ ] Caching strategy implemented
- [ ] Memory leaks tested and prevented
- [ ] Load testing completed for expected traffic

---

## DEPLOYMENT PHASES

### Phase 1: MVP (Weeks 1-4)
- Core authentication system
- Artist management (CRUD)
- Basic dashboard with timeline
- One domain module (Marketing or Touring)

### Phase 2: Core Features (Weeks 5-8)
- All domain modules implemented
- Role-based access control
- File upload functionality
- Basic analytics and reporting

### Phase 3: Advanced Features (Weeks 9-12)
- Real-time notifications
- Advanced analytics
- Mobile responsiveness
- Performance optimization

### Phase 4: Production Ready (Weeks 13-16)
- Security audit and penetration testing
- Load testing and performance tuning
- Documentation completion
- Production deployment and monitoring