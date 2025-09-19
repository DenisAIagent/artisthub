export default function PortfolioPage() {
  const projects = [
    {
      id: 1,
      title: "Summer Vibes EP",
      type: "Album",
      date: "2024",
      description: "Un EP de 5 titres aux sonorités estivales"
    },
    {
      id: 2,
      title: "Collaboration Jazz Fusion",
      type: "Single",
      date: "2023",
      description: "Projet collaboratif avec Sarah & The Band"
    },
    {
      id: 3,
      title: "Bande Sonore Documentaire",
      type: "Composition",
      date: "2023",
      description: "Musique originale pour le film 'Océans'"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mon Portfolio</h1>
          <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md transition-colors">
            + Ajouter un projet
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-purple-50 flex items-center justify-center">
                <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.type}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{project.date}</p>
                <p className="text-sm text-gray-700 mb-4">{project.description}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm transition-colors">
                    Voir
                  </button>
                  <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded text-sm transition-colors">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carte d'ajout */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[300px] hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-lg text-gray-600">Ajouter un nouveau projet</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Statistiques du Portfolio</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              <p className="text-sm text-gray-600">Projets</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">2,456</p>
              <p className="text-sm text-gray-600">Vues totales</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">89</p>
              <p className="text-sm text-gray-600">Likes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Partages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}