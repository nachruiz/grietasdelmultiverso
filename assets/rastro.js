/* ============================================================
   GRIETAS DEL MULTIVERSO — el rastro
   ------------------------------------------------------------
   Cada universo que se abre deja huella: su estrella conserva
   un halo tenue y sus enlaces quedan encendidos. El mapa se va
   iluminando según se explora, y al completar los once la
   constelación entera responde.
   El rastro se guarda en el navegador, así que sobrevive a
   cerrar la pestaña. Se borra con ?reiniciar.
   ============================================================ */

(() => {
  "use strict";

  const LLAVE = "gdm_visitados";
  const zona = document.querySelector(".constelacion");
  if (!zona || typeof UNIVERSOS === "undefined") return;

  const reposo = document.querySelector(".reposo");
  const textoInicial = reposo ? reposo.textContent : "";

  function leer() {
    try { return new Set(JSON.parse(localStorage.getItem(LLAVE) || "[]")); }
    catch { return new Set(); }
  }
  function guardar(s) {
    try { localStorage.setItem(LLAVE, JSON.stringify([...s])); } catch {}
  }

  const vistos = leer();

  function pintar() {
    zona.querySelectorAll(".nodo").forEach(n => {
      n.classList.toggle("visitado", vistos.has(Number(n.dataset.id)));
    });
    zona.classList.toggle("completa", vistos.size >= UNIVERSOS.length);

    if (!reposo) return;
    if (vistos.size === 0) {
      reposo.textContent = textoInicial;
    } else if (vistos.size >= UNIVERSOS.length) {
      reposo.textContent = "Las once señales recibidas";
    } else {
      reposo.textContent = `${vistos.size} de ${UNIVERSOS.length} señales recibidas`;
    }
  }

  document.addEventListener("universo:elegido", e => {
    if (vistos.has(e.detail.id)) return;
    vistos.add(e.detail.id);
    guardar(vistos);
    pintar();

    const nodo = zona.querySelector(`.nodo[data-id="${e.detail.id}"]`);
    if (nodo) {
      nodo.classList.add("recien");
      setTimeout(() => nodo.classList.remove("recien"), 1400);
    }
  });

  pintar();
})();
