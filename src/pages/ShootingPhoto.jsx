/**
 * ShootingPhoto.jsx — Page « Shooting photo » BR Immobilier
 * ---------------------------------------------------------------------------
 * Scrollytelling prestige : 6 scènes plein écran qui se révèlent au défilement.
 * Charte BR : anthracite #222222 / ivoire #EEEBE4 · Cormorant Garamond + Jost.
 *
 * DÉPENDANCES
 *   npm i motion lenis
 *   - motion : fade-in, parallax, compteurs (import depuis "motion/react")
 *   - lenis : défilement fluide (branché UNE SEULE FOIS via <SmoothScroll> au
 *     niveau App — voir src/components/SmoothScroll.tsx et src/main.tsx).
 *
 * POLICES
 *   Cormorant Garamond (titres) + Jost (corps) sont chargées globalement dans
 *   src/index.css (@import Google Fonts). Rien à ajouter ici.
 *
 * IMAGES
 *   Déposer les visuels dans /public/shooting/ puis ajuster IMAGES ci-dessous.
 *   Tant qu'elles ne sont pas présentes, un aplat de couleur tient la place.
 * ---------------------------------------------------------------------------
 */

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from "motion/react";

/* Chemins des visuels — à remplacer par les vraies photos */
const IMAGES = {
  hero: "/shooting/hero.jpg",
  light: "/shooting/lumiere.jpg",
  before: "/shooting/avant.jpg",
  after: "/shooting/apres.jpg",
};

/* ⚠️ À SOURCER / VALIDER avant mise en ligne (FNAIM, baromètres notariaux,
   SeLoger, ou données internes BR). Valeurs actuelles = illustratives. */
const STATS = [
  { prefix: "+", value: 90, suffix: "%", label: "des recherches débutent en ligne" },
  { prefix: "−", value: 30, suffix: "%", label: "de délai de vente" },
  { prefix: "×", value: 3, suffix: "", label: "de visites qualifiées" },
];

const EASE = [0.22, 1, 0.36, 1];

/* Image avec parallax vertical doux pilotée par sa propre progression de scroll */
function ParallaxImage({ src, alt, fallback }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <div ref={ref} className="sp-imgwrap" style={{ background: fallback }}>
      <motion.img className="sp-img" src={src} alt={alt} style={{ y }} loading="lazy" />
    </div>
  );
}

/* Compteur qui s'incrémente lorsqu'il entre dans le champ */
function Counter({ prefix = "", value, suffix = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(n)}
      {suffix}
    </span>
  );
}

/* Props de révélation au scroll (respecte prefers-reduced-motion) */
function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.9, ease: EASE, delay },
  });
}

