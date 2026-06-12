/* =========================================================
   Configuration de la navigation (mega-menu en rideau).
   Arborescence catégories / sous-catégories + routes dédiées.
   ========================================================= */

export type Lang = "fr" | "en";

export interface NavLeaf {
  label: string;
  to: string;
}

export interface NavGroup {
  title: string;
  /** Sous-catégories (si présentes) */
  links?: NavLeaf[];
  /** Lien direct si la catégorie n'a pas de sous-catégorie */
  to?: string;
}

/** Route de la page d'estimation — partagée (menu + bouton du héro) */
export const ESTIMATION_ROUTE = "/estimation";

/** Route de la page « Vendez avec BR Immobilier » (sous-catégorie de Vendre) */
export const VENDRE_AVEC_BR_ROUTE = "/vendre-avec-br";

/** Route de la page « Shooting photo » (scrollytelling dédié) */
export const SHOOTING_ROUTE = "/shooting";

export const navGroups: NavGroup[] = [
  {
    title: "Acquérir",
    links: [
      { label: "Paris", to: "/acquerir/paris" },
      { label: "Île-de-France", to: "/acquerir/ile-de-france" },
      { label: "Créer une alerte email", to: "/acquerir/alerte-email" },
    ],
  },
  {
    title: "L'Agence",
    links: [
      { label: "Notre équipe", to: "/agence/equipe" },
      { label: "Notre vision", to: "/agence/vision" },
      { label: "Avis clients", to: "/agence/avis" },
    ],
  },
  {
    title: "Vendre",
    links: [
      { label: "Vendez avec BR IMMOBILIER", to: VENDRE_AVEC_BR_ROUTE },
      { label: "Nos biens vendus", to: "/vendre/biens-vendus" },
      { label: "Faites estimer votre bien", to: ESTIMATION_ROUTE },
    ],
  },
  {
    title: "Nos prestations",
    links: [
      { label: "Shooting photo", to: SHOOTING_ROUTE },
      { label: "Visite virtuelle", to: "/prestations/visite-virtuelle" },
      { label: "Plans sur-mesure", to: "/prestations/plans-sur-mesure" },
      { label: "Vidéo immobilière", to: "/prestations/video-immobiliere" },
      { label: "Home-Staging", to: "/prestations/home-staging" },
      { label: "Communication internationale", to: "/prestations/communication-internationale" },
      { label: "Accompagnement administratif", to: "/prestations/accompagnement-administratif" },
    ],
  },
  { title: "Recrutement", to: "/recrutement" },
  { title: "Contact", to: "/contact" },
];

/** Liste à plat de toutes les pages à générer (titre + route), dédoublonnée. */
export const allPages: { to: string; title: string }[] = (() => {
  const out: { to: string; title: string }[] = [];
  const seen = new Set<string>();
  const push = (to: string, title: string) => {
    if (seen.has(to)) return;
    seen.add(to);
    out.push({ to, title });
  };
  for (const g of navGroups) {
    if (g.links) g.links.forEach((l) => push(l.to, l.label));
    else if (g.to) push(g.to, g.title);
  }
  return out;
})();

/** Réseaux sociaux — URLs à remplacer par les vraies plus tard (À COMPLÉTER) */
export const socials: { label: string; href: string; icon: "facebook" | "instagram" | "linkedin" }[] = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];
