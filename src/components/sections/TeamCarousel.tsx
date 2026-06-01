import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { equipe, initiales, type Membre } from "@/data/site";
import { getNegoStats } from "@/data/reviews";
import { Reveal } from "@/components/Reveal";
import { NegoReviewsModal } from "@/components/NegoReviewsModal";
import { cn } from "@/lib/utils";

export function TeamCarousel() {
  const [activeMembre, setActiveMembre] = React.useState<Membre | null>(null);
  const autoplay = React.useRef(
    Autoplay({ delay: 3200, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [autoplay.current]
  );

  const [selected, setSelected] = React.useState(0);
  const [snaps, setSnaps] = React.useState<number[]>([]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = React.useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="equipe" className="px-6 py-20 md:py-28 lg:px-16">
      <div className="mx-auto max-w-none">
        <Reveal className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
            Notre équipe
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
            Les collaborateurs BR Immobilier
          </h2>
        </Reveal>

        {/* Carrousel */}
        <Reveal delay={0.05}>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {equipe.map((m) => {
                const stats = getNegoStats(m.nom);
                return (
                  <div
                    key={m.nom}
                    className="min-w-0 shrink-0 grow-0 basis-[78%] pl-5 sm:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                  >
                    <article className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveMembre(m)}
                        aria-label={`Voir les avis de ${m.nom}`}
                        className="group relative grid aspect-[2/3] w-full place-items-center overflow-hidden rounded-sm border border-border bg-gradient-to-b from-secondary to-muted"
                      >
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt={m.nom}
                            loading="lazy"
                            style={{ objectPosition: "50% 0%", "--z": m.zoom ?? 1, "--ty": `${m.shiftY ?? 0}%`, "--tx": `${m.shiftX ?? 0}%` } as React.CSSProperties}
                            className="h-full w-full origin-top object-cover transition-transform duration-500 [transform:translate(var(--tx),var(--ty))_scale(var(--z))] group-hover:[transform:translate(var(--tx),var(--ty))_scale(calc(var(--z)*1.05))]"
                          />
                        ) : (
                          <>
                            <span className="font-serif text-5xl tracking-wide transition-transform duration-500 group-hover:scale-95">
                              {initiales(m.nom)}
                            </span>
                            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/70 px-2.5 py-1 text-[0.56rem] uppercase tracking-[0.18em] text-muted-foreground">
                              Photo · À COMPLÉTER
                            </span>
                          </>
                        )}

                        {/* Pastille nombre d'avis */}
                        {stats.count > 0 && (
                          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[0.6rem] font-medium tracking-wide text-primary-foreground">
                            ★ {stats.avg5?.toString().replace(".", ",")} · {stats.count}
                          </span>
                        )}

                        {/* Voile au survol */}
                        <span className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all duration-500 group-hover:bg-primary/45 group-hover:opacity-100">
                          <span className="rounded-full border border-primary-foreground/70 px-4 py-2 text-[0.66rem] uppercase tracking-[0.18em] text-primary-foreground">
                            {stats.count > 0 ? "Voir ses avis" : "Aucun avis"}
                          </span>
                        </span>
                      </button>
                      <h3 className="mt-4 font-serif text-xl font-medium">{m.nom}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        {m.fonction}
                      </p>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Navigation : flèches */}
        <div className="mt-10 flex items-center justify-center gap-5">
          <button
            onClick={scrollPrev}
            aria-label="Précédent"
            className="grid place-items-center rounded-full border border-border p-3.5 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Suivant"
            className="grid place-items-center rounded-full border border-border p-3.5 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation : points */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Aller à la diapositive ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === selected ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-sm italic text-muted-foreground">
          Photos des collaborateurs : 6 encore <strong>À COMPLÉTER</strong>. Cliquez sur une
          vignette pour voir les avis clients.
        </p>
      </div>

      {/* Modale des avis du négociateur */}
      <NegoReviewsModal membre={activeMembre} onClose={() => setActiveMembre(null)} />
    </section>
  );
}
