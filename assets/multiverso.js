/* ============================================================
   GRIETAS DEL MULTIVERSO — fondo vivo y constelación
   Sin dependencias externas: se despliega tal cual.
   ============================================================ */

(() => {
  "use strict";

  const raiz = document.documentElement;
  const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. Cielo: polvo estelar y grietas que respiran ─────── */
  const cielo = document.getElementById("cielo");
  if (cielo) {
    const ctx = cielo.getContext("2d");
    let an = 0, al = 0, dpr = 1, polvo = [], grietas = [];

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      an = cielo.width = innerWidth * dpr;
      al = cielo.height = innerHeight * dpr;
      cielo.style.width = innerWidth + "px";
      cielo.style.height = innerHeight + "px";
      sembrar();
    }

    function sembrar() {
      const n = Math.round((innerWidth * innerHeight) / 11000);
      polvo = Array.from({ length: n }, () => ({
        x: Math.random() * an,
        y: Math.random() * al,
        r: (Math.random() * 1.25 + 0.25) * dpr,
        v: Math.random() * 0.12 + 0.02,
        f: Math.random() * Math.PI * 2
      }));
      // grietas: polilíneas verticales irregulares, como la cubierta
      grietas = Array.from({ length: 3 }, (_, i) => {
        const base = an * (0.22 + i * 0.28);
        const pts = [];
        let x = base;
        for (let y = -40; y < al + 40; y += al / 16) {
          x += (Math.random() - 0.5) * an * 0.06;
          pts.push([x, y]);
        }
        return { pts, fase: Math.random() * Math.PI * 2 };
      });
    }

    function pintar(t) {
      ctx.clearRect(0, 0, an, al);

      // nebulosa de fondo
      const g = ctx.createRadialGradient(an * 0.5, al * 0.42, 0, an * 0.5, al * 0.42, an * 0.75);
      g.addColorStop(0, "rgba(29,19,82,0.85)");
      g.addColorStop(0.55, "rgba(12,8,42,0.9)");
      g.addColorStop(1, "rgba(6,4,26,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, an, al);

      // grietas
      grietas.forEach((gr, i) => {
        const pulso = 0.12 + 0.08 * Math.sin(t / 2600 + gr.fase);
        ctx.beginPath();
        ctx.moveTo(gr.pts[0][0], gr.pts[0][1]);
        for (let k = 1; k < gr.pts.length - 1; k++) {
          const [x1, y1] = gr.pts[k];
          const [x2, y2] = gr.pts[k + 1];
          ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2);
        }
        ctx.strokeStyle = `rgba(111,227,255,${pulso})`;
        ctx.lineWidth = (i === 1 ? 1.6 : 1) * dpr;
        ctx.stroke();
      });

      // polvo
      polvo.forEach(p => {
        p.y -= p.v * dpr;
        if (p.y < -4) { p.y = al + 4; p.x = Math.random() * an; }
        const brillo = 0.32 + 0.3 * Math.sin(t / 900 + p.f);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214,232,255,${brillo})`;
        ctx.fill();
      });

      if (!suave) requestAnimationFrame(pintar);
    }

    medir();
    addEventListener("resize", medir, { passive: true });
    suave ? pintar(0) : requestAnimationFrame(pintar);
  }

  /* ── 2. El velo sigue al cursor ──────────────────────────── */
  addEventListener("pointermove", e => {
    raiz.style.setProperty("--mx", (e.clientX / innerWidth * 100).toFixed(1) + "%");
    raiz.style.setProperty("--my", (e.clientY / innerHeight * 100).toFixed(1) + "%");
  }, { passive: true });

  /* ── 3. Constelación de los once universos ───────────────── */
  const zona = document.querySelector(".constelacion");
  if (!zona || typeof UNIVERSOS === "undefined") return;

  const svg = zona.querySelector("svg");
  const panel = zona.querySelector(".senal");
  const reposo = document.querySelector(".reposo");
  const porId = new Map(UNIVERSOS.map(u => [u.id, u]));
  const lineas = new Map();

  // enlaces
  ENLACES.forEach(([a, b]) => {
    const ua = porId.get(a), ub = porId.get(b);
    if (!ua || !ub) return;
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", ua.x * 100 + "%");
    l.setAttribute("y1", ua.y * 100 + "%");
    l.setAttribute("x2", ub.x * 100 + "%");
    l.setAttribute("y2", ub.y * 100 + "%");
    l.setAttribute("class", "enlace");
    svg.appendChild(l);
    [a, b].forEach(id => {
      if (!lineas.has(id)) lineas.set(id, []);
      lineas.get(id).push(l);
    });
  });

  // nodos
  const nodos = UNIVERSOS.map(u => {
    const b = document.createElement("button");
    b.className = "nodo";
    b.type = "button";
    b.style.left = u.x * 100 + "%";
    b.style.top = u.y * 100 + "%";
    b.setAttribute("aria-label", `Universo ${u.id}: ${u.titulo}`);
    b.innerHTML = `<span class="halo"></span><span class="punto"></span>` +
                  `<span class="cifra">${String(u.id).padStart(2, "0")}</span>`;
    const activar = () => encender(u, b);
    b.addEventListener("pointerenter", activar);
    b.addEventListener("focus", activar);
    b.addEventListener("click", () => {
      encender(u, b);
      document.dispatchEvent(new CustomEvent("universo:elegido", { detail: u }));
    });
    zona.appendChild(b);
    return { u, b };
  });

  let actual = null;

  function encender(u, boton) {
    if (actual === u.id) return;
    actual = u.id;

    const [h, s, l] = u.tono;
    raiz.style.setProperty("--universo", `hsl(${h} ${s}% ${l}%)`);
    raiz.style.setProperty("--universo-hondo", `hsl(${h} ${Math.round(s * 0.7)}% 14%)`);

    nodos.forEach(n => n.b.classList.toggle("activo", n.u.id === u.id));
    lineas.forEach((arr, id) => arr.forEach(l => l.classList.toggle("vivo", id === u.id)));

    panel.querySelector(".meta").textContent =
      `Señal ${String(u.id).padStart(2, "0")} de 11`;
    // el autor solo aparece con el archivo descifrado
    panel.querySelector(".autor").textContent = u.autor || "Transmisión anónima";
    panel.querySelector(".relato").textContent = u.titulo;
    panel.querySelector(".cita").textContent = `«${u.fragmento}»`;
    panel.classList.add("visible");
    if (reposo) reposo.classList.add("oculto");
    document.dispatchEvent(new CustomEvent("universo:activo", { detail: u }));
  }

  function apagar() {
    actual = null;
    raiz.style.setProperty("--universo", "#6fe3ff");
    nodos.forEach(n => n.b.classList.remove("activo"));
    lineas.forEach(arr => arr.forEach(l => l.classList.remove("vivo")));
    panel.classList.remove("visible");
    if (reposo) reposo.classList.remove("oculto");
    document.dispatchEvent(new CustomEvent("universo:reposo"));
  }

  zona.addEventListener("pointerleave", apagar);
  document.addEventListener("keydown", e => { if (e.key === "Escape") apagar(); });
})();
