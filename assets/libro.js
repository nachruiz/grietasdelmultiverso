/* ============================================================
   GRIETAS DEL MULTIVERSO — el objeto
   Clave numérica y de símbolos: 11:11
   Mismo aviso que en revelacion.js: es un juego, no seguridad.
   ============================================================ */

(() => {
  "use strict";

  const HUELLA = "309d7906e7138ddf6c3c45ce5bda81af6bcca22ece7de58b0ac15f37d871e9a0";
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

  const guardado = () => { try { return localStorage.getItem(LLAVE) === "1"; } catch { return false; } };
  const guardar  = () => { try { localStorage.setItem(LLAVE, "1"); } catch {} };

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

  async function probar() {
    const v = campo.value.trim();
    if (!v) return;
    if (!crypto?.subtle) {
      fallo.textContent = "Sirve la página por https para comprobar el código.";
      fallo.hidden = false;
      return;
    }
    if (await huella(v) === HUELLA) {
      guardar();
      revelar(true);
    } else {
      fallo.textContent = "Frecuencia incorrecta.";
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

  if (guardado()) revelar(false);

})();
