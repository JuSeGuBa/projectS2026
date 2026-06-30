"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const StarCanvas = dynamic(() => import("@/components/StarCanvas"), {
  ssr: false,
});

// ── Section divider ────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "0.5rem 0 0.2rem",
        opacity: 0.45,
      }}
    >
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(to right, transparent, #c084fc)",
        }}
      />
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "0.62rem",
          color: "#c084fc",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(to left, transparent, #c084fc)",
        }}
      />
    </div>
  );
}

// ── Game button ────────────────────────────────────────────────────────────────
function GameButton({
  onClick,
  icon,
  title,
  desc,
  color,
  badge,
}: {
  onClick: () => void;
  icon: string;
  title: string;
  desc: string;
  color: string;
  badge?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "1.1rem 1.3rem",
        background: hovered ? `rgba(${color},0.12)` : `rgba(${color},0.05)`,
        border: `1px solid rgba(${color},${hovered ? 0.5 : 0.18})`,
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: hovered ? `0 0 24px rgba(${color},0.14)` : "none",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        textAlign: "left",
        position: "relative",
      }}
    >
      <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.95rem",
            color: "#f0e8ff",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.75rem",
            color: `rgba(${color},0.6)`,
            margin: "0.15rem 0 0",
            fontStyle: "italic",
          }}
        >
          {desc}
        </p>
      </div>
      {badge && (
        <span
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            fontFamily: "Georgia, serif",
            fontSize: "0.55rem",
            color: `rgba(${color},0.7)`,
            border: `1px solid rgba(${color},0.3)`,
            borderRadius: "10px",
            padding: "0.1rem 0.45rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </span>
      )}
      <span
        style={{
          marginLeft: "auto",
          color: `rgba(${color},0.35)`,
          fontSize: "0.8rem",
          flexShrink: 0,
        }}
      >
        →
      </span>
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function GamesHub() {
  useEffect(() => {
    const audio = new Audio("/music/QuererQuerernos.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    const playAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", playAudio);
    };

    window.addEventListener("click", playAudio);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", playAudio);
    };
  }, []);
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
        onClick={() => navigate("/")}
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
          padding: "5rem 1.5rem 4rem",
          maxWidth: "520px",
          width: "100%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🎮</div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.8rem,5vw,2.4rem)",
            fontWeight: 300,
            color: "#f0eef8",
            marginBottom: "0.6rem",
            textShadow: "0 0 40px rgba(192,132,252,0.3)",
          }}
        >
          Nuestros juegos
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            textAlign: "left",
          }}
        >
          {/* ── QUIZZES ── */}
          <SectionLabel label="Cuánto nos conocemos" />

          <GameButton
            onClick={() => navigate("/photos/games/quiz")}
            icon="❤️‍🩹"
            title="¿Cuánto me conoces?"
            desc="25 preguntas · 3 niveles de dificultad"
            color="255,107,157"
            badge="fácil · medio · difícil"
          />

          <GameButton
            onClick={() => navigate("/photos/games/quien-dijo")}
            icon="💬"
            title="¿Quién lo dijo primero?"
            desc="30 frases — ¿Reina o TriplePapichulo?"
            color="192,132,252"
          />

          <GameButton
            onClick={() => navigate("/photos/games/recuerdos")}
            icon="🌟"
            title="Test de recuerdos"
            desc="26 preguntas sobre nuestra historia"
            color="255,180,60"
          />

          {/* ── ARCADE ── */}
          <SectionLabel label="Jueguitos arcade" />

          <GameButton
            onClick={() => navigate("/game")}
            icon="♡"
            title="Atrapa corazones"
            desc="Recoge 50 corazones · 5 niveles · jefe final"
            color="255,107,157"
          />

          <GameButton
            onClick={() => navigate("/photos/games/globos")}
            icon="🎈"
            title="Globos de amor"
            desc="Revienta globos con palabras románticas"
            color="251,146,60"
            badge="nuevo"
          />

          <GameButton
            onClick={() => navigate("/photos/games/estrellas")}
            icon="⭐"
            title="Atrapa las estrellas"
            desc="Guía el corazón · esquiva las nubes"
            color="165,243,252"
            badge="nuevo"
          />

          <GameButton
            onClick={() => navigate("/photos/games/shooter")}
            icon="💝"
            title="Love Shooter"
            desc="Dispara corazones · 6 olas · jefe final 👿"
            color="192,132,252"
            badge="nuevo"
          />

          {/* ── NUESTRO FUTURO ── */}
          <SectionLabel label="Nuestro futuro" />

          <GameButton
            onClick={() => navigate("/photos/games/futuro")}
            icon="🌈"
            title="Construir nuestro futuro"
            desc="Elige nuestra boda, casa, viajes, hijos..."
            color="187,247,208"
            badge="nuevo"
          />

          <GameButton
            onClick={() => navigate("/photos/games/hijos")}
            icon="👶"
            title="Test de como seriamos como padres"
            desc="jummm vamos a ver JAJ"
            color="165,243,252"
            badge="nuevo"
          />

          {/* ── HISTORIA ── */}
          <SectionLabel label="Nuestra historia" />

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
