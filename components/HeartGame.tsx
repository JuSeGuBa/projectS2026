"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
type HeartType = "normal" | "gold" | "purple" | "broken";

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: HeartType;
  caught: boolean;
  catchScale: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

interface FloatingMessage {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  vy: number;
  color: string;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
  size: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const FINAL_SCORE = 50;
const MAX_LIVES = 3;

const MILESTONES: Record<number, string> = {
  5: "¡ya van 5 YUPIIIII! ❤️",
  10: "¡eres increíble! 🌟",
  15: "¡mitad del camino! 💫",
  20: "te amo mucho 💕",
  25: "¡25! ¡ eres imparable! 🔥",
  30: "ya casi... 🥺 VAMOS HERMOSA",
  35: "¡35! ¡no te rindas! ✨",
  40: "¡tan cerca! 💗 VAMOS PRECIOSAAAAA",
  45: "¡5 más y ganas! YA CASI REINAAAAAAAA👑",
};

const LEVEL_MESSAGES: Record<number, string> = {
  2: "nivel 2 — las cosas se ponen interesantes JIJIJI 👀",
  3: "nivel 3 — ¡a concentrarse linda! 💪",
  4: "nivel 4 — ¡modo experta issssssssssss! 🌸",
  5: "nivel 5 — ¡modo leyenda Reina! 👑",
};

const HEART_COLORS: Record<HeartType, string> = {
  normal: "#ff7eb5",
  gold: "#ffd700",
  purple: "#c084fc",
  broken: "#666688",
};

const HEART_GLOW: Record<HeartType, string> = {
  normal: "#ff6b9d",
  gold: "#ffaa00",
  purple: "#a855f7",
  broken: "#444466",
};

let heartIdCounter = 0;
let msgIdCounter = 0;

// ── Drawing helpers ───────────────────────────────────────────────────────────
function drawHeartShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  glowColor: string,
  alpha: number,
  broken = false,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 14;
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size * 0.5;
  ctx.moveTo(cx, cy + s * 0.8);
  ctx.bezierCurveTo(
    cx - s * 2,
    cy - s * 0.4,
    cx - s * 2,
    cy - s * 1.6,
    cx,
    cy - s * 0.8,
  );
  ctx.bezierCurveTo(
    cx + s * 2,
    cy - s * 1.6,
    cx + s * 2,
    cy - s * 0.4,
    cx,
    cy + s * 0.8,
  );
  ctx.fill();

  if (broken) {
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.2);
    ctx.lineTo(cx - s * 0.3, cy + s * 0.1);
    ctx.lineTo(cx + s * 0.1, cy + s * 0.4);
    ctx.stroke();
  }
  ctx.restore();
}

