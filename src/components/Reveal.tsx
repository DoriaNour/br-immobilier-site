import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Reveal — apparition sobre au défilement (fondu + légère montée).
 * Motion (`motion/react`). Respecte prefers-reduced-motion : si l'utilisateur
 * a désactivé les animations, le contenu s'affiche sans mouvement.
 * Déclenchement : whileInView, une seule fois, un peu avant l'entrée complète.
 */
const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.7;
const VIEWPORT = { once: true, margin: "-80px" } as const;

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "li" | "ul";
}

const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ className, children, delay = 0, y = 24, ...props }, ref) => {
    const reduce = useReducedMotion();
    const variants: Variants = reduce
      ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
      : {
          hidden: { opacity: 0, y },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION, ease: EASE, delay },
          },
        };
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }
);
Reveal.displayName = "Reveal";

/**
 * RevealGroup — orchestre l'apparition décalée (stagger) de ses RevealItem.
 */
export function RevealGroup({
  className,
  children,
  stagger = 0.1,
}: {
  className?: string;
  children: React.ReactNode;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : stagger } },
  };
  return (
    <motion.div
      className={cn(className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  className,
  children,
  y = 24,
}: {
  className?: string;
  children: React.ReactNode;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const item: Variants = reduce
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
      };
  return (
    <motion.div className={cn(className)} variants={item}>
      {children}
    </motion.div>
  );
}

export { Reveal };
