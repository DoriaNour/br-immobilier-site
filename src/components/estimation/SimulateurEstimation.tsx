import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { estimer } from "@/lib/estimation";
import {
  TYPE_OPTIONS,
  ETAT_OPTIONS,
  EXTERIEUR_OPTIONS,
  EXPOSITION_OPTIONS,
  labelOf,
} from "./options";
import { initialForm, type FormState, type Update } from "./types";
import { StepType } from "./StepType";
import { StepLocalisation } from "./StepLocalisation";
import { StepSurface } from "./StepSurface";
import { StepCriteres } from "./StepCriteres";
import { StepResultat } from "./StepResultat";
import type { EstimationRecap } from "./LeadForm";

const STEP_LABELS = ["Type", "Localisation", "Surface", "Critères", "Résultat"];
const LAST = STEP_LABELS.length - 1;
const EASE = [0.22, 1, 0.36, 1] as const;

export function SimulateurEstimation() {
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [form, setForm] = React.useState<FormState>(initialForm);

  const update: Update = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return form.type !== "";
      case 1:
        return form.district !== "";
      case 2:
        return typeof form.surface === "number" && form.surface > 0;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!canNext() || step >= LAST) return;
    setDir(1);
    setStep((s) => s + 1);
  };
  const goPrev = () => {
    if (step <= 0) return;
    setDir(-1);
    setStep((s) => s - 1);
  };
  const reset = () => {
    setDir(-1);
    setForm(initialForm);
    setStep(0);
  };

  // Estimation calculée uniquement à l'étape résultat
  const result = React.useMemo(() => {
    if (step !== LAST) return null;
    if (form.type === "" || !form.district || typeof form.surface !== "number")
      return null;
    return estimer({
      city: form.city,
      district: form.district,
      type: form.type,
      surface: form.surface,
      pieces: typeof form.pieces === "number" ? form.pieces : undefined,
      etat: form.etat,
      etage: typeof form.etage === "number" ? form.etage : 0,
      ascenseur: form.ascenseur,
      exterieur: form.exterieur,
      dpe: form.dpe,
      cave: form.cave,
      parking: form.parking,
      exposition: form.exposition,
    });
  }, [step, form]);

  const recap: EstimationRecap | null =
    result &&
    ({
      type: labelOf(TYPE_OPTIONS, form.type),
      ville: "Paris",
      arrondissement: result.districtLabel,
      surface: typeof form.surface === "number" ? form.surface : 0,
      pieces: typeof form.pieces === "number" ? form.pieces : null,
      etat: labelOf(ETAT_OPTIONS, form.etat),
      etage: typeof form.etage === "number" ? form.etage : null,
      ascenseur: form.ascenseur,
      exterieur: labelOf(EXTERIEUR_OPTIONS, form.exterieur),
      dpe: form.dpe === "nc" ? "Non communiqué" : form.dpe,
      cave: form.cave,
      parking: form.parking,
      exposition: labelOf(EXPOSITION_OPTIONS, form.exposition),
      medianeM2: result.medianeM2,
      fourchetteBasse: result.basse,
      fourchetteHaute: result.haute,
      isDemo: false,
    } satisfies EstimationRecap);

  const pct = (step / LAST) * 100;

  return (
    <div className="mx-auto w-full">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          <span>
            Étape {step + 1} / {STEP_LABELS.length}
          </span>
          <span className="text-foreground">{STEP_LABELS[step]}</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {step === 0 && <StepType form={form} update={update} />}
            {step === 1 && <StepLocalisation form={form} update={update} />}
            {step === 2 && <StepSurface form={form} update={update} />}
            {step === 3 && <StepCriteres form={form} update={update} />}
            {step === LAST && result && recap && (
              <StepResultat result={result} recap={recap} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4">
        {step > 0 && step < LAST ? (
          <button
            type="button"
            onClick={goPrev}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Précédent
          </button>
        ) : (
          <span />
        )}

        {step < LAST && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext()}
            className="group inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === LAST - 1 ? "Voir l'estimation" : "Suivant"}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        )}

        {step === LAST && (
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
            Refaire une estimation
          </button>
        )}
      </div>
    </div>
  );
}
