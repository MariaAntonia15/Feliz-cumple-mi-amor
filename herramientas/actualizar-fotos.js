/* ==========================================================================
   Lee el álbum compartido de Google Fotos (config.js → album.enlace) y
   guarda la lista de fotos en fotos-album.json.
   Lo ejecuta GitHub Actions cada hora (.github/workflows/fotos.yml);
   no hace falta correrlo a mano.
   ========================================================================== */
const fs = require("fs");

function leerConfig() {
  const window = {};
  // config.js asigna window.CONFIG = { ... }
  new Function("window", fs.readFileSync("config.js", "utf8"))(window);
  return window.CONFIG || {};
}

const decodificar = (s) => String(s || "")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, "&");

// Extrae id, dirección, tamaño y fecha (con la zona horaria de la foto)
function extraerFotos(html) {
  const ini = html.indexOf("AF_initDataCallback({key: 'ds:1'");
  if (ini < 0) throw new Error("No encontré los datos del álbum (¿cambió Google Fotos?)");
  const bloque = html.slice(ini, html.indexOf("</script>", ini));
  const re = /\["(AF1Qip[\w-]+)",\["(https:\/\/lh3\.googleusercontent\.com\/pw\/[^"]+)",(\d+),(\d+),.*?\]\],(\d{13}),"[^"]*",(-?\d+),/g;
  const fotos = [];
  const vistos = new Set();
  let m;
  while ((m = re.exec(bloque))) {
    if (vistos.has(m[1])) continue;
    vistos.add(m[1]);
    const local = new Date(Number(m[5]) + Number(m[6])).toISOString();
    fotos.push({
      id: m[1],
      url: m[2],
      ancho: Number(m[3]),
      alto: Number(m[4]),
      fecha: local.slice(0, 10),
      hora: local.slice(11, 16)
    });
  }
  return fotos.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
}

async function principal() {
  const enlace = (leerConfig().album || {}).enlace;
  if (!enlace) { console.log("config.js no tiene album.enlace; nada que hacer."); return; }

  const r = await fetch(enlace, {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept-Language": "es"
    }
  });
  if (!r.ok) throw new Error(`No pude abrir el álbum (HTTP ${r.status})`);
  const html = await r.text();

  const fotos = extraerFotos(html);
  if (!fotos.length) throw new Error("El álbum no tiene fotos visibles (¿sigue compartido con enlace?)");
  const titulo = decodificar((html.match(/<title>([^<]*?)\s*-\s*Google (?:Fotos|Photos)<\/title>/) || [])[1]);

  const salida = JSON.stringify({ album: titulo, fotos }, null, 1) + "\n";
  const anterior = fs.existsSync("fotos-album.json") ? fs.readFileSync("fotos-album.json", "utf8") : "";
  if (anterior === salida) { console.log(`Sin cambios (${fotos.length} fotos).`); return; }
  fs.writeFileSync("fotos-album.json", salida);
  console.log(`Guardadas ${fotos.length} fotos de "${titulo}".`);
}

if (typeof module !== "undefined" && require.main === module) {
  principal().catch((e) => { console.error(e.message); process.exit(1); });
}
if (typeof module !== "undefined") module.exports = { extraerFotos, decodificar };
