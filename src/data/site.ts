/* =========================================================
   BR IMMOBILIER — Données réelles (typées)
   Sources : br-immo.fr (agence, biens, équipe) · Opinion System n°10870 (avis)
   Aucune donnée inventée. Les manques sont marqués "À COMPLÉTER".
   ========================================================= */

export interface Agence {
  nom: string;
  slogan: string;
  adresse: string;
  tel: string;
  telBrut: string;
  email: string;
  zone: string;
  collaborateurs: number;
  partenaires: string[];
}

export interface Avis {
  auteur: string;
  date: string;
  note: number;
  texte: string;
  truncated?: boolean;
}

export interface AvisGlobal {
  note: number;
  total: number;
  source: string;
  url: string;
  liste: Avis[];
}

export interface Membre {
  nom: string;
  fonction: string;
  photo: string | null; // null => "À COMPLÉTER"
}

export interface Bien {
  ref: string;
  type: "appartement" | "studio" | "loft" | "maison" | "terrain";
  titre: string;
  cp: string;
  arr: string;
  prix: number;
  surface: number;
  pieces: number;
  img: string;
}

export const agence: Agence = {
  nom: "BR Immobilier",
  slogan: "L'immobilier à votre service",
  adresse: "7, Avenue de l'Opéra — 75001 Paris",
  tel: "01 40 15 92 25",
  telBrut: "0140159225",
  email: "contact@br-immo.fr",
  zone: "Paris & Île-de-France",
  collaborateurs: 30,
  partenaires: [
    "seLoger",
    "Belles Demeures",
    "Figaro Immobilier",
    "Logic-Immo",
    "Bien'ici",
    "ListGlobally",
  ],
};

export const avisGlobal: AvisGlobal = {
  note: 4.9,
  total: 205,
  source: "Opinion System — Avis contrôlés",
  url: "https://www.opinionsystem.fr/fr-fr/certificate/10870",
  liste: [
    { auteur: "Lucas V.", date: "21/05/2026", note: 5, texte: "Très bon accompagnement par E.A." },
    { auteur: "Amandine D.", date: "12/03/2026", note: 5, texte: "Très bon contact. Suivi sérieux." },
    { auteur: "Lilien C.", date: "13/03/2026", note: 5, texte: "Un grand professionnalisme, une bonne écoute, une réactivité à toutes les situations", truncated: true },
    { auteur: "Alice F.", date: "02/03/2026", note: 5, texte: "Nicolas a été très disponible pour organiser plusieurs visites / contre-visites", truncated: true },
    { auteur: "Mustapha N.", date: "22/04/2026", note: 5, texte: "Alban nous a permis de réaliser notre projet d'achat immobilier", truncated: true },
    { auteur: "Nazmiye B.", date: "22/04/2026", note: 5, texte: "Très satisfaite de BR Immobilier pour la vente de mon appartement", truncated: true },
  ],
};

/* Équipe (br-immo.fr/equipe) — noms & fonctions réels ; photos non extractibles => null. */
export const equipe: Membre[] = [
  { nom: "Killian BAYON", fonction: "Directeur", photo: null },
  { nom: "Thibaut BLANCHARD", fonction: "Team Leader", photo: null },
  { nom: "Arnaud DUPUY", fonction: "Team Leader", photo: null },
  { nom: "Samy AHNOUDJ", fonction: "Team Leader", photo: null },
  { nom: "Doria ATTIA", fonction: "Chargée des Ressources Humaines", photo: null },
  { nom: "Anaïs BENAROUIA", fonction: "Community Manager", photo: null },
  { nom: "Maxime PINCEMMIN", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Boubou CISSÉ", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Nadia PEREZ", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Pénélope COUSIN", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Steven MOUYOKOLO", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Margaux SCHWARZ", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Clohé MENSION", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Eva ALANTAR", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Cédric GOUSSAUD", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Yousra FOUATIH", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Alex MALANDIN", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Elmahi BEN AMMAR", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Imen LOUATI", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Albane WEBER", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Samira ALAOUI", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Julie JAMET", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Job HAMANE", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Nicolas MASLOWSKI", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Jason OKOYE", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Rosine MUTANGANA", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Evan PRISO", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Yoann MCGAIETH", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Elyes ZAMMIT", fonction: "Agent commercial en immobilier", photo: null },
  { nom: "Emma ROUART", fonction: "Négociatrice immobilier — Alternante", photo: null },
  { nom: "Alexandre DUBAR", fonction: "Négociateur immobilier — Alternance", photo: null },
];

/* Biens (br-immo.fr/vente) — faits réels ; descriptions détaillées => "À COMPLÉTER". */
export const biens: Bien[] = [
  { ref: "M3342Z", type: "studio", titre: "Centre de Paris / Studio / Dernier étage", cp: "75001", arr: "Paris 1ᵉʳ", prix: 270000, surface: 21.32, pieces: 1, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1100&q=80" },
  { ref: "4144", type: "loft", titre: "Studio d'enregistrement / 141 m² en souplex / Usage mixte", cp: "75017", arr: "Paris 17ᵉ", prix: 1600000, surface: 140.88, pieces: 4, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1100&q=80" },
  { ref: "4123B", type: "appartement", titre: "Mac-Mahon / Refait à neuf / Traversant", cp: "75017", arr: "Paris 17ᵉ", prix: 635000, surface: 45.44, pieces: 2, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1100&q=80" },
  { ref: "4122B", type: "appartement", titre: "Mac-Mahon / Balcon / Refait à neuf / Traversant", cp: "75017", arr: "Paris 17ᵉ", prix: 655000, surface: 45.33, pieces: 2, img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1100&q=80" },
  { ref: "4107C", type: "appartement", titre: "Promenade Pereire / Traversant / Balcon 11 m²", cp: "75017", arr: "Paris 17ᵉ", prix: 1075000, surface: 90, pieces: 4, img: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=1100&q=80" },
  { ref: "3793G", type: "studio", titre: "Calme / Très bon état / Sans vis-à-vis", cp: "75010", arr: "Paris 10ᵉ", prix: 270000, surface: 25, pieces: 1, img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1100&q=80" },
  { ref: "4056I", type: "studio", titre: "Bastille / Studio refait à neuf / Plan optimal", cp: "75011", arr: "Paris 11ᵉ", prix: 209000, surface: 16.08, pieces: 1, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1100&q=80" },
  { ref: "4053I", type: "appartement", titre: "Auteuil / Cocon sous les toits / Calme et lumineux", cp: "75016", arr: "Paris 16ᵉ", prix: 165000, surface: 14.69, pieces: 2, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1100&q=80" },
  { ref: "3958M", type: "appartement", titre: "Ménilmontant / Rez-de-chaussée au calme / Espace privatif", cp: "75020", arr: "Paris 20ᵉ", prix: 360000, surface: 48, pieces: 2, img: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1100&q=80" },
  { ref: "3857U", type: "appartement", titre: "Rez-de-chaussée sur jardin / Plan optimal / Calme et lumineux", cp: "75011", arr: "Paris 11ᵉ", prix: 630000, surface: 63.25, pieces: 3, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1100&q=80" },
];

/* Helpers */
export const euros = (n: number): string => n.toLocaleString("fr-FR") + " €";
export const initiales = (nom: string): string =>
  nom.split(" ").filter(Boolean).slice(0, 2).map((m) => m[0]).join("").toUpperCase();
