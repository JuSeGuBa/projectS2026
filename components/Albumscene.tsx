"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Page {
  id: number;
  image: string;
  date: string;
  message: string;
  isVideo?: boolean;
}

// ── PERSONALIZA AQUÍ ──────────────────────────────────────────────────────────
const PAGES: Page[] = [
  {
    id: 1,
    image: "/photos/album/page-01.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 2,
    image: "/photos/album/page-02.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 3,
    image: "/photos/album/page-03.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 4,
    image: "/photos/album/page-04.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 5,
    image: "/photos/album/page-05.png",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 6,
    image: "/photos/album/page-06.png",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 7,
    image: "/photos/album/page-07.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 8,
    image: "/photos/album/page-08.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 9,
    image: "/photos/album/page-09.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 10,
    image: "/photos/album/page-10.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 11,
    image: "/photos/album/page-11.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 12,
    image: "/photos/album/page-12.mp4",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de este video.",
    isVideo: true,
  },
  {
    id: 13,
    image: "/photos/album/page-13.jpeg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 14,
    image: "/photos/album/page-14.jpeg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 15,
    image: "/photos/album/page-15.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 16,
    image: "/photos/album/page-16.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 17,
    image: "/photos/album/page-17.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 18,
    image: "/photos/album/page-18.jpeg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 19,
    image: "/photos/album/page-19.jpeg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 20,
    image: "/photos/album/page-20.jpeg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

// Last blank page is added automatically below

export default function AlbumScene() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introVisible, setIntroVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const allPages = [
    ...PAGES,
    { id: 99, image: "", date: "", message: "", isVideo: false },
  ];
  const isLastPage = current === allPages.length - 1;

  useEffect(() => {
    setTimeout(() => setIntroVisible(true), 60);
  }, []);

  const closeIntro = () => {
    setIntroVisible(false);
    setTimeout(() => {
      setShowIntro(false);
      setVisible(true);
    }, 350);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos"), 500);
  };

  const navigate = (dir: "next" | "prev") => {
    if (animating) return;
    if (dir === "next" && current >= allPages.length - 1) return;
    if (dir === "prev" && current <= 0) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent((c) => (dir === "next" ? c + 1 : c - 1));
      setAnimating(false);
    }, 380);
  };

  const onTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? "next" : "prev");
    setTouchStart(null);
  };

  const page = allPages[current];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 30%, #0d0415 0%, #040208 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
          zIndex: 30,
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

      <div
        style={{
          position: "fixed",
          top: "1.2rem",
          right: "1.5rem",
          zIndex: 30,
          fontFamily: "Georgia, serif",
          fontSize: "0.75rem",
          color: "rgba(200,180,255,0.35)",
          letterSpacing: "0.1em",
        }}
      >
        {isLastPage ? "fin" : `${current + 1} / ${PAGES.length}`}
      </div>

      {/* Intro modal */}
      {showIntro && (
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
            opacity: introVisible ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(22,10,42,0.99), rgba(12,6,24,0.99))",
              border: "1px solid rgba(255,107,157,0.2)",
              borderRadius: "8px",
              padding: "2rem 2rem 1.8rem",
              maxWidth: "360px",
              width: "100%",
              textAlign: "center",
              transform: introVisible ? "scale(1)" : "scale(0.96)",
              transition: "transform 0.35s ease",
              boxShadow: "0 0 60px rgba(192,84,252,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📖</div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: 300,
                color: "#f8d4ef",
                marginBottom: "1rem",
              }}
            >
              Nuestro álbum
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
                fontSize: "0.92rem",
                color: "rgba(220,200,255,0.75)",
                lineHeight: 1.75,
                fontStyle: "italic",
                marginBottom: "1.5rem",
              }}
            >
              El orden de estas fotos no sigue nuestra historia. Son simplemente
              momentos importantes que quiero que recuerdes. Cada uno tiene un
              pedazo de lo nuestro. 💕
            </p>
            <button
              onClick={closeIntro}
              style={{
                width: "100%",
                padding: "0.8rem",
                background:
                  "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
                border: "1px solid rgba(255,107,157,0.35)",
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              abrir el álbum ♡
            </button>
          </div>
        </div>
      )}

      {/* Book */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          width: "100%",
          maxWidth: "420px",
          perspective: "1200px",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Book wrapper with 3D shadow */}
        <div style={{ position: "relative" }}>
          {/* Book spine shadow */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "4px",
              bottom: "4px",
              width: "12px",
              background:
                "linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
              borderRadius: "3px 0 0 3px",
              zIndex: 0,
            }}
          />
          {/* Page stack illusion (behind) */}
          {[3, 2, 1].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                right: -i * 2,
                top: i * 1,
                left: 0,
                bottom: -i * 1,
                background: "rgba(240,230,255,0.04)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: "4px 6px 6px 4px",
                zIndex: 0,
              }}
            />
          ))}

          {/* Main page with flip animation */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              background:
                "linear-gradient(135deg, rgba(24,12,44,0.98) 0%, rgba(14,7,26,0.98) 100%)",
              border: "1px solid rgba(255,107,157,0.15)",
              borderRadius: "4px 8px 8px 4px",
              overflow: "hidden",
              boxShadow:
                "4px 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(192,84,252,0.06), inset -2px 0 8px rgba(0,0,0,0.3)",
              opacity: animating ? 0 : 1,
              transform: animating
                ? direction === "next"
                  ? "rotateY(-8deg) translateX(-12px) scale(0.97)"
                  : "rotateY(8deg) translateX(12px) scale(0.97)"
                : "rotateY(0deg) translateX(0) scale(1)",
              transition: "opacity 0.32s ease, transform 0.32s ease",
              transformOrigin:
                direction === "next" ? "left center" : "right center",
            }}
          >
            {/* Page number top */}
            <div
              style={{
                position: "absolute",
                top: "0.6rem",
                right: "0.8rem",
                zIndex: 2,
                fontFamily: "Georgia, serif",
                fontSize: "0.6rem",
                color: "rgba(255,180,210,0.25)",
                letterSpacing: "0.1em",
              }}
            >
              {isLastPage ? "" : current + 1}
            </div>

            {isLastPage ? (
              /* ── LAST PAGE: blank with message ── */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "420px",
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "rgba(255,107,157,0.2)",
                    marginBottom: "2.5rem",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
                    fontWeight: 300,
                    color: "rgba(240,220,255,0.6)",
                    lineHeight: 1.9,
                    fontStyle: "italic",
                    letterSpacing: "0.04em",
                    maxWidth: "280px",
                  }}
                >
                  Continuará…
                </p>
                <p
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "0.85rem",
                    color: "rgba(255,107,157,0.3)",
                    fontStyle: "italic",
                    marginTop: "1.5rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  seguiremos llenando estas páginas juntos
                </p>
                <div
                  style={{
                    marginTop: "2.5rem",
                    fontSize: "1.2rem",
                    opacity: 0.3,
                  }}
                >
                  ♡
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "rgba(255,107,157,0.2)",
                    marginTop: "2.5rem",
                  }}
                />
              </div>
            ) : (
              /* ── NORMAL PAGE ── */
              <>
                {/* Media area */}
                <div
                  onClick={() => !page.isVideo && setFullscreen(true)}
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    overflow: "hidden",
                    position: "relative",
                    cursor: page.isVideo ? "default" : "zoom-in",
                  }}
                >
                  {page.isVideo ? (
                    <video
                      src={page.image}
                      controls
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <img
                      src={page.image}
                      alt={`página ${current + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent 55%, rgba(14,7,26,0.75))",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.8rem",
                      left: "1rem",
                      fontFamily: "Georgia, serif",
                      fontSize: "0.68rem",
                      color: "rgba(255,180,210,0.55)",
                      letterSpacing: "0.1em",
                      pointerEvents: "none",
                    }}
                  >
                    {page.date}
                  </div>
                  {!page.isVideo && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.7rem",
                        right: "0.8rem",
                        fontSize: "0.7rem",
                        color: "rgba(255,180,210,0.3)",
                        pointerEvents: "none",
                      }}
                    >
                      🔍
                    </div>
                  )}
                </div>

                {/* Text */}
                <div style={{ padding: "1.2rem 1.5rem 1.6rem" }}>
                  {/* Decorative line */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "0.9rem",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(to right, rgba(255,107,157,0.2), transparent)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.5rem",
                        color: "rgba(255,107,157,0.3)",
                      }}
                    >
                      ✦
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "clamp(0.88rem, 2.4vw, 0.98rem)",
                      color: "rgba(220,200,255,0.8)",
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    {page.message}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.2rem",
            marginTop: "1.4rem",
          }}
        >
          <button
            onClick={() => navigate("prev")}
            disabled={current === 0 || animating}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background:
                current === 0
                  ? "rgba(255,107,157,0.03)"
                  : "rgba(255,107,157,0.08)",
              border: `1px solid rgba(255,107,157,${current === 0 ? 0.08 : 0.22})`,
              color:
                current === 0
                  ? "rgba(255,107,157,0.18)"
                  : "rgba(255,150,190,0.7)",
              fontSize: "1rem",
              cursor: current === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            ←
          </button>

          {/* Dots — max 20 visible */}
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              maxWidth: "200px",
              overflow: "hidden",
            }}
          >
            {allPages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (animating || i === current) return;
                  setDirection(i > current ? "next" : "prev");
                  setAnimating(true);
                  setTimeout(() => {
                    setCurrent(i);
                    setAnimating(false);
                  }, 380);
                }}
                style={{
                  flexShrink: 0,
                  width: i === current ? "18px" : "5px",
                  height: "5px",
                  borderRadius: "3px",
                  background:
                    i === current
                      ? "linear-gradient(to right, #ff6b9d, #c084fc)"
                      : i === allPages.length - 1
                        ? "rgba(255,107,157,0.12)"
                        : "rgba(255,107,157,0.18)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => navigate("next")}
            disabled={current === allPages.length - 1 || animating}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background:
                current === allPages.length - 1
                  ? "rgba(255,107,157,0.03)"
                  : "rgba(255,107,157,0.08)",
              border: `1px solid rgba(255,107,157,${current === allPages.length - 1 ? 0.08 : 0.22})`,
              color:
                current === allPages.length - 1
                  ? "rgba(255,107,157,0.18)"
                  : "rgba(255,150,190,0.7)",
              fontSize: "1rem",
              cursor:
                current === allPages.length - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            →
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            fontFamily: "Georgia, serif",
            fontSize: "0.62rem",
            color: "rgba(200,180,255,0.15)",
            marginTop: "0.8rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          desliza o usa las flechas
        </p>
      </div>

      {/* Fullscreen photo viewer */}
      {fullscreen && !page.isVideo && (
        <div
          onClick={() => setFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(2,1,6,0.97)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            cursor: "zoom-out",
          }}
        >
          <img
            src={page.image}
            alt="foto completa"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 0 60px rgba(0,0,0,0.8)",
            }}
          />
          <button
            onClick={() => setFullscreen(false)}
            style={{
              position: "fixed",
              top: "1.2rem",
              right: "1.2rem",
              background: "rgba(20,10,35,0.8)",
              border: "1px solid rgba(192,132,252,0.2)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              color: "rgba(220,200,255,0.6)",
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
