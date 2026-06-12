import * as React from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * SmoothScroll — scroll fluide & inertiel discret (Lenis) au niveau racine.
 * Réglage soyeux, pas « glissant ». Désactivé si prefers-reduced-motion :
 * on rend alors le scroll natif, sans interpolation.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        // Inertie discrète : lissage léger, sensation soyeuse sans excès.
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
