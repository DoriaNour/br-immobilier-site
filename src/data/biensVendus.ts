/* =========================================================
   BR IMMOBILIER — Biens VENDUS (pour la carte interactive)
   ---------------------------------------------------------
   ⚠️  À REMPLACER PAR L'API
   Les biens ci-dessous sont des données FICTIVES de démonstration.
   Elles servent uniquement à montrer le fonctionnement de la carte.
   Le jour où l'API est prête, il suffit de modifier le corps de
   `loadBiensVendus()` dans src/lib/biensVendus.ts — le reste du code
   (carte, marqueurs, encart) s'appuie sur le type `BienVendu` et n'a
   PAS besoin d'être touché.
   ========================================================= */

export type NatureBien =
  | "Appartement"
  | "Studio"
  | "Loft"
  | "Maison"
  | "Duplex"
  | "Terrain";

export interface BienVendu {
  /** Identifiant stable (référence interne ou id API) */
  id: string;
  /** Coordonnées géographiques du bien (WGS84, comme une carte) */
  lat: number;
  lng: number;
  /** Nature du bien — ex. « Appartement 3 pièces » se compose de `nature` + `pieces` */
  nature: NatureBien;
  /** Nombre de pièces (optionnel pour un studio/terrain) */
  pieces?: number;
  /** Titre court affiché en tête de l'encart */
  titre: string;
  /** Court descriptif présenté dans l'encart */
  descriptif: string;
  /** Infos complémentaires affichées en pied d'encart */
  surface?: number; // m²
  quartier?: string;
  /** Prix de vente (optionnel — affiché s'il est fourni) */
  prixVente?: number;
  /** Date de vente au format lisible (optionnel) */
  vendu?: string;
}

/**
 * ⚠️  À REMPLACER PAR L'API
 * Jeu de démonstration (3 à 5 biens) positionnés sur Paris / petite couronne.
 * Coordonnées approximatives, à titre illustratif uniquement.
 */
export const BIENS_VENDUS_DEMO: BienVendu[] = [
  {
    id: "DEMO-001",
    lat: 48.8709,
    lng: 2.3412,
    nature: "Appartement",
    pieces: 3,
    titre: "Appartement haussmannien",
    descriptif:
      "Bel appartement traversant au 4ᵉ étage, moulures et parquet d'origine, à deux pas de l'Opéra.",
    surface: 78,
    quartier: "Opéra — 9ᵉ",
    prixVente: 985000,
    vendu: "Mars 2026",
  },
  {
    id: "DEMO-002",
    lat: 48.8462,
    lng: 2.3712,
    nature: "Studio",
    titre: "Studio de charme",
    descriptif:
      "Studio optimisé sous combles, lumineux et calme, idéal premier achat ou investissement locatif.",
    surface: 24,
    quartier: "Bercy — 12ᵉ",
    prixVente: 312000,
    vendu: "Février 2026",
  },
  {
    id: "DEMO-003",
    lat: 48.8924,
    lng: 2.2887,
    nature: "Appartement",
    pieces: 4,
    titre: "Familial avec balcon",
    descriptif:
      "Quatre pièces récemment rénové avec balcon filant, double exposition et cave.",
    surface: 92,
    quartier: "Neuilly-sur-Seine",
    prixVente: 1180000,
    vendu: "Avril 2026",
  },
  {
    id: "DEMO-004",
    lat: 48.8156,
    lng: 2.3186,
    nature: "Loft",
    pieces: 2,
    titre: "Loft d'architecte",
    descriptif:
      "Ancien atelier transformé en loft, volumes atypiques, verrière et hauteur sous plafond de 4 m.",
    surface: 110,
    quartier: "Montrouge",
    prixVente: 845000,
    vendu: "Janvier 2026",
  },
  {
    id: "DEMO-005",
    lat: 48.8543,
    lng: 2.4012,
    nature: "Maison",
    pieces: 5,
    titre: "Maison de ville",
    descriptif:
      "Maison sur trois niveaux avec jardin clos, garage et terrasse, dans une rue pavée recherchée.",
    surface: 145,
    quartier: "Saint-Mandé",
    prixVente: 1490000,
    vendu: "Mai 2026",
  },
];

/** Compose un libellé du type « Appartement 3 pièces ». */
export function natureLabel(b: BienVendu): string {
  if (b.pieces && b.pieces > 1) return `${b.nature} ${b.pieces} pièces`;
  return b.nature;
}
