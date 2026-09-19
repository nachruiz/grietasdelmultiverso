/* ============================================================
   GRIETAS DEL MULTIVERSO — los once universos (parte pública)
   ------------------------------------------------------------
   Aquí NO hay nombres de autor, ni biografías, ni rutas de foto.
   Todo eso vive cifrado en secretos.json y solo se descifra en
   el navegador cuando alguien acierta la clave del archivo.
   Si editas un título o un fragmento, hazlo aquí.
   Para cambiar lo cifrado hay que regenerar secretos.json.
   ============================================================ */

const UNIVERSOS = [
  {
    id: 1,
    titulo: "El tejedor de destinos",
    fragmento: "La primera señal no vino de fuera. Vino de una decisión que no llegué a tomar.",
    icono: "img/iconos/icono-01.png",
    tono: [212, 88, 62],
    x: 0.18, y: 0.30
  },
  {
    id: 2,
    titulo: "Los viajeros sin destino",
    fragmento: "Hay puertas que solo existen mientras nadie las mira.",
    icono: "img/iconos/icono-02.png",
    tono: [188, 82, 58],
    x: 0.34, y: 0.17
  },
  {
    id: 3,
    titulo: "La ciudad perdida",
    fragmento: "Contamos el tiempo en direcciones. La nuestra se agotó.",
    icono: "img/iconos/icono-03.png",
    tono: [262, 72, 64],
    x: 0.50, y: 0.28
  },
  {
    id: 4,
    titulo: "Enemigos unidos",
    fragmento: "El mapa era correcto. El territorio había cambiado de opinión.",
    icono: "img/iconos/icono-04.png",
    tono: [168, 76, 56],
    x: 0.68, y: 0.19
  },
  {
    id: 5,
    titulo: "Lo que flota",
    fragmento: "Me reconocí en una voz que nunca había usado.",
    icono: "img/iconos/icono-05.png",
    tono: [290, 68, 66],
    x: 0.83, y: 0.33
  },
  {
    id: 6,
    titulo: "Al borde del abismo",
    fragmento: "Todo lo que se rompe deja un borde por donde entra la luz.",
    icono: "img/iconos/icono-06.png",
    tono: [318, 66, 64],
    x: 0.26, y: 0.56
  },
  {
    id: 7,
    titulo: "El despertar de Zothz",
    fragmento: "La grieta no separa mundos. Los presenta.",
    icono: "img/iconos/icono-07.png",
    tono: [232, 80, 62],
    x: 0.43, y: 0.68
  },
  {
    id: 8,
    titulo: "Etheran",
    fragmento: "Nadie avisó de que recordar también fuera un viaje.",
    icono: "img/iconos/icono-08.png",
    tono: [200, 84, 60],
    x: 0.59, y: 0.57
  },
  {
    id: 9,
    titulo: "Kane multiversal",
    fragmento: "Escribimos para que alguien, en algún sitio, no tenga que empezar de cero.",
    icono: "img/iconos/icono-09.png",
    tono: [148, 70, 54],
    x: 0.74, y: 0.71
  },
  {
    id: 10,
    titulo: "Nexus",
    fragmento: "La constelación estaba completa. Faltaba quien supiera leerla.",
    icono: "img/iconos/icono-10.png",
    tono: [276, 74, 66],
    x: 0.12, y: 0.74
  },
  {
    id: 11,
    titulo: "Los olvidados",
    fragmento: "Si todo está conectado, ninguna despedida es definitiva.",
    icono: "img/iconos/icono-11.png",
    tono: [340, 70, 64],
    x: 0.89, y: 0.60
  }
];

/* Enlaces de la constelación: pares de id que se dibujan unidos. */
const ENLACES = [
  [1, 2], [2, 3], [3, 4], [4, 5],
  [1, 6], [6, 7], [7, 8], [8, 9], [9, 5],
  [6, 10], [10, 7], [9, 11], [11, 5],
  [3, 7], [8, 4]
];
