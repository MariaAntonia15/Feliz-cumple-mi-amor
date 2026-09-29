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

### 📷 Fotos del álbum de Google Fotos (automáticas)
Las fotos del álbum compartido **"Nosotros <3"** aparecen solas en:
- la **galería** (con filtros por año y "Ver más fotos"),
- el **carrusel** de polaroids (12 al azar, distintas cada vez),
- la **portada** y el **cierre** (si no hay `portada.jpg` / `final.jpg`),
- los **días de la agenda** que tengan la misma fecha que la foto.

**Para agregar fotos: súbelas a ese álbum en Google Fotos.** Cada hora, GitHub revisa el álbum (`.github/workflows/fotos.yml` + `herramientas/actualizar-fotos.js`) y actualiza `fotos-album.json`. Para que sea al instante: en el repositorio ve a **Actions → Actualizar fotos del álbum → Run workflow**.

Si el álbum deja de estar compartido con enlace, la página conserva las últimas fotos guardadas.
Si pasan 60 días sin cambios, GitHub pausa la revisión automática: entra a **Actions** y toca **Enable workflow**.

### 📸 Fotos propias
También puedes copiar fotos en **`fotos/`** con los nombres de `config.js`. Las que falten **no se muestran**. Para ver dónde faltan, pon `mostrarFotosPendientes: true`.

Consejo: reduce las fotos a ~1600 px de ancho (por ejemplo con squoosh.app). Las mayúsculas importan: `Foto.JPG` no es lo mismo que `foto.jpg`.

### 🎵 Canciones
La música viene de la lista de YouTube **"me recuerdan a ti"**. **Para agregar una canción, solo agrégala a esa lista en YouTube**: aparece en la página en máximo una hora. Cada visita empieza con una canción al azar y suena apenas se abre la página (si el navegador exige un toque primero, empieza con el primer toque). La lista debe estar como **no listada** (así no aparece en tu canal, pero GitHub la puede leer).

Si algún día no hay lista, se usan las canciones escritas a mano en `config.js`:
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

---

## 🔒 Enlaces privados (solo para la administradora)
Los enlaces del **álbum de Google Fotos** y de la **lista de YouTube** no aparecen en la página ni en el código público. Están guardados como **secretos** del repositorio, que solo ve su dueña:

**Settings → Secrets and variables → Actions**
- `ALBUM_URL`: enlace para compartir el álbum de Google Fotos.
- `LISTA_YOUTUBE`: enlace de la lista de YouTube.

Cada hora, GitHub (`.github/workflows/fotos.yml`) los usa en privado y guarda solo lo que la página necesita: las fotos en `fotos-album.json` y los nombres de las canciones en `musica.json`.
Para cambiar el álbum o la lista, edita el secreto (botón **Update**) y luego ve a **Actions → Actualizar fotos y canciones → Run workflow**.
