"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const StarCanvas = dynamic(() => import("@/components/StarCanvas"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
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
        transition: "opacity 0.5s ease",
        opacity: leaving ? 0 : 1,
      }}
    >
      <StarCanvas />
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192,84,252,0.06) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "2rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1.2s ease, transform 1.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "2.5rem",
            opacity: 0.5,
          }}
        >
          <div
            style={{
              height: "1px",
              width: "60px",
              background: "linear-gradient(to right, transparent, #ff6b9d)",
            }}
          />
          <span style={{ fontSize: "18px" }}>✦</span>
          <div
            style={{
              height: "1px",
              width: "60px",
              background: "linear-gradient(to left, transparent, #ff6b9d)",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(2rem, 6vw, 3.6rem)",
            fontWeight: "300",
            color: "#f0eef8",
            letterSpacing: "0.02em",
            lineHeight: 1.3,
            marginBottom: "1.2rem",
            textShadow: "0 0 40px rgba(192, 132, 252, 0.3)",
          }}
        >
          Este espacio es solo nuestro…
        </h1>

        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            color: "rgba(220, 200, 255, 0.65)",
            fontStyle: "italic",
            marginBottom: "3.5rem",
            letterSpacing: "0.06em",
          }}
        >
          Elige cómo quieres sentirte hoy
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            alignItems: "center",
          }}
        >
          <NavButton
            onClick={() => navigate("/universe")}
            icon="✦"
            label="Explorar nuestro universo"
            variant="pink"
          />
          <NavButton
            onClick={() => navigate("/game")}
            icon="♡"
            label="Si estás estresada, juega"
            variant="purple"
          />
          <NavButton
            onClick={() => navigate("/photos")}
            icon="✿"
            label="Nuestras fotos"
            variant="rose"
          />
          <NavButton
            onClick={() => navigate("/photos/games")}
            icon="🎮"
            label="Miraaaa aqui hay mas jueguitosssss"
            variant="gold"
          />
        </div>

        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: 0.3,
          }}
        >
          <div
            style={{ height: "1px", width: "40px", background: "#c084fc" }}
          />
          <span
            style={{
              fontSize: "10px",
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

function NavButton({
  onClick,
  icon,
  label,
  variant,
}: {
  onClick: () => void;
  icon: string;
  label: string;
  variant: "pink" | "purple" | "rose" | "gold";
}) {
  const [hovered, setHovered] = useState(false);

  const colors = {
    pink: {
      bg: "rgba(255,107,157,",
      border: "255,107,157",
      text: "#ff9ec0",
      textBase: "rgba(255,180,200,0.85)",
    },
    purple: {
      bg: "rgba(192,132,252,",
      border: "192,132,252",
      text: "#d8b4fe",
      textBase: "rgba(200,170,250,0.75)",
    },
    rose: {
      bg: "rgba(255,130,160,",
      border: "255,130,160",
      text: "#ffb3c6",
      textBase: "rgba(255,160,190,0.8)",
    },
    gold: {
      bg: "rgba(200,160,60,",
      border: "200,160,60",
      text: "#e8c860",
      textBase: "rgba(200,170,80,0.75)",
    },
  };
  const c = colors[variant];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "min(320px, 88vw)",
        padding: "1rem 2rem",
        background: hovered ? `${c.bg}0.18)` : `${c.bg}0.08)`,
        border: `1px solid rgba(${c.border},${hovered ? 0.7 : 0.3})`,
        borderRadius: "2px",
        color: hovered ? c.text : c.textBase,
        fontFamily: "'Georgia', serif",
        fontSize: "0.95rem",
        letterSpacing: "0.1em",
        cursor: "pointer",
        transition: "all 0.35s ease",
        boxShadow: hovered ? `0 0 24px rgba(${c.border},0.25)` : "none",
        transform: hovered ? "scale(1.03)" : "scale(1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <span style={{ fontSize: "14px", opacity: 0.8 }}>{icon}</span>
      {label}
    </button>
  );
}
