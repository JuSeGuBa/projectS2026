"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Page {
  id: number;
  image: string;
  date: string;
  message: string;
}

// ── PERSONALIZA AQUÍ — agrega hasta 30 páginas ────────────────────────────────
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
    image: "/photos/album/page-05.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 6,
    image: "/photos/album/page-06.jpg",
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
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 13,
    image: "/photos/album/page-13.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 14,
    image: "/photos/album/page-14.jpg",
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
    image: "/photos/album/page-18.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 19,
    image: "/photos/album/page-19.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
  {
    id: 20,
    image: "/photos/album/page-20.jpg",
    date: "Fecha aquí",
    message: "Escribe aquí el mensaje corto de esta foto.",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function AlbumScene() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos"), 500);
  };

  const navigate = (dir: "next" | "prev") => {
    if (animating) return;
    if (dir === "next" && current >= PAGES.length - 1) return;
    if (dir === "prev" && current <= 0) return;

    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent((c) => (dir === "next" ? c + 1 : c - 1));
      setAnimating(false);
    }, 350);
  };

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? "next" : "prev");
    setTouchStart(null);
  };

  const page = PAGES[current];

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

      {/* Page counter */}
      <div
        style={{
          position: "fixed",
          top: "1.2rem",
          right: "1.5rem",
          zIndex: 20,
          fontFamily: "Georgia, serif",
          fontSize: "0.75rem",
          color: "rgba(200,180,255,0.35)",
          letterSpacing: "0.1em",
        }}
      >
        {current + 1} / {PAGES.length}
      </div>

      {/* Book */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          width: "100%",
          maxWidth: "400px",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Page */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(22,10,42,0.98), rgba(12,6,24,0.98))",
            border: "1px solid rgba(255,107,157,0.15)",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(192,84,252,0.06)",
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "next"
                ? "translateX(-30px) scale(0.97)"
                : "translateX(30px) scale(0.97)"
              : "translateX(0) scale(1)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Photo */}
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              overflow: "hidden",
              position: "relative",
            }}
          >
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
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(12,6,24,0.7))",
              }}
            />
            {/* Date over photo */}
            <div
              style={{
                position: "absolute",
                bottom: "0.8rem",
                left: "1rem",
                fontFamily: "Georgia, serif",
                fontSize: "0.7rem",
                color: "rgba(255,180,210,0.6)",
                letterSpacing: "0.1em",
              }}
            >
              {page.date}
            </div>
          </div>

          {/* Text section */}
          <div style={{ padding: "1.4rem 1.5rem 1.8rem" }}>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, rgba(255,107,157,0.25), transparent)",
                marginBottom: "1.1rem",
              }}
            />
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "rgba(220,200,255,0.82)",
                lineHeight: 1.8,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {page.message}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            onClick={() => navigate("prev")}
            disabled={current === 0 || animating}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background:
                current === 0
                  ? "rgba(255,107,157,0.03)"
                  : "rgba(255,107,157,0.08)",
              border: `1px solid rgba(255,107,157,${current === 0 ? 0.1 : 0.25})`,
              color:
                current === 0
                  ? "rgba(255,107,157,0.2)"
                  : "rgba(255,150,190,0.7)",
              fontSize: "1.1rem",
              cursor: current === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            ←
          </button>

          {/* Dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (animating || i === current) return;
                  setDirection(i > current ? "next" : "prev");
                  setAnimating(true);
                  setTimeout(() => {
                    setCurrent(i);
                    setAnimating(false);
                  }, 350);
                }}
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background:
                    i === current
                      ? "linear-gradient(to right, #ff6b9d, #c084fc)"
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
            onClick={() => navigate("next")}
            disabled={current === PAGES.length - 1 || animating}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background:
                current === PAGES.length - 1
                  ? "rgba(255,107,157,0.03)"
                  : "rgba(255,107,157,0.08)",
              border: `1px solid rgba(255,107,157,${current === PAGES.length - 1 ? 0.1 : 0.25})`,
              color:
                current === PAGES.length - 1
                  ? "rgba(255,107,157,0.2)"
                  : "rgba(255,150,190,0.7)",
              fontSize: "1.1rem",
              cursor: current === PAGES.length - 1 ? "not-allowed" : "pointer",
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
            fontSize: "0.65rem",
            color: "rgba(200,180,255,0.18)",
            marginTop: "1rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          desliza o usa las flechas
        </p>
      </div>
    </div>
  );
}
