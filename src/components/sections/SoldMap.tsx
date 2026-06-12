import { useEffect, useState } from "react";
import { MapContainer, GeoJSON, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type {
  Feature,
  GeoJsonObject,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { euros } from "@/data/site";
import { loadBiensVendus } from "@/lib/biensVendus";
import { natureLabel, type BienVendu } from "@/data/biensVendus";

import arrondissementsGeo from "@/data/geo/arrondissements.geo.json";
import communesGeo from "@/data/geo/communes-limitrophes.geo.json";

/* ---------------------------------------------------------
   Habillage géographique (couleurs charte BR)
   --------------------------------------------------------- */
const ARR_STYLE: L.PathOptions = {
  fillColor: "#ece2c8", // crème — Paris ressort clair
  fillOpacity: 1,
  color: "#222222",
  weight: 1,
  opacity: 0.6,
};
const ARR_HOVER: L.PathOptions = {
  fillColor: "#ddcfa6",
  fillOpacity: 1,
  color: "#222222",
  weight: 1.2,
  opacity: 1,
};
const COMMUNE_STYLE: L.PathOptions = {
  fillColor: "#d7cdb4", // ton neutre distinct — petite couronne
  fillOpacity: 1,
  color: "#222222",
  weight: 1,
  opacity: 0.45,
  dashArray: "1 5",
};
const COMMUNE_HOVER: L.PathOptions = {
  fillColor: "#c8bd9c",
  fillOpacity: 1,
  color: "#222222",
  weight: 1.2,
  opacity: 0.85,
  dashArray: "1 5",
};

/** Limites géographiques : Paris + petite couronne immédiate. */
const PARIS_BOUNDS = L.latLngBounds([48.8, 2.21], [48.92, 2.47]);

/** Noms officiels lisibles pour quelques communes (le GeoJSON les abrège). */
const COMMUNE_NAMES: Record<string, string> = {
  Lilas: "Les Lilas",
  "Pré-Saint-Gervais": "Le Pré-Saint-Gervais",
  "Kremlin-Bicêtre": "Le Kremlin-Bicêtre",
  "Saint-Ouen": "Saint-Ouen-sur-Seine",
};

function pinIcon(active: boolean): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span class="br-pin${active ? " br-pin--active" : ""}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

/* ---------------------------------------------------------
   Contrôleur interne : bornes, zoom et recentrage doux
   --------------------------------------------------------- */
function MapController({ focus }: { focus: BienVendu | null }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(PARIS_BOUNDS.pad(0.02));
    map.fitBounds(PARIS_BOUNDS, { padding: [8, 8] });
  }, [map]);

  useEffect(() => {
    if (!focus) return;
    // Recentrage doux sur le bien, sans sur-zoomer (on garde la vue d'ensemble).
    map.flyTo([focus.lat, focus.lng], map.getZoom(), { duration: 0.7 });
  }, [focus, map]);

  return null;
}

/* ---------------------------------------------------------
   Section
   --------------------------------------------------------- */
