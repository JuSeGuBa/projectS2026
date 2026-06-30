"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretMessage from "./SecretMessage";

interface Question {
  q: string;
  options: string[];
  correct: number;
  specialModal?: boolean;
  difficulty: "facil" | "medio" | "dificil";
}

const ALL_QUESTIONS: Question[] = [
  // ── FÁCIL ──
  {
    difficulty: "facil",
    q: "¿Cuál es mi color favorito?",
    options: ["Azul", "Negro", "Verde", "Rojo"],
    correct: 0,
  },
  {
    difficulty: "facil",
    q: "¿Qué mascota quiero tener cuando vivamos juntos?",
    options: ["Gato", "Perro", "Conejo", "Loro"],
    correct: 1,
  },
  {
    difficulty: "facil",
    q: "¿Cuál es mi película favorita?",
    options: [
      "Piratas del Caribe",
      "Interestelar",
      "Avengers End Game",
      "Liga de la Justicia",
    ],
    correct: 2,
  },
  {
    difficulty: "facil",
    q: "¿Cuál es mi comida favorita?",
    options: ["Pizza", "Frijoles", "Perro Caliente", "Hamburguesa"],
    correct: 3,
  },
  {
    difficulty: "facil",
    q: "¿Cuál es mi postre favorito?",
    options: ["Helado", "Brownie", "Torta", "Galletas"],
    correct: 0,
  },
  {
    difficulty: "facil",
    q: "¿Cuál es mi género musical favorito?",
    options: ["Reggaetón", "Pop", "Rap / Hip-hop", "Rock", "Salsa"],
    correct: 3,
  },
  {
    difficulty: "facil",
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
    difficulty: "facil",
    q: "¿Cuál es mi red social favorita?",
    options: ["Instagram", "TikTok", "Facebook", "YouTube"],
    correct: 1,
  },
  {
    difficulty: "facil",
    q: "¿Cuál es mi hobby favorito en casa?",
    options: ["Leer", "Jugar videojuegos", "Ver peliculas", "Cocinar"],
    correct: 1,
  },
  // ── MEDIO ──
  {
    difficulty: "medio",
    q: "¿Cuál es mi mayor miedo?",
    options: ["Alturas", "Quedarme solo", "Perderte para siempre", "Oscuridad"],
    correct: 2,
  },
  {
    difficulty: "medio",
    q: "¿Cuál es mi sueño más grande?",
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
    difficulty: "medio",
    q: "¿Cómo me llaman mis amigos cercanos?",
    options: ["Sebas", "Juancho", "ElRolo", "ElPapi"],
    correct: 0,
  },
  {
    difficulty: "medio",
    q: "¿Cuál es mi serie favorita?",
    options: ["Breaking Bad", "Stranger Things", "Narcos", "Dark"],
    correct: 0,
  },
  {
    difficulty: "medio",
    q: "¿Qué tipo de películas prefiero ver contigo?",
    options: ["Terror", "Comedia romántica", "Acción / Aventura", "Suspenso"],
    correct: 3,
  },
  {
    difficulty: "medio",
    q: "¿Qué haría si tuviéramos un día libre sin planes?",
    options: [
      "Salir a explorar un lugar nuevo",
      "Quedarnos en casa juntos todo el día",
      "Ir de compras",
      "Visitar familia",
    ],
    correct: 0,
  },
  {
    difficulty: "medio",
    q: "¿Cuál es el país que más quiero visitar contigo?",
    options: ["Japón", "Italia", "Estados Unidos", "España"],
    correct: 0,
  },
  {
    difficulty: "medio",
    q: "¿Qué canción nos recuerda a nosotros dos?",
    options: [
      "Us – James Bay",
      "Shape of You – Ed Sheeran",
      "Perfect – Ed Sheeran",
      "All of Me – John Legend",
    ],
    correct: 0,
  },
  {
    difficulty: "medio",
    q: "¿Cuál sería el nombre de nuestro hijo?",
    options: ["Mateo", "Iker", "Santiago", "El Semental."],
    correct: 3,
  },
  // ── DIFÍCIL ──
  {
    difficulty: "dificil",
    q: "¿Cuántas estrellas tiene el universo que te hice? (aprox)",
    options: ["50", "75", "100", "Más de 100"],
    correct: 2,
  },
  {
    difficulty: "dificil",
    q: "¿Cuál fue el primer regalo que te di?",
    options: ["Un collar", "Un anillo y gomitas", "Flores", "Una carta"],
    correct: 1,
  },
  {
    difficulty: "dificil",
    q: "¿Qué es lo que más me pone celoso de ti?",
    options: [
      "Que hables con otros chicos",
      "Que no me cuentes algo",
      "Cuando te veo muy linda y sé que todos te miran",
      "Nada, no soy celoso",
    ],
    correct: 0,
  },
  {
    difficulty: "dificil",
    q: "¿Cuál fue nuestro recuerdo favorito juntos en persona?",
    options: [
      "La primera vez que nos vimos después de la distancia",
      "El día de tu bautismo",
      "La asamblea de abril 2026",
      "Todos son igual de especiales",
    ],
    correct: 3,
  },
  {
    difficulty: "dificil",
    q: "¿Qué es lo que más valoro en una relación?",
    options: [
      "La confianza y lealtad",
      "Lo empalagoso y cariñosos que somos",
      "La comunicación",
      "La honestidad",
    ],
    correct: 0,
  },
  {
    difficulty: "dificil",
    q: "¿Qué es lo que más me gusta de ti que nunca te he dicho directamente?",
    options: [
      "La forma en que me escuchas de verdad",
      "Que te rias de mis chistes malos",
      "Cómo me cuidas sin que yo te lo pida",
      "Cuando te enojas conmigo y tu velocidad de caminar aumenta a 100 km por hora",
    ],
    correct: 2,
  },
  {
    difficulty: "dificil",
    q: "¿Qué es lo que más me gusta de ti?",
    options: [
      "Cuando te enojas y caminas rápido",
      "La forma en que me miras",
      "Cuando te ríes de mis chistes sin sentido",
      "La forma en que me consientes",
      "Tu paciencia conmigo",
      "Tu honestidad",
    ],
    correct: 1,
  },
];

