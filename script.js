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
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), 3400);
  }

  /* ---------- Marco de reemplazo cuando falta una foto ---------- */
  const PALETAS = [["#f9d3de", "#e58fa8"], ["#fbe1d4", "#e3969f"], ["#f1d6ef", "#c687b6"], ["#fde4e1", "#d9667f"], ["#f6e3c8", "#d7a15f"]];
  const FORMAS = { retrato: [800, 1000], paisaje: [1600, 1000], cuadrada: [900, 900], alta: [800, 1200] };
  const escXml = (s) => String(s).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;" }[c]));

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

  function crearImg(src, alt, seed = 0, forma = "retrato") {
    const [w, h] = FORMAS[forma] || FORMAS.retrato;
    const img = new Image();
    img.alt = alt || "";
    img.decoding = "async";
    img.loading = "lazy";
    img.draggable = false;
    if (!src) { img.src = placeholder("", w, h, seed); return img; }
    img.onerror = () => { img.onerror = null; img.src = placeholder(src, w, h, seed); };
    img.src = src;
    return img;
  }

  const ICONO_IZQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const ICONO_DER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

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

  /* ---------- 1. Portada ---------- */
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
  function parseFecha(str) {
    const [f, t = "00:00"] = String(str || "").trim().split(/[T ]/);
    const [Y, M, D] = f.split("-").map(Number);
    const [hh = 0, mm = 0] = t.split(":").map(Number);
    return new Date(Y, (M || 1) - 1, D || 1, hh, mm);
  }

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
    const pad = (n) => String(n).padStart(2, "0");
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

  /* ---------- 2. Carta con escritura automática ---------- */
  function iniciarCarta() {
    const c = C.carta || {};
    const papel = $("#papel");
    const cont = $("#carta-contenido");
    $("#carta-para").textContent = c.para || "";
    $("#carta-fecha").textContent = c.fecha || "";
    $("#carta-firma").textContent = c.firma || "";

    const bloques = [
      { cls: "carta-saludo", texto: c.saludo },
      ...(c.parrafos || []).map((t) => ({ cls: "", texto: t })),
      { cls: "carta-despedida", texto: c.despedida }
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
    const vel = c.velocidadEscritura || 32;
    const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

    async function escribir() {
      for (const n of nodos) {
        n.p.classList.add("escribiendo");
        for (let i = 1; i <= n.chars.length; i++) {
          if (saltar) return terminar();
          n.typed.textContent = n.chars.slice(0, i).join("");
          n.ghost.textContent = n.chars.slice(i).join("");
          const ch = n.chars[i - 1];
          await esperar(/[.!?…]/.test(ch) ? vel * 9 : /[,;:]/.test(ch) ? vel * 5 : vel);
        }
        n.p.classList.remove("escribiendo");
        await esperar(vel * 12);
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
    }, { threshold: 0.35 });
    io.observe(papel);
  }

  /* ---------- 3. Carruseles ---------- */
  function iniciarCarruseles() {
    const cont = $("#carruseles");
    (C.carruseles || []).forEach((car, ci) => cont.append(crearCarrusel(car, ci)));
  }

  function crearCarrusel(car, ci) {
    const fotos = car.fotos || [];
    const raiz = el("div", { class: "carrusel", "data-reveal": "" });
    if (car.titulo && ci > 0 || car.subtitulo) {
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

    // Movimiento automático
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

    // Deslizar con el dedo / mouse
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

    // Altura del escenario según la polaroid más alta
    const ajustarAltura = () => {
      const h = Math.max(0, ...slides.map((s) => s.offsetHeight));
      if (h) stage.style.height = (h + 16) + "px";
    };
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(ajustarAltura);
      slides.forEach((s) => ro.observe(s));
    }
    window.addEventListener("resize", ajustarAltura);

    raiz.append(stage, el("div", { class: "carrusel-controles" }, prev, dots, next));
    pintar();
    reiniciar();
    return raiz;
  }

  /* ---------- 4. Línea del tiempo ---------- */
  function iniciarLineaTiempo() {
    const ol = $("#timeline");
    (C.lineaDeTiempo || []).forEach((ev, i) => {
      ol.append(el("li", { class: "tl-item", "data-reveal": "" },
        el("span", { class: "tl-punto", "aria-hidden": "true" }, ev.icono || "❤"),
        el("article", { class: "tl-card" },
          ev.foto === null ? null : el("div", { class: "tl-foto" }, crearImg(ev.foto, ev.titulo, i + 2, "paisaje")),
          el("div", { class: "tl-cuerpo" },
            el("span", { class: "tl-fecha" }, ev.fecha || ""),
            el("h3", {}, ev.titulo || ""),
            el("p", {}, ev.descripcion || "")))));
    });
  }

  /* ---------- 5. Galería con filtros ---------- */
  function iniciarGaleria() {
    const g = C.galeria || {};
    const filtros = $("#filtros");
    const grid = $("#galeria-grid");
    const formas = ["retrato", "cuadrada", "alta", "paisaje", "retrato", "alta"];

    const items = (g.fotos || []).map((f, i) => {
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

    const cats = [{ id: "todas", nombre: "✨ Todas" }, ...(g.categorias || [])];
    cats.forEach((c) => {
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

  /* ---------- 6. Razones ---------- */
  function iniciarRazones() {
    const R = C.razones || [];
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
      let pendientes = tarjetas.map((_, i) => i).filter((i) => !vistas.has(i));
      if (!pendientes.length) {
        if (mostradas >= R.length) { toast("Ya las descubriste todas… pero siempre habrá más ❤️"); return; }
        const desde = mostradas;
        mostrarHasta(mostradas + PASO);
        pendientes = tarjetas.map((_, i) => i).slice(desde);
      }
      const i = pendientes[Math.floor(Math.random() * pendientes.length)];
      const t = tarjetas[i];
      t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      t.classList.add("destacada");
      setTimeout(() => { t.classList.remove("destacada"); voltear(i); }, 750);
    });

    mostrarHasta(PASO);
    actualizar();
  }

  /* ---------- 7. Música ---------- */
  function iniciarMusica() {
    const m = C.musica || {};
    const audio = $("#audio");
    let disponible = Boolean(m.archivo);

    $("#rep-dedicatoria").textContent = m.dedicatoria || "";
    $("#rep-titulo").textContent = m.titulo || "";
    $("#rep-artista").textContent = m.artista || "";
    $("#vinilo-label").append(crearImg(m.portada, "Portada de la canción", 3, "cuadrada"));

    if (m.archivo) {
      audio.src = m.archivo;
      audio.loop = m.repetir !== false;
      audio.volume = typeof m.volumen === "number" ? Math.min(1, Math.max(0, m.volumen)) : 0.6;
    }
    audio.addEventListener("error", () => { disponible = false; });

    const toggle = () => {
      if (!disponible) {
        toast(`🎵 Agrega tu canción en: ${m.archivo || "musica/nuestra-cancion.mp3"}`);
        return;
      }
      if (audio.paused) audio.play().catch(() => toast("Toca de nuevo para escuchar nuestra canción 🎵"));
      else audio.pause();
    };
    $("#btn-play").addEventListener("click", toggle);
    $("#fab-musica").addEventListener("click", toggle);

    audio.addEventListener("play", () => document.body.classList.add("sonando"));
    audio.addEventListener("pause", () => document.body.classList.remove("sonando"));
    audio.addEventListener("ended", () => document.body.classList.remove("sonando"));

    const fmt = (s) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
    audio.addEventListener("loadedmetadata", () => { $("#tiempo-total").textContent = fmt(audio.duration); });
    audio.addEventListener("timeupdate", () => {
      $("#barra-progreso").style.width = ((audio.currentTime / audio.duration) * 100 || 0) + "%";
      $("#tiempo-actual").textContent = fmt(audio.currentTime);
    });
    $("#barra").addEventListener("click", (e) => {
      if (!audio.duration) return;
      const r = e.currentTarget.getBoundingClientRect();
      audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    });

    return {
      alAbrir() {
        if (disponible && m.reproducirAlAbrir !== false) audio.play().catch(() => {});
      }
    };
  }

  /* ---------- Videos (opcional) ---------- */
  function iniciarVideos() {
    const lista = C.videos || [];
    if (!lista.length) return;
    $("#videos").hidden = false;
    $("#nav-videos").parentElement.hidden = false;
    const grid = $("#videos-grid");
    lista.forEach((v) => {
      const media = v.youtube
        ? el("iframe", {
            src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube)}`,
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

  /* ---------- 9. Cierre ---------- */
  function iniciarFinal() {
    const f = C.final || {};
    $("#final-foto").append(crearImg(f.foto, "Nuestra foto especial", 4));
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
      if (e.target.closest("button, a, .lightbox, .carrusel-stage, .barra, .intro, iframe, video")) return;
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

  /* ---------- Aparición al hacer scroll y barra de navegación ---------- */
  function iniciarRevelado() {
    const els = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((e) => io.observe(e));
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
      $("#fab-musica").classList.add("visible");
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
  iniciarCarruseles();
  iniciarLineaTiempo();
  iniciarGaleria();
  iniciarLightbox();
  iniciarRazones();
  const musica = iniciarMusica();
  iniciarVideos();
  iniciarFinal();
  iniciarRevelado();
  iniciarNav();
  iniciarEfectosFondo();
  iniciarCorazonesAlTocar();
  iniciarIntro(musica);
})();
