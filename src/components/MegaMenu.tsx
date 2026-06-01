import * as React from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X, Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navHome, navCategories, socials, type Lang } from "@/data/nav";

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const item: Variants = {
  hidden: { y: 26, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
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
  // Fermeture clavier (Échap) + verrouillage du scroll de fond
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
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-secondary text-foreground"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          {/* ----- Barre haute ----- */}
          <div className="grid grid-cols-3 items-center px-6 py-5 lg:px-16">
            {/* Gauche : fermer */}
            <button
              onClick={onClose}
              className="group flex items-center gap-3 justify-self-start text-[0.9rem] uppercase tracking-[0.22em]"
            >
              <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              Menu
            </button>

            {/* Centre : logo */}
            <a href="#accueil" onClick={onClose} className="justify-self-center" aria-label="Accueil">
              <img src="/logo.png" alt="BR Immobilier" className="h-16 w-auto md:h-[88px]" />
            </a>

            {/* Droite : langue + contact */}
            <div className="flex items-center gap-4 justify-self-end">
              <LangSelector lang={lang} setLang={setLang} />
              <a
                href="#contact"
                onClick={onClose}
                className="hidden items-center gap-1.5 rounded-full border border-foreground px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-primary hover:text-primary-foreground sm:inline-flex"
              >
                Nous contacter
              </a>
            </div>
          </div>

          {/* ----- Corps : catégories ----- */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-10 lg:px-16"
          >
            <motion.a
              variants={item}
              href={navHome.href}
              onClick={onClose}
              className="mb-10 inline-block w-fit text-xs uppercase tracking-[0.3em] text-foreground/50 transition-colors hover:text-foreground"
            >
              {navHome.label}
            </motion.a>

            <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {navCategories.map((cat) => (
                <div key={cat.title}>
                  <motion.h2 variants={item} className="font-serif text-3xl font-medium md:text-4xl">
                    {cat.title}
                  </motion.h2>
                  <ul className="mt-5 space-y-3">
                    {cat.links.map((l) => (
                      <motion.li variants={item} key={l.href}>
                        <a
                          href={l.href}
                          onClick={onClose}
                          className="group inline-flex items-center gap-2 text-base text-foreground/75 transition-colors duration-300 hover:text-foreground"
                        >
                          <span>{l.label}</span>
                          <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ----- Bas : réseaux + langue ----- */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/15 px-6 py-6 lg:px-16">
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
            <p className="order-last w-full text-center text-xs tracking-wide text-foreground/50 sm:order-none sm:w-auto">
              7, Avenue de l'Opéra — 75001 Paris
            </p>
            <LangSelector lang={lang} setLang={setLang} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
