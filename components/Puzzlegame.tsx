"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type Difficulty = "easy" | "medium" | "hard";

interface Piece {
  id: number;
  correctCol: number;
  correctRow: number;
  currentCol: number;
  currentRow: number;
  isEmpty: boolean;
}

const GRIDS: Record<Difficulty, number> = { easy: 3, medium: 4, hard: 5 };

// ── PERSONALIZA: pon los nombres reales de tus fotos ─────────────────────────
const IMAGES = [
  { src: "/photos/puzzle/puzzle-1.jpg", label: "foto 1" },
  { src: "/photos/puzzle/puzzle-2.jpeg", label: "foto 2" },
  { src: "/photos/puzzle/puzzle-3..jpeg", label: "foto 3" },
];

// ── PERSONALIZA: mensajes al completar cada foto ─────────────────────────────
const MESSAGES: Record<string, string> = {
  "/photos/puzzle/puzzle-1.jpg": "Escribe aquí tu mensaje para esta foto ❤️‍🩹",
  "/photos/puzzle/puzzle-2.jpg": "Escribe aquí tu mensaje para esta foto ❤️‍🩹",
  "/photos/puzzle/puzzle-3.jpg": "Escribe aquí tu mensaje para esta foto ❤️‍🩹",
};
// ─────────────────────────────────────────────────────────────────────────────

function makePieces(grid: number): Piece[] {
  const pieces: Piece[] = [];
  for (let r = 0; r < grid; r++)
    for (let c = 0; c < grid; c++)
      pieces.push({
        id: r * grid + c,
        correctCol: c,
        correctRow: r,
        currentCol: c,
        currentRow: r,
        isEmpty: r === grid - 1 && c === grid - 1,
      });

  // Shuffle positions
  const positions = pieces.map((p) => ({
    col: p.currentCol,
    row: p.currentRow,
  }));
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return pieces.map((p, i) => ({
    ...p,
    currentCol: positions[i].col,
    currentRow: positions[i].row,
  }));
}

function solved(pieces: Piece[]) {
  return pieces.every(
    (p) => p.currentCol === p.correctCol && p.currentRow === p.correctRow,
  );
}

