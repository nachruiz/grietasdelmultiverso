/* ============================================================
   GRIETAS DEL MULTIVERSO — los once símbolos, flotando
   ------------------------------------------------------------
   Cada relato del libro lleva su propio símbolo. Aquí derivan
   despacio por el fondo, reaccionan al cursor y se encienden
   cuando se activa su universo en la constelación.
   ============================================================ */

(() => {
  "use strict";

  if (typeof UNIVERSOS === "undefined") return;
  const suave = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const capa = document.createElement("div");
  capa.className = "simbolos";
  capa.setAttribute("aria-hidden", "true");
  document.body.appendChild(capa);

  // posiciones de partida repartidas, sin amontonarse en el centro
  const SIEMBRA = [
    [0.08, 0.18], [0.88, 0.12], [0.20, 0.76], [0.72, 0.84],
    [0.50, 0.08], [0.06, 0.52], [0.94, 0.46], [0.34, 0.36],
    [0.66, 0.62], [0.16, 0.94], [0.82, 0.28]
  ];

  const flotantes = UNIVERSOS.map((u, i) => {
    const [x, y] = SIEMBRA[i % SIEMBRA.length];
    const el = document.createElement("img");
    el.className = "simbolo";
    el.src = u.icono;
    el.alt = "";
    el.dataset.id = u.id;
    el.style.left = (x * 100).toFixed(1) + "%";
    el.style.top = (y * 100).toFixed(1) + "%";
    el.style.setProperty("--giro", (Math.random() * 30 - 15).toFixed(1) + "deg");
    el.style.setProperty("--escala", (0.75 + Math.random() * 0.5).toFixed(2));
    el.style.setProperty("--demora", (-Math.random() * 26).toFixed(1) + "s");
    el.style.setProperty("--ciclo", (26 + Math.random() * 20).toFixed(1) + "s");
    el.style.setProperty("--fondo", (0.25 + Math.random() * 0.5).toFixed(2));
    capa.appendChild(el);
    return { u, el };
  });

  /* Paralaje: los más grandes se mueven más, como si estuvieran cerca. */
  if (!suave) {
    let px = 0, py = 0, rx = 0, ry = 0, corriendo = false;
    addEventListener("pointermove", e => {
      px = (e.clientX / innerWidth - 0.5) * 2;
      py = (e.clientY / innerHeight - 0.5) * 2;
      if (!corriendo) { corriendo = true; requestAnimationFrame(mover); }
    }, { passive: true });

    function mover() {
      rx += (px - rx) * 0.06;
      ry += (py - ry) * 0.06;
      flotantes.forEach(({ el }, i) => {
        const peso = 6 + (i % 4) * 7;
        el.style.setProperty("--dx", (-rx * peso).toFixed(1) + "px");
        el.style.setProperty("--dy", (-ry * peso).toFixed(1) + "px");
      });
      if (Math.abs(px - rx) > 0.001 || Math.abs(py - ry) > 0.001) {
        requestAnimationFrame(mover);
      } else {
        corriendo = false;
      }
    }
  }

  /* Al encenderse un universo, su símbolo sale a primer plano. */
  document.addEventListener("universo:activo", e => {
    flotantes.forEach(({ u, el }) => el.classList.toggle("encendido", u.id === e.detail.id));
  });
  document.addEventListener("universo:reposo", () => {
    flotantes.forEach(({ el }) => el.classList.remove("encendido"));
  });

  /* El símbolo también marca cada nodo de la constelación. */
  document.querySelectorAll(".nodo").forEach(nodo => {
    const id = Number((nodo.getAttribute("aria-label") || "").match(/\d+/)?.[0]);
    const u = UNIVERSOS.find(x => x.id === id);
    if (!u || nodo.querySelector(".nodo-simbolo")) return;
    const img = document.createElement("img");
    img.className = "nodo-simbolo";
    img.src = u.icono;
    img.alt = "";
    nodo.appendChild(img);
  });
})();
