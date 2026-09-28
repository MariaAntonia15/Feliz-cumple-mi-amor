/* ==========================================================================
   PÁGINA ROMÁNTICA — LÓGICA
   Normalmente no necesitas editar este archivo: todo el contenido
   se cambia desde config.js
   ========================================================================== */
(() => {
  "use strict";

  const C = window.CONFIG;
  if (!C) { console.error("No se encontró config.js"); return; }

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pendientes = C.mostrarFotosPendientes === true;
  const efectos = Object.assign(
    { petalos: true, corazones: true, brillos: true, corazonesAlTocar: true, confeti: true },
    C.efectos
  );

  /* ---------- Utilidades ---------- */
  function el(tag, props, ...children) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") n.className = v;
      else n.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      n.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return n;
  }

  let toastTimer;
  function toast(msg, ms = 3600) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), ms);
  }

  const pad = (n) => String(n).padStart(2, "0");
  const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const escXml = (s) => String(s).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;" }[c]));

  /* ---------- Fechas ---------- */
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function parseFecha(str) {
    const [f, t = "00:00"] = String(str || "").trim().split(/[T ]/);
    const [Y, M, D] = f.split("-").map(Number);
    const [hh = 0, mm = 0] = t.split(":").map(Number);
    return new Date(Y, (M || 1) - 1, D || 1, hh, mm);
  }
  function hoyISO() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function partesFecha(f) {
    const iso = f === "hoy" ? hoyISO() : String(f || "");
    const [y, m, d] = iso.split("-").map(Number);
    return { iso, y: y || null, m: m || null, d: d || null };
  }
  function fechaLarga(f) {
    const { y, m, d } = partesFecha(f);
    if (d) return `${d} de ${MESES[m - 1]} de ${y}`;
    if (m) return `${MESES[m - 1]} de ${y}`;
    return y ? String(y) : "";
  }
  function formatoHora(h) {
    const [hh, mm = 0] = String(h).split(":").map(Number);
    return `${((hh + 11) % 12) + 1}:${pad(mm)} ${hh >= 12 ? "p.m." : "a.m."}`;
  }
  const diasJuntos = () => Math.max(0, Math.floor((Date.now() - parseFecha(C.fechaInicio)) / 864e5));
  const reemplazar = (t) => String(t || "").replace(/\{dias\}/g, diasJuntos().toLocaleString("es"));

  /* ---------- Textos con formato (**negrita**, *cursiva*) ---------- */
  const inline = (t) => escHtml(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  const sinMarcas = (t) => String(t).replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");

  // Poemas: estrofas separadas por línea en blanco. Cartas: cada línea es un párrafo.
  function bloquesTexto(texto, tipo) {
    const t = reemplazar(texto).replace(/\r/g, "").trim();
    if (!t) return [];
    if (tipo === "poema") return t.split(/\n\s*\n/).map((s) => s.split("\n").map((l) => l.trim()).filter(Boolean));
    return t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => [l]);
  }
  function renderTexto(cont, texto, tipo) {
    cont.innerHTML = bloquesTexto(texto, tipo).map((ls) => `<p>${ls.map(inline).join("<br>")}</p>`).join("");
  }
  function extractoHTML(texto, tipo) {
    const b = bloquesTexto(texto, tipo);
    if (tipo === "poema") return `<p>${b.flat().slice(0, 4).map(inline).join("<br>")}…</p>`;
    let s = sinMarcas(b.map((x) => x.join(" ")).join(" "));
    if (s.length > 240) { s = s.slice(0, 240); s = s.slice(0, s.lastIndexOf(" ")) + "…"; }
    return `<p>${escHtml(s)}</p>`;
  }

  /* ---------- Fotos ---------- */
  const PALETAS = [["#f9d3de", "#e58fa8"], ["#fbe1d4", "#e3969f"], ["#f1d6ef", "#c687b6"], ["#fde4e1", "#d9667f"], ["#f6e3c8", "#d7a15f"]];
  const FORMAS = { retrato: [800, 1000], paisaje: [1600, 1000], cuadrada: [900, 900], alta: [800, 1200] };

  function placeholder(ruta, w, h, seed) {
    const [a, b] = PALETAS[Math.abs(seed) % PALETAS.length];
    const m = Math.min(w, h);
    const k = (m * 0.2) / 24;
    const fs = m / 16;
    const cy = h / 2 - 10 * k;
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>` +
      `<rect width='100%' height='100%' fill='url(#g)'/>` +
      `<path transform='translate(${w / 2 - 12 * k} ${cy - 12 * k}) scale(${k})' fill='#fff' fill-opacity='.6' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/>` +
      `<text x='50%' y='${cy + 14 * k + fs * 1.2}' text-anchor='middle' font-family='Georgia,serif' font-style='italic' font-size='${fs}' fill='#fff'>Tu foto aquí</text>` +
      (ruta ? `<text x='50%' y='${cy + 14 * k + fs * 2.3}' text-anchor='middle' font-family='Arial,sans-serif' font-size='${fs * 0.55}' fill='#fff' fill-opacity='.8'>${escXml(ruta)}</text>` : "") +
      `</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // Si la foto no existe: marco rosado (mostrarFotosPendientes) o se quita sin dejar hueco.
  function crearImg(src, alt, seed = 0, forma = "retrato", alFaltar) {
    const [w, h] = FORMAS[forma] || FORMAS.retrato;
    const img = new Image();
    img.alt = alt || "";
    img.decoding = "async";
    img.loading = "lazy";
    img.draggable = false;
    const faltante = () => {
      if (pendientes) img.src = placeholder(src || "", w, h, seed);
      else if (alFaltar) alFaltar(img);
      else img.remove();
    };
    if (!src) { if (pendientes) faltante(); else queueMicrotask(faltante); return img; }
    img.onerror = () => { img.onerror = null; faltante(); };
    img.src = src;
    return img;
  }

  const cacheImg = new Map();
  function existeImagen(src) {
    if (!src) return Promise.resolve(false);
    if (!cacheImg.has(src)) {
      cacheImg.set(src, new Promise((res) => {
        const im = new Image();
        im.onload = () => res(true);
        im.onerror = () => res(false);
        im.src = src;
      }));
    }
    return cacheImg.get(src);
  }
  async function conFoto(lista) {
    if (pendientes) return lista;
    const ok = await Promise.all(lista.map((x) => existeImagen(x.foto)));
    return lista.filter((_, i) => ok[i]);
  }

  const ICONO_IZQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const ICONO_DER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  /* ---------- Aparición al hacer scroll ---------- */
  let ioRevelar = null;
  function iniciarRevelado() {
    const els = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("visible"));
      return;
    }
    ioRevelar = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); ioRevelar.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => ioRevelar.observe(e));
  }
  function observarRevelado(raiz) {
    const els = raiz.matches && raiz.matches("[data-reveal]") ? [raiz, ...$$("[data-reveal]", raiz)] : $$("[data-reveal]", raiz);
    els.forEach((e) => { if (ioRevelar) ioRevelar.observe(e); else e.classList.add("visible"); });
  }

  /* ---------- Menú y números de capítulo según las secciones visibles ---------- */
  function sincronizarSecciones() {
    $$(".nav-links a[data-seccion]").forEach((a) => {
      const s = document.getElementById(a.dataset.seccion);
      a.parentElement.hidden = !s || s.hidden;
    });
    const ROM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    let n = 0;
    $$("[data-capitulo]").forEach((e) => {
      const s = e.closest("section");
      if (s && !s.hidden) e.textContent = "Capítulo " + (ROM[n++] || n);
    });
  }

  /* ---------- Textos generales ---------- */
  function rellenarTextos() {
    const p = C.pareja || {};
    const mapa = { tuNombre: p.tuNombre, suNombre: p.suNombre, marca: p.marca || "Nosotros ❤" };
    $$("[data-bind]").forEach((n) => {
      const v = mapa[n.dataset.bind];
      if (v != null) n.textContent = v;
    });
  }

  /* ---------- Modo día / nocturno ---------- */
  function iniciarModo() {
    const btn = $("#btn-modo");
    const etiquetar = () => {
      const noche = document.documentElement.dataset.theme === "night";
      const txt = noche ? "Cambiar a modo día" : "Experiencia romántica nocturna";
      btn.setAttribute("aria-label", txt);
      btn.title = txt;
    };
    etiquetar();
    btn.addEventListener("click", () => {
      const m = document.documentElement.dataset.theme === "night" ? "light" : "night";
      document.documentElement.dataset.theme = m;
      try { localStorage.setItem("modo-romantico", m); } catch (e) { /* sin almacenamiento */ }
      etiquetar();
      toast(m === "night" ? "🌙 Experiencia romántica nocturna activada" : "☀️ Modo día");
    });
  }

  /* ---------- Portada ---------- */
  function prepararHero() {
    const h = C.hero || {};
    const img = crearImg(h.foto, "Nuestra foto", 1, "paisaje");
    img.loading = "eager";
    $("#hero-bg").append(img);

    const titulo = $("#hero-titulo");
    const palabras = (h.titulo || "").split(" ");
    palabras.forEach((w, i) => {
      const s = el("span", { class: "palabra" }, w);
      s.style.animationDelay = (0.35 + i * 0.14) + "s";
      titulo.append(s, " ");
    });
    $("#hero-sub").textContent = h.subtitulo || "";
    $("#hero-btn").textContent = h.boton || "Ver nuestra historia ❤️";

    const retraso = 0.35 + palabras.length * 0.14 + 0.5;
    $$(".hero [data-despues]").forEach((n, i) => { n.style.transitionDelay = (retraso + i * 0.3) + "s"; });
  }
  const arrancarHero = () => $(".hero").classList.add("animar");

  /* ---------- Contador ---------- */
  function diferencia(a, b) {
    let y = b.getFullYear() - a.getFullYear();
    let m = b.getMonth() - a.getMonth();
    let d = b.getDate() - a.getDate();
    let h = b.getHours() - a.getHours();
    let mi = b.getMinutes() - a.getMinutes();
    let s = b.getSeconds() - a.getSeconds();
    if (s < 0) { s += 60; mi--; }
    if (mi < 0) { mi += 60; h--; }
    if (h < 0) { h += 24; d--; }
    if (d < 0) { d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); m--; }
    if (m < 0) { m += 12; y--; }
    return { y, m, d, h, mi, s };
  }

  function iniciarContador() {
    const inicio = parseFecha(C.fechaInicio);
    if (isNaN(inicio)) return;
    $("#contador-fecha").textContent = `${pad(inicio.getDate())}/${pad(inicio.getMonth() + 1)}/${inicio.getFullYear()}`;
    const campos = { y: "#c-anios", m: "#c-meses", d: "#c-dias", h: "#c-horas", mi: "#c-minutos", s: "#c-segundos" };
    const nodos = Object.fromEntries(Object.entries(campos).map(([k, s]) => [k, $(s)]));
    const tick = () => {
      const ahora = new Date();
      const d = ahora < inicio ? { y: 0, m: 0, d: 0, h: 0, mi: 0, s: 0 } : diferencia(inicio, ahora);
      for (const k in nodos) nodos[k].textContent = k === "y" || k === "m" || k === "d" ? d[k] : pad(d[k]);
      $("#contador-total").textContent = Math.max(0, Math.floor((ahora - inicio) / 864e5)).toLocaleString("es");
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Carta con escritura automática ---------- */
  function iniciarCarta() {
    const c = C.carta || {};
    let saludo = c.saludo;
    let parrafos = c.parrafos || [];
    let despedida = c.despedida;
    let fecha = c.fecha;
    if (c.deLaAgenda) {
      const e = (C.agenda || []).find((x) => x.id === c.deLaAgenda);
      if (e) {
        saludo = e.titulo;
        parrafos = bloquesTexto(e.texto, "carta").map((ls) => sinMarcas(ls.join(" ")));
        despedida = null;
        fecha = fecha || fechaLarga(e.fecha);
      }
    }
    if (!saludo && !parrafos.length) { $("#carta").hidden = true; return; }

    const papel = $("#papel");
    const cont = $("#carta-contenido");
    $("#carta-para").textContent = c.para || "";
    $("#carta-fecha").textContent = fecha || "";
    $("#carta-firma").textContent = c.firma || "";

    const bloques = [
      { cls: "carta-saludo", texto: saludo },
      ...parrafos.map((t) => ({ cls: "", texto: t })),
      { cls: "carta-despedida", texto: despedida }
    ].filter((b) => b.texto);

    // El texto "fantasma" reserva el espacio para que la carta no salte al escribirse
    const nodos = bloques.map((b) => {
      const typed = el("span", { class: "typed" });
      const ghost = el("span", { class: "ghost" }, b.texto);
      const p = el("p", { class: b.cls || null }, typed, ghost);
      cont.append(p);
      return { p, typed, ghost, chars: Array.from(b.texto) };
    });

    let saltar = false;
    let iniciado = false;
    const terminar = () => {
      nodos.forEach((n) => {
        n.typed.textContent = n.chars.join("");
        n.ghost.textContent = "";
        n.p.classList.remove("escribiendo");
      });
      papel.classList.add("terminada");
      $("#carta-pista").classList.add("oculta");
    };
    const vel = c.velocidadEscritura || 22;
    const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

    async function escribir() {
      for (const n of nodos) {
        n.p.classList.add("escribiendo");
        for (let i = 1; i <= n.chars.length; i++) {
          if (saltar) return terminar();
          n.typed.textContent = n.chars.slice(0, i).join("");
          n.ghost.textContent = n.chars.slice(i).join("");
          const ch = n.chars[i - 1];
          await esperar(/[.!?…]/.test(ch) ? vel * 7 : /[,;:]/.test(ch) ? vel * 4 : vel);
        }
        n.p.classList.remove("escribiendo");
        await esperar(vel * 10);
      }
      terminar();
    }

    papel.addEventListener("click", () => { if (iniciado) saltar = true; });
    if (reduceMotion || c.efectoEscritura === false || !("IntersectionObserver" in window)) {
      terminar();
      return;
    }
    const io = new IntersectionObserver((entradas) => {
      if (entradas[0].isIntersecting) {
        io.disconnect();
        iniciado = true;
        setTimeout(escribir, 700);
      }
    }, { threshold: 0, rootMargin: "0px 0px -30% 0px" });
    io.observe(papel);
  }

  /* ---------- Agenda de momentos ---------- */
  const TIPOS = {
    momento: { nombre: "Momento", plural: "Momentos", icono: "✨" },
    carta:   { nombre: "Carta",   plural: "Cartas",   icono: "💌" },
    poema:   { nombre: "Poema",   plural: "Poemas",   icono: "🖋️" }
  };
  const tipoDe = (e) => (TIPOS[e.tipo] ? e.tipo : "momento");
  const lecturas = [];

  function iniciarAgenda() {
    const lista = (C.agenda || [])
      .map((e, i) => ({ ...e, _i: i, _p: partesFecha(e.fecha), _orden: e.fecha === "hoy" ? "9999" : partesFecha(e.fecha).iso }))
      .sort((a, b) => (a._orden < b._orden ? -1 : a._orden > b._orden ? 1 : a._i - b._i)); // "hoy" siempre al final
    if (!lista.length) { $("#agenda").hidden = true; return; }

    const cont = $("#agenda-lista");
    const anios = $("#agenda-anios");
    const filtros = $("#agenda-filtros");
    lista.filter((e) => tipoDe(e) !== "momento").forEach((e) => lecturas.push(e));

    const grupos = new Map();
    lista.forEach((e) => {
      const y = e._p.y || "Sin fecha";
      if (!grupos.has(y)) grupos.set(y, []);
      grupos.get(y).push(e);
    });

    const paginas = [];
    for (const [y, entradas] of grupos) {
      const contador = el("small", {});
      const sec = el("div", { class: "agenda-anio", id: `agenda-${y}` },
        el("h3", { class: "agenda-anio-titulo" }, el("span", {}, String(y)), contador));
      const nodos = entradas.map(crearEntrada);
      sec.append(...nodos);
      cont.append(sec);
      const chip = el("a", { href: `#agenda-${y}` }, String(y));
      anios.append(chip);
      paginas.push({ sec, chip, nodos, contador });
    }

    const actualizarConteos = () => paginas.forEach((p) => {
      const n = p.nodos.filter((x) => !x.classList.contains("oculta")).length;
      p.contador.textContent = `${n} ${n === 1 ? "recuerdo" : "recuerdos"}`;
      p.sec.hidden = n === 0;
      p.chip.hidden = n === 0;
    });

    const conteo = (t) => lista.filter((e) => tipoDe(e) === t).length;
    const opciones = [{ id: "todo", nombre: "📖 Todo" },
      ...Object.entries(TIPOS).filter(([k]) => conteo(k) > 0).map(([k, T]) => ({ id: k, nombre: `${T.icono} ${T.plural} · ${conteo(k)}` }))];
    if (opciones.length > 2) {
      opciones.forEach((o) => {
        const b = el("button", { class: "filtro" + (o.id === "todo" ? " activo" : ""), type: "button", "aria-pressed": String(o.id === "todo") }, o.nombre);
        b.addEventListener("click", () => {
          $$(".filtro", filtros).forEach((x) => {
            x.classList.toggle("activo", x === b);
            x.setAttribute("aria-pressed", String(x === b));
          });
          paginas.forEach((p) => p.nodos.forEach((n) => n.classList.toggle("oculta", o.id !== "todo" && n.dataset.tipo !== o.id)));
          actualizarConteos();
        });
        filtros.append(b);
      });
    }
    actualizarConteos();
    iniciarLector();
  }

  function crearEntrada(e) {
    const tipo = tipoDe(e);
    const T = TIPOS[tipo];
    const p = e._p;
    const aprox = Boolean(e.fechaTexto) || !p.d;

    const fecha = el("div", { class: "entrada-fecha" + (aprox ? " aprox" : "") });
    if (aprox) {
      fecha.append(el("span", { class: "ef-icono" }, e.icono || T.icono),
        el("span", { class: "ef-texto" }, e.fechaTexto || (p.m ? `${MESES[p.m - 1]} ${p.y}` : String(p.y || ""))));
    } else {
      fecha.append(el("span", { class: "ef-mes" }, MESES_CORTOS[p.m - 1]),
        el("span", { class: "ef-dia" }, String(p.d)),
        el("span", { class: "ef-semana" }, e.fecha === "hoy" ? "hoy" : DIAS[new Date(p.y, p.m - 1, p.d).getDay()]));
    }

    const icono = tipo === "momento" ? (e.icono || T.icono) : T.icono;
    const cuerpo = el("div", { class: "entrada-cuerpo" },
      el("div", { class: "entrada-meta" },
        el("span", { class: "chip-tipo" }, `${icono} ${T.nombre}`),
        e.hora ? el("span", { class: "entrada-hora" }, "🕔 " + formatoHora(e.hora)) : null),
      el("h4", {}, e.titulo || ""));

    if (e.foto || pendientes) {
      const marco = el("div", { class: "entrada-foto" });
      marco.append(crearImg(e.foto, e.titulo, e._i, "paisaje", () => marco.remove()));
      cuerpo.append(marco);
    }

    const texto = el("div", { class: "entrada-texto" });
    const largo = tipo !== "momento" && reemplazar(e.texto).length > 320;
    if (largo) texto.innerHTML = extractoHTML(e.texto, tipo);
    else renderTexto(texto, e.texto, tipo === "poema" ? "poema" : "carta");
    cuerpo.append(texto);

    if (tipo !== "momento") {
      const b = el("button", { class: "entrada-leer", type: "button" },
        largo ? (tipo === "poema" ? "Leer poema completo" : "Leer carta completa") : "Abrir en grande", " →");
      b.addEventListener("click", () => abrirLector(lecturas.indexOf(e)));
      cuerpo.append(b);
    }

    return el("article", {
      class: `entrada tipo-${tipo}` + (e.destacado ? " destacada" : ""),
      "data-tipo": tipo,
      "data-reveal": ""
    }, fecha, cuerpo);
  }

  /* ---------- Lector de cartas y poemas ---------- */
  let lectorIdx = 0;
  let lectorFoco = null;
  function iniciarLector() {
    const lector = $("#lector");
    $("#lector-cerrar").addEventListener("click", cerrarLector);
    $("#lector-prev").addEventListener("click", () => moverLector(-1));
    $("#lector-next").addEventListener("click", () => moverLector(1));
    lector.addEventListener("click", (e) => { if (e.target === lector) cerrarLector(); });
    document.addEventListener("keydown", (e) => {
      if (!lector.classList.contains("abierto")) return;
      if (e.key === "Escape") cerrarLector();
      if (e.key === "ArrowLeft") moverLector(-1);
      if (e.key === "ArrowRight") moverLector(1);
    });
  }
  function pintarLector() {
    const e = lecturas[lectorIdx];
    if (!e) return;
    const tipo = tipoDe(e);
    $("#lector-tipo").textContent = `${TIPOS[tipo].icono} ${TIPOS[tipo].nombre}`;
    $("#lector-titulo").textContent = e.titulo || "";
    $("#lector-fecha").textContent = (e.fechaTexto || fechaLarga(e.fecha)) + (e.hora ? " · " + formatoHora(e.hora) : "");
    const tx = $("#lector-texto");
    tx.className = "lector-texto " + tipo;
    renderTexto(tx, e.texto, tipo);
    const varias = lecturas.length > 1;
    $("#lector-prev").hidden = !varias;
    $("#lector-next").hidden = !varias;
    $("#lector-contador").textContent = varias ? `${lectorIdx + 1} de ${lecturas.length}` : "";
    $("#lector").scrollTop = 0;
  }
  function abrirLector(i) {
    if (i < 0) return;
    lectorIdx = i;
    lectorFoco = document.activeElement;
    pintarLector();
    $("#lector").classList.add("abierto");
    document.body.classList.add("bloqueado");
    $("#lector-cerrar").focus({ preventScroll: true });
  }
  function moverLector(d) {
    if (lecturas.length < 2) return;
    lectorIdx = (lectorIdx + d + lecturas.length) % lecturas.length;
    pintarLector();
  }
  function cerrarLector() {
    $("#lector").classList.remove("abierto");
    document.body.classList.remove("bloqueado");
    if (lectorFoco) lectorFoco.focus({ preventScroll: true });
  }

  /* ---------- Carruseles ---------- */
  async function iniciarCarruseles() {
    const cont = $("#carruseles");
    const listas = await Promise.all((C.carruseles || []).map((car) => conFoto(car.fotos || [])));
    let hay = false;
    (C.carruseles || []).forEach((car, ci) => {
      if (!listas[ci].length) return;
      hay = true;
      cont.append(crearCarrusel({ ...car, fotos: listas[ci] }, ci));
    });
    const sec = $("#recuerdos");
    sec.hidden = !hay;
    if (hay) observarRevelado(sec);
  }

  function crearCarrusel(car, ci) {
    const fotos = car.fotos || [];
    const raiz = el("div", { class: "carrusel", "data-reveal": "" });
    if ((car.titulo && ci > 0) || car.subtitulo) {
      raiz.append(el("div", { class: "carrusel-cab" },
        ci > 0 && car.titulo ? el("h3", {}, car.titulo) : null,
        car.subtitulo ? el("p", {}, car.subtitulo) : null));
    }
    const stage = el("div", { class: "carrusel-stage", tabindex: "0", "aria-roledescription": "carrusel", "aria-label": car.titulo || "Recuerdos" });
    const dots = el("div", { class: "dots" });
    const prev = el("button", { class: "flecha", type: "button", "aria-label": "Foto anterior" });
    const next = el("button", { class: "flecha", type: "button", "aria-label": "Foto siguiente" });
    prev.innerHTML = ICONO_IZQ;
    next.innerHTML = ICONO_DER;

    let actual = 0;
    let ultimoSwipe = 0;

    const slides = fotos.map((f, i) => {
      const meta = [f.fecha ? "📅 " + f.fecha : null, f.lugar ? "📍 " + f.lugar : null].filter(Boolean).join("   ·   ");
      const s = el("figure", { class: "slide" },
        el("div", { class: "polaroid" },
          el("div", { class: "polaroid-foto" }, crearImg(f.foto, f.titulo, i + ci * 3)),
          el("figcaption", {},
            el("h4", { class: "polaroid-titulo" }, f.titulo || ""),
            meta ? el("p", { class: "polaroid-meta" }, meta) : null,
            f.descripcion ? el("p", { class: "polaroid-desc" }, f.descripcion) : null)));
      s.addEventListener("click", () => {
        if (Date.now() - ultimoSwipe < 350) return;
        if (i !== actual) { ir(i); reiniciar(); }
      });
      stage.append(s);
      const d = el("button", { class: "dot", type: "button", "aria-label": `Ir a la foto ${i + 1}` });
      d.addEventListener("click", () => { ir(i); reiniciar(); });
      dots.append(d);
      return s;
    });

    function pintar() {
      const n = slides.length;
      slides.forEach((s, i) => {
        let d = i - actual;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        s.style.setProperty("--d", d);
        s.style.setProperty("--ad", Math.abs(d));
        s.style.zIndex = 20 - Math.abs(d);
        s.classList.toggle("activa", d === 0);
        s.classList.toggle("lejana", Math.abs(d) > 2);
        s.setAttribute("aria-hidden", d === 0 ? "false" : "true");
      });
      Array.from(dots.children).forEach((d, i) => d.classList.toggle("activo", i === actual));
    }
    function ir(i) {
      const n = slides.length;
      if (!n) return;
      actual = ((i % n) + n) % n;
      pintar();
    }

    const intervalo = car.intervalo || 5000;
    let timer = null;
    let pausado = false;
    function reiniciar() {
      clearInterval(timer);
      if (reduceMotion || car.automatico === false || slides.length < 2) return;
      timer = setInterval(() => { if (!pausado && !document.hidden) ir(actual + 1); }, intervalo);
    }
    stage.addEventListener("mouseenter", () => { pausado = true; });
    stage.addEventListener("mouseleave", () => { pausado = false; });
    stage.addEventListener("focusin", () => { pausado = true; });
    stage.addEventListener("focusout", () => { pausado = false; });

    let x0 = null;
    stage.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
    stage.addEventListener("pointercancel", () => { x0 = null; });
    stage.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) {
        ultimoSwipe = Date.now();
        ir(actual + (dx < 0 ? 1 : -1));
        reiniciar();
      }
    });
    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { ir(actual - 1); reiniciar(); }
      if (e.key === "ArrowRight") { ir(actual + 1); reiniciar(); }
    });
    prev.addEventListener("click", () => { ir(actual - 1); reiniciar(); });
    next.addEventListener("click", () => { ir(actual + 1); reiniciar(); });

    const ajustarAltura = () => {
      const h = Math.max(0, ...slides.map((s) => s.offsetHeight));
      if (h) stage.style.height = (h + 16) + "px";
    };
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(ajustarAltura);
      slides.forEach((s) => ro.observe(s));
    }
    window.addEventListener("resize", ajustarAltura);

    raiz.append(stage);
    if (slides.length > 1) raiz.append(el("div", { class: "carrusel-controles" }, prev, dots, next));
    pintar();
    reiniciar();
    return raiz;
  }

  /* ---------- Galería con filtros ---------- */
  async function iniciarGaleria() {
    const g = C.galeria || {};
    const sec = $("#galeria");
    const fotos = await conFoto(g.fotos || []);
    if (!fotos.length) { sec.hidden = true; return; }
    sec.hidden = false;

    const filtros = $("#filtros");
    const grid = $("#galeria-grid");
    const formas = ["retrato", "cuadrada", "alta", "paisaje", "retrato", "alta"];

    const items = fotos.map((f, i) => {
      const img = crearImg(f.foto, f.titulo, i, f.forma || formas[i % formas.length]);
      const fig = el("figure", { class: "g-item", "data-cat": f.categoria, tabindex: "0", role: "button", "aria-label": "Ver foto: " + (f.titulo || (i + 1)) },
        img, f.titulo ? el("figcaption", {}, f.titulo) : null);
      fig.style.animationDelay = (i % 6) * 0.06 + "s";
      const abrir = () => abrirLightbox(items.filter((x) => !x.classList.contains("oculto")), fig);
      fig.addEventListener("click", abrir);
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
      });
      grid.append(fig);
      return fig;
    });

    const cats = (g.categorias || []).filter((c) => fotos.some((f) => f.categoria === c.id));
    if (cats.length > 1) {
      [{ id: "todas", nombre: "✨ Todas" }, ...cats].forEach((c) => {
        const b = el("button", { class: "filtro" + (c.id === "todas" ? " activo" : ""), type: "button", "aria-pressed": String(c.id === "todas") }, c.nombre);
        b.addEventListener("click", () => {
          $$(".filtro", filtros).forEach((x) => {
            x.classList.toggle("activo", x === b);
            x.setAttribute("aria-pressed", String(x === b));
          });
          let k = 0;
          items.forEach((it) => {
            const ok = c.id === "todas" || it.dataset.cat === c.id;
            it.classList.toggle("oculto", !ok);
            if (ok) {
              it.style.animation = "none";
              void it.offsetWidth; // reinicia la animación de entrada
              it.style.animation = "";
              it.style.animationDelay = (k++ % 6) * 0.06 + "s";
            }
          });
        });
        filtros.append(b);
      });
    }
    observarRevelado(sec);
  }

  /* ---------- Lightbox ---------- */
  const LB = { lista: [], idx: 0, foco: null };

  function iniciarLightbox() {
    const lb = $("#lightbox");
    const img = $("#lb-img");
    $("#lb-cerrar").addEventListener("click", cerrarLightbox);
    $("#lb-prev").addEventListener("click", () => moverLb(-1));
    $("#lb-next").addEventListener("click", () => moverLb(1));
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-figura")) cerrarLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("abierto")) return;
      if (e.key === "Escape") cerrarLightbox();
      if (e.key === "ArrowLeft") moverLb(-1);
      if (e.key === "ArrowRight") moverLb(1);
    });
    img.addEventListener("click", (e) => {
      const r = img.getBoundingClientRect();
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      img.classList.toggle("zoom");
    });
    let x0 = null;
    lb.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
    lb.addEventListener("pointerup", (e) => {
      if (x0 === null || img.classList.contains("zoom")) { x0 = null; return; }
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) moverLb(dx < 0 ? 1 : -1);
    });
  }

  function abrirLightbox(lista, actual) {
    LB.lista = lista;
    LB.idx = Math.max(0, lista.indexOf(actual));
    LB.foco = document.activeElement;
    mostrarLb(false);
    $("#lightbox").classList.add("abierto");
    document.body.classList.add("bloqueado");
    $("#lb-cerrar").focus({ preventScroll: true });
  }

  function mostrarLb(animar = true) {
    const fig = LB.lista[LB.idx];
    if (!fig) return;
    const img = $("#lb-img");
    const poner = () => {
      img.classList.remove("zoom");
      img.src = fig.querySelector("img").src;
      img.alt = fig.getAttribute("aria-label") || "";
      $("#lb-caption").textContent = fig.querySelector("figcaption")?.textContent || "";
      $("#lb-contador").textContent = `${LB.idx + 1} / ${LB.lista.length}`;
      img.classList.remove("cambiando");
    };
    if (!animar) return poner();
    img.classList.add("cambiando");
    setTimeout(poner, 200);
  }

  function moverLb(d) {
    if (LB.lista.length < 2) return;
    LB.idx = (LB.idx + d + LB.lista.length) % LB.lista.length;
    mostrarLb();
  }

  function cerrarLightbox() {
    $("#lightbox").classList.remove("abierto");
    $("#lb-img").classList.remove("zoom");
    document.body.classList.remove("bloqueado");
    if (LB.foco) LB.foco.focus({ preventScroll: true });
  }

  /* ---------- Razones ---------- */
  function iniciarRazones() {
    const R = C.razones || [];
    if (!R.length) { $("#razones").hidden = true; return; }
    const grid = $("#razones-grid");
    const btnMas = $("#razones-mas");
    const btnAzar = $("#razones-azar");
    const PASO = C.razonesPorPagina || 12;
    const vistas = new Set();
    const tarjetas = [];
    let mostradas = 0;

    $("#razones-total").textContent = R.length;
    const actualizar = () => {
      $("#razones-progreso").textContent = `Has descubierto ${vistas.size} de ${R.length} ❤️`;
    };

    const crear = (i) => {
      const b = el("button", { class: "razon", type: "button", "aria-label": `Razón número ${i + 1}. Toca para descubrirla` },
        el("span", { class: "razon-inner" },
          el("span", { class: "razon-cara razon-frente" },
            el("span", { class: "razon-corazon" }, "❤"),
            el("span", { class: "razon-num" }, "#" + (i + 1)),
            el("span", { class: "razon-pista" }, "Toca para descubrir")),
          el("span", { class: "razon-cara razon-reverso" },
            el("small", {}, "RAZÓN #" + (i + 1)),
            el("p", {}, R[i]))));
      b.addEventListener("click", () => voltear(i));
      return b;
    };

    function voltear(i) {
      const b = tarjetas[i];
      const volteada = b.classList.toggle("volteada");
      b.setAttribute("aria-label", volteada ? `Razón ${i + 1}: ${R[i]}` : `Razón número ${i + 1}. Toca para descubrirla`);
      if (volteada && !vistas.has(i)) {
        vistas.add(i);
        actualizar();
        const r = b.getBoundingClientRect();
        Confeti.lanzar(r.left + r.width / 2, r.top + r.height / 2, 16, true);
        if (vistas.size === R.length) {
          setTimeout(() => { Confeti.grande(); toast("¡Descubriste todas! Y aún así no alcanzan las palabras 💘"); }, 800);
        }
      }
    }

    function mostrarHasta(n) {
      const fin = Math.min(R.length, n);
      let k = 0;
      while (mostradas < fin) {
        const t = crear(mostradas);
        t.style.animationDelay = (k++ % PASO) * 0.05 + "s";
        tarjetas.push(t);
        grid.append(t);
        mostradas++;
      }
      btnMas.hidden = mostradas >= R.length;
    }

    btnMas.addEventListener("click", () => mostrarHasta(mostradas + PASO));
    btnAzar.addEventListener("click", () => {
      let pendientesR = tarjetas.map((_, i) => i).filter((i) => !vistas.has(i));
      if (!pendientesR.length) {
        if (mostradas >= R.length) { toast("Ya las descubriste todas… pero siempre habrá más ❤️"); return; }
        const desde = mostradas;
        mostrarHasta(mostradas + PASO);
        pendientesR = tarjetas.map((_, i) => i).slice(desde);
      }
      const i = pendientesR[Math.floor(Math.random() * pendientesR.length)];
      const t = tarjetas[i];
      t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      t.classList.add("destacada");
      setTimeout(() => { t.classList.remove("destacada"); voltear(i); }, 750);
    });

    mostrarHasta(PASO);
    actualizar();
  }

  /* ---------- Música: lista de YouTube o canciones sueltas ---------- */
  function idYoutube(v) {
    if (!v) return null;
    const s = String(v).trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  function idLista(v) {
    if (!v) return null;
    const s = String(v).trim();
    const m = s.match(/[?&]list=([\w-]+)/);
    if (m) return m[1];
    return /^(PL|OL|UU|FL|RD)[\w-]+$/.test(s) ? s : null;
  }
  // Quita "(Video Oficial)", "[Letra]", "| Lyrics"… de los títulos de YouTube
  const RUIDO = /official|oficial|video|vídeo|videoclip|audio|lyric|letra|\bsub\b|subtitulad|visualizer|remaster|\bhd\b|4k/i;
  function limpiarTitulo(t) {
    const s = String(t || "").split(" | ")[0]
      .replace(/[([]([^)\]]*)[)\]]/g, (todo, dentro) => (RUIDO.test(dentro) ? "" : todo))
      .replace(/\*/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+[-–—]\s*$/, "");
    return s.trim();
  }
  const esCanalArtista = (a) => /\s-\sTopic$|VEVO$/i.test(a || "");
  const limpiarAutor = (a) => String(a || "").replace(/\s*-\s*Topic$/i, "").replace(/VEVO$/i, "").trim();

  function iniciarMusica() {
    const m = C.musica || {};
    const listaId = idLista(m.listaYoutube);
    let canciones = listaId ? [] : (m.canciones || [])
      .map((c) => ({ ...c, yt: idYoutube(c.youtube) }))
      .filter((c) => c.yt || c.archivo);
    const sec = $("#musica");
    if (!listaId && !canciones.length) {
      sec.hidden = true;
      return { activa: false, alAbrir() {} };
    }

    const audio = $("#audio");
    const vol = typeof m.volumen === "number" ? Math.min(1, Math.max(0, m.volumen)) : 0.7;
    audio.volume = vol;
    let idx = 0;
    let yt = null;
    let ytListo = false;
    let ytPendiente = false;
    let errores = 0;
    let ultimoError = 0;
    let sonando = false;
    let quiereSonar = false; // solo se salta de canción por error si alguien le dio play
    let expandida = false;
    const MAX_VISIBLES = 8;
    const lista = $("#playlist");
    const btnMas = $("#playlist-mas");
    let pistas = [];
    const actual = () => canciones[idx] || {};
    const esYt = () => Boolean(listaId || actual().yt);

    $("#musica-dedicatoria").textContent = m.dedicatoria || "";
    if (listaId) {
      const enlace = $("#playlist-enlace");
      enlace.href = `https://www.youtube.com/playlist?list=${listaId}`;
      enlace.hidden = false;
    }

    const estado = (on) => {
      sonando = on;
      document.body.classList.toggle("sonando", on);
    };

    function avisoLista(texto) {
      lista.hidden = false;
      lista.textContent = "";
      lista.append(el("li", { class: "playlist-aviso" }, texto));
      btnMas.hidden = true;
    }

    function pintarLista() {
      lista.textContent = "";
      pistas = canciones.map((c, i) => {
        const b = el("button", { class: "pista", type: "button" },
          el("span", { class: "pista-num" }, pad(i + 1)),
          el("span", { class: "pista-info" }, el("strong", {}, c.titulo || `Canción ${i + 1}`), c.artista ? el("small", {}, c.artista) : null),
          el("span", { class: "pista-eq", "aria-hidden": "true" }, el("i"), el("i"), el("i")));
        b.addEventListener("click", () => (i === idx ? alternar() : ir(i)));
        const href = c.yt ? `https://www.youtube.com/watch?v=${c.yt}${listaId ? "&list=" + listaId : ""}` : null;
        lista.append(el("li", {}, b, href
          ? el("a", { class: "pista-yt", href, target: "_blank", rel: "noopener", "aria-label": "Abrir en YouTube", title: "Abrir en YouTube" }, "↗")
          : null));
        return b;
      });
      const pocas = canciones.length < 2;
      lista.hidden = pocas;
      $("#btn-prev").hidden = pocas && !listaId;
      $("#btn-next").hidden = pocas && !listaId;
      marcar();
    }

    function marcar() {
      pistas.forEach((p, i) => {
        p.classList.toggle("activa", i === idx);
        p.parentElement.hidden = !expandida && i >= MAX_VISIBLES && i !== idx;
      });
      const sobran = canciones.length > MAX_VISIBLES;
      btnMas.hidden = !sobran;
      btnMas.textContent = expandida ? "Ver menos" : `Ver las ${canciones.length} canciones`;
    }
    btnMas.addEventListener("click", () => { expandida = !expandida; marcar(); });

    function mostrarInfo() {
      const c = actual();
      $("#rep-dedicatoria").textContent = c.dedicatoria || "";
      $("#rep-titulo").textContent = c.titulo || (listaId ? (canciones.length ? `Canción ${idx + 1}` : "Nuestra lista") : `Canción ${idx + 1}`);
      $("#rep-artista").textContent = c.artista || "";
      $("#yt-marco").hidden = !esYt();
      $("#vinilo").hidden = esYt();
      const label = $("#vinilo-label");
      label.textContent = "";
      if (!esYt() && c.portada) label.append(crearImg(c.portada, "Portada", 3, "cuadrada"));
      marcar();
    }

    const fmt = (s) => (isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}` : "0:00");
    function pintarProgreso(t, d) {
      $("#barra-progreso").style.width = (d ? (t / d) * 100 : 0) + "%";
      $("#tiempo-actual").textContent = fmt(t);
      $("#tiempo-total").textContent = fmt(d);
    }

    // Nombres de las canciones (se consultan a YouTube)
    async function completarTitulos() {
      await Promise.all(canciones.map(async (c) => {
        if (!c.yt || c.titulo) return;
        try {
          const r = await fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + c.yt));
          if (!r.ok) return;
          const j = await r.json();
          c.titulo = limpiarTitulo(j.title) || c.titulo;
          c.artista = esCanalArtista(j.author_name) ? limpiarAutor(j.author_name) : "";
        } catch (e) { /* sin conexión: queda "Canción N" */ }
      }));
      pintarLista();
      mostrarInfo();
    }
    function tituloDesdePlayer() {
      const c = actual();
      if (!c.yt || c.titulo || !yt.getVideoData) return;
      const d = yt.getVideoData();
      if (d && d.title) {
        c.titulo = limpiarTitulo(d.title);
        c.artista = esCanalArtista(d.author) ? limpiarAutor(d.author) : "";
        pintarLista();
        mostrarInfo();
      }
    }

    // La lista se lee de YouTube cada vez que se abre la página:
    // las canciones nuevas que agregues allá aparecen solas.
    function leerLista(intento = 0) {
      const ids = yt.getPlaylist && yt.getPlaylist();
      if (ids && ids.length) {
        canciones = ids.map((id) => ({ yt: id }));
        const i = yt.getPlaylistIndex ? yt.getPlaylistIndex() : 0;
        idx = i >= 0 ? i : 0;
        pintarLista();
        mostrarInfo();
        completarTitulos();
        return;
      }
      if (intento < 30) setTimeout(() => leerLista(intento + 1), 500);
      else avisoLista("No pude cargar la lista. Revisa en YouTube que esté como pública o no listada.");
    }

    // --- Reproductor de YouTube ---
    function onReady() {
      ytListo = true;
      yt.setVolume(Math.round(vol * 100));
      if (listaId) {
        yt.setLoop(true);
        if (m.aleatorio) yt.setShuffle(true);
        leerLista();
      }
      if (ytPendiente) { ytPendiente = false; reproducir(false); }
    }
    function onStateChange(e) {
      if (!esYt()) return;
      if (listaId && canciones.length) {
        const i = yt.getPlaylistIndex();
        if (i >= 0 && i !== idx) { idx = i; mostrarInfo(); pintarProgreso(0, 0); }
      }
      if (e.data === 1) { errores = 0; estado(true); tituloDesdePlayer(); }
      else if (e.data === 2) estado(false);
      else if (e.data === 0) { estado(false); if (!listaId) siguiente(); }
    }
    function onError() {
      estado(false);
      if (!quiereSonar) return;
      errores++;
      ultimoError = Date.now();
      toast(`“${actual().titulo || "Esta canción"}” no se puede reproducir aquí. Ábrela en YouTube con ↗`, 5000);
      if (errores < Math.max(canciones.length, 1)) setTimeout(siguiente, 2500);
    }
    function cargarYoutube() {
      if (!listaId && !canciones.some((c) => c.yt)) return;
      if (listaId) avisoLista("Cargando nuestras canciones…");
      const crear = () => {
        const opciones = {
          width: "100%",
          height: "100%",
          playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
          events: { onReady, onStateChange, onError }
        };
        if (listaId) Object.assign(opciones.playerVars, { listType: "playlist", list: listaId });
        else opciones.videoId = (actual().yt ? actual() : canciones.find((c) => c.yt)).yt;
        yt = new window.YT.Player("yt-player", opciones);
      };
      if (window.YT && window.YT.Player) { crear(); return; }
      const previo = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (previo) previo(); crear(); };
      document.head.append(el("script", { src: "https://www.youtube.com/iframe_api" }));
    }
    setInterval(() => {
      if (ytListo && esYt() && sonando) pintarProgreso(yt.getCurrentTime(), yt.getDuration());
    }, 500);

    // --- Archivos propios ---
    audio.addEventListener("play", () => { if (!esYt()) estado(true); });
    audio.addEventListener("pause", () => { if (!esYt()) estado(false); });
    audio.addEventListener("ended", () => siguiente());
    audio.addEventListener("timeupdate", () => { if (!esYt()) pintarProgreso(audio.currentTime, audio.duration); });
    audio.addEventListener("error", () => {
      if (esYt() || !audio.getAttribute("src")) return;
      estado(false);
      toast(`🎵 No encuentro el archivo: ${actual().archivo}`);
    });

    // --- Controles ---
    function reproducir(avisar = true) {
      quiereSonar = true;
      const c = actual();
      if (esYt()) {
        audio.pause();
        if (!ytListo) { ytPendiente = true; return; }
        if (listaId) yt.playVideo();
        else {
          const v = yt.getVideoData && yt.getVideoData().video_id;
          if (v !== c.yt) yt.loadVideoById(c.yt); else yt.playVideo();
        }
        // En algunos celulares YouTube exige tocar el video la primera vez
        if (avisar) setTimeout(() => {
          const st = yt.getPlayerState();
          if (quiereSonar && st !== 1 && st !== 3 && Date.now() - ultimoError > 4000) toast("Toca el video para que empiece la música 🎵");
        }, 3500);
      } else {
        if (ytListo) yt.pauseVideo();
        if (audio.getAttribute("src") !== c.archivo) audio.src = c.archivo;
        audio.play().catch(() => toast("Toca de nuevo para escuchar nuestra canción 🎵"));
      }
    }
    function pausar() {
      ytPendiente = false;
      quiereSonar = false;
      if (esYt()) { if (ytListo) yt.pauseVideo(); }
      else audio.pause();
      estado(false);
    }
    function alternar() { (sonando || ytPendiente) ? pausar() : reproducir(); }
    function ir(i) {
      const n = canciones.length;
      if (!n) return;
      const j = ((i % n) + n) % n;
      if (listaId) {
        if (!ytListo) return;
        quiereSonar = true;
        idx = j;
        yt.playVideoAt(j);
        mostrarInfo();
        pintarProgreso(0, 0);
        return;
      }
      pausar();
      idx = j;
      mostrarInfo();
      pintarProgreso(0, 0);
      reproducir();
    }
    function siguiente() {
      if (listaId) { if (ytListo) { quiereSonar = true; yt.nextVideo(); } return; }
      if (m.aleatorio && canciones.length > 2) {
        let j = idx;
        while (j === idx) j = Math.floor(Math.random() * canciones.length);
        ir(j);
      } else ir(idx + 1);
    }
    function anterior() {
      if (listaId) { if (ytListo) { quiereSonar = true; yt.previousVideo(); } return; }
      ir(idx - 1);
    }

    $("#btn-play").addEventListener("click", alternar);
    $("#fab-musica").addEventListener("click", alternar);
    $("#btn-prev").addEventListener("click", anterior);
    $("#btn-next").addEventListener("click", siguiente);
    $("#barra").addEventListener("click", (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const f = (e.clientX - r.left) / r.width;
      if (esYt()) { if (ytListo && yt.getDuration()) yt.seekTo(f * yt.getDuration(), true); }
      else if (audio.duration) audio.currentTime = f * audio.duration;
    });

    if (!listaId) pintarLista();
    mostrarInfo();
    cargarYoutube();
    if (!listaId) completarTitulos();

    return {
      activa: true,
      alAbrir() { if (m.reproducirAlAbrir !== false) reproducir(); }
    };
  }

  /* ---------- Videos (opcional) ---------- */
  function iniciarVideos() {
    const lista = C.videos || [];
    if (!lista.length) return;
    $("#videos").hidden = false;
    const grid = $("#videos-grid");
    lista.forEach((v) => {
      const id = idYoutube(v.youtube);
      const media = id
        ? el("iframe", {
            src: `https://www.youtube-nocookie.com/embed/${id}`,
            title: v.titulo || "Video",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "",
            loading: "lazy"
          })
        : el("video", { src: v.archivo, poster: v.portada, controls: "", preload: "metadata", playsinline: "" });
      grid.append(el("figure", { class: "video-card", "data-reveal": "" },
        el("div", { class: "video-marco" }, media),
        v.titulo ? el("figcaption", {}, v.titulo) : null));
    });
  }

  /* ---------- Cierre ---------- */
  function iniciarFinal() {
    const f = C.final || {};
    const marco = $("#final-foto");
    marco.append(crearImg(f.foto, "Nuestra foto especial", 4, "retrato", () => marco.remove()));
    $("#final-titulo").textContent = f.titulo || "";
    $("#final-fecha").textContent = f.fecha || "";
    $("#final-fecha-texto").textContent = f.fechaTexto || "";
    $("#final-mensaje").textContent = f.mensaje || "";
    $("#final-firma").textContent = f.firma || "";
    $("#final-nombre").textContent = f.nombre || "";
    const btn = $("#btn-abrazo");
    btn.textContent = f.boton || "Recibe un abrazo gigante 🤗";
    btn.addEventListener("click", () => {
      Confeti.grande();
      toast(f.mensajeBoton || "Abrazo enviado 💞");
    });
  }

  /* ---------- Corazón (forma compartida por los efectos) ---------- */
  const HEART = typeof Path2D !== "undefined"
    ? new Path2D("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")
    : null;
  function dibujarCorazon(ctx, x, y, s, color, alpha, rot = 0) {
    if (!HEART || alpha <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const k = s / 24;
    ctx.scale(k, k);
    ctx.translate(-12, -12);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fill(HEART);
    ctx.restore();
  }

  function lienzo(cv) {
    const ctx = cv.getContext("2d");
    const tam = { W: 0, H: 0 };
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      tam.W = window.innerWidth;
      tam.H = window.innerHeight;
      cv.width = tam.W * dpr;
      cv.height = tam.H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    window.addEventListener("resize", ajustar);
    return { ctx, tam };
  }

  /* ---------- Confeti ---------- */
  const Confeti = (() => {
    const { ctx, tam } = lienzo($("#confeti"));
    const COLORES = ["#e0457b", "#ff8fb0", "#c2185b", "#f8d7e0", "#d4af37", "#ffffff", "#b3123f"];
    const parts = [];
    let corriendo = false;
    let ultimo = 0;

    function lanzar(x, y, n, soloCorazones) {
      if (reduceMotion || !efectos.confeti) return;
      const fuerte = n > 40;
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const v = (fuerte ? 220 : 120) + Math.random() * (fuerte ? 420 : 220);
        const r = Math.random();
        parts.push({
          x, y,
          vx: Math.cos(ang) * v,
          vy: Math.sin(ang) * v - (fuerte ? 260 : 140),
          s: 6 + Math.random() * 9,
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 10,
          c: COLORES[(Math.random() * COLORES.length) | 0],
          forma: soloCorazones || r < 0.45 ? "h" : r < 0.75 ? "r" : "c",
          vida: 0,
          dur: 1.6 + Math.random() * 1.4
        });
      }
      if (!corriendo) {
        corriendo = true;
        ultimo = performance.now();
        requestAnimationFrame(frame);
      }
    }

    function frame(t) {
      const dt = Math.min((t - ultimo) / 1000, 0.05);
      ultimo = t;
      ctx.clearRect(0, 0, tam.W, tam.H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vida += dt;
        p.vy += 480 * dt;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const a = 1 - p.vida / p.dur;
        if (a <= 0 || p.y > tam.H + 40) { parts.splice(i, 1); continue; }
        if (p.forma === "h") {
          dibujarCorazon(ctx, p.x, p.y, p.s * 1.7, p.c, a, p.rot * 0.15);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = a;
          ctx.fillStyle = p.c;
          if (p.forma === "r") ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
          else { ctx.beginPath(); ctx.arc(0, 0, p.s / 3, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        }
      }
      if (parts.length) requestAnimationFrame(frame);
      else { corriendo = false; ctx.clearRect(0, 0, tam.W, tam.H); }
    }

    function grande() {
      lanzar(tam.W * 0.2, tam.H * 0.65, 55);
      setTimeout(() => lanzar(tam.W * 0.8, tam.H * 0.65, 55), 220);
      setTimeout(() => lanzar(tam.W * 0.5, tam.H * 0.45, 65), 440);
    }
    return { lanzar, grande };
  })();

  /* ---------- Pétalos, corazones y brillos de fondo ---------- */
  function iniciarEfectosFondo() {
    if (reduceMotion || (!efectos.petalos && !efectos.corazones && !efectos.brillos)) return;
    const { ctx, tam } = lienzo($("#fx"));
    const R = (a, b) => a + Math.random() * (b - a);
    const movil = tam.W < 700;
    const COL_PETALO = ["#f7c1d0", "#f3a6bc", "#fbd5df", "#e98aa6", "#f9e0e6"];
    const COL_CORAZON = ["#e0457b", "#ff6f91", "#c2185b", "#f48fb1"];
    const parts = [];

    const petalo = (inicial) => ({
      t: "p", x: R(0, tam.W), y: inicial ? R(-tam.H, tam.H) : R(-60, -20),
      s: R(7, 13), vy: R(20, 42), vx: R(-10, 14), rot: R(0, 6.28), vr: R(-1, 1),
      fase: R(0, 6.28), c: COL_PETALO[(Math.random() * COL_PETALO.length) | 0], a: R(0.45, 0.8)
    });
    const corazon = () => ({
      t: "h", x: R(0, tam.W), y: tam.H + 20, s: R(10, 20), vy: R(28, 60),
      fase: R(0, 6.28), c: COL_CORAZON[(Math.random() * COL_CORAZON.length) | 0], a: R(0.25, 0.55)
    });
    const brillo = () => ({ t: "b", x: R(0, tam.W), y: R(0, tam.H), s: R(1, 2.2), vida: 0, dur: R(3, 7) });

    if (efectos.petalos) for (let i = 0; i < (movil ? 8 : 15); i++) parts.push(petalo(true));
    if (efectos.brillos) for (let i = 0; i < (movil ? 10 : 22); i++) { const b = brillo(); b.vida = R(0, b.dur); parts.push(b); }

    function dibujarPetalo(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.55 + 0.45 * Math.sin(p.fase * 1.5));
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
      ctx.fill();
      ctx.restore();
    }
    function dibujarBrillo(p, a, noche) {
      if (a <= 0) return;
      const col = noche ? "255,236,200" : "205,160,80";
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.s * 6);
      g.addColorStop(0, `rgba(${col},.8)`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, p.s * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = noche ? "#fff6e0" : "#e9c77f";
      const L = p.s * 4;
      ctx.beginPath();
      ctx.moveTo(0, -L);
      ctx.quadraticCurveTo(0, 0, L, 0);
      ctx.quadraticCurveTo(0, 0, 0, L);
      ctx.quadraticCurveTo(0, 0, -L, 0);
      ctx.quadraticCurveTo(0, 0, 0, -L);
      ctx.fill();
      ctx.restore();
    }

    let ultimo = performance.now();
    let acum = 0;
    function frame(ahora) {
      const dt = Math.min((ahora - ultimo) / 1000, 0.05);
      ultimo = ahora;
      ctx.clearRect(0, 0, tam.W, tam.H);
      const noche = document.documentElement.dataset.theme === "night";

      // Con la música sonando, suben más corazones
      if (efectos.corazones) {
        acum += dt;
        const cada = document.body.classList.contains("sonando") ? 0.8 : 2.6;
        if (acum > cada) {
          acum = 0;
          if (parts.filter((p) => p.t === "h").length < (movil ? 6 : 12)) parts.push(corazon());
        }
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (p.t === "p") {
          p.fase += dt;
          p.y += p.vy * dt;
          p.x += (p.vx + Math.sin(p.fase) * 18) * dt;
          p.rot += p.vr * dt;
          if (p.y > tam.H + 30) Object.assign(p, petalo(false));
          dibujarPetalo(p);
        } else if (p.t === "h") {
          p.fase += dt * 2;
          p.y -= p.vy * dt;
          p.x += Math.sin(p.fase) * 0.4;
          if (p.y < -30) { parts.splice(i, 1); continue; }
          const alpha = p.a * Math.min(1, (tam.H - p.y) / 150) * Math.max(0, Math.min(1, p.y / (tam.H * 0.5)));
          dibujarCorazon(ctx, p.x, p.y, p.s, p.c, alpha);
        } else {
          p.vida += dt;
          if (p.vida > p.dur) Object.assign(p, brillo());
          dibujarBrillo(p, Math.sin((Math.PI * p.vida) / p.dur) * (noche ? 0.85 : 0.5), noche);
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Corazoncitos al tocar ---------- */
  function iniciarCorazonesAlTocar() {
    if (reduceMotion || !efectos.corazonesAlTocar) return;
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, a, .lightbox, .lector, .carrusel-stage, .barra, .intro, iframe, video")) return;
      for (let i = 0; i < 3; i++) {
        const h = el("span", { class: "corazon-click", "aria-hidden": "true" }, "❤");
        h.style.left = e.clientX + "px";
        h.style.top = e.clientY + "px";
        h.style.fontSize = 12 + Math.random() * 12 + "px";
        h.style.setProperty("--dx", Math.random() * 60 - 30 + "px");
        h.style.animationDelay = i * 0.08 + "s";
        document.body.append(h);
        setTimeout(() => h.remove(), 1600);
      }
    });
  }

  function iniciarNav() {
    const nav = $("#nav");
    const f = () => nav.classList.toggle("solida", window.scrollY > window.innerHeight * 0.6);
    f();
    window.addEventListener("scroll", f, { passive: true });
  }

  /* ---------- Bienvenida: abrir el sobre ---------- */
  function iniciarIntro(musica) {
    const intro = $("#intro");
    const cfg = C.intro || {};
    const comenzar = () => {
      arrancarHero();
      if (musica.activa) $("#fab-musica").classList.add("visible");
    };
    if (cfg.mostrar === false) { intro.remove(); comenzar(); return; }

    document.body.classList.add("bloqueado");
    $("#intro-texto").textContent = cfg.texto || "Tengo algo especial para ti…";
    $("#intro-btn").textContent = cfg.boton || "Abrir mi carta ❤️";

    const abrir = () => {
      if (intro.classList.contains("abriendo")) return;
      intro.classList.add("abriendo");
      musica.alAbrir(); // se inicia aquí porque el navegador exige un toque del usuario
      setTimeout(() => {
        intro.classList.add("oculto");
        document.body.classList.remove("bloqueado");
        comenzar();
        Confeti.lanzar(window.innerWidth / 2, window.innerHeight / 2, 30, true);
      }, 1500);
      setTimeout(() => intro.remove(), 2800);
    };
    $("#intro-btn").addEventListener("click", abrir);
    const sobre = $(".sobre");
    sobre.addEventListener("click", abrir);
    sobre.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
    $("#intro-btn").focus({ preventScroll: true });
  }

  /* ---------- Arranque ---------- */
  rellenarTextos();
  iniciarModo();
  prepararHero();
  iniciarContador();
  iniciarCarta();
  iniciarAgenda();
  iniciarLightbox();
  iniciarRazones();
  const musica = iniciarMusica();
  iniciarVideos();
  iniciarFinal();
  iniciarRevelado();
  sincronizarSecciones();
  Promise.all([iniciarCarruseles(), iniciarGaleria()]).then(sincronizarSecciones);
  iniciarNav();
  iniciarEfectosFondo();
  iniciarCorazonesAlTocar();
  iniciarIntro(musica);
})();
