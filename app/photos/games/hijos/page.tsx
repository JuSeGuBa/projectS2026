"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretMessage from "../../../../components/SecretMessage";

interface Question {
  q: string;
  options: string[];
  correct: number;
  justification: string;
  specialModal?: boolean;
}

const ALL_QUESTIONS: Question[] = [
  {
    q: "¿Qué harías si nuestro hijo hace un berrinche en pleno supermercado?",
    options: [
      "Ignorarlo y seguir comprando",
      "Dejarle los productos y salir",
      "Tratar de calmarlo con amor y firmeza",
      "Comprarle lo que pide para que se calle",
    ],
    correct: 0,
    justification:
      "Los berrinches son normales, pero ceder o alterarse empeora todo. Eso se le pasa y sino ps se lleva al baño y su buena nalgada y ya jaja ps siiiii",
  },
  {
    q: "¿A qué edad crees que deberíamos darle su primer celular?",
    options: [
      "A los 8 años",
      "A los 10 años",
      "A los 12 años",
      "A los 15 años",
    ],
    correct: 3,
    justification:
      "A los 15 años tienen un poco más de madurez para entender los riesgos de la tecnología y redes sociales, aunque siempre necesitará nuestra supervisión y guía. Y eso que esta joven, Iker si por hay a los 15, pero Anto a los 30 ehhhhhhh",
  },
  {
    q: "¿Qué harías si nuestro hijo se pinta la cara con un marcador permanente antes de salir?",
    options: [
      "Tomarle una foto y reirnos",
      "Regañarlo inmediatamente",
      "Llevarlo al baño a lavarlo corriendo",
      "Dejarlo así hasta que se le quite solo",
    ],
    correct: 0,
    justification:
      "jajajaa que pecado, pero de malas jajaja quien lo manda, salimos normal ahjjajaja, pero si tocaria comprar algo en la drogueria para quitarle eso jaja. Se le toma la foto de recuerdo jaja",
  },
  {
    q: "¿Si nos llama la profesora porque nuestro hij@ le pego a otro niño?",
    options: [
      "Regañarlo en frente de la profesora",
      "Hablar con él a solas en casa",
      "Decir que el otro niño se lo buscó",
      "Quitarle los juguetes un mes",
    ],
    correct: 1,
    justification:
      "Es mejor hablar en privado, si el otro niño empezo y lo molesto, enseñarle a que respete pero no todo se soluciona con violencia, pero si por ejemplo fue Iker o Anto quien empezaron hay si corregirlos, pienso yo.",
  },
  {
    q: "¿Les dariamos solo juguetes si pasan en limpio las materias de un periodo?",
    options: [
      "Si",
      "Siempre",
      "No, solo con honores",
      "Si se esforzo y asi haya perdido materias",
    ],
    correct: 0,
    justification:
      "Creo que de mi parte hasta segundo grado, le daria juguetes, pero de hay en adelante, solo si paso a limpio, ya que eso le enseña a hacer responsable y que todo tiene su recompensa.",
  },
  {
    q: "¿Qué harías si Iker o Anto adolescente les decubrieramos novio o novia escondidas?",
    options: [
      "Ay mijo a sacar la correa",
      "Lo castigo por un año",
      "Le pregunto porque no nos dijo",
      "Me enojo pero lo acepto",
    ],
    correct: 2,
    justification:
      "Depende de la edad, porque a veces es por inocencia, pero si ya estan mas grandes y saben lo que hacen hay cambia, es bueno que nos tengan confianza desde pequeños y nos hablen de todo eso, porque ANTO solo puede tener novio desde los 30 AÑOS, OK? Iker por hay desde lo 18 en adelante, aunque tu y yo sabemos eso no siempre es asi, lo que yo quiero es que nos tengan confianza y nos cuenten todo para consejarlos y guiarlos y no cometan nuestros errores.",
  },
  {
    q: "¿Cuál crees que sería la regla innegociable en la casa para nuestros hijos?",
    options: [
      "Dormir a las 9 PM",
      "Saludar y despedirse siempre",
      "No usar pantallas en la mesa",
      "Ser honestos los 4",
    ],
    correct: 3,
    justification:
      "Todo empieza desde los padres, si nosotros les inculcamos esa honestidad y confianza a nuestros hijos, ellos seran asi, y nos tendran confianza y de ese modo los problemas que ellos tengan nos los afrontaran solos, sino los 4 como una familia.",
  },
  {
    q: "¿Qué harías si nuestro hijo dice una groseria en una cena familiar?",
    options: [
      "Reírme disimuladamente",
      "Hacer como que no escuché",
      "Corregirlo de inmediato",
      "Decirle que repita lo que dijo",
    ],
    correct: 2,
    justification:
      "Corregirlo al instante porque el debe saber que eso no esta bien, aunque igualmente muy probablemente jamas diga groserias, porque la realidad es que todo eso viene desde la casa y en nuestro caso no seria asi, pero si pasa hay que corregirlo.",
  },
  {
    q: "¿Cómo reaccionarías si rompe algo valioso jugando a la pelota adentro?",
    options: [
      "Le cobro de sus ahorros",
      "Le explico por qué no se juega adentro",
      "Le escondo la pelota para siempre",
      "Le grito y le pego con la chancla",
    ],
    correct: 2,
    justification:
      "Si es la primera vez que pasa y no lo sabia, listo se le explica y listo. Pero si es una segunda vez que pasa, el o ella sabiendo, hay si pailas, se le decomisa la pelota, el o ella saben que no se puede adentro solo afuera.",
  },
  {
    q: "¿Si nuestr@ hij@ dice que no quiere estudiar, ir al sena, o universidad, sino quiere irse a betel y ser misioner@ o algo asi. Que le diriamos?",
    options: [
      "Lo apoyo incondicionalmente",
      "Le exijo que estudie algo 'serio'",
      "Le digo que lo intente pero con un plan B",
      "Me niego rotundamente",
    ],
    correct: 0,
    justification:
      "Tu y yo sabemos que Jehova es lo primero, y yo quiero que mis hijos esten bien no solo materialmente, sino tambien espiritualmente, si ellos quieren servir a Jehova de tiempo completo, nada les va a faltar yo los apoyaria en todo y me sentiria orgulloso la verdad.",
  },
  {
    q: "¿Qué castigo usaría más si no hace su tarea?",
    options: [
      "Quitarle el internet",
      "No dejarlo salir con amigos",
      "Ponerlo a limpiar la casa",
      "Quitarle la consola/televisión",
    ],
    correct: 0,
    justification:
      "Hoy en día quitarle el internet es la consecuencia más directa y lógica. Sin eso la verdad no pueden hacer mucho, y de hecho al hacer eso, como que se obligarian a ser mas creativos y eso me gustaria, no quiero que sean adictos a la tecnologia, sino que resuelvan y sean creativos. Igualmente bajarian las notas por no hacer la tarea y pueden perder la materia y saben que si pierden no hay juguetes.",
  },
  {
    q: "¿Qué harías si descubres que se hizo pasar por enfermo para faltar al colegio?",
    options: [
      "Lo dejo dormir, un día es un día",
      "Lo llevo al colegio de todas formas",
      "Lo pongo a estudiar en casa el doble",
      "Lo castigo todo el fin de semana",
    ],
    correct: 1,
    justification:
      "Creo que nosotros no somos bobos ajjaja y sabremos si nuestr@ hij@ estan enfermos, asi que de malas para el colegio.",
  },
  {
    q: "¿Cómo celebrariamos su grado?",
    options: [
      "Hacerle una fiesta",
      "Una comida nosotros 4",
      "Un viaje",
      "Que el o ella decidan",
    ],
    correct: 3,
    justification:
      "El o ella ya cumplieron que elijan, que les gustaria pienso yo amor.",
  },
  {
    q: "¿Si nuestr@ hij@ nos pide pintar su cuarto de negro?",
    options: [
      "Le digo que está loco",
      "Negociamos pintar solo una pared",
      "Lo pinto de negro, es su cuarto",
      "Le ofrezco gris oscuro",
    ],
    correct: 1,
    justification:
      "Sinceramente yo siempre quise pintar mi cuarto de negro jajaja entonces yo estaria de acuerdo pero solo como una pared jaja",
  },
  {
    q: "¿Qué harías si se enamora por primera vez y le rompen el corazón?",
    options: [
      "Le compro helado y vemos películas",
      "Le digo 'te lo dije'",
      "Voy a reclamarle al/la ex",
      "Le digo que hay muchos peces en el mar",
    ],
    correct: 0,
    justification:
      "La primera opcion pero tambien le diria que hay muchos peces en el mar y que es parte de la vida y sabran cuando llegue el verdadero amor. Pero si le rompieron el corazon a mi Anto, pobre de aquel PUNTO FINAL",
  },
  {
    q: "¿Si quiere cenar únicamente dulces y helado?",
    options: [
      "Lo dejo por ser un día especial",
      "Le digo que no y le doy vegetales",
      "No, solo de postre",
      "Le escondo todos los dulces",
    ],
    correct: 2,
    justification:
      "No ellos tienen que comer bien, ya seria de postre o de onces, pero de almuerzo no.",
  },
  {
    q: "¿Qué deporte me gustaría enseñarle primero?",
    options: ["Fútbol", "Natación", "Baloncesto", "Boxeo"],
    correct: 1,
    justification:
      "Sinceramente me gustaria que aprendiera, futbol, natacion y baloncesto, porque natacion es muy bueno y eso para la vida es importante la verdad, futbol bacano, y baloncesto tambien ayuda mucho, enseñarle esas 3 y ya despues que el decida que le gusto mas.",
  },
  {
    q: "¿Qué harías si nuestro hijo nos pide adoptar un perrito?",
    options: [
      "Digo que sí inmediatamente",
      "Le digo que no, dan mucho trabajo",
      "Le digo que sí, pero él lo limpia",
      "Le compro un pez mejor",
    ],
    correct: 0,
    justification:
      "Si tu y yo somos sinceros, por inciativa de tu y yo amor ya tendriamos un perro jajaja, y de hecho a mi me gustaria que tuvieramos un perro cuando tengamos hijos, asi como a ti y a mi nos criaron.",
  },
  {
    q: "¿Qué harías si te dice que tiene miedo de los monstruos en su clóset?",
    options: [
      "Le digo que no existen y que duerma",
      "Me invento un 'spray antimonstruos'",
      "Dejo la luz encendida toda la noche",
      "Lo dejo dormir con nosotros",
    ],
    correct: 1,
    justification:
      "Esta tal vez te parezca una pregunta boba pero uno de pequeño tiene mucha imaginacion y algo que no sabes de mi, es que a mi me pasaba eso cuando era muy niño jajajaj, entonces yo le seguiria la corriente porque eventualmente el o ella se va a dar cuenta que no hay nada",
  },
  {
    q: "¿Quién crees que sera mejor abuelos, tus papas o los mios?",
    options: ["Los tuyos", "Los mios", "Ambos por igual"],
    correct: 2,
    justification:
      "Esta complicado jajaja mis padres les gustan los niños y me los imagino mimandolo jaja, tus padres creo que tambien le gustan pero que los mios son mas cariñosos con los niños creooooo, igual ya tu sabras tu los conoces mejor",
    specialModal: true,
  },
];

