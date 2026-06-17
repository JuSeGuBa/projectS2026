"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretMessage from "./SecretMessage";

interface Question {
  q: string;
  options: string[];
  correct: number;
  specialModal?: boolean;
}

const QUESTIONS: Question[] = [
  {
    q: "¿Cuál es mi comida favorita?",
    options: ["Pizza", "Frijoles", "Perro Caliente", "Hamburguesa"],
    correct: 3,
  },
  {
    q: "¿Cuál es mi color favorito?",
    options: ["Azul", "Negro", "Verde", "Rojo"],
    correct: 0,
  },
  {
    q: "¿Qué es lo que más me gusta hacer en mi tiempo libre?",
    options: ["Dormir", "Ver series", "Jugar videojuegos", "Hacer ejercicio"],
    correct: 2,
  },
  {
    q: "¿Cuál es mi postre favorito?",
    options: ["Helado", "Brownie", "Torta", "Galletas"],
    correct: 0,
  },
  {
    q: "¿Qué mascota quiero tener cuando vivamos juntos?",
    options: ["Gato", "Perro", "Conejo", "Loro"],
    correct: 1,
  },
  {
    q: "¿Qué es lo primero que hago al despertar?",
    options: [
      "Hacer flexiones",
      "Revisar si hay mensajes tuyos",
      "Tomar café",
      "Volver a dormir",
    ],
    correct: 1,
  },
  {
    q: "¿Cuál es mi película favorita?",
    options: [
      "Piratas del Caribe",
      "Interestelar",
      "Avengers End Game",
      "Avengers",
    ],
    correct: 2,
  },
  {
    q: "¿Cuál es mi sueño?",
    options: [
      "Tener una vida contigo",
      "Comprar una moto de los 80",
      "Viajar por el mundo",
      "Comprar una casa",
    ],
    correct: 0,
    specialModal: true,
  },
  {
    q: "¿Cuál es mi mayor miedo?",
    options: [
      "Alturas",
      "Quedarme solo",
      "Que pueda perderte para siempre",
      "Oscuridad",
    ],
    correct: 2,
  },
  {
    q: "¿Qué es lo que más me gusta de ti?",
    options: [
      "Cuando te enojas y caminas rápido",
      "La forma en que me miras",
      "Cuando me celas",
      "Cuando te ríes de mis chistes sin sentido",
      "La forma en que me consientes",
      "Todo lo anterior",
    ],
    correct: 5,
  },
];

const baseStyle = {
  minHeight: "100vh",
  background: "radial-gradient(ellipse at 50% 30%, #0d0415 0%, #040208 70%)",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "1rem",
};

