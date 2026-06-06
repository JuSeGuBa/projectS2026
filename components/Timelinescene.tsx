"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Moment {
  id: number;
  date: string;
  title: string;
  message: string;
  image: string;
  side: "left" | "right";
}

// ── PERSONALIZA AQUÍ ──────────────────────────────────────────────────────────
const MOMENTS: Moment[] = [
  {
    id: 1,
    date: "Fecha aquí",
    title: "Título del momento",
    message:
      "Escribe aquí el mensaje de este momento. Lo que recuerdas, lo que sentiste, lo que significa.",
    image: "/photos/timeline/moment-1.jpg",
    side: "right",
  },
  {
    id: 2,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-2.jpg",
    side: "left",
  },
  {
    id: 3,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-3.jpg",
    side: "right",
  },
  {
    id: 4,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-4.png",
    side: "left",
  },
  {
    id: 5,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-5.jpg",
    side: "right",
  },
  {
    id: 6,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-6.jpg",
    side: "left",
  },
  {
    id: 7,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-7.png",
    side: "right",
  },
  {
    id: 8,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-8.jpg",
    side: "left",
  },
  {
    id: 9,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-9.jpeg",
    side: "right",
  },
  {
    id: 10,
    date: "Fecha aquí",
    title: "Título del momento",
    message: "Escribe aquí el mensaje de este momento.",
    image: "/photos/timeline/moment-10.jpeg",
    side: "left",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function TimelineScene() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set([1]));
  const [selected, setSelected] = useState<Moment | null>(null);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [instrVisible, setInstrVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setInstrVisible(true), 60);
  }, []);

  const closeInstructions = () => {
    setInstrVisible(false);
    setTimeout(() => {
      setShowInstructions(false);
      setTimeout(() => setVisible(true), 100);
    }, 350);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos"), 500);
  };

  const openMoment = (moment: Moment) => {
    if (!unlocked.has(moment.id)) return;
    setSelected(moment);
    setTimeout(() => setModalVisible(true), 30);
    setUnlocked((prev) => {
      const next = new Set(prev);
      next.add(moment.id + 1);
      return next;
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelected(null), 300);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #0d0415 0%, #040208 60%)",
        paddingBottom: "5rem",
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

      {/* Instructions modal */}
      {showInstructions && (
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
            opacity: instrVisible ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.99), rgba(10,4,22,0.99))",
              border: "1px solid rgba(192,132,252,0.2)",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
              transform: instrVisible ? "scale(1)" : "scale(0.96)",
              transition: "transform 0.35s ease",
              boxShadow: "0 0 60px rgba(192,84,252,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>✦</div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.3rem",
                fontWeight: 300,
                color: "#f8d4ef",
                marginBottom: "0.4rem",
              }}
            >
              Nuestra historia
            </h2>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.78rem",
                color: "rgba(200,180,255,0.4)",
                fontStyle: "italic",
                marginBottom: "1.5rem",
              }}
            >
              cómo funciona
            </p>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(192,132,252,0.3), transparent)",
                marginBottom: "1.4rem",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                marginBottom: "1.8rem",
                textAlign: "left",
              }}
            >
              {[
                "✦  Los momentos se desbloquean uno a uno",
                "🔒  Toca un momento para abrirlo y ver la foto y el mensaje",
                "⬇️  Al abrir uno, se desbloquea el siguiente",
                "♡  Ve descubriendo nuestra historia poco a poco",
              ].map((tip) => (
                <p
                  key={tip}
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.82rem",
                    color: "rgba(210,190,255,0.65)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {tip}
                </p>
              ))}
            </div>
            <button
              onClick={closeInstructions}
              style={{
                width: "100%",
                padding: "0.85rem",
                background:
                  "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(255,107,157,0.1))",
                border: "1px solid rgba(192,132,252,0.35)",
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              empezar ✦
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "5rem 1.5rem 3rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "1.5rem",
            opacity: 0.5,
          }}
        >
          <div
            style={{
              height: "1px",
              width: "50px",
              background: "linear-gradient(to right, transparent, #c084fc)",
            }}
          />
          <span style={{ fontSize: "16px", color: "#c084fc" }}>✦</span>
          <div
            style={{
              height: "1px",
              width: "50px",
              background: "linear-gradient(to left, transparent, #c084fc)",
            }}
          />
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            fontWeight: 300,
            color: "#f8d4ef",
            marginBottom: "0.5rem",
          }}
        >
          Nuestra historia
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.85rem",
            color: "rgba(200,180,255,0.4)",
            fontStyle: "italic",
          }}
        >
          toca cada momento para abrirlo ✦ se van desbloqueando uno a uno
        </p>
      </div>

      {/* Timeline */}
      <div
        style={{
          position: "relative",
          maxWidth: "680px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "1px",
            background:
              "linear-gradient(to bottom, transparent, rgba(192,132,252,0.25) 5%, rgba(255,107,157,0.2) 50%, rgba(192,132,252,0.25) 95%, transparent)",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {MOMENTS.map((moment, idx) => {
          const locked = !unlocked.has(moment.id);
          const isLeft = moment.side === "left";
          return (
            <div
              key={moment.id}
              style={{
                display: "flex",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                marginBottom: "2.5rem",
                position: "relative",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.7s ease ${idx * 0.08}s, transform 0.7s ease ${idx * 0.08}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "1.4rem",
                  width: locked ? "8px" : "12px",
                  height: locked ? "8px" : "12px",
                  borderRadius: "50%",
                  background: locked
                    ? "rgba(80,60,100,0.4)"
                    : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                  border: `1px solid ${locked ? "rgba(80,60,100,0.2)" : "rgba(255,107,157,0.5)"}`,
                  boxShadow: locked ? "none" : "0 0 10px rgba(255,107,157,0.4)",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                }}
              />

              <button
                onClick={() => openMoment(moment)}
                style={{
                  width: "calc(50% - 2.5rem)",
                  padding: "1rem",
                  background: locked
                    ? "rgba(8,4,16,0.5)"
                    : "linear-gradient(135deg, rgba(20,8,40,0.92), rgba(12,5,25,0.92))",
                  border: `1px solid ${locked ? "rgba(80,60,100,0.15)" : "rgba(255,107,157,0.18)"}`,
                  borderRadius: "6px",
                  cursor: locked ? "not-allowed" : "pointer",
                  textAlign: isLeft ? "right" : "left",
                  transition: "all 0.3s ease",
                  boxShadow: locked
                    ? "none"
                    : "0 4px 20px rgba(192,84,252,0.06)",
                }}
              >
                {locked ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isLeft ? "flex-end" : "flex-start",
                      gap: "0.3rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem", opacity: 0.25 }}>🔒</span>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.7rem",
                        color: "rgba(120,100,140,0.35)",
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      abre el anterior primero
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: "100%",
                        height: "90px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginBottom: "0.7rem",
                        border: "1px solid rgba(255,107,157,0.12)",
                      }}
                    >
                      <img
                        src={moment.image}
                        alt={moment.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(0.88)",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.68rem",
                        color: "rgba(255,107,157,0.45)",
                        margin: "0 0 0.2rem",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {moment.date}
                    </p>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.88rem",
                        color: "#f0e8ff",
                        margin: 0,
                      }}
                    >
                      {moment.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.68rem",
                        color: "rgba(192,132,252,0.4)",
                        margin: "0.3rem 0 0",
                        fontStyle: "italic",
                      }}
                    >
                      toca para abrir ✦
                    </p>
                  </>
                )}
              </button>
            </div>
          );
        })}

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
            padding: "1rem",
            opacity: unlocked.size > MOMENTS.length ? 1 : 0.15,
            transition: "opacity 1s ease",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>♡</div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(255,107,157,0.5)",
              fontStyle: "italic",
            }}
          >
            y así llegamos hasta aquí…
          </p>
        </div>
      </div>

      {/* Modal — imagen completa sin cortar */}
      {selected && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(4,2,8,0.93)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            opacity: modalVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.99), rgba(10,4,22,0.99))",
              border: "1px solid rgba(255,107,157,0.2)",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "100%",
              overflow: "hidden",
              transform: modalVisible
                ? "translateY(0) scale(1)"
                : "translateY(16px) scale(0.97)",
              transition: "all 0.3s ease",
              boxShadow: "0 0 60px rgba(192,84,252,0.12)",
            }}
          >
            {/* Imagen completa sin recortar */}
            <div
              style={{
                width: "100%",
                background: "#080412",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.8rem 0.8rem 0",
              }}
            >
              <img
                src={selected.image}
                alt={selected.title}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "4px",
                  display: "block",
                }}
              />
            </div>

            <div style={{ padding: "1.2rem 1.5rem 1.4rem" }}>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.72rem",
                  color: "rgba(255,107,157,0.5)",
                  margin: "0 0 0.3rem",
                  letterSpacing: "0.1em",
                }}
              >
                {selected.date}
              </p>
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "1.15rem",
                  color: "#f8d4ef",
                  fontWeight: 300,
                  margin: "0 0 0.8rem",
                }}
              >
                {selected.title}
              </h2>
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, rgba(255,107,157,0.3), transparent)",
                  marginBottom: "0.8rem",
                }}
              />
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.92rem",
                  color: "rgba(220,200,255,0.82)",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                  margin: "0 0 1.2rem",
                }}
              >
                {selected.message}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "rgba(255,107,157,0.3)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  ✦ un momento nuestro
                </span>
                <button
                  onClick={closeModal}
                  style={{
                    background: "none",
                    border: "1px solid rgba(192,132,252,0.2)",
                    borderRadius: "2px",
                    color: "rgba(200,170,255,0.4)",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.78rem",
                    padding: "0.3rem 0.8rem",
                    cursor: "pointer",
                    letterSpacing: "0.1em",
                  }}
                >
                  cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
