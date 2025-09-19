import { useQuery } from '@tanstack/react-query';
import { dashboardApi, artistsApi } from '@/lib/api';

// Query keys for consistent caching
export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: (artistId?: string) => [...dashboardKeys.all, 'metrics', artistId] as const,
  activities: (artistId?: string, limit?: number) => [...dashboardKeys.all, 'activities', artistId, limit] as const,
  quickActions: () => [...dashboardKeys.all, 'quick-actions'] as const,
  userProfile: () => [...dashboardKeys.all, 'user-profile'] as const,
};

// Query keys for artists
export const artistsKeys = {
  all: ['artists'] as const,
  lists: () => [...artistsKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...artistsKeys.lists(), filters] as const,
  details: () => [...artistsKeys.all, 'detail'] as const,
  detail: (id: string) => [...artistsKeys.details(), id] as const,
};

// Hook for dashboard metrics
export const useDashboardMetrics = (artistId?: string) => {
  return useQuery({
    queryKey: dashboardKeys.metrics(artistId),
    queryFn: () => dashboardApi.getMetrics(artistId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes for real-time feel
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for recent activities
export const useRecentActivities = (artistId?: string, limit = 10) => {
  return useQuery({
    queryKey: dashboardKeys.activities(artistId, limit),
    queryFn: () => dashboardApi.getRecentActivities(artistId, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for activity updates
    retry: 3,
  });
};

// Hook for quick actions
export const useQuickActions = () => {
  return useQuery({
    queryKey: dashboardKeys.quickActions(),
    queryFn: () => dashboardApi.getQuickActions(),
    staleTime: 10 * 60 * 1000, // 10 minutes (actions don't change often)
    retry: 2,
  });
};

// Hook for user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: dashboardKeys.userProfile(),
    queryFn: () => dashboardApi.getUserProfile(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
  });
};

// Combined hook for full dashboard data
export const useDashboardData = (artistId?: string) => {
  const metrics = useDashboardMetrics(artistId);
  const activities = useRecentActivities(artistId);
  const quickActions = useQuickActions();
  const userProfile = useUserProfile();

  return {
    metrics,
    activities,
    quickActions,
    userProfile,
    // Computed states
    isLoading: metrics.isLoading || activities.isLoading || quickActions.isLoading || userProfile.isLoading,
    isError: metrics.isError || activities.isError || quickActions.isError || userProfile.isError,
    error: metrics.error || activities.error || quickActions.error || userProfile.error,
    isSuccess: metrics.isSuccess && activities.isSuccess && quickActions.isSuccess && userProfile.isSuccess,
  };
};

// Hook for artists list
export const useArtists = () => {
  return useQuery({
    queryKey: artistsKeys.list(),
    queryFn: () => artistsApi.getArtists(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Hook for single artist
export const useArtist = (id: string) => {
  return useQuery({
    queryKey: artistsKeys.detail(id),
    queryFn: () => artistsApi.getArtist(id),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    enabled: !!id,
  });
};