# Grietas del Multiverso — web

Mockup de la web del libro. Sin dependencias ni compilación: se abre
`index.html` en el navegador y funciona.

## Estructura

```
grietas-del-multiverso/
├── index.html            portada + constelación + Lyra Rift + el libro
├── ia/index.html         grietasdelmultiverso.com/ia — el chatbot
├── assets/
│   ├── datos.js          LOS ONCE UNIVERSOS (edita aquí)
│   ├── estilos.css       toda la hoja de estilo
│   └── multiverso.js     fondo animado + constelación
├── img/autores/          fotos de autores (vacío, ver abajo)
├── CNAME                 grietasdelmultiverso.com
└── subir_ionos.py        despliegue por SFTP
```

## Lo que tienes que rellenar

### 1. Títulos y fragmentos de los relatos

En `assets/datos.js`. Los once autores y sus países ya están, sacados de la
cubierta. Lo que falta:

- `titulo:` — ahora pone `[Título del relato]` en los once.
- `fragmento:` — son frases que escribí yo como marcador. **Sustitúyelas por
  una línea real de cada relato**: es lo que aparece al pasar el cursor y lo
  que convence de comprar.

También puedes mover cada nodo en la constelación con `x` e `y` (de 0 a 1), y
cambiar el color de cada universo en `tono: [matiz, saturación, luminosidad]`.

### 2. Fotos de los autores

La carpeta `img/autores/` está vacía. No pude sacarlas de la cubierta que me
pasaste, porque no las lleva. Cuando las tengas, nómbralas `01.jpg` … `11.jpg`
siguiendo el orden de `datos.js` y dímelo: hay que añadir el retrato al panel
de señal y una ficha ampliada al hacer clic.

### 3. El chatbot

`ia/index.html` ya embebe el iframe de Chatbase:

```
https://www.chatbase.co/chatbot-iframe/gE9pdK-mOJYvd91eU59Iy
```

Funciona en cuanto publiques el agente en Chatbase. Mientras tanto, la página
muestra el marco con el aviso «Señal en pruebas».

En Chatbase, el nombre de la cabecera se cambia en **Settings → Chat
Interface → Display name**.

## Cómo funciona la interacción

- **Fondo**: lienzo `<canvas>` con polvo estelar y tres grietas que laten.
  Respeta `prefers-reduced-motion`.
- **Velo**: un halo de color sigue al cursor por toda la página.
- **Constelación**: once nodos unidos por líneas. Al acercarse a uno se
  enciende su universo — cambian el color global, sus enlaces y el panel de
  texto. Funciona con ratón, con teclado (tabulador) y al tocar en móvil.
- **Escape** apaga el universo activo.

## Desplegar

```bash
# variables de entorno con las credenciales de IONOS
set FTP_HOST=...
set FTP_USER=...
set FTP_PASS=...
python subir_ionos.py
```

El `CNAME` apunta a `grietasdelmultiverso.com`, por si lo sirves desde
GitHub Pages en vez de IONOS.

## Pendiente

- [ ] Títulos reales de los once relatos
- [ ] Fragmentos reales
- [ ] Fotos de autores
- [ ] Imagen de cubierta y mockup 3D en la sección «El libro»
- [ ] Enlace de compra
- [ ] Favicon
