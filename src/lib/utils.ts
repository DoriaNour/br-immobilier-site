import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Fusionne proprement les classes Tailwind conditionnelles (convention shadcn)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
