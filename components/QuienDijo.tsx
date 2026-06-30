"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SecretMessage from "./SecretMessage";

interface Frase {
  texto: string;
  quien: "Reina" | "TriplePapichulo";
}

// ✏️ AGREGA O EDITA FRASES AQUÍ — cambia "quien" por "Reina" o "TriplePapichulo"
const FRASES: Frase[] = [
  { texto: "Te Amo.", quien: "Reina" },
  { texto: "Me gustas.", quien: "Reina" },
  { texto: "Avísame cuando llegues a casa.", quien: "TriplePapichulo" },
  { texto: "Mi Amor.", quien: "TriplePapichulo" },
  { texto: "Te extraño.", quien: "Reina" },
  { texto: "Quiero que lo hagamos oficial este año.", quien: "Reina" },
  { texto: "Quiero hacer una videollamada contigo.", quien: "TriplePapichulo" },
  { texto: "Quiero un niño y una niña.", quien: "Reina" },
  { texto: "¿Y si nos casamos en secreto?", quien: "TriplePapichulo" },
  { texto: "Quiero que planeemos nuestra boda.", quien: "Reina" },
  { texto: "Mucho cuidado.", quien: "TriplePapichulo" },
  { texto: "¿Ya comiste?", quien: "TriplePapichulo" },
  { texto: "No me imagino mi vida sin ti.", quien: "TriplePapichulo" },
  { texto: "Eres lo mejor que me ha pasado.", quien: "Reina" },
  { texto: "¿Cuándo nos vemos?", quien: "Reina" },
  { texto: "Es la primera vez que me salen lagrimas de amor", quien: "Reina" },
  { texto: "Quiero envejecer contigo.", quien: "TriplePapichulo" },
  { texto: "¿Estás bien? Te noto diferente.", quien: "Reina" },
  { texto: "Yo también te extraño, pero más yo.", quien: "TriplePapichulo" },
  { texto: "Cuando nos vamos a casar?.", quien: "Reina" },
  { texto: "Me gusta cómo me miras.", quien: "Reina" },
  { texto: "¿Me puedes llamar?", quien: "TriplePapichulo" },
  { texto: "Eres el amor de mi vida.", quien: "TriplePapichulo" },
  { texto: "Sueño con que vivamos juntos.", quien: "Reina" },
  { texto: "Cuídate mucho, ¿sí?", quien: "Reina" },
  { texto: "Quiero 2 hijos", quien: "TriplePapichulo" },
  { texto: "Me entrego a ti.", quien: "TriplePapichulo" },
  { texto: "¿Con quien hablas?", quien: "Reina" },
  { texto: "Eres mi pedazo de mi vida.", quien: "Reina" },
  { texto: "Ojala estuvieras aqui.", quien: "Reina" },
];

const LABELS: Record<string, string> = {
  Reina: "Reina 👑",
  TriplePapichulo: "TriplePapichulo jiji",
};

// Barajar aleatoriamente las frases para que no siempre salgan en el mismo orden
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuienDijo() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/music/21Questions.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    const start = () => {
      audio.play().catch(() => {});
      document.removeEventListener("pointerdown", start);
    };
    document.addEventListener("pointerdown", start);
    return () => {
      document.removeEventListener("pointerdown", start);
      audio.pause();
    };
  }, []);

  // Tomamos 15 frases aleatorias de la lista total cada vez que se juega
  const [frases] = useState<Frase[]>(() => shuffle(FRASES).slice(0, 15));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const f = frases[current];

  const pick = (quien: string) => {
    if (selected) return;
    setSelected(quien);
    if (quien === f.quien) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= frases.length) setShowResult(true);
      else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 1100);
  };

  const restart = () => {
    // Al reiniciar se barajan de nuevo — siempre frases distintas
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
          "Cada una de esas frases las dijimos de verdad, con el corazón. No solo en el momento, sino que marcaron. Y lo más bonito no es quién las dijo primero, sino que tú y yo formamos cada momento.",
          "Me pone feliz que te acuerdes de esas palabras; algunas fueron difíciles, jejej. Así como no las olvidaste, yo jamás olvidaré cada recuerdo que formamos juntos.",
          "Lo más especial de nosotros es que, aunque son frases o palabras importantes, no solo se quedan ahí, sino que lo demostramos con acciones, y siempre nos esforzamos y lo damos todo. Gracias por todo. Te amo, reina hermosa 👑.",
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
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>💬</div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.6rem",
            }}
          >
            {score >= 13
              ? "¡Eres genial te amo tanto reina mia pero tanto! 👑"
              : score >= 9
                ? "¡Nos conocemos muy bien!"
                : score >= 6
                  ? "¡Bastante bien!"
                  : "Jajaja… ¡hay que hablar más!"}
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
            {score} de {frases.length} frases correctas
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
                  "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(255,107,157,0.1))",
                border: "1px solid rgba(192,132,252,0.35)",
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
              intentar de nuevo, tú puedes amor
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
                frase {current + 1} de {frases.length}
              </span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(192,132,252,0.5)",
                }}
              >
                {score} correctas
              </span>
            </div>
            <div
              style={{
                height: "3px",
                background: "rgba(192,132,252,0.1)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(current / frases.length) * 100}%`,
                  background: "linear-gradient(to right, #c084fc, #ff6b9d)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.78rem",
              color: "rgba(192,132,252,0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            ¿quién lo dijo primero?
          </p>

          {/* Frase */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.92), rgba(12,5,25,0.92))",
              border: "1px solid rgba(192,132,252,0.15)",
              borderRadius: "8px",
              padding: "2rem 1.8rem",
              marginBottom: "1.8rem",
              textAlign: "center",
              boxShadow: "0 0 30px rgba(192,84,252,0.06)",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                opacity: 0.3,
                display: "block",
                marginBottom: "0.8rem",
              }}
            >
              "
            </span>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.05rem, 3vw, 1.3rem)",
                color: "#f0e8ff",
                fontStyle: "italic",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {f.texto}
            </p>
            <span
              style={{
                fontSize: "1.5rem",
                opacity: 0.3,
                display: "block",
                marginTop: "0.8rem",
              }}
            >
              "
            </span>
          </div>

          {/* Options */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            {(["Reina", "TriplePapichulo"] as const).map((quien) => {
              const isSelected = selected === quien;
              const isCorrect = quien === f.quien;
              const revealed = selected !== null;
              let bg = "rgba(20,8,40,0.6)";
              let border = "rgba(192,132,252,0.15)";
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
                  key={quien}
                  onClick={() => pick(quien)}
                  disabled={!!selected}
                  style={{
                    padding: "1rem 1.5rem",
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: "6px",
                    cursor: selected ? "default" : "pointer",
                    color,
                    fontFamily: "Georgia, serif",
                    fontSize: "1rem",
                    transition: "all 0.25s ease",
                    textAlign: "center",
                  }}
                >
                  {LABELS[quien]}
                  {revealed && isCorrect && " ✓"}
                  {revealed && isSelected && !isCorrect && " ✗"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
