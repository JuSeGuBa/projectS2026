"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Chapter {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  rgb: string;
  sections: Section[];
  images: { src: string; label: string }[]; // 3 imágenes por capítulo
}

interface Section {
  heading: string;
  body: string;
  highlight?: string; // frase destacada en rosa
}

// ── Content ────────────────────────────────────────────────────────────────────
// ✏️ Edita aquí el contenido de cada capítulo
const CHAPTERS: Chapter[] = [
  {
    id: "casa",
    emoji: "🏡",
    title: "Nuestra casa",
    subtitle: "El lugar donde todo empieza",
    color: "#fde8d0",
    rgb: "253,232,208",
    images: [
      { src: "/future/casa/casa-1.jpg", label: "Casa moderna" },
      { src: "/future/casa/casa-2.jpg", label: "Finca" },
      { src: "/future/casa/casa-3.jpg", label: "Hacienda" },
    ],
    sections: [
      {
        heading: "Cómo la imagino",
        body: "Amor yo me imagino la casa con hartoo espacio, con luz natural que entre por las mañanas y nos despierte juntos. Algo con jardín, donde los perros puedan correr y los niños puedan crecer libres. No necesita ser perfecta — solo de nosotros, nuestro hogar.",
        highlight:
          "No importa dónde sea. Si estás tú, porque tu eres mi hogar y espero ser el tuyo algun dia jejeje.",
      },
      {
        heading: "Nuestro cuarto",
        body: "Ese cuarto del que tantas veces hablamos. Con nuestra cama grande, oye tu lado del armario y yo del mioooo, tu lado y mi lado, luego me quitas mi ropa ehhhhhh JAJA. Buenos días cada mañana y buenas noches cada noche. Y otras cositas que no podemos mencionar solo cuando estemos casados JIJIJI JAJ. Ese cuarto es nuestro mundo pequeño.",
      },

      {
        heading: "La habitación roja... jaja",
        body: "La mencione porque tu eras felizzz hablando de eso jajaj... jaja no voy a decir nada más. Y es muy posible que la tengamos, antes que llegue Iker y Anto. Solo que ya la tengo muy imaginada y creo que tú también 😏❤️‍🩹",
        highlight: "JIJIJI... JAJAJAJ",
      },
      {
        heading: "El cuarto de los niños",
        body: "Al principio comparten cuarto, para que se acompañen, seria chevere una cama con camarote ajja. Ya cuando crezcan cada uno su cuartico, que dices?",
      },
      {
        heading: "La cocina",
        body: "A ti como te encanta cocinar, una cocina grandeeee, con un meson grande en el medio, estufa empotrada, concepto abierto, entiendes? Quedaria genial",
      },
      {
        heading: "La Sala",
        body: "Un Sofa grande pero que sea sofa cama, para ver peliculas tu y yo, y ya cuando esten los niños ver los 4, un tv grande, todo acogedor jajaja",
      },
      {
        heading: "Lo demas quiero que lo hablemos tu y yooo",
        body: "Faltan muchas cosas de la casaaa, pero estas son algunas principales, ya ps tu y yo hablaremos todooo lo que falta jaja. Pero mi amor vez que estoy emocionado por nuestro hogar?",
      },
    ],
  },
  {
    id: "viajes",
    emoji: "✈️",
    title: "Nuestros viajes",
    subtitle: "El mundo nos espera",
    color: "#a5f3fc",
    rgb: "165,243,252",
    images: [
      { src: "/future/viajes/viaje-1.jpg", label: "Italia" },
      { src: "/future/viajes/viaje-2.jpg", label: "Japon" },
      { src: "/future/viajes/viaje-3.jpg", label: "Francia" },
    ],
    sections: [
      {
        heading: "Japón",
        body: "Seria interesante, la tecnologia me interesa mas que todo eso la verdad jaja. Perdernos por Tokio, comer ramen a medianoche. Japón y de hecho tambien China, la gran muralla y todo eso, siempre he tenido curiosidad y quiero que seas tú quien esté a mi lado cuando lo veamos por primera vez.",
        highlight: "Un viaje grande contigo mi todo.",
      },
      {
        heading: "Italia",
        body: "Roma, Venecia, la Toscana. Caminar por calles antiguas, comer pasta de verdad, ver el sol ponerse sobre el Coliseo. Italia siempre me pareció el lugar muy bacano y quiero vivirlo con la persona más especial de mi vida.",
        highlight:
          "Mi amor tu y yo mi amor jajaj, amor yo me imaginando hablandote con voz gruesa haya en el coliseo issss ajajajaj.",
      },
      {
        heading: "Nuestra Francia",
        body: "Isss Paris, te imaginas, pan frances jajajajajo. La City de amor jajaj, estaria chevre you and me, vamos a la torre ifel, un vinito un pancito, todo sabroso contigo mi amor jaja.",
        highlight: "A la ciudad del amor, con el amor de mi vida.",
      },
      {
        heading: "Y los que vendrán",
        body: "Maldivas, España, Estados Unidos... la lista es larga y eso me emociona. Algunos los mencione en otro lado de la pagina amor asi que pendiente jeje. Porque significa que tenemos mucha vida por delante, muchos aviones que tomar y muchas fotos que tomarnos. No puedo esperar mi amorrrr.",
      },
    ],
  },
  {
    id: "hijos",
    emoji: "👶",
    title: "Nuestros hijos",
    subtitle: "Iker y Anto",
    color: "#bbf7d0",
    rgb: "187,247,208",
    images: [
      { src: "/future/hijos/hijos-1.png", label: "Iker" },
      { src: "/future/hijos/hijos-2.png", label: "Anto" },
      { src: "/future/hijos/hijos-3.png", label: "Nosotros 4" },
    ],
    sections: [
      {
        heading: "Iker",
        body: "Nuestro primer varón. Lo imagino con tus ojos y mi carácter, como un varon jaja. Activo, curioso, con mucha energía, fuerte. Lo imagino corriendo por el jardín, haciendo preguntas que no sabemos contestar y siendo el hermano mayor que cuida a su hermana y conociendolo que de pronto sera muy protector cuidando a su mama.",
        highlight: "Iker — el principe de nuestra familia.",
      },
      {
        heading: "Anto",
        body: "Nuestra Anto. La imagino dulce, inteligente, con tu ternura, ay dios mio y mas celosa que tu jajajaja ay tu sabes que si. La imagino dibujando, preguntando el porqué de todo. Y siendo nuestra princesa de la casa toda hermosa.",
        highlight: "Anto — la princesa que soñamos cada dia mi Reina.",
      },
      {
        heading: "Nosotros 4",
        body: "Creo que el dia que lleguen, tendremos miedo, nervios, pero tambien felices y emocionados. La verdad yo sueño con esa famila contigo mi vida, y creo que tu tambien. Tal vez no todo sea color de rosa, pero si estamos juntos todo estara bien, y se que amaremos a nuestros hijos, y les inculcaremos ese amor a Jehova que hay que tener, yo te voy a proteger a ti y a Anto e Iker y tu eres el corazon de la familia, la ternura y el amor, tu y yo somos el completemento, porque cuando tu caes yo te levanto, y si yo caigo tu me levantas y se que asi sera con nuestros bebes.",
        highlight: "Te Amo demasiado y desde ahora amo a nuestros hijos ❤️‍🩹",
      },
    ],
  },
  {
    id: "rutina",
    emoji: "☀️",
    title: "Nuestra vida diaria",
    subtitle: "Los días simples son los mejores",
    color: "#fca5a5",
    rgb: "252,165,165",
    images: [
      { src: "/future/vida/vida-1.png", label: "Las mañanas" },
      { src: "/future/vida/vida-2.png", label: "En familia" },
      { src: "/future/vida/vida-3.png", label: "Las noches" },
    ],

    sections: [
      {
        heading: "Las mañanas",
        body: "Despertarnos juntos, arrunchaditos jeje. Los dos preparando el desayuno o solo yo o solo tu jajajajja, dependiendo de quién se levanta primero jajajaj o los dos tambien. Los niños viendo Nickeloden o Disney Chanell jaja, el perro con ellos, creo que seria muy nosotros jaja.",
        highlight:
          "Si ahora cada dia es un regalo, te imaginas esos dias? jeje",
      },
      {
        heading: "Las tardes",
        body: "Tardes en familia. Llevar al perro al parque, enseñarles a andar en cicla, estar pendiente de ellos en el parque. Esas tardes sencillas que parecen normales pero en realidad son todo.",
        highlight:
          "Tardes en familia, comiendo helado en el parque, o si llueve tarde de peliculas de Marvel JAJAJ",
      },
      {
        heading: "Las noches",
        body: "Siempre hacer la oracion en familia al dormir, después de que los niños duerman, ese momento nuestro. Película, o solo hablar, o ya sabes JAJAJ perdon JAJ. Arruncharnos, mirarnos y saber que logramos lo que tanto soñamos y estar satisfechos en ese momento y saber que todo valio la pena.",
        highlight: "Las noches son nuestras jeje.",
      },
    ],
  },
  {
    id: "suenos",
    emoji: "🌟",
    title: "Nuestros sueños",
    subtitle: "Todo lo que vamos a cumplir",
    color: "#ffd97a",
    rgb: "255,217,122",
    images: [
      { src: "/future/vida/vida-2.png", label: "Nuestra familia" },
      { src: "/future/viajes/viaje-3.jpg", label: "Maldivas" },
      { src: "/future/casa/casa-1.jpg", label: "Nuestro hogar" },
    ],
    sections: [
      {
        heading: "La espiritualidad de nuestra familia",
        body: "Tal vez yo siervo ministerial, tu precursora, dandole estudio a nuestros hijos, sirviendo a Jehova todos, Iker en su primera lectura, Anto dando su primer comentario. Algo muy bonito",
        highlight:
          "Con Jehova no solo nos ira bien a ti y a mi, sino tambien de como criaremos a los niños mi amor.",
      },
      {
        heading: "La estabilidad",
        body: "No hablo de dinero, hablo de tranquilidad. De no preocuparnos por el arriendo, de poder darles a nuestros hijos todo lo que necesitan, de viajar sin calcular cada peso. Esa estabilidad la vamos a construir poco a poco, juntos y con ayuda de Jehova mi vida.",
        highlight:
          "Una vida tranquila y en paz, las que nos merecemos nosotros y nuestros hijos.",
      },
      {
        heading: "Envejecer juntos",
        body: "Al final de todo, solo quiero envejecer a tu lado. Con arrugas, con canas, con nietos corriendo por la casa. Mirar atrás y decir: lo logramos. Eso es lo que más sueño.",
        highlight:
          "Envejecer contigo — ese es el sueño más grande que tengo en mi vida. De verdad Te Amo tanto eres todo mi mundo ❤️‍🩹",
      },
    ],
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
export default function NuestroFuturoPage() {
  useEffect(() => {
    const audio = new Audio("/music/Riptide.mp3");
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
  // Nuevo estado para la imagen en el modal
  const [modalImage, setModalImage] = useState<{
    src: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

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

  // Función para cerrar el modal
  const closeModal = () => setModalImage(null);

  // Función para generar el texto narrativo del resumen
  const generarResumen = () => {
    const selections: { chapter: string; label: string; emoji: string }[] = [];
    CHAPTERS.forEach((ch) => {
      const idx = selectedImages[ch.id];
      if (idx !== undefined) {
        selections.push({
          chapter: ch.title
            .replace("Nuestra ", "")
            .replace("Nuestros ", "")
            .replace("Nuestra ", ""),
          label: ch.images[idx].label,
          emoji: ch.emoji,
        });
      }
    });

    if (selections.length === 0) return null;

    let text = "Así imagino nuestro futuro juntos: ";
    selections.forEach((sel, i) => {
      text += `con nuestra ${sel.chapter} siendo una ${sel.label} ${sel.emoji}`;
      if (i === selections.length - 2) text += " y ";
      else if (i < selections.length - 2) text += ", ";
    });
    text += ".";

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
            textShadow: "0 0 10px rgba(255,107,157,0.3)",
          }}
        >
          Tu visión conjunta ❤️‍🩹
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {selections.map((sel) => {
            const ch = CHAPTERS.find((c) => c.title.includes(sel.chapter))!;
            const imgIdx = selectedImages[ch.id];
            return (
              <div
                key={sel.chapter}
                style={{ position: "relative", width: 60, height: 60 }}
              >
                <img
                  src={ch.images[imgIdx].src}
                  alt={sel.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: `1px solid rgba(${ch.rgb},0.3)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -5,
                    right: -5,
                    fontSize: "1.2rem",
                    filter: `drop-shadow(0 0 5px rgba(${ch.rgb},0.5))`,
                  }}
                >
                  {sel.emoji}
                </div>
              </div>
            );
          })}
        </div>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.92rem",
            color: "rgba(220,200,255,0.7)",
            lineHeight: 1.8,
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {text}
        </p>
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
                ❤️‍🩹
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
                Mira amor nuestro futuro jeje
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
                Todo lo que vamos a vivir y construiremos juntos.
                <br />
                Cada capítulo es un pedazo de lo que viene.
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

            {/* Nueva Sección de Resumen */}
            {generarResumen()}

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
                "La verdad no se cuando podremos lograr todas nuestras metas
                jeje.
                <br />
                Pero sí sé que quiero vivir cada momento a tu lado.
                <br />Y eso es mas que suficiente. Eres un hermoso regalo." Te
                Amo infinitamente ❤️‍🩹
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
                — El hombre que te ama...
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
                nuestro futuro
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

            {/* ── IMÁGENES — 3 opciones visuales ── */}
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
                ¿cómo te lo imaginas? ✦
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
                          transform: isSelected ? "scale(1.04)" : "scale(1)",
                          boxShadow: isSelected
                            ? `0 0 16px rgba(${chapter.rgb},0.35)`
                            : "none",
                          transition: "all 0.25s ease",
                          background: "none",
                          display: "block",
                        }}
                      >
                        <div
                          style={{ position: "relative", aspectRatio: "1/1" }}
                        >
                          <img
                            src={img.src}
                            alt={img.label}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
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

                          {/* Emoji fallback */}
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

                      {/* Botón para agrandar */}
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

            {/* Sections */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                padding: "0 0.2rem",
              }}
            >
              {chapter.sections.map((sec, i) => (
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
                  {/* heading */}
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
          onClick={closeModal} // Cerrar al hacer clic fuera
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
            {/* Botón Cerrar X */}
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
