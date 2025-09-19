export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-white max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mon Profil</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Photo et info de base */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Alex Martin</h2>
                <p className="text-blue-200 mb-4">Musicien • Producteur</p>
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-colors">
                  Modifier la photo
                </button>
              </div>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm opacity-75 mb-1">Nom complet</label>
                  <input
                    type="text"
                    defaultValue="Alex Martin"
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-75 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="alex@artisthub.com"
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-75 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    defaultValue="+33 6 12 34 56 78"
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Bio professionnelle</h3>
              <textarea
                rows={4}
                defaultValue="Musicien passionné depuis plus de 10 ans, spécialisé dans la production électronique et l'arrangement. J'ai collaboré avec plusieurs artistes locaux et recherche de nouveaux projets créatifs."
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
              />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Spécialités</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-500/50 px-3 py-1 rounded-full text-sm">Production musicale</span>
                <span className="bg-blue-500/50 px-3 py-1 rounded-full text-sm">Guitare</span>
                <span className="bg-green-500/50 px-3 py-1 rounded-full text-sm">Arrangement</span>
                <span className="bg-yellow-500/50 px-3 py-1 rounded-full text-sm">Mix & Master</span>
              </div>
              <button className="text-blue-200 hover:text-white transition-colors">
                + Ajouter une spécialité
              </button>
            </div>

            <div className="flex space-x-4">
              <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md transition-colors">
                Sauvegarder
              </button>
              <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-md transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}