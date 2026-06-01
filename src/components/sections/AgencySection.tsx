import { agence } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export function AgencySection() {
  return (
    <section id="agence" className="px-6 py-20 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-none items-center gap-12 md:grid-cols-2 md:gap-20">
        {/* Visuel */}
        <Reveal className="overflow-hidden rounded-sm">
          <div className="group aspect-[4/4.6] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&w=1200&q=80"
              alt="L'agence BR Immobilier"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          </div>
        </Reveal>

        {/* Texte */}
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">L'agence</p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Au cœur du 1ᵉʳ arrondissement
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-prose text-muted-foreground">
              Spécialiste de la vente et de l'acquisition à Paris et en Île-de-France, BR Immobilier
              conjugue exigence, discrétion et connaissance fine du terrain.
            </p>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Notre cabinet réunit <strong className="text-foreground">30 collaborateurs</strong>{" "}
              spécialisés en transaction immobilière, avec un objectif constant : que chaque étape se
              déroule avec fluidité et sérénité.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {agence.partenaires.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] text-muted-foreground"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.28}>
            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-2 border-b border-foreground pb-1 text-xs uppercase tracking-[0.18em]"
            >
              Prendre rendez-vous
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
