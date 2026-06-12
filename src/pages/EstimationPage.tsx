import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { SimulateurEstimation } from "@/components/estimation/SimulateurEstimation";

/**
 * Page /estimation — simulateur d'estimation immobilière.
 * (Offset haut pour passer sous l'en-tête fixe, comme PageTemplate.)
 *
 * 👉 Marge latérale du cadre : régler UNIQUEMENT `--cadre-marge` ci-dessous.
 *    (marge symétrique gauche/droite ; plus elle est petite, plus le cadre
 *     s'étend de bord à bord.)
 */
const CADRE_MARGE = "1.25rem"; // ← seule valeur à ajuster

export function EstimationPage() {
  return (
    <section
      className="min-h-[70vh] bg-secondary pb-24 pt-32 md:pt-40"
      style={{ "--cadre-marge": CADRE_MARGE } as CSSProperties}
    >
      {/* En-tête centré */}
      <div className="mx-auto mb-10 max-w-3xl px-6 text-center lg:px-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
            Estimation en ligne
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight md:text-5xl">
            Estimez votre bien
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Obtenez une première fourchette de prix en moins d'une minute, à
            partir des données publiques de ventes (DVF). Puis affinez avec un
            expert BR Immobilier.
          </p>
        </Reveal>
      </div>

      {/* Cadre blanc quasi pleine largeur — marge latérale = --cadre-marge */}
      <Reveal delay={0.1}>
        <div className="mx-[var(--cadre-marge)] rounded-xl border border-border bg-background p-6 shadow-[0_24px_60px_-32px_rgba(34,34,34,0.25)] sm:p-8 md:p-10">
          <SimulateurEstimation />
        </div>
      </Reveal>

      {/* Section explicative — alignée sur le cadre */}
      <Reveal delay={0.16}>
        <section className="mx-[var(--cadre-marge)] mt-12 md:mt-16">
          {/* TODO: texte explicatif à remplir */}
        </section>
      </Reveal>
    </section>
  );
}
