"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretMessage from "./SecretMessage";

interface Question {
  q: string;
  answer: string;
  acceptedAnswers: string[];
}

const QUESTIONS: Question[] = [
  {
    q: "¿A que edad fue nuestro primer beso?",
    answer: "6 años",
    acceptedAnswers: [
      "6 años",
      "7 años",
      "6",
      "7",
      "El 7 yo 6",
      "seis y siete",
      "seis",
      "siete",
    ],
  },
  {
    q: "¿Dónde fue nuestro primer encuentro cuando estábamos a distancia?",
    answer: "En mi casa",
    acceptedAnswers: [
      "mi casa",
      "casa de bosa",
      "bosa",
      "casa de Sofi",
      "en frente de mi casa",
      "sofi",
      "casa",
    ],
  },
  {
    q: "¿Quién escribió el primer mensaje?",
    answer: "Él — Sebas",
    acceptedAnswers: ["sebas", "el", "él", "sebastian", "mi amor"],
  },
  {
    q: "¿En donde fue nuestra primera foto juntos, en la distancia?",
    answer: "En la fiesta de grado",
    acceptedAnswers: [
      "grado",
      "fiesta grado",
      "fiesta de grado",
      "graduacion",
      "mi fiesta",
      "mi casa",
    ],
  },
  {
    q: "¿Desde qué edad nos conocemos?",
    answer: "6 años",
    acceptedAnswers: [
      "6",
      "seis",
      "7",
      "siete",
      "6 años",
      "7 años",
      "El 6 y yo 7",
    ],
  },
  {
    q: "¿Cuál fue el primer regalo que yo te di a ti?",
    answer: "Un anillo",
    acceptedAnswers: [
      "anillo",
      "el anillo",
      "un anillo",
      "gomitas",
      "anillo y gomitas",
    ],
  },
  {
    q: "¿Dónde fue nuestro primer beso?",
    answer: "En el cuarto de Sebas",
    acceptedAnswers: [
      "mi cuarto",
      "el cuarto de el",
      "el cuarto de Sebas",
      "a los 6 años en el cuarto de el",
      "a en el cuarto de el a los 6 años",
      "cuarto",
      "habitacion",
    ],
  },
  {
    q: "¿Qué canción nos recuerda a nosotros?",
    answer:
      "US de James Bay / Cosas que no te dije de Saiko / Querer querernos de Canserbero",
    acceptedAnswers: [
      "us",
      "james bay",
      "saiko",
      "cosas que no te dije",
      "canserbero",
      "querer querernos",
    ],
  },
];

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function checkAnswer(input: string, accepted: string[]) {
  const n = normalize(input);
  return accepted.some((a) => n.includes(normalize(a)));
}

