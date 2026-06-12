import * as React from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/* =========================================================
   Le Cercle BR Immobilier — inscription au fichier acquéreurs.
   FRONT UNIQUEMENT : l'envoi est simulé (console.log + succès).
   Habillage : luxe éditorial parisien — anthracite #222222 / crème #ece2dc.
   Typographies du site : Cormorant Garamond (serif) + Jost (sans).
   ========================================================= */

const TYPES = [
  "Studio",
  "Appartement",
  "Loft / Atelier",
  "Pied-à-terre",
  "Maison",
  "Hôtel particulier",
  "Immeuble",
  "Bureau",
] as const;

// Paris 75001 → Paris 75020 (les 20 arrondissements)
const PARIS = Array.from(
  { length: 20 },
  (_, i) => `Paris 750${String(i + 1).padStart(2, "0")}`
);

const COMMUNES = [
  "Charenton-le-Pont",
  "Joinville-le-Pont",
  "Nogent-sur-Marne",
  "Champigny-sur-Marne",
] as const;

const AVANTAGES = [
  { t: "Avant-première", d: "Les biens vous sont présentés avant leur mise en ligne." },
  { t: "Recherche sur-mesure", d: "Une sélection calibrée sur vos critères précis." },
  { t: "Discrétion absolue", d: "Vos coordonnées restent strictement confidentielles." },
] as const;

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Status = "idle" | "sending" | "success" | "error";

/* Filets & libellés partagés — esthétique éditoriale (champ souligné). */
const LABEL_CLS = "text-[0.68rem] font-medium uppercase tracking-[0.24em] text-muted-foreground";
const INPUT_CLS =
  "peer w-full rounded-none border-0 border-b border-foreground/15 bg-transparent px-0 py-2.5 text-[0.95rem] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/30 focus:border-foreground/30";
const UNDERLINE_CLS =
  "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100";

