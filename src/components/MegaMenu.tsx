import * as React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X, Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups, socials, type Lang } from "@/data/nav";

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } },
};
const item: Variants = {
  hidden: { y: 18, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

const socialIcon: Record<
  "facebook" | "instagram" | "linkedin",
  React.ComponentType<{ className?: string }>
> = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin };

/** Sélecteur de langue (couleur héritée du parent via currentColor) */
export function LangSelector({
  lang,
  setLang,
  className,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5 text-[0.8rem] tracking-[0.15em]", className)}>
      {(["fr", "en"] as const).map((l, i) => (
        <React.Fragment key={l}>
          {i === 1 && <span className="opacity-40">/</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            className={cn(
              "uppercase transition-opacity",
              lang === l ? "font-medium opacity-100" : "opacity-50 hover:opacity-80"
            )}
          >
            {l}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

export function MegaMenu({ open, onClose, lang, setLang }: MegaMenuProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* Fond léger cliquable — le héro reste visible dessous */}
          <motion.div
            className="absolute inset-0 bg-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Bandeau qui se déroule depuis le haut (pleine largeur, hauteur = contenu) */}
          <motion.aside
            className="absolute inset-x-0 top-0 flex max-h-[92vh] flex-col overflow-y-auto bg-secondary text-foreground shadow-[0_30px_60px_-15px_rgba(34,34,34,0.35)]"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: PANEL_EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            {/* Barre haute */}
            <div className="grid grid-cols-3 items-center px-6 py-5 lg:px-16">
              <button
                onClick={onClose}
                className="group flex items-center gap-3 justify-self-start text-[0.85rem] uppercase tracking-[0.22em]"
              >
                <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                Menu
              </button>
              <Link to="/" onClick={onClose} aria-label="Accueil" className="justify-self-center">
                <img src="/logo.png" alt="BR Immobilier" className="h-12 w-auto md:h-14" />
              </Link>
              <div className="flex items-center gap-4 justify-self-end">
                <LangSelector lang={lang} setLang={setLang} />
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="hidden items-center rounded-full border border-foreground px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-primary hover:text-primary-foreground sm:inline-flex"
                >
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Corps : catégories en colonnes */}
            <motion.nav
              variants={container}
              initial="hidden"
              animate="visible"
              className="mx-auto grid w-full max-w-6xl grid-cols-1 content-start gap-x-[5.92rem] gap-y-10 px-6 pb-12 pt-2 sm:grid-cols-2 lg:grid-cols-3"
            >
              {navGroups.map((g, i) => (
                // En 3 colonnes (lg), la 2ᵉ colonne (i % 3 === 1) est centrée sur l'axe du logo,
                // lignes toujours alignées à gauche. Colonnes latérales inchangées.
                <motion.div
                  variants={item}
                  key={g.title}
                  className={cn(i % 3 === 1 && "lg:justify-self-center")}
                >
                  {g.to ? (
                    <Link
                      to={g.to}
                      onClick={onClose}
                      className="group inline-flex items-center gap-2 font-serif text-[1.6rem] font-bold transition-colors hover:text-foreground/70 md:text-[2.1rem]"
                    >
                      {g.title}
                      <ArrowUpRight className="h-5 w-5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  ) : (
                    <h2 className="font-serif text-[1.6rem] font-bold md:text-[2.1rem]">{g.title}</h2>
                  )}

                  {g.links && (
                    <ul className="mt-3 space-y-2">
                      {g.links.map((l) => (
                        <li key={l.to}>
                          <Link
                            to={l.to}
                            onClick={onClose}
                            className="group inline-flex items-center gap-1.5 text-[1.05rem] text-foreground/70 transition-colors duration-300 hover:text-foreground md:text-[1.12rem]"
                          >
                            <span>{l.label}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </motion.nav>

            {/* Bas : réseaux + langue */}
            <div className="flex items-center justify-between gap-4 border-t border-foreground/15 px-6 py-5 lg:px-16">
              <div className="flex items-center gap-5">
                {socials.map((s) => {
                  const Icon = socialIcon[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="text-foreground/70 transition-colors duration-300 hover:text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
              <LangSelector lang={lang} setLang={setLang} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
