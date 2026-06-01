# BR Immobilier — App React (Vite + TypeScript + Tailwind + shadcn)

Projet contenant le composant **HeroSection** (`hero-section-4`) avec **fond vidéo**, intégré
dans la structure shadcn (`src/components/ui`).

## ⚠️ Prérequis : installer Node.js

Node / npm ne sont pas installés sur cette machine. Installez Node 18+ (https://nodejs.org)
puis vérifiez :

```bash
node -v
npm -v
```

## Installation & lancement

```bash
cd "app"
npm install          # installe React, Vite, Tailwind, framer-motion, @radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge…
npm run dev          # démarre le serveur de dev (http://localhost:5173)
```

Build de production :

```bash
npm run build
npm run preview
```

## Dépendances clés (déjà déclarées dans package.json)

- **Composant** : `framer-motion`, `@radix-ui/react-slot`, `class-variance-authority`
- **Utilitaire `cn`** : `clsx`, `tailwind-merge`
- **Icônes** : `lucide-react`
- **Toolchain** : `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`

## Structure shadcn

```
app/
├─ components.json              # config shadcn (alias @/components/ui)
├─ tailwind.config.js           # tokens couleur = palette BR (#222222 / #ece2dc)
├─ src/
│  ├─ index.css                 # @tailwind + variables CSS (thème)
│  ├─ lib/utils.ts              # cn()
│  ├─ components/ui/
│  │  ├─ button.tsx             # shadcn Button
│  │  └─ hero-section-4.tsx     # HeroSection (fond vidéo)
│  └─ App.tsx                   # page d'accueil → <HeroSection />
└─ public/
   ├─ paris.mp4                 # fond vidéo du héro
   ├─ logo.png                  # favicon / logo
   └─ poster.jpg               # image d'attente de la vidéo
```

### Pourquoi `src/components/ui` est important
La CLI shadcn et le composant lui-même importent via l'alias **`@/components/ui/...`**
(résolu vers `src/`). Placer les composants ailleurs casserait ces imports
(`@/components/ui/button`, `@/components/ui/hero-section-4`) et empêcherait
`npx shadcn@latest add ...` de retrouver/mettre à jour les composants.

## Modifications apportées au composant (selon consignes)
- **Fond vidéo** : la `<div>` `backgroundImage` a été remplacée par une balise
  `<video autoplay loop muted playsInline object-cover>` plein écran (prop `videoUrl`).
- **Voile supprimé** : la `<div className="bg-black/20">` a été retirée.
- **Lisibilité** : ombre portée sur le titre/sous-titre + léger dégradé sombre **limité à la
  zone du texte** (jamais sur toute la surface).
- **Souris** : aucun effet de parallaxe/mousemove (le composant n'en contient pas).
- **Contenu réel** : titre, sous-titre et boutons renseignés avec le contenu BR Immobilier.
