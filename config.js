/* ==========================================================================
   ✏️  CONFIGURACIÓN DE TU PÁGINA ROMÁNTICA
   --------------------------------------------------------------------------
   Aquí cambias TODO: nombres, fechas, textos, fotos, carruseles, videos y música.
   No necesitas tocar index.html ni script.js.

   • Las fotos van en la carpeta  /fotos   → ej: "fotos/viaje.jpg"
   • La canción va en la carpeta  /musica  → ej: "musica/cancion.mp3"
   • Los videos van en la carpeta /videos  → ej: "videos/playa.mp4"
   • Si una foto todavía no existe, la página muestra un marco rosado con
     el nombre del archivo que falta, para que sepas cuál agregar.
   • Cuida las comas: cada elemento de una lista termina en coma.
   ========================================================================== */

window.CONFIG = {

  /* ---------- 💑 NOMBRES ---------- */
  pareja: {
    tuNombre: "Tu nombre",
    suNombre: "Mi amor",
    marca: "Nosotros ❤"          // texto pequeño arriba a la izquierda
  },

  /* ---------- 📅 FECHA EN QUE EMPEZÓ TODO ----------
     Formato: "AAAA-MM-DD" o "AAAA-MM-DD HH:MM"                        */
  fechaInicio: "2023-02-14 20:00",

  /* ---------- 🌙 MODO NOCTURNO ----------
     true = la página abre en "Experiencia romántica nocturna"          */
  modoNocturnoPorDefecto: false,

  /* ---------- 💌 PANTALLA DE BIENVENIDA (sobre que se abre) ---------- */
  intro: {
    mostrar: true,
    texto: "Tengo algo especial para ti…",
    boton: "Abrir mi carta ❤️"
  },

  /* ---------- 1. PORTADA ---------- */
  hero: {
    foto: "fotos/portada.jpg",   // ideal: foto horizontal, 1920px de ancho
    titulo: "Mi historia favorita eres tú ❤️",
    subtitulo: "Cada momento contigo se convierte en un recuerdo que quiero guardar para siempre.",
    boton: "Ver nuestra historia ❤️"
  },

  /* ---------- 2. CARTA DE AMOR ---------- */
  carta: {
    para: "Para: Mi amor",
    fecha: "Escrita con el corazón",
    saludo: "Mi amor:",
    parrafos: [
      "Hay personas que llegan a tu vida y lo cambian todo sin hacer ruido. Tú llegaste así: suave, bonito, como llega la luz de la mañana. Y desde entonces, nada ha vuelto a ser igual.",
      "Gracias por cada risa compartida, por los abrazos que curan, por las conversaciones hasta tarde y por esos silencios que contigo nunca son incómodos. Gracias por quedarte, incluso en los días difíciles.",
      "Quiero que sepas que eres mi lugar seguro, mi aventura favorita y la persona con la que quiero seguir escribiendo esta historia, página por página, por el resto de mi vida."
    ],
    despedida: "Te amo hoy, mañana y todos los días que vienen.",
    firma: "Con todo mi amor, Tu nombre",
    efectoEscritura: true,       // false = el texto aparece completo de una vez
    velocidadEscritura: 32       // milisegundos por letra (más alto = más lento)
  },

  /* ---------- 3. CARRUSELES ----------
     Puedes crear TODOS los carruseles que quieras: copia un bloque { ... }
     completo y pégalo debajo, separado por una coma.                   */
  carruseles: [
    {
      titulo: "Nuestros recuerdos",
      subtitulo: "Pequeños pedazos de nuestra historia",
      intervalo: 5000,           // cada cuánto cambia de foto (ms)
      fotos: [
        { foto: "fotos/recuerdo-1.jpg", titulo: "Nuestra primera cita ☕", fecha: "14 de febrero, 2023", lugar: "Aquel café", descripcion: "Los nervios, las risas y la certeza de que algo bonito empezaba." },
        { foto: "fotos/recuerdo-2.jpg", titulo: "Nuestro primer viaje juntos ❤️", fecha: "Junio, 2023", lugar: "La playa", descripcion: "El mar, el atardecer y tú. No necesitaba nada más." },
        { foto: "fotos/recuerdo-3.jpg", titulo: "Una tarde cualquiera (y perfecta)", fecha: "Septiembre, 2023", lugar: "Nuestro parque", descripcion: "Descubrí que los mejores planes son los que hago contigo." },
        { foto: "fotos/recuerdo-4.jpg", titulo: "Nuestra primera Navidad", fecha: "Diciembre, 2023", lugar: "En casa", descripcion: "Luces, chocolate caliente y el mejor regalo: tenerte." },
        { foto: "fotos/recuerdo-5.jpg", titulo: "Aventura en la montaña", fecha: "Abril, 2024", lugar: "El mirador", descripcion: "Llegamos a la cima y lo más lindo de la vista eras tú." },
        { foto: "fotos/recuerdo-6.jpg", titulo: "Celebrando lo nuestro", fecha: "Febrero, 2025", lugar: "Nuestro aniversario", descripcion: "Un año más eligiéndonos, y los que faltan." }
      ]
    }
    // , { titulo: "Nuestro viaje a …", subtitulo: "…", fotos: [ { foto: "fotos/…jpg", titulo: "…", fecha: "…", lugar: "…", descripcion: "…" } ] }
  ],

  /* ---------- 4. LÍNEA DEL TIEMPO ---------- */
  lineaDeTiempo: [
    { icono: "✨", foto: "fotos/historia-1.jpg", fecha: "Enero, 2023",   titulo: "El día que nos conocimos", descripcion: "Una mirada, una sonrisa y una conversación que no quería que terminara." },
    { icono: "☕", foto: "fotos/historia-2.jpg", fecha: "Febrero, 2023", titulo: "Nuestra primera cita",      descripcion: "Me temblaban las manos, pero el corazón ya sabía lo que quería." },
    { icono: "✈️", foto: "fotos/historia-3.jpg", fecha: "Junio, 2023",   titulo: "Nuestro primer viaje",      descripcion: "Descubrimos lugares nuevos y descubrimos que juntos somos el mejor equipo." },
    { icono: "🌟", foto: "fotos/historia-4.jpg", fecha: "2024",          titulo: "Momentos inolvidables",     descripcion: "Risas, abrazos, aventuras y días simples que se volvieron eternos." },
    { icono: "❤️", foto: "fotos/historia-5.jpg", fecha: "Hoy",           titulo: "Nuestro presente",          descripcion: "Aquí estamos: más unidos que nunca y con mil sueños por cumplir." }
  ],

  /* ---------- 5. GALERÍA ----------
     "categoria" debe coincidir con un "id" de la lista de categorías.  */
  galeria: {
    categorias: [
      { id: "aventuras",  nombre: "📸 Aventuras juntos" },
      { id: "romanticos", nombre: "❤️ Momentos románticos" },
      { id: "divertidos", nombre: "😊 Momentos divertidos" },
      { id: "viajes",     nombre: "🌎 Viajes" }
    ],
    fotos: [
      { foto: "fotos/galeria-1.jpg",  categoria: "romanticos", titulo: "Ese abrazo" },
      { foto: "fotos/galeria-2.jpg",  categoria: "aventuras",  titulo: "Sin miedo a nada" },
      { foto: "fotos/galeria-3.jpg",  categoria: "viajes",     titulo: "Kilómetros de amor" },
      { foto: "fotos/galeria-4.jpg",  categoria: "divertidos", titulo: "Nuestras caras locas" },
      { foto: "fotos/galeria-5.jpg",  categoria: "romanticos", titulo: "Atardecer contigo" },
      { foto: "fotos/galeria-6.jpg",  categoria: "viajes",     titulo: "Nuevo destino, mismo amor" },
      { foto: "fotos/galeria-7.jpg",  categoria: "aventuras",  titulo: "Explorando juntos" },
      { foto: "fotos/galeria-8.jpg",  categoria: "divertidos", titulo: "Risas que no se olvidan" },
      { foto: "fotos/galeria-9.jpg",  categoria: "romanticos", titulo: "Solo tú y yo" },
      { foto: "fotos/galeria-10.jpg", categoria: "viajes",     titulo: "Mapa de nuestros sueños" },
      { foto: "fotos/galeria-11.jpg", categoria: "divertidos", titulo: "Modo payasos: activado" },
      { foto: "fotos/galeria-12.jpg", categoria: "aventuras",  titulo: "La próxima aventura" }
    ]
  },

  /* ---------- 6. RAZONES POR LAS QUE TE AMO ---------- */
  razonesPorPagina: 12,
  razones: [
    "Porque haces mis días mejores ❤️",
    "Porque tu sonrisa ilumina cualquier lugar",
    "Porque contigo puedo ser quien realmente soy",
    "Porque me escuchas incluso cuando no digo nada",
    "Porque tus abrazos son mi lugar favorito",
    "Porque me haces reír hasta que me duele la panza",
    "Porque crees en mí incluso cuando yo dudo",
    "Porque cada día a tu lado es una aventura",
    "Porque tu voz me calma",
    "Porque me miras como nadie me ha mirado",
    "Porque haces que lo simple sea especial",
    "Porque tu forma de ser me inspira",
    "Porque me cuidas sin que te lo pida",
    "Porque eres mi paz en medio del caos",
    "Porque contigo el tiempo vuela",
    "Porque tus besos detienen el mundo",
    "Porque recuerdas los pequeños detalles",
    "Porque me haces querer ser mejor persona",
    "Porque tu risa es mi canción favorita",
    "Porque eres mi confidente y mi cómplice",
    "Porque me entiendes con solo una mirada",
    "Porque tus manos encajan perfecto con las mías",
    "Porque haces que los lunes sean soportables",
    "Porque tienes el corazón más bonito que conozco",
    "Porque me apoyas en cada sueño",
    "Porque contigo aprendí lo que es amar de verdad",
    "Porque tus mensajes me alegran el día",
    "Porque a tu lado siempre me siento en casa",
    "Porque bailas conmigo aunque no haya música",
    "Porque eres paciente conmigo",
    "Porque tu mirada tiene magia",
    "Porque me haces sentir especial todos los días",
    "Porque compartimos los mismos sueños",
    "Porque contigo las comidas saben mejor",
    "Porque eres valiente",
    "Porque me enseñas algo nuevo cada día",
    "Porque te preocupas por los que amas",
    "Porque tus locuras combinan con las mías",
    "Porque eres la primera persona a la que quiero contarle todo",
    "Porque haces que los días grises tengan color",
    "Porque tu sinceridad me da confianza",
    "Porque me das tranquilidad",
    "Porque me haces sentir el amor en cada detalle",
    "Porque tus ojos me cuentan historias",
    "Porque juntos somos un gran equipo",
    "Porque sabemos perdonarnos",
    "Porque siempre encuentras la forma de sorprenderme",
    "Porque tu energía es contagiosa",
    "Porque me encanta cómo dices mi nombre",
    "Porque eres mi persona favorita en el mundo",
    "Porque haces que cualquier plan sea perfecto",
    "Porque contigo hasta el silencio es cómodo",
    "Porque me das los mejores consejos",
    "Porque nunca finges ser alguien más",
    "Porque cada día agradezco la suerte de tenerte",
    "Porque me acompañas en las buenas y en las malas",
    "Porque tus defectos también me enamoran",
    "Porque sabes cómo animarme",
    "Porque me abrazas fuerte cuando más lo necesito",
    "Porque tu olor es mi favorito",
    "Porque contigo quiero construir un futuro",
    "Porque contigo aprendí a soñar en grande",
    "Porque eres increíblemente inteligente",
    "Porque tus ocurrencias me sacan carcajadas",
    "Porque tienes una bondad infinita",
    "Porque me respetas",
    "Porque celebras mis logros como si fueran tuyos",
    "Porque me das espacio para crecer",
    "Porque cada \"buenos días\" tuyo vale oro",
    "Porque me encanta verte feliz",
    "Porque a tu lado todo miedo se hace pequeño",
    "Porque tus detalles me derriten",
    "Porque llegaste justo cuando más te necesitaba",
    "Porque contigo cualquier lugar es el paraíso",
    "Porque me encanta hacer planes contigo",
    "Porque eres mi motivación",
    "Porque me aceptas tal como soy",
    "Porque tu amor me hace fuerte",
    "Porque tienes la sonrisa más bonita del universo",
    "Porque haces que cada día valga la pena",
    "Porque tus caricias me dan paz",
    "Porque juntos hemos superado todo",
    "Porque eres mi hogar",
    "Porque me encanta despertar pensando en ti",
    "Porque tus abrazos curan cualquier tristeza",
    "Porque te ríes de mis chistes malos",
    "Porque haces que lo difícil parezca fácil",
    "Porque contigo aprendí que el amor bonito existe",
    "Porque cada recuerdo contigo es un tesoro",
    "Porque haces latir mi corazón más rápido",
    "Porque tu ternura me desarma",
    "Porque me escuchas con el corazón",
    "Porque sé que siempre puedo contar contigo",
    "Porque eres mi sueño hecho realidad",
    "Porque me haces sentir que todo es posible",
    "Porque contigo quiero envejecer",
    "Porque cada día me enamoro más de ti",
    "Porque eres simplemente tú",
    "Porque no imagino mi vida sin ti",
    "Porque te amo hoy, mañana y siempre ❤️"
  ],

  /* ---------- 7. MÚSICA ---------- */
  musica: {
    archivo: "musica/nuestra-cancion.mp3",
    titulo: "Nuestra canción",
    artista: "Nombre del artista",
    dedicatoria: "Esta canción siempre me recuerda a ti",
    portada: "fotos/portada-cancion.jpg",   // imagen cuadrada para el disco
    volumen: 0.6,                            // de 0 a 1
    reproducirAlAbrir: true,                 // suena al abrir el sobre
    repetir: true
  },

  /* ---------- 🎬 VIDEOS (opcional) ----------
     La sección aparece sola cuando agregas al menos un video.
     - Archivo propio:  { archivo: "videos/playa.mp4", portada: "fotos/playa.jpg", titulo: "…" }
     - YouTube:         { youtube: "dQw4w9WgXcQ", titulo: "…" }   ← solo el código del enlace */
  videos: [
    // { archivo: "videos/nuestro-video.mp4", titulo: "Nuestro primer viaje en video" },
  ],

  /* ---------- 9. CIERRE ---------- */
  final: {
    foto: "fotos/final.jpg",
    titulo: "Gracias por ser mi persona favorita ❤️",
    fecha: "14 · 02 · 2023",
    fechaTexto: "El día que empezó lo más bonito de mi vida",
    mensaje: "No sé qué nos depare el futuro, pero sé que quiero vivirlo contigo. Gracias por existir, por elegirme y por hacer de cada día un recuerdo que vale la pena guardar.",
    firma: "Con todo mi amor, para siempre ❤️",
    nombre: "Tu nombre",
    boton: "Recibe un abrazo gigante 🤗",
    mensajeBoton: "Abrazo enviado con todo mi corazón 💞"
  },

  /* ---------- ✨ EFECTOS (true = activado, false = desactivado) ---------- */
  efectos: {
    petalos: true,           // pétalos cayendo
    corazones: true,         // corazones que suben (más seguido con música)
    brillos: true,           // destellos de luz
    corazonesAlTocar: true,  // corazoncitos donde tocas la pantalla
    confeti: true            // confeti al descubrir razones y en el final
  }
};
