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

  const HUELLA = "0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c";
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
    try { return localStorage.getItem(LLAVE); } catch { return null; }
  }
  function recordar(clave) {
    try { localStorage.setItem(LLAVE, clave); } catch { /* modo privado */ }
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


  /* Diagnóstico: abre la página con ?diagnostico y escribe la clave.
     Dirá en pantalla qué está pasando realmente. */
  const DIAG = location.search.includes("diagnostico");
  function contar(v, h) {
    if (!DIAG) return;
    error.textContent = `[diag] escrito="${campo.value}" · dígitos="${v}" · ` +
      `hash=${h.slice(0, 12)}… · esperado=${HUELLA.slice(0, 12)}… · ` +
      `coincide=${h === HUELLA} · subtle=${!!(window.crypto && crypto.subtle)}`;
    error.hidden = false;
  }

  async function intentar() {
    // solo los dígitos: da igual que escriban 1.111, 1 111 o 1111
    const v = campo.value.replace(/\D/g, "");
    if (!v) return;
    if (!crypto?.subtle) {                       // http:// sin TLS, p. ej. file://
      error.textContent = "Esta página necesita servirse por https para comprobar la clave.";
      error.hidden = false;
      return;
    }
    try {
      await ARCHIVO.abrir(v);                 // si la clave falla, lanza
      recordar(v);
      abrir(true);
    } catch (err) {
      error.textContent = err.message === "sin-cripto"
        ? "Esta página necesita https para abrir el archivo."
        : "Ese no es el año.";
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

  const guardada = recordado();
  if (guardada) {
    ARCHIVO.abrir(guardada).then(() => abrir(false)).catch(() => {
      try { localStorage.removeItem(LLAVE); } catch {}
    });
  }

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
    // las cuentas, con el icono de su red, sacados del propio libro
    const redes = ficha.querySelector(".ficha-redes");
    redes.innerHTML = "";
    (Array.isArray(u.redes) ? u.redes : []).forEach(r => {
      const a = document.createElement("a");
      a.className = "red";
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.title = `${r.cuenta} en ${r.red === "tiktok" ? "TikTok" : "Instagram"}`;
      a.innerHTML =
        `<img src="img/iconos/red-${r.red}.png" alt="" aria-hidden="true">` +
        `<span>${r.cuenta}</span>`;
      redes.appendChild(a);
    });
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
