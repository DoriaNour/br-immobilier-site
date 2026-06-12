import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { PageTemplate } from "@/pages/PageTemplate";
import { EstimationPage } from "@/pages/EstimationPage";
import { VendreAvecBrPage } from "@/pages/VendreAvecBrPage";
import ShootingPhoto from "@/pages/ShootingPhoto";
import { allPages, ESTIMATION_ROUTE, VENDRE_AVEC_BR_ROUTE, SHOOTING_ROUTE } from "@/data/nav";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* Page dédiée : simulateur d'estimation */}
        <Route path={ESTIMATION_ROUTE} element={<EstimationPage />} />

        {/* Page dédiée : Vendez avec BR Immobilier */}
        <Route path={VENDRE_AVEC_BR_ROUTE} element={<VendreAvecBrPage />} />

        {/* Page dédiée : Shooting photo (scrollytelling) */}
        <Route path={SHOOTING_ROUTE} element={<ShootingPhoto />} />

        {/* Une page gabarit par sous-catégorie / catégorie sans sous-catégorie
            (on exclut les routes ayant déjà leur propre page ci-dessus) */}
        {allPages
          .filter(
            (p) =>
              p.to !== ESTIMATION_ROUTE &&
              p.to !== VENDRE_AVEC_BR_ROUTE &&
              p.to !== SHOOTING_ROUTE
          )
          .map((p) => (
            <Route key={p.to} path={p.to} element={<PageTemplate title={p.title} />} />
          ))}

        {/* Repli */}
        <Route path="*" element={<PageTemplate title="Page introuvable" />} />
      </Route>
    </Routes>
  );
}

export default App;
