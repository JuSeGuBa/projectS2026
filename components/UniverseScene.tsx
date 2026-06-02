"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { STARS, StarData } from "./starData";
import { useRouter } from "next/navigation";

// ── Deep starfield with thousands of stars ────────────────────────────────────
function Starfield() {
  const ref = useRef<THREE.Points>(null!);
  const count = 4000;

  const { positions, sizes, colors } = useRef(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute on a sphere shell for realistic depth
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 18 + Math.random() * 22;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sz[i] = Math.random() * Math.random() * 2.5 + 0.1; // biased toward small

      // Slight color variation: white, blue-white, warm yellow
      const t = Math.random();
      if (t < 0.6) {
        col[i * 3] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 2] = 1.0;
      } else if (t < 0.8) {
        col[i * 3] = 0.7 + Math.random() * 0.2;
        col[i * 3 + 1] = 0.8 + Math.random() * 0.15;
        col[i * 3 + 2] = 1.0;
      } else {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.92 + Math.random() * 0.08;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.2;
      }
    }
    return { positions: pos, sizes: sz, colors: col };
  }).current();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.008;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.003) * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.88}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Milky Way band ────────────────────────────────────────────────────────────
function MilkyWay() {
  const ref = useRef<THREE.Points>(null!);
  const count = 2500;

  const { positions, colors } = useRef(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const bandSpread = (Math.random() - 0.5) * 3.5; // narrow band
      const r = 20 + Math.random() * 8;
      pos[i * 3] = r * Math.cos(angle);
      pos[i * 3 + 1] = bandSpread + Math.sin(angle) * 1.2;
      pos[i * 3 + 2] = r * Math.sin(angle);

      const brightness = 0.3 + Math.random() * 0.5;
      col[i * 3] = brightness * 0.8;
      col[i * 3 + 1] = brightness * 0.85;
      col[i * 3 + 2] = brightness;
    }
    return { positions: pos, colors: col };
  }).current();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.006;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.35}
        size={0.06}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Individual interactive star ───────────────────────────────────────────────
function Star({
  data,
  onSelect,
  zooming,
}: {
  data: StarData;
  onSelect: (s: StarData) => void;
  zooming: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const baseScale = data.special ? 1.8 : 1;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = data.special
      ? 1 + Math.sin(t * 2.2) * 0.18
      : 1 + Math.sin(t * 1.5 + data.id) * 0.06;
    const targetScale = hovered ? baseScale * 1.5 : baseScale * pulse;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1),
    );
    meshRef.current.position.y =
      data.position[1] + Math.sin(t * 0.6 + data.id * 1.3) * 0.12;

    if (glowRef.current) {
      glowRef.current.scale.setScalar(meshRef.current.scale.x * 2.8);
      glowRef.current.position.y = meshRef.current.position.y;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = hovered
        ? 0.18
        : data.special
          ? 0.12 + Math.sin(t * 2) * 0.04
          : 0.06;
    }
  });

  return (
    <group>
      {/* Glow halo */}
      <mesh ref={glowRef} position={data.position}>
        <sphereGeometry args={[data.special ? 0.22 : 0.12, 12, 12]} />
        <meshBasicMaterial
          color={data.special ? "#ff6b9d" : "#c084fc"}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Main star */}
      <mesh
        ref={meshRef}
        position={data.position}
        onPointerEnter={(e) => {
          e.stopPropagation();
          if (!zooming) setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!zooming) onSelect(data);
        }}
      >
        <sphereGeometry args={[data.special ? 0.18 : 0.09, 16, 16]} />
        <meshStandardMaterial
          color={data.special ? "#ffb3d4" : hovered ? "#f8d4ef" : "#e8c8ff"}
          emissive={data.special ? "#ff6b9d" : hovered ? "#c084fc" : "#8040a0"}
          emissiveIntensity={data.special ? 2.5 : hovered ? 2 : 0.8}
          roughness={0}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

// ── Camera animation ──────────────────────────────────────────────────────────
function CameraRig({
  target,
  zooming,
}: {
  target: [number, number, number] | null;
  zooming: boolean;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (zooming && target) {
      const dest = new THREE.Vector3(
        target[0] * 0.3,
        target[1] * 0.3,
        target[2] * 0.3 + 1.2,
      );
      camera.position.lerp(dest, 0.04);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 0, 7), 0.03);
    }
  });

  return null;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ star, onClose }: { star: StarData; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 30);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(7,7,9,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "linear-gradient(135deg, rgba(20,10,35,0.98) 0%, rgba(12,8,22,0.98) 100%)",
          border: "1px solid rgba(255,107,157,0.25)",
          borderRadius: "4px",
          padding: "2.5rem",
          maxWidth: "420px",
          width: "100%",
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(16px) scale(0.97)",
          transition: "all 0.4s ease",
          boxShadow:
            "0 0 60px rgba(192,84,252,0.12), 0 0 120px rgba(255,107,157,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.3rem",
              color: "#f8d4ef",
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
          >
            {star.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(220,200,255,0.4)",
              cursor: "pointer",
              fontSize: "1.1rem",
              lineHeight: 1,
              padding: "2px 4px",
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
            color: "rgba(220, 200, 255, 0.85)",
            lineHeight: 1.75,
            fontStyle: "italic",
          }}
        >
          {star.message}
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
            ✦ del universo para ti
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Final love screen ─────────────────────────────────────────────────────────
function FinalScreen({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    setTimeout(() => setPhase(1), 600);
    setTimeout(() => setPhase(2), 1400);
  }, []);

  return (
    <div
      onClick={onClose}
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
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
        textAlign: "center",
        padding: "2rem",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s ease",
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
          }}
        >
          Gracias por existir.
        </p>
      </div>
      <div
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.9s ease",
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
            fontWeight: 300,
            color: "#ff9ec0",
            letterSpacing: "0.04em",
            textShadow: "0 0 40px rgba(255,107,157,0.5)",
            marginBottom: "3rem",
          }}
        >
          Te amo.
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
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function UniverseScene() {
  const router = useRouter();
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [zooming, setZooming] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<[number, number, number] | null>(
    null,
  );
  const [showFinal, setShowFinal] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleSelect = useCallback((star: StarData) => {
    if (star.special) {
      setZooming(true);
      setZoomTarget(star.position);
      setTimeout(() => setShowFinal(true), 1200);
    } else {
      setSelectedStar(star);
    }
  }, []);

  const goHome = () => {
    setLeaving(true);
    setTimeout(() => router.push("/"), 500);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(ellipse at 50% 30%, #0d0415 0%, #040208 60%)",
        position: "relative",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
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

      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#040208"]} />
        <fog attach="fog" args={["#040208", 25, 45]} />

        <ambientLight intensity={0.1} />
        <pointLight
          position={[0, 0, 0]}
          intensity={3}
          color="#ff6b9d"
          distance={8}
        />
        <pointLight position={[-5, 3, -2]} intensity={0.8} color="#c084fc" />

        <Starfield />
        <MilkyWay />

        {STARS.map((star) => (
          <Star
            key={star.id}
            data={star}
            onSelect={handleSelect}
            zooming={zooming}
          />
        ))}

        <CameraRig target={zoomTarget} zooming={zooming} />
      </Canvas>

      {selectedStar && (
        <Modal star={selectedStar} onClose={() => setSelectedStar(null)} />
      )}

      {showFinal && (
        <FinalScreen
          onClose={() => {
            setShowFinal(false);
            setZooming(false);
            setZoomTarget(null);
          }}
        />
      )}
    </div>
  );
}
