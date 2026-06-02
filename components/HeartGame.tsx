"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
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
}

const MILESTONES: Record<number, string> = {
  5: "vas muy bien ❤️",
  10: "eres increíble",
  20: "te amo mucho",
};

const FINAL_SCORE = 30;

let heartIdCounter = 0;
let msgIdCounter = 0;

export default function HeartGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const stateRef = useRef({
    playerX: 0,
    hearts: [] as Heart[],
    floatingMsgs: [] as FloatingMessage[],
    score: 0,
    frameCount: 0,
    running: true,
    animId: 0,
    lastSpawn: 0,
    milestoneShown: new Set<number>(),
    gameOver: false,
  });
  const [score, setScore] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const goHome = useCallback(() => {
    stateRef.current.running = false;
    setLeaving(true);
    setTimeout(() => router.push("/"), 500);
  }, [router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const state = stateRef.current;

    const playPop = () => {
      try {
        const ac = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.frequency.setValueAtTime(880, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ac.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + 0.18);
      } catch (_) {}
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      state.playerX = canvas.width / 2;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.playerX = e.clientX - rect.left;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      state.playerX = e.touches[0].clientX - rect.left;
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", resize);
    resize();

    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      color: string,
      alpha: number,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
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
      ctx.restore();
    };

    const loop = (timestamp: number) => {
      if (!state.running) return;
      const W = canvas.width;
      const H = canvas.height;

      const spawnInterval = Math.max(600, 1400 - state.score * 18);
      if (timestamp - state.lastSpawn > spawnInterval) {
        state.hearts.push({
          id: heartIdCounter++,
          x: 30 + Math.random() * (W - 60),
          y: -20,
          size: 14 + Math.random() * 10,
          speed: 1.4 + Math.random() * 1.2 + state.score * 0.04,
          caught: false,
          catchScale: 1,
          opacity: 1,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.03 + Math.random() * 0.02,
        });
        state.lastSpawn = timestamp;
      }

      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#070709");
      bg.addColorStop(1, "#0d0618");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const BAR_W = Math.min(120, W * 0.28);
      const BAR_H = 10;
      const BAR_Y = H - 48;
      const px = Math.max(BAR_W / 2, Math.min(W - BAR_W / 2, state.playerX));

      const grad = ctx.createLinearGradient(
        px - BAR_W / 2,
        0,
        px + BAR_W / 2,
        0,
      );
      grad.addColorStop(0, "rgba(255,107,157,0.2)");
      grad.addColorStop(0.5, "rgba(255,107,157,0.95)");
      grad.addColorStop(1, "rgba(255,107,157,0.2)");
      ctx.fillStyle = grad;
      ctx.shadowColor = "#ff6b9d";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.roundRect(px - BAR_W / 2, BAR_Y, BAR_W, BAR_H, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      state.hearts = state.hearts.filter((h) => {
        if (h.caught) {
          h.catchScale += (2.2 - h.catchScale) * 0.18;
          h.opacity -= 0.07;
          drawHeart(
            ctx,
            h.x,
            h.y,
            h.size * h.catchScale,
            "#ff9ec0",
            Math.max(0, h.opacity),
          );
          return h.opacity > 0;
        }

        h.y += h.speed;
        h.wobble += h.wobbleSpeed;
        h.x += Math.sin(h.wobble) * 0.5;

        const dx = Math.abs(h.x - px);
        const dy = Math.abs(h.y - BAR_Y);
        if (dx < BAR_W / 2 + h.size && dy < BAR_H + h.size * 1.2) {
          h.caught = true;
          state.score++;
          setScore(state.score);
          playPop();

          const milestone = state.score;
          if (MILESTONES[milestone] && !state.milestoneShown.has(milestone)) {
            state.milestoneShown.add(milestone);
            state.floatingMsgs.push({
              id: msgIdCounter++,
              text: MILESTONES[milestone],
              x: W / 2,
              y: H / 2,
              opacity: 1,
              vy: -1.2,
            });
          }

          if (state.score >= FINAL_SCORE && !state.gameOver) {
            state.gameOver = true;
            state.running = false;
            setTimeout(() => {
              setShowFinal(true);
              setTimeout(() => setFinalVisible(true), 60);
            }, 400);
          }

          return true;
        }

        if (h.y > H + 30) return false;

        const col = h.size > 20 ? "#ffb3d4" : "#ff7eb5";
        drawHeart(ctx, h.x, h.y, h.size, col, h.opacity);
        return true;
      });

      state.floatingMsgs = state.floatingMsgs.filter((m) => {
        m.y += m.vy;
        m.opacity -= 0.012;
        ctx.save();
        ctx.globalAlpha = Math.max(0, m.opacity);
        ctx.font = "italic 1.1rem Georgia, serif";
        ctx.fillStyle = "#f8d4ef";
        ctx.textAlign = "center";
        ctx.shadowColor = "#ff6b9d";
        ctx.shadowBlur = 12;
        ctx.fillText(m.text, m.x, m.y);
        ctx.restore();
        return m.opacity > 0;
      });

      state.animId = requestAnimationFrame(loop);
    };

    state.animId = requestAnimationFrame(loop);

    return () => {
      state.running = false;
      cancelAnimationFrame(state.animId);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#070709",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <button
        onClick={goHome}
        style={{
          position: "fixed",
          top: "1.2rem",
          left: "1.2rem",
          zIndex: 10,
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
          zIndex: 10,
          fontFamily: "Georgia, serif",
          color: "rgba(255,180,210,0.8)",
          fontSize: "1rem",
          letterSpacing: "0.1em",
          textShadow: "0 0 12px rgba(255,107,157,0.4)",
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            opacity: 0.6,
            marginRight: "6px",
            verticalAlign: "middle",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          corazones
        </span>
        {score}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          touchAction: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: "1.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(220,200,255,0.2)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "Georgia, serif",
          zIndex: 10,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        mueve el cursor para atrapar corazones ♡
      </div>

      {showFinal && (
        <div
          onClick={goHome}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(30,5,40,0.97) 0%, rgba(7,7,9,0.99) 70%)",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            opacity: finalVisible ? 1 : 0,
            transition: "opacity 0.8s ease",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "2rem",
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
              lineHeight: 1.5,
              textShadow: "0 0 40px rgba(255,107,157,0.4)",
              marginBottom: "1rem",
            }}
          >
            ¡Lo lograste!
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
              color: "rgba(220,200,255,0.8)",
              fontStyle: "italic",
              marginBottom: "0.8rem",
            }}
          >
            Atrapaste {FINAL_SCORE} corazones.
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.2rem, 4vw, 2rem)",
              color: "#ff9ec0",
              textShadow: "0 0 30px rgba(255,107,157,0.5)",
              marginBottom: "3rem",
            }}
          >
            Así de lleno me tienes. Te amo. 💗
          </p>
          <p
            style={{
              fontSize: "0.7rem",
              color: "rgba(220,200,255,0.25)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            toca para continuar
          </p>
        </div>
      )}
    </div>
  );
}
