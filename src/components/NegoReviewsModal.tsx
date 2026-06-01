import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { getNegoReviews, getNegoStats } from "@/data/reviews";
import { initiales, type Membre } from "@/data/site";

interface Props {
  membre: Membre | null;
  onClose: () => void;
}

function Stars({ note10 }: { note10: number }) {
  const n = Math.max(0, Math.min(5, Math.round(note10 / 2)));
  return (
    <span className="tracking-[2px] text-primary" aria-label={`${n} sur 5`}>
      {"★".repeat(n)}
      <span className="text-border">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function NegoReviewsModal({ membre, onClose }: Props) {
  const open = membre !== null;

  // Fermeture au clavier (Échap) + verrouillage du scroll de fond
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

  const reviews = membre ? getNegoReviews(membre.nom) : [];
  const stats = membre ? getNegoStats(membre.nom) : { count: 0, avg5: null };

  return (
    <AnimatePresence>
      {open && membre && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Avis clients de ${membre.nom}`}
        >
          {/* Fond */}
          <div
            className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panneau */}
          <motion.div
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-background shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* En-tête */}
            <div className="flex items-start gap-4 border-b border-border bg-secondary px-6 py-5 sm:px-8">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary font-serif text-xl text-primary-foreground">
                {initiales(membre.nom)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-2xl font-medium leading-tight">{membre.nom}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {membre.fonction}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Synthèse note */}
            {stats.avg5 !== null && (
              <div className="flex items-center gap-4 border-b border-border px-6 py-4 sm:px-8">
                <span className="font-serif text-4xl leading-none">
                  {stats.avg5.toString().replace(".", ",")}
                  <span className="text-lg text-muted-foreground">/5</span>
                </span>
                <div>
                  <Stars note10={stats.avg5 * 2} />
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {stats.count} avis vérifié{stats.count > 1 ? "s" : ""} · Opinion System
                  </p>
                </div>
              </div>
            )}

            {/* Liste des avis */}
            <div className="overflow-y-auto px-6 py-5 sm:px-8">
              {reviews.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-serif text-2xl">Aucun avis pour le moment</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Les avis de {membre.nom.split(" ")[0]} apparaîtront ici dès leur publication.
                  </p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {reviews.map((r, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                      className="border-b border-border pb-5 last:border-0 last:pb-0"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <Stars note10={r.note10} />
                        <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                          {r.client} · {r.date}
                        </span>
                      </div>
                      <p className="leading-relaxed text-foreground/90">{r.texte}</p>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
