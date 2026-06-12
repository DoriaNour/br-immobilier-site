/* =========================================================
   Netlify Function — capture d'un lead d'estimation.
   Reçoit { lead, estimation }, valide, envoie un email au
   destinataire LEAD_EMAIL_TO (défaut k.bayon@br-immo.fr).

   Variables d'environnement (Netlify → Site settings → Env) :
     LEAD_EMAIL_TO    destinataire   (défaut: k.bayon@br-immo.fr)
     LEAD_EMAIL_FROM  expéditeur     (défaut: domaine de démo Resend)
     RESEND_API_KEY   clé d'envoi    (À DÉFINIR — tant qu'absente, le
                                      lead est journalisé et la réponse
                                      reste 200, sans email expédié.)
   ========================================================= */

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO || "k.bayon@br-immo.fr";
const LEAD_EMAIL_FROM =
  process.env.LEAD_EMAIL_FROM || "BR Immobilier <onboarding@resend.dev>";

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

const emailOk = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Méthode non autorisée." });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Corps de requête JSON invalide." });
  }

  const { lead, estimation } = payload || {};
  if (!lead || !lead.nom || !emailOk(lead.email) || !lead.consent) {
    return json(400, {
      error: "Champs requis manquants (nom, email valide, consentement).",
    });
  }

  const subject = `Nouveau lead estimation — ${lead.nom}`;
  const text = renderText(lead, estimation);
  const html = renderHtml(lead, estimation);

  try {
    const sent = await sendEmail({
      to: LEAD_EMAIL_TO,
      from: LEAD_EMAIL_FROM,
      replyTo: lead.email,
      subject,
      text,
      html,
    });

    // TODO: push lead vers Hektor (CRM) — ex. await pushToHektor(lead, estimation)

    return json(200, { ok: true, emailSent: sent.sent, info: sent.info });
  } catch (err) {
    console.error("[lead-estimation] échec d'envoi:", err);
    return json(502, { error: "Envoi impossible pour le moment." });
  }
};

/* ---- Fournisseur d'email isolé (swap facile) ----------------------------- */
async function sendEmail({ to, from, replyTo, subject, text, html }) {
  const key = process.env.RESEND_API_KEY;

  // Clé non configurée → on journalise le lead, succès "non envoyé".
  if (!key) {
    console.log(
      "[lead-estimation] RESEND_API_KEY absente — lead journalisé:",
      JSON.stringify({ to, subject, text })
    );
    return { sent: false, info: "email-not-configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return { sent: true, info: "sent" };
}

/* ---- Rendu du récap ------------------------------------------------------ */
function fmtEuro(n) {
  return typeof n === "number" ? n.toLocaleString("fr-FR") + " €" : "—";
}
function oui(b) {
  return b ? "Oui" : "Non";
}

function renderText(lead, e = {}) {
  return [
    "NOUVEAU LEAD — Estimation en ligne",
    "",
    `Nom        : ${lead.nom}`,
    `Email      : ${lead.email}`,
    `Téléphone  : ${lead.telephone || "—"}`,
    `Message    : ${lead.message || "—"}`,
    "",
    "— Récapitulatif de l'estimation —",
    `Type           : ${e.type || "—"}`,
    `Localisation   : ${e.ville || "—"} ${e.arrondissement || ""}`.trim(),
    `Surface        : ${e.surface ?? "—"} m²`,
    `Pièces         : ${e.pieces ?? "—"}`,
    `État           : ${e.etat || "—"}`,
    `Étage          : ${e.etage ?? "—"} (ascenseur : ${oui(e.ascenseur)})`,
    `Extérieur      : ${e.exterieur || "—"}`,
    `DPE            : ${e.dpe || "—"}`,
    `Cave           : ${oui(e.cave)}`,
    `Parking        : ${oui(e.parking)}`,
    `Exposition     : ${e.exposition || "—"}`,
    `Médiane €/m²   : ${fmtEuro(e.medianeM2)}`,
    `Fourchette     : ${fmtEuro(e.fourchetteBasse)} – ${fmtEuro(e.fourchetteHaute)}`,
    "",
    "Estimation indicative (DVF) — ne constitue ni un avis de valeur ni une expertise.",
  ].join("\n");
}

function renderHtml(lead, e = {}) {
  const row = (k, v) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap">${k}</td><td style="padding:4px 0;color:#222"><strong>${v}</strong></td></tr>`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#222;max-width:560px">
    <h2 style="margin:0 0 4px">Nouveau lead — Estimation en ligne</h2>
    <table style="border-collapse:collapse;margin:12px 0">
      ${row("Nom", lead.nom)}
      ${row("Email", `<a href="mailto:${lead.email}">${lead.email}</a>`)}
      ${row("Téléphone", lead.telephone || "—")}
      ${row("Message", lead.message || "—")}
    </table>
    <h3 style="margin:16px 0 4px">Récapitulatif de l'estimation</h3>
    <table style="border-collapse:collapse;margin:8px 0">
      ${row("Type", e.type || "—")}
      ${row("Localisation", `${e.ville || ""} ${e.arrondissement || ""}`.trim() || "—")}
      ${row("Surface", `${e.surface ?? "—"} m²`)}
      ${row("Pièces", e.pieces ?? "—")}
      ${row("État", e.etat || "—")}
      ${row("Étage", `${e.etage ?? "—"} (ascenseur : ${oui(e.ascenseur)})`)}
      ${row("Extérieur", e.exterieur || "—")}
      ${row("DPE", e.dpe || "—")}
      ${row("Cave", oui(e.cave))}
      ${row("Parking", oui(e.parking))}
      ${row("Exposition", e.exposition || "—")}
      ${row("Médiane €/m²", fmtEuro(e.medianeM2))}
      ${row("Fourchette", `${fmtEuro(e.fourchetteBasse)} – ${fmtEuro(e.fourchetteHaute)}`)}
    </table>
    <p style="font-size:12px;color:#888;margin-top:16px">
      Estimation indicative (DVF) — ne constitue ni un avis de valeur ni une expertise.
    </p>
  </div>`;
}
