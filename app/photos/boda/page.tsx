"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ImageGroup {
  groupId: string;
  groupTitle: string;
  images: { src: string; label: string }[];
}

interface Chapter {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  rgb: string;
  isGuestList?: boolean; // Bandera especial para la lista de invitados
  sections?: Section[];
  images?: { src: string; label: string }[];
  imageGroups?: ImageGroup[]; // Soporte para múltiples grupos de selección en un capítulo
}

interface Section {
  heading: string;
  body: string;
  highlight?: string;
}

interface Guest {
  id: string;
  name: string;
}

// ── Content ────────────────────────────────────────────────────────────────────
// ✏️ Edita aquí el contenido y las rutas de las imágenes
const CHAPTERS: Chapter[] = [
  {
    id: "lugar",
    emoji: "🏰",
    title: "El Lugar",
    subtitle: "Donde daremos el sí",
    color: "#fde8d0",
    rgb: "253,232,208",
    images: [
      { src: "/future/boda/lugar-1.jpg", label: "Concepto abierto" },
      { src: "/future/boda/lugar-2.jpg", label: "En salon cerrado" },
      {
        src: "/future/boda/lugar-3.jpg",
        label: "Una combinacion de ambas",
      },
    ],
    sections: [
      {
        heading: "Nuestra elección",
        body: "El lugar tiene que tener nuestra esencia. Ya sea al aire libre o en un salon, lo importante es que 1 todos nuestros seres queridos estén ahi y Jehova y 2 estemos satisfechos felices y tranquilos.",
        highlight: "El escenario del mejor día de nuestras vidas.",
      },
    ],
  },
  {
    id: "vestimenta",
    emoji: "👰🏻‍♀️ 🤵‍♂️",
    title: "Vestidos y Trajes",
    subtitle: "Cómo nos veremos ese día",
    color: "#a5f3fc",
    rgb: "165,243,252",
    imageGroups: [
      {
        groupId: "novia",
        groupTitle: "La Reina 👑",
        images: [
          {
            src: "/future/boda/vestido/novia-1.jpg",
            label: "Sexy pero elegante y moderno jeje",
          },
          {
            src: "/future/boda/vestido/novia-2.jpg",
            label: "Princesa y clasico",
          },
          {
            src: "/future/boda/vestido/novia-3.jpg",
            label: "Combinacion de moderno y clasico",
          },
        ],
      },
      {
        groupId: "novio",
        groupTitle: "El Papi JAJA",
        images: [
          {
            src: "/future/boda/vestido/novio-1.jpg",
            label: "Negro con dorado",
          },
          {
            src: "/future/boda/vestido/novio-2.jpg",
            label: "Azul y blanco",
          },
          { src: "/future/boda/vestido/novio-3.jpg", label: "Negro y blanco" },
        ],
      },
    ],
    sections: [
      {
        heading: "El momento de vernos",
        body: "Me imagino perfectamente ese momento en el que nuestras miradas se crucen por primera vez ese día. No importan los nervios, sé que en el instante en que te vea, todo lo demás va a desaparecer, sera lo mejor que me ha pasado en mi vida.",
        highlight:
          "Muchos invitados y personas, pero ese momento sera nuestro mi amor.",
      },
    ],
  },
  {
    id: "detalles",
    emoji: "✨",
    title: "Los Colores",
    subtitle: "La magia está en lo pequeño",
    color: "#bbf7d0",
    rgb: "187,247,208",
    images: [
      {
        src: "/future/boda/colores/colores-1.png",
        label: "Azul, blanco y negro ",
      },
      { src: "/future/boda/colores/colores-2.png", label: "Negro y blanco" },
      {
        src: "/future/boda/colores/colores-3.png",
        label: "Negro y dorado",
      },
    ],
    sections: [
      {
        heading: "Nuestra tematica mi cielo",
        body: "Importante los colores, deben ir en armonia con nuestros trajes y vestidos amor, eso hay que hablarlooooooooooooooooo jaja.",
        highlight:
          "Pero sin importar los colores el mejor dia de nuestras vidas.",
      },
    ],
  },
  {
    id: "invitados",
    emoji: "📜",
    title: "Lista de Invitados",
    subtitle: "Los que no pueden faltar",
    color: "#fca5a5",
    rgb: "252,165,165",
    isGuestList: true, // Esto activa la interfaz especial interactiva
  },
];

