// =============================================================================
// COMPONENT TYPES FOR CRESCENDOCRM UI
// =============================================================================

import { ReactNode } from 'react';

// Base Component Props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Button Component Types
export interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Input Component Types
export interface InputProps extends BaseProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Select Component Types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends BaseProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  maxHeight?: number;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearch?: (query: string) => void;
}

// Table Component Types
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  renderHeader?: () => ReactNode;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> extends BaseProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  empty?: ReactNode;
  rowKey?: string | ((record: T) => string);
  selectedRowKeys?: string[];
  selectable?: boolean;
  selectAll?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
  };
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
  sticky?: boolean;
  virtualScroll?: boolean;
  onRowClick?: (record: T, index: number) => void;
  onRowDoubleClick?: (record: T, index: number) => void;
  onSelectionChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

// Modal Component Types
export interface ModalProps extends BaseProps {
  open: boolean;
  title?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
  footer?: ReactNode;
  loading?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
}

// Form Component Types
export interface FormFieldProps extends BaseProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface FormProps extends BaseProps {
  layout?: 'vertical' | 'horizontal' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

// Card Component Types
export interface CardProps extends BaseProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  cover?: ReactNode;
  actions?: ReactNode[];
  loading?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Badge Component Types
export interface BadgeProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dot?: boolean;
  count?: number;
  showZero?: boolean;
  overflowCount?: number;
  offset?: [number, number];
}

// Avatar Component Types
export interface AvatarProps extends BaseProps {
  src?: string;
  alt?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  fallback?: string;
  fallbackIcon?: ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

// Notification Types
export interface NotificationProps {
  id?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  onClose?: () => void;
}

// Loading Component Types
export interface LoadingProps extends BaseProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  spinning?: boolean;
  delay?: number;
  tip?: string;
}

// Breadcrumb Types
export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: ReactNode;
  menu?: {
    items: Array<{
      key: string;
      label: string;
      href?: string;
      icon?: ReactNode;
    }>;
  };
}

export interface BreadcrumbProps extends BaseProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
}

// Navigation Types
export interface NavigationItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps extends BaseProps {
  items: NavigationItem[];
  activeKey?: string;
  collapsed?: boolean;
  theme?: 'light' | 'dark';
  mode?: 'horizontal' | 'vertical';
  onSelect?: (key: string, item: NavigationItem) => void;
  onOpenChange?: (openKeys: string[]) => void;
}

// Layout Types
export interface LayoutProps extends BaseProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  sidebarCollapsed?: boolean;
  sidebarCollapsible?: boolean;
  sidebarWidth?: number;
  contentPadding?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
}

// Search Types
export interface SearchProps extends BaseProps {
  placeholder?: string;
  value?: string;
  loading?: boolean;
  enterButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  allowClear?: boolean;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: Record<string, any>;
}

export interface CalendarProps extends BaseProps {
  events: CalendarEvent[];
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  editable?: boolean;
  selectable?: boolean;
  selectMirror?: boolean;
  dayMaxEvents?: boolean | number;
  height?: number | 'auto';
  locale?: string;
  timezone?: string;
  businessHours?: {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
  };
  onDateSelect?: (selectInfo: any) => void;
  onEventClick?: (clickInfo: any) => void;
  onEventDrop?: (dropInfo: any) => void;
  onEventResize?: (resizeInfo: any) => void;
}

// Chart Types
export interface ChartDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'scatter';
}

export interface ChartProps extends BaseProps {
  type: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'scatter';
  data: ChartSeries[];
  width?: number | string;
  height?: number | string;
  loading?: boolean;
  options?: Record<string, any>;
  theme?: 'light' | 'dark';
  onDataPointClick?: (dataPoint: ChartDataPoint, series: ChartSeries) => void;
}

// Upload Types
export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  url?: string;
  response?: any;
  error?: Error;
  percent?: number;
  size?: number;
  type?: string;
}

export interface UploadProps extends BaseProps {
  action?: string;
  accept?: string;
  multiple?: boolean;
  directory?: boolean;
  disabled?: boolean;
  fileList?: UploadFile[];
  maxCount?: number;
  maxSize?: number;
  listType?: 'text' | 'picture' | 'picture-card';
  showUploadList?: boolean;
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<File>;
  onChange?: (info: { file: UploadFile; fileList: UploadFile[] }) => void;
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>;
  onPreview?: (file: UploadFile) => void;
  customRequest?: (options: any) => void;
}

// Filter Types
export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

export interface FilterProps extends BaseProps {
  title?: string;
  options: FilterOption[];
  value?: (string | number)[];
  multiple?: boolean;
  searchable?: boolean;
  showCount?: boolean;
  showSelectAll?: boolean;
  onChange?: (value: (string | number)[]) => void;
  onSearch?: (query: string) => void;
}

// Status Indicator Types
export interface StatusProps extends BaseProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'success' | 'warning' | 'error' | 'processing';
  text?: string;
  dot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Timeline Types
export interface TimelineItem {
  id: string;
  timestamp: Date;
  title: string;
  description?: string;
  type?: 'default' | 'success' | 'warning' | 'error';
  icon?: ReactNode;
  color?: string;
  actions?: ReactNode[];
}

export interface TimelineProps extends BaseProps {
  items: TimelineItem[];
  reverse?: boolean;
  pending?: ReactNode;
  mode?: 'left' | 'alternate' | 'right';
}

// Data Display Types
export interface StatisticProps extends BaseProps {
  title?: ReactNode;
  value: string | number;
  precision?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  loading?: boolean;
  valueStyle?: React.CSSProperties;
  formatter?: (value: string | number | undefined) => ReactNode;
}

// Theme Types
export interface ThemeConfig {
  primaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  borderRadius: number;
  boxShadow: string;
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// Context Types
export interface AppContextValue {
  user?: any;
  tenant?: any;
  theme: 'light' | 'dark' | 'system';
  locale: string;
  timezone: string;
  permissions: string[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLocale: (locale: string) => void;
  setTimezone: (timezone: string) => void;
}

export interface NotificationContextValue {
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}