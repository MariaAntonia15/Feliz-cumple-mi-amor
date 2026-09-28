# 💌 Página romántica

Una carta de amor interactiva: sobre animado, portada cinematográfica, contador de tiempo juntos, carta con escritura automática, **agenda de momentos** con cartas y poemas, carruseles tipo polaroid, galería con filtros, 100 razones en tarjetas que giran, **lista de canciones de YouTube**, videos, cierre con confeti y modo nocturno.

Publicada en: **https://mariaantonia15.github.io/Feliz-cumple-mi-amor/**

---

## ✏️ Cómo personalizarla

Todo se cambia en **`config.js`** (ábrelo con el Bloc de notas o VS Code).

| Quiero cambiar…                 | Dónde, dentro de `config.js`                       |
|---------------------------------|----------------------------------------------------|
| Nombres                         | `pareja`                                           |
| Día en que nos hicimos novios   | `fechaInicio` → `"2023-11-23 17:45"`               |
| Portada                         | `hero`                                             |
| Carta principal                 | `carta.deLaAgenda` (usa una carta de la agenda)    |
| **Momentos, cartas y poemas**   | `agenda`                                           |
| Fotos del carrusel              | `carruseles[].fotos`                               |
| Galería y categorías            | `galeria`                                          |
| Las 100 razones                 | `razones`                                          |
| **Canciones**                   | `musica.canciones`                                 |
| Videos                          | `videos` (la sección aparece sola)                 |
| Cierre y firma                  | `final`                                            |
| Apagar efectos                  | `efectos`                                          |
| Abrir en modo nocturno          | `modoNocturnoPorDefecto: true`                     |

### 📖 Agregar un recuerdo a la agenda
Copia un bloque dentro de `agenda` y cámbialo. Se ordena solo por fecha:
```js
{ tipo: "momento", fecha: "2024-02-14", icono: "🌷", titulo: "…", texto: "…" },
{ tipo: "poema",   fecha: "2026-10-01", titulo: "…", texto: `
Primera línea
segunda línea

Nueva estrofa
` },
```
- `tipo`: `"momento"`, `"carta"` o `"poema"`.
- `fecha`: `"AAAA-MM-DD"`. Si no sabes el día exacto, usa `"AAAA-MM"` o agrega `fechaTexto: "Verano 2024"`.
- Opcionales: `hora: "17:45"`, `foto: "fotos/…jpg"`, `destacado: true`.
- Las cartas y poemas van entre comillas invertidas `` ` `` y pueden tener varias líneas.

### 📸 Fotos
Cópialas en **`fotos/`** con los nombres de `config.js`. Las fotos que falten **no se muestran**, así que puedes agregarlas poco a poco. Para ver dónde faltan, pon `mostrarFotosPendientes: true`.

Consejo: reduce las fotos a ~1600 px de ancho (por ejemplo con squoosh.app). Las mayúsculas importan: `Foto.JPG` no es lo mismo que `foto.jpg`.

### 🎵 Canciones
La música viene de la lista de YouTube **"me recuerdan a ti"** (`musica.listaYoutube`). La página la lee cada vez que se abre: **para agregar una canción, solo agrégala a esa lista en YouTube**. La lista debe estar como pública o no listada.

Si algún día prefieres canciones sueltas, borra `listaYoutube` y usa:
```js
canciones: [
  { youtube: "https://www.youtube.com/watch?v=…", titulo: "…", artista: "…", dedicatoria: "…" },
],
```
YouTube solo suena con la página publicada (GitHub Pages). Si abres `index.html` directamente en tu computador verás "Error 153": es normal.
Algunas canciones oficiales no permiten reproducirse fuera de YouTube; para esas aparece el botón ↗ que las abre en YouTube.

---

## 🌐 Subir cambios a GitHub
En el repositorio: **Add file → Upload files**, arrastra los archivos que cambiaste y toca **Commit changes**. GitHub Pages se actualiza en 1–2 minutos.
