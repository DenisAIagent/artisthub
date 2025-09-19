# 🎵 ArtistHub CRM Platform

ArtistHub est une plateforme CRM complète dédiée à la gestion de carrières artistiques. Conçue pour les artistes, managers, et professionnels de l'industrie musicale, elle centralise tous les aspects de la gestion artistique : marketing, booking, finance, presse, et production.

## ✨ Fonctionnalités

### 🎯 Pour chaque métier de la musique
- **Artiste** : Vue consolidée de votre carrière, métriques globales
- **Marketing** : Campagnes, réseaux sociaux, analytics audience
- **Booking/Tournée** : Venues, contrats, routing, settlements
- **Finance** : Revenus, dépenses, royalties, reporting comptable
- **Presse** : Contacts médias, interviews, coverage
- **Production** : Albums, tracks, streaming stats

### 🚀 Fonctionnalités techniques
- **Dashboard en temps réel** avec métriques live
- **Authentification JWT** sécurisée
- **Interface moderne** avec Tailwind CSS
- **API REST** complète
- **Architecture monorepo** avec Turbo
- **Gestion d'état** avec React Query

## 🏗️ Architecture technique

### Frontend
- **Next.js 14** (App Router)
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design
- **React Query** pour la gestion d'état serveur
- **Axios** pour les appels API

### Backend
- **Express.js** avec TypeScript
- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe
- **Sequelize** (SQLite/PostgreSQL ready)
- **Helmet** et middleware de sécurité

### Infrastructure
- **Monorepo** avec pnpm workspaces
- **Turbo** pour la gestion des builds
- **ESLint** et **Prettier** configurés
- **Docker** ready avec docker-compose

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone le repository
git clone https://github.com/DenisAIagent/artisthub.git
cd artisthub

# Installation des dépendances
pnpm install

# Lancement en mode développement
pnpm dev
```

### Accès à l'application

- **Frontend** : http://localhost:3004
- **API** : http://localhost:8002
- **Health check** : http://localhost:8002/health

### Comptes de démonstration

```
Artiste : demo@artisthub.com / demo123
Manager : manager@artisthub.com / demo123
```

## 📁 Structure du projet

```
artisthub/
├── apps/
│   ├── web/                 # Frontend Next.js
│   │   ├── src/app/         # Pages et layouts
│   │   ├── src/components/  # Composants React
│   │   ├── src/contexts/    # Contexts React
│   │   ├── src/hooks/       # Hooks personnalisés
│   │   └── src/lib/         # Utilitaires et API
│   └── api/                 # Backend Express.js
│       ├── src/controllers/ # Contrôleurs API
│       ├── src/models/      # Modèles de données
│       ├── src/routes/      # Routes API
│       └── src/middleware/  # Middleware Express
├── packages/
│   ├── shared/              # Code partagé
│   ├── ui/                  # Composants UI
│   └── config/              # Configurations
└── docs/                    # Documentation
```

## 🔐 Authentification

Le système d'authentification utilise JWT avec les fonctionnalités suivantes :

- **Inscription/Connexion** sécurisées
- **Tokens JWT** avec expiration 24h
- **Protection des routes** automatique
- **Middleware de validation** sur l'API
- **Gestion des rôles** (artist, manager, admin)

## 📊 API Endpoints

### Authentification
```
POST /api/v1/auth/login      # Connexion
POST /api/v1/auth/register   # Inscription
GET  /api/v1/auth/me         # Profil utilisateur
POST /api/v1/auth/logout     # Déconnexion
```

### Données
```
GET /api/v1/artists          # Liste des artistes
GET /api/v1/dashboard/stats  # Statistiques dashboard
GET /api/v1/statistics/overview # Analytics globales
```

## 🎨 Design System

- **Couleurs** : Palette blue/indigo/purple avec dégradés
- **Typography** : Inter font avec hiérarchie claire
- **Components** : Design system cohérent avec Tailwind
- **Responsive** : Mobile-first approach
- **Animations** : Transitions fluides et micro-interactions

## 🧪 Tests et qualité

```bash
# Linting
pnpm lint

# Type checking
pnpm type-check

# Tests (à venir)
pnpm test
```

## 🚢 Déploiement

### Développement
```bash
pnpm dev
```

### Production
```bash
# Build
pnpm build

# Start
pnpm start
```

### Docker
```bash
docker-compose up --build
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔗 Liens utiles

- [Documentation API](./api-structure.md)
- [Architecture Auth](./auth-architecture.md)
- [Guide d'implémentation](./implementation-guidelines.md)

---

**Développé avec ❤️ pour la communauté musicale**

🤖 Généré avec [Claude Code](https://claude.ai/code)