"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Difficulty = "easy" | "medium" | "hard";

interface Piece {
  id: number;
  correctCol: number;
  correctRow: number;
  // Current pixel position
  x: number;
  y: number;
  // Is it placed correctly
  placed: boolean;
  // Is it being dragged
  dragging: boolean;
}

const GRIDS: Record<Difficulty, number> = { easy: 3, medium: 4, hard: 5 };

const IMAGES = [
  { src: "/photos/puzzle/puzzle-1.jpg", label: "foto 1" },
  { src: "/photos/puzzle/puzzle-2.jpeg", label: "foto 2" },
  { src: "/photos/puzzle/puzzle-3.jpeg", label: "foto 3" },
];

const MESSAGES: Record<string, string> = {
  "/photos/puzzle/puzzle-1.jpg": "Te amo demasiado ❤️‍🩹",
  "/photos/puzzle/puzzle-2.jpeg": "Hacemos bonita pareja amor jeje ❤️‍🩹",
  "/photos/puzzle/puzzle-3.jpeg": "Eres lo mejor que le ha pasado a mi vida ❤️‍🩹",
};

const DIFF_CONFIG = {
  easy: {
    label: "fácil",
    grid: "3×3",
    desc: "Para entrar en calor 🌸",
    color: "192,132,252",
  },
  medium: {
    label: "medio",
    grid: "4×4",
    desc: "Un poco más difícil 🔥",
    color: "255,107,157",
  },
  hard: {
    label: "difícil",
    grid: "5×5",
    desc: "¡Tú puedes! 👑",
    color: "255,180,60",
  },
};

