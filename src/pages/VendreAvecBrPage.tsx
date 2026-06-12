import { Reveal } from "@/components/Reveal";

/**
 * Page « Vendez avec BR Immobilier » (sous-catégorie de Vendre).
 * Gabarit provisoire harmonisé avec le reste du site — titre + sections
 * vides prêtes à être remplies. Offset haut pour passer sous l'en-tête fixe.
 */
export function VendreAvecBrPage() {
  return (
    <section className="min-h-[70vh] bg-background px-6 pb-24 pt-32 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
            Vendre
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight md:text-6xl">
            Vendez avec BR Immobilier
          </h1>
        </Reveal>

        {/* TODO: contenu à remplir — section d'introduction */}
        <Reveal delay={0.1}>
          <section className="mt-12">
            {/* TODO: contenu à remplir */}
            <div className="rounded-sm border border-dashed border-border bg-muted/40 p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground">
                À COMPLÉTER
              </p>
              <p className="mt-3 max-w-prose text-muted-foreground">
                Première section — argumentaire « Pourquoi vendre avec BR
                Immobilier ». Contenu à venir.
              </p>
            </div>
          </section>
        </Reveal>

        {/* TODO: contenu à remplir — deuxième section */}
        <Reveal delay={0.16}>
          <section className="mt-8">
            {/* TODO: contenu à remplir */}
            <div className="rounded-sm border border-dashed border-border bg-muted/40 p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground">
                À COMPLÉTER
              </p>
              <p className="mt-3 max-w-prose text-muted-foreground">
                Deuxième section — étapes de l'accompagnement / appel à l'action.
                Contenu à venir.
              </p>
            </div>
          </section>
        </Reveal>
      </div>
    </section>
  );
}