export default function PuzzleGame() {
  const router = useRouter();
  const [screen, setScreen] = useState<"select" | "playing" | "complete">(
    "select",
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [image, setImage] = useState(IMAGES[0].src);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [moves, setMoves] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos"), 500);
  };

  const start = useCallback((img: string, diff: Difficulty) => {
    setImage(img);
    setDifficulty(diff);
    setPieces(makePieces(GRIDS[diff]));
    setMoves(0);
    setShowComplete(false);
    setScreen("playing");
  }, []);

  const clickPiece = useCallback((piece: Piece) => {
    if (piece.isEmpty) return;
    setPieces((prev) => {
      const empty = prev.find((p) => p.isEmpty)!;
      const dr = Math.abs(piece.currentRow - empty.currentRow);
      const dc = Math.abs(piece.currentCol - empty.currentCol);
      if (!((dr === 1 && dc === 0) || (dr === 0 && dc === 1))) return prev;

      const next = prev.map((p) => {
        if (p.id === piece.id)
          return {
            ...p,
            currentCol: empty.currentCol,
            currentRow: empty.currentRow,
          };
        if (p.id === empty.id)
          return {
            ...p,
            currentCol: piece.currentCol,
            currentRow: piece.currentRow,
          };
        return p;
      });
      setMoves((m) => m + 1);
      if (solved(next))
        setTimeout(() => {
          setScreen("complete");
          setTimeout(() => setShowComplete(true), 600);
        }, 200);
      return next;
    });
  }, []);

  const grid = GRIDS[difficulty];
  const CELL = Math.min(
    Math.floor(
      (Math.min(typeof window !== "undefined" ? window.innerWidth : 400, 480) -
        40) /
        grid,
    ),
    Math.floor(
      (typeof window !== "undefined" ? window.innerHeight * 0.62 : 400) / grid,
    ),
  );
  const board = CELL * grid;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 30%, #0d0415 0%, #040208 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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

      {/* ── SELECT ── */}
      {screen === "select" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "5rem 1.5rem 2rem",
            maxWidth: "480px",
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
            Arma el puzzle
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
              fontSize: "0.75rem",
              color: "rgba(200,180,255,0.35)",
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
              marginBottom: "2rem",
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
                  border: `2px solid ${image === img.src ? "rgba(255,107,157,0.8)" : "rgba(255,107,157,0.15)"}`,
                  borderRadius: "4px",
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
              fontSize: "0.75rem",
              color: "rgba(200,180,255,0.35)",
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
              gap: "0.8rem",
              marginBottom: "2.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  padding: "0.6rem 1.2rem",
                  background:
                    difficulty === d ? "rgba(255,107,157,0.15)" : "transparent",
                  border: `1px solid rgba(255,107,157,${difficulty === d ? 0.6 : 0.2})`,
                  borderRadius: "3px",
                  color: difficulty === d ? "#f8d4ef" : "rgba(200,180,255,0.4)",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {d === "easy"
                  ? "fácil 3×3"
                  : d === "medium"
                    ? "medio 4×4"
                    : "difícil 5×5"}
              </button>
            ))}
          </div>

          <button
            onClick={() => start(image, difficulty)}
            style={{
              padding: "0.9rem 2.5rem",
              background:
                "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
              border: "1px solid rgba(255,107,157,0.4)",
              borderRadius: "3px",
              color: "#f8d4ef",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            ¡armar! 🧩
          </button>
        </div>
      )}

      {/* ── PLAYING ── */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "rgba(200,180,255,0.5)",
              }}
            >
              movimientos: <span style={{ color: "#f8d4ef" }}>{moves}</span>
            </span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.75rem",
                color: "rgba(200,180,255,0.3)",
              }}
            >
              {grid}×{grid}
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

          <div
            ref={boardRef}
            style={{
              position: "relative",
              width: board,
              height: board,
              border: "1px solid rgba(255,107,157,0.12)",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(192,84,252,0.07)",
            }}
          >
            <img
              src={image}
              alt="preview"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.07,
                pointerEvents: "none",
              }}
            />

            {pieces.map((piece) => {
              if (piece.isEmpty)
                return (
                  <div
                    key={piece.id}
                    style={{
                      position: "absolute",
                      left: piece.currentCol * CELL,
                      top: piece.currentRow * CELL,
                      width: CELL,
                      height: CELL,
                      background: "rgba(0,0,0,0.65)",
                      border: "1px solid rgba(255,107,157,0.04)",
                      transition: "left 0.12s ease, top 0.12s ease",
                    }}
                  />
                );

              return (
                <button
                  key={piece.id}
                  onClick={() => clickPiece(piece)}
                  style={{
                    position: "absolute",
                    left: piece.currentCol * CELL,
                    top: piece.currentRow * CELL,
                    width: CELL,
                    height: CELL,
                    padding: 0,
                    border: "1px solid rgba(0,0,0,0.25)",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "left 0.12s ease, top 0.12s ease",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: board,
                      height: board,
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      left: -piece.correctCol * CELL,
                      top: -piece.correctRow * CELL,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.7rem",
              color: "rgba(200,180,255,0.2)",
              marginTop: "1rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            toca las piezas junto al hueco para moverlas
          </p>
        </div>
      )}

      {/* ── COMPLETE ── */}
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
              width: "min(260px, 65vw)",
              height: "min(260px, 65vw)",
              borderRadius: "6px",
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
              marginBottom: "0.6rem",
            }}
          >
            ¡La armaste! ✨
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
              maxWidth: "340px",
              marginBottom: "2rem",
            }}
          >
            {MESSAGES[image]}
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
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              otro puzzle ♡
            </button>
            <button
              onClick={goBack}
              style={{
                padding: "0.8rem 1.5rem",
                background: "transparent",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "3px",
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
