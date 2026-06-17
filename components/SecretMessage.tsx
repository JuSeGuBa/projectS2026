"use client";

import { useState, useEffect } from "react";

interface SecretMessageProps {
  onClose: () => void;
  onGoBack: () => void;
  // Cada juego pasa su propio mensaje. Si no se pasa, usa el mensaje por defecto.
  lines?: [string, string, string]; // [párrafo 1, párrafo 2, línea final en rosa]
}

export default function SecretMessage({
  onClose,
  onGoBack,
  lines,
}: SecretMessageProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase(1), 100);
    setTimeout(() => setPhase(2), 900);
    setTimeout(() => setPhase(3), 1800);
  }, []);

  // Mensaje por defecto (si no se pasa lines)
  const [p1, p2, p3] = lines ?? [
    "Si llegaste hasta aquí, significa que conoces gran parte de nuestra historia. Pero hay algo que ninguna pregunta puede medir: lo mucho que te amo.",
    "Gracias por cada conversación, cada sonrisa, cada momento que hemos compartido, cada recuerdo. Sé que seguiremos formando más.",
    "Mi lugar favorito siempre serás tú. Te Amo Demasiado Mi Vida Hermosa. ❤️‍🩹",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(30,5,40,0.98), rgba(4,2,8,0.99))",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(192,84,252,0.08) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "relative", maxWidth: "420px", width: "100%" }}>
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1.5rem",
            filter: "drop-shadow(0 0 20px rgba(255,107,157,0.8))",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(0.5)",
            transition: "all 0.6s ease",
          }}
        >
          ❤️‍🩹
        </div>

        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
            color: "rgba(255,107,157,0.4)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            opacity: phase >= 1 ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >
          ✦ mensaje secreto ✦
        </p>

        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
            marginBottom: "1.8rem",
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />

        {/* ── PÁRRAFO 1 ── edita desde el juego correspondiente */}
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
            color: "rgba(220,200,255,0.88)",
            lineHeight: 1.85,
            fontStyle: "italic",
            marginBottom: "2rem",
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s ease 0.1s",
          }}
        >
          {p1}
        </p>

        {/* ── PÁRRAFO 2 ── edita desde el juego correspondiente */}
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
            color: "rgba(220,200,255,0.88)",
            lineHeight: 1.85,
            fontStyle: "italic",
            marginBottom: "2rem",
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s ease",
          }}
        >
          {p2}
        </p>

        {/* ── LÍNEA FINAL EN ROSA ── edita desde el juego correspondiente */}
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
            color: "#ff9ec0",
            fontStyle: "italic",
            textShadow: "0 0 30px rgba(255,107,157,0.4)",
            marginBottom: "2.5rem",
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 0.8s ease 0.3s",
          }}
        >
          {p3}
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.8rem 1.5rem",
              background:
                "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
              border: "1px solid rgba(255,107,157,0.35)",
              borderRadius: "3px",
              color: "#f8d4ef",
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            jugar de nuevo ♡
          </button>
          <button
            onClick={onGoBack}
            style={{
              padding: "0.8rem 1.5rem",
              background: "transparent",
              border: "1px solid rgba(192,132,252,0.2)",
              borderRadius: "3px",
              color: "rgba(200,170,255,0.5)",
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            volver
          </button>
        </div>
      </div>
    </div>
  );
}
