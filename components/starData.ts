export interface StarData {
  id: number;
  position: [number, number, number];
  title: string;
  message: string;
  image?: string;
  special?: boolean;
}

export const STARS: StarData[] = [
  {
    id: 1,
    position: [-3.2, 2.1, -2],
    title: "La primera vez",
    message: "Desde el primer momento que te vi, algo en mí supo que eras especial. Como una estrella que aparece justo cuando más la necesitas.",
  },
  {
    id: 2,
    position: [2.8, 1.4, -1.5],
    title: "Tu risa",
    message: "Podría escuchar tu risa por siempre. Es la música más bonita que existe, y siempre me hace querer estar más cerca de ti.",
  },
  {
    id: 3,
    position: [-1.5, -2.3, -3],
    title: "Tus ojos",
    message: "Cuando te miro a los ojos, veo galaxias enteras. Profundos, cálidos, llenos de vida. Me pierdo en ellos y no quiero salir.",
  },
  {
    id: 4,
    position: [3.6, -1.8, -2],
    title: "Nuestra historia",
    message: "Cada día que pasa escribimos una nueva página juntos. Y todas y cada una de ellas son mis páginas favoritas.",
  },
  {
    id: 5,
    position: [-3.8, 0.3, -1],
    title: "Lo que me das",
    message: "Me das paz cuando el mundo es ruido. Me das fuerza cuando todo pesa. Me das amor sin condiciones. Y eso vale más que todo.",
  },
  {
    id: 6,
    position: [0.5, 3.2, -2.5],
    title: "Tus manos",
    message: "Agarrar tu mano es mi lugar favorito del mundo. Ahí me siento seguro, completo, en casa. Siempre quiero tenerla cerca.",
  },
  {
    id: 7,
    position: [1.2, -3.1, -1.8],
    title: "Tu fortaleza",
    message: "Eres más fuerte de lo que crees. He visto cómo enfrentas los días difíciles y me llenas de admiración. Eres increíble.",
  },
  {
    id: 8,
    position: [-2.1, 3.5, -3.5],
    title: "Los detalles",
    message: "Me encanta todo lo que te hace tú: cómo hablas, cómo gesticulas, cómo te ríes de tus propios chistes. Cada detalle, todo.",
  },
  {
    id: 9,
    position: [4.1, 0.8, -2.8],
    title: "El futuro",
    message: "Cuando pienso en el futuro, solo quiero que estés en él. No importa cómo sea, si estás tú, será perfecto.",
  },
  {
    id: 10,
    position: [-0.4, -3.8, -2],
    title: "Mi promesa",
    message: "Te prometo que siempre voy a estar aquí. En los días de sol y en las tormentas. Contigo, siempre.",
  },
  {
    id: 0,
    position: [0, 0, 0],
    title: "★ La estrella del amor",
    message: "Esta estrella tiene algo especial para ti…",
    special: true,
  },
];
