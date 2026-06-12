import * as React from "react";
import { animate } from "framer-motion";

/**
 * Compteur animé 0 → value (décélération douce).
 * Respecte prefers-reduced-motion.
 */
export function AnimatedNumber({
  value,
  durationMs = 1400,
  format = (n) => Math.round(n).toString(),
  className,
}: {
  value: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      node.textContent = format(value);
      return;
    }

    const controls = animate(0, value, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, durationMs, format]);

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}
