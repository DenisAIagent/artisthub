'use client';

import { useState } from 'react';

// Simulation de l'utilisateur connecté
const mockUser = {
  id: '1',
  firstName: 'Marie',
  lastName: 'Dubois',
  role: 'marketing_manager',
  artistsAccess: [
    { id: '1', name: 'Sarah Lopez', avatar: null },
    { id: '2', name: 'DJ Mike', avatar: null }
  ]
};

const documentCategories = {
  marketing_manager: [
    { id: 'marketing_brief', name: 'Briefs Créatifs', icon: '📋', color: 'blue' },
    { id: 'campaign_assets', name: 'Assets Campagnes', icon: '🎨', color: 'purple' },
    { id: 'press_kit', name: 'Dossiers Presse', icon: '📰', color: 'green' },
    { id: 'social_media_assets', name: 'Réseaux Sociaux', icon: '📱', color: 'pink' },
    { id: 'brand_guidelines', name: 'Guidelines Marque', icon: '🎯', color: 'indigo' },
    { id: 'audience_reports', name: 'Rapports Audience', icon: '📊', color: 'yellow' }
  ],
  tour_manager: [
    { id: 'technical_rider', name: 'Riders Techniques', icon: '🎛️', color: 'red' },
    { id: 'venue_contracts', name: 'Contrats Venues', icon: '📝', color: 'blue' },
    { id: 'routing_plans', name: 'Plans Routing', icon: '🗺️', color: 'green' },
    { id: 'travel_docs', name: 'Documents Voyage', icon: '✈️', color: 'purple' },
    { id: 'insurance_docs', name: 'Assurances', icon: '🛡️', color: 'orange' },
    { id: 'settlement_reports', name: 'Settlements', icon: '💰', color: 'yellow' }
  ],
  album_manager: [
    { id: 'recording_contracts', name: 'Contrats Studio', icon: '🎙️', color: 'red' },
    { id: 'master_recordings', name: 'Masters & Stems', icon: '🎵', color: 'purple' },
    { id: 'artwork', name: 'Artwork & Design', icon: '🎨', color: 'pink' },
    { id: 'publishing_splits', name: 'Splits Publishing', icon: '📄', color: 'blue' },
    { id: 'production_schedules', name: 'Planning Production', icon: '📅', color: 'green' }
  ],
  financial_manager: [
    { id: 'invoices', name: 'Factures', icon: '🧾', color: 'blue' },
    { id: 'royalty_statements', name: 'Relevés Royalties', icon: '💎', color: 'purple' },
    { id: 'tax_documents', name: 'Documents Fiscaux', icon: '📋', color: 'red' },
    { id: 'budgets', name: 'Budgets Projets', icon: '📊', color: 'green' },
    { id: 'banking_docs', name: 'Documents Bancaires', icon: '🏦', color: 'yellow' }
  ],
  press_officer: [
    { id: 'press_releases', name: 'Communiqués', icon: '📰', color: 'blue' },
    { id: 'photos_hq', name: 'Photos HD', icon: '📸', color: 'purple' },
    { id: 'bio_sheets', name: 'Biographies', icon: '👤', color: 'green' },
    { id: 'media_coverage', name: 'Coverage Médias', icon: '📺', color: 'red' },
    { id: 'press_contacts', name: 'Contacts Presse', icon: '📞', color: 'yellow' }
  ]
};

const mockDocuments = [
  {
    id: '1',
    title: 'Brief Campagne Summer Tour 2024',
    category: 'marketing_brief',
    filename: 'summer-tour-brief.pdf',
    size: '2.4 MB',
    uploadedAt: '2024-01-15T10:30:00Z',
    uploadedBy: 'Marie Dubois',
    status: 'approved',
    isShared: true,
    tags: ['été', 'tournée', '2024']
  },
  {
    id: '2',
    title: 'Assets Visuels Instagram',
    category: 'social_media_assets',
    filename: 'instagram-assets.zip',
    size: '15.7 MB',
    uploadedAt: '2024-01-14T14:20:00Z',
    uploadedBy: 'Pierre Martin',
    status: 'draft',
    isShared: false,
    tags: ['instagram', 'visuel', 'stories']
  },
  {
    id: '3',
    title: 'Rapport Analytics Décembre',
    category: 'audience_reports',
    filename: 'analytics-dec-2023.xlsx',
    size: '856 KB',
    uploadedAt: '2024-01-10T09:15:00Z',
    uploadedBy: 'Marie Dubois',
    status: 'approved',
    isShared: true,
    tags: ['analytics', 'décembre', 'audience']
  }
];

export default function ResourcesPage() {
  const [selectedArtist, setSelectedArtist] = useState(mockUser.artistsAccess[0]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const categories = documentCategories[mockUser.role] || [];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'needs_revision': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) ||
           { name: categoryId, icon: '📄', color: 'gray' };
  };

  const formatFileSize = (bytes: string) => {
    return bytes; // Already formatted in mock data
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ressources & Documents
          </h1>
          <p className="text-gray-600 mt-1">
            Espace documentaire pour {mockUser.role.replace('_', ' ')}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedArtist.id}
            onChange={(e) => {
              const artist = mockUser.artistsAccess.find(a => a.id === e.target.value);
              setSelectedArtist(artist);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            {mockUser.artistsAccess.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Ajouter un document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">📁</span>
                <span className="font-medium">Tous les documents</span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total documents:</span>
                <span className="font-medium">{mockDocuments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Espace utilisé:</span>
                <span className="font-medium">18.9 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Partagés:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En attente:</span>
                <span className="font-medium text-yellow-600">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher des documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Aucun document ne correspond à votre recherche.' : 'Aucun document dans cette catégorie.'}
                </p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Ajouter le premier document
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => {
                      const categoryInfo = getCategoryInfo(doc.category);
                      return (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{categoryInfo.icon}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </div>
                            {doc.isShared && (
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                              </svg>
                            )}
                          </div>

                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{doc.filename}</p>
                            <p>{formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}</p>
                            <p>Par {doc.uploadedBy}</p>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {doc.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Télécharger
                            </button>
                            <div className="flex space-x-2">
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredDocuments.map((doc) => {
                      const categoryInfo = getCategoryInfo(doc.category);
                      return (
                        <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <span className="text-xl">{categoryInfo.icon}</span>
                            <div>
                              <h3 className="font-medium text-gray-900">{doc.title}</h3>
                              <p className="text-sm text-gray-600">
                                {doc.filename} • {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">
                                Télécharger
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ajouter un document</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Glissez vos fichiers ici
              </h3>
              <p className="text-gray-600 mb-4">
                ou cliquez pour sélectionner
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sélectionner des fichiers
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Séparez les tags par des virgules"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="sensitive" className="mr-2" />
                <label htmlFor="sensitive" className="text-sm text-gray-700">
                  Document sensible (accès restreint)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowUpload(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}