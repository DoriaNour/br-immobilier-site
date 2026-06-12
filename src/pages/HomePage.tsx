import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { HeroSection } from "@/components/ui/hero-section-4";
import { HeroSearch } from "@/components/HeroSearch";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { TeamCarousel } from "@/components/sections/TeamCarousel";
import { AgencySection } from "@/components/sections/AgencySection";
import { CercleSection } from "@/components/sections/CercleSection";
import { SoldMap } from "@/components/sections/SoldMap";
import { SocialSection } from "@/components/sections/SocialSection";
import { ContactSection } from "@/components/sections/ContactSection";

// Identifiant de la section recherche (cible du bouton « explorer » du héro)
const SEARCH_SECTION_ID = "recherche";

export function HomePage() {
  const lenis = useLenis();
  const reduce = useReducedMotion();

  // Défile en douceur du héro vers la barre de recherche (réutilise Lenis si présent).
  const scrollToSearch = () => {
    const el = document.getElementById(SEARCH_SECTION_ID);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    /*
      Délimitation des sections — toutes en PLEINE LARGEUR (full-bleed),
      gouttières latérales constantes clamp(2rem, 6vw, 6rem) (cf. .home-section).
      Aucun fond consécutif identique :
        Héro (vidéo) → blanc → ivoire → blanc → ANTHRACITE(accent)
        → ivoire → blanc → ivoire-clair → blanc → Footer(anthracite)
      La rupture vient de la COMPOSITION interne (pas de la largeur) :
        asym. 2 col · en-tête réparti · en-tête centré · grille 3 col · etc.
      Leviers : fond + filet (hairline) + respiration + composition + élévation.
    */
    <>
      {/* 1. Héro — fond vidéo (révélation par cadre), indicateur « explorer » */}
      <HeroSection
        id="accueil"
        videoUrl="/paris.mp4"
        posterUrl="/poster.jpg"
        onExplore={scrollToSearch}
      />

      {/* 1bis. Recherche acquéreurs — plein écran, fond anthracite uni, minimaliste.
              Sortie du héro (Option B), révélée au défilement (fade-up). */}
      <section
        id={SEARCH_SECTION_ID}
        className="flex min-h-screen w-full flex-col items-center justify-center bg-primary px-6 py-24 text-primary-foreground"
      >
        <motion.div
          className="mx-auto flex w-full max-w-6xl flex-col items-center"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Sur-titre */}
          <p className="text-[0.78rem] font-medium uppercase tracking-[0.32em] text-primary-foreground/70">
            Trouvez votre bien
          </p>

          {/* Titre — Cormorant Garamond, crème */}
          <h2 className="mt-5 text-center font-serif text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
            Votre prochaine adresse
          </h2>

          {/* Barre de recherche existante (inchangée) */}
          <div className="mt-12 w-full sm:mt-14">
            <HeroSearch />
          </div>
        </motion.div>
      </section>

      {/* 2. Cabinet — blanc · grille asymétrique 2 col (visuel/texte), aligné à gauche */}
      <AgencySection />

      {/* 3. Biens en vedette — ivoire · en-tête réparti + ruban pleine largeur */}
      <FeaturedListings />

      {/* 4. Collaborateurs — blanc · en-tête centré + carrousel pleine largeur */}
      <TeamCarousel />

      {/* 5. Carte des biens vendus — ANTHRACITE (accent) · en-tête réparti + carte pleine largeur */}
      <SoldMap />

      {/* 6. Réseaux sociaux — ivoire · en-tête à gauche + grille 3 colonnes */}
      <SocialSection />

      {/* 7. Avis — blanc · en-tête réparti (note surdimensionnée) + grille 3 colonnes */}
      <ReviewsSection />

      {/* 8. Le Cercle BR — ivoire-clair · grille asymétrique (éditorial sticky / formulaire) */}
      <CercleSection />

      {/* 9. Contact — blanc · grille 2 colonnes équilibrée (coordonnées / formulaire) */}
      <ContactSection />
    </>
  );
}
