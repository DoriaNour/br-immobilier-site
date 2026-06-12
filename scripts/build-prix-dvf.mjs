#!/usr/bin/env node
/* =========================================================
   build-prix-dvf.mjs — Génère src/data/prix-paris.json
   à partir d'un export DVF géolocalisé (Paris, dépt 75).
   ---------------------------------------------------------
   SOURCE DES DONNÉES (à télécharger manuellement) :
     data.gouv.fr → « Demandes de valeurs foncières géolocalisées »
     (Etalab/DVF+). Fichier par département & année, ex. :
       https://files.data.gouv.fr/geo-dvf/latest/csv/2024/departements/75.csv.gz
     Téléchargez un ou plusieurs fichiers du département 75.

   USAGE :
     node scripts/build-prix-dvf.mjs <fichier.csv|.csv.gz> [--months=24]
     # plusieurs fichiers (ex. 2 années) :
     node scripts/build-prix-dvf.mjs 75-2024.csv.gz 75-2023.csv.gz --months=24

   CALCUL :
     - ventes uniquement (nature_mutation = "Vente")
     - locaux "Appartement" et "Maison"
     - mutations mono-local (on écarte les ventes multi-lots/mixtes)
     - €/m² = valeur_fonciere / surface_reelle_bati
     - filtre des aberrations (1 000–50 000 €/m², surface ≥ 9 m²)
     - fenêtre temporelle : N derniers mois (défaut 24)
     - MÉDIANE par arrondissement (75001–75020) × type
   ========================================================= */

import fs from "node:fs";
import zlib from "node:zlib";
import readline from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "src", "data", "prix-paris.json");

// ---- Arguments ------------------------------------------------------------
const argv = process.argv.slice(2);
const files = argv.filter((a) => !a.startsWith("--"));
const monthsArg = argv.find((a) => a.startsWith("--months="));
const MONTHS = monthsArg ? Number(monthsArg.split("=")[1]) : 24;

if (files.length === 0) {
  console.error(
    "\n⚠️  Aucun fichier DVF fourni.\n" +
      "Usage : node scripts/build-prix-dvf.mjs <fichier.csv|.csv.gz> [--months=24]\n"
  );
  process.exit(1);
}

const MIN_M2 = 1000;
const MAX_M2 = 50000;
const MIN_SURFACE = 9;
const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - MONTHS);

// ---- Petit parseur CSV (gère les guillemets) ------------------------------
function parseLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

// code_commune Paris "751xx" -> clé "750xx" (ex. 75101 -> 75001)
function arrKeyFromCommune(codeCommune, codePostal) {
  if (codeCommune && /^751\d{2}$/.test(codeCommune)) {
    const n = Number(codeCommune) - 75100; // 1..20
    if (n >= 1 && n <= 20) return "750" + String(n).padStart(2, "0");
  }
  if (codePostal && /^750\d{2}$/.test(codePostal)) return codePostal;
  return null;
}

function median(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

// ---- Lecture en flux ------------------------------------------------------
// On regroupe par id_mutation pour ne garder que les ventes mono-local.
const mutations = new Map(); // id -> { date, vente, locals: [{type, arr, m2price}] }

function ingest(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`Fichier introuvable : ${filePath}`));
      return;
    }
    const raw = fs.createReadStream(filePath);
    const input = filePath.endsWith(".gz") ? raw.pipe(zlib.createGunzip()) : raw;
    const rl = readline.createInterface({ input, crlfDelay: Infinity });

    let idx = null;
    rl.on("line", (line) => {
      if (!line) return;
      const f = parseLine(line);
      if (!idx) {
        idx = {};
        f.forEach((h, i) => (idx[h.trim()] = i));
        return;
      }
      const get = (k) => (idx[k] != null ? f[idx[k]] : undefined);

      const nature = get("nature_mutation");
      const type = get("type_local");
      if (nature !== "Vente") return;
      if (type !== "Appartement" && type !== "Maison") return;

      const dateStr = get("date_mutation");
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d) && d < cutoff) return;
      }

      const arr = arrKeyFromCommune(get("code_commune"), get("code_postal"));
      if (!arr) return;

      const valeur = Number(get("valeur_fonciere"));
      const surface = Number(get("surface_reelle_bati"));
      if (!valeur || !surface || surface < MIN_SURFACE) return;
      const m2price = valeur / surface;
      if (m2price < MIN_M2 || m2price > MAX_M2) return;

      const id = get("id_mutation") || `${dateStr}-${valeur}`;
      if (!mutations.has(id)) mutations.set(id, []);
      mutations.get(id).push({ type, arr, m2price });
    });
    rl.on("close", resolve);
    rl.on("error", reject);
  });
}

// ---- Agrégation -----------------------------------------------------------
async function main() {
  for (const file of files) {
    process.stdout.write(`→ Lecture ${file} …\n`);
    await ingest(file);
  }

  // Buckets €/m² par arrondissement × type (mutations mono-local uniquement)
  const buckets = {}; // arr -> { appartement: [], maison: [] }
  let kept = 0;
  for (const locals of mutations.values()) {
    if (locals.length !== 1) continue; // on écarte le multi-lots
    const { type, arr, m2price } = locals[0];
    const key = type === "Maison" ? "maison" : "appartement";
    (buckets[arr] ||= { appartement: [], maison: [] })[key].push(m2price);
    kept++;
  }

  const districts = {};
  for (let n = 1; n <= 20; n++) {
    const arr = "750" + String(n).padStart(2, "0");
    const b = buckets[arr] || { appartement: [], maison: [] };
    const appart = median(b.appartement);
    const maison = median(b.maison);
    districts[arr] = {
      label: `Paris ${n === 1 ? "1er" : n + "e"}`,
      appartement: appart,
      maison: maison ?? appart, // repli si trop peu de maisons
      _samples: { appartement: b.appartement.length, maison: b.maison.length },
    };
  }

  const json = {
    meta: {
      source:
        "DVF — Demandes de valeurs foncières géolocalisées (data.gouv.fr / Etalab)",
      generatedAt: new Date().toISOString(),
      periodMonths: MONTHS,
      unit: "EUR/m2",
      isDemo: false,
      note: `Médianes calculées sur ${kept} ventes mono-local (${MONTHS} derniers mois).`,
    },
    cities: {
      paris: { label: "Paris", default: true, districts },
    },
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`\n✅ ${OUT_PATH}`);
  console.log(`   ${kept} ventes retenues · fenêtre ${MONTHS} mois.`);
  console.log(
    "   (Le champ _samples par arrondissement indique le nb d'observations.)\n"
  );
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