export function CercleSection() {
  const [prenom, setPrenom] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [budget, setBudget] = React.useState(""); // chiffres uniquement
  const [types, setTypes] = React.useState<string[]>([]);
  const [secteursParis, setSecteursParis] = React.useState<string[]>([]);
  const [secteursCommunes, setSecteursCommunes] = React.useState<string[]>([]);
  const [autresCommunes, setAutresCommunes] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");

  const emailValid = emailOk(email);
  const emailError = emailTouched && !emailValid;
  const canSubmit = emailValid && consent && status !== "sending";

  // Budget : on ne garde que les chiffres, et on formate les milliers à la saisie.
  const onBudget = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBudget(e.target.value.replace(/\D/g, "").slice(0, 12));
  const budgetDisplay = budget ? `${Number(budget).toLocaleString("fr-FR")} €` : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    if (!canSubmit) return;

    setStatus("sending");
    const payload = {
      prenom: prenom.trim() || null,
      nom: nom.trim() || null,
      email,
      budget: budget ? Number(budget) : null,
      types,
      secteursParis,
      secteursCommunes,
      autresCommunes: autresCommunes.trim() || null,
      consent,
    };

    try {
      // Simulation d'envoi (aucun appel réseau pour l'instant).
      await new Promise((r) => setTimeout(r, 800));
      console.log("[Le Cercle BR] inscription fichier acquéreurs :", payload);
      // TODO: brancher la Netlify function ici
      //   (ex. POST vers /.netlify/functions/cercle-inscription avec `payload`)
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="cercle"
      className="home-section surface-ivory-light hairline-center overflow-hidden"
    >
      {/* Motif « cercle » — filets concentriques, très discrets (clientèle haut de gamme). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 600"
        className="pointer-events-none absolute -right-40 -top-44 h-[34rem] w-[34rem] text-foreground/[0.06] md:h-[42rem] md:w-[42rem]"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="300" cy="300" r="299" strokeWidth="0.75" />
        <circle cx="300" cy="300" r="232" strokeWidth="0.75" />
        <circle cx="300" cy="300" r="165" strokeWidth="0.75" />
      </svg>
      {/* Voile dégradé délicat pour la profondeur (crème → transparent). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-foreground/[0.035]"
      />

      <div className="relative">
        <div className="grid items-start gap-y-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-x-24">
          {/* ---------- Colonne éditoriale ---------- */}
          <RevealGroup className="lg:sticky lg:top-28" stagger={0.09}>
            <RevealItem>
              <p className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.34em] text-muted-foreground">
                <span aria-hidden className="h-px w-8 bg-foreground/30" />
                Fichier acquéreurs · sur invitation
              </p>
            </RevealItem>

            <RevealItem>
              <h2 className="mt-7 font-serif text-[2.85rem] font-medium leading-[1.02] tracking-tight text-foreground sm:text-5xl xl:text-[3.75rem]">
                Le Cercle
                <span className="mt-4 block font-sans text-[0.72rem] font-medium uppercase tracking-[0.42em] text-muted-foreground">
                  BR Immobilier
                </span>
              </h2>
            </RevealItem>

            <RevealItem>
              <p className="mt-8 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
                Rejoignez notre cercle d'acquéreurs privilégiés et soyez informé en
                avant-première des biens correspondant à votre recherche,{" "}
                <span className="text-foreground">avant leur mise en ligne</span>.
              </p>
            </RevealItem>

            <RevealItem>
              <ul className="mt-11 max-w-md border-t border-foreground/10">
                {AVANTAGES.map((a, i) => (
                  <li key={a.t} className="flex items-baseline gap-5 border-b border-foreground/10 py-4">
                    <span className="font-serif text-base italic text-foreground/35">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-foreground">
                        {a.t}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </RevealItem>
          </RevealGroup>

          {/* ---------- Colonne formulaire ---------- */}
          <Reveal delay={0.12}>
            <div className="relative rounded-lg border border-foreground/10 bg-background/80 p-7 shadow-[0_40px_90px_-50px_rgba(34,34,34,0.5)] backdrop-blur-sm sm:p-9 md:p-11">
              {/* Filet d'accent en tête de carte */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-16 bg-foreground/40 sm:left-9 md:left-11"
              />

              {status === "success" ? (
                <div
                  className="flex flex-col items-center justify-center py-10 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <span className="relative flex h-16 w-16 items-center justify-center">
                    <span aria-hidden className="absolute inset-0 rounded-full border border-foreground/20" />
                    <CheckCircle2 className="h-8 w-8 text-foreground" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-serif text-[1.7rem] font-medium leading-tight">
                    Bienvenue dans le Cercle
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Votre inscription est bien enregistrée. Nous vous contacterons dès qu'un bien
                    correspond à vos critères.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <RevealGroup stagger={0.06} className="space-y-7">
                    {/* Prénom + Nom */}
                    <RevealItem>
                      <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                        <LineField label="Prénom">
                          <input
                            type="text"
                            name="prenom"
                            autoComplete="given-name"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            placeholder="Votre prénom"
                            className={INPUT_CLS}
                          />
                        </LineField>
                        <LineField label="Nom">
                          <input
                            type="text"
                            name="nom"
                            autoComplete="family-name"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Votre nom"
                            className={INPUT_CLS}
                          />
                        </LineField>
                      </div>
                    </RevealItem>

                    {/* Email + Budget */}
                    <RevealItem>
                      <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                        <LineField
                          label="Email"
                          required
                          error={emailError ? "Merci d'indiquer un email valide." : undefined}
                          errorId="cercle-email-err"
                        >
                          <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setEmailTouched(true)}
                            placeholder="vous@exemple.fr"
                            aria-invalid={emailError}
                            aria-describedby={emailError ? "cercle-email-err" : undefined}
                            className={cn(INPUT_CLS, emailError && "border-foreground/60")}
                          />
                        </LineField>
                        <LineField label="Votre budget">
                          <input
                            type="text"
                            name="budget"
                            inputMode="numeric"
                            value={budgetDisplay}
                            onChange={onBudget}
                            placeholder="Ex. 800 000 €"
                            className={INPUT_CLS}
                          />
                        </LineField>
                      </div>
                    </RevealItem>

                    {/* Type de bien */}
                    <RevealItem>
                      <MultiSelect
                        label="Type de bien"
                        placeholder="Sélectionnez un ou plusieurs types"
                        options={TYPES as readonly string[]}
                        selected={types}
                        onChange={setTypes}
                      />
                    </RevealItem>

                    {/* Secteur Paris */}
                    <RevealItem>
                      <MultiSelect
                        label="Secteur — Paris"
                        placeholder="Sélectionnez un ou plusieurs arrondissements"
                        options={PARIS}
                        selected={secteursParis}
                        onChange={setSecteursParis}
                        columns
                      />
                    </RevealItem>

                    {/* Secteur communes limitrophes */}
                    <RevealItem>
                      <MultiSelect
                        label="Secteur — communes limitrophes"
                        placeholder="Sélectionnez une ou plusieurs communes"
                        options={COMMUNES as readonly string[]}
                        selected={secteursCommunes}
                        onChange={setSecteursCommunes}
                      />
                    </RevealItem>

                    {/* Autre(s) commune(s) */}
                    <RevealItem>
                      <LineField label="Autre(s) commune(s)">
                        <input
                          type="text"
                          name="autresCommunes"
                          value={autresCommunes}
                          onChange={(e) => setAutresCommunes(e.target.value)}
                          placeholder="Saisissez d'autres communes…"
                          className={INPUT_CLS}
                        />
                      </LineField>
                    </RevealItem>

                    {/* Consentement RGPD (obligatoire) */}
                    <RevealItem>
                      <label className="flex cursor-pointer items-start gap-3 pt-1">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          required
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#222222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2"
                        />
                        <span className="text-xs leading-relaxed text-muted-foreground">
                          J'accepte que BR Immobilier utilise mes informations pour me proposer des
                          biens correspondant à ma recherche. Données traitées conformément au RGPD,
                          jamais cédées à des tiers. <span className="text-foreground">*</span>
                        </span>
                      </label>
                    </RevealItem>

                    <RevealItem>
                      <div className="pt-2">
                        {status === "error" && (
                          <p
                            className="mb-5 flex items-center gap-2 text-sm text-foreground/80"
                            role="alert"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            Une erreur est survenue. Merci de réessayer.
                          </p>
                        )}

                        <motion.button
                          type="submit"
                          disabled={!canSubmit}
                          whileHover={canSubmit ? { y: -2 } : undefined}
                          whileTap={canSubmit ? { y: 0 } : undefined}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          style={{ backgroundColor: "#222222", color: "#ece2dc" }}
                          className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-sm px-8 py-4 text-[0.72rem] uppercase tracking-[0.24em] shadow-[0_18px_40px_-22px_rgba(34,34,34,0.9)] transition-[box-shadow,opacity] duration-300 hover:shadow-[0_26px_55px_-22px_rgba(34,34,34,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:w-auto"
                        >
                          {/* Reflet discret qui balaie au survol */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ece2dc]/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                          />
                          {status === "sending" ? (
                            <span className="relative flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Envoi…
                            </span>
                          ) : (
                            <span className="relative flex items-center gap-2.5">
                              Rejoindre le Cercle
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                            </span>
                          )}
                        </motion.button>
                      </div>
                    </RevealItem>
                  </RevealGroup>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Champ souligné (filet) — libellé + input + filet animé au focus. */
function LineField({
  label,
  required = false,
  error,
  errorId,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={LABEL_CLS}>
        {label}
        {required && <span className="ml-1 text-foreground">*</span>}
      </span>
      <span className="relative mt-2.5 block">
        {children}
        <span aria-hidden className={UNDERLINE_CLS} />
      </span>
      {error && (
        <span id={errorId} className="mt-2 flex items-center gap-1.5 text-xs text-foreground/75">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </span>
      )}
    </label>
  );
}

/* =========================================================
   MultiSelect — menu déroulant accessible à sélection multiple.
   Déclencheur en style filet + panneau de cases à cocher (motion).
   Fermeture au clic extérieur et à la touche Échap.
   ========================================================= */
function MultiSelect({
  label,
  placeholder,
  options,
  selected,
  onChange,
  columns = false,
}: {
  label: string;
  placeholder: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  columns?: boolean;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const labelId = React.useId();

  // Fermeture au clic en dehors du composant.
  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const toggle = (value: string) =>
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    );

  const summary = selected.length === 0 ? placeholder : selected.join(", ");

  return (
    <div className="block" ref={rootRef}>
      <span id={labelId} className={LABEL_CLS}>
        {label}
      </span>
      <div className="relative mt-2.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={labelId}
          className={cn(
            "peer flex w-full items-center justify-between gap-3 rounded-none border-0 border-b bg-transparent px-0 py-2.5 text-left text-[0.95rem] outline-none transition-colors duration-300",
            open ? "border-foreground/40" : "border-foreground/15"
          )}
        >
          <span className={cn("truncate", selected.length === 0 && "text-foreground/35")}>
            {summary}
          </span>
          <span className="flex shrink-0 items-center gap-2.5">
            {selected.length > 0 && (
              <span
                style={{ backgroundColor: "#222222", color: "#ece2dc" }}
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.62rem] font-medium tabular-nums"
              >
                {selected.length}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-300",
                open && "rotate-180 text-foreground"
              )}
            />
          </span>
        </button>
        {/* Filet animé (focus clavier + ouverture) */}
        <span
          aria-hidden
          className={cn(UNDERLINE_CLS, open && "scale-x-100")}
        />

        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-20 overflow-hidden rounded-md border border-foreground/10 bg-background shadow-[0_34px_70px_-30px_rgba(34,34,34,0.5)]"
            >
              <ul
                id={listId}
                role="listbox"
                aria-multiselectable="true"
                aria-labelledby={labelId}
                className={cn(
                  "max-h-64 overflow-y-auto p-1.5",
                  columns && "grid grid-cols-2 gap-x-1 sm:grid-cols-3"
                )}
              >
                {options.map((opt) => {
                  const active = selected.includes(opt);
                  return (
                    <li key={opt} role="option" aria-selected={active}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors duration-200",
                          active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                          "hover:bg-foreground/[0.04]"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-200",
                            active ? "border-foreground bg-foreground" : "border-foreground/25"
                          )}
                        >
                          {active && <Check className="h-3 w-3 text-background" strokeWidth={3} />}
                        </span>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggle(opt)}
                          className="sr-only"
                        />
                        <span className="truncate">{opt}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
