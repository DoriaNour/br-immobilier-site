import * as React from "react";
import { cn } from "@/lib/utils";
import { agence } from "@/data/site";

const LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Nos biens", href: "#biens" },
  { label: "L'agence", href: "#agence" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-secondary py-2 shadow-[0_1px_0_hsl(var(--border))]" : "py-4"
      )}
    >
      <div className="mx-auto flex max-w-none items-center justify-between px-6 lg:px-16">
        <a href="#accueil" aria-label="BR Immobilier — Accueil" className="md:-translate-x-[20%]">
          <img
            src="/logo.png"
            alt="BR Immobilier"
            className={cn(
              "w-auto transition-all duration-500",
              scrolled ? "h-[140px] drop-shadow-none" : "h-[175px] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
            )}
          />
        </a>

        {/* Navigation bureau (décalée de 35% vers la droite sur desktop) */}
        <nav className="hidden items-center gap-9 md:flex md:translate-x-[5%]">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "group relative text-[1.04rem] uppercase tracking-[0.14em] transition-colors duration-500",
                scrolled ? "text-foreground" : "text-primary-foreground [text-shadow:_0_1px_12px_rgba(0,0,0,0.4)]"
              )}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href={`tel:${agence.telBrut}`}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.78rem] tracking-[0.08em] transition-colors duration-500",
              scrolled
                ? "border-foreground text-foreground hover:bg-primary hover:text-primary-foreground"
                : "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            )}
          >
            {agence.tel}
          </a>
        </nav>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="flex flex-col gap-1.5 p-1.5 md:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-0.5 w-7 transition-all duration-300",
                scrolled || open ? "bg-foreground" : "bg-primary-foreground",
                open && i === 0 && "translate-y-2 rotate-45",
                open && i === 1 && "opacity-0",
                open && i === 2 && "-translate-y-2 -rotate-45"
              )}
            />
          ))}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          "fixed inset-0 -z-10 flex flex-col items-center justify-center gap-8 bg-primary transition-transform duration-500 md:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-xl uppercase tracking-[0.14em] text-primary-foreground"
          >
            {l.label}
          </a>
        ))}
        <a
          href={`tel:${agence.telBrut}`}
          onClick={() => setOpen(false)}
          className="rounded-full border border-primary-foreground px-5 py-2.5 text-sm text-primary-foreground"
        >
          {agence.tel}
        </a>
      </div>
    </header>
  );
}