export default function TestRecuerdos() {
  useEffect(() => {
    const audio = new Audio("/music/ElectricLove.mp3");
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
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const q = QUESTIONS[current];

  const submit = () => {
    if (!input.trim() || submitted) return;
    const correct = checkAnswer(input, q.acceptedAnswers);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setSubmitted(true);
  };

  const next = () => {
    setInput("");
    setSubmitted(false);
    setIsCorrect(false);
    if (current + 1 >= QUESTIONS.length) setShowResult(true);
    else setCurrent((c) => c + 1);
  };

  const restart = () => {
    setCurrent(0);
    setInput("");
    setSubmitted(false);
    setIsCorrect(false);
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
          // ✏️ PÁRRAFO 1 — edita aquí el mensaje del juego de recuerdos
          "Qué bueno que recordaste cada uno. Yo los guardo en mi corazón y jamás los olvidaré. Cada fecha, cada lugar, cada detalle que guardamos es un pedazo de la vida que formaremos o estamos formando, jeje.",
          // ✏️ PÁRRAFO 2 — edita aquí
          "Nuestra historia no cabe en ningún test o juego. Creo que en ningún lugar cabe, sino en nuestros corazones y memorias, donde permanecerá para siempre, mi amor.",
          // ✏️ LÍNEA FINAL ROSA — edita aquí
          "Gracias por esta historia tan hermosa. Tengo fe en que seguiremos creando más, y estoy emocionado por todo lo que viene. Te amo 3 millones ❤️‍🩹",
        ]}
      />
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 30%, #0d0415 0%, #040208 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
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

      {/* Result */}
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
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
            {score >= 7 ? "🌟" : score >= 4 ? "❤️‍🩹" : "💜"}
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
            {score >= 7
              ? "¡Esoooo yupiiiiiiiii jajajajajja te amooooo!"
              : score >= 4
                ? "¡Recuerdas bastante!"
                : "Jaja, ¡hay que recordar más!"}
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
            {score} de {QUESTIONS.length} respuestas correctas
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
                  "linear-gradient(135deg, rgba(255,180,60,0.15), rgba(255,107,157,0.1))",
                border: "1px solid rgba(255,180,60,0.35)",
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

      {/* Game */}
      {!showResult && (
        <div
          style={{ width: "100%", maxWidth: "480px", padding: "5rem 0 2rem" }}
        >
          {/* Progress */}
          <div style={{ marginBottom: "2rem" }}>
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
                {current + 1} de {QUESTIONS.length}
              </span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,180,60,0.5)",
                }}
              >
                {score} correctas
              </span>
            </div>
            <div
              style={{
                height: "3px",
                background: "rgba(255,180,60,0.1)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(current / QUESTIONS.length) * 100}%`,
                  background: "linear-gradient(to right, #ffb43c, #ff6b9d)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Question card */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.92), rgba(12,5,25,0.92))",
              border: "1px solid rgba(255,180,60,0.15)",
              borderRadius: "8px",
              padding: "1.8rem",
              marginBottom: "1.2rem",
              boxShadow: "0 0 30px rgba(255,180,60,0.04)",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.7rem",
                color: "rgba(255,180,60,0.4)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "0.8rem",
              }}
            >
              test de recuerdos 🌟
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1rem, 3vw, 1.15rem)",
                color: "#f0e8ff",
                lineHeight: 1.6,
                margin: "0 0 0.8rem",
              }}
            >
              {q.q}
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.78rem",
                color: "rgba(200,180,255,0.35)",
                fontStyle: "italic",
                margin: 0,
              }}
            ></p>
          </div>

          {/* Input */}
          <div style={{ position: "relative", marginBottom: "0.8rem" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !submitted && submit()}
              disabled={submitted}
              placeholder="Escribe tu respuesta aquí..."
              style={{
                width: "100%",
                padding: "0.9rem 1.2rem",
                background: submitted
                  ? isCorrect
                    ? "rgba(100,220,130,0.08)"
                    : "rgba(255,80,80,0.06)"
                  : "rgba(20,8,40,0.7)",
                border: `1px solid ${
                  submitted
                    ? isCorrect
                      ? "rgba(100,220,130,0.4)"
                      : "rgba(255,80,80,0.3)"
                    : "rgba(255,180,60,0.2)"
                }`,
                borderRadius: "6px",
                color: "#f0e8ff",
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.25s ease",
              }}
            />
          </div>

          {/* Feedback */}
          {submitted && (
            <div
              style={{
                background: isCorrect
                  ? "rgba(100,220,130,0.08)"
                  : "rgba(255,80,80,0.06)",
                border: `1px solid ${isCorrect ? "rgba(100,220,130,0.3)" : "rgba(255,80,80,0.25)"}`,
                borderRadius: "6px",
                padding: "1rem 1.2rem",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.88rem",
                  color: isCorrect ? "#a0ffc0" : "rgba(255,160,160,0.8)",
                  margin: "0 0 0.4rem",
                  fontWeight: 400,
                }}
              >
                {isCorrect ? "✓ ¡Correcto!" : "✗ No exactamente..."}
              </p>
              {!isCorrect && (
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.82rem",
                    color: "rgba(200,180,255,0.6)",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  La respuesta era:{" "}
                  <span style={{ color: "#f0e8ff" }}>{q.answer}</span>
                </p>
              )}
            </div>
          )}

          {!submitted ? (
            <button
              onClick={submit}
              disabled={!input.trim()}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: input.trim()
                  ? "linear-gradient(135deg, rgba(255,180,60,0.15), rgba(255,107,157,0.1))"
                  : "rgba(255,180,60,0.04)",
                border: `1px solid rgba(255,180,60,${input.trim() ? 0.4 : 0.1})`,
                borderRadius: "6px",
                color: input.trim() ? "#f8d4ef" : "rgba(200,180,255,0.25)",
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                cursor: input.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              responder
            </button>
          ) : (
            <button
              onClick={next}
              style={{
                width: "100%",
                padding: "0.9rem",
                background:
                  "linear-gradient(135deg, rgba(255,180,60,0.15), rgba(255,107,157,0.1))",
                border: "1px solid rgba(255,180,60,0.4)",
                borderRadius: "6px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              {current + 1 >= QUESTIONS.length
                ? "ver resultado ✦"
                : "siguiente →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
