import { agence } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

/* =========================================================
   Contact — section provisoire « À COMPLÉTER »
   Coordonnées réelles depuis data/site.ts (agence).
   Le formulaire n'est pas encore relié à un back-end → À COMPLÉTER.
   ========================================================= */

export function ContactSection() {
  return (
    <section id="contact" className="home-section surface-white hairline-top elevate-top">
      <div className="grid items-start gap-12 md:grid-cols-2 md:gap-24">
        {/* Coordonnées (réelles) */}
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">Nous écrire</p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">Contact</h2>
            <p className="measure mt-6 text-muted-foreground">
              Un projet d'achat ou de vente ? Notre équipe vous répond et vous accompagne à chaque
              étape.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-9 space-y-5">
              <li className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                <span className="text-muted-foreground">{agence.adresse}</span>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                <a href={`tel:${agence.telBrut}`} className="text-muted-foreground hover:text-foreground">
                  {agence.tel}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                <a href={`mailto:${agence.email}`} className="text-muted-foreground hover:text-foreground">
                  {agence.email}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-7 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {agence.zone}
            </p>
          </Reveal>
        </div>

        {/* Formulaire provisoire — À COMPLÉTER (pas encore relié à un back-end) */}
        <Reveal delay={0.12}>
          <form
            className="rounded-sm border border-border bg-background p-7 md:p-9"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="mb-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              À COMPLÉTER — formulaire à relier (envoi e-mail / back-end)
            </p>
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Prénom" name="prenom" autoComplete="given-name" />
                <Field label="Nom" name="nom" autoComplete="family-name" />
              </div>
              <Field label="E-mail" name="email" type="email" autoComplete="email" />
              <Field label="Téléphone" name="tel" type="tel" autoComplete="tel" />
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Votre message
                </span>
                <textarea
                  name="message"
                  rows={4}
                  className="mt-2 w-full resize-none rounded-sm border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                  placeholder="À COMPLÉTER…"
                />
              </label>
              <button
                type="submit"
                className="group mt-1 inline-flex items-center justify-center gap-2 rounded-sm bg-foreground px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90"
              >
                Envoyer
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-sm border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
      />
    </label>
  );
}
