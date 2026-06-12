import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ETAT_OPTIONS,
  EXTERIEUR_OPTIONS,
  DPE_OPTIONS,
  EXPOSITION_OPTIONS,
} from "./options";
import type { FormState, Update } from "./types";

/* --- Sous-composants réutilisables (charte BR) --- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Pills<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { value: T; label: string }[];
  value: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onSelect(o.value)}
            aria-pressed={active}
            className={cn(
              "rounded-sm border px-4 py-2 text-sm transition-all duration-200",
              active
                ? "border-foreground bg-secondary"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-sm border border-border">
      {[
        { v: true, l: "Oui" },
        { v: false, l: "Non" },
      ].map((opt) => {
        const active = value === opt.v;
        return (
          <button
            key={opt.l}
            type="button"
            onClick={() => onChange(opt.v)}
            aria-pressed={active}
            className={cn(
              "px-5 py-2 text-sm transition-colors duration-200",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary/60"
            )}
          >
            {opt.l}
          </button>
        );
      })}
    </div>
  );
}

export function StepCriteres({
  form,
  update,
}: {
  form: FormState;
  update: Update;
}) {
  return (
    <div>
      <h3 className="font-serif text-2xl font-medium md:text-3xl">
        Caractéristiques du bien
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Ces critères ajustent l'estimation. Laissez par défaut si vous ne savez
        pas.
      </p>

      <div className="mt-8 space-y-7">
        <Field label="État général">
          <Pills
            options={ETAT_OPTIONS}
            value={form.etat}
            onSelect={(v) => update("etat", v)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <Field label="Étage">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="0 = RDC"
              value={form.etage}
              onChange={(e) =>
                update(
                  "etage",
                  e.target.value === "" ? "" : Math.max(0, Number(e.target.value))
                )
              }
              className="w-full rounded-sm border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </Field>
          <Field label="Ascenseur">
            <Toggle
              value={form.ascenseur}
              onChange={(v) => update("ascenseur", v)}
            />
          </Field>
        </div>

        <Field label="Extérieur">
          <Pills
            options={EXTERIEUR_OPTIONS}
            value={form.exterieur}
            onSelect={(v) => update("exterieur", v)}
          />
        </Field>

        <Field label="DPE (classe énergie)">
          <Pills
            options={DPE_OPTIONS}
            value={form.dpe}
            onSelect={(v) => update("dpe", v)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <Field label="Cave">
            <Toggle value={form.cave} onChange={(v) => update("cave", v)} />
          </Field>
          <Field label="Parking / box">
            <Toggle
              value={form.parking}
              onChange={(v) => update("parking", v)}
            />
          </Field>
        </div>

        <Field label="Exposition">
          <div className="relative">
            <select
              value={form.exposition}
              onChange={(e) =>
                update("exposition", e.target.value as FormState["exposition"])
              }
              className="w-full cursor-pointer appearance-none rounded-sm border border-border bg-background py-3 pl-4 pr-11 text-foreground outline-none transition-colors focus:border-foreground sm:w-auto"
            >
              {EXPOSITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
      </div>
    </div>
  );
}
