'use client';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuth(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6 animate-in slide-in-from-bottom-4 duration-1000">
            ArtistHub CRM Professionnel
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            La plateforme CRM complète pour gérer la carrière des artistes.
            Chaque professionnel (marketing, booking, finance, presse) collabore sur une vue centralisée.
          </p>

          <div className="flex justify-center gap-4 mb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-400">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Créer un compte</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={handleLogin}
              className="border border-gray-300/60 bg-white/80 backdrop-blur-sm hover:bg-gray-50/90 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">Se connecter</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Roles Overview */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-gray-200/50 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Un CRM pour chaque métier de la musique
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Artiste</h3>
              <p className="text-gray-600 text-sm">Vue consolidée de votre carrière, métriques globales et collaboration équipe</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Marketing</h3>
              <p className="text-gray-600 text-sm">Campagnes, réseaux sociaux, analytics audience et mailing ciblé</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Booking/Tournée</h3>
              <p className="text-gray-600 text-sm">Venues, contrats, holds, routing et settlements automatisés</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Finance</h3>
              <p className="text-gray-600 text-sm">Revenus, dépenses, royalties et reporting comptable multi-devises</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Presse</h3>
              <p className="text-gray-600 text-sm">Contacts médias, interviews, coverage et campagnes presse</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Production</h3>
              <p className="text-gray-600 text-sm">Albums, tracks, streaming stats et timeline de production</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestion de profil</h3>
            <p className="text-gray-600 mb-4">
              Créez et personnalisez votre profil artistique avec vos informations, compétences et réalisations.
            </p>
            <a href="/profile" className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:scale-105">
              Gérer mon profil →
            </a>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio créatif</h3>
            <p className="text-gray-600 mb-4">
              Présentez vos œuvres, projets et collaborations dans un portfolio professionnel.
            </p>
            <a href="/portfolio" className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:scale-105">
              Voir mon portfolio →
            </a>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Réseau professionnel</h3>
            <p className="text-gray-600 mb-4">
              Organisez vos contacts : managers, producteurs, collaborateurs et suivez vos interactions.
            </p>
            <a href="/contacts" className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:scale-105">
              Gérer mes contacts →
            </a>
          </div>
        </div>

        {/* Discovery Section */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-200/50 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Découvrez d'autres artistes
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explorez la communauté d'artistes, trouvez de nouveaux collaborateurs et développez votre réseau professionnel.
          </p>
          <a href="/artists" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg">
            Explorer les artistes
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}