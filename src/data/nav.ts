import { agence } from "@/data/site";

/* =========================================================
   Configuration de la navigation (mega-menu plein écran).
   Liens = ancres/sections réelles du site + route /estimation.
   ========================================================= */

export type Lang = "fr" | "en";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavCategory {
  title: string;
  links: NavLink[];
}

/** Lien d'accueil (placé en tête, discret) */
export const navHome: NavLink = { label: "Accueil", href: "#accueil" };

/** Regroupement en catégories */
export const navCategories: NavCategory[] = [
  {
    title: "Acquérir",
    links: [
      { label: "Nos biens", href: "#biens" },
      { label: "Estimer mon bien", href: "/estimation" },
    ],
  },
  {
    title: "L'agence",
    links: [
      { label: "Présentation", href: "#agence" },
      { label: "Les collaborateurs", href: "#equipe" },
      { label: "Avis clients", href: "#avis" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Nous contacter", href: "#contact" },
      { label: agence.tel, href: `tel:${agence.telBrut}` },
      { label: agence.email, href: `mailto:${agence.email}` },
    ],
  },
];

/** Réseaux sociaux — URLs à remplacer par les vraies plus tard (À COMPLÉTER) */
export const socials: { label: string; href: string; icon: "facebook" | "instagram" | "linkedin" }[] = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];