// ── Instructions Modal ────────────────────────────────────────────────────────
function InstructionsModal({
  onClose,
  onHelp,
}: {
  onClose: () => void;
  onHelp?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 30);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(4,2,8,0.92)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(20,8,40,0.99), rgba(10,4,22,0.99))",
          border: "1px solid rgba(255,107,157,0.2)",
          borderRadius: "6px",
          padding: "2rem",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 0 80px rgba(192,84,252,0.1)",
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.97)",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎮</div>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.4rem",
              color: "#f8d4ef",
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
          >
            Cómo jugar
          </h2>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(200,180,255,0.55)",
              marginTop: "0.4rem",
              fontStyle: "italic",
            }}
          >
            Atrapa 50 corazones para ganar ✨
          </p>
        </div>

        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
            marginBottom: "1.5rem",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.8rem",
          }}
        >
          {[
            {
              color: "#ff7eb5",
              glow: "#ff6b9d",
              label: "Corazón normal",
              desc: "Vale 1 punto",
              broken: false,
            },
            {
              color: "#ffd700",
              glow: "#ffaa00",
              label: "Corazón dorado ❤️‍🩹",
              desc: "Vale 3 puntos — ¡no lo dejes ir!",
              broken: false,
            },
            {
              color: "#c084fc",
              glow: "#a855f7",
              label: "Corazón morado 💜",
              desc: "Congela la velocidad 3 seg",
              broken: false,
            },
            {
              color: "#666688",
              glow: "#444466",
              label: "Corazón roto 💔",
              desc: "¡Evítalo! Pierdes una vida",
              broken: true,
            },
          ].map((h) => (
            <div
              key={h.label}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <HeartIcon color={h.color} glow={h.glow} broken={h.broken} />
              <div>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.9rem",
                    color: "#f0e8ff",
                    margin: 0,
                  }}
                >
                  {h.label}
                </p>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.78rem",
                    color: "rgba(200,180,255,0.5)",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
            marginBottom: "1.5rem",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "1.8rem",
          }}
        >
          {[
            "🖱️ Mueve el mouse o el dedo para controlar la barra",
            "💔 Tienes 3 vidas — cada corazón que cae las resta",
            "🔥 3 corazones seguidos = combo +1 punto extra",
            "⚡ Cada 10 puntos sube el nivel y la velocidad",
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
          onClick={close}
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
            transition: "all 0.2s ease",
          }}
        >
          {onHelp ? "cerrar" : "¡a jugar! ❤️‍🩹"}
        </button>
      </div>
    </div>
  );
}

function HeartIcon({
  color,
  glow,
  broken,
}: {
  color: string;
  glow: string;
  broken: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 40;
    canvas.height = 36;
    drawHeartShape(ctx, 20, 20, 22, color, glow, 1, broken);
  }, [color, glow, broken]);
  return <canvas ref={ref} style={{ width: 40, height: 36, flexShrink: 0 }} />;
}

