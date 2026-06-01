import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Reveal — apparition au défilement, dans le même registre que le héro
 * (fondu + translation douce). Optionnellement décalée (stagger) pour les listes.
 */
interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "li" | "ul";
}

const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ className, children, delay = 0, y = 24, ...props }, ref) => {
    const variants: Variants = {
      hidden: { opacity: 0, y },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
      },
    };
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }
);
Reveal.displayName = "Reveal";

/**
 * RevealGroup — conteneur qui orchestre l'apparition décalée de ses enfants RevealItem.
 */
export function RevealGroup({
  className,
  children,
  stagger = 0.09,
}: {
  className?: string;
  children: React.ReactNode;
  stagger?: number;
}) {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };
  return (
    <motion.div
      className={cn(className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
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
  const item: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <motion.div className={cn(className)} variants={item}>
      {children}
    </motion.div>
  );
}

export { Reveal };
