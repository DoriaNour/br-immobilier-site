import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/ui/hero-section-4";
import { HeroSearch } from "@/components/HeroSearch";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { TeamCarousel } from "@/components/sections/TeamCarousel";
import { AgencySection } from "@/components/sections/AgencySection";

function App() {
  return (
    <>
      <Header />
      <main>
        {/* Héro — fond vidéo, contenu réel BR Immobilier */}
        <HeroSection
          id="accueil"
          videoUrl="/paris.mp4"
          posterUrl="/poster.jpg"
        >
          {/* Barre de recherche (remplace les deux boutons d'action) */}
          <HeroSearch />
        </HeroSection>

        {/* Avis clients (haut de page) */}
        <ReviewsSection />

        {/* Biens en vedette */}
        <FeaturedListings />

        {/* Carrousel des négociateurs */}
        <TeamCarousel />

        {/* Présentation de l'agence */}
        <AgencySection />
      </main>
      <Footer />
    </>
  );
}

export default App;
