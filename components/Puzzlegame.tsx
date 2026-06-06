"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

const GRIDS: Record<Difficulty, number> = { easy: 3, medium: 5, hard: 8 };

// ── PERSONALIZA ───────────────────────────────────────────────────────────────
const IMAGES = [
  { src: "/photos/puzzle/puzzle-1.jpg", label: "foto 1" },
  { src: "/photos/puzzle/puzzle-2.jpeg", label: "foto 2" },
  { src: "/photos/puzzle/puzzle-3.jpeg", label: "foto 3" },
];

const MESSAGES: Record<string, string> = {
  "/photos/puzzle/puzzle-1.jpg": "Escribe aquí tu mensaje para esta foto ❤️‍🩹",
  "/photos/puzzle/puzzle-2.jpeg": "Escribe aquí tu mensaje para esta foto ❤️‍🩹",
  "/photos/puzzle/puzzle-3.jpeg": "Escribe aquí tu mensaje para esta foto ❤️‍🩹",
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
  const [showInstructions, setShowInstructions] = useState(true);
  const [instrVisible, setInstrVisible] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [image, setImage] = useState(IMAGES[0].src);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [moves, setMoves] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(300);

  useEffect(() => {
    setTimeout(() => setInstrVisible(true), 60);
  }, []);

  useEffect(() => {
    const calc = () => {
      const W = Math.min(window.innerWidth - 40, 480);
      const H = window.innerHeight * 0.62;
      const grid = GRIDS[difficulty];
      const cell = Math.min(Math.floor(W / grid), Math.floor(H / grid));
      setBoardSize(cell * grid);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [difficulty]);

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
  const CELL = Math.floor(boardSize / grid);

  const diffLabels = {
    easy: "fácil 3×3",
    medium: "medio 5×5",
    hard: "difícil 8×8",
  };
  const diffDesc = {
    easy: "Para entrar en calor 🌸",
    medium: "Un poco más de desafío 🔥",
    hard: "Solo para valientes 👑",
  };

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
              border: "1px solid rgba(255,107,157,0.2)",
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
              Arma el puzzle
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
                  "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
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
                "🖼️  Elige una de nuestras fotos",
                "⚡  Escoge la dificultad: fácil (3×3), medio (5×5) o difícil (8×8)",
                "👆  Toca las piezas que están junto al espacio vacío para moverlas",
                "🏆  Reconstruye la foto para ver el mensaje especial",
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
                setInstrVisible(false);
                setTimeout(() => setShowInstructions(false), 300);
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
              ¡entendido! 🧩
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
              flexDirection: "column",
              gap: "0.6rem",
              marginBottom: "2.5rem",
              width: "100%",
            }}
          >
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  padding: "0.7rem 1.2rem",
                  background:
                    difficulty === d ? "rgba(255,107,157,0.12)" : "transparent",
                  border: `1px solid rgba(255,107,157,${difficulty === d ? 0.5 : 0.15})`,
                  borderRadius: "4px",
                  color:
                    difficulty === d ? "#f8d4ef" : "rgba(200,180,255,0.35)",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{diffLabels[d]}</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                  {diffDesc[d]}
                </span>
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
              width: boardSize,
              height: boardSize,
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
                opacity: 0.06,
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
                      transition: "left 0.1s ease, top 0.1s ease",
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
                    border: "1px solid rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "left 0.1s ease, top 0.1s ease",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: boardSize,
                      height: boardSize,
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
            {MESSAGES[image] || "Escribe aquí tu mensaje para esta foto ❤️‍🩹"}
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
