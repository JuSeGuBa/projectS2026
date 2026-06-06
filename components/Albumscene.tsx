"use client";

import { useState, useEffect } from "react";
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

export default function AlbumScene() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [leaving, setLeaving] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introVisible, setIntroVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [bookVisible, setBookVisible] = useState(false);

  const totalPages = PAGES.length + 1; // +1 for last blank page
  const isLastPage = current === totalPages - 1;
  const page = current < PAGES.length ? PAGES[current] : null;

  useEffect(() => {
    setTimeout(() => setIntroVisible(true), 60);
  }, []);

  const closeIntro = () => {
    setIntroVisible(false);
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setBookVisible(true), 50);
    }, 350);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos"), 500);
  };

  const flipPage = (dir: "next" | "prev") => {
    if (flipping) return;
    if (dir === "next" && current >= totalPages - 1) return;
    if (dir === "prev" && current <= 0) return;
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setCurrent((c) => (dir === "next" ? c + 1 : c - 1));
      setFlipping(false);
    }, 500);
  };

  const onTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) flipPage(diff > 0 ? "next" : "prev");
    setTouchStart(null);
  };

  return (
    <>
      {/* Inject CSS for 3D flip animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,300;1,400;1,300&display=swap');

        .book-scene {
          perspective: 1400px;
          perspective-origin: 50% 45%;
        }
        .book {
          position: relative;
          transform-style: preserve-3d;
        }
        .page-flip {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform-origin: left center;
          transition: transform 0.55s cubic-bezier(0.645, 0.045, 0.355, 1.000);
          pointer-events: none;
          z-index: 10;
        }
        .page-flip.flipping-next {
          animation: flipNext 0.55s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards;
        }
        .page-flip.flipping-prev {
          animation: flipPrev 0.55s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards;
        }
        @keyframes flipNext {
          0%   { transform: rotateY(0deg); box-shadow: 0 0 0 rgba(0,0,0,0); }
          30%  { box-shadow: -8px 0 20px rgba(0,0,0,0.4); }
          100% { transform: rotateY(-180deg); box-shadow: 0 0 0 rgba(0,0,0,0); }
        }
        @keyframes flipPrev {
          0%   { transform: rotateY(-180deg); }
          100% { transform: rotateY(0deg); }
        }
        .page-front, .page-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 3px 10px 10px 3px;
          overflow: hidden;
        }
        .page-back {
          transform: rotateY(180deg);
          background: #f5f0e8;
        }
        .paper-texture {
          background: linear-gradient(135deg, #1a0a30 0%, #0e0718 100%);
          position: relative;
        }
        .paper-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 28px,
            rgba(255,107,157,0.04) 28px,
            rgba(255,107,157,0.04) 29px
          );
          pointer-events: none;
        }
        .spine-gradient {
          background: linear-gradient(to right, 
            #1a0830 0%, #2a1245 15%, #1a0830 30%, #0e0718 50%
          );
        }
        .page-shadow-right {
          background: linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 100%);
          position: absolute; left: 0; top: 0; bottom: 0; width: 30px; pointer-events: none;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 30%, #120820 0%, #040208 70%)",
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
            zIndex: 50,
            background: "rgba(20,10,35,0.8)",
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
            zIndex: 50,
            fontFamily: "Georgia, serif",
            fontSize: "0.75rem",
            color: "rgba(200,180,255,0.35)",
            letterSpacing: "0.1em",
          }}
        >
          {isLastPage ? "fin ♡" : `${current + 1} / ${PAGES.length}`}
        </div>

        {/* Intro modal */}
        {showIntro && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(4,2,8,0.95)",
              backdropFilter: "blur(12px)",
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
                padding: "2.2rem 2rem 1.8rem",
                maxWidth: "360px",
                width: "100%",
                textAlign: "center",
                transform: introVisible ? "scale(1)" : "scale(0.96)",
                transition: "transform 0.35s ease",
                boxShadow: "0 0 60px rgba(192,84,252,0.12)",
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>📖</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.4rem",
                  fontWeight: 400,
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
                  marginBottom: "1.1rem",
                }}
              />
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "0.95rem",
                  color: "rgba(220,200,255,0.75)",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                  marginBottom: "1.6rem",
                }}
              >
                El orden de estas fotos no sigue nuestra historia. Son
                simplemente momentos importantes que quiero que recuerdes. Cada
                uno tiene un pedazo de lo nuestro. 💕
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(200,180,255,0.35)",
                  marginBottom: "1.4rem",
                  letterSpacing: "0.05em",
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
                    "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
                  border: "1px solid rgba(255,107,157,0.35)",
                  borderRadius: "3px",
                  color: "#f8d4ef",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
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
          className="book-scene"
          style={{
            width: "100%",
            maxWidth: "420px",
            opacity: bookVisible ? 1 : 0,
            transform: bookVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="book" style={{ width: "100%" }}>
            {/* Book body */}
            <div
              style={{
                position: "relative",
                width: "100%",
                borderRadius: "4px 10px 10px 4px",
                boxShadow:
                  "6px 10px 50px rgba(0,0,0,0.7), -2px 0 0 rgba(0,0,0,0.3), 0 0 40px rgba(192,84,252,0.07)",
              }}
            >
              {/* Spine */}
              <div
                className="spine-gradient"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "18px",
                  borderRadius: "4px 0 0 4px",
                  zIndex: 2,
                  boxShadow: "inset -3px 0 6px rgba(0,0,0,0.4)",
                }}
              />

              {/* Page stack edges (right side) */}
              {[6, 5, 4, 3, 2, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    right: -i * 1.5,
                    top: i * 0.5,
                    bottom: i * 0.5,
                    width: "100%",
                    background:
                      i % 2 === 0
                        ? "rgba(220,200,240,0.06)"
                        : "rgba(200,180,220,0.04)",
                    borderRadius: "4px 10px 10px 4px",
                    zIndex: 0,
                  }}
                />
              ))}

              {/* Current page */}
              <div
                className="paper-texture"
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: "4px 10px 10px 4px",
                  overflow: "hidden",
                  minHeight: isLastPage ? "420px" : undefined,
                }}
              >
                <div className="page-shadow-right" />

                {/* Page number */}
                <div
                  style={{
                    position: "absolute",
                    top: "0.7rem",
                    right: "1rem",
                    zIndex: 3,
                    fontFamily: "Georgia, serif",
                    fontSize: "0.6rem",
                    color: "rgba(255,180,210,0.2)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {isLastPage ? "" : current + 1}
                </div>

                {isLastPage ? (
                  /* Last blank page */
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "460px",
                      padding: "3rem 2.5rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,107,157,0.15)",
                        letterSpacing: "0.3em",
                        marginBottom: "3rem",
                        textTransform: "uppercase",
                      }}
                    >
                      ✦ ✦ ✦
                    </div>
                    <p
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
                        fontWeight: 300,
                        fontStyle: "italic",
                        color: "rgba(240,220,255,0.55)",
                        lineHeight: 1.9,
                        letterSpacing: "0.04em",
                        maxWidth: "260px",
                      }}
                    >
                      Continuará…
                    </p>
                    <div
                      style={{
                        width: "60px",
                        height: "1px",
                        background: "rgba(255,107,157,0.18)",
                        margin: "2rem auto",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "0.9rem",
                        fontStyle: "italic",
                        color: "rgba(255,107,157,0.28)",
                        letterSpacing: "0.06em",
                        lineHeight: 1.8,
                        maxWidth: "240px",
                      }}
                    >
                      seguiremos llenando estas páginas juntos
                    </p>
                    <div
                      style={{
                        marginTop: "2.5rem",
                        fontSize: "1.4rem",
                        opacity: 0.2,
                      }}
                    >
                      ♡
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,107,157,0.12)",
                        letterSpacing: "0.3em",
                        marginTop: "3rem",
                        textTransform: "uppercase",
                      }}
                    >
                      ✦ ✦ ✦
                    </div>
                  </div>
                ) : (
                  page && (
                    <>
                      {/* Photo */}
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
                        {/* Photo vignette */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 40%, transparent 55%, rgba(14,7,26,0.7) 100%)",
                            pointerEvents: "none",
                          }}
                        />
                        {/* Date */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0.8rem",
                            left: "1.2rem",
                            fontFamily: "Georgia, serif",
                            fontSize: "0.68rem",
                            color: "rgba(255,200,220,0.6)",
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
                              right: "0.9rem",
                              fontSize: "0.65rem",
                              color: "rgba(255,180,210,0.25)",
                              pointerEvents: "none",
                            }}
                          >
                            🔍
                          </div>
                        )}
                      </div>

                      {/* Text area — looks like lined paper */}
                      <div
                        style={{
                          padding: "1.3rem 1.6rem 1.8rem",
                          position: "relative",
                        }}
                      >
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
                              width: "20px",
                              height: "1px",
                              background: "rgba(255,107,157,0.25)",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.45rem",
                              color: "rgba(255,107,157,0.3)",
                            }}
                          >
                            ✦
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "1px",
                              background: "rgba(255,107,157,0.1)",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "clamp(0.88rem, 2.4vw, 1rem)",
                            color: "rgba(220,200,255,0.82)",
                            lineHeight: 1.85,
                            fontStyle: "italic",
                            margin: 0,
                          }}
                        >
                          {page.message}
                        </p>
                        {/* Bottom corner decoration */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0.6rem",
                            right: "1rem",
                            fontFamily: "Georgia, serif",
                            fontSize: "0.55rem",
                            color: "rgba(255,107,157,0.15)",
                            letterSpacing: "0.2em",
                          }}
                        >
                          ♡
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>

              {/* Flip animation overlay */}
              {flipping && (
                <div
                  className={`page-flip ${flipping ? `flipping-${flipDir}` : ""}`}
                  style={{
                    borderRadius: "4px 10px 10px 4px",
                    background:
                      flipDir === "next"
                        ? "linear-gradient(135deg, rgba(22,10,42,0.98), rgba(12,6,24,0.98))"
                        : "linear-gradient(135deg, rgba(18,8,35,0.98), rgba(10,5,20,0.98))",
                    boxShadow:
                      "inset -4px 0 12px rgba(0,0,0,0.3), 4px 0 20px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    className="page-front"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(22,10,42,0.98), rgba(12,6,24,0.98))",
                    }}
                  >
                    {/* Shows current page content while flipping */}
                    <div
                      style={{ width: "100%", height: "100%", opacity: 0.5 }}
                    />
                  </div>
                  <div
                    className="page-back"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(18,8,35,0.95), rgba(10,5,20,0.95))",
                    }}
                  >
                    <div
                      style={{ width: "100%", height: "100%", opacity: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              marginTop: "1.6rem",
            }}
          >
            <button
              onClick={() => flipPage("prev")}
              disabled={current === 0 || flipping}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background:
                  current === 0
                    ? "rgba(255,107,157,0.03)"
                    : "rgba(255,107,157,0.1)",
                border: `1px solid rgba(255,107,157,${current === 0 ? 0.08 : 0.28})`,
                color:
                  current === 0
                    ? "rgba(255,107,157,0.15)"
                    : "rgba(255,150,190,0.8)",
                fontSize: "1.1rem",
                cursor: current === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow:
                  current === 0 ? "none" : "0 0 12px rgba(255,107,157,0.1)",
              }}
            >
              ←
            </button>

            {/* Page dots */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                maxWidth: "180px",
                overflow: "hidden",
              }}
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (flipping || i === current) return;
                    setFlipDir(i > current ? "next" : "prev");
                    setFlipping(true);
                    setTimeout(() => {
                      setCurrent(i);
                      setFlipping(false);
                    }, 500);
                  }}
                  style={{
                    flexShrink: 0,
                    width: i === current ? "16px" : "5px",
                    height: "5px",
                    borderRadius: "3px",
                    background:
                      i === current
                        ? "linear-gradient(to right, #ff6b9d, #c084fc)"
                        : i === totalPages - 1
                          ? "rgba(255,107,157,0.1)"
                          : "rgba(255,107,157,0.2)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => flipPage("next")}
              disabled={current === totalPages - 1 || flipping}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background:
                  current === totalPages - 1
                    ? "rgba(255,107,157,0.03)"
                    : "rgba(255,107,157,0.1)",
                border: `1px solid rgba(255,107,157,${current === totalPages - 1 ? 0.08 : 0.28})`,
                color:
                  current === totalPages - 1
                    ? "rgba(255,107,157,0.15)"
                    : "rgba(255,150,190,0.8)",
                fontSize: "1.1rem",
                cursor: current === totalPages - 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow:
                  current === totalPages - 1
                    ? "none"
                    : "0 0 12px rgba(255,107,157,0.1)",
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
              color: "rgba(200,180,255,0.12)",
              marginTop: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            desliza o usa las flechas ♡
          </p>
        </div>

        {/* Fullscreen */}
        {fullscreen && page && !page.isVideo && (
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
    </>
  );
}
