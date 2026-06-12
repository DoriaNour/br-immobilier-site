import type {
  BienType,
  Etat,
  Exterieur,
  Dpe,
  Exposition,
} from "@/lib/estimation";

/** État global du formulaire multi-étapes. */
export interface FormState {
  type: BienType | "";
  city: string;
  district: string;
  surface: number | "";
  pieces: number | "";
  etat: Etat;
  etage: number | "";
  ascenseur: boolean;
  exterieur: Exterieur;
  dpe: Dpe;
  cave: boolean;
  parking: boolean;
  exposition: Exposition;
}

export type Update = <K extends keyof FormState>(
  key: K,
  value: FormState[K]
) => void;

export const initialForm: FormState = {
  type: "",
  city: "paris",
  district: "",
  surface: "",
  pieces: "",
  etat: "bon",
  etage: "",
  ascenseur: false,
  exterieur: "aucun",
  dpe: "nc",
  cave: false,
  parking: false,
  exposition: "nc",
};
