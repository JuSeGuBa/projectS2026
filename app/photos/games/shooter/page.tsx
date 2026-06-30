"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Bullet {
  id: number;
  x: number;
  y: number;
  vy: number;
  vx?: number; // Añadido para trayectoria angular en modo Imposible
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "cloud" | "brokenHeart" | "thunder" | "boss";
  hp: number;
  maxHp: number;
  size: number;
  hit: boolean;
  hitTimer: number;
  dead: boolean;
  deadTimer: number;
  wobble: number;
  points: number;
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

interface PowerUp {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: "shield" | "rapid" | "triple";
  opacity: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_LIVES = 3;
const GOAL_SCORE = 1000; // Incrementado para permitir experimentar el modo Imposible
const PLAYER_SPEED = 6;

let bid = 0,
  eid = 0,
  fid = 0,
  pid = 0,
  pwid = 0;

const ENEMY_QUOTES = [
  "¡para!",
  "¡ay!",
  "¡nooo!",
  "💔",
  "☁️💥",
  "¡chao!",
  "pow!",
  "boom!",
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function spawnEnemyRow(W: number, wave: number): Enemy[] {
  const enemies: Enemy[] = [];
  // Forzamos un tope máximo de entidades (10) para evitar sobrecargar el loop de colisiones
  const count = Math.min(5 + wave, 10);
  const spacing = Math.min((W - 100) / count, 70);
  const startX = (W - spacing * (count - 1)) / 2;

  for (let i = 0; i < count; i++) {
    // Definición de tipos por Ola
    let type: Enemy["type"] = "cloud";
    if (wave >= 7) {
      type = Math.random() > 0.4 ? "thunder" : "brokenHeart"; // Mix de élites en Imposible
    } else if (wave >= 5) {
      type = "thunder";
    } else if (wave >= 3) {
      type = "brokenHeart";
    }

    // Escalonamiento agresivo de HP pero controlado
    let baseHp = type === "thunder" ? 3 : type === "brokenHeart" ? 2 : 1;
    if (wave >= 7) {
      baseHp += Math.floor((wave - 6) * 1.5); // Incremento exponencial de aguante por ola
    }

    // Modificadores de velocidad por dificultad
    let speedModifier = 1;
    if (wave >= 7) speedModifier = 2.4;
    else if (wave >= 5) speedModifier = 1.7;
    else if (wave >= 3) speedModifier = 1.2;

    enemies.push({
      id: eid++,
      x: startX + i * spacing,
      y: -40 - i * 12,
      vx: (0.4 + wave * 0.12) * speedModifier * (i % 2 === 0 ? 1 : -1),
      vy: (0.3 + wave * 0.07) * (wave >= 7 ? 1.4 : 1),
      type,
      hp: baseHp,
      maxHp: baseHp,
      size: type === "thunder" ? 28 : type === "brokenHeart" ? 24 : 22,
      hit: false,
      hitTimer: 0,
      dead: false,
      deadTimer: 0,
      wobble: Math.random() * Math.PI * 2,
      points: type === "thunder" ? 30 : type === "brokenHeart" ? 20 : 10,
    });
  }
  return enemies;
}

function spawnBoss(W: number): Enemy {
  return {
    id: eid++,
    x: W / 2,
    y: -60,
    vx: 2.2,
    vy: 0.6,
    type: "boss",
    hp: 45, // Más retador
    maxHp: 45,
    size: 48,
    hit: false,
    hitTimer: 0,
    dead: false,
    deadTimer: 0,
    wobble: 0,
    points: 200,
  };
}

const getDifficultyTier = (wave: number) => {
  if (wave >= 7) return { text: "IMPOSIBLE 🔥", color: "#ef4444" };
  if (wave >= 5) return { text: "DIFÍCIL ⚡", color: "#f97316" };
  if (wave >= 3) return { text: "MEDIO ☁️", color: "#eab308" };
  return { text: "FÁCIL 🌸", color: "#22c55e" };
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function LoveShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const keys = useRef<Set<string>>(new Set());

  const state = useRef({
    px: 0,
    py: 0,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    msgs: [] as FloatingMsg[],
    powerUps: [] as PowerUp[],
    score: 0,
    lives: MAX_LIVES,
    wave: 1,
    running: true,
    animId: 0,
    lastShot: 0,
    lastEnemyShot: 0,
    lastPowerUp: 0,
    gameOver: false,
    shield: false,
    shieldUntil: 0,
    rapidFire: false,
    rapidUntil: 0,
    tripleShot: false,
    tripleUntil: 0,
    waveCleared: false,
    waveClearTimer: 0,
    bossSpawned: false,
    invincible: false,
    invincibleUntil: 0,
    enemyBullets: [] as Bullet[],
    touchX: null as number | null,
    mouseX: 0 as number,
    mouseY: 0 as number,
    shooting: false,
  });

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [wave, setWave] = useState(1);
  const [gameState, setGameState] = useState<
    "waiting" | "playing" | "dead" | "win"
  >("waiting");
  const [finalVisible, setFinalVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [shield, setShield] = useState(false);
  const [rapid, setRapid] = useState(false);
  const [triple, setTriple] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music/SomeoneToYou.mp3");
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
    s.bullets = [];
    s.enemies = [];
    s.particles = [];
    s.msgs = [];
    s.powerUps = [];
    s.enemyBullets = [];
    s.score = 0;
    s.lives = MAX_LIVES;
    s.wave = 1;
    s.running = true;
    s.gameOver = false;
    s.shield = false;
    s.rapidFire = false;
    s.tripleShot = false;
    s.waveCleared = false;
    s.bossSpawned = false;
    s.invincible = false;
    const W = window.innerWidth,
      H = window.innerHeight;
    s.px = W / 2;
    s.py = H - 80;
    s.enemies = spawnEnemyRow(W, 1);
    setScore(0);
    setLives(MAX_LIVES);
    setWave(1);
    setShield(false);
    setRapid(false);
    setTriple(false);
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
        s.py = canvas.height - 80;
      }
    };

    const addMsg = (text: string, x: number, y: number, color = "#f8d4ef") => {
      s.msgs.push({ id: fid++, text, x, y, opacity: 1, vy: -1.8, color });
    };

    const spawnParticles = (
      x: number,
      y: number,
      color: string,
      count = 10,
    ) => {
      // OPTIMIZACIÓN: Evita saturar la memoria si ya hay demasiadas partículas en pantalla
      if (s.particles.length > 150) return;

      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        s.particles.push({
          x,
          y,
          vx: Math.cos(a) * (1.5 + Math.random() * 4),
          vy: Math.sin(a) * (1.5 + Math.random() * 4),
          opacity: 1,
          color,
          size: 2 + Math.random() * 4,
        });
      }
    };

