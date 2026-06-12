// components/ui/hero-section-4.tsx

import * as React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Props : on remplace `imageUrl` par `videoUrl` (la vidéo sert de fond du héro)
interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  videoUrl: string;
  posterUrl?: string; // image affichée le temps que la vidéo charge (facultatif)
  onExplore?: () => void; // clic sur l'indicateur « explorer » → défile vers la recherche
  exploreLabel?: string; // libellé de l'indicateur (défaut : « Explorer »)
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

/* =========================================================
   Révélation par cadre (intro « push-in ») du fond vidéo.
   Au montage : le fond apparaît dans un cadre vertical étroit
   centré sur fond anthracite, puis s'ouvre lentement (clip-path
   inset → 0) jusqu'au plein écran, pendant que la vidéo se
   dézoome (scale 1.2 → 1). Joué une seule fois. Respecte
   prefers-reduced-motion. N'anime que clip-path / transform.
   ========================================================= */
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const REVEAL_DURATION = 5;
// Cadre de départ : ~22 % largeur × ~48 % hauteur, centré (mobile : plus large)
const REVEAL_CLIP_DESKTOP = "inset(26% 39% 26% 39%)";
const REVEAL_CLIP_MOBILE = "inset(24% 24% 24% 24%)";
const REVEAL_CLIP_FULL = "inset(0% 0% 0% 0%)";

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title,
      subtitle,
      videoUrl,
      posterUrl,
      onExplore,
      exploreLabel = "Explorer",
      children,
      ...props
    },
    ref
  ) => {
    const reduce = useReducedMotion();
    // Calcul unique avant le premier rendu (jouée une fois au montage)
    const [initialClip] = React.useState(() =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches
        ? REVEAL_CLIP_MOBILE
        : REVEAL_CLIP_DESKTOP
    );
    const [revealDone, setRevealDone] = React.useState(false);

    return (
      <section
        ref={ref}
        className={cn(
          // `isolate` : la section devient un contexte d'empilement, pour que la
          // vidéo (z-0) se peigne AU-DESSUS du fond anthracite et non derrière.
          // Fond anthracite : visible autour du cadre pendant l'intro.
          "relative isolate flex h-screen min-h-[700px] w-full flex-col overflow-hidden bg-[#222222]",
          className
        )}
        {...props}
      >
        {/* Fond vidéo plein écran — révélé par cadre (clip-path) au montage.
            z-0 : au-dessus du fond anthracite de la section, sous le contenu (z-10). */}
        <motion.div
          className="absolute inset-0 z-0 h-full w-full overflow-hidden"
          initial={reduce ? false : { clipPath: initialClip }}
          animate={{ clipPath: REVEAL_CLIP_FULL }}
          transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE }}
          style={{ willChange: revealDone ? "auto" : "clip-path" }}
          onAnimationComplete={() => setRevealDone(true)}
        >
          <motion.video
            className="h-full w-full object-cover"
            initial={reduce ? false : { scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE }}
            style={{ willChange: revealDone ? "auto" : "transform" }}
            autoPlay
            loop
            muted
            playsInline
            poster={posterUrl}
            aria-hidden="true"
          >
            <source src={videoUrl} type="video/mp4" />
          </motion.video>
        </motion.div>

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

        {/* Zone d'action optionnelle (rétro-compat : si des enfants sont fournis) */}
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

        {/* Bouton « explorer » : pilule anthracite + souris animée, défile vers la recherche.
            Anneau crème + ombre douce pour rester lisible par-dessus la vidéo.
            Le conteneur (statique) porte le centrage left:50% + translateX(-50%) : ainsi
            framer-motion qui pilote le `transform` du bouton (entrée y/opacity) n'écrase
            jamais ce centrage. Centre du bouton = centre exact de la page (= sous le logo). */}
        {onExplore && (
          <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
            <motion.button
              type="button"
              onClick={onExplore}
              aria-label={exploreLabel}
              className="flex items-center gap-3.5 rounded-full bg-primary/90 px-6 py-3 text-primary-foreground shadow-[0_6px_28px_rgba(0,0,0,0.4)] ring-1 ring-primary-foreground/30 backdrop-blur-sm transition-colors duration-300 hover:bg-primary"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: REVEAL_EASE, delay: reduce ? 0 : 1.6 }}
            >
              {/* Souris : contour crème + point qui descend en boucle */}
              <span
                aria-hidden="true"
                className="relative flex h-[28px] w-[18px] justify-center rounded-full border-2 border-primary-foreground/85"
              >
                <motion.span
                  className="absolute top-[5px] h-1.5 w-1.5 rounded-full bg-primary-foreground"
                  animate={reduce ? undefined : { y: [0, 9, 0], opacity: [1, 0.35, 1] }}
                  transition={
                    reduce
                      ? undefined
                      : { duration: 1.6, ease: "easeInOut", repeat: Infinity }
                  }
                />
              </span>
              <span className="text-[0.78rem] font-medium uppercase tracking-[0.3em]">
                {exploreLabel}
              </span>
            </motion.button>
          </div>
        )}
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
