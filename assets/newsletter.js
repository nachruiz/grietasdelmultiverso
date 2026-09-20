/* ============================================================
   GRIETAS DEL MULTIVERSO — alta en la señal (newsletter)
   ------------------------------------------------------------
   PARA CONECTARLO CON BREVO:
   1. En Brevo: Contacts → Forms → crea el formulario.
   2. Copia la URL que aparece en el atributo action del código
      que te da (algo como https://xxxxx.sibforms.com/serve/MUIF...).
   3. Pégala aquí abajo en ACCION y guarda. Nada más.
   Mientras ACCION esté vacío, el formulario avisa de que la
   señal todavía no está abierta en vez de fingir que funciona.
   ============================================================ */

const ACCION = "https://382aa1bd.sibforms.com/v2/serve/MUIFAPqtGMiWgNTUqKWF5J-NE9tT8MdIQbZIn9A6Nv7LmOParuLBBBy5a4BLcUFwaaakXN_2Z9KgQeFnSx-OBIUrh9CoW0slQKXm198CokjWQEaOeVnR1rBKE3k1dKe6c-9LjssAzLAL-ADnVZsipGJXjG8eIsUPbCku4GOTIY42dZbi40rHRS6zSgg0rjARgom7N-1_ey3NZiu1JQ==";
const CAMPO_EMAIL = "EMAIL";       // nombre del campo en Brevo
const CAMPO_ORIGEN = "ORIGEN";     // solo se guarda si el formulario de Brevo lo incluye

(() => {
  "use strict";

  const form = document.getElementById("alta");
  if (!form) return;

  const email = form.querySelector('input[type="email"]');
  const acepta = form.querySelector('input[type="checkbox"]');
  const boton = form.querySelector("button");
  const aviso = form.querySelector(".alta-aviso");

  function decir(texto, error) {
    aviso.textContent = texto;
    aviso.classList.toggle("mal", !!error);
    aviso.hidden = false;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    aviso.hidden = true;

    if (!email.value.includes("@")) {
      decir("Esa dirección no parece completa.", true);
      email.focus();
      return;
    }
    if (!acepta.checked) {
      decir("Marca la casilla para que podamos escribirte.", true);
      return;
    }

    if (!ACCION) {
      decir("La señal todavía no está abierta. Vuelve en unos días.", true);
      return;
    }

    boton.disabled = true;
    boton.textContent = "Transmitiendo…";
    try {
      const datos = new FormData();
      datos.append(CAMPO_EMAIL, email.value.trim());
      datos.append("email_address_check", "");   // trampa antispam: debe ir vacía
      datos.append("locale", "es");
      datos.append(CAMPO_ORIGEN, "grietasdelmultiverso.com");
      await fetch(ACCION, { method: "POST", body: datos, mode: "no-cors" });
      form.querySelector(".alta-campos").hidden = true;
      decir("Recibido. Te hemos enviado un correo: confirma el alta desde ahí.", false);
    } catch {
      decir("No hemos podido transmitir. Inténtalo en un momento.", true);
      boton.disabled = false;
      boton.textContent = "Recibir la señal";
    }
  });
})();
