import { cn } from "@/lib/utils";
import { TYPE_OPTIONS } from "./options";
import type { FormState, Update } from "./types";

export function StepType({
  form,
  update,
}: {
  form: FormState;
  update: Update;
}) {
  return (
    <div>
      <h3 className="font-serif text-2xl font-medium md:text-3xl">
        Quel type de bien souhaitez-vous estimer ?
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Sélectionnez la catégorie la plus proche.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TYPE_OPTIONS.map((o) => {
          const Icon = o.icon;
          const active = form.type === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => update("type", o.value)}
              aria-pressed={active}
              className={cn(
                "group flex flex-col items-center justify-center gap-3 rounded-sm border px-4 py-7 text-center transition-all duration-300",
                active
                  ? "border-foreground bg-secondary"
                  : "border-border hover:border-foreground/50 hover:bg-secondary/40"
              )}
            >
              <Icon
                className={cn(
                  "h-7 w-7 transition-transform duration-300 group-hover:scale-110",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              />
              <span className="text-sm uppercase tracking-[0.14em]">
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
