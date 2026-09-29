/* ==========================================================================
   Lee la lista de YouTube y guarda en musica.json solo las canciones
   (código del video, título y canal). El enlace de la lista es privado:
   viene del secreto LISTA_YOUTUBE de GitHub (Settings → Secrets and
   variables → Actions), así la página nunca muestra la lista.
   Lo ejecuta GitHub Actions cada hora (.github/workflows/fotos.yml).
   Nota: lee las primeras 100 canciones de la lista.
   ========================================================================== */
const fs = require("fs");

function idLista(v) {
  const s = String(v || "").trim();
  const m = s.match(/[?&]list=([\w-]+)/);
  if (m) return m[1];
  return /^[\w-]{10,}$/.test(s) ? s : null;
}

// Recorre los datos de la página buscando las tarjetas de video (formato nuevo y viejo)
function* tarjetas(o) {
  if (!o || typeof o !== "object") return;
  if (Array.isArray(o)) { for (const x of o) yield* tarjetas(x); return; }
  if (o.lockupViewModel) yield { nuevo: o.lockupViewModel };
  if (o.playlistVideoRenderer) yield { viejo: o.playlistVideoRenderer };
  for (const k in o) yield* tarjetas(o[k]);
}

const texto = (t) => (t ? t.simpleText || t.content || (t.runs || []).map((r) => r.text).join("") : "");

function extraerCanciones(html) {
  const ini = html.indexOf("var ytInitialData = ");
  if (ini < 0) throw new Error("No encontré los datos de la lista (¿cambió YouTube?)");
  const fin = html.indexOf(";</script>", ini);
  const datos = JSON.parse(html.slice(ini + "var ytInitialData = ".length, fin));
  const canciones = [];
  const vistos = new Set();
  for (const t of tarjetas(datos)) {
    let yt = "";
    let titulo = "";
    let canal = "";
    if (t.viejo) {
      yt = t.viejo.videoId;
      titulo = texto(t.viejo.title);
      canal = texto(t.viejo.shortBylineText);
    } else {
      if (t.nuevo.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO") continue;
      yt = t.nuevo.contentId;
      const md = t.nuevo.metadata && t.nuevo.metadata.lockupMetadataViewModel;
      titulo = md ? texto(md.title) : "";
      try { canal = texto(md.metadata.contentMetadataViewModel.metadataRows[0].metadataParts[0].text); } catch (e) { canal = ""; }
    }
    if (!/^[\w-]{11}$/.test(yt || "") || vistos.has(yt)) continue;
    vistos.add(yt);
    canciones.push({ yt, titulo, canal });
  }
  return canciones;
}

async function principal() {
  const lista = idLista(process.env.LISTA_YOUTUBE);
  if (!lista) { console.log("Falta el secreto LISTA_YOUTUBE; nada que hacer."); return; }

  const r = await fetch(`https://www.youtube.com/playlist?list=${lista}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept-Language": "es-419,es;q=0.9"
    }
  });
  if (!r.ok) throw new Error(`No pude abrir la lista (HTTP ${r.status})`);
  const html = await r.text();
  const avisos = [...html.matchAll(/"alertWithButtonRenderer":\{[^]*?"text":\{"(?:simpleText|runs)":(?:"([^"]+)"|\[\{"text":"([^"]+)")/g)].map((a) => a[1] || a[2]);
  if (avisos.length) console.log("Avisos de YouTube:", avisos.join(" | "));
  const canciones = extraerCanciones(html);
  if (!canciones.length) throw new Error("La lista no tiene canciones visibles (debe ser pública o no listada)");

  const anterior = fs.existsSync("musica.json") ? fs.readFileSync("musica.json", "utf8") : "";

  // GitHub lee la lista desde Estados Unidos: YouTube oculta allí las canciones
  // bloqueadas en ese país ("Se ocultó 1 video no disponible"), aunque en
  // Colombia sí suenan. Esas canciones se conservan de la lectura anterior.
  const ocultos = avisos.reduce((n, a) => {
    const m = String(a).match(/(\d+)\s+(?:videos?\s+no\s+disponibles?|unavailable\s+videos?)/i);
    return n + (m ? Number(m[1]) : 0);
  }, 0);
  if (ocultos && anterior) {
    try {
      const previas = JSON.parse(anterior).canciones || [];
      const actuales = new Set(canciones.map((c) => c.yt));
      const perdidas = previas.filter((c) => !actuales.has(c.yt));
      if (perdidas.length && perdidas.length <= ocultos) {
        previas.forEach((c, i) => { if (!actuales.has(c.yt)) canciones.splice(Math.min(i, canciones.length), 0, c); });
        console.log(`Conservadas ${perdidas.length} canciones ocultas en Estados Unidos: ${perdidas.map((c) => c.titulo).join(" | ")}`);
      }
    } catch (e) { /* musica.json dañado: se reemplaza */ }
  }

  const salida = JSON.stringify({ canciones }, null, 1) + "\n";
  if (anterior === salida) { console.log(`Sin cambios (${canciones.length} canciones).`); return; }
  fs.writeFileSync("musica.json", salida);
  console.log(`Guardadas ${canciones.length} canciones.`);
}

if (typeof module !== "undefined" && require.main === module) {
  principal().catch((e) => { console.error(e.message); process.exit(1); });
}
if (typeof module !== "undefined") module.exports = { extraerCanciones, idLista };
