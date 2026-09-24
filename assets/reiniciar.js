/* ============================================================
   GRIETAS DEL MULTIVERSO — reinicio de los candados
   ------------------------------------------------------------
   Una vez abiertos, el navegador recuerda el archivo y el libro
   para no pedir la clave en cada visita. Para volver a probarlos
   —o para enseñarlos a alguien desde cero— basta con abrir:
       ...grietasdelmultiverso.com/?reiniciar
   ============================================================ */

(() => {
  "use strict";
  if (!location.search.includes("reiniciar")) return;
  ["gdm_archivo_abierto", "gdm_libro_abierto", "gdm_sonido", "gdm_visitados"].forEach(k => {
    try { localStorage.removeItem(k); } catch {}
  });
  location.replace(location.pathname);      // vuelve a la URL limpia
})();
