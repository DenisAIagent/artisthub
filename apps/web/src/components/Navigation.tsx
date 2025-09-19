'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Don't show navigation on auth pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/how-it-works', label: 'Comment ça marche' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/artists', label: 'Découvrir' },
    { href: '/resources', label: 'Ressources' },
    { href: '/profile', label: 'Mon profil' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contacts', label: 'Contacts' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight hover:scale-105 transition-transform duration-300">
              ArtistHub
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  {link.label}
                  {pathname !== link.href && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group">
                  <span className="relative z-10">Se connecter</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            )}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 px-3 py-2 hover:scale-110">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;