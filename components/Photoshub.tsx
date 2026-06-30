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
        margin: "0.4rem 0 0.1rem",
        opacity: 0.4,
      }}
    >
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(to right, transparent, #ff6b9d)",
        }}
      />
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "0.6rem",
          color: "#ff9ec0",
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
          background: "linear-gradient(to left, transparent, #ff6b9d)",
        }}
      />
    </div>
  );
}

// ── Photo button ───────────────────────────────────────────────────────────────
function PhotoButton({
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
        transition: "all 0.32s ease",
        boxShadow: hovered ? `0 0 26px rgba(${color},0.14)` : "none",
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
export default function PhotosHub() {
  useEffect(() => {
    const audio = new Audio("/music/YouFoundMe.mp3");
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
          transition: "opacity 1.2s ease, transform 1.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "2rem",
            opacity: 0.5,
          }}
        >
          <div
            style={{
              height: "1px",
              width: "50px",
              background: "linear-gradient(to right, transparent, #ff6b9d)",
            }}
          />
          <span style={{ fontSize: "16px" }}>✿</span>
          <div
            style={{
              height: "1px",
              width: "50px",
              background: "linear-gradient(to left, transparent, #ff6b9d)",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.8rem,5vw,2.8rem)",
            fontWeight: 300,
            color: "#f0eef8",
            letterSpacing: "0.04em",
            marginBottom: "0.8rem",
            textShadow: "0 0 40px rgba(192,132,252,0.3)",
          }}
        >
          Nuestro espacio
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.92rem",
            color: "rgba(220,200,255,0.5)",
            fontStyle: "italic",
            marginBottom: "2.5rem",
            letterSpacing: "0.06em",
          }}
        >
          cada rincón guarda algo nuestro
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            textAlign: "left",
          }}
        >
          {/* ── MEMORIAS ── */}
          <SectionLabel label="Memorias" />

          <PhotoButton
            onClick={() => navigate("/photos/album")}
            icon="📖"
            title="Nuestro álbum"
            desc="Hojea las páginas de lo que somos"
            color="255,150,180"
          />

          <PhotoButton
            onClick={() => navigate("/photos/puzzle")}
            icon="🧩"
            title="Arma el puzzle"
            desc="Reconstruye nuestros momentos pieza a pieza"
            color="255,107,157"
          />

          <PhotoButton
            onClick={() => navigate("/photos/timeline")}
            icon="✦"
            title="Nuestra historia"
            desc="La arena del tiempo — Pasado · Presente · Futuro"
            color="192,132,252"
          />

          {/* ── NUESTRO FUTURO ── */}
          <SectionLabel label="Nuestro futuro" />

          <PhotoButton
            onClick={() => navigate("/photos/future")}
            icon="🌟"
            title="Nuestro futuro"
            desc="Todo lo que vamos a vivir, construir y ser juntos"
            color="187,247,208"
            badge="nuevo"
          />

          <PhotoButton
            onClick={() => navigate("/photos/boda")}
            icon="💍"
            title="Boda soñada"
            desc="Planifica cada detalle de ese día especial"
            color="248,212,239"
            badge="nuevo"
          />

          <PhotoButton
            onClick={() => navigate("/photos/games/hijos")}
            icon="👶"
            title="Nuestros hijos"
            desc="Circustancias de Iker y Anto"
            color="165,243,252"
            badge="nuevo"
          />

          {/* ── JUEGOS ── */}
          <SectionLabel label="Juegos" />

          <PhotoButton
            onClick={() => navigate("/photos/games")}
            icon="🎮"
            title="Todos los juegos"
            desc="Quizzes, arcade, aventuras y más"
            color="200,160,60"
          />
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: 0.25,
          }}
        >
          <div
            style={{ height: "1px", width: "40px", background: "#c084fc" }}
          />
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "#c084fc",
              textTransform: "uppercase",
            }}
          >
            para ti
          </span>
          <div
            style={{ height: "1px", width: "40px", background: "#c084fc" }}
          />
        </div>
      </div>
    </main>
  );
}
