import { biens, euros } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export function FeaturedListings() {
  const selection = biens.slice(0, 8);

  return (
    <section id="biens" className="px-6 py-20 md:py-28 lg:px-16">
      <div className="mx-auto max-w-none">
        {/* En-tête */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
              Sélection du moment
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Nos biens en vedette
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 border-b border-foreground pb-1 text-xs uppercase tracking-[0.18em]"
            >
              Voir tous les biens
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        </div>

        {/* Grille */}
        <RevealGroup className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {selection.map((b) => {
            const pieces = b.pieces <= 1 ? "Studio" : `${b.pieces} pièces`;
            return (
              <RevealItem key={b.ref}>
                <a href="#contact" className="group block">
                  <div className="relative aspect-[4/3.1] overflow-hidden rounded-sm bg-muted">
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-background/95 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.2em]">
                      {b.type}
                    </span>
                    <span className="absolute bottom-4 right-4 z-10 translate-y-2 rounded-sm bg-primary px-3 py-1 font-serif text-xl text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {euros(b.prix)}
                    </span>
                    <img
                      src={b.img}
                      alt={b.titre}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    />
                  </div>
                  <div className="pt-4">
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {b.arr}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl font-medium leading-tight">
                      {b.titre}
                    </h3>
                    <div className="mt-3 flex gap-5 border-t border-border pt-3 text-sm text-muted-foreground">
                      <span>{pieces}</span>
                      <span>{b.surface} m²</span>
                      <span>Réf. {b.ref}</span>
                    </div>
                  </div>
                </a>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
