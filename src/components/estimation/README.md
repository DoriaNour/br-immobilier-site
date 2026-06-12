# Simulateur d'estimation — BR Immobilier

Wizard d'estimation (fourchette de prix) à partir de données publiques **DVF**,
avec capture de lead. Composant : `<SimulateurEstimation />` monté sur la page
`/estimation` (`src/pages/EstimationPage.tsx`).

## Arborescence

```
src/data/prix-paris.json          # médianes €/m² par arrondissement × type (multi-villes)
src/data/coefficients.js          # coefficients d'ajustement (éditables) + types .d.ts
src/lib/estimation.ts             # calcul pur : médiane × surface × coefficients → fourchette
src/components/estimation/        # wizard + étapes + formulaire de lead
scripts/build-prix-dvf.mjs        # régénère prix-paris.json depuis un export DVF
netlify/functions/lead-estimation.js  # envoi du lead par email
```

## 1. Régénérer `prix-paris.json` depuis les vraies données DVF

Les valeurs livrées sont **de démonstration** (`meta.isDemo = true`, un bandeau
le signale dans le résultat).

1. Téléchargez un export **« Demandes de valeurs foncières géolocalisées »**
   (data.gouv.fr / Etalab), **département 75**, ex. :
   `https://files.data.gouv.fr/geo-dvf/latest/csv/2024/departements/75.csv.gz`
   (récupérez 1 à 2 années pour couvrir 12–24 mois).
2. Lancez :
   ```bash
   npm run build:prix-dvf -- chemin/vers/75-2024.csv.gz chemin/vers/75-2023.csv.gz --months=24
   ```
   Le script calcule les **médianes €/m²** par arrondissement (75001–75020) et
   par type (appartement / maison), sur les N derniers mois, puis écrit
   `src/data/prix-paris.json` (avec `_samples` = nb d'observations par zone).

> `.csv` comme `.csv.gz` sont acceptés (décompression à la volée).

### Ajouter d'autres villes plus tard
La structure est multi-villes : `cities.<slug>.districts.<code>.{appartement,maison}`.
Ajoutez une entrée sous `cities` (le simulateur utilise `paris` par défaut ;
l'UI ville est verrouillée « Bientôt » en attendant).

## 2. Régler les coefficients

Tout est dans **`src/data/coefficients.js`** (commenté) : état, étage/ascenseur,
extérieur, DPE, cave, parking, exposition, mapping des types non‑DVF
(studio/loft/atelier/autre) et **largeur de fourchette** (`fourchette`, ±8–12 %).
Valeurs **multiplicatives** (1 = neutre). Modifiez librement.

## 3. Email du lead (Netlify)

Fonction : `netlify/functions/lead-estimation.js`. Variables d'environnement
(Netlify → Site settings → Environment variables) :

| Variable | Rôle | Défaut |
|----------|------|--------|
| `LEAD_EMAIL_TO` | destinataire du lead | `k.bayon@br-immo.fr` |
| `LEAD_EMAIL_FROM` | expéditeur | domaine de démo Resend |
| `RESEND_API_KEY` | clé d'envoi (Resend) | _(non définie)_ |

- **Tant que `RESEND_API_KEY` est absente**, le lead est **journalisé** (logs de
  la fonction) et l'API répond `200` (`emailSent:false`) : le parcours marche,
  aucun email n'est expédié. Définissez la clé pour activer l'envoi.
- Le fournisseur est **isolé** dans `sendEmail()` → remplaçable (SMTP/SendGrid…)
  sans toucher au reste.
- **CRM** : un `// TODO: push lead vers Hektor` marque l'endroit où brancher
  Hektor plus tard.

### Tester en local avec les fonctions
`npm run dev` (Vite) ne sert pas les fonctions. Pour les tester :
```bash
npx netlify dev
```
ou définissez `VITE_LEAD_ENDPOINT` pour pointer vers une autre URL.

## Mention légale
Affichée sous le résultat : _« Estimation indicative générée à partir de données
publiques (DVF). Elle ne constitue ni un avis de valeur ni une expertise. Seule
une visite permet une estimation précise. »_