    // Input
    const onKey = (e: KeyboardEvent) => {
      if (e.type === "keydown") keys.current.add(e.key);
      else keys.current.delete(e.key);
    };
    const onTouchStart = (e: TouchEvent) => {
      s.touchX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      s.touchX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      s.touchX = null;
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const onMouseMove = (e: MouseEvent) => {
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;
    };
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) s.shooting = true;
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) s.shooting = false;
    };
    const onSpaceDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        s.shooting = true;
      }
    };
    const onSpaceUp = (e: KeyboardEvent) => {
      if (e.code === "Space") s.shooting = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onSpaceDown);
    window.addEventListener("keyup", onSpaceUp);
    resize();

    // ── Draw helpers ──────────────────────────────────────────────
    const drawHeart = (
      cx: number,
      cy: number,
      size: number,
      color: string,
      alpha = 1,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
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

    const drawCloud = (
      cx: number,
      cy: number,
      size: number,
      hit: boolean,
      alpha = 1,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = hit ? "#cc8888" : "#8888bb";
      ctx.shadowColor = hit ? "#ff4444" : "#6060a0";
      ctx.shadowBlur = hit ? 18 : 8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
      ctx.ellipse(
        cx - size * 0.25,
        cy + size * 0.08,
        size * 0.28,
        size * 0.25,
        0,
        0,
        Math.PI * 2,
      );
      ctx.ellipse(
        cx + size * 0.25,
        cy + size * 0.08,
        size * 0.28,
        size * 0.25,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();
    };

    const drawBrokenHeart = (
      cx: number,
      cy: number,
      size: number,
      hit: boolean,
      alpha = 1,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `${size * 1.5}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = hit ? "#ff0000" : "#884444";
      ctx.shadowBlur = hit ? 20 : 10;
      ctx.fillText("💔", cx, cy);
      ctx.restore();
    };

    const drawThunder = (
      cx: number,
      cy: number,
      size: number,
      hit: boolean,
      alpha = 1,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `${size * 1.4}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = hit ? "#ff8800" : "#8888ff";
      ctx.shadowBlur = hit ? 22 : 12;
      ctx.fillText("⚡", cx, cy);
      ctx.restore();
    };

    const drawBoss = (
      cx: number,
      cy: number,
      size: number,
      hp: number,
      maxHp: number,
      hit: boolean,
      ts: number,
      alpha = 1,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      const pulse = 1 + Math.sin(ts * 0.004) * 0.08;
      ctx.font = `${size * pulse * 1.6}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = hit ? "#ff0000" : "#ff44aa";
      ctx.shadowBlur = hit ? 30 : 18;
      ctx.fillText("👿", cx, cy);
      // HP bar
      const bw = size * 2.5,
        bh = 6,
        bx = cx - bw / 2,
        by = cy + size + 4;
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#330011";
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 3);
      ctx.fill();
      ctx.fillStyle = `hsl(${(hp / maxHp) * 120}, 80%, 55%)`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ff44aa";
      ctx.beginPath();
      ctx.roundRect(bx, by, bw * (hp / maxHp), bh, 3);
      ctx.fill();
      ctx.restore();
    };

    // ── Game loop ──────────────────────────────────────────────────
    const loop = (ts: number) => {
      if (!s.running) return;
      const W = canvas.width,
        H = canvas.height;

      // Timers
      if (s.shield && ts > s.shieldUntil) {
        s.shield = false;
        setShield(false);
      }
      if (s.rapidFire && ts > s.rapidUntil) {
        s.rapidFire = false;
        setRapid(false);
      }
      if (s.tripleShot && ts > s.tripleUntil) {
        s.tripleShot = false;
        setTriple(false);
      }
      if (s.invincible && ts > s.invincibleUntil) s.invincible = false;

      // Player movement
      const spd = PLAYER_SPEED;
      if (keys.current.has("ArrowLeft") || keys.current.has("a")) s.px -= spd;
      if (keys.current.has("ArrowRight") || keys.current.has("d")) s.px += spd;
      if (keys.current.has("ArrowUp") || keys.current.has("w")) s.py -= spd;
      if (keys.current.has("ArrowDown") || keys.current.has("s")) s.py += spd;
      const isUsingKeys =
        keys.current.has("ArrowLeft") ||
        keys.current.has("ArrowRight") ||
        keys.current.has("ArrowUp") ||
        keys.current.has("ArrowDown") ||
        keys.current.has("a") ||
        keys.current.has("d") ||
        keys.current.has("w") ||
        keys.current.has("s");

      if (!isUsingKeys) {
        s.px = s.mouseX;
        s.py = s.mouseY;
      }

      if (s.touchX !== null) {
        const dx = s.touchX - s.px;
        s.px += dx * 0.1;
      }

      s.px = Math.max(24, Math.min(W - 24, s.px));
      s.py = Math.max(40, Math.min(H - 40, s.py));

      // Auto shoot
      const fireRate = s.rapidFire ? 150 : 280;
      if (s.shooting && ts - s.lastShot > fireRate) {
        if (s.tripleShot) {
          s.bullets.push({ id: bid++, x: s.px - 14, y: s.py - 20, vy: -9 });
          s.bullets.push({ id: bid++, x: s.px, y: s.py - 20, vy: -10 });
          s.bullets.push({ id: bid++, x: s.px + 14, y: s.py - 20, vy: -9 });
        } else {
          s.bullets.push({ id: bid++, x: s.px, y: s.py - 20, vy: -10 });
        }
        s.lastShot = ts;
      }

      // ── SISTEMA DE DISPARO ENEMIGO ADAPTATIVO ──
      let enemyFireRate = 2000;
      if (s.wave >= 7)
        enemyFireRate = 500; // Cadencia rápida en Imposible
      else if (s.wave >= 5) enemyFireRate = 900;
      else if (s.wave >= 3) enemyFireRate = 1500;

      if (s.wave >= 3 && ts - s.lastEnemyShot > enemyFireRate) {
        const shooters = s.enemies.filter((e) => !e.dead && e.type !== "cloud");
        if (shooters.length > 0) {
          const shooter = shooters[Math.floor(Math.random() * shooters.length)];

          if (s.wave >= 7) {
            // PATRÓN IMPOSIBLE: Ráfaga en abanico (3 balas direccionales)
            s.enemyBullets.push({
              id: bid++,
              x: shooter.x,
              y: shooter.y + shooter.size,
              vy: 5,
              vx: -1.5,
            });
            s.enemyBullets.push({
              id: bid++,
              x: shooter.x,
              y: shooter.y + shooter.size,
              vy: 6,
              vx: 0,
            });
            s.enemyBullets.push({
              id: bid++,
              x: shooter.x,
              y: shooter.y + shooter.size,
              vy: 5,
              vx: 1.5,
            });
          } else {
            // Patrón estándar de una sola bala vertical
            const bSpd = s.wave >= 5 ? 6 : 4;
            s.enemyBullets.push({
              id: bid++,
              x: shooter.x,
              y: shooter.y + shooter.size,
              vy: bSpd,
              vx: 0,
            });
          }
        }
        s.lastEnemyShot = ts;
      }

      // Power up spawn
      if (ts - s.lastPowerUp > 11000) {
        const types: PowerUp["type"][] = ["shield", "rapid", "triple"];
        s.powerUps.push({
          id: pwid++,
          x: 60 + Math.random() * (W - 120),
          y: -20,
          vy: 1.5,
          type: types[Math.floor(Math.random() * types.length)],
          opacity: 1,
        });
        s.lastPowerUp = ts;
      }

      // Wave clear check
      if (
        !s.waveCleared &&
        s.enemies.length > 0 &&
        s.enemies.every((e) => e.dead)
      ) {
        s.waveCleared = true;
        s.waveClearTimer = ts;
        const currentTier = getDifficultyTier(s.wave);
        addMsg(
          `¡Ola ${s.wave} superada! 💪`,
          W / 2,
          H * 0.4,
          currentTier.color,
        );
      }

      // Next wave
      if (s.waveCleared && ts - s.waveClearTimer > 2000) {
        s.wave++;
        setWave(s.wave);
        s.waveCleared = false;

        if (s.wave === 6 && !s.bossSpawned) {
          s.bossSpawned = true;
          s.enemies = [spawnBoss(W)];
          addMsg("👿 ¡JEFE FINAL! ¡tú puedes! 💜", W / 2, H * 0.35, "#ff44aa");
        } else {
          s.enemies = spawnEnemyRow(W, s.wave);
          // Alertas de cambio drástico de dificultad
          if (s.wave === 3)
            addMsg("⚠️ ¡DIFICULTAD: MEDIO! ☁️", W / 2, H * 0.35, "#eab308");
          else if (s.wave === 5)
            addMsg("⚡ ¡DIFICULTAD: DIFÍCIL! ⚡", W / 2, H * 0.35, "#f97316");
          else if (s.wave === 7)
            addMsg("🔥 ¡DIFICULTAD: IMPOSIBLE! 🔥", W / 2, H * 0.35, "#ef4444");
        }
      }

      // ── Draw background ──
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#06030e");
      bg.addColorStop(1, "#0d0520");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Stars bg
      ctx.save();
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 60; i++) {
        const sx = (i * 137.5 * 13) % W;
        const sy = (i * 97.3 * 7) % H;
        const br = Math.sin(ts * 0.001 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(200,180,255,${br * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Progress bar
      const prog = Math.min(s.score / GOAL_SCORE, 1);
      const bw2 = W * 0.6,
        bx2 = (W - bw2) / 2,
        by2 = 14;
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.roundRect(bx2, by2, bw2, 4, 2);
      ctx.fill();
      if (prog > 0) {
        const pg = ctx.createLinearGradient(bx2, 0, bx2 + bw2 * prog, 0);
        pg.addColorStop(0, "#ff6b9d");
        pg.addColorStop(1, "#c084fc");
        ctx.fillStyle = pg;
        ctx.shadowColor = "#ff6b9d";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(bx2, by2, bw2 * prog, 4, 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Player bullets ──
      s.bullets = s.bullets.filter((b) => {
        b.y += b.vy;
        if (b.y < -10) return false;
        ctx.save();
        ctx.fillStyle = "#ff9ec0";
        ctx.shadowColor = "#ff6b9d";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 3, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        // heart tip
        ctx.font = "10px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♥", b.x, b.y);
        ctx.restore();
        return true;
      });

      // ── Enemy bullets ──
      s.enemyBullets = s.enemyBullets.filter((b) => {
        b.y += b.vy;
        if (b.vx) b.x += b.vx; // Aplica movimiento angular

        // Limpieza si sale de los bordes horizontales o verticales
        if (b.y > H + 10 || b.x < -20 || b.x > W + 20) return false;

        // Hit player
        if (!s.invincible && Math.hypot(b.x - s.px, b.y - s.py) < 18) {
          if (!s.shield) {
            s.lives = Math.max(0, s.lives - 1);
            setLives(s.lives);
            s.invincible = true;
            s.invincibleUntil = ts + 1500;
            spawnParticles(s.px, s.py, "#ff4466", 8);
            addMsg("💔 ¡impacto!", s.px, s.py - 30, "#ff4466");
            if (s.lives <= 0 && !s.gameOver) {
              s.gameOver = true;
              s.running = false;
              setTimeout(() => setGameState("dead"), 400);
            }
          } else {
            s.shield = false;
            setShield(false);
            spawnParticles(s.px, s.py, "#a5f3fc", 6);
            addMsg("🛡️ ¡escudo destruido!", s.px, s.py - 30, "#a5f3fc");
          }
          return false;
        }

        ctx.save();
        ctx.fillStyle = "#ff4466";
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // ── Enemies ──
      s.enemies = s.enemies.filter((e) => {
        if (e.dead) {
          e.deadTimer++;
          spawnParticles(
            e.x + (Math.random() - 0.5) * 20,
            e.y + (Math.random() - 0.5) * 20,
            e.type === "boss" ? "#ff44aa" : "#ff9ec0",
            2,
          );
          return e.deadTimer < 18;
        }

        e.wobble += 0.04;
        e.x += e.vx + Math.sin(e.wobble) * 0.5;
        e.y += e.vy;

        if (e.type !== "boss") {
          if (e.x < e.size || e.x > W - e.size) e.vx *= -1;
        } else {
          if (e.x < 60 || e.x > W - 60) e.vx *= -1;
          if (e.y > H * 0.4) e.vy = -Math.abs(e.vy);
          if (e.y < 60) e.vy = Math.abs(e.vy);
        }

        if (e.hit) {
          e.hitTimer++;
          if (e.hitTimer > 6) {
            e.hit = false;
            e.hitTimer = 0;
          }
        }

        // Bullet collision
        s.bullets = s.bullets.filter((b) => {
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.size + 8) {
            e.hp--;
            e.hit = true;
            e.hitTimer = 0;
            spawnParticles(
              b.x,
              b.y,
              e.type === "boss" ? "#ff44aa" : "#ffb3d4",
              5,
            );
            if (e.hp <= 0 && !e.dead) {
              e.dead = true;
              s.score += e.points;
              setScore(s.score);
              const q =
                ENEMY_QUOTES[Math.floor(Math.random() * ENEMY_QUOTES.length)];
              addMsg(
                `${q} +${e.points}`,
                e.x,
                e.y,
                e.type === "boss" ? "#ff44aa" : "#ffd97a",
              );
              if (s.score >= GOAL_SCORE && !s.gameOver) {
                s.gameOver = true;
                s.running = false;
                setTimeout(() => {
                  setGameState("win");
                  setTimeout(() => setFinalVisible(true), 100);
                }, 600);
              }
            }
            return false;
          }
          return true;
        });

        if (e.dead) return true;

        // Hit player (collision)
        if (!s.invincible && Math.hypot(e.x - s.px, e.y - s.py) < e.size + 14) {
          if (!s.shield) {
            s.lives = Math.max(0, s.lives - 1);
            setLives(s.lives);
            s.invincible = true;
            s.invincibleUntil = ts + 1800;
            spawnParticles(s.px, s.py, "#ff4466", 10);
            addMsg("💔 ¡colisión!", s.px, s.py - 30, "#ff4466");
            if (s.lives <= 0 && !s.gameOver) {
              s.gameOver = true;
              s.running = false;
              setTimeout(() => setGameState("dead"), 400);
            }
          } else {
            s.shield = false;
            setShield(false);
            spawnParticles(s.px, s.py, "#a5f3fc", 6);
          }
        }

        // Draw enemy
        const alpha = e.hit ? 0.5 : 1;
        if (e.type === "cloud") drawCloud(e.x, e.y, e.size, e.hit, alpha);
        else if (e.type === "brokenHeart")
          drawBrokenHeart(e.x, e.y, e.size, e.hit, alpha);
        else if (e.type === "thunder")
          drawThunder(e.x, e.y, e.size, e.hit, alpha);
        else if (e.type === "boss")
          drawBoss(e.x, e.y, e.size, e.hp, e.maxHp, e.hit, ts, alpha);

        // Off screen bottom → lose life
        if (e.y > H + 50 && e.type !== "boss") {
          s.lives = Math.max(0, s.lives - 1);
          setLives(s.lives);
          addMsg("💔 pasó de largo", e.x, H - 60, "#ff4466");
          if (s.lives <= 0 && !s.gameOver) {
            s.gameOver = true;
            s.running = false;
            setTimeout(() => setGameState("dead"), 400);
          }
          return false;
        }

        return true;
      });

      // ── Power ups ──
      s.powerUps = s.powerUps.filter((pw) => {
        pw.y += pw.vy;
        if (pw.y > H + 30) return false;

        const emoji =
          pw.type === "shield" ? "🛡️" : pw.type === "rapid" ? "⚡" : "✨";
        ctx.save();
        ctx.font = "22px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#ffd97a";
        ctx.shadowBlur = 16;
        ctx.globalAlpha = 0.9 + Math.sin(ts * 0.01) * 0.1;
        ctx.fillText(emoji, pw.x, pw.y);
        ctx.restore();

        if (Math.hypot(pw.x - s.px, pw.y - s.py) < 28) {
          if (pw.type === "shield") {
            s.shield = true;
            s.shieldUntil = ts + 5000;
            setShield(true);
            addMsg("🛡️ ¡escudo 5s!", pw.x, pw.y - 20, "#a5f3fc");
          } else if (pw.type === "rapid") {
            s.rapidFire = true;
            s.rapidUntil = ts + 4000;
            setRapid(true);
            addMsg("⚡ ¡disparo rápido!", pw.x, pw.y - 20, "#ffd97a");
          } else {
            s.tripleShot = true;
            s.tripleUntil = ts + 5000;
            setTriple(true);
            addMsg("✨ ¡triple disparo!", pw.x, pw.y - 20, "#c084fc");
          }
          return false;
        }
        return true;
      });

      // ── Particles ──
      s.particles = s.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.opacity -= 0.025;
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

      // ── Player ──
      const invBlink = s.invincible ? Math.sin(ts * 0.025) > 0 : true;
      if (invBlink) {
        if (s.shield) {
          ctx.save();
          ctx.globalAlpha = 0.25 + Math.sin(ts * 0.008) * 0.1;
          ctx.strokeStyle = "#a5f3fc";
          ctx.shadowColor = "#a5f3fc";
          ctx.shadowBlur = 20;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(s.px, s.py, 28, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        drawHeart(s.px, s.py, 18, "#ff7eb5");
        // Engine trail
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.globalAlpha = 0.15 - i * 0.04;
          ctx.fillStyle = "#ff6b9d";
          ctx.shadowColor = "#ff6b9d";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(
            s.px + (Math.random() - 0.5) * 8,
            s.py + 20 + i * 8,
            3 - i,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.restore();
        }
      }

      // ── Floating messages ──
      s.msgs = s.msgs.filter((m) => {
        m.y += m.vy;
        m.opacity -= 0.008;
        ctx.save();
        ctx.globalAlpha = Math.max(0, m.opacity);
        ctx.font = `italic 0.95rem Georgia, serif`;
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
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = "#f8d4ef";
      ctx.font = "0.6rem Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(
        "flechas/WASD o mouse para mover · click / espacio para disparar ✦",
        W / 2,
        H - 16,
      );
      ctx.restore();

      s.animId = requestAnimationFrame(loop);
    };

    s.animId = requestAnimationFrame(loop);
    return () => {
      s.running = false;
      cancelAnimationFrame(s.animId);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onSpaceDown);
      window.removeEventListener("keyup", onSpaceUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, [gameState]);

  const btnStyle = (color: string): React.CSSProperties => ({
    padding: "0.8rem 2rem",
    background: `linear-gradient(135deg, rgba(${color},0.15), rgba(192,132,252,0.1))`,
    border: `1px solid rgba(${color},0.35)`,
    borderRadius: "3px",
    color: "#f8d4ef",
    fontFamily: "Georgia, serif",
    fontSize: "0.9rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
  });

  const diffBadge = getDifficultyTier(wave);

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
          color: "rgba(255,180,210,0.9)",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          background: "rgba(10,5,20,0.4)",
          padding: "0.4rem 0.8rem",
          borderRadius: "4px",
          backdropFilter: "blur(4px)",
        }}
      >
        {shield && (
          <span style={{ fontSize: "0.75rem", color: "#a5f3fc" }}>🛡️</span>
        )}
        {rapid && (
          <span style={{ fontSize: "0.75rem", color: "#ffd97a" }}>⚡</span>
        )}
        {triple && (
          <span style={{ fontSize: "0.75rem", color: "#c084fc" }}>✨</span>
        )}
        <span>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span
              key={i}
              style={{ opacity: i < lives ? 1 : 0.2, marginRight: 2 }}
            >
              ♥
            </span>
          ))}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: diffBadge.color,
            fontWeight: "bold",
            letterSpacing: "0.05em",
            transition: "color 0.4s ease",
          }}
        >
          {diffBadge.text} (Ola {wave})
        </span>
        <span style={{ fontSize: "0.85rem" }}>
          <span style={{ fontSize: "0.65rem", opacity: 0.6, marginRight: 3 }}>
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
              "radial-gradient(ellipse at 50% 50%,rgba(15,4,30,0.97),rgba(6,3,12,0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>💝</div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem,5vw,2.4rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "1rem",
            }}
          >
            Love Shooter
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
              fontSize: "0.88rem",
              color: "rgba(220,200,255,0.6)",
              fontStyle: "italic",
              marginBottom: "1rem",
              maxWidth: 340,
            }}
          >
            Dispara corazones a los obstáculos que intentan bloquear nuestro
            amor. ¡La dificultad escala dinámicamente hasta volverse Imposible!
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              marginBottom: "1.5rem",
            }}
          >
            {[
              "🌸 Olas 1-2: Fácil · ☁️ Olas 3-4: Medio · ⚡ Olas 5-6: Difícil (Jefe)",
              "🔥 Olas 7+: ¡MODO IMPOSIBLE EN CADENA CORRIDA! 🔥",
              "🛡️ Escudo · ⚡ Disparo rápido · ✨ Triple disparo",
              "WASD / Flechas / Mouse para mover · Click / Espacio para disparar",
            ].map((t) => (
              <p
                key={t}
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.78rem",
                  color: "rgba(200,175,255,0.45)",
                  margin: 0,
                }}
              >
                {t}
              </p>
            ))}
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.8rem",
              color: "rgba(255,107,157,0.4)",
              marginBottom: "2rem",
              fontStyle: "italic",
            }}
          >
            Meta del Amor: {GOAL_SCORE} puntos
          </p>
          <button
            onClick={restart}
            style={{
              padding: "0.9rem 2.5rem",
              background:
                "linear-gradient(135deg,rgba(255,107,157,0.2),rgba(192,132,252,0.12))",
              border: "1px solid rgba(255,107,157,0.4)",
              borderRadius: "3px",
              color: "#f8d4ef",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            ¡A defender el amor! 💝
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
            Caíste en la batalla...
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
            Llegaste a {score} pts en la {diffBadge.text}. ¡Pero el amor volverá
            a intentar! 💪
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button onClick={restart} style={btnStyle("255,107,157")}>
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
              filter: "drop-shadow(0 0 20px rgba(255,107,157,0.8))",
            }}
          >
            ❤️‍🩹
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem,5vw,2.5rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.8rem",
              textShadow: "0 0 40px rgba(255,107,157,0.4)",
            }}
          >
            ¡Y esa chica tan dura?! 🎉
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1rem,3vw,1.4rem)",
              color: "rgba(220,200,255,0.75)",
              marginBottom: "0.5rem",
            }}
          >
            {score} puntos totales — Ola {wave} alcanzada
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1rem,3vw,1.3rem)",
              color: "#ff9ec0",
              textShadow: "0 0 30px rgba(255,107,157,0.5)",
              marginBottom: "2.5rem",
            }}
          >
            Mi amor eres lo mejor que me ha pasado te amo demasiado eres mi
            mundo entero, te amo sabias que te amo??? ya dije que te amo?
            oyeeeee te amooooooo ❤️‍🩹❤️‍🩹❤️‍🩹
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button onClick={restart} style={btnStyle("255,107,157")}>
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
