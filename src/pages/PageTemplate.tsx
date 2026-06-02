import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageTemplateProps {
  title: string;
  eyebrow?: string;
}

/**
 * Gabarit de page provisoire — même charte que le site.
 * Affiche le titre de l'intitulé + un bloc « À COMPLÉTER ».
 */
export function PageTemplate({ title, eyebrow = "BR Immobilier" }: PageTemplateProps) {
  return (
    <section className="min-h-[70vh] bg-background px-6 pb-24 pt-40 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>

        <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl font-medium leading-tight md:text-6xl">{title}</h1>

        <div className="mt-10 rounded-sm border border-dashed border-border bg-muted/40 p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground">À COMPLÉTER</p>
          <p className="mt-3 max-w-prose text-muted-foreground">
            Cette page « {title} » est un gabarit prêt à être complété. Le contenu définitif
            (textes, visuels, fonctionnalités) sera ajouté ultérieurement.
          </p>
        </div>
      </div>
    </section>
  );
}
