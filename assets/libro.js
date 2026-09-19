/* ============================================================
   GRIETAS DEL MULTIVERSO — el objeto
   Clave: la hora 11:11 (se aceptan solo los dígitos)
   Mismo aviso que en revelacion.js: es un juego, no seguridad.
   ============================================================ */

(() => {
  "use strict";

  const HUELLA = "0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c";
  const LLAVE = "gdm_libro_abierto";

  const puerta = document.getElementById("puerta-libro");
  const campo  = document.getElementById("codigo");
  const boton  = document.getElementById("sintonizar");
  const fallo  = document.getElementById("error-codigo");
  const objeto = document.getElementById("objeto");
  if (!puerta || !campo) return;

  async function huella(t) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  const guardado = () => { try { return localStorage.getItem(LLAVE); } catch { return null; } };
  const guardar  = c => { try { localStorage.setItem(LLAVE, c); } catch {} };
  function ponerMockup(ruta) {
    const img = objeto.querySelector(".mockup");
    if (img && ruta) { img.src = ruta; img.removeAttribute("data-espera"); }
  }

  function revelar(animar) {
    puerta.hidden = true;
    objeto.hidden = false;
    if (animar) {
      objeto.animate(
        [{ opacity: 0, transform: "scale(.94) translateY(20px)" },
         { opacity: 1, transform: "none" }],
        { duration: 1100, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
  }


  /* Diagnóstico: abre la página con ?diagnostico y escribe la clave.
     Dirá en pantalla qué está pasando realmente. */
  const error = fallo;
  const DIAG = location.search.includes("diagnostico");
  function contar(v, h) {
    if (!DIAG) return;
    error.textContent = `[diag] escrito="${campo.value}" · dígitos="${v}" · ` +
      `hash=${h.slice(0, 12)}… · esperado=${HUELLA.slice(0, 12)}… · ` +
      `coincide=${h === HUELLA} · subtle=${!!(window.crypto && crypto.subtle)}`;
    error.hidden = false;
  }

  async function probar() {
    // solo los dígitos: 11:11, 11.11 u 1111 valen igual
    const v = campo.value.replace(/\D/g, "");
    if (!v) return;
    if (!crypto?.subtle) {
      fallo.textContent = "Sirve la página por https para comprobar el código.";
      fallo.hidden = false;
      return;
    }
    try {
      const secreto = await ARCHIVO.abrir(v);
      ponerMockup(secreto.mockup);
      guardar(v);
      revelar(true);
    } catch (err) {
      fallo.textContent = err.message === "sin-cripto"
        ? "Esta página necesita https para sintonizar."
        : "Frecuencia incorrecta.";
      fallo.hidden = false;
      campo.value = "";
      puerta.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-7px)" },
         { transform: "translateX(7px)" }, { transform: "translateX(0)" }],
        { duration: 320 });
    }
  }

  boton.addEventListener("click", probar);
  campo.addEventListener("keydown", e => {
    fallo.hidden = true;
    if (e.key === "Enter") probar();
  });

  const previa = guardado();
  if (previa) {
    ARCHIVO.abrir(previa)
      .then(sec => { ponerMockup(sec.mockup); revelar(false); })
      .catch(() => { try { localStorage.removeItem(LLAVE); } catch {} });
  }

})();
