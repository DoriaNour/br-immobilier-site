import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Remonte en haut de page à chaque changement de route (compatible Lenis). */
function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  React.useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, lenis]);
  return null;
}

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