type Difficulty = "facil" | "medio" | "dificil";

const DIFF_CONFIG: Record<
  Difficulty,
  { label: string; color: string; rgb: string; emoji: string; desc: string }
> = {
  facil: {
    label: "Fácil",
    color: "#a0ffc0",
    rgb: "100,220,130",
    emoji: "🌝",
    desc: "Las básicas — si me conoces, las sabes todas",
  },
  medio: {
    label: "Medio",
    color: "#f8d4ef",
    rgb: "255,107,157",
    emoji: "❤️‍🩹",
    desc: "Aquí ya hay que pensar un poquito más",
  },
  dificil: {
    label: "Difícil",
    color: "#ffd97a",
    rgb: "255,200,80",
    emoji: "👑",
    desc: "Solo mi reina puede sacar 100 aquí",
  },
};

export default function QuizConoces() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [leaving, setLeaving] = useState(false);

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

  const startDifficulty = (d: Difficulty) => {
    const filtered = ALL_QUESTIONS.filter((q) => q.difficulty === d);
    setQuestions(filtered);
    setDifficulty(d);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setShowSecret(false);
  };

  const q = questions[current];

  const pick = (idx: number) => {
    if (selected !== null || !q) return;
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
    if (current + 1 >= questions.length) setShowResult(true);
    else setCurrent((c) => c + 1);
  };

  const restart = () => {
    setDifficulty(null);
    setQuestions([]);
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

  const cfg = difficulty ? DIFF_CONFIG[difficulty] : null;

  if (showSecret)
    return (
      <SecretMessage
        onClose={restart}
        onGoBack={goBack}
        lines={[
          "Oye, señorita, ¿tú por qué me conoces tanto, ah? Jajaj, te amo mucho. Eres lo mejor que me ha pasado en la vida, mi amor. No solo me conoces, sino que eres mi complemento, jeje.",
          "Y lo mejor es que todavía nos falta descubrir más cosas del otro. Si te preguntas si te conozco, creo que sí, jajaja, eso espero, y es muy probable que sí. ¿Cómo no voy a conocer a la mujer que amo?",
          "Gracias por todo, por siempre prestarme atención, jaja, y quererme. Te amo demasiado ❤️‍🩹",
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

      {/* ── SELECTOR DE DIFICULTAD ── */}
      {!difficulty && (
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            padding: "5rem 1rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              color: "rgba(192,132,252,0.4)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            ¿qué tanto me conoces?
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              fontWeight: 300,
              color: "#f0e8ff",
              textAlign: "center",
              margin: 0,
            }}
          >
            Elige tu nivel
          </h1>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(200,180,255,0.4)",
              fontStyle: "italic",
              textAlign: "center",
              margin: 0,
            }}
          >
            Cada nivel tiene preguntas distintas 👀
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
            }}
          >
            {(["facil", "medio", "dificil"] as Difficulty[]).map((d) => {
              const c = DIFF_CONFIG[d];
              return (
                <button
                  key={d}
                  onClick={() => startDifficulty(d)}
                  style={{
                    width: "100%",
                    padding: "1.2rem 1.5rem",
                    background: `rgba(${c.rgb},0.06)`,
                    border: `1px solid rgba(${c.rgb},0.2)`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `rgba(${c.rgb},0.12)`;
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      `rgba(${c.rgb},0.45)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `rgba(${c.rgb},0.06)`;
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      `rgba(${c.rgb},0.2)`;
                  }}
                >
                  <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>
                    {c.emoji}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "1rem",
                        color: c.color,
                        margin: 0,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {c.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.78rem",
                        color: `rgba(${c.rgb},0.5)`,
                        margin: "0.2rem 0 0",
                        fontStyle: "italic",
                      }}
                    >
                      {c.desc}
                    </p>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: `rgba(${c.rgb},0.4)`,
                      fontSize: "0.9rem",
                    }}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SPECIAL MODAL ── */}
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
              ¡Eso mi amorrrrrrrrrrrrrrrr!
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

      {/* ── RESULTADO ── */}
      {showResult && !showSecret && cfg && (
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
              filter: `drop-shadow(0 0 20px rgba(${cfg.rgb},0.7))`,
            }}
          >
            {score === questions.length
              ? "👑"
              : score >= Math.ceil(questions.length * 0.6)
                ? "❤️‍🩹"
                : "💜"}
          </div>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              color: `rgba(${cfg.rgb},0.5)`,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "0.8rem",
            }}
          >
            nivel {cfg.label} {cfg.emoji}
          </p>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.6rem",
            }}
          >
            {score === questions.length
              ? "¡Perfecto! Tú sí me conoces bien, mi amor 👑"
              : score >= Math.ceil(questions.length * 0.6)
                ? "¡Upaaaa bien amor! Casi perfecta jaja"
                : "Casiiiiii, te faltaron poquitas jajajaj"}
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
            Acertaste {score} de {questions.length} preguntas
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
              cambiar nivel
            </button>
          </div>
        </div>
      )}

      {/* ── QUIZ ACTIVO ── */}
      {difficulty && !showResult && q && cfg && (
        <div
          style={{ width: "100%", maxWidth: "480px", padding: "5rem 0 2rem" }}
        >
          {/* Badge de nivel */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.68rem",
                color: `rgba(${cfg.rgb},0.6)`,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                border: `1px solid rgba(${cfg.rgb},0.2)`,
                borderRadius: "20px",
                padding: "0.25rem 0.8rem",
              }}
            >
              {cfg.emoji} {cfg.label}
            </span>
          </div>

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
                pregunta {current + 1} de {questions.length}
              </span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: `rgba(${cfg.rgb},0.5)`,
                }}
              >
                {score} correctas
              </span>
            </div>
            <div
              style={{
                height: "3px",
                background: `rgba(${cfg.rgb},0.1)`,
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "2px",
                  width: `${(current / questions.length) * 100}%`,
                  background: `linear-gradient(to right, rgba(${cfg.rgb},0.8), #c084fc)`,
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
              border: `1px solid rgba(${cfg.rgb},0.15)`,
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
              let border = `rgba(${cfg.rgb},0.12)`;
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
                      border: `1px solid ${revealed && isCorrect ? "rgba(100,220,130,0.5)" : `rgba(${cfg.rgb},0.2)`}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: `rgba(${cfg.rgb},0.5)`,
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
