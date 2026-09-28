# 💌 Página romántica

Una carta de amor interactiva: sobre animado, portada cinematográfica, contador de tiempo juntos, carta con escritura automática, carruseles tipo polaroid, línea del tiempo, galería con filtros y vista ampliada, 100 razones en tarjetas que giran, reproductor de música, videos, cierre con confeti y modo nocturno.

No necesita instalar nada: **abre `index.html` con doble clic**.

---

## ✏️ Cómo personalizarla

Todo se cambia en **`config.js`** (ábrelo con el Bloc de notas o VS Code).

| Quiero cambiar…            | Dónde, dentro de `config.js`            |
|----------------------------|-----------------------------------------|
| Nombres                    | `pareja`                                |
| Fecha del contador         | `fechaInicio` → `"2023-02-14 20:00"`    |
| Portada                    | `hero`                                  |
| Carta                      | `carta.parrafos`                        |
| Fotos del carrusel         | `carruseles[].fotos`                    |
| Crear otro carrusel        | copia un bloque `{ titulo, fotos }` dentro de `carruseles` |
| Línea del tiempo           | `lineaDeTiempo`                         |
| Galería y categorías       | `galeria`                               |
| Las 100 razones            | `razones`                               |
| Canción                    | `musica`                                |
| Videos                     | `videos` (la sección aparece sola)      |
| Cierre y firma             | `final`                                 |
| Apagar efectos             | `efectos`                               |
| Abrir en modo nocturno     | `modoNocturnoPorDefecto: true`          |

Los títulos de las secciones ("Una carta para ti", "Capítulo II"…) están en `index.html`.
Los colores están al principio de `styles.css`.

### 📸 Fotos
1. Copia tus fotos en la carpeta **`fotos/`**.
2. Usa los mismos nombres que están en `config.js` (`portada.jpg`, `recuerdo-1.jpg`…) **o** cambia los nombres en `config.js`.
3. Mientras falte una foto, verás un marco rosado con el nombre del archivo que falta.

Consejo: reduce las fotos a ~1600 px de ancho (por ejemplo con squoosh.app) para que la página cargue rápido.
Las mayúsculas importan: `Foto.JPG` no es lo mismo que `foto.jpg`.

### 🎵 Música
Copia tu canción en **`musica/nuestra-cancion.mp3`** (o cambia `musica.archivo`).
La música empieza al abrir el sobre (los navegadores no permiten que suene sola antes de un toque).

### 🎬 Videos
Copia tus videos en `videos/` y agrégalos en `config.js`:
```js
videos: [
  { archivo: "videos/playa.mp4", titulo: "Nuestro viaje" },
  { youtube: "CODIGO_DEL_VIDEO", titulo: "Nuestra canción en vivo" }
],
```
Los videos de YouTube a veces no se ven con el archivo abierto en tu computador; se ven bien cuando la página está publicada en internet.

---

## 🌐 Cómo compartirla (gratis)

- **Netlify Drop**: entra a https://app.netlify.com/drop y arrastra la carpeta completa `pagina-romantica`. Te da un enlace para enviar.
- **GitHub Pages**: sube la carpeta a un repositorio y activa Pages en la configuración.

Envía el enlace desde el celular para probarla antes de dársela 😉
