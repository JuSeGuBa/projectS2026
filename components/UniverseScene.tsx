"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { STARS, StarData } from "./starData";
import { useRouter } from "next/navigation";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  color: string;
}

const COLORS = ["#ffffff", "#dde8ff", "#ffd8ee", "#e8d8ff", "#fffbe0"];

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: 800 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * Math.random() * 1.8 + 0.2,
    opacity: Math.random() * 0.7 + 0.15,
    speed: Math.random() * 0.5 + 0.15,
    phase: Math.random() * Math.PI * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

interface Star2D {
  id: number;
  x: number;
  y: number;
  baseY: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  special: boolean;
  data: StarData;
  phase: number;
  floatAmp: number;
  floatSpeed: number;
}

const hexToRgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
  color: string,
  glowColor: string,
  glowAlpha: number,
  special: boolean,
  pulse: number,
) {
  const { r: gr, g: gg, b: gb } = hexToRgb(glowColor);

  // Glow
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR * 5);
  grd.addColorStop(0, `rgba(${gr},${gg},${gb},${glowAlpha})`);
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR * 5, 0, Math.PI * 2);
  ctx.fill();

  // Star shape
  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = outerR * 3;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const rad = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * rad;
    const y = cy + Math.sin(angle) * rad;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();

  const fill = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
  fill.addColorStop(0, "#ffffff");
  fill.addColorStop(0.5, color);
  fill.addColorStop(1, glowColor);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();

  // Extra cross rays for special star
  if (special) {
    const rayLen = outerR * 5 * pulse;
    ctx.save();
    ctx.strokeStyle = `rgba(255,180,210,${0.35 * pulse})`;
    ctx.lineWidth = 1;
    for (let a = 0; a < 4; a++) {
      const angle = (a * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.lineTo(cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export default function UniverseScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [showFinal, setShowFinal] = useState(false);
  const [finalPhase, setFinalPhase] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const stateRef = useRef<{
    particles: Particle[];
    stars: Star2D[];
    hoveredId: number | null;
    animId: number;
    running: boolean;
    time: number;
  }>({
    particles: [],
    stars: [],
    hoveredId: null,
    animId: 0,
    running: true,
    time: 0,
  });

  const goHome = useCallback(() => {
    stateRef.current.running = false;
    setLeaving(true);
    setTimeout(() => router.push("/"), 500);
  }, [router]);

  const restartLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const state = stateRef.current;
    state.running = true;

    const loop = () => {
      if (!state.running) return;
      const W = canvas.width;
      const H = canvas.height;
      state.time += 0.012;

      const bg = ctx.createRadialGradient(
        W / 2,
        H * 0.4,
        0,
        W / 2,
        H * 0.4,
        Math.max(W, H) * 0.9,
      );
      bg.addColorStop(0, "#0d0418");
      bg.addColorStop(1, "#040208");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      state.particles.forEach((p) => {
        const twinkle = Math.sin(state.time * p.speed + p.phase) * 0.4 + 0.6;
        const { r, g, b } = hexToRgb(p.color);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity * twinkle})`;
        ctx.fill();
      });

      state.stars.forEach((star) => {
        const hovered = state.hoveredId === star.id;
        const pulse = star.special
          ? 1 + Math.sin(state.time * 2.2 + star.phase) * 0.15
          : 1 + Math.sin(state.time * 1.4 + star.phase) * 0.08;
        star.y =
          star.baseY +
          Math.sin(state.time * star.floatSpeed + star.phase) * star.floatAmp;
        const outerR = star.baseRadius * pulse * (hovered ? 1.6 : 1);
        const innerR = outerR * (star.special ? 0.38 : 0.42);
        const points = star.special ? 6 : 4;
        const glowAlpha = hovered ? 0.55 : star.special ? 0.35 : 0.2;

        drawStar(
          ctx,
          star.x,
          star.y,
          outerR,
          innerR,
          points,
          star.color,
          star.glowColor,
          glowAlpha,
          star.special,
          pulse,
        );
      });

      state.animId = requestAnimationFrame(loop);
    };
    loop();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = stateRef.current;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      state.particles = createParticles(canvas.width, canvas.height);
      state.stars = STARS.map((s) => {
        const nx = (s.position[0] / 10) * 0.38 + 0.5;
        const ny = (s.position[1] / 10) * 0.38 + 0.5;
        const baseY = ny * canvas.height;
        return {
          id: s.id,
          x: nx * canvas.width,
          y: baseY,
          baseY,
          baseRadius: s.special ? 13 : 6,
          color: s.special ? "#ffb3d4" : "#c8a0f0",
          glowColor: s.special ? "#ff6b9d" : "#9060d0",
          special: !!s.special,
          data: s,
          phase: Math.random() * Math.PI * 2,
          floatAmp: 4 + Math.random() * 4,
          floatSpeed: 0.4 + Math.random() * 0.3,
          radius: s.special ? 13 : 6,
        };
      });
    };

    resize();
    restartLoop();
    window.addEventListener("resize", resize);
    return () => {
      state.running = false;
      cancelAnimationFrame(state.animId);
      window.removeEventListener("resize", resize);
    };
  }, [restartLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = stateRef.current;

    const getPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };
    const hitTest = (x: number, y: number) =>
      state.stars.find(
        (s) => Math.hypot(s.x - x, s.y - y) < s.baseRadius * 3 + 10,
      );

    const onMove = (e: MouseEvent) => {
      const { x, y } = getPos(e.clientX, e.clientY);
      const hit = hitTest(x, y);
      state.hoveredId = hit ? hit.id : null;
      canvas.style.cursor = hit ? "pointer" : "default";
    };
    const handleHit = (hit: Star2D | undefined) => {
      if (!hit) return;
      if (hit.special) {
        state.running = false;
        setShowFinal(true);
        setTimeout(() => setFinalPhase(1), 400);
        setTimeout(() => setFinalPhase(2), 1200);
      } else {
        setSelectedStar(hit.data);
      }
    };
    const onClick = (e: MouseEvent) =>
      handleHit(
        hitTest(
          ...(Object.values(getPos(e.clientX, e.clientY)) as [number, number]),
        ),
      );
    const onTouch = (e: TouchEvent) =>
      handleHit(
        hitTest(
          ...(Object.values(
            getPos(e.touches[0].clientX, e.touches[0].clientY),
          ) as [number, number]),
        ),
      );

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchend", onTouch);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchend", onTouch);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <button
        onClick={goHome}
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "1.5rem",
          zIndex: 10,
          background: "rgba(20,10,35,0.7)",
          border: "1px solid rgba(192,132,252,0.2)",
          borderRadius: "2px",
          color: "rgba(220,200,255,0.55)",
          padding: "0.5rem 1rem",
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
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(220,200,255,0.25)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "Georgia, serif",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        toca las estrellas ✦
      </div>

      {selectedStar && (
        <div
          onClick={() => setSelectedStar(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(7,7,9,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background:
                "linear-gradient(135deg, rgba(20,10,35,0.98), rgba(12,8,22,0.98))",
              border: "1px solid rgba(255,107,157,0.25)",
              borderRadius: "4px",
              padding: "2.5rem",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 0 60px rgba(192,84,252,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "1.3rem",
                  color: "#f8d4ef",
                  fontWeight: 300,
                }}
              >
                {selectedStar.title}
              </h2>
              <button
                onClick={() => setSelectedStar(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(220,200,255,0.4)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, rgba(255,107,157,0.4), transparent)",
                marginBottom: "1.5rem",
              }}
            />
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1rem",
                color: "rgba(220,200,255,0.85)",
                lineHeight: 1.75,
                fontStyle: "italic",
              }}
            >
              {selectedStar.message}
            </p>
            <div style={{ marginTop: "2rem", textAlign: "right" }}>
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  color: "rgba(255,107,157,0.45)",
                  textTransform: "uppercase",
                }}
              >
                ✦ esto es lo que pienso y siento por ti ✦
              </span>
            </div>
          </div>
        </div>
      )}

      {showFinal && (
        <div
          onClick={() => {
            setShowFinal(false);
            setFinalPhase(0);
            restartLoop();
          }}
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
            cursor: "pointer",
            opacity: finalPhase >= 1 ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <div
            style={{
              fontSize: "3.5rem",
              marginBottom: "2rem",
              filter: "drop-shadow(0 0 20px rgba(255,107,157,0.8))",
            }}
          >
            ♡
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              letterSpacing: "0.04em",
              lineHeight: 1.4,
              textShadow: "0 0 40px rgba(255,107,157,0.4)",
              marginBottom: "1.5rem",
              opacity: finalPhase >= 1 ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          >
            Mas que mi espacio, mi universo, eres mi mundo, eres literalmente mi
            vida. Incondicionalmente te amo, y aunque a veces me cueste
            expresarlo, no me importa el dinero, ni el tiempo, ni nada, solo me
            importas tu y solo tu. Te Amo 3 millones ❤️‍🩹
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
              fontWeight: 300,
              color: "#ff9ec0",
              letterSpacing: "0.04em",
              textShadow: "0 0 40px rgba(255,107,157,0.5)",
              marginBottom: "3rem",
              opacity: finalPhase >= 2 ? 1 : 0,
              transition: "opacity 0.8s ease 0.4s",
            }}
          >
            Te amo ❤️‍🩹
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(220,200,255,0.3)",
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