export default function ShootingPhoto() {
  const reveal = useReveal();
  const reduce = useReducedMotion();

  /* Hero : léger zoom + remontée du contenu au défilement */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const heroY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 70]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="sp-root">
      <style>{`
        .sp-root{
          --anthracite:#222222; --ivoire:#EEEBE4;
          --serif:'Cormorant Garamond', Georgia, serif;
          --sans:'Jost', system-ui, sans-serif;
          font-family:var(--sans); color:var(--anthracite);
          font-weight:300; line-height:1.6;
        }
        .sp-root *{box-sizing:border-box;}
        .sp-section{
          position:relative; min-height:100svh;
          display:flex; flex-direction:column; justify-content:center;
          padding:clamp(2rem,7vw,7rem); overflow:hidden;
        }
        .sp-dark{background:var(--anthracite); color:var(--ivoire);}
        .sp-light{background:var(--ivoire); color:var(--anthracite);}
        .sp-eyebrow{
          font-size:13px; letter-spacing:.32em; text-transform:uppercase;
          font-weight:400; opacity:.55; margin:0 0 1.4rem;
        }
        .sp-h{font-family:var(--serif); font-weight:400; line-height:1.12; margin:0;}
        .sp-lead{
          font-size:clamp(1.05rem,2.2vw,1.45rem); font-weight:300;
          max-width:34ch; margin:1.4rem 0 0; opacity:.85;
        }
        /* Hero */
        .sp-hero{align-items:center; text-align:center; color:var(--ivoire);}
        .sp-hero-media{position:absolute; inset:0; background:var(--anthracite); overflow:hidden;}
        .sp-hero-media img{width:100%; height:100%; object-fit:cover; opacity:.62;}
        .sp-hero-inner{position:relative; z-index:2; max-width:900px;}
        .sp-hero .sp-h{font-size:clamp(2.4rem,6vw,5rem);}
        .sp-hero .sp-eyebrow{opacity:.7;}
        .sp-scrollcue{
          position:absolute; bottom:2.2rem; left:50%; transform:translateX(-50%);
          z-index:2; font-size:22px; opacity:.7;
        }
        /* Sections media */
        .sp-imgwrap{position:absolute; inset:0; overflow:hidden;}
        .sp-img{width:100%; height:118%; object-fit:cover; opacity:.7; will-change:transform;}
        .sp-overlay{position:relative; z-index:2; max-width:560px;}
        .sp-split{display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(2rem,5vw,5rem); align-items:center;}
        .sp-split-text .sp-h{font-size:clamp(1.8rem,4vw,3rem);}
        .sp-portrait{
          aspect-ratio:4/5; border-radius:2px; overflow:hidden; position:relative;
        }
        .sp-portrait img{width:100%; height:100%; object-fit:cover; display:block;}
        /* Avant / après */
        .sp-ba{display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:520px; margin-bottom:2.2rem;}
        .sp-ba figure{margin:0;}
        .sp-ba .sp-frame{aspect-ratio:3/2; border-radius:2px; overflow:hidden; position:relative;}
        .sp-ba .sp-frame img{width:100%; height:100%; object-fit:cover; display:block;}
        .sp-ba figcaption{font-size:12px; letter-spacing:.2em; text-transform:uppercase; opacity:.5; margin-top:.6rem;}
        .sp-ba .muted{filter:grayscale(.4) brightness(.78);}
        /* Stats */
        .sp-stats{display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(1.5rem,4vw,4rem); margin-top:1rem;}
        .sp-stat{text-align:center;}
        .sp-stat .num{font-family:var(--serif); font-weight:400; font-size:clamp(2.6rem,6vw,4.2rem); line-height:1; display:block;}
        .sp-stat .lab{font-size:14px; opacity:.65; margin-top:.8rem; display:block; max-width:18ch; margin-inline:auto;}
        /* CTA */
        .sp-cta{align-items:center; text-align:center; min-height:80svh;}
        .sp-cta .sp-h{font-size:clamp(1.9rem,4.5vw,3.4rem); max-width:18ch;}
        .sp-btn{
          display:inline-block; margin-top:2.2rem; padding:1rem 2.6rem;
          background:var(--anthracite); color:var(--ivoire);
          font-family:var(--sans); font-size:14px; letter-spacing:.08em;
          text-decoration:none; border-radius:2px; transition:opacity .3s ease;
        }
        .sp-btn:hover{opacity:.82;}
        .sp-btn:focus-visible{outline:2px solid var(--anthracite); outline-offset:4px;}
        /* Responsive */
        @media (max-width:760px){
          .sp-split{grid-template-columns:1fr;}
          .sp-stats{grid-template-columns:1fr; gap:2.5rem;}
          .sp-portrait{aspect-ratio:16/10;}
        }
        @media (prefers-reduced-motion:reduce){
          .sp-img,.sp-hero-media img{will-change:auto;}
        }
      `}</style>

      {/* 01 — HÉRO */}
      <section ref={heroRef} className="sp-section sp-hero">
        <motion.div className="sp-hero-media" style={{ scale: heroScale }}>
          <img src={IMAGES.hero} alt="Intérieur valorisé par un shooting professionnel" />
        </motion.div>
        <motion.div className="sp-hero-inner" style={{ y: heroY, opacity: heroFade }}>
          <motion.p
            className="sp-eyebrow"
            initial={reduce ? { opacity: 0.7 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            Valorisation visuelle
          </motion.p>
          <motion.h1
            className="sp-h"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          >
            La photographie,
            <br /> premier regard sur votre bien
          </motion.h1>
        </motion.div>
        <div className="sp-scrollcue" aria-hidden="true">↓</div>
      </section>

      {/* 02 — VISIBILITÉ */}
      <section className="sp-section sp-light">
        <div className="sp-split">
          <motion.div className="sp-split-text" {...reveal()}>
            <p className="sp-eyebrow">Visibilité</p>
            <h2 className="sp-h">Le premier regard est numérique</h2>
            <p className="sp-lead">
              Avant la première visite, il y a la première image. Elle dure trois
              secondes — et décide de l'envie d'aller plus loin.
            </p>
          </motion.div>
          <motion.div className="sp-portrait" {...reveal(0.15)} style={{ background: "#dad5ca" }}>
            <ParallaxImage src={IMAGES.light} alt="Découverte d'une annonce en ligne" fallback="#dad5ca" />
          </motion.div>
        </div>
      </section>

      {/* 03 — LUMIÈRE */}
      <section className="sp-section sp-dark">
        <ParallaxImage src={IMAGES.light} alt="Pièce traversée par la lumière naturelle" fallback="#262626" />
        <motion.div className="sp-overlay" {...reveal()}>
          <p className="sp-eyebrow">Lumière</p>
          <h2 className="sp-h" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>
            Révéler la lumière
          </h2>
          <p className="sp-lead">
            Faire entrer la lumière, les volumes, l'atmosphère. Donner à voir ce
            qui ne se photographie pas par hasard.
          </p>
        </motion.div>
      </section>

      {/* 04 — PROJECTION */}
      <section className="sp-section sp-light">
        <motion.div {...reveal()}>
          <p className="sp-eyebrow">Projection</p>
          <div className="sp-ba">
            <figure>
              <div className="sp-frame"><img className="muted" src={IMAGES.before} alt="Photo amateur, avant" /></div>
              <figcaption>Avant</figcaption>
            </figure>
            <figure>
              <div className="sp-frame"><img src={IMAGES.after} alt="Photo professionnelle, après" /></div>
              <figcaption>Après</figcaption>
            </figure>
          </div>
          <h2 className="sp-h" style={{ fontSize: "clamp(1.8rem,4vw,3rem)" }}>
            Se projeter
          </h2>
          <p className="sp-lead">Là où un cliché montre, une image fait ressentir.</p>
        </motion.div>
      </section>

      {/* 05 — RÉSULTATS */}
      <section className="sp-section sp-dark" style={{ minHeight: "85svh" }}>
        <motion.p className="sp-eyebrow" {...reveal()}>Résultats</motion.p>
        <div className="sp-stats">
          {STATS.map((s, i) => (
            <motion.div key={s.label} className="sp-stat" {...reveal(i * 0.12)}>
              <span className="num">
                <Counter prefix={s.prefix} value={s.value} suffix={s.suffix} />
              </span>
              <span className="lab">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 06 — SIGNATURE / CTA */}
      <section className="sp-section sp-light sp-cta">
        <motion.div {...reveal()}>
          <p className="sp-eyebrow">BR Immobilier</p>
          <h2 className="sp-h">Offrir à votre bien la présentation qu'il mérite</h2>
          <a className="sp-btn" href="/contact">Confier mon bien</a>
        </motion.div>
      </section>
    </main>
  );
}
