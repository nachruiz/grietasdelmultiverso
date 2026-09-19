/* ============================================================
   GRIETAS DEL MULTIVERSO — el archivo cerrado
   ------------------------------------------------------------
   AVISO: esto NO es seguridad. Es un juego narrativo.
   La comprobación ocurre en el navegador del lector, así que
   cualquiera con conocimientos puede saltársela. Guardamos el
   hash en lugar de la palabra para que no salte a la vista al
   mirar el código, nada más. No metas aquí nada confidencial.
   ============================================================ */

(() => {
  "use strict";

  const HUELLA = "94d561472d1e8caba7ab2b6970f01434af233de20a24457e82f81368f78e8c4a";
  const LLAVE = "gdm_archivo_abierto";

  const cierre  = document.getElementById("cierre");
  const campo   = document.getElementById("clave");
  const boton   = document.getElementById("abrir");
  const error   = document.getElementById("error-clave");
  const revelado = document.getElementById("revelado");
  const zona    = document.querySelector(".constelacion");
  if (!cierre || !campo) return;

  async function huella(texto) {
    const datos = new TextEncoder().encode(texto);
    const buf = await crypto.subtle.digest("SHA-256", datos);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function recordado() {
    try { return localStorage.getItem(LLAVE) === "1"; } catch { return false; }
  }
  function recordar() {
    try { localStorage.setItem(LLAVE, "1"); } catch { /* modo privado */ }
  }

  function abrir(conAnimacion) {
    document.body.classList.add("archivo-abierto");
    cierre.hidden = true;
    revelado.hidden = false;
    if (zona) zona.classList.add("revelado");
    if (conAnimacion) {
      revelado.animate(
        [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
        { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      revelado.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function intentar() {
    const v = campo.value.trim().toLowerCase();
    if (!v) return;
    if (!crypto?.subtle) {                       // http:// sin TLS, p. ej. file://
      error.textContent = "Esta página necesita servirse por https para comprobar la clave.";
      error.hidden = false;
      return;
    }
    if (await huella(v) === HUELLA) {
      recordar();
      abrir(true);
    } else {
      error.textContent = "Esa no es la señal.";
      error.hidden = false;
      campo.value = "";
      cierre.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-7px)" },
         { transform: "translateX(7px)" }, { transform: "translateX(0)" }],
        { duration: 320 }
      );
    }
  }

  boton.addEventListener("click", intentar);
  campo.addEventListener("keydown", e => {
    error.hidden = true;
    if (e.key === "Enter") intentar();
  });

  if (recordado()) abrir(false);

  /* ── Fichas de autor: solo con el archivo abierto ───────── */
  const ficha = document.getElementById("ficha");
  if (!ficha || typeof UNIVERSOS === "undefined") return;

  let fijada = null;

  function pintar(u) {
    ficha.querySelector(".ficha-foto").style.backgroundImage = `url("${u.foto}")`;
    ficha.querySelector(".ficha-inicial").textContent =
      u.autor.split(" ").map(p => p[0]).slice(0, 2).join("");
    ficha.querySelector(".ficha-autor").textContent = u.autor;
    ficha.querySelector(".ficha-meta").textContent = `${u.ciudad || u.pais} · ${u.titulo}`;
    ficha.querySelector(".ficha-bio").textContent = u.bio;
    ficha.querySelector(".ficha-redes").textContent = u.redes || "";
  }

  document.addEventListener("universo:activo", e => {
    if (!document.body.classList.contains("archivo-abierto")) return;
    if (fijada) return;                          // hay una ficha clavada
    pintar(e.detail);
    ficha.classList.add("visible");
    ficha.classList.remove("fijada");
  });

  document.addEventListener("universo:elegido", e => {
    if (!document.body.classList.contains("archivo-abierto")) return;
    fijada = fijada === e.detail.id ? null : e.detail.id;
    if (fijada) {
      pintar(e.detail);
      ficha.classList.add("visible", "fijada");
    } else {
      ficha.classList.remove("fijada");
    }
  });

  document.addEventListener("universo:reposo", () => {
    if (fijada) return;
    ficha.classList.remove("visible");
  });

  ficha.querySelector(".ficha-cerrar").addEventListener("click", () => {
    fijada = null;
    ficha.classList.remove("visible", "fijada");
  });
})();
