"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const StarCanvas = dynamic(() => import("@/components/StarCanvas"), {
  ssr: false,
});

export default function GamesHub() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const navigate = (path: string) => {
    setLeaving(true);
    setTimeout(() => router.push(path), 500);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 40%, #120820 0%, #070709 60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <StarCanvas />

      <button
        onClick={() => navigate("/photos")}
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "1.5rem",
          zIndex: 10,
          background: "rgba(20,10,35,0.7)",
          border: "1px solid rgba(192,132,252,0.2)",
          borderRadius: "2px",
          color: "rgba(220,200,255,0.55)",
          padding: "0.5rem 1rem",
          fontFamily: "Georgia, serif",
          fontSize: "0.8rem",
          letterSpacing: "0.15em",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
        }}
      >
        ← volver
      </button>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1.2s ease, transform 1.2s ease",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎮</div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
            fontWeight: 300,
            color: "#f0eef8",
            marginBottom: "0.8rem",
            textShadow: "0 0 40px rgba(192,132,252,0.3)",
          }}
        >
          Nuestros juegos
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.9rem",
            color: "rgba(220,200,255,0.5)",
            fontStyle: "italic",
            marginBottom: "3rem",
          }}
        >
          ¿cuánto nos conocemos realmente?
        </p>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <GameButton
            onClick={() => navigate("/photos/games/quiz")}
            icon="❤️‍🩹"
            title="¿Cuánto me conoces?"
            desc="10 preguntas sobre él — ¿las acertarás todas?"
            color="255,107,157"
          />
          <GameButton
            onClick={() => navigate("/photos/games/quien-dijo")}
            icon="💬"
            title="¿Quién dijo esto primero?"
            desc="Adivina quién dijo cada frase"
            color="192,132,252"
          />
          <GameButton
            onClick={() => navigate("/photos/games/recuerdos")}
            icon="🌟"
            title="Test de recuerdos"
            desc="¿Recuerdas nuestros momentos más especiales?"
            color="255,180,60"
          />
          <GameButton
            onClick={() => navigate("/photos/games/timeline-story")}
            icon="✦"
            title="Nuestra línea del tiempo"
            desc="Pasado · Presente · Futuro"
            color="150,200,255"
          />
        </div>
      </div>
    </main>
  );
}

function GameButton({
  onClick,
  icon,
  title,
  desc,
  color,
}: {
  onClick: () => void;
  icon: string;
  title: string;
  desc: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "1.2rem 1.5rem",
        background: hovered ? `rgba(${color},0.12)` : `rgba(${color},0.05)`,
        border: `1px solid rgba(${color},${hovered ? 0.5 : 0.2})`,
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.35s ease",
        boxShadow: hovered ? `0 0 30px rgba(${color},0.15)` : "none",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{icon}</span>
      <div>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1rem",
            color: "#f0e8ff",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.78rem",
            color: `rgba(${color},0.6)`,
            margin: "0.2rem 0 0",
            fontStyle: "italic",
          }}
        >
          {desc}
        </p>
      </div>
      <span
        style={{
          marginLeft: "auto",
          color: `rgba(${color},0.4)`,
          fontSize: "0.8rem",
        }}
      >
        →
      </span>
    </button>
  );
}
