/* Déclarations de types pour coefficients.js (source de vérité = le .js).
   Permet un import strictement typé sans activer allowJs. */
type Dict = Record<string, number>;

export const typeBase: Record<string, "appartement" | "maison">;
export const typeCoef: Dict;
export const etatCoef: Dict;
export const etageCoef: Dict;
export const sansAscenseurPenalite: Dict;
export const exterieurCoef: Dict;
export const dpeCoef: Dict;
export const caveCoef: Dict;
export const parkingCoef: Dict;
export const expositionCoef: Dict;
export const fourchette: { bas: number; haut: number };
export const arrondiAffichage: number;
