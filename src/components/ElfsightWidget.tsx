import * as React from "react";
import { Images } from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================================================
   ElfsightWidget — widget Elfsight réutilisable (Instagram,
   Facebook, … via la prop `appClass`).
   - platform.js chargé UNE SEULE FOIS (async, dédoublonné par id),
     même avec plusieurs widgets sur la page ;
   - réinitialisation au montage / changement de route via
     window.eapps.platform.initialize() (s'affiche après une
     navigation interne SPA) ;
   - ÉTAT DE REPLI : si le fil ne rend rien (quota atteint, fil
     vide…), un placeholder discret remplace la case blanche.
   ========================================================= */

const SCRIPT_ID = "elfsight-platform-script";
const SCRIPT_SRC = "https://elfsightcdn.com/platform.js";
const EMPTY_TIMEOUT = 7000; // délai avant d'afficher le repli (ms)

declare global {
  interface Window {
    eapps?: { platform?: { initialize?: () => void } };
  }
}

type Status = "loading" | "ready" | "empty";

export function ElfsightWidget({
  appClass,
  className,
  fallback,
}: {
  /** Classe du widget Elfsight, ex. "elfsight-app-xxxxxxxx-…" */
  appClass: string;
  className?: string;
  /** Repli personnalisé (sinon un placeholder discret par défaut). */
  fallback?: React.ReactNode;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [status, setStatus] = React.useState<Status>("loading");

  // Chargement unique du script + ré-init SPA.
  React.useEffect(() => {
    const existing = document.getElementById(SCRIPT_ID);
    if (!existing) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.eapps?.platform?.initialize?.();
    }
  }, []);

  // Détection « le fil a-t-il rendu du contenu ? » → sinon repli.
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const hasContent = () =>
      host.children.length > 0 && host.getBoundingClientRect().height > 4;

    const check = () => {
      if (hasContent()) {
        setStatus("ready");
        return true;
      }
      return false;
    };

    check();
    const observer = new MutationObserver(check);
    observer.observe(host, { childList: true, subtree: true });
    const timer = window.setTimeout(() => {
      setStatus((s) => (s === "ready" ? s : hasContent() ? "ready" : "empty"));
    }, EMPTY_TIMEOUT);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [appClass]);

  return (
    <div className={className}>
      {status === "empty" &&
        (fallback ?? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
            <Images className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Publications bientôt disponibles.
            </p>
          </div>
        ))}
      {/* La div du widget reste montée (Elfsight peut la remplir) ; masquée si vide. */}
      <div
        ref={hostRef}
        className={cn(appClass, status === "empty" && "hidden")}
        data-elfsight-app-lazy
      />
    </div>
  );
}