// ── Star particle for background ───────────────────────────────────────────────
function StarBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let time = 0;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      if (typeof window === "undefined") return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      stars.forEach((s) => {
        const t = Math.sin(time * s.speed + s.phase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * t, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,200,255,${s.opacity * t})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function NuestraBodaPage() {
  useEffect(() => {
    const audio = new Audio("/music/Photograph.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    const playAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", playAudio);
    };

    window.addEventListener("click", playAudio);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", playAudio);
    };
  }, []);

  const router = useRouter();
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Record<string, number>>(
    {},
  );

  // Estado para el Modal
  const [modalImage, setModalImage] = useState<{
    src: string;
    label: string;
  } | null>(null);

  // Estados para la Lista de Invitados
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestInput, setGuestInput] = useState("");
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar lista de invitados desde LocalStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("lista_invitados_boda");
    if (saved) {
      try {
        setGuests(JSON.parse(saved));
      } catch (e) {
        console.error("Error al cargar la lista de invitados");
      }
    }
    setIsLoaded(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  // Guardar en LocalStorage cada vez que cambie la lista
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lista_invitados_boda", JSON.stringify(guests));
    }
  }, [guests, isLoaded]);

  const goBack = () => {
    if (activeChapter) {
      setSectionVisible(false);
      setTimeout(() => setActiveChapter(null), 300);
    } else {
      setLeaving(true);
      setTimeout(() => router.push("/photos"), 500);
    }
  };

  const openChapter = (id: string) => {
    setSectionVisible(false);
    setActiveChapter(id);
    setTimeout(() => setSectionVisible(true), 80);
  };

  const closeModal = () => setModalImage(null);

  // Funciones para gestionar invitados
  const handleAddGuest = () => {
    if (!guestInput.trim()) return;
    if (editingGuestId) {
      setGuests(
        guests.map((g) =>
          g.id === editingGuestId ? { ...g, name: guestInput.trim() } : g,
        ),
      );
      setEditingGuestId(null);
    } else {
      const newId =
        Date.now().toString() + Math.random().toString(36).substring(2);
      setGuests([...guests, { id: newId, name: guestInput.trim() }]);
    }
    setGuestInput("");
  };

  const handleEditGuest = (g: Guest) => {
    setGuestInput(g.name);
    setEditingGuestId(g.id);
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter((g) => g.id !== id));
    if (editingGuestId === id) {
      setGuestInput("");
      setEditingGuestId(null);
    }
  };

  // Función para generar la "Boda Soñada"
  const generarResumenBoda = () => {
    const selections: {
      chapter: string;
      label: string;
      emoji: string;
      src: string;
    }[] = [];

    CHAPTERS.forEach((ch) => {
      if (!ch.isGuestList) {
        // Para capítulos con una sola lista de imágenes
        if (ch.images) {
          const idx = selectedImages[ch.id];
          if (idx !== undefined) {
            selections.push({
              chapter: ch.title.toLowerCase(),
              label: ch.images[idx].label,
              emoji: ch.emoji,
              src: ch.images[idx].src,
            });
          }
        }
        // Para capítulos con grupos de imágenes (como novia y novio)
        if (ch.imageGroups) {
          ch.imageGroups.forEach((group) => {
            const idx = selectedImages[`${ch.id}_${group.groupId}`];
            if (idx !== undefined) {
              selections.push({
                chapter: group.groupTitle.toLowerCase(),
                label: group.images[idx].label,
                emoji: ch.emoji,
                src: group.images[idx].src,
              });
            }
          });
        }
      }
    });

    if (selections.length === 0 && guests.length === 0) return null;

    let text = "Nuestra boda soñada consistiría en ";

    selections.forEach((sel, i) => {
      if (sel.chapter === "el lugar")
        text += `un lugar como ${sel.label} ${sel.emoji}`;
      if (sel.chapter === "para nikole")
        text += `Nikole luciendo un estilo ${sel.label} ${sel.emoji}`;
      if (sel.chapter === "para sebas")
        text += `Sebas con un estilo ${sel.label} ${sel.emoji}`;
      if (sel.chapter === "los detalles")
        text += `decorado con ${sel.label} ${sel.emoji}`;

      if (i === selections.length - 2) text += " y ";
      else if (i < selections.length - 2) text += ", ";
    });

    if (guests.length > 0) {
      text += `. Acompañados por nuestros invitados más especiales.`;
    } else {
      text += ".";
    }

    return (
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "rgba(255,107,157,0.05)",
          border: "1px solid rgba(255,107,157,0.15)",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.1rem",
            color: "#f8d4ef",
            marginBottom: "1rem",
          }}
        >
          Resultado final de nuestra boda ❤️
        </p>

        {/* IMÁGENES SELECCIONADAS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.8rem",
            marginBottom: "1rem",
          }}
        >
          {selections.map((sel) => (
            <div
              key={sel.chapter}
              style={{ position: "relative", width: 75, height: 75 }}
            >
              <img
                src={sel.src}
                alt={sel.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          ))}
        </div>

        {/* TEXTO */}
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.92rem",
            color: "rgba(220,200,255,0.8)",
            lineHeight: 1.8,
            fontStyle: "italic",
            marginBottom: "1.5rem",
          }}
        >
          {text}
        </p>

        {/* LISTA DE INVITADOS COMPLETA */}
        {guests.length > 0 && (
          <div
            style={{
              marginTop: "1rem",
              textAlign: "left",
              background: "rgba(0,0,0,0.3)",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                color: "#fca5a5",
                marginBottom: "0.8rem",
              }}
            >
              Invitados ({guests.length})
            </p>

            <ul style={{ paddingLeft: "1rem", margin: 0 }}>
              {guests.map((g) => (
                <li
                  key={g.id}
                  style={{
                    color: "#eee",
                    fontSize: "0.85rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  {g.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const chapter = CHAPTERS.find((c) => c.id === activeChapter);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #0d0415 0%, #040208 70%)",
        position: "relative",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <StarBg />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem 1rem 5rem",
        }}
      >
        {/* Back button */}
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
          {activeChapter ? "← volver" : "← inicio"}
        </button>

        {/* ── HOME — Chapter list ── */}
        {!activeChapter && (
          <div
            style={{
              maxWidth: 500,
              width: "100%",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", padding: "4.5rem 1rem 2.5rem" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  filter: "drop-shadow(0 0 16px rgba(255,107,157,0.6))",
                }}
              >
                💍
              </div>
              <h1
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.8rem,6vw,2.8rem)",
                  fontWeight: 300,
                  color: "#f8d4ef",
                  marginBottom: "0.5rem",
                  textShadow: "0 0 40px rgba(255,107,157,0.3)",
                }}
              >
                Planeando el día
              </h1>
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right,transparent,rgba(255,107,157,0.3),transparent)",
                  margin: "1rem auto",
                  width: 160,
                }}
              />
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.9rem",
                  color: "rgba(220,200,255,0.4)",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                }}
              >
                Construyamos juntos cómo será nuestra boda mi amor.
                <br />
                No se que opinas de en serio guardar esto y en el momento dado
                ya tendremos por ejemplo la lista, detalles, lo importante.
              </p>
            </div>

            {/* Chapter cards */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {CHAPTERS.map((ch, i) => (
                <button
                  key={ch.id}
                  onClick={() => openChapter(ch.id)}
                  style={{
                    width: "100%",
                    padding: "1.3rem 1.5rem",
                    background: `rgba(${ch.rgb},0.05)`,
                    border: `1px solid rgba(${ch.rgb},0.18)`,
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: `all 0.5s ease ${i * 0.08}s`,
                    boxShadow: "none",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = `rgba(${ch.rgb},0.1)`;
                    b.style.borderColor = `rgba(${ch.rgb},0.4)`;
                    b.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = `rgba(${ch.rgb},0.05)`;
                    b.style.borderColor = `rgba(${ch.rgb},0.18)`;
                    b.style.transform = "translateX(0)";
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.8rem",
                      flexShrink: 0,
                      filter: `drop-shadow(0 0 8px rgba(${ch.rgb},0.4))`,
                    }}
                  >
                    {ch.emoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "1rem",
                        color: ch.color,
                        margin: "0 0 0.2rem",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {ch.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.76rem",
                        color: `rgba(${ch.rgb},0.5)`,
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      {ch.subtitle}
                    </p>
                  </div>
                  <span
                    style={{
                      color: `rgba(${ch.rgb},0.4)`,
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            {/* Nueva Sección de Boda Soñada */}
            {generarResumenBoda()}

            {/* Footer note */}
            <div
              style={{
                marginTop: "3rem",
                padding: "1.5rem",
                background: "rgba(255,107,157,0.04)",
                border: "1px solid rgba(255,107,157,0.12)",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.88rem",
                  color: "rgba(255,150,180,0.6)",
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                "Espero con ansias ese dia, tal vez en este momento parezca
                imposible y lejos, pero todo es un paso a paso mi amor y yo te
                aseguro que lo lograremos.
                <br />
                Te Amo y Te Amare hasta que la muerte nos separe, TE
                AMOOOOOOOOOO" ❤️‍🩹
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.68rem",
                  color: "rgba(255,107,157,0.3)",
                  letterSpacing: "0.15em",
                  margin: "0.8rem 0 0",
                }}
              >
                — Tu hombre
              </p>
            </div>
          </div>
        )}

        {/* ── CHAPTER VIEW ── */}
        {activeChapter && chapter && (
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.4s ease",
            }}
          >
            {/* Chapter header */}
            <div style={{ textAlign: "center", padding: "4.5rem 1rem 2rem" }}>
              <div
                style={{
                  fontSize: "2.2rem",
                  marginBottom: "0.8rem",
                  filter: `drop-shadow(0 0 14px rgba(${chapter.rgb},0.6))`,
                }}
              >
                {chapter.emoji}
              </div>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.68rem",
                  color: `rgba(${chapter.rgb},0.45)`,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                preparativos
              </p>
              <h1
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.6rem,5vw,2.4rem)",
                  fontWeight: 300,
                  color: chapter.color,
                  marginBottom: "0.4rem",
                  textShadow: `0 0 30px rgba(${chapter.rgb},0.25)`,
                }}
              >
                {chapter.title}
              </h1>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.85rem",
                  color: `rgba(${chapter.rgb},0.45)`,
                  fontStyle: "italic",
                }}
              >
                {chapter.subtitle}
              </p>
              <div
                style={{
                  height: "1px",
                  background: `linear-gradient(to right,transparent,rgba(${chapter.rgb},0.3),transparent)`,
                  margin: "1.2rem auto 0",
                  width: 140,
                }}
              />
            </div>

            {/* ── INTERFAZ CONDICIONAL: IMÁGENES O LISTA DE INVITADOS ── */}
            {chapter.isGuestList ? (
              // ── SECCIÓN: LISTA DE INVITADOS ──
              <div
                style={{
                  background: `linear-gradient(135deg, rgba(${chapter.rgb},0.05), rgba(10,5,20,0.9))`,
                  border: `1px solid rgba(${chapter.rgb},0.2)`,
                  borderRadius: "10px",
                  padding: "1.5rem",
                  boxShadow: `0 0 20px rgba(${chapter.rgb},0.05)`,
                }}
              >
                <h2
                  style={{
                    fontFamily: "Georgia, serif",
                    color: chapter.color,
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    fontSize: "1.2rem",
                    fontWeight: 300,
                  }}
                >
                  Agrega tus invitados mi vida.
                </h2>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <input
                    type="text"
                    value={guestInput}
                    onChange={(e) => setGuestInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddGuest()}
                    placeholder="Nombre del invitado..."
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid rgba(${chapter.rgb},0.4)`,
                      borderRadius: "6px",
                      color: "#fff",
                      fontFamily: "system-ui, sans-serif",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleAddGuest}
                    style={{
                      padding: "0.8rem 1.2rem",
                      background: `rgba(${chapter.rgb},0.15)`,
                      border: `1px solid rgba(${chapter.rgb},0.5)`,
                      borderRadius: "6px",
                      color: chapter.color,
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.2s",
                    }}
                  >
                    {editingGuestId ? "Guardar" : "Agregar"}
                  </button>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {guests.map((g) => (
                    <li
                      key={g.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.8rem 1rem",
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span
                        style={{ color: "#eee", fontFamily: "Georgia, serif" }}
                      >
                        {g.name}
                      </span>
                      <div style={{ display: "flex", gap: "0.8rem" }}>
                        <button
                          onClick={() => handleEditGuest(g)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#a5f3fc",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                          }}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(g.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fca5a5",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                  {guests.length === 0 && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "rgba(255,255,255,0.3)",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                        marginTop: "1rem",
                      }}
                    >
                      Nuestra lista está vacía. ¡Empieza a agregar a los
                      nuestros!
                    </p>
                  )}
                </ul>
                <div
                  style={{
                    marginTop: "1rem",
                    textAlign: "right",
                    fontSize: "0.8rem",
                    color: `rgba(${chapter.rgb},0.5)`,
                    fontStyle: "italic",
                  }}
                >
                  Total invitados: {guests.length}
                </div>
              </div>
            ) : (
              // ── SECCIÓN NORMAL: IMÁGENES Y TEXTOS ──
              <>
                {/* ── RENDERIZAR LISTA DE IMÁGENES SIMPLE (si existe) ── */}
                {chapter.images && (
                  <div style={{ padding: "0 0.2rem", marginBottom: "1.5rem" }}>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.7rem",
                        color: `rgba(${chapter.rgb},0.4)`,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        marginBottom: "0.8rem",
                      }}
                    >
                      ¿cuál prefieres? ✦
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: "0.6rem",
                      }}
                    >
                      {chapter.images.map((img, i) => {
                        const isSelected = selectedImages[chapter.id] === i;

                        return (
                          <div key={i} style={{ position: "relative" }}>
                            <button
                              onClick={() =>
                                setSelectedImages((prev) => ({
                                  ...prev,
                                  [chapter.id]: i,
                                }))
                              }
                              style={{
                                width: "100%",
                                padding: 0,
                                border: `2px solid rgba(${chapter.rgb},${
                                  isSelected ? 0.8 : 0.15
                                })`,
                                borderRadius: "8px",
                                cursor: "pointer",
                                overflow: "hidden",
                                transform: isSelected
                                  ? "scale(1.04)"
                                  : "scale(1)",
                                boxShadow: isSelected
                                  ? `0 0 16px rgba(${chapter.rgb},0.35)`
                                  : "none",
                                transition: "all 0.25s ease",
                                background: "none",
                                display: "block",
                              }}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  aspectRatio: "1/1",
                                }}
                              >
                                <img
                                  src={img.src}
                                  alt={img.label}
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    filter: isSelected
                                      ? "brightness(1.05)"
                                      : "brightness(0.75)",
                                  }}
                                />

                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "2rem",
                                    background: `rgba(${chapter.rgb},0.08)`,
                                    zIndex: -1,
                                  }}
                                >
                                  {chapter.emoji}
                                </div>

                                {isSelected && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "0.3rem",
                                      right: "0.3rem",
                                      width: "18px",
                                      height: "18px",
                                      borderRadius: "50%",
                                      background: chapter.color,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "0.6rem",
                                      color: "#0d0415",
                                    }}
                                  >
                                    ✓
                                  </div>
                                )}
                              </div>

                              <p
                                style={{
                                  fontFamily: "Georgia, serif",
                                  fontSize: "0.65rem",
                                  color: isSelected
                                    ? chapter.color
                                    : `rgba(${chapter.rgb},0.45)`,
                                  margin: "0.3rem 0",
                                  textAlign: "center",
                                  padding: "0 0.2rem 0.3rem",
                                }}
                              >
                                {img.label}
                              </p>
                            </button>

                            <button
                              onClick={() => setModalImage(img)}
                              style={{
                                position: "absolute",
                                bottom: "1.8rem",
                                right: "0.3rem",
                                background: "rgba(0,0,0,0.5)",
                                border: "none",
                                borderRadius: "4px",
                                color: "white",
                                padding: "2px 5px",
                                fontSize: "0.7rem",
                                cursor: "pointer",
                                opacity: 0.6,
                              }}
                            >
                              🔍
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── RENDERIZAR GRUPOS DE IMÁGENES (Novio/Novia) ── */}
                {chapter.imageGroups && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {chapter.imageGroups.map((group) => (
                      <div key={group.groupId} style={{ padding: "0 0.2rem" }}>
                        <p
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.7rem",
                            color: `rgba(${chapter.rgb},0.8)`,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            textAlign: "center",
                            marginBottom: "0.8rem",
                            fontWeight: "bold",
                          }}
                        >
                          {group.groupTitle} ✦
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: "0.6rem",
                          }}
                        >
                          {group.images.map((img, i) => {
                            const selectionKey = `${chapter.id}_${group.groupId}`;
                            const isSelected =
                              selectedImages[selectionKey] === i;

                            return (
                              <div key={i} style={{ position: "relative" }}>
                                <button
                                  onClick={() =>
                                    setSelectedImages((prev) => ({
                                      ...prev,
                                      [selectionKey]: i,
                                    }))
                                  }
                                  style={{
                                    width: "100%",
                                    padding: 0,
                                    border: `2px solid rgba(${chapter.rgb},${
                                      isSelected ? 0.8 : 0.15
                                    })`,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    transform: isSelected
                                      ? "scale(1.04)"
                                      : "scale(1)",
                                    boxShadow: isSelected
                                      ? `0 0 16px rgba(${chapter.rgb},0.35)`
                                      : "none",
                                    transition: "all 0.25s ease",
                                    background: "none",
                                    display: "block",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      aspectRatio: "1/1",
                                    }}
                                  >
                                    <img
                                      src={img.src}
                                      alt={img.label}
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
                                      }}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        filter: isSelected
                                          ? "brightness(1.05)"
                                          : "brightness(0.75)",
                                      }}
                                    />

                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "2rem",
                                        background: `rgba(${chapter.rgb},0.08)`,
                                        zIndex: -1,
                                      }}
                                    >
                                      {chapter.emoji}
                                    </div>

                                    {isSelected && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "0.3rem",
                                          right: "0.3rem",
                                          width: "18px",
                                          height: "18px",
                                          borderRadius: "50%",
                                          background: chapter.color,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "0.6rem",
                                          color: "#0d0415",
                                        }}
                                      >
                                        ✓
                                      </div>
                                    )}
                                  </div>

                                  <p
                                    style={{
                                      fontFamily: "Georgia, serif",
                                      fontSize: "0.65rem",
                                      color: isSelected
                                        ? chapter.color
                                        : `rgba(${chapter.rgb},0.45)`,
                                      margin: "0.3rem 0",
                                      textAlign: "center",
                                      padding: "0 0.2rem 0.3rem",
                                    }}
                                  >
                                    {img.label}
                                  </p>
                                </button>

                                <button
                                  onClick={() => setModalImage(img)}
                                  style={{
                                    position: "absolute",
                                    bottom: "1.8rem",
                                    right: "0.3rem",
                                    background: "rgba(0,0,0,0.5)",
                                    border: "none",
                                    borderRadius: "4px",
                                    color: "white",
                                    padding: "2px 5px",
                                    fontSize: "0.7rem",
                                    cursor: "pointer",
                                    opacity: 0.6,
                                  }}
                                >
                                  🔍
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sections */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    padding: "0 0.2rem",
                  }}
                >
                  {chapter.sections?.map((sec, i) => (
                    <div
                      key={i}
                      style={{
                        background: `linear-gradient(135deg, rgba(${chapter.rgb},0.05), rgba(10,5,20,0.9))`,
                        border: `1px solid rgba(${chapter.rgb},0.14)`,
                        borderRadius: "10px",
                        padding: "1.5rem",
                        opacity: sectionVisible ? 1 : 0,
                        transform: sectionVisible
                          ? "translateY(0)"
                          : "translateY(12px)",
                        transition: `all 0.5s ease ${i * 0.1}s`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "3px",
                            height: "16px",
                            background: chapter.color,
                            borderRadius: "2px",
                          }}
                        />
                        <h2
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.95rem",
                            fontWeight: 300,
                            color: chapter.color,
                            margin: 0,
                          }}
                        >
                          {sec.heading}
                        </h2>
                      </div>

                      <p
                        style={{
                          fontFamily: "Georgia, serif",
                          fontSize: "clamp(0.9rem,2.5vw,1rem)",
                          color: "rgba(220,200,255,0.78)",
                          lineHeight: 1.85,
                          fontStyle: "italic",
                          margin: sec.highlight ? "0 0 1rem" : 0,
                        }}
                      >
                        {sec.body}
                      </p>

                      {sec.highlight && (
                        <div
                          style={{
                            borderLeft: `2px solid rgba(${chapter.rgb},0.4)`,
                            paddingLeft: "1rem",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "Georgia, serif",
                              fontSize: "clamp(0.88rem,2.4vw,0.98rem)",
                              color: chapter.color,
                              fontStyle: "italic",
                              margin: 0,
                            }}
                          >
                            {sec.highlight}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Navigation between chapters */}
            <div
              style={{
                display: "flex",
                gap: "0.8rem",
                marginTop: "2.5rem",
                justifyContent: "center",
              }}
            >
              {(() => {
                const idx = CHAPTERS.findIndex((c) => c.id === activeChapter);
                const prev = CHAPTERS[idx - 1];
                const next = CHAPTERS[idx + 1];
                return (
                  <>
                    {prev && (
                      <button
                        onClick={() => openChapter(prev.id)}
                        style={{
                          flex: 1,
                          padding: "0.8rem",
                          background: `rgba(${prev.rgb},0.06)`,
                          border: `1px solid rgba(${prev.rgb},0.2)`,
                          borderRadius: "6px",
                          color: prev.color,
                          fontFamily: "Georgia, serif",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <span>←</span>
                        <span>
                          {prev.emoji} {prev.title}
                        </span>
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => openChapter(next.id)}
                        style={{
                          flex: 1,
                          padding: "0.8rem",
                          background: `rgba(${next.rgb},0.06)`,
                          border: `1px solid rgba(${next.rgb},0.2)`,
                          borderRadius: "6px",
                          color: next.color,
                          fontFamily: "Georgia, serif",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "0.4rem",
                        }}
                      >
                        <span>
                          {next.emoji} {next.title}
                        </span>
                        <span>→</span>
                      </button>
                    )}
                  </>
                );
              })()}
            </div>

            <div style={{ height: "2rem" }} />
          </div>
        )}
      </div>

      {/* ── MODAL DE IMAGEN COMPLETA ── */}
      {modalImage && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: "2rem",
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}
          >
            <img
              src={modalImage.src}
              alt={modalImage.label}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 0 50px rgba(255,255,255,0.15)",
              }}
            />
            <p
              style={{
                position: "absolute",
                bottom: "-2.5rem",
                left: 0,
                width: "100%",
                textAlign: "center",
                fontFamily: "Georgia, serif",
                color: "#ddd",
                fontStyle: "italic",
                margin: 0,
                textShadow: "0 1px 3px black",
              }}
            >
              {modalImage.label}
            </p>
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "-2rem",
                right: "-2rem",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
