import {
  Building2,
  Home,
  DoorClosed,
  Warehouse,
  Factory,
  Shapes,
  type LucideIcon,
} from "lucide-react";
import type {
  BienType,
  Etat,
  Exterieur,
  Dpe,
  Exposition,
} from "@/lib/estimation";

/* Options des étapes — libellés réutilisés aussi dans le récap envoyé. */

export const TYPE_OPTIONS: { value: BienType; label: string; icon: LucideIcon }[] =
  [
    { value: "appartement", label: "Appartement", icon: Building2 },
    { value: "maison", label: "Maison", icon: Home },
    { value: "studio", label: "Studio", icon: DoorClosed },
    { value: "loft", label: "Loft", icon: Warehouse },
    { value: "atelier", label: "Atelier", icon: Factory },
    { value: "autre", label: "Autre", icon: Shapes },
  ];

export const ETAT_OPTIONS: { value: Etat; label: string }[] = [
  { value: "a-renover", label: "À rénover" },
  { value: "bon", label: "Bon état" },
  { value: "refait-a-neuf", label: "Refait à neuf" },
];

export const EXTERIEUR_OPTIONS: { value: Exterieur; label: string }[] = [
  { value: "aucun", label: "Aucun" },
  { value: "balcon", label: "Balcon" },
  { value: "terrasse", label: "Terrasse" },
  { value: "jardin", label: "Jardin" },
];

export const DPE_OPTIONS: { value: Dpe; label: string }[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
  { value: "nc", label: "NC" },
];

export const EXPOSITION_OPTIONS: { value: Exposition; label: string }[] = [
  { value: "nc", label: "Non précisée" },
  { value: "nord", label: "Nord" },
  { value: "nord-est", label: "Nord-Est" },
  { value: "est", label: "Est" },
  { value: "sud-est", label: "Sud-Est" },
  { value: "sud", label: "Sud" },
  { value: "sud-ouest", label: "Sud-Ouest" },
  { value: "ouest", label: "Ouest" },
  { value: "nord-ouest", label: "Nord-Ouest" },
];

/** Retourne le libellé lisible d'une valeur d'option. */
export function labelOf(
  opts: { value: string; label: string }[],
  v: string
): string {
  return opts.find((o) => o.value === v)?.label ?? v;
}
