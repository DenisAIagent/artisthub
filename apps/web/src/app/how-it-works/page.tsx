'use client';

import { useState, useEffect } from 'react';

const steps = [
  {
    id: 1,
    title: "Je crée mon compte",
    description: "Inscription rapide en choisissant votre rôle professionnel",
    details: [
      "Choisissez votre rôle : Artiste, Manager, Marketing, Booking, Finance ou Presse",
      "Complétez vos informations personnelles",
      "Accédez immédiatement à votre dashboard personnalisé"
    ],
    icon: "👤",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Je crée un profil artiste",
    description: "Configuration du profil artistique complet",
    details: [
      "Ajoutez les informations de l'artiste (nom, genre musical, bio)",
      "Uploadez photos, logos et visuels",
      "Configurez les liens vers les plateformes (Spotify, Apple Music, etc.)",
      "Définissez les objectifs et KPI à suivre"
    ],
    icon: "🎵",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    title: "J'invite mon équipe",
    description: "Collaboration avec tous les métiers de la musique",
    details: [
      "Invitez vos collaborateurs par email",
      "Chaque membre accède aux données selon son rôle",
      "Permissions granulaires par section (marketing, finance, booking)",
      "Communication centralisée sur les projets"
    ],
    icon: "👥",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 4,
    title: "Je connecte mes plateformes",
    description: "Synchronisation automatique des données",
    details: [
      "Connectez Spotify, Apple Music, Deezer pour les streams",
      "Intégrez vos réseaux sociaux (Instagram, TikTok, YouTube)",
      "Synchronisez vos outils de booking et billetterie",
      "Importez vos données financières"
    ],
    icon: "🔗",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 5,
    title: "Je lance mes campagnes",
    description: "Gestion complète des projets artistiques",
    details: [
      "Créez des campagnes pour vos sorties",
      "Planifiez vos actions marketing et promo",
      "Organisez vos tournées et concerts",
      "Suivez les performances en temps réel"
    ],
    icon: "🚀",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 6,
    title: "J'analyse mes résultats",
    description: "Dashboard complet avec toutes vos métriques",
    details: [
      "Métriques d'audience unifiées",
      "Analyse des revenus par source",
      "ROI des campagnes marketing",
      "Rapports automatiques pour l'équipe"
    ],
    icon: "📊",
    color: "from-indigo-500 to-purple-600"
  }
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6 animate-in slide-in-from-bottom-4 duration-1000">
            Comment ça marche ?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Découvrez comment ArtistHub révolutionne la gestion de carrière artistique en 6 étapes simples.
            De la création de compte à l'analyse des performances, tout est pensé pour votre succès.
          </p>
        </div>

        {/* Steps Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-400">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                activeStep === step.id
                  ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-105`
                  : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 hover:shadow-lg'
              }`}
            >
              <span className="mr-2">{step.icon}</span>
              Étape {step.id}
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50 mb-16">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`transition-all duration-500 ${
                activeStep === step.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
              }`}
            >
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {step.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{step.title}</h2>
                  <p className="text-xl text-gray-600">{step.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {step.details.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 font-medium">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/50 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Votre parcours sur ArtistHub
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, index) => (
              <div key={step.id} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-2xl shadow-lg mb-4 hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute mt-8 left-full w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-x-3"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers d'artistes qui utilisent déjà ArtistHub pour développer leur carrière.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group">
              <span className="relative z-10">Créer mon compte</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button className="border border-gray-300/60 bg-white/80 backdrop-blur-sm hover:bg-gray-50/90 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden group">
              <span className="relative z-10">Voir une démo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}