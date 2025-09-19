'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Step {
  id: number;
  title: string;
  description: string;
  action: string;
  href?: string;
  completed?: boolean;
}

const OnboardingGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const steps: Step[] = [
    {
      id: 1,
      title: "Créez votre profil artistique",
      description: "Renseignez vos informations personnelles, vos spécialités et votre expérience artistique.",
      action: "Compléter mon profil",
      href: "/profile"
    },
    {
      id: 2,
      title: "Ajoutez vos premiers projets",
      description: "Construisez votre portfolio en ajoutant vos œuvres, albums, singles ou collaborations.",
      action: "Créer mon portfolio",
      href: "/portfolio"
    },
    {
      id: 3,
      title: "Organisez vos contacts",
      description: "Ajoutez vos contacts professionnels : managers, producteurs, agents, collaborateurs.",
      action: "Gérer mes contacts",
      href: "/contacts"
    },
    {
      id: 4,
      title: "Découvrez d'autres artistes",
      description: "Explorez la communauté, trouvez de nouveaux collaborateurs et développez votre réseau.",
      action: "Explorer les artistes",
      href: "/artists"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeGuide = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Guide de démarrage</h2>
          <button
            onClick={closeGuide}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id}
                  </div>
                  {step.id < steps.length && (
                    <div
                      className={`w-8 h-1 ${
                        step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentStepData.description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {currentStepData.href ? (
            <Link
              href={currentStepData.href}
              onClick={closeGuide}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors inline-block text-center"
            >
              {currentStepData.action}
            </Link>
          ) : (
            <button
              onClick={nextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {currentStepData.action}
            </button>
          )}

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Précédent
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === steps.length
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Suivant
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={closeGuide}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Ignorer le guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;