export default function QuizConoces() {
  useEffect(() => {
    const audio = new Audio("/music/Bésame.mp3");
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
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const q = QUESTIONS[current];

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correct;
    if (correct) {
      setScore((s) => s + 1);
      if (q.specialModal) {
        setShowSpecialModal(true);
        return;
      }
    }
    setTimeout(() => next(), 1000);
  };

  const next = () => {
    setSelected(null);
    setShowSpecialModal(false);
    if (current + 1 >= QUESTIONS.length) setShowResult(true);
    else setCurrent((c) => c + 1);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setShowSecret(false);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos/games"), 500);
  };

  if (showSecret)
    return (
      <SecretMessage
        onClose={restart}
        onGoBack={goBack}
        lines={[
          // ✏️ PÁRRAFO 1 — edita aquí el mensaje del quiz de conocerme
          "Oye, señorita, ¿tú por qué me conoces tanto, ah? Jajaj, te amo mucho. Eres lo mejor que me ha pasado en la vida, mi amor. No solo me conoces, sino que eres mi complemento, jeje.",
          // ✏️ PÁRRAFO 2 — edita aquí
          "Y lo mejor es que todavía nos falta descubrir más cosas del otro. Si te preguntas si te conozco, creo que sí, jajaja, eso espero, y es muy probable que sí. ¿Cómo no voy a conocer a la mujer que amo?",
          // ✏️ LÍNEA FINAL ROSA — edita aquí
          "Gracias por todo, por siempre prestarme atención, jaja, y quererme. Te amo demasiado ❤️‍🩹",
        ]}
      />
    );

  return (
    <div
      style={{
        ...baseStyle,
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <button
        onClick={goBack}
        style={{
          position: "fixed",
          top: "1.2rem",
          left: "1.2rem",
          zIndex: 20,
          background: "rgba(20,10,35,0.7)",
          border: "1px solid rgba(192,132,252,0.2)",
          borderRadius: "2px",
          color: "rgba(220,200,255,0.55)",
          padding: "0.45rem 0.9rem",
          fontFamily: "Georgia, serif",
          fontSize: "0.8rem",
          letterSpacing: "0.15em",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
        }}
      >
        ← volver
      </button>

      {/* Special modal for Q8 */}
      {showSpecialModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(4,2,8,0.93)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.99), rgba(10,4,22,0.99))",
              border: "1px solid rgba(255,107,157,0.25)",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 0 60px rgba(255,107,157,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❤️‍🩹</div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: 300,
                color: "#f8d4ef",
                marginBottom: "1rem",
              }}
            >
              Eso mi amorrrrrrrrrrrrrrrr!
            </h2>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
                marginBottom: "1rem",
              }}
            />
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                color: "rgba(220,200,255,0.82)",
                lineHeight: 1.75,
                fontStyle: "italic",
                marginBottom: "1.5rem",
              }}
            >
              Esa es la correcta mi todo… pero todas las demás respuestas de
              esta pregunta también lo son, siempre que las cumpla a tu lado.
            </p>
            <button
              onClick={next}
              style={{
                width: "100%",
                padding: "0.8rem",
                background:
                  "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
                border: "1px solid rgba(255,107,157,0.35)",
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              continuar ♡
            </button>
          </div>
        </div>
      )}

      {/* Result screen */}
      {showResult && !showSecret && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(30,5,40,0.97), rgba(4,2,8,0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1.5rem",
              filter: "drop-shadow(0 0 20px rgba(255,107,157,0.7))",
            }}
          >
            {score >= 8 ? "👑" : score >= 5 ? "❤️‍🩹" : "💜"}
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.6rem",
            }}
          >
            {score >= 8
              ? "Y tu porque me conoces tanto, a? jajaja te amo mucho"
              : score >= 5
                ? "¡Upaaaa bien amor!"
                : "Casiiiiii te faltaron pocas jajjajajaj"}
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              color: "rgba(200,180,255,0.6)",
              fontStyle: "italic",
              marginBottom: "2rem",
            }}
          >
            Acertaste {score} de {QUESTIONS.length} preguntas
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.8rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => setShowSecret(true)}
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
              ver mensaje secreto ✦
            </button>
            <button
              onClick={restart}
              style={{
                padding: "0.8rem 1.5rem",
                background: "transparent",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "3px",
                color: "rgba(200,170,255,0.5)",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              intentar de nuevo
            </button>
          </div>
        </div>
      )}

      {/* Quiz */}
      {!showResult && (
        <div
          style={{ width: "100%", maxWidth: "480px", padding: "5rem 0 2rem" }}
        >
          {/* Progress */}
          <div style={{ marginBottom: "2rem", padding: "0 0.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(200,180,255,0.4)",
                }}
              >
                pregunta {current + 1} de {QUESTIONS.length}
              </span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,107,157,0.5)",
                }}
              >
                {score} correctas
              </span>
            </div>
            <div
              style={{
                height: "3px",
                background: "rgba(255,107,157,0.1)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "2px",
                  width: `${(current / QUESTIONS.length) * 100}%`,
                  background: "linear-gradient(to right, #ff6b9d, #c084fc)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.92), rgba(12,5,25,0.92))",
              border: "1px solid rgba(255,107,157,0.15)",
              borderRadius: "8px",
              padding: "1.8rem",
              marginBottom: "1.2rem",
              boxShadow: "0 0 30px rgba(192,84,252,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                color: "#f0e8ff",
                lineHeight: 1.6,
                margin: 0,
                textAlign: "center",
              }}
            >
              {q.q}
            </p>
          </div>

          {/* Options */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
          >
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct;
              const revealed = selected !== null;
              let bg = "rgba(20,8,40,0.6)";
              let border = "rgba(255,107,157,0.12)";
              let color = "rgba(220,200,255,0.75)";
              if (revealed && isCorrect) {
                bg = "rgba(100,220,130,0.12)";
                border = "rgba(100,220,130,0.5)";
                color = "#a0ffc0";
              } else if (revealed && isSelected && !isCorrect) {
                bg = "rgba(255,80,80,0.1)";
                border = "rgba(255,80,80,0.4)";
                color = "rgba(255,160,160,0.8)";
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={selected !== null}
                  style={{
                    padding: "0.85rem 1.2rem",
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: "6px",
                    cursor: selected !== null ? "default" : "pointer",
                    color,
                    fontFamily: "Georgia, serif",
                    fontSize: "0.9rem",
                    textAlign: "left",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      border: `1px solid ${revealed && isCorrect ? "rgba(100,220,130,0.5)" : "rgba(255,107,157,0.2)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: "rgba(255,107,157,0.4)",
                    }}
                  >
                    {revealed && isCorrect
                      ? "✓"
                      : revealed && isSelected
                        ? "✗"
                        : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