export default function PuzzleGame() {
  const router = useRouter();
  const [screen, setScreen] = useState<"select" | "playing" | "complete">(
    "select",
  );
  const [showInstr, setShowInstr] = useState(true);
  const [instrVis, setInstrVis] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [image, setImage] = useState(IMAGES[0].src);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [moves, setMoves] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [placedCount, setPlacedCount] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: number;
    startX: number;
    startY: number;
    pieceX: number;
    pieceY: number;
  } | null>(null);
  const piecesRef = useRef<Piece[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  piecesRef.current = pieces;

  useEffect(() => {
    setTimeout(() => setInstrVis(true), 60);
  }, []);

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos"), 500);
  };

  const CELL_SIZE = useCallback(() => {
    const W = Math.min(
      (containerRef.current?.offsetWidth ?? window.innerWidth) - 32,
      420,
    );
    const H = window.innerHeight * 0.55;
    const g = GRIDS[difficulty];
    return Math.min(Math.floor(W / g), Math.floor(H / g));
  }, [difficulty]);

  const startGame = useCallback((img: string, diff: Difficulty) => {
    const g = GRIDS[diff];
    const cell = (() => {
      const W = Math.min(window.innerWidth - 32, 420);
      const H = window.innerHeight * 0.55;
      return Math.min(Math.floor(W / g), Math.floor(H / g));
    })();
    const board = cell * g;

    // Scatter pieces randomly around the board area
    const newPieces: Piece[] = [];
    for (let r = 0; r < g; r++) {
      for (let c = 0; c < g; c++) {
        // Random scatter position — nearby but shuffled
        const scatterX = Math.random() * (board - cell);
        const scatterY = Math.random() * (board - cell);
        newPieces.push({
          id: r * g + c,
          correctCol: c,
          correctRow: r,
          x: scatterX,
          y: scatterY,
          placed: false,
          dragging: false,
        });
      }
    }
    // Shuffle order so they appear at different z-indices
    newPieces.sort(() => Math.random() - 0.5);

    setImage(img);
    setDifficulty(diff);
    setPieces(newPieces);
    setMoves(0);
    setPlacedCount(0);
    setShowComplete(false);
    setScreen("playing");
  }, []);

  // ── DRAG LOGIC ────────────────────────────────────────────────────────────
  const getSnapTarget = useCallback(
    (piece: Piece, diff: Difficulty) => {
      const g = GRIDS[diff];
      const cell = CELL_SIZE();
      const targetX = piece.correctCol * cell;
      const targetY = piece.correctRow * cell;
      const dist = Math.hypot(piece.x - targetX, piece.y - targetY);
      return { targetX, targetY, close: dist < cell * 0.42 };
    },
    [CELL_SIZE],
  );

  const onPointerDown = useCallback((e: React.PointerEvent, id: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const piece = piecesRef.current.find((p) => p.id === id);
    if (!piece || piece.placed) return;
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      pieceX: piece.x,
      pieceY: piece.y,
    };
    setPieces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, dragging: true } : p)),
    );
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { id, startX, startY, pieceX, pieceY } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    setPieces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, x: pieceX + dx, y: pieceY + dy } : p,
      ),
    );
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const { id, startX, startY } = dragRef.current;
      dragRef.current = null;

      const moved = Math.hypot(e.clientX - startX, e.clientY - startY) > 4;
      if (moved) setMoves((m) => m + 1);

      setPieces((prev) => {
        const piece = prev.find((p) => p.id === id);
        if (!piece) return prev;
        const { targetX, targetY, close } = getSnapTarget(piece, difficulty);
        const updated = prev.map((p) => {
          if (p.id !== id) return p;
          if (close)
            return {
              ...p,
              x: targetX,
              y: targetY,
              placed: true,
              dragging: false,
            };
          return { ...p, dragging: false };
        });
        const placed = updated.filter((p) => p.placed).length;
        setPlacedCount(placed);
        if (placed === GRIDS[difficulty] * GRIDS[difficulty]) {
          setTimeout(() => {
            setScreen("complete");
            setTimeout(() => setShowComplete(true), 500);
          }, 200);
        }
        return updated;
      });
    },
    [difficulty, getSnapTarget],
  );

  const cell = CELL_SIZE();
  const board = cell * GRIDS[difficulty];
  const total = GRIDS[difficulty] * GRIDS[difficulty];

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 30%, #0d0415 0%, #040208 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
        userSelect: "none",
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

      {/* Instructions */}
      {showInstr && (
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
            opacity: instrVis ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.99), rgba(10,4,22,0.99))",
              border: "1px solid rgba(255,107,157,0.2)",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "360px",
              width: "100%",
              textAlign: "center",
              transform: instrVis ? "scale(1)" : "scale(0.96)",
              transition: "transform 0.35s ease",
              boxShadow: "0 0 60px rgba(192,84,252,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🧩</div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.3rem",
                fontWeight: 300,
                color: "#f8d4ef",
                marginBottom: "0.4rem",
              }}
            >
              Rompecabezas
            </h2>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.78rem",
                color: "rgba(200,180,255,0.4)",
                fontStyle: "italic",
                marginBottom: "1.4rem",
              }}
            >
              ¡arrastra las piezas a su lugar!
            </p>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
                marginBottom: "1.3rem",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1.8rem",
                textAlign: "left",
              }}
            >
              {[
                "🖼️  Elige una de nuestras fotos",
                "⚡  Elige dificultad: fácil (3×3), medio (4×4) o difícil (5×5)",
                "👆  Arrastra cada pieza a donde crees que va",
                "✨  Las piezas encajan solas si las sueltas cerca",
                "🏆  ¡Arma la foto y recibe un mensaje especial! ❤️‍🩹",
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
              onClick={() => {
                setInstrVis(false);
                setTimeout(() => setShowInstr(false), 300);
              }}
              style={{
                width: "100%",
                padding: "0.85rem",
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
              ¡a jugar! 🧩
            </button>
          </div>
        </div>
      )}

      {/* SELECT */}
      {screen === "select" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "5rem 1.5rem 2rem",
            maxWidth: "460px",
            width: "100%",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🧩</div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.8rem",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.4rem",
            }}
          >
            Rompecabezas
          </h1>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(200,180,255,0.5)",
              fontStyle: "italic",
              marginBottom: "2.5rem",
            }}
          >
            elige una foto y una dificultad
          </p>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              color: "rgba(200,180,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            foto
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.8rem",
              marginBottom: "2.2rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {IMAGES.map((img) => (
              <button
                key={img.src}
                onClick={() => setImage(img.src)}
                style={{
                  width: "90px",
                  height: "90px",
                  padding: 0,
                  border: `2px solid ${image === img.src ? "rgba(255,107,157,0.8)" : "rgba(255,107,157,0.12)"}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow:
                    image === img.src
                      ? "0 0 20px rgba(255,107,157,0.3)"
                      : "none",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              color: "rgba(200,180,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            dificultad
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              marginBottom: "2.5rem",
              width: "100%",
            }}
          >
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const cfg = DIFF_CONFIG[d];
              const sel = difficulty === d;
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: "0.75rem 1.2rem",
                    background: sel ? `rgba(${cfg.color},0.1)` : "transparent",
                    border: `1px solid rgba(${cfg.color},${sel ? 0.5 : 0.12})`,
                    borderRadius: "6px",
                    color: sel ? "#f8d4ef" : "rgba(200,180,255,0.32)",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: sel ? `0 0 16px rgba(${cfg.color},0.1)` : "none",
                  }}
                >
                  <span>
                    {cfg.label}{" "}
                    <span style={{ opacity: 0.5, fontSize: "0.8rem" }}>
                      {cfg.grid}
                    </span>
                  </span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                    {cfg.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => startGame(image, difficulty)}
            style={{
              padding: "0.9rem 2.5rem",
              background:
                "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
              border: "1px solid rgba(255,107,157,0.4)",
              borderRadius: "6px",
              color: "#f8d4ef",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(255,107,157,0.1)",
            }}
          >
            ¡empezar! 🧩
          </button>
        </div>
      )}

      {/* PLAYING */}
      {screen === "playing" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "4.5rem 1rem 1rem",
            width: "100%",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
              marginBottom: "0.8rem",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "rgba(200,180,255,0.5)",
              }}
            >
              piezas: <span style={{ color: "#f8d4ef" }}>{placedCount}</span>
              <span style={{ opacity: 0.4 }}> / {total}</span>
            </span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.75rem",
                color: "rgba(200,180,255,0.3)",
              }}
            >
              {moves} movimientos
            </span>
            <button
              onClick={() => setScreen("select")}
              style={{
                background: "none",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "2px",
                color: "rgba(200,180,255,0.4)",
                fontFamily: "Georgia, serif",
                fontSize: "0.75rem",
                padding: "0.25rem 0.6rem",
                cursor: "pointer",
              }}
            >
              cambiar
            </button>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: board,
              height: "3px",
              background: "rgba(255,107,157,0.1)",
              borderRadius: "2px",
              marginBottom: "0.8rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "2px",
                width: `${(placedCount / total) * 100}%`,
                background: "linear-gradient(to right, #ff6b9d, #c084fc)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Board */}
          <div
            ref={boardRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
              position: "relative",
              width: board,
              height: board,
              border: "1px solid rgba(255,107,157,0.12)",
              borderRadius: "6px",
              overflow: "visible",
              boxShadow: "0 0 40px rgba(192,84,252,0.06)",
              touchAction: "none",
            }}
          >
            {/* Grid guide */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "6px",
                overflow: "hidden",
                backgroundImage: `
                linear-gradient(rgba(255,107,157,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,107,157,0.08) 1px, transparent 1px)
              `,
                backgroundSize: `${cell}px ${cell}px`,
                zIndex: 0,
              }}
            />

            {/* Target slots */}
            {pieces.map((piece) => (
              <div
                key={`slot-${piece.id}`}
                style={{
                  position: "absolute",
                  left: piece.correctCol * cell,
                  top: piece.correctRow * cell,
                  width: cell,
                  height: cell,
                  border: `1px dashed rgba(255,107,157,${piece.placed ? 0 : 0.2})`,
                  borderRadius: "2px",
                  transition: "border-color 0.3s ease",
                  zIndex: 1,
                }}
              />
            ))}

            {/* Ghost image */}
            <img
              src={image}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.06,
                pointerEvents: "none",
                borderRadius: "6px",
                zIndex: 0,
              }}
            />

            {/* Pieces */}
            {pieces.map((piece, idx) => {
              const isActive = piece.dragging;
              return (
                <div
                  key={piece.id}
                  onPointerDown={(e) => onPointerDown(e, piece.id)}
                  style={{
                    position: "absolute",
                    left: piece.x,
                    top: piece.y,
                    width: cell,
                    height: cell,
                    cursor: piece.placed
                      ? "default"
                      : isActive
                        ? "grabbing"
                        : "grab",
                    zIndex: piece.placed ? 2 : isActive ? 100 : 10 + idx,
                    transition: piece.dragging
                      ? "none"
                      : "left 0.2s ease, top 0.2s ease, box-shadow 0.15s ease",
                    touchAction: "none",
                    overflow: "hidden",
                    borderRadius: "2px",
                    boxShadow: piece.placed
                      ? "none"
                      : isActive
                        ? "0 8px 24px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,107,157,0.6)"
                        : "0 3px 10px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                    filter: piece.placed
                      ? "brightness(1)"
                      : isActive
                        ? "brightness(1.08)"
                        : "brightness(0.92)",
                  }}
                >
                  {/* Piece image slice */}
                  <div
                    style={{
                      position: "absolute",
                      width: board,
                      height: board,
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      left: -piece.correctCol * cell,
                      top: -piece.correctRow * cell,
                    }}
                  />
                  {/* Piece placed glow */}
                  {piece.placed && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        border: "1.5px solid rgba(192,132,252,0.5)",
                        borderRadius: "2px",
                        animation: "none",
                        background: "rgba(192,132,252,0.04)",
                      }}
                    />
                  )}
                  {/* Piece border */}
                  {!piece.placed && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "2px",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.68rem",
              color: "rgba(200,180,255,0.2)",
              marginTop: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            arrastra cada pieza a su lugar ✦ encajan solas si están cerca
          </p>
        </div>
      )}

      {/* COMPLETE */}
      {screen === "complete" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(4,2,8,0.96)",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
            opacity: showComplete ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              marginBottom: "1.2rem",
              filter: "drop-shadow(0 0 20px rgba(255,107,157,0.8))",
            }}
          >
            🧩
          </div>
          <div
            style={{
              width: "min(240px, 60vw)",
              height: "min(240px, 60vw)",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "1.5rem",
              border: "1px solid rgba(255,107,157,0.3)",
              boxShadow: "0 0 50px rgba(255,107,157,0.15)",
            }}
          >
            <img
              src={image}
              alt="completada"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.2rem, 4vw, 2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.5rem",
            }}
          >
            ¡Lo armaste mi amorrrrrrrrrrrrrr!
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(200,180,255,0.5)",
              fontStyle: "italic",
              marginBottom: "1.2rem",
            }}
          >
            {moves} movimientos
          </p>
          <div
            style={{
              height: "1px",
              width: "200px",
              background:
                "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
              marginBottom: "1.2rem",
            }}
          />
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
              color: "rgba(220,200,255,0.8)",
              fontStyle: "italic",
              lineHeight: 1.75,
              maxWidth: "320px",
              marginBottom: "2rem",
            }}
          >
            {MESSAGES[image] || "❤️‍🩹"}
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
              onClick={() => {
                setScreen("select");
                setShowComplete(false);
              }}
              style={{
                padding: "0.8rem 1.5rem",
                background:
                  "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
                border: "1px solid rgba(255,107,157,0.35)",
                borderRadius: "6px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              otro ♡
            </button>
            <button
              onClick={goBack}
              style={{
                padding: "0.8rem 1.5rem",
                background: "transparent",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "6px",
                color: "rgba(200,170,255,0.5)",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
