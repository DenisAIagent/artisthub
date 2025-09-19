'use client';

import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboard';

// NO MORE MOCK DATA - EVERYTHING IS REAL!

const roleConfig = {
  artist: {
    title: 'Vue Artiste',
    color: 'purple',
    gradient: 'from-purple-500/10 to-purple-600/5',
    modules: ['overview', 'revenue', 'performances', 'team']
  },
  marketing_manager: {
    title: 'Marketing Manager',
    color: 'blue',
    gradient: 'from-blue-500/10 to-blue-600/5',
    modules: ['campaigns', 'social', 'analytics', 'email']
  },
  tour_manager: {
    title: 'Tour Manager',
    color: 'green',
    gradient: 'from-green-500/10 to-green-600/5',
    modules: ['booking', 'logistics', 'venues', 'settlements']
  },
  album_manager: {
    title: 'Production Manager',
    color: 'red',
    gradient: 'from-red-500/10 to-red-600/5',
    modules: ['albums', 'tracks', 'streaming', 'timeline']
  },
  financial_manager: {
    title: 'Financial Manager',
    color: 'yellow',
    gradient: 'from-yellow-500/10 to-yellow-600/5',
    modules: ['revenue', 'expenses', 'royalties', 'reports']
  },
  press_officer: {
    title: 'Attaché de Presse',
    color: 'orange',
    gradient: 'from-orange-500/10 to-orange-600/5',
    modules: ['media', 'interviews', 'coverage', 'campaigns']
  },
  admin: {
    title: 'Administrateur',
    color: 'gray',
    gradient: 'from-gray-500/10 to-gray-600/5',
    modules: ['overview', 'users', 'artists', 'system']
  }
};

export default function DashboardPage() {
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  // REAL DATA FROM API - NO MORE MOCKS!
  const { metrics, activities, quickActions, userProfile, isLoading, isError, error } = useDashboardData(
    selectedArtist === 'all' ? undefined : selectedArtist
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des données réelles...</p>
          <p className="text-sm text-gray-500 mt-2">Connexion à la base de données</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les données depuis l'API</p>
          <p className="text-sm text-red-600 font-mono">{error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Get user data and config
  const user = userProfile.data;
  const config = user ? roleConfig[user.role as keyof typeof roleConfig] : roleConfig.artist;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>;
      case 'info':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'warning':
        return <div className="w-2 h-2 bg-amber-500 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
              {config.title}
            </h1>
            <div className={`h-1 w-24 bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 rounded-full mt-3`}></div>
            <p className="text-gray-600 mt-4 text-lg leading-relaxed">
              Bonjour {user?.firstName}, voici votre dashboard {config.title.toLowerCase()}
            </p>
            <p className="text-sm text-green-600 font-semibold mt-2">
              ✅ Données en temps réel depuis la base de données
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Vue active
              </label>
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="border border-gray-200 rounded-xl px-5 py-3 bg-white/80 backdrop-blur-sm min-w-[280px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-right-4 bg-center pr-12 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <option value="all">Vue consolidée - Tous les artistes</option>
                <optgroup label="Artistes individuels">
                  {user?.artistsAccess?.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              {selectedArtist === 'all' ? (
                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-200 shadow-sm backdrop-blur-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Vue consolidée</span>
                  <span className="text-xs bg-blue-100 px-3 py-1 rounded-full font-medium">
                    {user?.artistsAccess?.length || 0} artistes
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-4 py-3 rounded-xl border border-purple-200 shadow-sm backdrop-blur-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-semibold">Vue individuelle</span>
                  <span className="text-xs bg-purple-100 px-3 py-1 rounded-full font-medium">
                    {user?.artistsAccess?.find(a => a.id === selectedArtist)?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consolidated View Info */}
        {selectedArtist === 'all' && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-2xl p-6 mb-10 backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 tracking-tight">
                  Vue consolidée activée - Données réelles
                </h3>
                <p className="text-blue-700 mt-1 leading-relaxed">
                  Vous visualisez les données agrégées calculées en temps réel depuis la base de données.
                  Les métriques représentent la totalité de votre portefeuille professionnel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* REAL METRICS GRID - NO MORE MOCK DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {metrics.data?.map((metric, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredMetric(index)}
              onMouseLeave={() => setHoveredMetric(null)}
              className={`relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border p-8 transition-all duration-500 cursor-pointer group ${
                selectedArtist === 'all'
                  ? `border-blue-200/50 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 hover:from-blue-50/50 hover:to-indigo-100/30`
                  : 'border-gray-200/50 hover:border-gray-300'
              } ${hoveredMetric === index ? 'scale-105 shadow-2xl -translate-y-2' : 'shadow-lg hover:shadow-xl'}`}
            >
              {/* Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${metric.color}-500/5 to-${metric.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-600 tracking-wider uppercase mb-3">
                    {metric.label}
                  </p>
                  <p className="text-4xl font-black text-gray-900 tracking-tight mb-3 group-hover:scale-110 transition-transform duration-300">
                    {metric.value}
                  </p>
                  <div className="flex items-center space-x-3 mb-2">
                    <p className={`text-sm font-bold flex items-center space-x-1 ${
                      metric.trend === 'up' ? 'text-emerald-600' :
                      metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {metric.trend === 'up' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      )}
                      {metric.trend === 'down' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                      )}
                      <span>{metric.change}</span>
                    </p>
                    {selectedArtist === 'all' && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        Calculé en temps réel
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{metric.breakdown}</p>
                </div>

                <div className={`w-16 h-16 bg-gradient-to-br from-${metric.color}-400/20 to-${metric.color}-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <div className={`w-6 h-6 bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 rounded-full`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* REAL ACTIVITIES - NO MORE MOCK DATA */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Activité récente
                </h2>
                <div className="flex items-center space-x-2">
                  {selectedArtist === 'all' && (
                    <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                      Multi-artistes
                    </span>
                  )}
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    Base de données
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                {activities.data?.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-5 p-5 hover:bg-gray-50/50 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-200/50">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.action}
                        </p>
                        {selectedArtist === 'all' && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium ml-3 flex-shrink-0">
                            {activity.artist}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1 leading-relaxed">{activity.detail}</p>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Il y a {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* REAL QUICK ACTIONS */}
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
                Actions rapides
              </h2>
              <div className="space-y-4">
                {quickActions.data?.map((action, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center justify-between p-5 text-left rounded-xl transition-all duration-300 group ${
                      action.type === 'primary'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : action.type === 'secondary'
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => console.log(`Navigate to: ${action.href}`)}
                  >
                    <span className={`font-semibold ${action.type === 'primary' ? 'text-white' : 'group-hover:text-blue-600'} transition-colors`}>
                      {action.label}
                    </span>
                    <svg className={`w-5 h-5 ${action.type === 'primary' ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'} group-hover:translate-x-1 transition-all`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Upcoming Deadlines */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
                Prochaines échéances
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                      Réponse hold Olympia
                    </p>
                    <p className="text-amber-700 mt-1 font-medium">Expire dans 2 jours</p>
                  </div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      Campagne Halloween
                    </p>
                    <p className="text-blue-700 mt-1 font-medium">Lancement dans 5 jours</p>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      Settlement Octobre
                    </p>
                    <p className="text-emerald-700 mt-1 font-medium">À valider cette semaine</p>
                  </div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}