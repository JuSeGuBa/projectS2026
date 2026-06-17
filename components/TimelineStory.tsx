"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Era = "past" | "present" | "future";

const ERAS: {
  id: Era;
  label: string;
  sublabel: string;
  symbol: string;
  color: string;
  accent: string;
  years: string;
}[] = [
  {
    id: "past",
    label: "Pasado",
    sublabel: "Cómo empezó todo",
    symbol: "✦",
    color: "#c8924a",
    accent: "200,146,74",
    years: "2014 – 2024",
  },
  {
    id: "present",
    label: "Presente",
    sublabel: "Lo que somos ahora",
    symbol: "♡",
    color: "#e8a0b4",
    accent: "232,160,180",
    years: "2025 – 2026",
  },
  {
    id: "future",
    label: "Futuro",
    sublabel: "Lo que nos espera",
    symbol: "★",
    color: "#a0b8e8",
    accent: "160,184,232",
    years: "Para siempre",
  },
];

const CONTENT: Record<Era, { title: string; paragraphs: string[] }> = {
  past: {
    title: "Cómo empezó todo",
    paragraphs: [
      "Nos conocemos desde los 6 años — dos niños que nunca imaginaron lo que vendría.",
      "Después de años separados, la vida nos volvió a cruzar. Te escribí como amigo, sin más intención que esa. Pero poco a poco me fuiste gustando: me parecías muy hermosa, te decía que te cuidaras, que eras linda... y tú te fuiste enamorando sin que yo lo supiera del todo.",
      "A finales de octubre de 2024 formamos nuestra relación. Lo que siguió fue más de un año a distancia — videollamadas, mensajes a toda hora, sueños compartidos y una conexión que la distancia nunca logró romper.",
    ],
  },
  present: {
    title: "Lo que somos ahora",
    paragraphs: [
      "Ya viviendo juntos en Pereira, descubrimos que nos amamos de verdad — no solo teníamos el amor más fuerte, sino también la química, la conexión y el deseo.",
      "Pero también descubrimos que no estábamos listos. Así que tomé la decisión más difícil: pausar las cosas para no destruirnos, para salvarnos. Para que cada uno pudiera prepararse, crecer y sanar.",
      "Tú necesitabas descubrir la hermosa y fuerte mujer que eres. Y yo necesitaba estar listo para cuidarte como mereces.",
      "Hoy, junio de 2026, estamos en ese proceso. Y tenemos fe de que volveremos. Eso no lo duda ninguno de los dos.",
    ],
  },
  future: {
    title: "Lo que nos espera",
    paragraphs: [
      "No sé exactamente cuándo volveremos — si serán semanas, meses o años. Pero sí sé lo que hay al final del camino.",
      "Hay anillos. Hay una hacienda con espacio para vivir y crecer. Hay viajes juntos, aventuras, risas. Hay un perro que todavía no tiene nombre. Hay una boda que ya imaginamos aunque no hayamos fijado fecha.",
      "Estan Iker y a Anto, nuestros hijos que aún no nacen pero a quienes ya amamos.",
      "Y hay esa vida que siempre hablamos — la que construiremos cuando estemos listos, cuando el amor sea suficientemente sabio como para quedarse para siempre.",
      "Te espero. Y sé que tú también me esperas. Te amo, mi vida entera. ❤️‍🩹",
    ],
  },
};

// Sand particle
interface Grain {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  opacity: number;
  color: string;
}

