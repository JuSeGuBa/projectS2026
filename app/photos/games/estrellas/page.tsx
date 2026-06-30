"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Star {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: string;
  points: number;
  isSpecial: boolean;
  pulse: number;
  opacity: number;
  caught: boolean;
  catchScale: number;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  opacity: number;
  hit: boolean;
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

interface FloatingMsg {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  vy: number;
  color: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const GOAL = 50;
const MAX_LIVES = 3;
let sid = 0;
let cid = 0;
let fid = 0;

const STAR_COLORS = [
  { fill: "#ffd97a", glow: "#f59e0b" },
  { fill: "#ff9ec0", glow: "#ff6b9d" },
  { fill: "#c084fc", glow: "#a855f7" },
  { fill: "#a5f3fc", glow: "#22d3ee" },
];

const MESSAGES: Record<number, string> = {
  5: "¡5 estrellas! Vamossss ✨",
  10: "¡10! Como tu preciosa 10/10 🌟",
  15: "¡Mitad! ¡Cuidado con las nubessss! ☁️",
  20: "¡20! ¡Ya casi Reina! 👑",
  25: "¡Mitad del camino! Se viene más jiji... 👀",
  30: "¡30! ¡Eres la mejor te amooo! 🔥",
  40: "¡40! ¡Solo 10 más! VAMOSSSS 🎉",
  45: "¡5 más y ganas! REINAAAAA 👑",
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StarDodge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const state = useRef({
    px: 0,
    py: 0, // player position
    targetX: 0,
    targetY: 0,
    stars: [] as Star[],
    clouds: [] as Cloud[],
    particles: [] as Particle[],
    msgs: [] as FloatingMsg[],
    score: 0,
    lives: MAX_LIVES,
    level: 1,
    running: true,
    animId: 0,
    lastStarSpawn: 0,
    lastCloudSpawn: 0,
    msgsShown: new Set<number>(),
    gameOver: false,
    invincible: false,
    invincibleUntil: 0,
    combo: 0,
  });

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<
    "waiting" | "playing" | "dead" | "win"
  >("waiting");
  const [finalVisible, setFinalVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music/wonderewall.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    const play = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", play);
    };
    window.addEventListener("click", play);
    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", play);
    };
  }, []);

  const goBack = useCallback(() => {
    state.current.running = false;
    setLeaving(true);
    setTimeout(() => router.push("/photos/games"), 500);
  }, [router]);

  const restart = useCallback(() => {
    const s = state.current;
    s.stars = [];
    s.clouds = [];
    s.particles = [];
    s.msgs = [];
    s.score = 0;
    s.lives = MAX_LIVES;
    s.level = 1;
    s.running = true;
    s.lastStarSpawn = 0;
    s.lastCloudSpawn = 0;
    s.msgsShown = new Set();
    s.gameOver = false;
    s.invincible = false;
    s.combo = 0;
    const W = window.innerWidth,
      H = window.innerHeight;
    s.px = W / 2;
    s.py = H * 0.7;
    s.targetX = W / 2;
    s.targetY = H * 0.7;
    setScore(0);
    setLives(MAX_LIVES);
    setLevel(1);
    setFinalVisible(false);
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = state.current;
    s.running = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!s.px) {
        s.px = canvas.width / 2;
        s.py = canvas.height * 0.7;
      }
    };

    const addMsg = (text: string, x: number, y: number, color = "#f8d4ef") => {
      s.msgs.push({ id: fid++, text, x, y, opacity: 1, vy: -1.5, color });
    };

    const spawnParticles = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        s.particles.push({
          x,
          y,
          vx: Math.cos(a) * (1.5 + Math.random() * 3.5),
          vy: Math.sin(a) * (1.5 + Math.random() * 3.5),
          opacity: 1,
          color,
          size: 1.5 + Math.random() * 3,
        });
      }
    };

    // Input — mouse
    const onMouseMove = (e: MouseEvent) => {
      s.targetX = e.clientX;
      s.targetY = e.clientY;
    };
    // Input — touch
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      s.targetX = e.touches[0].clientX;
      s.targetY = e.touches[0].clientY;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", resize);
    resize();

    // ── Draw heart shape (player) ──
    const drawHeart = (
      cx: number,
      cy: number,
      size: number,
      color: string,
      glow: string,
      alpha: number,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = glow;
      ctx.shadowBlur = 16;
      ctx.fillStyle = color;
      ctx.beginPath();
      const s2 = size * 0.5;
      ctx.moveTo(cx, cy + s2 * 0.8);
      ctx.bezierCurveTo(
        cx - s2 * 2,
        cy - s2 * 0.4,
        cx - s2 * 2,
        cy - s2 * 1.6,
        cx,
        cy - s2 * 0.8,
      );
      ctx.bezierCurveTo(
        cx + s2 * 2,
        cy - s2 * 1.6,
        cx + s2 * 2,
        cy - s2 * 0.4,
        cx,
        cy + s2 * 0.8,
      );
      ctx.fill();
      ctx.restore();
    };

    // ── Draw star ──
    const drawStar = (
      cx: number,
      cy: number,
      r: number,
      color: string,
      glow: string,
      alpha: number,
      pts = 5,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = glow;
      ctx.shadowBlur = 18;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const angle = (i * Math.PI) / pts - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.42;
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ── Draw cloud ──
    const drawCloud = (cl: Cloud, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha * 0.72;
      ctx.fillStyle = cl.hit ? "#8888aa" : "#9090b8";
      ctx.shadowColor = cl.hit ? "#ff4466" : "#6060a0";
      ctx.shadowBlur = cl.hit ? 20 : 6;
      // puffball cloud shape
      const cx = cl.x,
        cy = cl.y,
        w = cl.w,
        h = cl.h;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.5, h * 0.42, 0, 0, Math.PI * 2);
      ctx.ellipse(
        cx - w * 0.28,
        cy + h * 0.08,
        w * 0.3,
        h * 0.32,
        0,
        0,
        Math.PI * 2,
      );
      ctx.ellipse(
        cx + w * 0.28,
        cy + h * 0.08,
        w * 0.3,
        h * 0.32,
        0,
        0,
        Math.PI * 2,
      );
      ctx.ellipse(
        cx - w * 0.14,
        cy + h * 0.22,
        w * 0.38,
        h * 0.28,
        0,
        0,
        Math.PI * 2,
      );
      ctx.ellipse(
        cx + w * 0.14,
        cy + h * 0.22,
        w * 0.38,
        h * 0.28,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();
    };

    const loop = (ts: number) => {
      if (!s.running) return;
      const W = canvas.width,
        H = canvas.height;
      const now = ts;

      // Level
      const newLevel = Math.min(16, 1 + Math.floor(s.score / 3));
      if (newLevel !== s.level) {
        s.level = newLevel;
        setLevel(newLevel);
        if (newLevel >= 3)
          addMsg(`⚡ Nivel ${newLevel}`, W / 2, H * 0.3, "#ffd97a");
      }

      // Invincible timer
      if (s.invincible && now > s.invincibleUntil) s.invincible = false;

      // Smooth player movement
      s.px += (s.targetX - s.px) * 0.12;
      s.py += (s.targetY - s.py) * 0.12;
      s.px = Math.max(20, Math.min(W - 20, s.px));
      s.py = Math.max(20, Math.min(H - 20, s.py));

      // Spawn stars
      const starInterval = Math.max(200, 1300 - s.level * 110);
      const multiStar =
        s.level >= 12 ? 4 : s.level >= 8 ? 3 : s.level >= 5 ? 2 : 1;
      if (now - s.lastStarSpawn > starInterval) {
        for (let si = 0; si < multiStar; si++) {
          const isSpecial = Math.random() < 0.1 + s.level * 0.025;
          const c = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
          const edge = Math.floor(Math.random() * 4);
          let sx = 0,
            sy = 0,
            svx = 0,
            svy = 0;
          const spd = 1.2 + s.level * 0.32 + Math.random() * 0.8;
          if (edge === 0) {
            sx = Math.random() * W;
            sy = -20;
            svx = (Math.random() - 0.5) * 1.5;
            svy = spd;
          } else if (edge === 1) {
            sx = W + 20;
            sy = Math.random() * H;
            svx = -spd;
            svy = (Math.random() - 0.5) * 1.5;
          } else if (edge === 2) {
            sx = Math.random() * W;
            sy = H + 20;
            svx = (Math.random() - 0.5) * 1.5;
            svy = -spd;
          } else {
            sx = -20;
            sy = Math.random() * H;
            svx = spd;
            svy = (Math.random() - 0.5) * 1.5;
          }
          s.stars.push({
            id: sid++,
            x: sx,
            y: sy,
            vx: svx,
            vy: svy,
            radius: isSpecial ? 18 : 10 + Math.random() * 6,
            color: isSpecial ? "#ffd97a" : c.fill,
            glow: isSpecial ? "#f59e0b" : c.glow,
            points: isSpecial ? 3 : 1,
            isSpecial,
            pulse: Math.random() * Math.PI * 2,
            opacity: 1,
            caught: false,
            catchScale: 1,
          });
        }
        s.lastStarSpawn = now;
      }

      // Spawn clouds
      const cloudInterval = Math.max(280, 1800 - s.level * 140);
      if (now - s.lastCloudSpawn > cloudInterval) {
        const spd = 1.1 + s.level * 0.45 + Math.random() * 0.6;
        const fromSide = s.level < 4 || Math.random() < 0.45;
        if (fromSide) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const cy = H * (0.1 + Math.random() * 0.8);
          s.clouds.push({
            id: cid++,
            x: side < 0 ? -80 : W + 80,
            y: cy,
            vx: -side * spd, // CORREGIDO: Se cambia 'side * spd' por '-side * spd' para que entren a la pantalla
            vy: (Math.random() - 0.5) * 0.6,
            w: 80 + Math.random() * 50 + s.level * 8,
            h: 44 + Math.random() * 24 + s.level * 4,
            opacity: 1,
            hit: false,
          });
        } else {
          // nubes que caen desde arriba en niveles 6+
          s.clouds.push({
            id: cid++,
            x: W * (0.1 + Math.random() * 0.8),
            y: -80,
            vx: (Math.random() - 0.5) * 0.8,
            vy: spd * 0.7,
            w: 80 + Math.random() * 40,
            h: 44 + Math.random() * 20,
            opacity: 1,
            hit: false,
          });
        }
        s.lastCloudSpawn = now;
      }

      // Background — dark purple gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#07040e");
      bg.addColorStop(1, s.level >= 7 ? "#0e0520" : "#0d0618");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      if (s.level >= 6) {
        ctx.save();
        ctx.globalAlpha = (s.level - 5) * 0.015;
        ctx.fillStyle = "#4400aa";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      // Progress bar
      const prog = Math.min(s.score / GOAL, 1);
      const bw = W * 0.6,
        bx = (W - bw) / 2,
        by = 18;
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, 4, 2);
      ctx.fill();
      if (prog > 0) {
        const pg = ctx.createLinearGradient(bx, 0, bx + bw * prog, 0);
        pg.addColorStop(0, "#ffd97a");
        pg.addColorStop(1, "#c084fc");
        ctx.fillStyle = pg;
        ctx.shadowColor = "#ffd97a";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw * prog, 4, 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Stars
      s.stars = s.stars.filter((st) => {
        if (st.caught) {
          st.catchScale += (2.8 - st.catchScale) * 0.14;
          st.opacity -= 0.06;
          drawStar(
            st.x,
            st.y,
            st.radius * st.catchScale,
            st.color,
            st.glow,
            Math.max(0, st.opacity),
          );
          return st.opacity > 0;
        }

        st.x += st.vx;
        st.y += st.vy;
        st.pulse += 0.06;
        const pulse = 1 + Math.sin(st.pulse) * 0.1;

        // Off screen — remove silently
        if (st.x < -40 || st.x > W + 40 || st.y < -40 || st.y > H + 40)
          return false;

        // Collect
        if (Math.hypot(st.x - s.px, st.y - s.py) < st.radius + 16) {
          st.caught = true;
          spawnParticles(st.x, st.y, st.color);
          s.score += st.points;
          s.combo++;
          setScore(s.score);
          if (st.points > 1) addMsg(`+3 ⭐`, st.x, st.y - 20, "#ffd97a");
          else addMsg(`+1 ✨`, st.x, st.y - 20, st.color);
          if (s.combo >= 4) {
            s.score += 1;
            setScore(s.score);
            addMsg("¡combo! 🔥 +1", st.x, st.y - 44, "#fb923c");
            s.combo = 0;
          }
          if (MESSAGES[s.score] && !s.msgsShown.has(s.score)) {
            s.msgsShown.add(s.score);
            addMsg(MESSAGES[s.score], W / 2, H * 0.38, "#f8d4ef");
          }
          if (s.score >= GOAL && !s.gameOver) {
            s.gameOver = true;
            s.running = false;
            setTimeout(() => {
              setGameState("win");
              setTimeout(() => setFinalVisible(true), 100);
            }, 400);
          }
          return true;
        }

        drawStar(st.x, st.y, st.radius * pulse, st.color, st.glow, 1);
        return true;
      });

      // Clouds
      s.clouds = s.clouds.filter((cl) => {
        cl.x += cl.vx;
        cl.y += cl.vy;

        // Off screen
        if (cl.x < -120 || cl.x > W + 120 || cl.y < -60 || cl.y > H + 60)
          return false;

        // Collision with player
        if (!s.invincible && !cl.hit) {
          const dx = Math.abs(cl.x - s.px),
            dy = Math.abs(cl.y - s.py);
          if (dx < cl.w * 0.45 && dy < cl.h * 0.45) {
            cl.hit = true;
            s.lives = Math.max(0, s.lives - 1);
            setLives(s.lives);
            s.combo = 0;
            s.invincible = true;
            s.invincibleUntil = now + 1000;
            spawnParticles(s.px, s.py, "#ff4466", 12);
            addMsg("💔 ¡nube!", s.px, s.py - 30, "#ff4466");
            if (s.lives <= 0 && !s.gameOver) {
              s.gameOver = true;
              s.running = false;
              setTimeout(() => setGameState("dead"), 400);
            }
          }
        }

        drawCloud(cl, cl.hit ? Math.max(0.2, cl.opacity) : 1);
        return true;
      });

      // Particles
      s.particles = s.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.opacity -= 0.028;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return p.opacity > 0;
      });

      // Player heart
      const invBlink = s.invincible ? Math.sin(now * 0.018) > 0 : true;
      if (invBlink) {
        drawHeart(s.px, s.py, 20, "#ff7eb5", "#ff6b9d", 1);
        // Trail
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.shadowColor = "#ff6b9d";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(s.px, s.py, 22, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6b9d";
        ctx.fill();
        ctx.restore();
      }

      // Floating messages
      s.msgs = s.msgs.filter((m) => {
        m.y += m.vy;
        m.opacity -= 0.009;
        ctx.save();
        ctx.globalAlpha = Math.max(0, m.opacity);
        ctx.font = `italic 1rem Georgia, serif`;
        ctx.fillStyle = m.color;
        ctx.textAlign = "center";
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 12;
        ctx.fillText(m.text, m.x, m.y);
        ctx.restore();
        return m.opacity > 0;
      });

      // Hint
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#f8d4ef";
      ctx.font = "0.6rem Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(
        "mueve el cursor / dedo para guiar el corazón ✦",
        W / 2,
        H - 20,
      );
      ctx.restore();

      s.animId = requestAnimationFrame(loop);
    };

    s.animId = requestAnimationFrame(loop);
    return () => {
      s.running = false;
      cancelAnimationFrame(s.animId);
      canvas.removeEventListener("mousemove", onMouseMove);
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

      {/* Back */}
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

      {/* HUD */}
      <div
        style={{
          position: "fixed",
          top: "1.2rem",
          right: "1.5rem",
          zIndex: 20,
          fontFamily: "Georgia, serif",
          color: "rgba(255,220,120,0.9)",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>
              ♥
            </span>
          ))}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            color: "#ffd97a",
            letterSpacing: "0.15em",
          }}
        >
          nv.{level}
        </span>
        <span>
          <span style={{ fontSize: "0.65rem", opacity: 0.6, marginRight: 4 }}>
            pts
          </span>
          {score}
        </span>
      </div>

      {/* Waiting */}
      {gameState === "waiting" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background:
              "radial-gradient(ellipse at 50% 50%,rgba(20,5,35,0.97),rgba(7,4,14,0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>⭐</div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem,5vw,2.4rem)",
              fontWeight: 300,
              color: "#fde8d0",
              marginBottom: "1rem",
            }}
          >
            Atrapa las Estrellas Hermosa
          </h1>
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right,transparent,rgba(255,217,122,0.3),transparent)",
              marginBottom: "1.2rem",
              width: "200px",
            }}
          />
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              color: "rgba(220,200,255,0.6)",
              fontStyle: "italic",
              marginBottom: "0.6rem",
              maxWidth: 320,
            }}
          >
            Guía el corazón para atrapar estrellas y esquivar las nubes grises.
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.82rem",
              color: "rgba(200,170,255,0.45)",
              marginBottom: "2rem",
              maxWidth: 300,
            }}
          >
            ⭐ Estrella normal → +1 · 🌟 Dorada → +3 · ☁️ Nube → pierdes una
            vida
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.8rem",
              color: "rgba(220,200,255,0.35)",
              fontStyle: "italic",
              marginBottom: "2rem",
            }}
          >
            Meta: {GOAL} estrellas · 4 seguidas = combo +1
          </p>
          <button
            onClick={restart}
            style={{
              padding: "0.9rem 2.5rem",
              background:
                "linear-gradient(135deg,rgba(255,217,122,0.18),rgba(192,132,252,0.12))",
              border: "1px solid rgba(255,217,122,0.35)",
              borderRadius: "3px",
              color: "#fde8d0",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            ¡Jugarrrrrrr jijijij! ⭐
          </button>
        </div>
      )}

      {/* Dead */}
      {gameState === "dead" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background:
              "radial-gradient(ellipse at 50% 50%,rgba(40,5,15,0.97),rgba(7,7,9,0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>☁️</div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem,5vw,2.2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.8rem",
            }}
          >
            ¡Las nubes ganaron esta vez aisssss!
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
            Llegaste a {score} estrellas. ¡El corazón siempre puede más! 💪
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
                  "linear-gradient(135deg,rgba(255,107,157,0.15),rgba(192,132,252,0.1))",
                border: "1px solid rgba(255,107,157,0.35)",
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              intentar de nuevo ♡
            </button>
            <button
              onClick={goBack}
              style={{
                padding: "0.8rem 2rem",
                background: "transparent",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "3px",
                color: "rgba(200,170,255,0.5)",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              volver
            </button>
          </div>
        </div>
      )}

      {/* Win */}
      {gameState === "win" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background:
              "radial-gradient(ellipse at 50% 50%,rgba(30,5,40,0.97),rgba(7,7,9,0.99))",
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
              filter: "drop-shadow(0 0 20px rgba(255,217,122,0.8))",
            }}
          >
            🌟
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem,5vw,2.5rem)",
              fontWeight: 300,
              color: "#fde8d0",
              marginBottom: "0.8rem",
              textShadow: "0 0 40px rgba(255,217,122,0.4)",
            }}
          >
            ¡Todas las estrellas capturadas ututuiiiiii! 🌟
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1rem,3vw,1.4rem)",
              color: "#ff9ec0",
              textShadow: "0 0 30px rgba(255,107,157,0.5)",
              marginBottom: "2.5rem",
            }}
          >
            Tú eres la estrella más brillante de mi universo. Erea mi mundo
            entero. Te Amo Demasiado❤️‍🩹
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
                  "linear-gradient(135deg,rgba(255,107,157,0.15),rgba(192,132,252,0.1))",
                border: "1px solid rgba(255,107,157,0.35)",
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              jugar de nuevo ♡
            </button>
            <button
              onClick={goBack}
              style={{
                padding: "0.8rem 2rem",
                background: "transparent",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "3px",
                color: "rgba(200,170,255,0.5)",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
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
