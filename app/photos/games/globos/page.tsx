"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Balloon {
  id: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
  radius: number;
  color: string;
  glow: string;
  word: string;
  popped: boolean;
  popScale: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  points: number;
  isSpecial: boolean;
  isBad: boolean;
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

const GOAL = 100;
const MAX_LIVES = 3;
let bid = 0,
  mid = 0;

const WORDS = [
  "Te Amo",
  "Mi Vida",
  "Hermosa",
  "Reina 👑",
  "Mi Todo",
  "Preciosa",
  "Mi Paz",
  "Mi Luz",
  "Corazón",
  "Amor",
  "Mi Cielo",
  "Bella",
  "Única",
  "Especial",
  "Mi Mundo",
  "Mi todo",
  "Mi pedazito de mi vida",
  "Juntos",
  "Siempre",
  "Te amo tanto de verdad",
  "Te Adoro",
  "Eres mi todo",
  "Mi Diosa",
  "Vida Mía",
];
const BAD_WORDS = ["Mentira", "Adiós", "Jamás", "Nunca", "Olvido"];
const COLORS = [
  { fill: "#ff7eb5", glow: "#ff6b9d" },
  { fill: "#c084fc", glow: "#a855f7" },
  { fill: "#fb923c", glow: "#f97316" },
  { fill: "#f472b6", glow: "#ec4899" },
  { fill: "#a78bfa", glow: "#8b5cf6" },
];
const MILESTONES: Record<number, string> = {
  5: "¡5 globitos! Siuuuuu 🎈",
  10: "¡10! Isssssss! 💜",
  15: "¡15! ¡Cuidado amor con los oscuros! ⚠️",
  20: "¡20! ¡Ya casi Reina! 👑",
  25: "¡Mitad del camino! 🌟 Se viene más...",
  30: "¡30! ¡Eres la mejor preciosa! 🔥",
  40: "¡40! ¡Vas 40! VAMOS 🎉",
  45: "¡Ya casi en la mitadddd! REINAAAAA 👑",
};

function getDiffConfig(level: number) {
  const l = Math.min(level, 20);
  return {
    spawnInterval: Math.max(180, 1600 - l * 90),
    baseSpeed: 0.7 + l * 0.22,
    badChance: Math.min(0.45, (l - 2) * 0.035),
    goldChance: l >= 3 ? 0.1 : 0.07,
    wobbleAmp: 0.5 + l * 0.12,
    multiSpawn:
      l >= 14 ? 3 : l >= 8 ? 2 : l >= 5 && Math.random() < 0.4 ? 2 : 1,
  };
}