function SandCanvas({ active, accent }: { active: boolean; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grains = useRef<Grain[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 120;
    canvas.height = 200;

    const sandColors = [
      `rgba(${accent},0.9)`,
      `rgba(${accent},0.6)`,
      `rgba(200,170,100,0.7)`,
      `rgba(220,190,130,0.5)`,
    ];

    const spawnGrain = (): Grain => ({
      x: 55 + (Math.random() - 0.5) * 8,
      y: 90,
      vy: 1.2 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.6,
      size: 0.8 + Math.random() * 1.4,
      opacity: 0.6 + Math.random() * 0.4,
      color: sandColors[Math.floor(Math.random() * sandColors.length)],
    });

    const loop = () => {
      if (!active) {
        ctx.clearRect(0, 0, 120, 200);
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, 120, 200);
      timeRef.current += 1;

      // Spawn grains
      if (timeRef.current % 2 === 0) {
        grains.current.push(spawnGrain());
      }

      // Keep pool bounded
      if (grains.current.length > 120) {
        grains.current.splice(0, grains.current.length - 120);
      }

      // Draw & update
      grains.current = grains.current.filter((g) => g.y < 210);
      grains.current.forEach((g) => {
        g.y += g.vy;
        g.x += g.vx;
        g.vy *= 1.018; // slight gravity
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fillStyle = g.color;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, accent]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={200}
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        opacity: active ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}

export default function TimelineStory() {
  useEffect(() => {
    const audio = new Audio("/music/TeRegalo.mp3");
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
  const [active, setActive] = useState<Era | null>(null);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [typedText, setTypedText] = useState<string[]>([]);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos/games"), 500);
  };

  const selectEra = (era: Era) => {
    if (typeTimeout.current) clearTimeout(typeTimeout.current);

    if (active === era) {
      setActive(null);
      setTextVisible(false);
      setTypedText([]);
      return;
    }

    setActive(null);
    setTextVisible(false);
    setTypedText([]);

    setTimeout(() => {
      setActive(era);
      setTimeout(() => {
        setTextVisible(true);
        // Reveal paragraphs one at a time
        const paras = CONTENT[era].paragraphs;
        paras.forEach((_, i) => {
          typeTimeout.current = setTimeout(() => {
            setTypedText((prev) => [...prev, paras[i]]);
          }, i * 320);
        });
      }, 200);
    }, 150);
  };

  const activeEra = ERAS.find((e) => e.id === active);
  const activeContent = active ? CONTENT[active] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;500&display=swap');

        .era-btn {
          position: relative;
          cursor: pointer;
          border: none;
          background: transparent;
          padding: 0;
          width: 100%;
        }
        .era-btn:focus-visible {
          outline: 1px solid rgba(200,150,80,0.4);
          outline-offset: 3px;
          border-radius: 4px;
        }

        .sand-line {
          height: 2px;
          background: linear-gradient(to right,
            transparent 0%,
            rgba(200,146,74,0.15) 20%,
            rgba(200,146,74,0.35) 50%,
            rgba(200,146,74,0.15) 80%,
            transparent 100%
          );
        }

        .grain-enter {
          animation: grainFade 0.6s ease forwards;
        }
        @keyframes grainFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        .hourglass-svg {
          filter: drop-shadow(0 0 12px rgba(200,146,74,0.25));
        }
        .hourglass-svg.active-svg {
          filter: drop-shadow(0 0 20px rgba(200,146,74,0.5));
        }

        @media (prefers-reduced-motion: reduce) {
          .grain-enter { animation: none; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 0%, #140a04 0%, #0b0603 55%, #050302 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "4rem",
          opacity: leaving ? 0 : 1,
          transition: "opacity 0.5s ease",
          overflowX: "hidden",
        }}
      >
        {/* Back button */}
        <button
          onClick={goBack}
          style={{
            position: "fixed",
            top: "1.2rem",
            left: "1.2rem",
            zIndex: 20,
            background: "rgba(20,10,4,0.8)",
            border: "1px solid rgba(200,146,74,0.18)",
            borderRadius: "2px",
            color: "rgba(200,170,110,0.55)",
            padding: "0.45rem 0.9rem",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}
        >
          ← volver
        </button>

        {/* ── HEADER ── */}
        <div
          style={{
            textAlign: "center",
            padding: "5rem 1.5rem 1.5rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.1s ease",
          }}
        >
          {/* Cinzel title */}
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              color: "rgba(200,146,74,0.45)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            nuestra historia
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2rem, 6vw, 3rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#e8d5a8",
              letterSpacing: "0.03em",
              lineHeight: 1.2,
              marginBottom: "0.4rem",
              textShadow: "0 0 40px rgba(200,146,74,0.2)",
            }}
          >
            La arena del tiempo
          </h1>
          <div
            className="sand-line"
            style={{ maxWidth: "220px", margin: "1rem auto" }}
          />
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.88rem",
              color: "rgba(200,170,120,0.35)",
            }}
          >
            toca cada uno linda para leer nuestra historia
          </p>
        </div>

        {/* ── HOURGLASS ROW ── */}
        <div
          style={{
            display: "flex",
            gap: "clamp(1.5rem, 5vw, 3.5rem)",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0 1rem",
            marginTop: "1rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.9s ease 0.3s",
          }}
        >
          {ERAS.map((era) => {
            const isActive = active === era.id;
            return (
              <button
                key={era.id}
                className="era-btn"
                onClick={() => selectEra(era.id)}
                style={{ width: "clamp(80px, 22vw, 110px)" }}
              >
                {/* Hourglass SVG */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(100px, 26vw, 140px)",
                    marginBottom: "0.8rem",
                  }}
                >
                  <svg
                    viewBox="0 0 80 130"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`hourglass-svg${isActive ? " active-svg" : ""}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      transition: "filter 0.4s ease",
                    }}
                  >
                    {/* Outer frame */}
                    <path
                      d="M10,8 L70,8 L70,16 L48,60 L48,70 L70,114 L70,122 L10,122 L10,114 L32,70 L32,60 L10,16 Z"
                      fill="none"
                      stroke={`rgba(${era.accent},${isActive ? 0.7 : 0.25})`}
                      strokeWidth="1.5"
                      style={{ transition: "stroke 0.4s ease" }}
                    />
                    {/* Top cap */}
                    <rect
                      x="8"
                      y="4"
                      width="64"
                      height="8"
                      rx="2"
                      fill={`rgba(${era.accent},${isActive ? 0.5 : 0.15})`}
                      style={{ transition: "fill 0.4s ease" }}
                    />
                    {/* Bottom cap */}
                    <rect
                      x="8"
                      y="118"
                      width="64"
                      height="8"
                      rx="2"
                      fill={`rgba(${era.accent},${isActive ? 0.5 : 0.15})`}
                      style={{ transition: "fill 0.4s ease" }}
                    />
                    {/* Top sand */}
                    <path
                      d={
                        isActive
                          ? "M14,16 L66,16 L48,50 L32,50 Z"
                          : "M14,16 L66,16 L52,42 L28,42 Z"
                      }
                      fill={`rgba(${era.accent},${isActive ? 0.22 : 0.1})`}
                      style={{ transition: "all 0.6s ease" }}
                    />
                    {/* Bottom sand pile */}
                    <path
                      d={
                        isActive
                          ? "M32,90 L48,90 L64,114 L16,114 Z"
                          : "M34,96 L46,96 L62,114 L18,114 Z"
                      }
                      fill={`rgba(${era.accent},${isActive ? 0.3 : 0.12})`}
                      style={{ transition: "all 0.6s ease" }}
                    />
                    {/* Neck dot */}
                    <circle
                      cx="40"
                      cy="65"
                      r={isActive ? 3 : 2}
                      fill={`rgba(${era.accent},${isActive ? 0.9 : 0.3})`}
                      style={{ transition: "all 0.4s ease" }}
                    />
                    {/* Glow ring when active */}
                    {isActive && (
                      <circle
                        cx="40"
                        cy="65"
                        r="8"
                        fill="none"
                        stroke={`rgba(${era.accent},0.25)`}
                        strokeWidth="1"
                      />
                    )}
                    {/* Symbol inside top */}
                    <text
                      x="40"
                      y="36"
                      textAnchor="middle"
                      fontSize="10"
                      fill={`rgba(${era.accent},${isActive ? 0.8 : 0.3})`}
                      fontFamily="Georgia, serif"
                      style={{ transition: "fill 0.4s ease" }}
                    >
                      {era.symbol}
                    </text>
                  </svg>

                  {/* Falling sand canvas */}
                  <SandCanvas active={isActive} accent={era.accent} />
                </div>

                {/* Label */}
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(0.6rem, 1.8vw, 0.72rem)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: isActive ? era.color : "rgba(180,150,100,0.3)",
                    transition: "color 0.4s ease",
                    marginBottom: "0.2rem",
                  }}
                >
                  {era.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(0.62rem, 1.6vw, 0.7rem)",
                    fontStyle: "italic",
                    color: isActive
                      ? `rgba(${era.accent},0.55)`
                      : "rgba(150,120,70,0.2)",
                    transition: "color 0.4s ease",
                    letterSpacing: "0.04em",
                  }}
                >
                  {era.years}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── CONTENT PANEL ── */}
        {active && activeContent && activeEra && (
          <div
            style={{
              width: "100%",
              maxWidth: "540px",
              padding: "0 1.4rem",
              marginTop: "2.5rem",
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.5s ease",
            }}
          >
            {/* Decorative top */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "1.6rem",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: `linear-gradient(to right, transparent, rgba(${activeEra.accent},0.35))`,
                }}
              />
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: `rgba(${activeEra.accent},0.6)`,
                }}
              >
                {activeEra.symbol}
              </span>
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: `rgba(${activeEra.accent},0.45)`,
                }}
              >
                {activeEra.label}
              </span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: `rgba(${activeEra.accent},0.6)`,
                }}
              >
                {activeEra.symbol}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: `linear-gradient(to left, transparent, rgba(${activeEra.accent},0.35))`,
                }}
              />
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "#f0e0c0",
                marginBottom: "1.6rem",
                letterSpacing: "0.02em",
                lineHeight: 1.3,
              }}
            >
              {activeContent.title}
            </h2>

            {/* Paragraphs revealed in sequence */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
              }}
            >
              {typedText.map((para, i) => (
                <p
                  key={i}
                  className="grain-enter"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(1rem, 2.8vw, 1.08rem)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "rgba(220,195,155,0.82)",
                    lineHeight: 1.9,
                    letterSpacing: "0.02em",
                    margin: 0,
                    borderLeft: `1px solid rgba(${activeEra.accent},0.15)`,
                    paddingLeft: "1rem",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Bottom ornament */}
            {typedText.length === activeContent.paragraphs.length && (
              <div
                className="grain-enter"
                style={{
                  marginTop: "2.2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  opacity: 0.5,
                }}
              >
                <div className="sand-line" style={{ width: "120px" }} />
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.65rem",
                    color: `rgba(${activeEra.accent},0.4)`,
                    letterSpacing: "0.3em",
                  }}
                >
                  {activeEra.symbol} {activeEra.years} {activeEra.symbol}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {!active && visible && (
          <p
            style={{
              marginTop: "2rem",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.78rem",
              color: "rgba(180,150,90,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            cada ampolleta guarda un capítulo ✦
          </p>
        )}
      </div>
    </>
  );
}
