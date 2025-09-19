'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface Analytics {
  totalStreams: number;
  monthlyListeners: number;
  revenueGrowth: number;
  engagementRate: number;
}

interface Platform {
  name: string;
  streams: number;
  growth: number;
  revenue: number;
}

interface Activity {
  date: string;
  type: string;
  title: string;
  impact: string;
}

interface OverviewData {
  analytics: Analytics;
  platforms: Platform[];
  recentActivity: Activity[];
}

const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async (): Promise<OverviewData> => {
      const response = await apiClient.get<{ success: boolean; data: OverviewData }>('/statistics/overview');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export default function AnalyticsPage() {
  const { data: overview, isLoading, isError, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Chargement des analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
              <p className="text-gray-600 mb-4">Impossible de charger les analytics</p>
              <p className="text-sm text-red-600 font-mono">{error?.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
            Analytics & Performance
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-3"></div>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            Analyses en temps réel de vos performances artistiques
          </p>
          <p className="text-sm text-green-600 font-semibold mt-2">
            ✅ Données synchronisées depuis l'API
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-2xl">🎵</span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">TOTAL</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(overview.analytics.totalStreams)}
            </div>
            <div className="text-sm text-gray-600">Streams totaux</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-green-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-2xl">👥</span>
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">MENSUEL</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(overview.analytics.monthlyListeners)}
            </div>
            <div className="text-sm text-gray-600">Auditeurs mensuels</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 text-2xl">📈</span>
              </div>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-semibold">CROISSANCE</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              +{overview.analytics.revenueGrowth}%
            </div>
            <div className="text-sm text-gray-600">Croissance des revenus</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <span className="text-orange-600 text-2xl">💬</span>
              </div>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">ENGAGEMENT</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {overview.analytics.engagementRate}%
            </div>
            <div className="text-sm text-gray-600">Taux d'engagement</div>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance par plateforme</h2>
            <div className="space-y-6">
              {overview.platforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">
                        {platform.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{platform.name}</div>
                      <div className="text-sm text-gray-600">{formatNumber(platform.streams)} streams</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(platform.revenue)}</div>
                    <div className={`text-sm font-medium ${
                      platform.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {platform.growth >= 0 ? '+' : ''}{platform.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité récente</h2>
            <div className="space-y-4">
              {overview.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'release' ? 'bg-blue-500' :
                    activity.type === 'campaign' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{activity.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{activity.date}</div>
                    <div className="text-sm font-medium text-green-600">{activity.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Résumé de performance</h3>
              <p className="text-blue-700">
                Croissance globale de {overview.analytics.revenueGrowth}% avec {formatNumber(overview.analytics.monthlyListeners)} auditeurs mensuels
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900">
                {formatNumber(overview.analytics.totalStreams)}
              </div>
              <div className="text-sm text-blue-700">Total streams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}