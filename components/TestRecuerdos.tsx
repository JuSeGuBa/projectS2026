"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretMessage from "./SecretMessage";

interface Question {
  q: string;
  answer: string;
  acceptedAnswers: string[];
  hint?: string; // pista opcional visible si falla
}

// ✏️ AGREGA O EDITA PREGUNTAS AQUÍ
// Cada pregunta tiene:
//   q             → la pregunta que se muestra
//   answer        → la respuesta correcta que se muestra si falla
//   acceptedAnswers → palabras/frases que se aceptan como correctas (en minúsculas sin tildes)
//   hint          → pista opcional (aparece debajo de la pregunta)
const QUESTIONS: Question[] = [
  // ── BLOQUE 1: LOS INICIOS ──
  {
    q: "¿A qué edad fue nuestro primer beso?",
    answer: "6 años (él) y 7 (ella)",
    acceptedAnswers: [
      "6",
      "7",
      "seis",
      "siete",
      "6 años",
      "7 años",
      "el 7 yo 6",
      "seis y siete",
    ],
  },
  {
    q: "¿Desde qué edad nos conocemos?",
    answer: "Desde los 6 años",
    acceptedAnswers: [
      "6",
      "seis",
      "7",
      "siete",
      "6 años",
      "7 años",
      "el 6 y yo 7",
    ],
  },
  {
    q: "¿Dónde fue nuestro primer beso?",
    answer: "En el cuarto de Sebas",
    acceptedAnswers: [
      "cuarto",
      "habitacion",
      "cuarto de sebas",
      "mi cuarto",
      "el cuarto de el",
    ],
  },
  {
    q: "¿Quién escribió el primer mensaje cuando retomamos el contacto?",
    answer: "Él — Sebas",
    acceptedAnswers: ["sebas", "el", "él", "sebastian", "mi amor"],
  },
  {
    q: "¿Cuándo nos hicimos novios?",
    answer: "Finales de octubre de 2024",
    acceptedAnswers: [
      "octubre",
      "2024",
      "octubre 2024",
      "finales de octubre",
      "noviembre",
      "11 de noviembre",
    ],
  },
  {
    q: "¿Cuál fue el primer regalo que él te dio?",
    answer: "Un anillo y gomitas",
    acceptedAnswers: [
      "anillo",
      "el anillo",
      "un anillo",
      "gomitas",
      "anillo y gomitas",
    ],
  },
  {
    q: "¿Dónde fue nuestro primer encuentro en persona después de la distancia?",
    answer: "En la casa de ella (Bosa)",
    acceptedAnswers: [
      "mi casa",
      "casa de bosa",
      "bosa",
      "casa de sofi",
      "sofi",
      "casa",
      "en frente de mi casa",
    ],
  },
  {
    q: "¿Dónde fue nuestra primera foto juntos (en la distancia)?",
    answer: "En la fiesta de grado",
    acceptedAnswers: [
      "grado",
      "fiesta grado",
      "fiesta de grado",
      "graduacion",
      "mi fiesta",
    ],
  },

  // ── BLOQUE 2: CANCIONES Y DETALLES ──
  {
    q: "¿Qué canciones nos recuerdan a nosotros? (nombra al menos una)",
    answer:
      "Us – James Bay / Cosas que no te dije – Saiko / Querer querernos – Canserbero",
    acceptedAnswers: [
      "us",
      "james bay",
      "saiko",
      "cosas que no te dije",
      "canserbero",
      "querer querernos",
    ],
  },
  {
    q: "¿Cual fue nuestra primera cancion?",
    answer: "Cosas que no te dije — Saiko",
    acceptedAnswers: [
      "saiko",
      "cosas que no te dije",
      "cosas",
      "saiko cosasquenotedije",
    ],
  },
  {
    q: "¿Cómo se llama la canción del álbum de fotos?",
    answer: "Us — James Bay",
    acceptedAnswers: ["us", "james bay", "us james bay"],
  },
  {
    q: "¿Cómo se llaman nuestros hijos soñados?",
    answer: "Iker Noah, Reichel Antonella",
    acceptedAnswers: [
      "iker",
      "iker noah",
      "antonella",
      "anto",
      "reichel",
      "iker antonella reichel",
    ],
  },
  {
    q: "¿Cómo se llama la niña que mencionamos en el universo de estrellas?",
    answer: "Reichel Antonella",
    acceptedAnswers: ["Anto", "Reichel", "Reichel Antonella"],
  },

  // ── BLOQUE 3: NUESTRA HISTORIA ──
  {
    q: "¿En que lugar queremos vivir cuando nos casemos?",
    answer: "Pereira",
    acceptedAnswers: ["pereira", "risaralda"],
  },
  {
    q: "¿En qué mes y año tomamos la decisión de pausar la relación?",
    answer: "Mayo de 2026",
    acceptedAnswers: ["mayo", "2026", "mayo 2026", "Mayo de 2026"],
  },
  {
    q: "¿Cuánto tiempo estuvimos a distancia antes de estar juntos en persona?",
    answer: "Más de un año",
    acceptedAnswers: [
      "un año",
      "mas de un año",
      "1 año",
      "un ano",
      "más de un año",
      "año y pico",
    ],
  },
  {
    q: "¿Qué pasó el 11 de noviembre de 2024?",
    answer: "LNos hicimos novios",
    acceptedAnswers: [
      "novios",
      "nos hicimos novios",
      "empezamos la relacion",
      "empezamos",
    ],
  },
  {
    q: "¿En qué mes se bautizo tu hombre jaja",
    answer: "Junio",
    acceptedAnswers: ["Junio"],
  },

  // ── BLOQUE 4: PREGUNTAS DIFÍCILES ──
  {
    q: "¿Cuántas estrellas tiene aproximadamente el universo que yo te hice?",
    answer: "100 estrellas",
    acceptedAnswers: ["100", "cien", "mas de 100", "100 estrellas"],
  },
  {
    q: "¿Cuántas páginas tiene el álbum de fotos que él armó?",
    answer: "38 páginas",
    acceptedAnswers: ["38", "treinta y ocho", "38 paginas"],
  },
  {
    q: "¿Qué usamos para imaginar cómo serían sus fotos juntos cuando estaban a distancia?",
    answer: "Inteligencia artificial (IA)",
    acceptedAnswers: ["ia", "inteligencia artificial", "ai", "una ia", "la ia"],
  },
  {
    q: "¿Cómo se llama el apodo de él en el juego de frases?",
    answer: "TriplePapichulo",
    acceptedAnswers: [
      "triplepapichulo",
      "triple papichulo",
      "papichulo",
      "triple",
    ],
  },
  {
    q: "¿Qué tipo de casa/lugar sueñan tener juntos?",
    answer: "Una hacienda con espacio para vivir y crecer",
    acceptedAnswers: ["hacienda", "finca", "casa grande", "espacio", "campo"],
  },
  {
    q: "¿Quien hablo primero con sus padres sobre de nosotros",
    answer: "Sebas",
    acceptedAnswers: ["El", "Sebas", "Mi novio", "Mi hombre", "el"],
    hint: "Está en una de las estrellas del universo ✦",
  },
  {
    q: "¿Qué edad tenías tu con la chaqueta rosada que él menciona en una estrella?",
    answer: "6 años",
    acceptedAnswers: ["6", "seis", "6 años"],
    hint: "Tu siempre andabas con esa chaqueta jaja hasta cuando nos dimos nuestro primer beso la tenias jaja",
  },
  {
    q: "Cual era la app que teniamos en la distancia",
    answer: "Life360",
    acceptedAnswers: ["Life360", "Life share", "LifeShare", "Life"],
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

// Barajar para que no siempre salgan en el mismo orden
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TestRecuerdos() {
  const router = useRouter();

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

  const [questions] = useState<Question[]>(() => shuffle(QUESTIONS));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const q = questions[current];

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
    if (current + 1 >= questions.length) setShowResult(true);
    else setCurrent((c) => c + 1);
  };

  const restart = () => {
    window.location.reload();
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
          "Qué bueno que recordaste cada uno. Yo los guardo en mi corazón y jamás los olvidaré. Cada fecha, cada lugar, cada detalle que guardamos es un pedazo de la vida que formaremos o estamos formando, jeje.",
          "Nuestra historia no cabe en ningún test o juego. Creo que en ningún lugar cabe, sino en nuestros corazones y memorias, donde permanecerá para siempre, mi amor.",
          "Gracias por esta historia tan hermosa. Tengo fe en que seguiremos creando más, y estoy emocionado por todo lo que viene. Te amo 3 millones ❤️‍🩹",
        ]}
      />
    );

  const pct = score / questions.length;

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

      {/* ── RESULTADO ── */}
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
            {pct >= 0.9 ? "🌟" : pct >= 0.6 ? "❤️‍🩹" : "💜"}
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
            {pct >= 0.9
              ? "¡Esoooo yupiiiiiii jajajajajja te amooooo! 🌟"
              : pct >= 0.6
                ? "¡Recuerdas bastante, casi perfecta!"
                : "Jaja, ¡hay que recordar más! Pero te amo igual 💜"}
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
            {score} de {questions.length} respuestas correctas
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

      {/* ── JUEGO ── */}
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
                {current + 1} de {questions.length}
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
                  width: `${(current / questions.length) * 100}%`,
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
                margin: 0,
              }}
            >
              {q.q}
            </p>
            {q.hint && (
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,180,60,0.35)",
                  fontStyle: "italic",
                  margin: "0.8rem 0 0",
                }}
              >
                💡 {q.hint}
              </p>
            )}
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
              {current + 1 >= questions.length
                ? "ver resultado ✦"
                : "siguiente →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
