import { avisGlobal } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

export function ReviewsSection() {
  const { note, total, source, liste } = avisGlobal;

  return (
    <section id="avis" className="home-section surface-white hairline-top elevate-top">
      <div className="mx-auto max-w-none">
        {/* En-tête */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
              Avis clients vérifiés
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              La confiance de nos clients
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex items-center gap-5">
            <div className="font-serif text-6xl leading-none md:text-7xl">
              {note.toString().replace(".", ",")}
              <span className="text-3xl text-muted-foreground">/5</span>
            </div>
            <div>
              <div className="text-lg tracking-[3px]">★★★★★</div>
              <div className="mt-1 text-sm tracking-wide text-muted-foreground">
                {total} avis contrôlés · {source}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Cartes d'avis */}
        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {liste.map((a) => (
            <RevealItem key={a.auteur + a.date}>
              <article className="flex h-full flex-col gap-4 rounded-sm border border-border bg-background p-8 transition-transform duration-500 hover:-translate-y-1.5">
                <div className="text-sm tracking-[2px]">{"★".repeat(a.note)}</div>
                <p className="font-serif text-2xl leading-snug">
                  « {a.texte}
                  {a.truncated ? "…" : ""} »
                </p>
                <div className="mt-auto text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {a.auteur} · {a.date}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="measure mt-8 text-sm italic text-muted-foreground">
          Avis vérifiés Opinion System (certificat n°10870). Certains textes complets ne sont pas
          extractibles automatiquement — verbatim intégral : <strong>À COMPLÉTER</strong>.
        </p>
      </div>
    </section>
  );
}