export default function BalloonGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const state = useRef({
    balloons: [] as Balloon[],
    particles: [] as Particle[],
    msgs: [] as FloatingMsg[],
    score: 0,
    lives: MAX_LIVES,
    level: 1,
    running: true,
    animId: 0,
    lastSpawn: 0,
    milestoneShown: new Set<number>(),
    gameOver: false,
    spawnCount: 0,
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
    const audio = new Audio("/music/You'reSpecial.mp3");
    audio.loop = true;
    audio.volume = 0.35;
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
    s.balloons = [];
    s.particles = [];
    s.msgs = [];
    s.score = 0;
    s.lives = MAX_LIVES;
    s.level = 1;
    s.running = true;
    s.lastSpawn = 0;
    s.milestoneShown = new Set();
    s.gameOver = false;
    s.spawnCount = 0;
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
    const ctx = canvas.getContext("2d", { willReadFrequently: false })!;
    const s = state.current;
    s.running = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const addMsg = (text: string, x: number, y: number, color = "#f8d4ef") => {
      s.msgs.push({ id: mid++, text, x, y, opacity: 1, vy: -1.8, color });
    };

    const spawnParticles = (x: number, y: number, color: string, n = 8) => {
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n;
        s.particles.push({
          x,
          y,
          vx: Math.cos(a) * (2 + Math.random() * 4),
          vy: Math.sin(a) * (2 + Math.random() * 4),
          opacity: 1,
          color,
          size: 2 + Math.random() * 4,
        });
      }
    };

    const spawnBalloon = (
      W: number,
      H: number,
      diff: ReturnType<typeof getDiffConfig>,
      isBad: boolean,
      isSpecial: boolean,
    ) => {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      const word = isBad
        ? BAD_WORDS[Math.floor(Math.random() * BAD_WORDS.length)]
        : WORDS[Math.floor(Math.random() * WORDS.length)];
      s.balloons.push({
        id: bid++,
        x: 50 + Math.random() * (W - 100),
        y: H + 40 + Math.random() * 60,
        vy: -(diff.baseSpeed + Math.random() * 0.5),
        vx: (Math.random() - 0.5) * diff.wobbleAmp,
        radius: isBad ? 30 : isSpecial ? 42 : 26 + Math.random() * 14,
        color: isBad ? "#4a4a6a" : isSpecial ? "#ffd97a" : c.fill,
        glow: isBad ? "#220022" : isSpecial ? "#f59e0b" : c.glow,
        word,
        popped: false,
        popScale: 1,
        opacity: 1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02,
        points: isSpecial ? 3 : isBad ? 0 : 1,
        isSpecial,
        isBad,
      });
    };

    const pop = (cx: number, cy: number) => {
      const hit = s.balloons.find(
        (b) => !b.popped && Math.hypot(b.x - cx, b.y - cy) < b.radius + 12,
      );
      if (!hit) return;
      hit.popped = true;
      if (hit.isBad) {
        spawnParticles(hit.x, hit.y, "#ff0044", 8);
        s.lives = Math.max(0, s.lives - 1);
        setLives(s.lives);
        addMsg("💀 ¡ese era malo!", hit.x, hit.y - 20, "#ff4466");
        if (s.lives <= 0 && !s.gameOver) {
          s.gameOver = true;
          s.running = false;
          setTimeout(() => setGameState("dead"), 400);
        }
        return;
      }
      spawnParticles(hit.x, hit.y, hit.color);
      s.score += hit.points;
      setScore(s.score);
      if (hit.points > 1) addMsg(`+${hit.points} 🌟`, hit.x, hit.y, "#ffd97a");
      else addMsg("+1 💜", hit.x, hit.y, hit.color);
      if (MILESTONES[s.score] && !s.milestoneShown.has(s.score)) {
        s.milestoneShown.add(s.score);
        addMsg(
          MILESTONES[s.score],
          canvas.width / 2,
          canvas.height * 0.42,
          "#f8d4ef",
        );
      }
      if (s.score >= GOAL && !s.gameOver) {
        s.gameOver = true;
        s.running = false;
        setTimeout(() => {
          setGameState("win");
          setTimeout(() => setFinalVisible(true), 100);
        }, 400);
      }
    };

    const onClick = (e: MouseEvent) => pop(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      pop(e.touches[0].clientX, e.touches[0].clientY);
    };

    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("resize", resize);
    resize();

    let cachedBg: CanvasGradient | null = null;
    let cachedBgLevel = -1;

    const loop = (ts: number) => {
      if (!s.running) return;
      const W = canvas.width,
        H = canvas.height;

      const newLevel =
        s.score >= 70
          ? Math.min(20, 10 + Math.floor((s.score - 70) / 3))
          : Math.min(10, 1 + Math.floor(s.score / 5));

      if (s.particles.length > 120)
        s.particles.splice(0, s.particles.length - 120);
      if (s.msgs.length > 12) s.msgs.splice(0, s.msgs.length - 12);
      if (s.balloons.length > 35) {
        const excess = s.balloons.length - 35;
        s.balloons.splice(0, excess);
      }

      if (newLevel !== s.level) {
        s.level = newLevel;
        setLevel(newLevel);
        if (newLevel >= 3)
          addMsg(`⚡ Nivel ${newLevel}`, W / 2, H * 0.3, "#ffd97a");
      }

      const diff = getDiffConfig(s.level);

      if (ts - s.lastSpawn > diff.spawnInterval) {
        s.spawnCount++;
        const count = diff.multiSpawn;
        for (let i = 0; i < count; i++) {
          const rand = Math.random();
          const isBad = s.level >= 2 && rand < diff.badChance;
          const isSpecial = !isBad && rand > 1 - diff.goldChance;
          spawnBalloon(W, H, diff, isBad, isSpecial);
        }
        s.lastSpawn = ts;
      }

      // fondo cacheado — no recrear el gradient cada frame
      if (cachedBgLevel !== s.level) {
        cachedBgLevel = s.level;
        cachedBg = ctx.createLinearGradient(0, 0, 0, H);
        cachedBg.addColorStop(0, "#07040e");
        cachedBg.addColorStop(1, s.level >= 7 ? "#1a0310" : "#0d0618");
      }
      ctx.fillStyle = cachedBg!;
      ctx.fillRect(0, 0, W, H);

      if (s.level >= 6) {
        ctx.save();
        ctx.globalAlpha = (s.level - 5) * 0.018;
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

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
        pg.addColorStop(0, "#fb923c");
        pg.addColorStop(1, "#c084fc");
        ctx.fillStyle = pg;
        ctx.shadowColor = "#fb923c";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw * prog, 4, 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      s.balloons = s.balloons.filter((b) => {
        if (b.popped) {
          b.popScale += (3 - b.popScale) * 0.18;
          b.opacity -= 0.07;
          if (b.opacity <= 0) return false;
          ctx.save();
          ctx.globalAlpha = Math.max(0, b.opacity);
          ctx.shadowColor = b.glow;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * b.popScale, 0, Math.PI * 2);
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
          return true;
        }
        b.y += b.vy;
        b.x += b.vx;
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * diff.wobbleAmp;
        if (b.y < -60) {
          if (!b.isSpecial && !b.isBad) {
            s.lives = Math.max(0, s.lives - 1);
            setLives(s.lives);
            addMsg("💔 se escapó", b.x, 50, "#ff4466");
            if (s.lives <= 0 && !s.gameOver) {
              s.gameOver = true;
              s.running = false;
              setTimeout(() => setGameState("dead"), 400);
            }
          }
          return false;
        }
        ctx.save();
        ctx.shadowColor = b.glow;
        ctx.shadowBlur = b.isSpecial ? 12 : b.isBad ? 8 : 6;
        const pulse = b.isSpecial
          ? 1 + Math.sin(Date.now() * 0.006) * 0.06
          : b.isBad
            ? 1 + Math.sin(Date.now() * 0.01) * 0.04
            : 1;
        const r = b.radius * pulse;
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.isBad ? 0.75 : 0.88;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, r, r * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();
        if (b.isBad) {
          ctx.globalAlpha = 0.9;
          ctx.font = `${r * 0.9}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowBlur = 0;
          ctx.fillText("💀", b.x, b.y);
        } else {
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.ellipse(
            b.x - r * 0.25,
            b.y - r * 0.3,
            r * 0.3,
            r * 0.22,
            -0.5,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.globalAlpha = b.isBad ? 0.75 : 0.88;
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(b.x - 4, b.y + r * 1.1);
        ctx.lineTo(b.x + 4, b.y + r * 1.1);
        ctx.lineTo(b.x, b.y + r * 1.25);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + r * 1.25);
        ctx.quadraticCurveTo(b.x + 8, b.y + r * 1.6, b.x - 4, b.y + r * 2);
        ctx.stroke();
        if (!b.isBad) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 0;
          const fs = Math.max(8, Math.min(13, r * 0.38));
          ctx.font = `italic ${fs}px Georgia, serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(b.word, b.x, b.y);
        }
        ctx.restore();
        return true;
      });

      s.particles = s.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.opacity -= 0.03;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return p.opacity > 0;
      });

      s.msgs = s.msgs.filter((m) => {
        m.y += m.vy;
        m.opacity -= 0.009;
        ctx.save();
        ctx.globalAlpha = Math.max(0, m.opacity);
        ctx.font = "italic 1rem Georgia, serif";
        ctx.fillStyle = m.color;
        ctx.textAlign = "center";
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 6;
        ctx.fillText(m.text, m.x, m.y);
        ctx.restore();
        return m.opacity > 0;
      });

      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#f8d4ef";
      ctx.font = "0.6rem Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(
        s.level >= 2
          ? "¡cuidado con los globos 💀 oscuros Reina! ✦"
          : "toca los globos antes de que se escapen ✦",
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
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouch);
      window.removeEventListener("resize", resize);
    };
  }, [gameState]);

  const levelColor =
    level >= 7 ? "#ff6b6b" : level >= 4 ? "#ffd97a" : "#fb923c";

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
          cursor: "crosshair",
        }}
      />

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

      <div
        style={{
          position: "fixed",
          top: "1.2rem",
          right: "1.5rem",
          zIndex: 20,
          fontFamily: "Georgia, serif",
          color: "rgba(255,180,210,0.9)",
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
            color: levelColor,
            letterSpacing: "0.15em",
            fontWeight: level >= 7 ? "bold" : "normal",
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
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🎈</div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem,5vw,2.4rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "1rem",
            }}
          >
            Globos de Amor
          </h1>
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right,transparent,rgba(255,107,157,0.3),transparent)",
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
              maxWidth: 340,
            }}
          >
            Toca los globos de amor antes de que se escapen.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
              marginBottom: "1.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "rgba(200,170,255,0.5)",
                margin: 0,
              }}
            >
              🎈 Globo normal → +1
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "rgba(255,217,122,0.6)",
                margin: 0,
              }}
            >
              ⭐ Globo dorado → +3
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "rgba(255,100,100,0.6)",
                margin: 0,
              }}
            >
              💀 Globo oscuro → ¡NO toques! pierdes vida
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "rgba(200,170,255,0.35)",
                margin: 0,
              }}
            >
              💔 Si se escapa uno bueno → pierdes vida
            </p>
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.75rem",
              color: "rgba(255,217,122,0.4)",
              marginBottom: "0.4rem",
              fontStyle: "italic",
            }}
          >
            La dificultad va subiendo jijijij
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
            Meta: {GOAL} puntos
          </p>
          <button
            onClick={restart}
            style={{
              padding: "0.9rem 2.5rem",
              background:
                "linear-gradient(135deg,rgba(251,146,60,0.2),rgba(192,132,252,0.12))",
              border: "1px solid rgba(251,146,60,0.4)",
              borderRadius: "3px",
              color: "#fde8d0",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            ¡Jugar! 🎈
          </button>
        </div>
      )}

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
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>💔</div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem,5vw,2.2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.8rem",
            }}
          >
            ¡Casi lo amorrrrrr!
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              color: "rgba(220,200,255,0.6)",
              fontStyle: "italic",
              marginBottom: "0.4rem",
            }}
          >
            Llegaste a {score} puntos · nivel {level}
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(200,170,255,0.4)",
              fontStyle: "italic",
              marginBottom: "2.5rem",
            }}
          >
            {level >= 5
              ? "¡Llegaste muy lejossss! ¡Tú puedes con esto! SIUUUUUU 💪"
              : "¡Tú puedesssssssssss! 💪"}
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
              filter: "drop-shadow(0 0 20px rgba(255,150,60,0.8))",
            }}
          >
            🎈
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem,5vw,2.5rem)",
              fontWeight: 300,
              color: "#fde8d0",
              marginBottom: "0.8rem",
              textShadow: "0 0 40px rgba(251,146,60,0.4)",
            }}
          >
            ¡Ututuiii los globos hermosaaaaa! 🎉
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              color: "rgba(220,200,255,0.5)",
              marginBottom: "0.5rem",
            }}
          >
            Llegaste al nivel {level} · {score} puntos
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
            Así como atrapaste estos globos, me tienes atrapado a mí mi amor,
            preciosa. Siempre sere tuyo mi amor jijii Te Amoooooooo ❤️‍🩹
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
