# ARTISTHUB CRM COMPONENT ARCHITECTURE

## FRONTEND ARCHITECTURE OVERVIEW

The frontend follows a **modular, role-based component architecture** with clean separation of concerns:

- **React 18** with TypeScript for type safety
- **Role-based component rendering** with permission guards
- **Modular design** allowing easy feature additions
- **Shared component library** for consistency
- **State management** with Redux Toolkit + RTK Query
- **Responsive design** with Tailwind CSS

---

## PROJECT STRUCTURE

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── forms/           # Form components
│   ├── charts/          # Analytics charts
│   └── layout/          # Layout components
├── features/            # Feature-based modules
│   ├── auth/           # Authentication
│   ├── artists/        # Artist management
│   ├── marketing/      # Marketing module
│   ├── touring/        # Touring module
│   ├── albums/         # Albums module
│   ├── financial/      # Financial module
│   ├── press/          # Press module
│   └── analytics/      # Analytics & reporting
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Redux store
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── constants/          # Application constants
```

---

## COMPONENT HIERARCHY

### 1. ROOT LEVEL COMPONENTS

```typescript
// App.tsx - Main application component
interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
};

// ProtectedRoute.tsx - Route protection with role checking
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission
}) => {
  const { user, hasRole, hasPermission } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && !hasRole(requiredRole)) return <AccessDenied />;
  if (requiredPermission && !hasPermission(requiredPermission)) return <AccessDenied />;

  return <>{children}</>;
};
```

### 2. LAYOUT COMPONENTS

```typescript
// DashboardLayout.tsx - Main dashboard layout
interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <Sidebar userRole={user.role} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Sidebar.tsx - Role-based navigation
interface SidebarProps {
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const navigationItems = getNavigationForRole(userRole);

  return (
    <aside className="w-64 bg-white shadow-sm">
      <nav className="mt-8">
        {navigationItems.map(item => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </nav>
    </aside>
  );
};
```

### 3. FEATURE MODULES

#### Artists Module
```typescript
// features/artists/components/ArtistDashboard.tsx
interface ArtistDashboardProps {
  artistId: string;
}

const ArtistDashboard: React.FC<ArtistDashboardProps> = ({ artistId }) => {
  const { data: artist } = useGetArtistQuery(artistId);
  const { data: timeline } = useGetTimelineQuery(artistId);
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <ArtistHeader artist={artist} />
      <MetricsOverview artistId={artistId} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity timeline={timeline} />
        <UpcomingEvents artistId={artistId} />
      </div>
      {hasPermission(user, 'view_financials') && (
        <FinancialSummary artistId={artistId} />
      )}
    </div>
  );
};

// features/artists/components/ArtistSelector.tsx
interface ArtistSelectorProps {
  onSelect: (artistId: string) => void;
  selectedArtistId?: string;
}

const ArtistSelector: React.FC<ArtistSelectorProps> = ({
  onSelect,
  selectedArtistId
}) => {
  const { data: artists } = useGetUserArtistsQuery();

  return (
    <Select
      value={selectedArtistId}
      onValueChange={onSelect}
      placeholder="Select Artist"
    >
      {artists?.map(artist => (
        <SelectItem key={artist.id} value={artist.id}>
          {artist.stageName}
        </SelectItem>
      ))}
    </Select>
  );
};
```

#### Marketing Module
```typescript
// features/marketing/components/CampaignList.tsx
interface CampaignListProps {
  artistId: string;
}

const CampaignList: React.FC<CampaignListProps> = ({ artistId }) => {
  const { data: campaigns, isLoading } = useGetCampaignsQuery(artistId);
  const { user } = useAuth();

  const canCreateCampaign = hasPermission(user, 'create_marketing_campaign');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
        {canCreateCampaign && (
          <Button onClick={() => setShowCreateModal(true)}>
            Create Campaign
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4">
          {campaigns?.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

// features/marketing/components/SocialMediaDashboard.tsx
const SocialMediaDashboard: React.FC<{ artistId: string }> = ({ artistId }) => {
  const { data: socialStats } = useGetSocialStatsQuery(artistId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {SOCIAL_PLATFORMS.map(platform => (
        <SocialMediaCard
          key={platform}
          platform={platform}
          stats={socialStats?.[platform]}
        />
      ))}
    </div>
  );
};
```

#### Touring Module
```typescript
// features/touring/components/TourCalendar.tsx
interface TourCalendarProps {
  artistId: string;
  view?: 'month' | 'week' | 'list';
}

const TourCalendar: React.FC<TourCalendarProps> = ({ artistId, view = 'month' }) => {
  const { data: tourDates } = useGetTourDatesQuery(artistId);

  return (
    <div className="bg-white rounded-lg shadow">
      <CalendarHeader view={view} />
      <Calendar
        events={tourDates}
        view={view}
        eventRenderer={TourDateCard}
      />
    </div>
  );
};

// features/touring/components/VenueSelector.tsx
const VenueSelector: React.FC<VenueSelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: venues } = useSearchVenuesQuery(searchTerm);

  return (
    <SearchableSelect
      placeholder="Search venues..."
      onSearch={setSearchTerm}
      options={venues}
      onSelect={onSelect}
      optionRenderer={VenueOption}
    />
  );
};
```

#### Financial Module
```typescript
// features/financial/components/FinancialDashboard.tsx
const FinancialDashboard: React.FC<{ artistId: string }> = ({ artistId }) => {
  const { data: summary } = useGetFinancialSummaryQuery(artistId);

  return (
    <div className="space-y-6">
      <FinancialMetrics summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart artistId={artistId} />
        <ExpenseBreakdown artistId={artistId} />
      </div>
      <TransactionTable artistId={artistId} />
    </div>
  );
};

// features/financial/components/ExpenseForm.tsx
const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<ExpenseFormData>({
    defaultValues: initialData,
    validationSchema: expenseSchema
  });

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField name="vendor" label="Vendor" required />
      <FormField name="category" label="Category" type="select" options={expenseCategories} />
      <FormField name="amount" label="Amount" type="currency" />
      <FormField name="description" label="Description" type="textarea" />
      <FileUpload name="receipt" label="Receipt" accept="image/*,application/pdf" />
    </Form>
  );
};
```

---

## SHARED COMPONENTS LIBRARY

### 1. COMMON COMPONENTS

```typescript
// components/common/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// components/common/Table.tsx
interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filtering?: FilteringConfig;
}

