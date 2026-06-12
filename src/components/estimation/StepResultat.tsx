import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { euros } from "@/data/site";
import { isDemoData, type EstimationResult } from "@/lib/estimation";
import { AnimatedNumber } from "./AnimatedNumber";
import { LeadForm, type EstimationRecap } from "./LeadForm";

const fmtEuro = (n: number) => euros(Math.round(n));
const fmtM2 = (n: number) => `${euros(Math.round(n))}/m²`;

export function StepResultat({
  result,
  recap,
}: {
  result: EstimationResult;
  recap: EstimationRecap;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
        Estimation indicative
      </p>
      <h3 className="mt-2 font-serif text-2xl font-medium md:text-3xl">
        Votre bien à {recap.arrondissement}
      </h3>

      {/* Fourchette + compteurs animés */}
      <div className="mt-8 rounded-sm border border-border bg-secondary/40 p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-2 text-center">
          <AnimatedNumber
            value={result.basse}
            format={fmtEuro}
            className="font-serif text-3xl font-medium leading-none md:text-5xl"
          />
          <span className="pb-1 text-xl text-muted-foreground md:text-3xl">
            –
          </span>
          <AnimatedNumber
            value={result.haute}
            format={fmtEuro}
            className="font-serif text-3xl font-medium leading-none md:text-5xl"
          />
        </div>

        {/* Jauge visuelle */}
        <div className="mt-7">
          <div className="relative h-2 overflow-hidden rounded-full bg-background">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span>Fourchette basse</span>
            <span>Fourchette haute</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prix médian de référence&nbsp;:{" "}
          <span className="font-medium text-foreground">
            {fmtM2(result.medianeM2)}
          </span>{" "}
          à {recap.arrondissement}
        </p>
      </div>

      {/* Bandeau données de démo (si JSON non régénéré) */}
      {isDemoData() && (
        <p className="mt-4 flex items-start gap-2 rounded-sm border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Données de démonstration. Régénérez{" "}
          <code className="font-mono">prix-paris.json</code> depuis DVF pour des
          médianes réelles (voir README).
        </p>
      )}

      {/* Capture de lead */}
      <div className="mt-10 border-t border-border pt-10">
        <h4 className="font-serif text-2xl font-medium md:text-3xl">
          Obtenez une estimation précise avec un expert BR
        </h4>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Cette fourchette est automatique. Pour une valeur juste — au prix du
          marché et de votre bien — échangez avec l'un de nos conseillers.
        </p>
        <div className="mt-6">
          <LeadForm recap={recap} />
        </div>
      </div>

      {/* Mention légale */}
      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Estimation indicative générée à partir de données publiques (DVF). Elle
        ne constitue ni un avis de valeur ni une expertise. Seule une visite
        permet une estimation précise.
      </p>
    </div>
  );
}
