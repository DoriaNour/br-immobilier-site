import * as React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import {
  MapPin,
  Euro,
  DoorOpen,
  Home,
  Search,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ESTIMATION_ROUTE } from "@/data/nav";

/* =========================================================
   Barre de recherche immobilière du héro.
   Comportement dynamique selon l'onglet (Acheter / Louer / Vendre).
   Responsive :
     • grand écran (xl)  → 5 champs sur une seule ligne
     • tablette (sm–xl)  → grille 2 colonnes équilibrées
     • mobile (< sm)     → champ principal « Où ? » + panneau de filtres dépliable
   ========================================================= */

const TABS = [
  { id: "acheter", label: "Acheter" },
  { id: "louer", label: "Louer" },
  { id: "vendre", label: "Vendre" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const PIECES = [
  { value: "", label: "Pièces" },
  { value: "1", label: "Studio / 1 pièce" },
  { value: "2", label: "2 pièces" },
  { value: "3", label: "3 pièces" },
  { value: "4", label: "4 pièces et +" },
];

const TYPES = [
  { value: "", label: "Type de biens" },
  { value: "appartement", label: "Appartement" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft / Atypique" },
  { value: "maison", label: "Maison" },
  { value: "terrain", label: "Terrain" },
];

export interface SearchFilters {
  transaction: TabId;
  ou: string;
  prixMin: string;
  prixMax: string;
  pieces: string;
  type: string;
}

/**
 * Filtrage par fourchette de prix — prêt à brancher aux vraies annonces.
 * Ex : annonces.filter((a) => isInPriceRange(a.prix, filters.prixMin, filters.prixMax))
 */
export function isInPriceRange(
  prix: number,
  min: string | number | null | undefined,
  max: string | number | null | undefined
): boolean {
  const lo = min === "" || min == null ? Number.NEGATIVE_INFINITY : Number(min);
  const hi = max === "" || max == null ? Number.POSITIVE_INFINITY : Number(max);
  return prix >= lo && prix <= hi;
}

interface HeroSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  estimationHref?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const bodyAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: EASE } as Transition,
};

const INPUT_CLS =
  "w-full bg-transparent text-[1.03rem] text-foreground outline-none placeholder:text-muted-foreground";
const SELECT_CLS =
  "w-full cursor-pointer appearance-none bg-transparent pr-5 text-[1.03rem] text-foreground outline-none";
const NUM_CLS =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
const ICON_CLS = "h-[18px] w-[18px] shrink-0 text-muted-foreground";

export function HeroSearch({ onSearch, estimationHref = ESTIMATION_ROUTE }: HeroSearchProps) {
  const [tab, setTab] = React.useState<TabId>("acheter");
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    ou: "",
    prixMin: "",
    prixMax: "",
    pieces: "",
    type: "",
  });

  const update =
    (key: keyof typeof filters) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFilters((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SearchFilters = { transaction: tab, ...filters };
    // TODO : brancher la recherche réelle. Filtrage par fourchette de prix :
    //   annonces.filter((a) => isInPriceRange(a.prix, filters.prixMin, filters.prixMax))
    if (onSearch) onSearch(payload);
    else console.log("Recherche immobilière :", payload);
  };

  /* ----- Contenus de champ réutilisés entre les mises en page ----- */
  const ou = (
    <>
      <MapPin className={ICON_CLS} />
      <input type="text" value={filters.ou} onChange={update("ou")} placeholder="Où ?" className={INPUT_CLS} />
    </>
  );
  const prixMin = (
    <>
      <Euro className={ICON_CLS} />
      <input
        type="number"
        inputMode="numeric"
        min="0"
        value={filters.prixMin}
        onChange={update("prixMin")}
        placeholder="Prix minimum"
        className={cn(INPUT_CLS, NUM_CLS)}
      />
    </>
  );
  const prixMax = (
    <>
      <Euro className={ICON_CLS} />
      <input
        type="number"
        inputMode="numeric"
        min="0"
        value={filters.prixMax}
        onChange={update("prixMax")}
        placeholder="Prix maximum"
        className={cn(INPUT_CLS, NUM_CLS)}
      />
    </>
  );
  const pieces = (
    <>
      <DoorOpen className={ICON_CLS} />
      <select value={filters.pieces} onChange={update("pieces")} className={SELECT_CLS}>
        {PIECES.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </>
  );
  const type = (
    <>
      <Home className={ICON_CLS} />
      <select value={filters.type} onChange={update("type")} className={SELECT_CLS}>
        {TYPES.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </>
  );

  const rechercherBtn = (extra: string) => (
    <button
      type="submit"
      className={cn(
        "flex items-center justify-center gap-2 bg-primary px-8 py-4 text-[0.92rem] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90",
        extra
      )}
    >
      <Search className="h-4 w-4" />
      Rechercher
    </button>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-background/95 text-left shadow-2xl ring-1 ring-black/5 backdrop-blur-md"
    >
      {/* Onglets : Acheter / Louer / Vendre */}
      <div className="flex gap-1 border-b border-border px-3 pt-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-4 py-3 text-[0.92rem] uppercase tracking-[0.18em] transition-colors duration-300",
              tab === t.id ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-4 -bottom-px h-0.5 bg-foreground" />}
          </button>
        ))}
      </div>

      {/* Corps : change selon l'onglet, transition fluide */}
      <AnimatePresence mode="wait" initial={false}>
        {tab === "vendre" ? (
          /* ----- VENDRE : un seul bouton d'appel à l'action centré ----- */
          <motion.div key="vendre" {...bodyAnim} className="flex items-center justify-center px-4 py-6">
            <Link
              to={estimationHref}
              className="group inline-flex items-center gap-2.5 rounded-md bg-primary px-9 py-4 text-[0.92rem] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
            >
              Estimez votre bien
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ) : (
          /* ----- ACHETER / LOUER ----- */
          <motion.div key="search" {...bodyAnim}>
            {/* === Tablette & desktop (≥ sm) : grille 2 colonnes → 1 ligne en xl === */}
            <div className="hidden sm:flex sm:flex-col xl:flex-row xl:items-stretch">
              <div className="grid flex-1 grid-cols-2 gap-px bg-border xl:grid-cols-5">
                <Cell>{ou}</Cell>
                <Cell>{prixMin}</Cell>
                <Cell>{prixMax}</Cell>
                <Cell hasChevron>{pieces}</Cell>
                <Cell hasChevron className="col-span-2 xl:col-span-1">{type}</Cell>
              </div>
              {rechercherBtn("border-t border-border xl:border-l xl:border-t-0")}
            </div>

            {/* === Mobile (< sm) : champ principal + filtres dépliables === */}
            <div className="sm:hidden">
              {/* Champ principal toujours visible */}
              <Cell>{ou}</Cell>

              {/* Bouton « Filtres » */}
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
                className="flex w-full items-center justify-between border-t border-border px-4 py-3.5 text-[0.92rem] text-foreground transition-colors hover:bg-muted/50"
              >
                <span className="flex items-center gap-2.5">
                  <SlidersHorizontal className={ICON_CLS} />
                  Filtres
                </span>
                <ChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", filtersOpen && "rotate-180")}
                />
              </button>

              {/* Panneau de filtres animé */}
              <AnimatePresence initial={false}>
                {filtersOpen && (
                  <motion.div
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-px border-t border-border bg-border">
                      <Cell>{prixMin}</Cell>
                      <Cell>{prixMax}</Cell>
                      <Cell hasChevron>{pieces}</Cell>
                      <Cell hasChevron>{type}</Cell>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bouton RECHERCHER toujours accessible */}
              {rechercherBtn("w-full border-t border-border")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/* Cellule de champ : icône + contrôle, fond clair, chevron optionnel pour les menus */
function Cell({
  children,
  className,
  hasChevron = false,
}: {
  children: React.ReactNode;
  className?: string;
  hasChevron?: boolean;
}) {
  return (
    <label className={cn("relative flex items-center gap-3 bg-background px-4 py-4", className)}>
      {children}
      {hasChevron && (
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
      )}
    </label>
  );
}
