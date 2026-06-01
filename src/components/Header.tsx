import * as React from "react";
import { cn } from "@/lib/utils";
import { MegaMenu, LangSelector } from "@/components/MegaMenu";
import type { Lang } from "@/data/nav";

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [lang, setLang] = React.useState<Lang>("fr");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Texte clair sur la vidéo du héro, anthracite une fois la page défilée
  const overHero = !scrolled;
  const tone = cn(
    "transition-colors duration-500",
    overHero ? "text-primary-foreground [text-shadow:_0_1px_12px_rgba(0,0,0,0.4)]" : "text-foreground"
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "bg-secondary py-2 shadow-[0_1px_0_hsl(var(--border))]" : "py-4"
        )}
      >
        <div className="mx-auto grid grid-cols-3 items-center px-6 lg:px-16">
          {/* Gauche : ☰ MENU */}
          <div className="justify-self-start">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className={cn("group flex items-center gap-3", tone)}
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-0.5 w-7 bg-current transition-all duration-300 group-hover:w-5" />
                <span className="block h-0.5 w-7 bg-current" />
                <span className="block h-0.5 w-7 bg-current transition-all duration-300 group-hover:w-5" />
              </span>
              <span className="text-[0.9rem] uppercase tracking-[0.22em]">Menu</span>
            </button>
          </div>

          {/* Centre : logo */}
          <a href="#accueil" aria-label="BR Immobilier — Accueil" className="justify-self-center">
            <img
              src="/logo.png"
              alt="BR Immobilier"
              className={cn(
                "w-auto transition-all duration-500",
                scrolled ? "h-12 md:h-[110px]" : "h-16 md:h-[150px] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
              )}
            />
          </a>

          {/* Droite : sélecteur de langue */}
          <div className={cn("justify-self-end", tone)}>
            <LangSelector lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      {/* Mega-menu plein écran */}
      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} setLang={setLang} />
    </>
  );
}