// components/common/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### 2. FORM COMPONENTS

```typescript
// components/forms/FormField.tsx
interface FormFieldProps {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'currency';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: ValidationRules;
}

// components/forms/DateRangePicker.tsx
interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (range: DateRange) => void;
  maxDate?: Date;
  minDate?: Date;
}
```

### 3. CHART COMPONENTS

```typescript
// components/charts/LineChart.tsx
interface LineChartProps {
  data: ChartDataPoint[];
  xAxisKey: string;
  yAxisKey: string;
  title?: string;
  color?: string;
}

// components/charts/BarChart.tsx
interface BarChartProps {
  data: ChartDataPoint[];
  xAxisKey: string;
  yAxisKey: string;
  title?: string;
  horizontal?: boolean;
}

// components/charts/PieChart.tsx
interface PieChartProps {
  data: PieChartDataPoint[];
  title?: string;
  showLabels?: boolean;
  showLegend?: boolean;
}
```

---

## STATE MANAGEMENT

### Redux Store Structure

```typescript
// store/index.ts
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    artists: artistsSlice.reducer,
    marketing: marketingSlice.reducer,
    touring: touringSlice.reducer,
    albums: albumsSlice.reducer,
    financial: financialSlice.reducer,
    press: pressSlice.reducer,
    ui: uiSlice.reducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  currentArtistId: string | null;
}

// store/api/apiSlice.ts - RTK Query setup
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Artist', 'Campaign', 'Tour', 'Album', 'Transaction'],
  endpoints: (builder) => ({
    // Endpoints defined in feature-specific files
  }),
});
```

---

## CUSTOM HOOKS

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, permissions } = useAppSelector(state => state.auth);

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role || user?.role === 'admin';
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.some(p => p.name === permission);
  };

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginThunk(credentials));
    return result;
  };

  return { user, isAuthenticated, hasRole, hasPermission, login };
};

// hooks/useArtistContext.ts
export const useArtistContext = () => {
  const { currentArtistId } = useAppSelector(state => state.auth);
  const { data: artist } = useGetArtistQuery(currentArtistId!, {
    skip: !currentArtistId
  });

  return { artistId: currentArtistId, artist };
};

// hooks/usePermissions.ts
export const usePermissions = () => {
  const { user, permissions } = useAuth();

  const canView = (resource: string): boolean => {
    return hasPermission(`view_${resource}`);
  };

  const canCreate = (resource: string): boolean => {
    return hasPermission(`create_${resource}`);
  };

  const canEdit = (resource: string): boolean => {
    return hasPermission(`edit_${resource}`);
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission(`delete_${resource}`);
  };

  return { canView, canCreate, canEdit, canDelete };
};
```

---

## ROLE-BASED COMPONENT RENDERING

```typescript
// components/common/RoleGuard.tsx
interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null
}) => {
  const { user, hasRole } = useAuth();

  const hasAccess = allowedRoles.some(role => hasRole(role));

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Usage example
<RoleGuard allowedRoles={['financial_manager', 'admin']}>
  <FinancialDashboard artistId={artistId} />
</RoleGuard>

// components/common/PermissionGuard.tsx
interface PermissionGuardProps {
  requiredPermission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermission,
  children,
  fallback = null
}) => {
  const { hasPermission } = useAuth();

  return hasPermission(requiredPermission) ? <>{children}</> : <>{fallback}</>;
};
```

---

## RESPONSIVE DESIGN SYSTEM

```typescript
// constants/breakpoints.ts
export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// components/layout/ResponsiveGrid.tsx
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4
}) => {
  const gridClasses = `
    grid gap-${gap}
    grid-cols-${cols.xs}
    sm:grid-cols-${cols.sm}
    md:grid-cols-${cols.md}
    lg:grid-cols-${cols.lg}
    xl:grid-cols-${cols.xl}
  `;

  return <div className={gridClasses}>{children}</div>;
};
```