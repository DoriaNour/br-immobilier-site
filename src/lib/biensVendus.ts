/* =========================================================
   BR IMMOBILIER — Chargement des biens vendus
   ---------------------------------------------------------
   Frontière de contrat entre la carte et la source de données.
   AUJOURD'HUI  : renvoie le jeu de démonstration (mock local).
   DEMAIN       : remplacer le corps de `loadBiensVendus()` par un
                  appel à l'API réelle, en renvoyant des `BienVendu[]`.
                  Aucun autre fichier n'a besoin d'être modifié.
   ========================================================= */

import { BIENS_VENDUS_DEMO, type BienVendu } from "@/data/biensVendus";

/**
 * Charge les biens vendus à afficher sur la carte.
 *
 * ⚠️  À REMPLACER PAR L'API
 * Exemple d'implémentation future :
 *
 *   export async function loadBiensVendus(): Promise<BienVendu[]> {
 *     const res = await fetch("/api/biens-vendus");
 *     if (!res.ok) throw new Error("Échec du chargement des biens vendus");
 *     return (await res.json()) as BienVendu[];
 *   }
 *
 * La signature (async, renvoie `BienVendu[]`) est volontairement déjà
 * asynchrone pour que le branchement API ne change rien côté composant.
 */
export async function loadBiensVendus(): Promise<BienVendu[]> {
  // --- Démonstration : données fictives locales ---
  return BIENS_VENDUS_DEMO;
}
