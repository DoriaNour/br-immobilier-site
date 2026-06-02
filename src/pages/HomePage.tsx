import { HeroSection } from "@/components/ui/hero-section-4";
import { HeroSearch } from "@/components/HeroSearch";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { TeamCarousel } from "@/components/sections/TeamCarousel";
import { AgencySection } from "@/components/sections/AgencySection";

export function HomePage() {
  return (
    <>
      {/* Héro — fond vidéo, barre de recherche */}
      <HeroSection
        id="accueil"
        videoUrl="/paris.mp4"
        posterUrl="/poster.jpg"
      >
        <HeroSearch />
      </HeroSection>

      <ReviewsSection />
      <FeaturedListings />
      <TeamCarousel />
      <AgencySection />
    </>
  );
}
