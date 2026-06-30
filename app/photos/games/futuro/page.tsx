"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Option {
  id: string;
  label: string;
  image: string;
  desc?: string;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  rgb: string;
  options: Option[];
  multiSelect?: boolean; // permite elegir más de una opción
}

// ── Pasos y opciones ───────────────────────────────────────────────────────────
// ✏️ Edita los labels y descs según tus imágenes
const STEPS: Step[] = [
  {
    id: "boda",
    title: "Nuestra boda",
    subtitle: "¿Cómo te imaginas ese día tan especial?",
    emoji: "💍",
    color: "#f8d4ef",
    rgb: "248,212,239",
    options: [
      {
        id: "boda-1",
        label: "Boda íntima",
        image: "/future/lugarBoda/boda-1.png",
        desc: "Solo nosotros y los más cercanos",
      },
      {
        id: "boda-2",
        label: "Boda en hacienda",
        image: "/future/lugarBoda/boda-2.png",
        desc: "Rodeados de naturaleza y luz",
      },
      {
        id: "boda-3",
        label: "Boda en el salon del reino",
        image: "/future/lugarBoda/boda-3.png",
        desc: "Hay en el salon que estamos amor",
      },
      {
        id: "boda-4",
        label: "Boda grande",
        image: "/future/lugarBoda/boda-4.png",
        desc: "Con toda la familia y amigos",
      },
    ],
  },
  {
    id: "casa",
    title: "Nuestra casa",
    subtitle: "¿Dónde construiremos nuestro hogar?",
    emoji: "🏡",
    color: "#fde8d0",
    rgb: "253,232,208",
    options: [
      {
        id: "casa-1",
        label: "Hacienda",
        image: "/future/casa/casaopciones/casa-1.jpg",
        desc: "Espacio, naturaleza y paz",
      },
      {
        id: "casa-2",
        label: "Cabaña",
        image: "/future/casa/casaopciones/casa-2.jpg",
        desc: "Privado y en la naturaleza",
      },
      {
        id: "casa-3",
        label: "Departamento",
        image: "/future/casa/casaopciones/casa-3.jpg",
        desc: "Algo pequeño pero acogedor",
      },
      {
        id: "casa-4",
        label: "Casa moderna",
        image: "/future/casa/casaopciones/casa-4.jpg",
        desc: "En el barrio o en conjunto una casa grande",
      },
    ],
  },
  {
    id: "viajes",
    title: "Nuestros viajes",
    subtitle: "¿A dónde vamos juntos? Elige los que quieras 🌍",
    emoji: "✈️",
    color: "#a5f3fc",
    rgb: "165,243,252",
    multiSelect: true,
    options: [
      {
        id: "viaje-1",
        label: "Italia",
        image: "/future/viajes/viaje-1.jpg",
        desc: "Elegancia y historia",
      },
      {
        id: "viaje-2",
        label: "Japon",
        image: "/future/viajes/viaje-2.jpg",
        desc: "Ramen y tecnologia avanzada",
      },
      {
        id: "viaje-3",
        label: "Francia",
        image: "/future/viajes/viaje-3.jpg",
        desc: "Paris ciudad del amor",
      },
      {
        id: "viaje-4",
        label: "Estados Unidos",
        image: "/future/viajes/viaje-4.jpg",
        desc: "Donde vive spiderman jaja",
      },
      {
        id: "viaje-5",
        label: "España",
        image: "/future/viajes/viaje-5.jpg",
        desc: "Cultura, flamenco y tapas",
      },
    ],
  },
  {
    id: "mascota",
    title: "Nuestra mascota",
    subtitle: "¿Qué peludo se une a la familia?",
    emoji: "🐾",
    color: "#ffd97a",
    rgb: "255,217,122",
    options: [
      {
        id: "mascota-1",
        label: "Lobo Siberiano",
        image: "/future/mascota/mascota-1.jpg",
        desc: "Imponente",
      },
      {
        id: "mascota-2",
        label: "Dalmata",
        image: "/future/mascota/mascota-2.avif",
        desc: "Grande y energetico",
      },
      {
        id: "mascota-3",
        label: "American bully",
        image: "/future/mascota/mascota-3.jpeg",
        desc: "Aunque tiene presencia y es musculoso, protector y cariñoso",
      },
      {
        id: "mascota-4",
        label: "Golden",
        image: "/future/mascota/mascota-4.avif",
        desc: "Grande, divertido",
      },
    ],
  },
  {
    id: "hijos",
    title: "Nuestros hijos",
    subtitle: "Cual te gustaria que naciera primero?",
    emoji: "👶",
    color: "#bbf7d0",
    rgb: "187,247,208",
    options: [
      {
        id: "hijos-1",
        label: "Primero Iker",
        image: "/future/hijos/hijos-1.png",
        desc: "Nuestro primer varón",
      },
      {
        id: "hijos-2",
        label: "Primero Antonella",
        image: "/future/hijos/hijos-2.png",
        desc: "Nuestra primera niña",
      },
    ],
  },
];

