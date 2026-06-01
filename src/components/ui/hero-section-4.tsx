// components/ui/hero-section-4.tsx

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Props : on remplace `imageUrl` par `videoUrl` (la vidéo sert de fond du héro)
interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  videoUrl: string;
  posterUrl?: string; // image affichée le temps que la vidéo charge (facultatif)
  // `children` : contenu d'action sous le sous-titre (ex. la barre de recherche)
}

// Orchestration des animations d'apparition au chargement
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Variants des enfants (titre, sous-titre, boutons) : fondu + translation douce
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title,
      subtitle,
      videoUrl,
      posterUrl,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative flex h-screen min-h-[700px] w-full flex-col overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Fond vidéo plein écran (remplace l'ancienne image de fond) */}
        <video
          className="absolute inset-0 z-[-1] h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster={posterUrl}
          aria-hidden="true"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/*
          Voile global "bg-black/20" SUPPRIMÉ : la vidéo reste pleinement visible.
          Pour la lisibilité, un très léger dégradé sombre, limité à la zone du texte
          (jamais sur toute la surface), placé derrière le contenu.
        */}
        {(title || subtitle) && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[55%] w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/30 blur-3xl"
            aria-hidden="true"
          />
        )}

        {/* Contenu centré (titre + sous-titre) — occupe l'espace haut du héro */}
        <motion.div
          className="z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center text-primary-foreground"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Titre animé */}
          {title && (
            <motion.h1
              className="font-serif text-4xl font-medium tracking-tight [text-shadow:_0_2px_28px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl lg:text-7xl"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
          )}

          {/* Sous-titre animé */}
          {subtitle && (
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 [text-shadow:_0_1px_18px_rgba(0,0,0,0.55)] md:text-xl"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        {/* Zone d'action ancrée EN BAS du héro (barre de recherche) */}
        {children && (
          <motion.div
            className="z-10 w-full px-4 pb-10 sm:px-6 xl:absolute xl:inset-x-0 xl:bottom-[20%] xl:pb-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          >
            {children}
          </motion.div>
        )}
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
