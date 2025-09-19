export default function ContactsPage() {
  const contacts = [
    {
      id: 1,
      name: "Marie Dubois",
      type: "Manager",
      company: "Star Management",
      email: "marie@starmanagement.fr",
      phone: "+33 6 12 34 56 78",
      lastContact: "Il y a 2 jours"
    },
    {
      id: 2,
      name: "Pierre Martin",
      type: "Producteur",
      company: "Blue Studios",
      email: "pierre@bluestudios.com",
      phone: "+33 6 98 76 54 32",
      lastContact: "Il y a 1 semaine"
    },
    {
      id: 3,
      name: "Sophie Chen",
      type: "Agent de booking",
      company: "Live Events Co",
      email: "sophie@liveevents.com",
      phone: "+33 6 11 22 33 44",
      lastContact: "Il y a 3 jours"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mes Contacts</h1>
          <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md transition-colors">
            + Nouveau contact
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            placeholder="Rechercher un contact..."
            className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-2"
          />
          <select className="bg-white/10 border border-white/20 rounded-md px-4 py-2">
            <option>Tous les types</option>
            <option>Manager</option>
            <option>Producteur</option>
            <option>Agent de booking</option>
            <option>Label</option>
          </select>
        </div>

        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-gray-600 text-sm">{contact.type} • {contact.company}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Dernier contact:</p>
                  <p className="text-sm text-gray-700">{contact.lastContact}</p>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email:</p>
                  <p className="text-sm text-gray-700">{contact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone:</p>
                  <p className="text-sm text-gray-700">{contact.phone}</p>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm transition-colors">
                  Envoyer email
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm transition-colors">
                  Appeler
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded text-sm transition-colors">
                  Modifier
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-sm transition-colors">
                  Ajouter une note
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Statistiques</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total contacts:</span>
                <span className="font-bold text-gray-900">{contacts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contactés ce mois:</span>
                <span className="font-bold text-gray-900">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nouveaux ce mois:</span>
                <span className="font-bold text-gray-900">3</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Actions rapides</h3>
            <div className="space-y-2">
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md p-2 text-left text-sm transition-colors">
                Importer contacts CSV
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md p-2 text-left text-sm transition-colors">
                Exporter la liste
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md p-2 text-left text-sm transition-colors">
                Créer un groupe
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Rappels</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded">
                Relancer Marie Dubois - Demain
              </div>
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-2 rounded">
                Rendez-vous avec Pierre - Vendredi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}