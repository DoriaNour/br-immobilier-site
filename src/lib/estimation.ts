/* =========================================================
   Logique d'estimation (pure, testable).
   prix = médiane €/m² (arrondissement × type) × surface × coefficients.
   Données : src/data/prix-paris.json · Coeffs : src/data/coefficients.js
   ========================================================= */
import prixDataRaw from "@/data/prix-paris.json";
import {
  typeBase,
  typeCoef,
  etatCoef,
  etageCoef,
  sansAscenseurPenalite,
  exterieurCoef,
  dpeCoef,
  caveCoef,
  parkingCoef,
  expositionCoef,
  fourchette,
  arrondiAffichage,
} from "@/data/coefficients";

export type BienType =
  | "appartement"
  | "maison"
  | "studio"
  | "loft"
  | "atelier"
  | "autre";
export type Etat = "a-renover" | "bon" | "refait-a-neuf";
export type Exterieur = "aucun" | "balcon" | "terrasse" | "jardin";
export type Dpe = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "nc";
export type Exposition =
  | "nord"
  | "nord-est"
  | "est"
  | "sud-est"
  | "sud"
  | "sud-ouest"
  | "ouest"
  | "nord-ouest"
  | "nc";

export interface EstimationInput {
  city?: string;
  district: string;
  type: BienType;
  surface: number;
  pieces?: number;
  etat: Etat;
  etage: number; // n° d'étage (0 = RDC)
  ascenseur: boolean;
  exterieur: Exterieur;
  dpe: Dpe;
  cave: boolean;
  parking: boolean;
  exposition: Exposition;
}

export interface EstimationResult {
  medianeM2: number; // base €/m² (selon type) de l'arrondissement
  prixCentral: number;
  basse: number;
  haute: number;
  coefTotal: number;
  districtLabel: string;
}

interface District {
  label: string;
  appartement: number | null;
  maison: number | null;
}
interface City {
  label: string;
  default?: boolean;
  districts: Record<string, District>;
}
interface PrixData {
  meta: { isDemo?: boolean; [k: string]: unknown };
  cities: Record<string, City>;
}

const prixData = prixDataRaw as unknown as PrixData;
const DEFAULT_CITY = "paris";

export function isDemoData(): boolean {
  return Boolean(prixData.meta?.isDemo);
}

export function listDistricts(
  city = DEFAULT_CITY
): { code: string; label: string }[] {
  const c = prixData.cities[city];
  if (!c) return [];
  return Object.entries(c.districts).map(([code, d]) => ({
    code,
    label: d.label,
  }));
}

function etageBand(etage: number): "rdc" | "bas" | "median" | "eleve" {
  if (etage <= 0) return "rdc";
  if (etage <= 2) return "bas";
  if (etage <= 4) return "median";
  return "eleve";
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function estimer(input: EstimationInput): EstimationResult | null {
  const city = prixData.cities[input.city ?? DEFAULT_CITY];
  if (!city) return null;
  const district = city.districts[input.district];
  if (!district) return null;

  const baseKey = typeBase[input.type] ?? "appartement";
  const medianeM2 = district[baseKey] ?? district.appartement ?? district.maison;
  if (!medianeM2 || !input.surface || input.surface <= 0) return null;

  const band = etageBand(input.etage ?? 0);
  const coef =
    (typeCoef[input.type] ?? 1) *
    (etatCoef[input.etat] ?? 1) *
    (etageCoef[band] ?? 1) *
    (input.ascenseur ? 1 : sansAscenseurPenalite[band] ?? 1) *
    (exterieurCoef[input.exterieur] ?? 1) *
    (dpeCoef[input.dpe] ?? 1) *
    (caveCoef[input.cave ? "oui" : "non"] ?? 1) *
    (parkingCoef[input.parking ? "oui" : "non"] ?? 1) *
    (expositionCoef[input.exposition] ?? 1);

  const central = medianeM2 * input.surface * coef;

  return {
    medianeM2,
    prixCentral: roundTo(central, arrondiAffichage),
    basse: roundTo(central * (1 - fourchette.bas), arrondiAffichage),
    haute: roundTo(central * (1 + fourchette.haut), arrondiAffichage),
    coefTotal: coef,
    districtLabel: district.label,
  };
}
