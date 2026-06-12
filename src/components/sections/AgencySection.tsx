import * as React from "react";
import { animate, useInView } from "framer-motion";
import { agence } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export function AgencySection() {
  return (
    <section id="agence" className="home-section surface-white">
      <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1fr] md:gap-24">
        {/* Visuel */}
        <Reveal className="overflow-hidden rounded-sm">
          <div className="group mx-auto aspect-[4/4.6] w-[70%] overflow-hidden rounded-sm">
            <picture>
              <source srcSet="/agence.webp" type="image/webp" />
              <img
                src="/agence.jpg"
                alt="Les bureaux de BR Immobilier à Paris"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </picture>
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
            <p className="measure mt-6 text-muted-foreground">
              Spécialiste de la vente et de l'acquisition à Paris et en Île-de-France, BR Immobilier
              conjugue exigence, discrétion et connaissance fine du terrain.
            </p>
            <p className="measure mt-4 text-muted-foreground">
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

          {/* Compteur de statistiques animé (montée au scroll) */}
          <Reveal delay={0.36}>
            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-border pt-8 sm:grid-cols-3 sm:gap-6">
              <StatCounter prefix="Top " value={10} label="des agences les plus dynamiques" />
              <StatCounter prefix="+ de " value={350} label="projets de vente et d'achat en 2025" delay={0.1} />
              <StatCounter prefix="+ de " value={30} label="collaborateurs dévoués" delay={0.2} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * StatCounter — chiffre animé de 0 → `value` (décélération douce),
 * déclenché une seule fois quand l'élément entre dans le viewport.
 * Respecte prefers-reduced-motion (affiche directement la valeur).
 */
function StatCounter({
  value,
  label,
  prefix = "",
  delay = 0,
}: {
  value: number;
  label: string;
  prefix?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const numRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  React.useEffect(() => {
    const node = numRef.current;
    if (!inView || !node) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      node.textContent = value.toLocaleString("fr-FR");
      return;
    }

    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        node.textContent = Math.round(v).toLocaleString("fr-FR");
      },
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <div ref={ref}>
      <p className="font-serif text-4xl font-medium leading-none text-foreground md:text-5xl">
        {prefix}
        <span ref={numRef}>0</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
