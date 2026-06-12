import { Facebook, Instagram, Linkedin, ArrowUpRight, type LucideIcon } from "lucide-react";
import { socials } from "@/data/nav";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ElfsightWidget } from "@/components/ElfsightWidget";

/* =========================================================
   Réseaux sociaux — les cases Instagram et Facebook hébergent
   leur fil Elfsight ; les autres restent des cartes-liens.
   ========================================================= */

const socialIcon: Record<"facebook" | "instagram" | "linkedin", LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

/** Accroche provisoire par réseau — à personnaliser plus tard. */
const teaser: Record<"facebook" | "instagram" | "linkedin", string> = {
  facebook: "Nos actualités et nos dernières ventes",
  instagram: "Les coulisses de l'agence au quotidien",
  linkedin: "Notre vie d'équipe et nos recrutements",
};

/** Classe du widget Elfsight par réseau (ajouter ici les futurs réseaux). */
const APP_CLASS: Partial<Record<"facebook" | "instagram" | "linkedin", string>> = {
  instagram: "elfsight-app-b1700d79-f25f-447f-9393-bd0ee796f944",
  facebook: "elfsight-app-f3e9c501-4d0e-4ae9-ae5a-21f9775f9ce8",
};

export function SocialSection() {
  return (
    <section id="reseaux" className="home-section surface-ivory">
      <div>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">Restons connectés</p>
          <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">Nos réseaux sociaux</h2>
          <p className="measure mt-6 text-muted-foreground">
            {/* À COMPLÉTER — texte d'introduction des réseaux sociaux */}
            Suivez BR Immobilier pour ne rien manquer de nos biens, de nos actualités et de la vie
            de l'agence.
          </p>
        </Reveal>

        {/* items-start : les cases avec fil (plus hautes) n'étirent pas les autres */}
        <RevealGroup className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((s) => {
            const Icon = socialIcon[s.icon];
            const aCompleter = s.href === "#";
            const appClass = APP_CLASS[s.icon];

            /* --- Cases Instagram / Facebook : hébergent le fil Elfsight --- */
            if (appClass) {
              return (
                <RevealItem key={s.icon}>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-background p-7">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border text-foreground">
                        <Icon className="h-6 w-6" />
                      </span>
                      <a
                        href={s.href}
                        target={aCompleter ? undefined : "_blank"}
                        rel="noreferrer"
                        aria-label={`Ouvrir ${s.label}`}
                        className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </a>
                    </div>
                    <div className="mt-8">
                      <h3 className="font-serif text-2xl font-medium">{s.label}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{teaser[s.icon]}</p>
                    </div>
                    {/* Fil Elfsight — responsive, s'adapte à la largeur de la case */}
                    <ElfsightWidget appClass={appClass} className="mt-6" />
                  </div>
                </RevealItem>
              );
            }

            /* --- Autres réseaux : carte-lien inchangée --- */
            return (
              <RevealItem key={s.icon}>
                <a
                  href={s.href}
                  target={aCompleter ? undefined : "_blank"}
                  rel="noreferrer"
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-sm border border-border bg-background p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-xl"
                >
                  {/* Halo animé au survol */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-foreground/5 transition-transform duration-700 ease-out group-hover:scale-[2.4]"
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-500 group-hover:bg-foreground group-hover:text-background">
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
                  </div>
                  <div className="relative mt-8">
                    <h3 className="font-serif text-2xl font-medium">{s.label}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{teaser[s.icon]}</p>
                    {aCompleter && (
                      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
                        À COMPLÉTER — lien du compte {s.label}
                      </p>
                    )}
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