// ── Main Game ─────────────────────────────────────────────────────────────────
export default function HeartGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const stateRef = useRef({
    playerX: 0,
    hearts: [] as Heart[],
    floatingMsgs: [] as FloatingMessage[],
    particles: [] as Particle[],
    score: 0,
    lives: MAX_LIVES,
    combo: 0,
    level: 1,
    running: true,
    animId: 0,
    lastSpawn: 0,
    milestoneShown: new Set<number>(),
    levelShown: new Set<number>(),
    frozen: false,
    freezeUntil: 0,
    gameOver: false,
    goldSpawnCounter: 0,
    specialSpawnCounter: 0,
  });

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [level, setLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [gameState, setGameState] = useState<
    "waiting" | "playing" | "dead" | "win"
  >("waiting");
  const [finalVisible, setFinalVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const goHome = useCallback(() => {
    stateRef.current.running = false;
    setLeaving(true);
    setTimeout(() => router.push("/"), 500);
  }, [router]);

  const restart = useCallback(() => {
    const state = stateRef.current;
    state.score = 0;
    state.lives = MAX_LIVES;
    state.combo = 0;
    state.level = 1;
    state.running = true;
    state.hearts = [];
    state.floatingMsgs = [];
    state.particles = [];
    state.lastSpawn = 0;
    state.milestoneShown = new Set();
    state.levelShown = new Set();
    state.frozen = false;
    state.freezeUntil = 0;
    state.gameOver = false;
    state.goldSpawnCounter = 0;
    state.specialSpawnCounter = 0;
    setScore(0);
    setLives(MAX_LIVES);
    setLevel(1);
    setFinalVisible(false);
    setGameState("playing");
  }, []);

  const startGame = useCallback(() => {
    setShowInstructions(false);
    restart();
  }, [restart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const state = stateRef.current;

    state.running = true;
    state.score = 0;
    state.lives = MAX_LIVES;
    state.hearts = [];
    state.floatingMsgs = [];
    state.particles = [];
    state.gameOver = false;
    state.milestoneShown = new Set();
    state.levelShown = new Set();

    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      state.playerX = W / 2;
    };

    const onMouseMove = (e: MouseEvent) => {
      state.playerX = e.clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      state.playerX = e.touches[0].clientX;
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", resize);

    const addFloating = (
      text: string,
      x: number,
      y: number,
      color = "#f8d4ef",
      size = 1,
    ) => {
      state.floatingMsgs.push({
        id: msgIdCounter++,
        text,
        x,
        y,
        opacity: 1,
        vy: -1.4,
        color,
        size,
      });
    };

    const spawnParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        state.particles.push({
          x,
          y,
          vx: Math.cos(angle) * (2 + Math.random() * 3),
          vy: Math.sin(angle) * (2 + Math.random() * 3),
          opacity: 1,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    };

    const loop = (timestamp: number) => {
      if (!state.running) return;
      const W = canvas.width;
      const H = canvas.height;
      const now = timestamp;

      if (state.frozen && now > state.freezeUntil) {
        state.frozen = false;
      }

      const newLevel = Math.min(5, 1 + Math.floor(state.score / 10));
      if (newLevel !== state.level) {
        state.level = newLevel;
        setLevel(newLevel);
        if (LEVEL_MESSAGES[newLevel] && !state.levelShown.has(newLevel)) {
          state.levelShown.add(newLevel);
          addFloating(
            LEVEL_MESSAGES[newLevel],
            W / 2,
            H * 0.35,
            "#c084fc",
            1.1,
          );
        }
      }

      const baseInterval = 1300;
      const levelFactor = (state.level - 1) * 120;
      const spawnInterval = Math.max(
        400,
        baseInterval - levelFactor - state.score * 8,
      );

      if (now - state.lastSpawn > spawnInterval) {
        state.specialSpawnCounter++;
        state.goldSpawnCounter++;

        let type: HeartType = "normal";
        if (state.goldSpawnCounter >= 12) {
          type = "gold";
          state.goldSpawnCounter = 0;
        } else if (state.specialSpawnCounter >= 8) {
          type = Math.random() < 0.5 ? "purple" : "broken";
          state.specialSpawnCounter = 0;
        }

        const baseSpeed = 1.2 + (state.level - 1) * 0.4;
        state.hearts.push({
          id: heartIdCounter++,
          x: 40 + Math.random() * (W - 80),
          y: -25,
          size: type === "gold" ? 22 : 16 + Math.random() * 8,
          speed: state.frozen ? 0.4 : baseSpeed + Math.random() * 0.8,
          type,
          caught: false,
          catchScale: 1,
          opacity: 1,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.025 + Math.random() * 0.02,
        });
        state.lastSpawn = now;
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#070709");
      bg.addColorStop(1, "#0d0618");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const progress = Math.min(state.score / FINAL_SCORE, 1);
      const barW = W * 0.6;
      const barX = (W - barW) / 2;
      const barY = 18;
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, 4, 2);
      ctx.fill();
      if (progress > 0) {
        const pg = ctx.createLinearGradient(barX, 0, barX + barW * progress, 0);
        pg.addColorStop(0, "#ff6b9d");
        pg.addColorStop(1, "#c084fc");
        ctx.fillStyle = pg;
        ctx.shadowColor = "#ff6b9d";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW * progress, 4, 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (state.frozen) {
        ctx.fillStyle = "rgba(192,132,252,0.04)";
        ctx.fillRect(0, 0, W, H);
      }

      const BAR_W = Math.min(130, W * 0.28);
      const BAR_H = 11;
      const BAR_Y = H - 52;
      const px = Math.max(BAR_W / 2, Math.min(W - BAR_W / 2, state.playerX));

      const grad = ctx.createLinearGradient(
        px - BAR_W / 2,
        0,
        px + BAR_W / 2,
        0,
      );
      grad.addColorStop(0, "rgba(255,107,157,0.1)");
      grad.addColorStop(
        0.5,
        state.frozen ? "rgba(192,132,252,0.95)" : "rgba(255,107,157,0.95)",
      );
      grad.addColorStop(1, "rgba(255,107,157,0.1)");
      ctx.fillStyle = grad;
      ctx.shadowColor = state.frozen ? "#c084fc" : "#ff6b9d";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(px - BAR_W / 2, BAR_Y, BAR_W, BAR_H, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      state.hearts = state.hearts.filter((h) => {
        const spd = state.frozen && !h.caught ? h.speed * 0.2 : h.speed;

        if (h.caught) {
          h.catchScale += (2.5 - h.catchScale) * 0.15;
          h.opacity -= 0.06;
          drawHeartShape(
            ctx,
            h.x,
            h.y,
            h.size * h.catchScale,
            HEART_COLORS[h.type],
            HEART_GLOW[h.type],
            Math.max(0, h.opacity),
          );
          return h.opacity > 0;
        }

        h.y += spd;
        h.wobble += h.wobbleSpeed;
        h.x += Math.sin(h.wobble) * 0.6;

        const pulse =
          h.type === "gold" ? 1 + Math.sin(Date.now() * 0.008) * 0.12 : 1;

        const dx = Math.abs(h.x - px);
        const dy = Math.abs(h.y - BAR_Y);

        if (dx < BAR_W / 2 + h.size * 0.8 && dy < BAR_H + h.size * 1.1) {
          h.caught = true;
          spawnParticles(h.x, h.y, HEART_COLORS[h.type]);

          if (h.type === "broken") {
            state.lives = Math.max(0, state.lives - 1);
            setLives(state.lives);
            addFloating("💔 -1 vida", h.x, h.y - 20, "#ff4466", 1.1);
            if (state.lives <= 0 && !state.gameOver) {
              state.gameOver = true;
              state.running = false;
              setTimeout(() => setGameState("dead"), 400);
            }
          } else {
            const points = h.type === "gold" ? 3 : 1;
            state.score += points;
            state.combo++;
            setScore(state.score);

            if (h.type === "gold")
              addFloating("+3 ✨", h.x, h.y - 20, "#ffd700", 1.2);
            else if (h.type === "purple") {
              state.frozen = true;
              state.freezeUntil = timestamp + 3000;
              addFloating("💜 respira...", W / 2, H / 2, "#c084fc", 1.1);
            }

            if (state.combo >= 3) {
              state.score += 1;
              setScore(state.score);
              addFloating("¡combo! 🔥 +1", h.x, h.y - 40, "#ffaa44", 1.15);
              state.combo = 0;
            }

            const ms = state.score;
            if (MILESTONES[ms] && !state.milestoneShown.has(ms)) {
              state.milestoneShown.add(ms);
              addFloating(MILESTONES[ms], W / 2, H * 0.4, "#f8d4ef", 1.2);
            }

            if (state.score >= FINAL_SCORE && !state.gameOver) {
              state.gameOver = true;
              state.running = false;
              setTimeout(() => {
                setGameState("win");
                setTimeout(() => setFinalVisible(true), 100);
              }, 400);
            }
          }
          return true;
        }

        if (h.y > H + 30) {
          if (h.type !== "broken") {
            state.combo = 0;
            state.lives = Math.max(0, state.lives - 1);
            setLives(state.lives);
            if (state.lives <= 0 && !state.gameOver) {
              state.gameOver = true;
              state.running = false;
              setTimeout(() => setGameState("dead"), 400);
            }
          }
          return false;
        }

        drawHeartShape(
          ctx,
          h.x,
          h.y,
          h.size * pulse,
          HEART_COLORS[h.type],
          HEART_GLOW[h.type],
          h.opacity,
          h.type === "broken",
        );
        return true;
      });

      state.particles = state.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.opacity -= 0.04;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return p.opacity > 0;
      });

      state.floatingMsgs = state.floatingMsgs.filter((m) => {
        m.y += m.vy;
        m.opacity -= 0.008;
        ctx.save();
        ctx.globalAlpha = Math.max(0, m.opacity);
        ctx.font = `italic ${m.size * 1.05}rem Georgia, serif`;
        ctx.fillStyle = m.color;
        ctx.textAlign = "center";
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 14;
        ctx.fillText(m.text, m.x, m.y);
        ctx.restore();
        return m.opacity > 0;
      });

      state.animId = requestAnimationFrame(loop);
    };

    resize();
    state.animId = requestAnimationFrame(loop);

    return () => {
      state.running = false;
      cancelAnimationFrame(state.animId);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", resize);
    };
  }, [gameState]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "block",
          touchAction: "none",
          opacity: leaving ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      />

      <button
        onClick={goHome}
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

      <div
        style={{
          position: "fixed",
          top: "1.2rem",
          right: "1.5rem",
          zIndex: 20,
          fontFamily: "Georgia, serif",
          color: "rgba(255,180,210,0.9)",
          fontSize: "1rem",
          letterSpacing: "0.1em",
          textShadow: "0 0 12px rgba(255,107,157,0.4)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "1rem", letterSpacing: "0.05em" }}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>
              ♥
            </span>
          ))}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            color: "#c084fc",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          nv.{level}
        </span>
        <span>
          <span
            style={{
              fontSize: "0.65rem",
              opacity: 0.6,
              marginRight: "4px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            pts
          </span>
          {score}
        </span>
      </div>

      <button
        onClick={() => setShowHelp(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 20,
          background: "rgba(20,10,35,0.7)",
          border: "1px solid rgba(192,132,252,0.2)",
          borderRadius: "50%",
          color: "rgba(200,170,255,0.6)",
          width: "34px",
          height: "34px",
          fontFamily: "Georgia, serif",
          fontSize: "0.85rem",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
        }}
      >
        ?
      </button>

      <div
        style={{
          position: "fixed",
          bottom: "1.4rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(220,200,255,0.18)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "Georgia, serif",
          zIndex: 10,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        mueve el cursor para atrapar corazones
      </div>

      {showInstructions && <InstructionsModal onClose={startGame} />}

      {showHelp && (
        <InstructionsModal onClose={() => setShowHelp(false)} onHelp />
      )}

      {gameState === "dead" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(40,5,15,0.97), rgba(7,7,9,0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>💔</div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem, 5vw, 2.2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.8rem",
            }}
          >
            ¡Casi lo logras!
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              color: "rgba(220,200,255,0.6)",
              fontStyle: "italic",
              marginBottom: "2.5rem",
            }}
          >
            Llegaste a {score} corazones. ¡Tú puedes! 💪
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={restart}
              style={{
                padding: "0.8rem 2rem",
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
              intentar de nuevo ♡
            </button>
            <button
              onClick={goHome}
              style={{
                padding: "0.8rem 2rem",
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

      {gameState === "win" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(30,5,40,0.97), rgba(7,7,9,0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            opacity: finalVisible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1.5rem",
              filter: "drop-shadow(0 0 20px rgba(255,107,157,0.8))",
            }}
          >
            ♡
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem, 5vw, 2.5rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              letterSpacing: "0.04em",
              lineHeight: 1.4,
              textShadow: "0 0 40px rgba(255,107,157,0.4)",
              marginBottom: "0.8rem",
            }}
          >
            ¡Lo lograste!
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(0.95rem, 3vw, 1.3rem)",
              color: "rgba(220,200,255,0.7)",
              fontStyle: "italic",
              marginBottom: "0.5rem",
            }}
          >
            {score} corazones atrapados.
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.2rem, 4vw, 2rem)",
              color: "#ff9ec0",
              textShadow: "0 0 30px rgba(255,107,157,0.5)",
              marginBottom: "2.5rem",
            }}
          >
            Así de lleno me tienes Hermosa. Te amo demasiado ❤️‍🩹
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={restart}
              style={{
                padding: "0.8rem 2rem",
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
              jugar de nuevo ♡
            </button>
            <button
              onClick={goHome}
              style={{
                padding: "0.8rem 2rem",
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
    </>
  );
}
