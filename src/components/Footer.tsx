import { agence } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-primary px-6 pb-8 pt-16 text-primary-foreground lg:px-16">
      <div className="mx-auto max-w-none">
        <div className="grid gap-10 border-b border-[hsl(var(--primary-foreground)/0.15)] pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src="/logo.png" alt="BR Immobilier" className="mb-5 h-20 w-auto" />
            <p className="max-w-[30ch] text-sm text-primary-foreground/70">
              {agence.slogan}. Vente et acquisition de biens d'exception à {agence.zone}.
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-xs uppercase tracking-[0.2em] text-primary-foreground/55">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/85">
              <li><a className="hover:text-primary-foreground" href="#accueil">Accueil</a></li>
              <li><a className="hover:text-primary-foreground" href="#biens">Nos biens</a></li>
              <li><a className="hover:text-primary-foreground" href="#agence">L'agence</a></li>
              <li><a className="hover:text-primary-foreground" href="#contact">Contact</a></li>
            </ul>
          </div>

          <div id="contact">
            <h4 className="mb-5 text-xs uppercase tracking-[0.2em] text-primary-foreground/55">
              Contact
            </h4>
            <address className="space-y-3 text-sm not-italic text-primary-foreground/85">
              <p>7, Avenue de l'Opéra<br />75001 Paris</p>
              <p><a className="hover:text-primary-foreground" href={`tel:${agence.telBrut}`}>{agence.tel}</a></p>
              <p><a className="hover:text-primary-foreground" href={`mailto:${agence.email}`}>{agence.email}</a></p>
            </address>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 pt-7 text-xs text-primary-foreground/50">
          <span>© 2026 BR Immobilier — Tous droits réservés</span>
          <span>Avis vérifiés Opinion System</span>
        </div>
      </div>
    </footer>
  );
}
