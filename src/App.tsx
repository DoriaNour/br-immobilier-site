import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { PageTemplate } from "@/pages/PageTemplate";
import { allPages } from "@/data/nav";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* Une page gabarit par sous-catégorie / catégorie sans sous-catégorie */}
        {allPages.map((p) => (
          <Route key={p.to} path={p.to} element={<PageTemplate title={p.title} />} />
        ))}

        {/* Repli */}
        <Route path="*" element={<PageTemplate title="Page introuvable" />} />
      </Route>
    </Routes>
  );
}

export default App;
