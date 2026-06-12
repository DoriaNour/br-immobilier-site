import { MapPin, ChevronDown, Lock } from "lucide-react";
import { listDistricts } from "@/lib/estimation";
import type { FormState, Update } from "./types";

const districts = listDistricts("paris");

export function StepLocalisation({
  form,
  update,
}: {
  form: FormState;
  update: Update;
}) {
  return (
    <div>
      <h3 className="font-serif text-2xl font-medium md:text-3xl">
        Où se situe votre bien ?
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Paris intra-muros pour le moment.
      </p>

      <div className="mt-8 space-y-5">
        {/* Ville (verrouillée pour l'instant) */}
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Ville
          </span>
          <div className="relative mt-2">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value="Paris"
              disabled
              className="w-full cursor-not-allowed rounded-sm border border-border bg-muted/50 py-3.5 pl-11 pr-24 text-foreground outline-none"
            />
            <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
              <Lock className="h-3 w-3" />
              Bientôt
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            D'autres villes seront disponibles prochainement.
          </p>
        </label>

        {/* Arrondissement */}
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Arrondissement
          </span>
          <div className="relative mt-2">
            <select
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-sm border border-border bg-background py-3.5 pl-4 pr-11 text-foreground outline-none transition-colors focus:border-foreground"
            >
              <option value="" disabled>
                Choisir un arrondissement…
              </option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label} ({d.code})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </label>
      </div>
    </div>
  );
}
