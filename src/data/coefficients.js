/* =========================================================
   COEFFICIENTS D'ESTIMATION — BR Immobilier
   ---------------------------------------------------------
   Tous les coefficients sont MULTIPLICATIFS : 1 = neutre,
   > 1 valorise, < 1 décote. Éditez librement les valeurs.

   Formule (voir src/lib/estimation.ts) :
     prix_central = médiane_€/m² (arrondissement × type)
                    × surface
                    × typeCoef × etatCoef × etageCoef
                    × (ascenseurPenalite si pas d'ascenseur)
                    × exterieurCoef × dpeCoef × caveCoef
                    × parkingCoef × expositionCoef
     fourchette  = [ central × (1 - fourchette.bas),
                     central × (1 + fourchette.haut) ]
   ========================================================= */

/* Le DVF ne distingue que "appartement" et "maison".
   Les autres types s'appuient sur une de ces deux bases €/m². */
export const typeBase = {
  appartement: "appartement",
  maison: "maison",
  studio: "appartement",
  loft: "appartement",
  atelier: "appartement",
  autre: "appartement",
};

/* Coefficient propre au type (au-delà de la base €/m²). */
export const typeCoef = {
  appartement: 1.0,
  maison: 1.0,
  studio: 0.98, // décote légère (petites surfaces déjà chères au m²)
  loft: 1.05, // volume / atypique valorisé
  atelier: 0.95,
  autre: 1.0,
};

/* État général du bien. */
export const etatCoef = {
  "a-renover": 0.88,
  bon: 1.0,
  "refait-a-neuf": 1.08,
};

/* Étage (bandes dérivées du n° d'étage, voir estimation.ts). */
export const etageCoef = {
  rdc: 0.95, // rez-de-chaussée : décote
  bas: 1.0, // 1–2
  median: 1.02, // 3–4
  eleve: 1.04, // 5 et +
};

/* Pénalité appliquée UNIQUEMENT s'il n'y a PAS d'ascenseur. */
export const sansAscenseurPenalite = {
  rdc: 1.0,
  bas: 0.99,
  median: 0.95,
  eleve: 0.9,
};

/* Espace extérieur. */
export const exterieurCoef = {
  aucun: 1.0,
  balcon: 1.03,
  terrasse: 1.07,
  jardin: 1.1,
};

/* Diagnostic de performance énergétique (DPE). */
export const dpeCoef = {
  A: 1.05,
  B: 1.03,
  C: 1.01,
  D: 1.0,
  E: 0.98,
  F: 0.95,
  G: 0.92,
  nc: 1.0, // non communiqué
};

/* Annexes. */
export const caveCoef = { oui: 1.02, non: 1.0 };
export const parkingCoef = { oui: 1.05, non: 1.0 };

/* Exposition principale. */
export const expositionCoef = {
  nord: 0.98,
  "nord-est": 0.99,
  est: 1.0,
  "sud-est": 1.02,
  sud: 1.03,
  "sud-ouest": 1.02,
  ouest: 1.01,
  "nord-ouest": 0.99,
  nc: 1.0,
};

/* Largeur de la fourchette autour du prix central (±8–12 %). */
export const fourchette = { bas: 0.09, haut: 0.11 };

/* Arrondi d'affichage du prix (au millier d'euros le plus proche). */
export const arrondiAffichage = 1000;
