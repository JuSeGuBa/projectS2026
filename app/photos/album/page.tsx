"use client";

import dynamic from "next/dynamic";

const AlbumScene = dynamic(() => import("@/components/Albumscene"), {
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
      abriendo el álbum…
    </div>
  ),
});

export default function AlbumPage() {
  return <AlbumScene />;
}
