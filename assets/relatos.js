/* ============================================================
   GRIETAS DEL MULTIVERSO — la escena de cada relato
   ------------------------------------------------------------
   Al hacer clic en un universo que tenga ilustración, aparece a
   un lado sin tapar la constelación: se puede seguir navegando
   por los demás relatos. Llega velada por la izquierda, como una
   señal que aún no ha terminado de llegar; un clic la resuelve.
   Las burbujas son portales: al acercarse, se encienden.

   Para añadir la escena de otro relato basta con un bloque más
   en ESCENAS, con el id del universo y las burbujas en tanto
   por ciento sobre la imagen.
   ============================================================ */

const ESCENAS = {
  1: {
    imagen: "img/relatos/01-tejedor.webp",
    respaldo: "img/relatos/01-tejedor.png",
    proporcion: "915 / 1100",
    pie: "Khorian",
    burbujas: [
      { x: 17.5, y: 30.0, r: 14.7, nombre: "El hilo" },
      { x: 81.4, y: 41.4, r: 18.0, nombre: "La ciudad al otro lado" },
      { x: 52.2, y: 46.8, r: 4.2,  nombre: "La llave" }
    ]
  },
  4: {
    imagen: "img/relatos/03-enemigos.webp",
    respaldo: "img/relatos/03-enemigos.png",
    proporcion: "1200 / 800",
    pie: "Enemigos unidos",
    burbujas: [
      { x: 37.8, y: 53.0, r: 6.8, nombre: "La reliquia" },
      { x: 61.2, y: 20.0, r: 3.4, nombre: "El ojo" },
      { x: 17.5, y: 63.0, r: 7.0, nombre: "El arco" }
    ]
  },
  2: {
    imagen: "img/relatos/02-viajeros.webp",
    respaldo: "img/relatos/02-viajeros.png",
    proporcion: "1100 / 917",
    pie: "Dal Moon Walters",
    burbujas: [
      { x: 48.6, y: 15.7, r: 8.7, nombre: "Ciudad bajo la luna" },
      { x: 85.3, y: 19.7, r: 8.0, nombre: "El umbral" },
      { x: 66.7, y: 44.7, r: 13.9, nombre: "La grieta" },
      { x: 92.2, y: 51.1, r: 7.0, nombre: "El anillo" },
      { x: 62.6, y: 74.7, r: 6.9, nombre: "La nebulosa" },
      { x: 82.4, y: 74.0, r: 8.0, nombre: "Tierra rota" }
    ]
  }
};

(() => {
  "use strict";

  if (!Object.keys(ESCENAS).length) return;

  /* ── Estructura, creada una sola vez ─────────────────────── */
  const visor = document.createElement("div");
  visor.className = "escena";
  visor.hidden = true;
  visor.setAttribute("role", "complementary");
  visor.setAttribute("aria-label", "Escena del relato");
  visor.innerHTML = `
    <button class="escena-cerrar" type="button" aria-label="Cerrar la escena">×</button>
    <figure class="escena-marco">
      <img class="escena-base" alt="">
      <img class="escena-velo" alt="" aria-hidden="true">
      <img class="escena-desfase" alt="" aria-hidden="true">
      <div class="escena-lineas" aria-hidden="true"></div>
      <div class="escena-portales"></div>
      <figcaption class="escena-pie"></figcaption>
    </figure>
    <p class="escena-pista">Toca la imagen para que la señal se estabilice</p>
  `;
  document.body.appendChild(visor);

  const marco    = visor.querySelector(".escena-marco");
  const base     = visor.querySelector(".escena-base");
  const velo     = visor.querySelector(".escena-velo");
  const desfase  = visor.querySelector(".escena-desfase");
  const portales = visor.querySelector(".escena-portales");
  const lineas   = visor.querySelector(".escena-lineas");
  const pie      = visor.querySelector(".escena-pie");
  const pista    = visor.querySelector(".escena-pista");
  const cerrarBtn = visor.querySelector(".escena-cerrar");

  let abierta = false;

  function abrir(escena) {
    base.src = velo.src = desfase.src = escena.imagen;
    base.onerror = velo.onerror = () => {
      if (escena.respaldo) base.src = velo.src = desfase.src = escena.respaldo;
    };
    marco.style.aspectRatio = escena.proporcion;
    // una ilustración vertical con el ancho de una apaisada se saldría
    // por arriba y por abajo: estrechamos el panel según su proporción
    const [an, al] = escena.proporcion.split("/").map(n => parseFloat(n));
    visor.style.setProperty("--ancho", an < al
      ? "clamp(230px, 19vw, 400px)"
      : "clamp(340px, 31vw, 650px)");
    // el barrido usa la imagen como máscara, así no dibuja un rectángulo
    const mascara = `url("${escena.imagen}")`;
    lineas.style.webkitMaskImage = lineas.style.maskImage = mascara;
    pie.textContent = escena.pie || "";

    portales.innerHTML = "";
    escena.burbujas.forEach(b => {
      const p = document.createElement("span");
      p.className = "portal";
      p.setAttribute("role", "presentation");
      p.style.left = b.x + "%";
      p.style.top = b.y + "%";
      p.style.width = p.style.height = (b.r * 2) + "%";
      p.innerHTML = `<span class="portal-nombre">${b.nombre}</span>`;
      portales.appendChild(p);
    });

    visor.hidden = false;
    visor.classList.remove("nitida");
    abierta = true;
    requestAnimationFrame(() => visor.classList.add("dentro"));
  }

  function cerrar() {
    visor.classList.remove("dentro");
    abierta = false;
    setTimeout(() => { if (!abierta) visor.hidden = true; }, 420);
  }

  /* Un clic en la imagen estabiliza la señal; otro la vuelve a velar. */
  marco.addEventListener("click", () => {
    // no fijamos nada a mano: la animación se pausa por CSS y, al
    // reanudarla, sigue desde el punto exacto en que se quedó
    const estabilizando = !visor.classList.contains("nitida");
    visor.classList.toggle("nitida");
    pista.textContent = estabilizando
      ? "Señal estabilizada"
      : "Toca la imagen para que la señal se estabilice";
  });

  cerrarBtn.addEventListener("click", cerrar);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && abierta) cerrar();
  });

  document.addEventListener("universo:elegido", e => {
    const escena = ESCENAS[e.detail.id];
    if (escena) abrir(escena);
  });

  /* ── El eco ──────────────────────────────────────────────
     Antes de hacer clic, rozar la estrella basta para que la
     silueta se insinúe sobre la constelación: muy difuminada y
     ondulando, como una señal que aún no ha terminado de llegar. */
  const zona = document.querySelector(".constelacion");
  if (!zona) return;

  const eco = document.createElement("img");
  eco.className = "eco";
  eco.alt = "";
  eco.setAttribute("aria-hidden", "true");
  zona.appendChild(eco);

  let ecoActual = null;

  document.addEventListener("universo:activo", e => {
    const escena = ESCENAS[e.detail.id];
    if (!escena) { eco.classList.remove("visible"); ecoActual = null; return; }
    if (ecoActual !== e.detail.id) {
      eco.src = escena.imagen;
      ecoActual = e.detail.id;
    }
    eco.classList.add("visible");
  });

  document.addEventListener("universo:reposo", () => {
    eco.classList.remove("visible");
  });
})();