export function SoldMap() {
  const [biens, setBiens] = useState<BienVendu[]>([]);
  const [selected, setSelected] = useState<BienVendu | null>(null);

  // ⚠️ Données fictives aujourd'hui — branchement API via loadBiensVendus()
  useEffect(() => {
    let alive = true;
    loadBiensVendus().then((data) => {
      if (alive) setBiens(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const onEachArr = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const num = feature.properties?.num;
    layer.bindTooltip(`${num}ᵉ arrondissement`, {
      sticky: true,
      direction: "top",
      className: "br-tip",
      offset: [0, -2],
    });
    layer.on({
      mouseover: () => (layer as L.Path).setStyle(ARR_HOVER),
      mouseout: () => (layer as L.Path).setStyle(ARR_STYLE),
    });
  };

  const onEachCommune = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const nom = feature.properties?.nom as string;
    layer.bindTooltip(COMMUNE_NAMES[nom] ?? nom, {
      sticky: true,
      direction: "top",
      className: "br-tip",
      offset: [0, -2],
    });
    layer.on({
      mouseover: () => (layer as L.Path).setStyle(COMMUNE_HOVER),
      mouseout: () => (layer as L.Path).setStyle(COMMUNE_STYLE),
    });
  };

  return (
    <section id="carte-biens-vendus" className="home-section surface-anthracite">
      <div className="mx-auto max-w-none">
        {/* En-tête (texte clair sur fond anthracite) */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.34em] text-[#eeebe4]/55">
              Nos ventes
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium text-[#eeebe4] md:text-5xl">
              La carte de nos biens vendus
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-[#eeebe4]/70">
              Paris et sa petite couronne. Cliquez sur un point pour découvrir le
              bien vendu par le cabinet.
            </p>
          </Reveal>
        </div>

        {/* Carte + encart */}
        <Reveal y={32}>
          <div className="br-map relative overflow-hidden rounded-sm border border-border">
            <MapContainer
              center={[48.8566, 2.3522]}
              zoom={12}
              minZoom={11}
              maxZoom={16}
              scrollWheelZoom={false}
              maxBoundsViscosity={1}
              className="h-[440px] w-full sm:h-[540px] lg:h-[660px]"
              zoomControl
            >
              <MapController focus={selected} />

              <GeoJSON
                data={communesGeo as GeoJsonObject}
                style={() => COMMUNE_STYLE}
                onEachFeature={onEachCommune}
              />
              <GeoJSON
                data={arrondissementsGeo as GeoJsonObject}
                style={() => ARR_STYLE}
                onEachFeature={onEachArr}
              />

              {biens.map((b) => (
                <Marker
                  key={b.id}
                  position={[b.lat, b.lng]}
                  icon={pinIcon(selected?.id === b.id)}
                  eventHandlers={{ click: () => setSelected(b) }}
                />
              ))}
            </MapContainer>

            {/* Légende */}
            <div className="pointer-events-none absolute bottom-4 left-4 z-[800] hidden gap-4 rounded-sm bg-background/90 px-4 py-3 text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm sm:flex">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-[2px] border border-foreground/60 bg-[#ece2c8]" />
                Paris
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-[2px] border border-foreground/40 border-dashed bg-[#d7cdb4]" />
                Communes
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-[#ece2c8] bg-foreground shadow-[0_0_0_1px_rgba(34,34,34,.4)]" />
                Bien vendu
              </span>
            </div>

            {/* Encart — panneau latéral (desktop) / bas plein largeur (mobile) */}
            <AnimatePresence>
              {selected && (
                <motion.aside
                  key={selected.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-3 bottom-3 z-[900] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:w-[330px]"
                >
                  <div className="relative rounded-sm border border-foreground/15 bg-background/95 p-6 shadow-[0_18px_50px_-20px_rgba(34,34,34,0.55)] backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label="Fermer"
                      className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <p className="pr-6 text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
                      {natureLabel(selected)}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-medium leading-tight">
                      {selected.titre}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {selected.descriptif}
                    </p>

                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
                      {selected.surface != null && (
                        <div>
                          <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                            Surface
                          </dt>
                          <dd className="mt-0.5">{selected.surface} m²</dd>
                        </div>
                      )}
                      {selected.quartier && (
                        <div>
                          <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                            Quartier
                          </dt>
                          <dd className="mt-0.5">{selected.quartier}</dd>
                        </div>
                      )}
                      {selected.prixVente != null && (
                        <div>
                          <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                            Vendu
                          </dt>
                          <dd className="mt-0.5 font-serif text-lg leading-none">
                            {euros(selected.prixVente)}
                          </dd>
                        </div>
                      )}
                      {selected.vendu && (
                        <div>
                          <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                            Date
                          </dt>
                          <dd className="mt-0.5">{selected.vendu}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