// ── Summary messages per step ──────────────────────────────────────────────────
const SUMMARY_MSGS: Record<string, string> = {
  boda: "Ese día va a ser el más especial de nuestras vidas 💍",
  casa: "Ahí construiremos todo lo que soñamos 🏡",
  decoracion: "Nuestro rincón, nuestro estilo, nuestro hogar 🛋️",
  viajes: "El mundo nos espera, y lo vamos a recorrer juntos ✈️",
  mascota: "La familia ya tiene miembro peludo 🐾",
  hijos: "Iker, Antonella, Reichel — el amor más grande 👶",
  vida: "Los días simples contigo son los mejores ☀️",
};

export default function NuestroFuturo() {
  useEffect(() => {
    const audio = new Audio("/music/SiPudiera.mp3");
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
  const [stepIdx, setStepIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  const step = STEPS[stepIdx];
  const selected = selections[step?.id] ?? [];
  const isMulti = step?.multiSelect ?? false;
  const totalSteps = STEPS.length;

  const toggle = (optId: string) => {
    if (isMulti) {
      setSelections((prev) => {
        const cur = prev[step.id] ?? [];
        const next = cur.includes(optId)
          ? cur.filter((x) => x !== optId)
          : [...cur, optId];
        return { ...prev, [step.id]: next };
      });
    } else {
      setSelections((prev) => ({ ...prev, [step.id]: [optId] }));
    }
  };

  const canContinue = selected.length > 0;

  const next = () => {
    if (!canContinue) return;
    if (stepIdx + 1 >= totalSteps) {
      setShowSummary(true);
      setTimeout(() => setSummaryVisible(true), 80);
    } else {
      setVisible(false);
      setTimeout(() => {
        setStepIdx((s) => s + 1);
        setVisible(true);
      }, 300);
    }
  };

  const prev = () => {
    if (stepIdx === 0) return;
    setVisible(false);
    setTimeout(() => {
      setStepIdx((s) => s - 1);
      setVisible(true);
    }, 300);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos/games"), 500);
  };

  const restart = () => {
    setSelections({});
    setStepIdx(0);
    setShowSummary(false);
    setSummaryVisible(false);
    setVisible(true);
  };

  const handleImgError = (id: string) => {
    setImgErrors((prev) => new Set([...prev, id]));
  };

  // ── Summary screen ─────────────────────────────────────────────────────────
  if (showSummary) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 0%, #0d0415 0%, #040208 70%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem 1rem 4rem",
          opacity: leaving ? 0 : summaryVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <button onClick={goBack} style={backBtnStyle}>
          ← volver
        </button>

        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem 2rem",
            maxWidth: 540,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              filter: "drop-shadow(0 0 16px rgba(255,107,157,0.7))",
            }}
          >
            ❤️‍🩹
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem,5vw,2.4rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.5rem",
            }}
          >
            Así será nuestro futuro
          </h1>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.88rem",
              color: "rgba(220,200,255,0.45)",
              fontStyle: "italic",
              marginBottom: "3rem",
            }}
          >
            Todo lo que elegiste, todo lo que soñamos juntos ❤️‍🩹
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {STEPS.map((s, si) => {
              const sel = selections[s.id] ?? [];
              const opts = s.options.filter((o) => sel.includes(o.id));
              if (opts.length === 0) return null;
              return (
                <div
                  key={s.id}
                  style={{
                    background: `linear-gradient(135deg, rgba(${s.rgb},0.06), rgba(10,5,20,0.95))`,
                    border: `1px solid rgba(${s.rgb},0.18)`,
                    borderRadius: "10px",
                    padding: "1.4rem",
                    opacity: summaryVisible ? 1 : 0,
                    transform: summaryVisible
                      ? "translateY(0)"
                      : "translateY(16px)",
                    transition: `all 0.5s ease ${si * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{s.emoji}</span>
                    <h2
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "1rem",
                        fontWeight: 300,
                        color: s.color,
                        margin: 0,
                      }}
                    >
                      {s.title}
                    </h2>
                  </div>
                  <div
                    style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}
                  >
                    {opts.map((o) => (
                      <div
                        key={o.id}
                        style={{ flex: "1 1 140px", minWidth: 0 }}
                      >
                        <div
                          style={{
                            borderRadius: "6px",
                            overflow: "hidden",
                            aspectRatio: "4/3",
                            marginBottom: "0.4rem",
                            background: "rgba(255,255,255,0.04)",
                          }}
                        >
                          {imgErrors.has(o.id) ? (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                              }}
                            >
                              {s.emoji}
                            </div>
                          ) : (
                            <img
                              src={o.image}
                              alt={o.label}
                              onError={() => handleImgError(o.id)}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.78rem",
                            color: s.color,
                            margin: 0,
                            textAlign: "center",
                          }}
                        >
                          {o.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.8rem",
                      color: "rgba(220,200,255,0.45)",
                      fontStyle: "italic",
                      margin: "1rem 0 0",
                      textAlign: "center",
                    }}
                  >
                    {SUMMARY_MSGS[s.id]}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "3rem",
              padding: "1.8rem",
              background:
                "linear-gradient(135deg, rgba(255,107,157,0.08), rgba(192,132,252,0.06))",
              border: "1px solid rgba(255,107,157,0.2)",
              borderRadius: "10px",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1rem,3vw,1.2rem)",
                color: "#ff9ec0",
                fontStyle: "italic",
                lineHeight: 1.8,
                margin: "0 0 1rem",
                textShadow: "0 0 20px rgba(255,107,157,0.3)",
              }}
            >
              No sé exactamente cuándo llegará todo esto, pero sé que va a
              llegar. Y lo vamos a vivir juntos, tú y yo. Te lo prometo, Te amo
              demasiado ❤️‍🩹
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.75rem",
                color: "rgba(255,107,157,0.35)",
                letterSpacing: "0.2em",
                margin: 0,
              }}
            >
              — El hombre que te anehla
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2.5rem",
            }}
          >
            <button
              onClick={restart}
              style={{
                padding: "0.85rem 1.8rem",
                background:
                  "linear-gradient(135deg,rgba(255,107,157,0.15),rgba(192,132,252,0.1))",
                border: "1px solid rgba(255,107,157,0.35)",
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              construir de nuevo ♡
            </button>
            <button
              onClick={goBack}
              style={{
                padding: "0.85rem 1.8rem",
                background: "transparent",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "3px",
                color: "rgba(200,170,255,0.5)",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
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

  // ── Step screen ────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #0d0415 0%, #040208 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem 1rem 5rem",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <button onClick={goBack} style={backBtnStyle}>
        ← volver
      </button>

      {/* Progress dots */}
      <div
        style={{
          position: "fixed",
          top: "1.2rem",
          right: "1.5rem",
          zIndex: 20,
          display: "flex",
          gap: "5px",
          alignItems: "center",
        }}
      >
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === stepIdx ? "16px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background:
                i < stepIdx
                  ? `rgba(${step.rgb},0.6)`
                  : i === stepIdx
                    ? step.color
                    : "rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "4.5rem 1rem 1.5rem",
          maxWidth: 540,
          width: "100%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            marginBottom: "0.8rem",
            filter: `drop-shadow(0 0 12px rgba(${step.rgb},0.5))`,
          }}
        >
          {step.emoji}
        </div>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.68rem",
            color: `rgba(${step.rgb},0.45)`,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          paso {stepIdx + 1} de {totalSteps}
        </p>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.5rem,5vw,2.2rem)",
            fontWeight: 300,
            color: step.color,
            marginBottom: "0.4rem",
            textShadow: `0 0 30px rgba(${step.rgb},0.25)`,
          }}
        >
          {step.title}
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.88rem",
            color: "rgba(220,200,255,0.45)",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {step.subtitle}
        </p>
        {isMulti && (
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              color: `rgba(${step.rgb},0.4)`,
              marginTop: "0.5rem",
              letterSpacing: "0.1em",
            }}
          >
            Puedes elegir varias ✦
          </p>
        )}
      </div>

      {/* Options grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            step.options.length <= 3
              ? `repeat(${step.options.length}, 1fr)`
              : "repeat(2, 1fr)",
          gap: "0.9rem",
          maxWidth: 540,
          width: "100%",
          padding: "0 0.2rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.4s ease 0.08s",
        }}
      >
        {step.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              style={{
                background: isSelected
                  ? `rgba(${step.rgb},0.14)`
                  : "rgba(10,5,20,0.7)",
                border: `2px solid rgba(${step.rgb},${isSelected ? 0.7 : 0.15})`,
                borderRadius: "10px",
                padding: 0,
                cursor: "pointer",
                overflow: "hidden",
                textAlign: "left",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                boxShadow: isSelected
                  ? `0 0 20px rgba(${step.rgb},0.2)`
                  : "none",
                transition: "all 0.25s ease",
              }}
            >
              {/* Image */}
              <div
                style={{
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {imgErrors.has(opt.id) ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      background: `rgba(${step.rgb},0.08)`,
                    }}
                  >
                    {step.emoji}
                  </div>
                ) : (
                  <img
                    src={opt.image}
                    alt={opt.label}
                    onError={() => handleImgError(opt.id)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: isSelected
                        ? "brightness(1.05)"
                        : "brightness(0.85)",
                    }}
                  />
                )}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: step.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: "#0d0415",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
              {/* Label */}
              <div style={{ padding: "0.7rem 0.8rem 0.8rem" }}>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.85rem",
                    color: isSelected ? step.color : "rgba(220,200,255,0.75)",
                    margin: "0 0 0.2rem",
                    fontWeight: isSelected ? 400 : 300,
                  }}
                >
                  {opt.label}
                </p>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.72rem",
                    color: `rgba(${step.rgb},${isSelected ? 0.6 : 0.3})`,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: "0.8rem",
          justifyContent: "center",
          marginTop: "2rem",
          maxWidth: 540,
          width: "100%",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease 0.15s",
        }}
      >
        {stepIdx > 0 && (
          <button
            onClick={prev}
            style={{
              padding: "0.8rem 1.4rem",
              background: "transparent",
              border: `1px solid rgba(${step.rgb},0.2)`,
              borderRadius: "3px",
              color: `rgba(${step.rgb},0.45)`,
              fontFamily: "Georgia, serif",
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            ← anterior
          </button>
        )}
        <button
          onClick={next}
          disabled={!canContinue}
          style={{
            flex: 1,
            padding: "0.9rem",
            background: canContinue
              ? `linear-gradient(135deg, rgba(${step.rgb},0.18), rgba(192,132,252,0.1))`
              : "rgba(255,255,255,0.03)",
            border: `1px solid rgba(${step.rgb},${canContinue ? 0.45 : 0.1})`,
            borderRadius: "3px",
            color: canContinue ? step.color : "rgba(200,180,255,0.2)",
            fontFamily: "Georgia, serif",
            fontSize: "0.95rem",
            letterSpacing: "0.08em",
            cursor: canContinue ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}
        >
          {stepIdx + 1 >= totalSteps ? "ver nuestro futuro ❤️‍🩹" : "siguiente →"}
        </button>
      </div>

      {/* Skip hint if nothing selected */}
      {!canContinue && (
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.72rem",
            color: "rgba(220,200,255,0.2)",
            marginTop: "0.8rem",
            fontStyle: "italic",
          }}
        >
          Elige al menos una opción para continuar
        </p>
      )}
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
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
};
