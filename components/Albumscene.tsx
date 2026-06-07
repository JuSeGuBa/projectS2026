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

// Pages: 0 = cover, 1..N = content, N+1 = last blank
const COVER = -1;
const LAST = PAGES.length;

export default function AlbumScene() {
  const router = useRouter();
  const [page, setPage] = useState(COVER);
  const [turning, setTurning] = useState(false);
  const [turnDir, setTurnDir] = useState<"fwd" | "bwd">("fwd");
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introVis, setIntroVis] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setIntroVis(true), 60);
  }, []);

  const closeIntro = () => {
    setIntroVis(false);
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setVisible(true), 60);
    }, 350);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos"), 500);
  };

  const turnPage = (dir: "fwd" | "bwd") => {
    if (turning) return;
    if (dir === "fwd" && page >= LAST) return;
    if (dir === "bwd" && page <= COVER) return;
    setTurnDir(dir);
    setTurning(true);
    setTimeout(() => {
      setPage((p) => (dir === "fwd" ? p + 1 : p - 1));
      setTurning(false);
    }, 600);
  };

  const onTouchStart = (e: React.TouchEvent) => setTouchX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return;
    const d = touchX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 45) turnPage(d > 0 ? "fwd" : "bwd");
    setTouchX(null);
  };

  const isCover = page === COVER;
  const isLast = page === LAST;
  const pageData = !isCover && !isLast ? PAGES[page] : null;

  // Paper color cycling — warm cream tones
  const paperTones = [
    "#fdf8f0",
    "#fef9f2",
    "#fdf7ee",
    "#fefaf3",
    "#fdf8f1",
    "#fef8ef",
    "#fdf9f2",
    "#fefaf4",
    "#fdf7ed",
    "#fef9f1",
  ];
  const tone = isCover ? "#2a1a0e" : paperTones[page % paperTones.length];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=IM+Fell+English:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .book-wrap {
          perspective: 2000px;
        }

        /* ── PAGE TURN ── */
        .page-turner {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform-origin: left center;
          z-index: 20;
          pointer-events: none;
          border-radius: 4px 12px 12px 4px;
        }
        .turn-fwd {
          animation: turnFwd 0.62s cubic-bezier(0.55,0,0.45,1) forwards;
        }
        .turn-bwd {
          animation: turnBwd 0.62s cubic-bezier(0.55,0,0.45,1) forwards;
        }
        @keyframes turnFwd {
          0%   { transform: rotateY(0deg);    }
          40%  { box-shadow: -12px 0 30px rgba(0,0,0,0.45); }
          100% { transform: rotateY(-180deg); box-shadow: none; }
        }
        @keyframes turnBwd {
          0%   { transform: rotateY(-180deg); }
          40%  { box-shadow: 12px 0 30px rgba(0,0,0,0.45); }
          100% { transform: rotateY(0deg);    box-shadow: none; }
        }

        /* ── PAPER LINES ── */
        .lined-paper::after {
          content: '';
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          background: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,160,120,0.18) 31px, rgba(180,160,120,0.18) 32px
          );
          pointer-events: none;
        }

        /* ── COVER TEXTURE ── */
        .book-cover {
          background:
            radial-gradient(ellipse at 30% 20%, rgba(120,60,20,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(80,30,10,0.3) 0%, transparent 50%),
            linear-gradient(135deg, #3d1f0a 0%, #2a1206 40%, #1e0d04 70%, #2e1608 100%);
        }

        /* ── SPINE ── */
        .book-spine {
          background: linear-gradient(to right,
            #1a0905 0%, #3d1f0a 20%, #4a2510 45%,
            #3d1f0a 70%, #1a0905 100%
          );
          box-shadow: inset -4px 0 8px rgba(0,0,0,0.5);
        }

        /* ── FOLD SHADOW on page ── */
        .fold-shadow {
          position: absolute;
          left: 0; top: 0; bottom: 0; width: 22px;
          background: linear-gradient(to right,
            rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 60%, transparent 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* ── PAGE EDGES ── */
        .page-edges {
          position: absolute;
          right: -5px; top: 2px; bottom: 2px; width: 6px;
          background: repeating-linear-gradient(
            to bottom,
            #e8dcc8, #e8dcc8 1px,
            #f0e8d8 1px, #f0e8d8 3px
          );
          border-radius: 0 2px 2px 0;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 40%, #2a1505 0%, #0d0604 50%, #050303 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          opacity: leaving ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Back */}
        <button
          onClick={goBack}
          style={{
            position: "fixed",
            top: "1.2rem",
            left: "1.2rem",
            zIndex: 50,
            background: "rgba(30,15,5,0.85)",
            border: "1px solid rgba(180,140,80,0.25)",
            borderRadius: "2px",
            color: "rgba(220,190,140,0.6)",
            padding: "0.45rem 0.9rem",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}
        >
          ← volver
        </button>

        {/* Counter */}
        <div
          style={{
            position: "fixed",
            top: "1.2rem",
            right: "1.5rem",
            zIndex: 50,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "0.72rem",
            color: "rgba(200,170,110,0.35)",
            letterSpacing: "0.12em",
          }}
        >
          {isCover ? "portada" : isLast ? "fin ♡" : `${page} / ${PAGES.length}`}
        </div>

        {/* Intro modal */}
        {showIntro && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(5,3,2,0.96)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              opacity: introVis ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #2a1508, #1a0d05)",
                border: "1px solid rgba(180,140,80,0.25)",
                borderRadius: "8px",
                padding: "2.2rem 2rem 2rem",
                maxWidth: "340px",
                width: "100%",
                textAlign: "center",
                transform: introVis ? "scale(1)" : "scale(0.96)",
                transition: "transform 0.4s ease",
                boxShadow:
                  "0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(180,120,40,0.08)",
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>📖</div>
              <h2
                style={{
                  fontFamily:
                    "'IM Fell English', 'Playfair Display', Georgia, serif",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "#e8d5a0",
                  marginBottom: "1rem",
                  letterSpacing: "0.04em",
                }}
              >
                Nuestro Álbum
              </h2>
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, rgba(180,140,80,0.4), transparent)",
                  marginBottom: "1.1rem",
                }}
              />
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "0.92rem",
                  color: "rgba(220,195,145,0.7)",
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  marginBottom: "1.6rem",
                }}
              >
                El orden de estas fotos no sigue nuestra historia — son
                simplemente los momentos que guardo con más cariño. Cada página
                tiene un pedazo de lo que somos. 💕
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.72rem",
                  color: "rgba(200,170,100,0.3)",
                  marginBottom: "1.5rem",
                  letterSpacing: "0.08em",
                }}
              >
                desliza o usa las flechas para pasar las páginas
              </p>
              <button
                onClick={closeIntro}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background:
                    "linear-gradient(135deg, rgba(180,120,40,0.2), rgba(140,80,20,0.15))",
                  border: "1px solid rgba(180,140,80,0.35)",
                  borderRadius: "3px",
                  color: "#e8d5a0",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                abrir el álbum ♡
              </button>
            </div>
          </div>
        )}

        {/* ── BOOK ── */}
        <div
          className="book-wrap"
          style={{
            width: "100%",
            maxWidth: "400px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ position: "relative" }}>
            {/* Page stack (right edge illusion) */}
            <div className="page-edges" />
            {[4, 3, 2, 1].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  right: -i * 1.2,
                  top: i * 0.4,
                  bottom: i * 0.4,
                  width: "100%",
                  background: paperTones[(page + i) % paperTones.length],
                  borderRadius: "4px 12px 12px 4px",
                  boxShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                  zIndex: 0,
                }}
              />
            ))}

            {/* ── CURRENT PAGE ── */}
            <div
              style={{
                position: "relative",
                zIndex: 5,
                background: isCover ? undefined : tone,
                borderRadius: "4px 12px 12px 4px",
                overflow: "hidden",
                boxShadow:
                  "4px 6px 30px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              {/* Spine */}
              <div
                className="book-spine"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "18px",
                  zIndex: 10,
                  borderRadius: "4px 0 0 4px",
                }}
              />

              {/* Fold shadow */}
              <div className="fold-shadow" style={{ left: "18px" }} />

              {/* Page number */}
              {!isCover && !isLast && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "1rem",
                    zIndex: 10,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.6rem",
                    color: "rgba(120,90,50,0.4)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {page}
                </div>
              )}

              {/* ── COVER ── */}
              {isCover && (
                <div
                  className="book-cover"
                  style={{
                    minHeight: "480px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3rem 2rem",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {/* Decorative border */}
                  <div
                    style={{
                      position: "absolute",
                      inset: "12px",
                      border: "1px solid rgba(180,140,60,0.2)",
                      borderRadius: "8px",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: "18px",
                      border: "1px solid rgba(180,140,60,0.1)",
                      borderRadius: "6px",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Corner ornaments */}
                  {["0,0", "0,auto", "auto,0", "auto,auto"].map((pos, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: i < 2 ? "14px" : "auto",
                        bottom: i >= 2 ? "14px" : "auto",
                        left: i % 2 === 0 ? "14px" : "auto",
                        right: i % 2 === 1 ? "14px" : "auto",
                        width: "20px",
                        height: "20px",
                        borderTop:
                          i < 2 ? "1px solid rgba(180,140,60,0.35)" : "none",
                        borderBottom:
                          i >= 2 ? "1px solid rgba(180,140,60,0.35)" : "none",
                        borderLeft:
                          i % 2 === 0
                            ? "1px solid rgba(180,140,60,0.35)"
                            : "none",
                        borderRight:
                          i % 2 === 1
                            ? "1px solid rgba(180,140,60,0.35)"
                            : "none",
                      }}
                    />
                  ))}

                  <div
                    style={{
                      fontSize: "1.8rem",
                      marginBottom: "1.8rem",
                      filter: "drop-shadow(0 0 12px rgba(200,160,60,0.4))",
                    }}
                  >
                    ♡
                  </div>

                  <h1
                    style={{
                      fontFamily:
                        "'IM Fell English', 'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                      fontWeight: 400,
                      color: "#e8d5a0",
                      letterSpacing: "0.06em",
                      lineHeight: 1.35,
                      marginBottom: "1rem",
                      textShadow: "0 0 30px rgba(200,160,60,0.3)",
                    }}
                  >
                    Nuestro Álbum
                  </h1>

                  <div
                    style={{
                      width: "80px",
                      height: "1px",
                      background:
                        "linear-gradient(to right, transparent, rgba(180,140,60,0.5), transparent)",
                      marginBottom: "1rem",
                    }}
                  />

                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.9rem",
                      fontStyle: "italic",
                      color: "rgba(200,170,110,0.55)",
                      lineHeight: 1.8,
                      letterSpacing: "0.04em",
                      maxWidth: "240px",
                    }}
                  >
                    "Porque cada momento contigo merece ser guardado para
                    siempre."
                  </p>

                  <div
                    style={{
                      width: "60px",
                      height: "1px",
                      background:
                        "linear-gradient(to right, transparent, rgba(180,140,60,0.3), transparent)",
                      margin: "1.5rem 0",
                    }}
                  />

                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.7rem",
                      color: "rgba(180,140,80,0.3)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    toca → para abrir
                  </p>
                </div>
              )}

              {/* ── LAST PAGE ── */}
              {isLast && (
                <div
                  className="lined-paper"
                  style={{
                    minHeight: "460px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3rem 2.5rem",
                    textAlign: "center",
                    background: "#fdf7ec",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "16px",
                      border: "1px solid rgba(160,120,60,0.12)",
                      borderRadius: "4px",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(160,120,60,0.2)",
                      letterSpacing: "0.4em",
                      marginBottom: "2.5rem",
                    }}
                  >
                    ✦ ✦ ✦
                  </div>
                  <p
                    style={{
                      fontFamily:
                        "'IM Fell English', 'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: "rgba(100,70,30,0.55)",
                      lineHeight: 1.9,
                      letterSpacing: "0.03em",
                      maxWidth: "250px",
                    }}
                  >
                    Continuará…
                  </p>
                  <div
                    style={{
                      width: "50px",
                      height: "1px",
                      background: "rgba(160,120,60,0.2)",
                      margin: "2rem auto",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.88rem",
                      fontStyle: "italic",
                      color: "rgba(120,85,40,0.38)",
                      letterSpacing: "0.04em",
                      lineHeight: 1.85,
                      maxWidth: "230px",
                    }}
                  >
                    seguiremos llenando estas páginas juntos, un momento a la
                    vez.
                  </p>
                  <div
                    style={{
                      marginTop: "2.5rem",
                      fontSize: "1.3rem",
                      color: "rgba(160,100,50,0.25)",
                    }}
                  >
                    ♡
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(160,120,60,0.15)",
                      letterSpacing: "0.4em",
                      marginTop: "2.5rem",
                    }}
                  >
                    ✦ ✦ ✦
                  </div>
                </div>
              )}

              {/* ── CONTENT PAGE ── */}
              {pageData && (
                <div
                  className="lined-paper"
                  style={{ position: "relative", background: tone }}
                >
                  {/* Photo */}
                  <div
                    onClick={() => !pageData.isVideo && setFullscreen(true)}
                    style={{
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      position: "relative",
                      cursor: pageData.isVideo ? "default" : "zoom-in",
                      marginLeft: "18px",
                      width: "calc(100% - 18px)",
                    }}
                  >
                    {pageData.isVideo ? (
                      <video
                        src={pageData.image}
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
                        src={pageData.image}
                        alt={`página ${page}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          filter: "sepia(0.08) contrast(1.02)",
                        }}
                      />
                    )}
                    {/* Vignette */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.18) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Photo border */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "6px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        pointerEvents: "none",
                      }}
                    />
                    {!pageData.isVideo && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0.5rem",
                          right: "0.6rem",
                          fontSize: "0.6rem",
                          color: "rgba(255,255,255,0.3)",
                          pointerEvents: "none",
                        }}
                      >
                        🔍
                      </div>
                    )}
                  </div>

                  {/* Caption area */}
                  <div
                    style={{
                      padding: "1rem 1.4rem 1.6rem 2rem",
                      position: "relative",
                    }}
                  >
                    {/* Date */}
                    <p
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "0.68rem",
                        color: "rgba(120,85,40,0.5)",
                        letterSpacing: "0.12em",
                        marginBottom: "0.5rem",
                        fontStyle: "italic",
                      }}
                    >
                      {pageData.date}
                    </p>

                    {/* Divider */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "0.7rem",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "1px",
                          background: "rgba(140,100,50,0.25)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.4rem",
                          color: "rgba(140,100,50,0.3)",
                        }}
                      >
                        ✦
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: "1px",
                          background: "rgba(140,100,50,0.12)",
                        }}
                      />
                    </div>

                    {/* Message */}
                    <p
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(0.86rem, 2.3vw, 0.96rem)",
                        color: "rgba(80,50,20,0.78)",
                        lineHeight: 1.9,
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      {pageData.message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── FLIP ANIMATION OVERLAY ── */}
            {turning && (
              <div
                className={`page-turner turn-${turnDir}`}
                style={{
                  background:
                    turnDir === "fwd"
                      ? tone
                      : page - 1 >= 0 && page - 1 < PAGES.length
                        ? paperTones[(page - 1) % paperTones.length]
                        : "#2a1206",
                  boxShadow: "inset -3px 0 10px rgba(0,0,0,0.2)",
                }}
              >
                {/* The turning page shows a subtle ruled texture */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "repeating-linear-gradient(transparent, transparent 31px, rgba(180,150,100,0.1) 31px, rgba(180,150,100,0.1) 32px)",
                    borderRadius: "4px 12px 12px 4px",
                  }}
                />
                {/* Shadow on the fold */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "40%",
                    background:
                      "linear-gradient(to left, rgba(0,0,0,0.15), transparent)",
                    borderRadius: "0 12px 12px 0",
                  }}
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.4rem",
              marginTop: "1.5rem",
            }}
          >
            <button
              onClick={() => turnPage("bwd")}
              disabled={page <= COVER || turning}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background:
                  page <= COVER
                    ? "rgba(180,140,60,0.03)"
                    : "rgba(180,140,60,0.1)",
                border: `1px solid rgba(180,140,60,${page <= COVER ? 0.08 : 0.25})`,
                color:
                  page <= COVER
                    ? "rgba(180,140,60,0.15)"
                    : "rgba(200,160,80,0.7)",
                fontSize: "1rem",
                cursor: page <= COVER ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              ←
            </button>

            {/* Dots */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                maxWidth: "160px",
                overflow: "hidden",
              }}
            >
              {Array.from({ length: PAGES.length + 2 }).map((_, i) => {
                const idx = i - 1; // -1=cover, 0..N-1=pages, N=last
                const active = idx === page;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (turning || idx === page) return;
                      setTurnDir(idx > page ? "fwd" : "bwd");
                      setTurning(true);
                      setTimeout(() => {
                        setPage(idx);
                        setTurning(false);
                      }, 600);
                    }}
                    style={{
                      flexShrink: 0,
                      width: active ? "16px" : "5px",
                      height: "5px",
                      borderRadius: "3px",
                      background: active
                        ? "linear-gradient(to right, #c8960a, #e8b830)"
                        : "rgba(180,140,60,0.18)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s ease",
                    }}
                  />
                );
              })}
            </div>

            <button
              onClick={() => turnPage("fwd")}
              disabled={page >= LAST || turning}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background:
                  page >= LAST
                    ? "rgba(180,140,60,0.03)"
                    : "rgba(180,140,60,0.1)",
                border: `1px solid rgba(180,140,60,${page >= LAST ? 0.08 : 0.25})`,
                color:
                  page >= LAST
                    ? "rgba(180,140,60,0.15)"
                    : "rgba(200,160,80,0.7)",
                fontSize: "1rem",
                cursor: page >= LAST ? "not-allowed" : "pointer",
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
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "0.6rem",
              color: "rgba(180,140,60,0.15)",
              marginTop: "0.8rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            desliza o usa las flechas ♡
          </p>
        </div>

        {/* Fullscreen */}
        {fullscreen && pageData && !pageData.isVideo && (
          <div
            onClick={() => setFullscreen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(2,1,0,0.97)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              cursor: "zoom-out",
            }}
          >
            <img
              src={pageData.image}
              alt="foto completa"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "4px",
                boxShadow: "0 0 60px rgba(0,0,0,0.9)",
              }}
            />
            <button
              onClick={() => setFullscreen(false)}
              style={{
                position: "fixed",
                top: "1.2rem",
                right: "1.2rem",
                background: "rgba(30,15,5,0.9)",
                border: "1px solid rgba(180,140,60,0.2)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                color: "rgba(200,170,100,0.7)",
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
    </>
  );
}
