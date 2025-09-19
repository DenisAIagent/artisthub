'use client';

import { useState } from 'react';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

const roles = [
  { value: 'artist', label: 'Artiste' },
  { value: 'marketing_manager', label: 'Responsable Marketing' },
  { value: 'tour_manager', label: 'Tour Manager' },
  { value: 'album_manager', label: 'Production Manager' },
  { value: 'financial_manager', label: 'Financial Manager' },
  { value: 'press_officer', label: 'Attaché de Presse' },
  { value: 'admin', label: 'Administrateur' }
];

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'artist'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log('Auth submitted:', { mode, formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-8 shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 p-2 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle professionnel
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300 appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-right-3 bg-center pr-10"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Votre rôle détermine les fonctionnalités et données auxquelles vous avez accès dans le CRM.
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg"
          >
            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button
              onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 hover:scale-105"
            >
              {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}