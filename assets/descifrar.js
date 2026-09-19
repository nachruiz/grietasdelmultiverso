/* ============================================================
   GRIETAS DEL MULTIVERSO — apertura del archivo
   ------------------------------------------------------------
   Nombres, biografías, retratos y el mockup del libro no están
   en el código: viajan cifrados en secretos.json y solo se
   descifran en el navegador cuando alguien acierta la clave.

   La clave se convierte en llave con PBKDF2 (150.000 vueltas) y
   el contenido va en AES-GCM, que además verifica que no se ha
   manipulado: si la clave es incorrecta, el descifrado falla y
   no hay nada que mostrar.

   HASTA DÓNDE PROTEGE: la clave son cuatro dígitos, así que
   alguien decidido puede probarlas todas. Detiene al curioso,
   no a quien se lo proponga. Para lo segundo haría falta que
   los datos vivieran en un servidor, no en la página.
   ============================================================ */

window.ARCHIVO = (() => {
  "use strict";

  const RUTA = "assets/secretos.json";
  let contenido = null;

  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  async function abrir(clave) {
    if (contenido) return contenido;
    if (!window.crypto?.subtle) throw new Error("sin-cripto");

    const paquete = await (await fetch(RUTA, { cache: "no-store" })).json();

    const base = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(clave), "PBKDF2", false, ["deriveKey"]);
    const llave = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64(paquete.sal), iterations: paquete.iter, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);

    // si la clave no es la buena, esto lanza y no se revela nada
    const claro = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64(paquete.iv) }, llave, b64(paquete.datos));

    contenido = JSON.parse(new TextDecoder().decode(claro));

    // volcar los datos sobre los universos ya cargados
    if (typeof UNIVERSOS !== "undefined") {
      const porId = new Map(contenido.autores.map(a => [a.id, a]));
      UNIVERSOS.forEach(u => Object.assign(u, porId.get(u.id) || {}));
    }
    return contenido;
  }

  return { abrir, get contenido() { return contenido; } };
})();
