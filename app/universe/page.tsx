"use client";
import dynamic from "next/dynamic";

const UniverseScene = dynamic(() => import("@/components/UniverseScene"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 40%, #0d0415 0%, #070709 70%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(220,200,255,0.4)",
      fontFamily: "Georgia, serif",
      fontSize: "0.9rem",
      letterSpacing: "0.2em",
    }}>
      cargando el universo…
    </div>
  ),
});

export default function UniversePage() {
  return <UniverseScene />;
}
