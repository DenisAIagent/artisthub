'use client';

import { useState } from 'react';
import { useArtists } from '@/hooks/useDashboard';

export default function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const { data: artists, isLoading, isError, error } = useArtists();

  // Filter artists based on search and filters
  const filteredArtists = artists?.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || artist.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  }) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des artistes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">Impossible de charger la liste des artistes</p>
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Découvrir les Artistes</h1>
            <p className="text-gray-600 mt-2">
              {artists?.length || 0} artistes • Données en temps réel
            </p>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Rechercher un artiste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les genres</option>
              <option value="synthwave">Synthwave</option>
              <option value="darksynth">Darksynth</option>
              <option value="electronic">Electronic</option>
              <option value="pop">Pop</option>
              <option value="rock">Rock</option>
            </select>
          </div>
        </div>

        {/* Results info */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredArtists.length} artiste{filteredArtists.length !== 1 ? 's' : ''} trouvé{filteredArtists.length !== 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
            {selectedGenre && ` dans le genre "${selectedGenre}"`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mr-4 shadow-sm">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{artist.name}</h3>
                  <p className="text-gray-600 text-sm font-medium">{artist.genre}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Statut:</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    artist.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {artist.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Followers:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {artist.followers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">ID:</span>
                  <span className="text-sm text-gray-700 font-mono">#{artist.id}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200">
                  Voir Profil
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors">
                  Contacter
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredArtists.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun artiste trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedGenre
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun artiste disponible pour le moment'
              }
            </p>
            {(searchTerm || selectedGenre) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Stats card */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-1">Résumé des artistes</h2>
              <p className="text-blue-700">
                {filteredArtists.length} artiste{filteredArtists.length !== 1 ? 's' : ''} affiché{filteredArtists.length !== 1 ? 's' : ''} sur {artists?.length || 0} total
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {filteredArtists.reduce((total, artist) => total + artist.followers, 0).toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Total de followers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}