const THEME = {
  color: "#c084fc",
  rgb: "192,132,252",
  emoji: "👶",
  label: "Futuros Padres",
};

export default function QuizConoces() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Estados para las justificaciones personalizadas de ella
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [currentNote, setCurrentNote] = useState("");

  // Cargar las notas guardadas al montar el componente
  useEffect(() => {
    const saved = localStorage.getItem("parenting_quiz_user_notes");
    if (saved) {
      try {
        setUserNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Error al cargar notas guardadas:", e);
      }
    }
  }, []);

  // Cargar la música de fondo
  useEffect(() => {
    const audio = new Audio("/music/TheReason.mp3");
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

  // Cargar la nota guardada de la pregunta actual cuando cambie de pregunta
  useEffect(() => {
    if (started && questions[current]) {
      setCurrentNote(userNotes[questions[current].q] || "");
    }
  }, [current, started, questions]);

  const startQuiz = () => {
    setQuestions(ALL_QUESTIONS);
    setStarted(true);
  };

  const q = questions[current];

  const pick = (idx: number) => {
    if (selected !== null || !q) return;
    setSelected(idx);

    const correct = idx === q.correct;
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  // Función para manejar el guardado automático de la nota mientras escribe
  const handleNoteChange = (text: string) => {
    setCurrentNote(text);
    const updatedNotes = { ...userNotes, [q.q]: text };
    setUserNotes(updatedNotes);
    localStorage.setItem(
      "parenting_quiz_user_notes",
      JSON.stringify(updatedNotes),
    );
  };

  const next = () => {
    setSelected(null);
    if (current + 1 >= questions.length) {
      // Si es la última pregunta, muestra el modal especial antes del resultado final
      if (q.specialModal && !showSpecialModal) {
        setShowSpecialModal(true);
      } else {
        setShowSpecialModal(false);
        setShowResult(true);
      }
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const restart = () => {
    setStarted(false);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setShowSecret(false);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => router.push("/photos/games"), 500);
  };

  if (showSecret)
    return (
      <SecretMessage
        onClose={restart}
        onGoBack={goBack}
        lines={[
          "Oye, señorita... me encanta imaginar todas estas cosas contigo. Saber cómo reaccionarías y cómo seríamos como papás.",
          "Sé que falta tiempo, pero no puedo evitar pensar en lo hermosos que serían nuestros hijos y el equipo increíble que haríamos para criarlos.",
          "Gracias por todo, por hacerme soñar con un futuro tan bonito a tu lado. Te amo demasiado ❤️‍🩹",
        ]}
      />
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 30%, #0d0415 0%, #040208 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <style>{`
        @keyframes fadeInJustification {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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

      {/* ── PANTALLA DE INICIO ── */}
      {!started && (
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            padding: "5rem 1rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              color: "rgba(192,132,252,0.4)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            un pequeño viaje al futuro
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              fontWeight: 300,
              color: "#f0e8ff",
              textAlign: "center",
              margin: 0,
            }}
          >
            ¿Cómo seríamos como padres?
          </h1>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(200,180,255,0.4)",
              fontStyle: "italic",
              textAlign: "center",
              margin: 0,
            }}
          >
            Descubramos qué harías (o qué haría yo) en estas situaciones 👀 (ten
            en cuenta que las respuesta que puse son de mi perspectiva, si algo
            no te parece ya eso luego lo hablamos, lo importante es como
            imaginar que hariamos jejeje)
          </p>

          <button
            onClick={startQuiz}
            style={{
              marginTop: "2rem",
              width: "100%",
              padding: "1.2rem 1.5rem",
              background: `rgba(${THEME.rgb},0.06)`,
              border: `1px solid rgba(${THEME.rgb},0.2)`,
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                `rgba(${THEME.rgb},0.12)`;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                `rgba(${THEME.rgb},0.45)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                `rgba(${THEME.rgb},0.06)`;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                `rgba(${THEME.rgb},0.2)`;
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>{THEME.emoji}</span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.1rem",
                color: THEME.color,
                letterSpacing: "0.05em",
              }}
            >
              Comenzar test
            </span>
          </button>
        </div>
      )}

      {/* ── SPECIAL MODAL ── */}
      {showSpecialModal && (
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
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.99), rgba(10,4,22,0.99))",
              border: "1px solid rgba(255,107,157,0.25)",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 0 60px rgba(255,107,157,0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❤️‍🩹</div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: 300,
                color: "#f8d4ef",
                marginBottom: "1rem",
              }}
            >
              ¡Eso mi amorrrrrrrrrrrrrrrr!
            </h2>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(255,107,157,0.3), transparent)",
                marginBottom: "1rem",
              }}
            />
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                color: "rgba(220,200,255,0.82)",
                lineHeight: 1.75,
                fontStyle: "italic",
                marginBottom: "1.5rem",
              }}
            >
              Tal vez hayan respuestas diferentes pero siempre que estemos
              juntos y seamos un equipo incondicional para él o ella, todo
              eatara bien. No tengo idea de porque jaja, pero se que seras una
              excelente madre y yo un buen papa.
            </p>
            <button
              onClick={next}
              style={{
                width: "100%",
                padding: "0.8rem",
                background:
                  "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(192,132,252,0.1))",
                border: "1px solid rgba(255,107,157,0.35)",
                borderRadius: "3px",
                color: "#f8d4ef",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              continuar ♡
            </button>
          </div>
        </div>
      )}

      {/* ── RESULTADO ── */}
      {showResult && !showSecret && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(30,5,40,0.97), rgba(4,2,8,0.99))",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1.5rem",
              filter: `drop-shadow(0 0 20px rgba(${THEME.rgb},0.7))`,
            }}
          >
            {score === questions.length
              ? "👑"
              : score >= Math.ceil(questions.length * 0.6)
                ? "❤️‍🩹"
                : "🍼"}
          </div>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              color: `rgba(${THEME.rgb},0.5)`,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "0.8rem",
            }}
          >
            nivel superado {THEME.emoji}
          </p>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 300,
              color: "#f8d4ef",
              marginBottom: "0.6rem",
            }}
          >
            {score === questions.length
              ? "¡Perfecto! Ya estamos listos para ser papás 👑"
              : score >= Math.ceil(questions.length * 0.6)
                ? "¡Upaaaa bien amor! Seremos un gran equipo jaja"
                : "Casiiiiii, todavía nos toca practicar un poco más jajajaj"}
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              color: "rgba(200,180,255,0.6)",
              fontStyle: "italic",
              marginBottom: "2rem",
            }}
          >
            Acertaste {score} de {questions.length} situaciones
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
              onClick={() => setShowSecret(true)}
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
              ver mensaje secreto ✦
            </button>
            <button
              onClick={restart}
              style={{
                padding: "0.8rem 1.5rem",
                background: "transparent",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "3px",
                color: "rgba(200,170,255,0.5)",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              volver a jugar
            </button>
          </div>
        </div>
      )}

      {/* ── QUIZ ACTIVO ── */}
      {started && !showResult && q && (
        <div
          style={{ width: "100%", maxWidth: "480px", padding: "5rem 0 2rem" }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.68rem",
                color: `rgba(${THEME.rgb},0.6)`,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                border: `1px solid rgba(${THEME.rgb},0.2)`,
                borderRadius: "20px",
                padding: "0.25rem 0.8rem",
              }}
            >
              {THEME.emoji} {THEME.label}
            </span>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: "2rem", padding: "0 0.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(200,180,255,0.4)",
                }}
              >
                pregunta {current + 1} de {questions.length}
              </span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: `rgba(${THEME.rgb},0.5)`,
                }}
              >
                {score} correctas
              </span>
            </div>
            <div
              style={{
                height: "3px",
                background: `rgba(${THEME.rgb},0.1)`,
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "2px",
                  width: `${(current / questions.length) * 100}%`,
                  background: `linear-gradient(to right, rgba(${THEME.rgb},0.8), #c084fc)`,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,40,0.92), rgba(12,5,25,0.92))",
              border: `1px solid rgba(${THEME.rgb},0.15)`,
              borderRadius: "8px",
              padding: "1.8rem",
              marginBottom: "1.2rem",
              boxShadow: "0 0 30px rgba(192,84,252,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                color: "#f0e8ff",
                lineHeight: 1.6,
                margin: 0,
                textAlign: "center",
              }}
            >
              {q.q}
            </p>
          </div>

          {/* Options */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
          >
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct;
              const revealed = selected !== null;
              let bg = "rgba(20,8,40,0.6)";
              let border = `rgba(${THEME.rgb},0.12)`;
              let color = "rgba(220,200,255,0.75)";

              if (revealed && isCorrect) {
                bg = "rgba(100,220,130,0.12)";
                border = "rgba(100,220,130,0.5)";
                color = "#a0ffc0";
              } else if (revealed && isSelected && !isCorrect) {
                bg = "rgba(255,80,80,0.1)";
                border = "rgba(255,80,80,0.4)";
                color = "rgba(255,160,160,0.8)";
              }

              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={selected !== null}
                  style={{
                    padding: "0.85rem 1.2rem",
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: "6px",
                    cursor: selected !== null ? "default" : "pointer",
                    color,
                    fontFamily: "Georgia, serif",
                    fontSize: "0.9rem",
                    textAlign: "left",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      border: `1px solid ${
                        revealed && isCorrect
                          ? "rgba(100,220,130,0.5)"
                          : `rgba(${THEME.rgb},0.2)`
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: `rgba(${THEME.rgb},0.5)`,
                    }}
                  >
                    {revealed && isCorrect
                      ? "✓"
                      : revealed && isSelected
                        ? "✗"
                        : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* ── JUSTIFICACIÓN Y CUADRO DE TEXTO PERSONALIZADO ── */}
          {selected !== null && !showSpecialModal && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.5rem",
                background: "rgba(192,132,252,0.08)",
                border: "1px solid rgba(192,132,252,0.25)",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.2rem",
                animation: "fadeInJustification 0.5s ease",
              }}
            >
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.95rem",
                  color: "#f8d4ef",
                  lineHeight: 1.6,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      selected === q.correct
                        ? "#a0ffc0"
                        : "rgba(255,160,160,0.9)",
                  }}
                >
                  {selected === q.correct ? "Interesante, " : "En realidad... "}
                </span>
                <span
                  style={{
                    fontStyle: "italic",
                    color: "rgba(220,200,255,0.85)",
                  }}
                >
                  {q.justification}
                </span>
              </p>

              {/* Divisor estético */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "rgba(192,132,252,0.15)",
                }}
              />

              {/* Sección interactiva para ella */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.8rem",
                    color: "rgba(192,132,252,0.65)",
                    textAlign: "left",
                  }}
                >
                  ¿Qué piensas tú? Escribe tu propia opinión / respuesta: 📝
                </label>
                <textarea
                  value={currentNote}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Escribe aquí lo que harías tú en esta situación o lo que piensas..."
                  style={{
                    width: "100%",
                    minHeight: "90px",
                    background: "rgba(10, 4, 22, 0.6)",
                    border: "1px solid rgba(192, 132, 252, 0.2)",
                    borderRadius: "6px",
                    padding: "0.6rem 0.8rem",
                    color: "#f0e8ff",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.88rem",
                    lineHeight: "1.4",
                    resize: "vertical",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(192, 132, 252, 0.55)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(192, 132, 252, 0.2)")
                  }
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(200,180,255,0.35)",
                    textAlign: "right",
                    fontStyle: "italic",
                  }}
                >
                  Guardado automático activo ✦
                </span>
              </div>

              <button
                onClick={next}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.7rem 1.8rem",
                  background:
                    "linear-gradient(135deg, rgba(192,132,252,0.25), rgba(192,132,252,0.1))",
                  border: "1px solid rgba(192,132,252,0.4)",
                  borderRadius: "6px",
                  color: "#f0e8ff",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, rgba(192,132,252,0.35), rgba(192,132,252,0.15))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, rgba(192,132,252,0.25), rgba(192,132,252,0.1))";
                }}
              >
                {current + 1 === questions.length
                  ? "Ver resultado"
                  : "Siguiente pregunta ➝"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
