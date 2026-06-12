import * as React from "react";
import { biens, euros, type Bien } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function FeaturedListings() {
  const selection = biens.slice(0, 8);
  const reduced = usePrefersReducedMotion();

  return (
    <section id="biens" className="home-section surface-ivory hairline-center overflow-hidden">
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

        {/* Carrousel (ou repli statique si mouvement réduit) */}
        <Reveal y={32}>
          {reduced ? (
            <StaticRow items={selection} />
          ) : (
            <Marquee items={selection} />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Ruban défilant + mise en avant au centre
   --------------------------------------------------------- */
function Marquee({ items }: { items: Bien[] }) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  // Liste dupliquée pour une boucle continue (translateX -50%).
  const ribbon = [...items, ...items];

  React.useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let raf = 0;
    const tick = () => {
      const vp = viewport.getBoundingClientRect();
      const center = vp.left + vp.width / 2;
      const half = vp.width / 2 || 1;
      const els = Array.from(
        track.querySelectorAll<HTMLElement>("[data-card]")
      );
      // Lecture groupée puis écriture groupée (évite le layout thrashing).
      const rects = els.map((el) => el.getBoundingClientRect());
      els.forEach((el, i) => {
        const r = rects[i];
        const c = r.left + r.width / 2;
        const norm = Math.min(Math.abs(center - c) / half, 1); // 0 centre → 1 bord
        const scale = 1.04 - norm * 0.24; // centre ≈1.04 → bord ≈0.80
        const opacity = 1 - norm * 0.5; // centre 1 → bord 0.5
        el.style.transform = `scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(scale * 100));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={viewportRef}
      className="group/marquee relative -mx-[clamp(2rem,6vw,6rem)] overflow-hidden"
    >
      {/* Dégradés latéraux (fond → transparent) pour des bords épurés */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[var(--ivory)] to-transparent lg:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[var(--ivory)] to-transparent lg:w-28" />

      <div
        ref={trackRef}
        className="br-marquee flex w-max py-8 group-hover/marquee:[animation-play-state:paused]"
      >
        {ribbon.map((b, i) => (
          <BienCard
            key={`${b.ref}-${i}`}
            bien={b}
            className="mr-6 w-[92vw] shrink-0 sm:w-[416px] lg:mr-7"
          />
        ))}
      </div>
    </div>
  );
}

/* Repli sans animation (prefers-reduced-motion) : rangée défilable à la main. */
function StaticRow({ items }: { items: Bien[] }) {
  return (
    <div className="-mx-[clamp(2rem,6vw,6rem)] flex snap-x snap-mandatory gap-6 overflow-x-auto px-[clamp(2rem,6vw,6rem)] pb-4 lg:gap-7">
      {items.map((b) => (
        <BienCard
          key={b.ref}
          bien={b}
          className="w-[92vw] shrink-0 snap-center sm:w-[416px]"
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Carte de bien (style existant conservé) — cliquable
   --------------------------------------------------------- */
function BienCard({ bien, className }: { bien: Bien; className?: string }) {
  const pieces = bien.pieces <= 1 ? "Studio" : `${bien.pieces} pièces`;
  return (
    <div data-card className={cn("will-change-[transform,opacity]", className)}>
      <a href="#contact" className="group/card block">
        <div className="relative aspect-[4/3.1] overflow-hidden rounded-sm bg-muted">
          <span className="absolute left-4 top-4 z-10 rounded-full bg-background/95 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.2em]">
            {bien.type}
          </span>
          <span className="absolute bottom-4 right-4 z-10 translate-y-2 rounded-sm bg-primary px-3 py-1 font-serif text-xl text-primary-foreground opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
            {euros(bien.prix)}
          </span>
          <img
            src={bien.img}
            alt={bien.titre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.07]"
          />
        </div>
        <div className="pt-4">
          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            {bien.arr}
          </span>
          <h3 className="mt-1 font-serif text-2xl font-medium leading-tight">
            {bien.titre}
          </h3>
          <div className="mt-3 flex gap-5 border-t border-border pt-3 text-sm text-muted-foreground">
            <span>{pieces}</span>
            <span>{bien.surface} m²</span>
            <span>Réf. {bien.ref}</span>
          </div>
        </div>
      </a>
    </div>
  );
}

/* ---------------------------------------------------------
   Hook : préférence "réduire les animations"
   --------------------------------------------------------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
