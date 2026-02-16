# Spendbaker Backoffice

Back-office de gestion pour la plateforme SaaS Spendbaker, construit avec Next.js 14, React, TypeScript et le design system Spendbaker.

## 🚀 Fonctionnalités

- **Dashboard** : Vue d'ensemble avec statistiques des organisations et utilisateurs
- **Organisations** : Gestion complète des organisations (liste, filtres, recherche)
- **Utilisateurs** : Gestion des utilisateurs avec détails complets
- **Design System** : Interface cohérente basée sur shadcn/ui et le design system Spendbaker

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

2. Lancer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du projet

```
Back office/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Dashboard (page d'accueil)
│   ├── organizations/    # Page organisations
│   └── users/             # Pages utilisateurs
│       ├── page.tsx       # Liste des utilisateurs
│       └── [id]/          # Détail d'un utilisateur
├── components/
│   ├── ui/                # Composants UI (shadcn/ui)
│   └── layout/            # Composants de layout
│       ├── sidebar.tsx    # Barre latérale de navigation
│       └── main-layout.tsx # Layout principal
├── lib/
│   └── utils.ts           # Utilitaires (cn, etc.)
└── app/
    └── globals.css        # Styles globaux et design system
```

## 🎨 Design System

Le back-office utilise le design system Spendbaker avec :
- Composants shadcn/ui
- Tailwind CSS pour le styling
- Lucide React pour les icônes
- Variables CSS personnalisées pour les couleurs

### Couleurs principales

- **Primary** : Bleu (#5865F2)
- **Success** : Vert (#10B981)
- **Danger** : Rouge (#EF4444)
- **Warning** : Orange (#F59E0B)

## 📄 Pages disponibles

### Dashboard (`/`)
- Statistiques globales (organisations, utilisateurs, taux d'activation)
- Vue d'ensemble de la plateforme

### Organisations (`/organizations`)
- Liste des organisations
- Filtres par statut et plan
- Recherche
- Actions (modifier, voir utilisateurs, supprimer)

### Utilisateurs (`/users`)
- Liste des utilisateurs
- Filtres par plan et statut
- Recherche
- Dialog de détail avec onglets (Informations, Facturation, Activité)

### Détail Utilisateur (`/users/[id]`)
- Profil complet de l'utilisateur
- Onglets pour informations, facturation et activité
- Actions rapides (modifier, gérer abonnement, désactiver)

## 🔧 Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run start` : Lance le serveur de production
- `npm run lint` : Vérifie le code avec ESLint

## 📦 Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **React 18** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utility-first
- **shadcn/ui** : Composants UI réutilisables
- **Lucide React** : Icônes
- **Radix UI** : Composants primitifs accessibles

## 🔌 Connexion au Backend

**Tous les appels API sont centralisés dans `lib/api.ts`.**

Pour connecter votre backend, suivez le guide détaillé : **[API_INTEGRATION.md](./API_INTEGRATION.md)**

### Quick Start

1. Ouvrez `lib/api.ts`
2. Modifiez `USE_DEV_MODE = false` (ligne 18)
3. Remplacez les fonctions par vos appels API
4. Configurez `API_BASE_URL` dans `.env.local`

C'est tout ! 🎉

## 🎯 Prochaines étapes

- [x] Intégration avec l'API backend (structure prête dans `lib/api.ts`)
- [ ] Authentification et autorisation
- [ ] Graphiques et visualisations de données
- [ ] Export de données (CSV, PDF)
- [ ] Notifications en temps réel
- [ ] Mode sombre

## 📝 Notes

Le back-office utilise actuellement localStorage en mode développement. Pour la production :
1. Suivez le guide [API_INTEGRATION.md](./API_INTEGRATION.md)
2. Remplacez les fonctions dans `lib/api.ts` par vos appels API
3. Implémentez l'authentification dans `apiCall()`
4. Testez toutes les fonctionnalités
