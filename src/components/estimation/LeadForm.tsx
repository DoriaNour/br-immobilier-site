import * as React from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EstimationRecap {
  type: string;
  ville: string;
  arrondissement: string;
  surface: number;
  pieces: number | null;
  etat: string;
  etage: number | null;
  ascenseur: boolean;
  exterieur: string;
  dpe: string;
  cave: boolean;
  parking: boolean;
  exposition: string;
  medianeM2: number;
  fourchetteBasse: number;
  fourchetteHaute: number;
  isDemo: boolean;
}

const ENDPOINT =
  (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) ||
  "/.netlify/functions/lead-estimation";

type Status = "idle" | "loading" | "success" | "error";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function LeadForm({ recap }: { recap: EstimationRecap }) {
  const [values, setValues] = React.useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [serverError, setServerError] = React.useState("");

  const set = (k: keyof typeof values) => (v: string | boolean) =>
    setValues((s) => ({ ...s, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!values.nom.trim()) e.nom = "Votre nom est requis.";
    if (!values.email.trim()) e.email = "Votre email est requis.";
    else if (!emailOk(values.email)) e.email = "Email invalide.";
    if (!values.consent) e.consent = "Votre consentement est requis.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;

    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: values, estimation: recap }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch (err) {
      setServerError(
        "L'envoi a échoué. Réessayez ou contactez-nous directement."
      );
      setStatus("error");
      console.error("Lead submit error:", err);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-border bg-secondary/50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-foreground" />
        <h4 className="mt-4 font-serif text-2xl font-medium">Merci !</h4>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Votre demande a bien été transmise à notre équipe. Un expert BR
          Immobilier vous recontacte rapidement pour affiner cette estimation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldInput
          label="Nom"
          name="nom"
          value={values.nom}
          onChange={(v) => set("nom")(v)}
          error={errors.nom}
          autoComplete="name"
        />
        <FieldInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(v) => set("email")(v)}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <FieldInput
        label="Téléphone"
        name="telephone"
        type="tel"
        value={values.telephone}
        onChange={(v) => set("telephone")(v)}
        autoComplete="tel"
      />

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Message (facultatif)
        </span>
        <textarea
          name="message"
          rows={3}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder="Précisez votre projet, vos disponibilités…"
          className="mt-2 w-full resize-none rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        />
      </label>

      {/* Consentement RGPD */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(e) => set("consent")(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--foreground))]"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          J'accepte que BR Immobilier utilise mes informations pour me
          recontacter au sujet de mon projet. Données traitées conformément au
          RGPD, jamais cédées à des tiers.
        </span>
      </label>
      {errors.consent && (
        <p className="-mt-2 text-xs text-destructive">{errors.consent}</p>
      )}

      {status === "error" && serverError && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi…
          </>
        ) : (
          <>
            Être recontacté par un expert
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </>
        )}
      </button>
    </form>
  );
}

function FieldInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-2 w-full rounded-sm border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground",
          error ? "border-destructive" : "border-border"
        )}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </label>
  );
}
