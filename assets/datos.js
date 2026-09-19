/* ============================================================
   GRIETAS DEL MULTIVERSO — datos de los once universos
   ------------------------------------------------------------
   Los nombres y países salen de la cubierta. Los TÍTULOS de los
   relatos y los FRAGMENTOS son marcadores: sustitúyelos por los
   reales. La web se reconstruye sola a partir de este archivo.
   ============================================================ */

const UNIVERSOS = [
  {
    id: 1,
    autor: "Nacho Ruiz-Hens",
    pais: "España",
    titulo: "El tejedor de destinos",
    fragmento: "La primera señal no vino de fuera. Vino de una decisión que no llegué a tomar.",
    ciudad: "Madrid, España",
    redes: "@nachoruizhens",
    bio: "Licenciado en Administración y Dirección de Empresas, ha desarrollado su carrera en el sector de las energías renovables y vive entre Nueva York y Madrid. Es autor de Arzan Cuernoscuro (Valhalla Ediciones, 2025), finalista del Premio Ignotus 2026. Puso en marcha el proyecto Grietas del Multiverso, donde firma tres relatos y la coda. Divulga sobre salud mental: su charla TEDx «Living Fully with Bipolar Disorder» supera el medio millón de visualizaciones.",
    foto: "img/autores/01.png",
    icono: "img/iconos/icono-01.png",
    tono: [212, 88, 62],          // matiz, saturación %, luminosidad % del universo
    x: 0.18, y: 0.30              // posición en la constelación (0-1)
  },
  {
    id: 2,
    autor: "Julio Salvatierra",
    pais: "España",
    titulo: "Los viajeros sin destino",
    fragmento: "Hay puertas que solo existen mientras nadie las mira.",
    ciudad: "Granada, España",
    redes: "@juliosalvatierraescritor",
    bio: "Dramaturgo, guionista y narrador. Tras licenciarse en Medicina, ha desarrollado una extensa carrera en teatro y cine: cerca de cuarenta obras estrenadas en veinte países, con el Premio El Ojo Crítico de Teatro (RNE) y el Premio Teatro de Autor entre sus reconocimientos. Acaba de publicar su primera novela, El mundo de las seis ruedas, un thriller espacial con alma de historia de iniciación.",
    foto: "img/autores/02.png",
    icono: "img/iconos/icono-02.png",
    tono: [188, 82, 58],
    x: 0.34, y: 0.17
  },
  {
    id: 3,
    autor: "Domènec J. Nácher",
    pais: "España",
    titulo: "La ciudad perdida",
    fragmento: "Contamos el tiempo en direcciones. La nuestra se agotó.",
    ciudad: "Vila-real, España",
    redes: "@nacherflor",
    bio: "Licenciado en Filosofía de la Ciencia. Su trayectoria narrativa arranca con la obra colectiva 16/17 (deu relats) (Tres i Quatre, 1989), que alcanzó dieciséis ediciones hasta 1996. Ha publicado narraciones cortas y artículos de opinión en la prensa de Castellón, y ha sido tertuliano de radio. Sus escritos exploran la fragilidad de la realidad: lo que se quiebra cuando lo imposible irrumpe.",
    foto: "img/autores/03.jpg",
    icono: "img/iconos/icono-03.png",
    tono: [262, 72, 64],
    x: 0.50, y: 0.28
  },
  {
    id: 4,
    autor: "Leonardo Bonfiglio",
    pais: "Argentina",
    titulo: "Enemigos unidos",
    fragmento: "El mapa era correcto. El territorio había cambiado de opinión.",
    ciudad: "Mendoza, Argentina",
    redes: "@leobonfigliook",
    bio: "Abogado y escritor, reside actualmente en Como (Italia). Apasionado del cine y la literatura, ha escrito una novela de ciencia ficción con tintes de romance y ha realizado varios cortometrajes. A través de sus textos busca explorar las dimensiones emocionales y filosóficas de la experiencia humana, sin renunciar al entretenimiento como vehículo para conectar con el lector.",
    foto: "img/autores/04.jpg",
    icono: "img/iconos/icono-04.png",
    tono: [168, 76, 56],
    x: 0.68, y: 0.19
  },
  {
    id: 5,
    autor: "Christa Stahl",
    pais: "México",
    titulo: "Lo que flota",
    fragmento: "Me reconocí en una voz que nunca había usado.",
    ciudad: "Ciudad de México, México",
    redes: "@christastahl.autora",
    bio: "Licenciada en Comunicación, con posgrado en Periodismo y maestría en Comunicación Organizacional. Ha sido editora y directora editorial de revistas culturales y académicas universitarias. Publica trabajos académicos con su nombre y firma siempre como Christa Stahl al escribir literatura. Su escritura busca un mundo de palabras donde atesorar la belleza de lo real y lo imaginario.",
    foto: "img/autores/05.png",
    icono: "img/iconos/icono-05.png",
    tono: [290, 68, 66],
    x: 0.83, y: 0.33
  },
  {
    id: 6,
    autor: "Katherine Strubinger",
    pais: "Venezuela",
    titulo: "Al borde del abismo",
    fragmento: "Todo lo que se rompe deja un borde por donde entra la luz.",
    ciudad: "Caracas, Venezuela",
    redes: "@katherine.strubinger",
    bio: "Venezolana de origen, reside en España a raíz del éxodo migratorio. Su formación en Diseño Gráfico, complementada con estudios de música, piano y orfebrería, refleja una búsqueda constante de expresión artística. Madre de tres hijos pequeños, ha hecho de la creatividad y la comunicación los pilares de su trayectoria: para ella el arte es un puente hacia la emoción y la transformación.",
    foto: "img/autores/06.png",
    icono: "img/iconos/icono-06.png",
    tono: [318, 66, 64],
    x: 0.26, y: 0.56
  },
  {
    id: 7,
    autor: "Oreidy Bracho",
    pais: "Venezuela",
    titulo: "El despertar de Zothz",
    fragmento: "La grieta no separa mundos. Los presenta.",
    ciudad: "Barinas, Venezuela",
    redes: "@oreidy.bracho",
    bio: "Escribe ficción y no ficción. Emprendedora, es la creadora de Synapsis, conferenciante y facilitadora de procesos de desarrollo personal. Desde hace más de quince años estudia y practica herramientas orientadas al bienestar y al autoconocimiento. Tras participar en Gondomar, el secreto de la taberna, su primer libro colectivo, continúa explorando el mundo literario con nuevas colaboraciones.",
    foto: "img/autores/07.jpg",
    icono: "img/iconos/icono-07.png",
    tono: [232, 80, 62],
    x: 0.43, y: 0.68
  },
  {
    id: 8,
    autor: "Albert Vhramn",
    pais: "México",
    titulo: "Etheran",
    fragmento: "Nadie avisó de que recordar también fuera un viaje.",
    ciudad: "Ciudad de México, México",
    redes: "@albertvhramn",
    bio: "Licenciado en Informática por la Universidad Nacional Autónoma de México, entusiasta de la tecnología y de entender cómo funcionan las cosas. Desde niño inventaba historias y las continuaba en su cabeza, hasta que necesitó volcarlas en papel. Prepara su primera novela de ciencia ficción. Escribir en colectivo le ha hecho transgredir su propia idea de que escribir es un acto en solitario.",
    foto: "img/autores/08.jpg",
    icono: "img/iconos/icono-08.png",
    tono: [200, 84, 60],
    x: 0.59, y: 0.57
  },
  {
    id: 9,
    autor: "Pedro-Emilio Ardila",
    pais: "Colombia",
    titulo: "Kane multiversal",
    fragmento: "Escribimos para que alguien, en algún sitio, no tenga que empezar de cero.",
    ciudad: "Norte de Santander, Colombia",
    redes: "@pedroemilio_ardila_escritor",
    bio: "Profesor, arquitecto y doctor en Urbanismo, reside en Noruega, donde está nacionalizado. Ejerció la arquitectura y el urbanismo durante muchos años y hoy se dedica a la escritura a tiempo completo. Ha publicado cinco libros colectivos de ficción y está a punto de publicar una novela histórica. Galardón Excelencia Internacional de Narrativa en el Premio Lucius Annaeus Séneca (Italia, 2026).",
    foto: "img/autores/09.jpg",
    icono: "img/iconos/icono-09.png",
    tono: [148, 70, 54],
    x: 0.74, y: 0.71
  },
  {
    id: 10,
    autor: "Beatriz Pilar Pérez Benlloch",
    pais: "España",
    titulo: "Nexus",
    fragmento: "La constelación estaba completa. Faltaba quien supiera leerla.",
    ciudad: "Valencia, España",
    redes: "@beatrizpilar.pb",
    bio: "Diplomada en Magisterio de Educación Infantil y en Logopedia, con un Máster Universitario en Intervención Logopédica Especializada. Compagina la docencia con una formación continua en los ámbitos educativo y literario, y con su faceta artística como actriz. Ha participado en Sonrisas descalzas, Microcosmos y Voces de amor y desamor.",
    foto: "img/autores/10.jpg",
    icono: "img/iconos/icono-10.png",
    tono: [276, 74, 66],
    x: 0.12, y: 0.74
  },
  {
    id: 11,
    autor: "Claudia Comanges",
    pais: "España",
    titulo: "Los olvidados",
    fragmento: "Si todo está conectado, ninguna despedida es definitiva.",
    ciudad: "Barcelona, España",
    redes: "@claudiacomangeswords",
    bio: "Experta en comunicación, escritura y marketing, ejerce de correctora y coach literaria. Escribe novelas de género —comedia romántica, drama, fantástica— destinadas a un público juvenil y new adult, con un estilo fresco y directo. Segundo premio de poesía en el certamen internacional Golden Aster Book (2020). Comparte su experiencia como escritora en YouTube e Instagram.",
    foto: "img/autores/11.jpg",
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
