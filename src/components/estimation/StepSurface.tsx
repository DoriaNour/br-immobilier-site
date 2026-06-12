import { Ruler, DoorOpen } from "lucide-react";
import type { FormState, Update } from "./types";

export function StepSurface({
  form,
  update,
}: {
  form: FormState;
  update: Update;
}) {
  const numOrEmpty = (v: string): number | "" =>
    v === "" ? "" : Math.max(0, Number(v));

  return (
    <div>
      <h3 className="font-serif text-2xl font-medium md:text-3xl">
        Surface et nombre de pièces
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        La surface habitable (loi Carrez) affine l'estimation.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Surface (m²)
          </span>
          <div className="relative mt-2">
            <Ruler className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Ex. 48"
              value={form.surface}
              onChange={(e) => update("surface", numOrEmpty(e.target.value))}
              className="w-full rounded-sm border border-border bg-background py-3.5 pl-11 pr-4 text-foreground outline-none transition-colors focus:border-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Nombre de pièces
          </span>
          <div className="relative mt-2">
            <DoorOpen className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Ex. 2"
              value={form.pieces}
              onChange={(e) => update("pieces", numOrEmpty(e.target.value))}
              className="w-full rounded-sm border border-border bg-background py-3.5 pl-11 pr-4 text-foreground outline-none transition-colors focus:border-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </label>
      </div>
    </div>
  );
}
