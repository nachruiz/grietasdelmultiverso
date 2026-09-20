/* ============================================================
   GRIETAS DEL MULTIVERSO — la transmisión
   ------------------------------------------------------------
   Ambiente generativo con Web Audio: no hay archivos de audio,
   todo se sintetiza en el navegador. Nunca arranca solo.

   Referencia: el Tron Legacy de Daft Punk, salvando distancias.
   Los ingredientes de ese sonido son cuatro:
     · arpegio de semicorcheas con sierra desafinada y filtro
       resonante que se abre y se cierra
     · acordes largos y graves que sostienen debajo
     · un pulso que empuja sin ser una batería
     · mucha reverberación y un eco a contratiempo
   Y una progresión de cuatro acordes en menor que gira, para
   que pase algo en vez de quedarse en un zumbido.
   ============================================================ */

(() => {
  "use strict";

  const LLAVE = "gdm_sonido";
  const VOLUMEN = 0.20;
  const BASE = 110;                  // La2
  const PASO = 0.155;                // semicorchea (~97 bpm)
  const COMPAS = 16;                 // semicorcheas por acorde

  const PROGRESION = [0, -4, 3, -2]; // i · VI · III · VII
  const ACORDE = [0, 7, 12, 14];    // fundamental, quinta, octava, novena
  const ARPEGIO = [0, 7, 12, 14, 12, 7, 19, 12];

  let ctx = null, maestro = null, envio = null, eco = null;
  let filtroArp = null, filtroPad = null;
  let sonando = false, paso = 0, proximo = 0, grado = 3, reloj = null;

  /* ── Botón ───────────────────────────────────────────────── */
  const boton = document.createElement("button");
  boton.className = "sonido";
  boton.type = "button";
  boton.setAttribute("aria-pressed", "false");
  boton.title = "Sonido ambiente";
  boton.innerHTML = '<span class="ondas" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
                    '<span class="sonido-texto">Transmisión</span>';
  document.body.appendChild(boton);

  const nota = (semi, oct = 1) => BASE * oct * Math.pow(2, semi / 12);

  /* ── Grafo ───────────────────────────────────────────────── */
  function reverberacion() {
    const n = Math.floor(ctx.sampleRate * 3.8);
    const b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.7);
    }
    const conv = ctx.createConvolver();
    conv.buffer = b;
    return conv;
  }

  function construir() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Limitador: cuando coinciden arpegio, ecos, acordes y pulso, la suma
    // se pasa del máximo y el altavoz recorta. Esto lo contiene.
    const limitador = ctx.createDynamicsCompressor();
    limitador.threshold.value = -14;
    limitador.knee.value = 6;
    limitador.ratio.value = 12;
    limitador.attack.value = 0.004;
    limitador.release.value = 0.22;
    limitador.connect(ctx.destination);

    maestro = ctx.createGain();
    maestro.gain.value = 0;
    maestro.connect(limitador);

    envio = ctx.createGain();
    envio.gain.value = 0.34;
    envio.connect(reverberacion()).connect(maestro);

    // eco a contratiempo: la sensación de espacio enorme
    const retardo = ctx.createDelay(2);
    retardo.delayTime.value = PASO * 3;
    const realim = ctx.createGain();
    realim.gain.value = 0.28;
    const fe = ctx.createBiquadFilter();
    fe.type = "lowpass";
    fe.frequency.value = 2400;
    eco = ctx.createGain();
    eco.gain.value = 0.34;
    eco.connect(retardo);
    retardo.connect(fe).connect(realim).connect(retardo);
    fe.connect(maestro);
    fe.connect(envio);

    // el filtro del arpegio: es lo que hace que "respire"
    filtroArp = ctx.createBiquadFilter();
    filtroArp.type = "lowpass";
    filtroArp.frequency.value = 1150;
    filtroArp.Q.value = 3.2;
    filtroArp.connect(maestro);
    filtroArp.connect(envio);
    filtroArp.connect(eco);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1 / (PASO * COMPAS * 2);   // una vuelta cada dos acordes
    const lfoG = ctx.createGain();
    lfoG.gain.value = 650;
    lfo.connect(lfoG).connect(filtroArp.frequency);
    lfo.start();

    filtroPad = ctx.createBiquadFilter();
    filtroPad.type = "lowpass";
    filtroPad.frequency.value = 800;
    filtroPad.Q.value = 0.8;
    filtroPad.connect(maestro);
    filtroPad.connect(envio);

    // aire
    const n = Math.floor(ctx.sampleRate * 4);
    const nb = ctx.createBuffer(1, n, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    let u = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; u = (u + 0.02 * w) / 1.02; nd[i] = u * 3; }
    const aire = ctx.createBufferSource();
    aire.buffer = nb; aire.loop = true;
    const af = ctx.createBiquadFilter();
    af.type = "bandpass"; af.frequency.value = 1800; af.Q.value = 0.5;
    const ag = ctx.createGain(); ag.gain.value = 0.035;
    aire.connect(af).connect(ag).connect(maestro);
    aire.start();
  }

  /* ── Voces ───────────────────────────────────────────────── */
  function arp(t, freq, pan) {
    // dos sierras desafinadas: el timbre característico
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.062, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + PASO * 2.4);
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    g.connect(p).connect(filtroArp);
    [-7, 7].forEach(cents => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = cents;
      o.connect(g);
      o.start(t);
      o.stop(t + PASO * 2.6);
    });
  }

  function pad(t, freq, dur, vol, pan) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = freq;
    o.detune.value = (Math.random() * 2 - 1) * 8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.3);
    g.gain.setValueAtTime(vol, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t + dur);
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    o.connect(g).connect(p).connect(filtroPad);
    o.start(t);
    o.stop(t + dur + 0.1);
  }

  function golpe(t) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(nota(PROGRESION[grado], 0.5) * 2.2, t);
    o.frequency.exponentialRampToValueAtTime(nota(PROGRESION[grado], 0.5), t + 0.07);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.30, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g).connect(maestro);
    o.start(t);
    o.stop(t + 0.75);
  }

  function barrido(t) {
    const n = Math.floor(ctx.sampleRate * PASO * 6);
    const b = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (i / n);
    const s = ctx.createBufferSource();
    s.buffer = b;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass"; f.Q.value = 5;
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(5000, t + PASO * 6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.065, t + PASO * 5);
    g.gain.linearRampToValueAtTime(0, t + PASO * 6.2);
    s.connect(f).connect(g).connect(maestro);
    g.connect(envio);
    s.start(t);
  }

  /* ── Secuenciador con lookahead ──────────────────────────── */
  function planificar() {
    while (proximo < ctx.currentTime + 0.35) {
      const t = proximo;
      const i = paso % COMPAS;
      const vuelta = Math.floor(paso / COMPAS);

      if (i === 0) {
        grado = (grado + 1) % PROGRESION.length;
        const raiz = PROGRESION[grado];
        const dur = PASO * COMPAS;
        ACORDE.forEach((semi, k) => {
          pad(t, nota(raiz + semi, k === 0 ? 0.5 : 1), dur, 0.062 / (k * 0.6 + 1),
              [-0.55, 0.5, -0.3, 0.35][k]);
        });
      }

      if (i === 0 || i === 8) golpe(t);
      // el riser quedaba demasiado inquietante para una web de lectura
      // if (i === COMPAS - 6) barrido(t);

      // el arpegio entra y sale: tres vueltas de cada cuatro
      if (vuelta % 3 !== 2) {
        const semi = PROGRESION[grado] + ARPEGIO[i % ARPEGIO.length];
        const oct = i % 8 < 4 ? 2 : 4;
        arp(t, nota(semi, oct), (i % 2 ? 0.35 : -0.35));
      }

      proximo += PASO;
      paso++;
    }
  }

  /* ── Encender / apagar ───────────────────────────────────── */
  function encender() {
    if (!ctx) construir();
    if (ctx.state === "suspended") ctx.resume();
    sonando = true;
    paso = 0; grado = PROGRESION.length - 1;
    proximo = ctx.currentTime + 0.1;
    planificar();
    reloj = setInterval(() => { if (sonando) planificar(); }, 90);
    maestro.gain.cancelScheduledValues(ctx.currentTime);
    maestro.gain.setValueAtTime(maestro.gain.value, ctx.currentTime);
    maestro.gain.linearRampToValueAtTime(VOLUMEN, ctx.currentTime + 1.6);
    boton.classList.add("activo");
    boton.setAttribute("aria-pressed", "true");
    try { localStorage.setItem(LLAVE, "1"); } catch {}
  }

  function apagar() {
    sonando = false;
    clearInterval(reloj);
    if (maestro) {
      maestro.gain.cancelScheduledValues(ctx.currentTime);
      maestro.gain.setValueAtTime(maestro.gain.value, ctx.currentTime);
      maestro.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    }
    boton.classList.remove("activo");
    boton.setAttribute("aria-pressed", "false");
    try { localStorage.setItem(LLAVE, "0"); } catch {}
  }

  boton.addEventListener("click", () => (sonando ? apagar() : encender()));

  let recordado = false;
  try { recordado = localStorage.getItem(LLAVE) === "1"; } catch {}
  if (recordado) {
    boton.classList.add("esperando");
    const despertar = () => { encender(); boton.classList.remove("esperando"); };
    addEventListener("pointerdown", despertar, { once: true });
    addEventListener("keydown", despertar, { once: true });
  }

  /* ── Voces de la constelación ────────────────────────────── */
  const GRADOS = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17];

  function roce(id) {
    if (!sonando) return;
    const t = ctx.currentTime;
    const f = nota(GRADOS[(id - 1) % GRADOS.length], 4);
    [1, 2.006].forEach((m, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * m;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(i ? 0.05 : 0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(g);
      g.connect(maestro); g.connect(eco); g.connect(envio);
      o.start(t); o.stop(t + 1.3);
    });
  }

  function fijado(id) {
    if (!sonando) return;
    const t = ctx.currentTime;
    const semi = GRADOS[(id - 1) % GRADOS.length];
    [[1, 0.14], [2, 0.09], [4, 0.05]].forEach(([oct, vol]) => {
      const o = ctx.createOscillator();
      o.type = oct === 1 ? "triangle" : "sine";
      o.frequency.value = nota(semi, oct);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
      o.connect(g);
      g.connect(maestro); g.connect(eco); g.connect(envio);
      o.start(t); o.stop(t + 3.7);
    });
  }

  document.addEventListener("universo:activo", e => {
    roce(e.detail.id);
    if (sonando && filtroPad) filtroPad.frequency.setTargetAtTime(1800, ctx.currentTime, 0.7);
  });
  document.addEventListener("universo:elegido", e => fijado(e.detail.id));
  document.addEventListener("universo:reposo", () => {
    if (sonando && filtroPad) filtroPad.frequency.setTargetAtTime(800, ctx.currentTime, 1.3);
  });

  addEventListener("pagehide", () => { if (ctx) ctx.suspend(); });
})();
