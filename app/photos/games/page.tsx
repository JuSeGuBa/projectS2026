"use client";
import dynamic from "next/dynamic";

const GamesHub = dynamic(() => import("@/components/GamesHub"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        background: "#070709",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(220,200,255,0.4)",
        fontFamily: "Georgia, serif",
        fontSize: "0.9rem",
        letterSpacing: "0.2em",
      }}
    >
      cargando juegos…
    </div>
  ),
});

export default function GamesPage() {
  return <GamesHub />;
}
