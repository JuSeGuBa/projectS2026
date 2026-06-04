"use client";
import dynamic from "next/dynamic";

const HeartGame = dynamic(() => import("@/components/HeartGame"), {
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
      preparate para jugar 🌚
    </div>
  ),
});

export default function GamePage() {
  return <HeartGame />;
}
