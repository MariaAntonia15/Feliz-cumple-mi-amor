/* ==========================================================================
   ✏️  CONFIGURACIÓN DE TU PÁGINA ROMÁNTICA
   --------------------------------------------------------------------------
   Aquí cambias TODO: nombres, fechas, agenda, cartas, poemas, fotos,
   canciones y videos. No necesitas tocar index.html ni script.js.

   • Las fotos van en la carpeta  /fotos   → ej: "fotos/viaje.jpg"
   • Los videos van en la carpeta /videos  → ej: "videos/playa.mp4"
   • Si una foto no existe, simplemente no se muestra (la página se ve
     completa igual). Para ver dónde faltan fotos, pon
     mostrarFotosPendientes: true
   • Los textos largos (cartas y poemas) van entre comillas invertidas ` `
     y pueden tener varias líneas. **texto** = negrita, *texto* = cursiva.
   • Cuida las comas: cada elemento de una lista termina en coma.
   ========================================================================== */

window.CONFIG = {

  /* ---------- 💑 NOMBRES ---------- */
  pareja: {
    tuNombre: "María Antonia",
    suNombre: "Mi amor",
    marca: "Nosotros ❤"          // texto pequeño arriba a la izquierda
  },

  /* ---------- 📅 EL DÍA QUE NOS HICIMOS NOVIOS ----------
     Formato: "AAAA-MM-DD" o "AAAA-MM-DD HH:MM" (hora de 24 horas)      */
  fechaInicio: "2023-11-23 17:45",

  /* ---------- 🌙 MODO NOCTURNO ---------- */
  modoNocturnoPorDefecto: false,

  /* ---------- 📷 ÁLBUM DE GOOGLE FOTOS ----------
     Las fotos de este álbum compartido aparecen solas en la galería,
     el carrusel, la portada, el cierre y en los días de la agenda que
     tengan la misma fecha. GitHub revisa el álbum cada hora y guarda
     la lista en fotos-album.json (ver .github/workflows/fotos.yml).    */
  album: {
    enlace: "https://photos.app.goo.gl/jULrGdE69VDEHWq18",
    repositorio: "MariaAntonia15/Feliz-cumple-mi-amor",
    fotosPorPagina: 12,          // fotos visibles en la galería antes de "Ver más"
    fotosEnCarrusel: 12          // fotos al azar en el carrusel (si no hay recuerdo-N.jpg)
  },

  /* ---------- 📸 FOTOS QUE FALTAN ----------
     false = se esconden (para la versión final)
     true  = se muestra un marco rosado con el nombre del archivo que falta */
  mostrarFotosPendientes: false,

  /* ---------- 💌 PANTALLA DE BIENVENIDA (sobre que se abre) ---------- */
  intro: {
    mostrar: true,
    texto: "Tengo algo especial para ti…",
    boton: "Abrir mi carta ❤️"
  },

  /* ---------- PORTADA ---------- */
  hero: {
    foto: "fotos/portada.jpg",   // ideal: foto horizontal, 1920px de ancho
    titulo: "Mi historia favorita eres tú ❤️",
    subtitulo: "Cada momento contigo se convierte en un recuerdo que quiero guardar para siempre.",
    boton: "Ver nuestra historia ❤️"
  },

  /* ---------- CARTA PRINCIPAL (se escribe sola) ----------
     deLaAgenda: usa la carta de la agenda que tenga ese "id".          */
  carta: {
    para: "Para: mi amor",
    deLaAgenda: "enamoremos-otra-vez",
    firma: "María Antonia",
    efectoEscritura: true,       // false = el texto aparece completo de una vez
    velocidadEscritura: 22       // milisegundos por letra (más alto = más lento)
  },

  /* ---------- 📖 AGENDA DE MOMENTOS ----------
     Cada recuerdo es un bloque { ... }. Se ordenan solos por fecha.
     tipo:       "momento", "carta" o "poema"
     fecha:      "AAAA-MM-DD"  (también "AAAA-MM", "AAAA" o "hoy")
     fechaTexto: opcional, reemplaza la fecha visible (ej: "2020 – 2023")
     hora:       opcional, "17:45"
     foto:       opcional, "fotos/algo.jpg"
     destacado:  opcional, true = lo resalta                              */
  agenda: [
    { tipo: "momento", fecha: "2019-11-07", icono: "✨", titulo: "El día que nos conocimos",
      texto: "Ese día empezó todo, aunque todavía no lo sabíamos." },

    { tipo: "momento", fecha: "2020-04-09", icono: "💬", titulo: "El día que más hablamos",
      texto: "Fue uno de los días en que más interactuamos antes de ser pareja. Sin saberlo, ya estábamos escribiendo el comienzo de nuestra historia." },

    { tipo: "momento", fecha: "2020-11-08", icono: "🤍", titulo: "Volver a vernos",
      texto: "Llegó la pandemia y pasamos meses sin vernos, hasta este día en que por fin nos volvimos a encontrar." },

    { tipo: "momento", fecha: "2020-11-09", fechaTexto: "2020 – 2023", icono: "🌙", titulo: "El tiempo que nos perdimos",
      texto: "Después perdimos totalmente el rastro. Hoy pienso que la vida solo estaba esperando el momento justo para volver a juntarnos." },

    { tipo: "momento", fecha: "2023-08-19", icono: "📱", titulo: "Nos volvimos a encontrar",
      texto: "Comenzamos a conversar de nuevo, cada vez más seguido, como si el tiempo no hubiera pasado." },

    { tipo: "momento", fecha: "2023-08-20", icono: "☕", titulo: "Nuestra primera cita",
      texto: "Y al día siguiente, nuestra primera cita. Después vinieron muchas salidas más, tantas que no alcanzo a recordar todas las fechas." },

    { tipo: "momento", fecha: "2023-09-07", icono: "🌄", titulo: "El viaje a Jardín",
      texto: "Ahí decidí que me gustabas mucho. Y de ese viaje te traje la primera pulsera que te regalé." },

    { tipo: "momento", fecha: "2023-11-18", icono: "🌹", titulo: "Una rosa y mucha valentía",
      texto: "Pensé mucho en si aceptarías mis sentimientos. En un acto de valentía te di una rosa: no pude confesarte nada, pero al menos logré entregártela." },

    { tipo: "momento", fecha: "2023-11-23", hora: "17:45", icono: "❤️", titulo: "El día que dijiste que sí", destacado: true,
      texto: "Por fin te confesé mi amor y lo aceptaste de la forma más bonita. Todo lo que sentía era recíproco." },

    { tipo: "momento", fecha: "2024-11-23", icono: "🎂", titulo: "Nuestro primer aniversario",
      texto: "Un año eligiéndonos." },

    { tipo: "carta", fecha: "2025-11", fechaTexto: "Casi dos años", titulo: "Desde aquel día",
      texto: `
Desde aquel día en que nuestras vidas se cruzaron, entendí algo que el Principito decía con tanta verdad: que uno reconoce a su rosa no porque sea perfecta, sino porque se convierte en única.
Tú te volviste mi rosa sin que yo te lo pidiera y sin que tú lo buscaras; simplemente pasó, de la manera más profunda y silenciosa que pasan las cosas importantes.

En estos casi dos años he aprendido a quererte como se quiere lo que se cuida: con paciencia, con presencia, con respeto y con esa forma tranquila de caminar juntos incluso cuando el mundo está alborotado.
A tu manera –esa mezcla tuya de fuerza, orgullo y corazón enorme que intentas disimular– me has demostrado que este camino vale la pena.

Hoy quiero darte mi respuesta desde la calma y desde el amor:
**Sí. Yo quiero seguir contigo. Quiero que sigamos construyendo esto con la misma intención con la que se riega una flor que uno ha elegido todos los días.**

Gracias por ser mi compañía, mi casa en medio del ruido y la persona con la que aún me sorprendo soñando cosas que nunca imaginé.
Si tú también quieres, aquí estoy… lista para otros capítulos.
Contigo, y solo contigo, mi rosa.
` },

    { tipo: "carta", fecha: "2025-11-23", titulo: "Dos años: te vuelvo a elegir", destacado: true,
      texto: `
Mi amor… hoy que cumplimos dos años, quiero darte mi respuesta con calma, con cariño y con toda la sinceridad que te mereces.

He pensado en lo que hablamos, en cómo somos, en lo que hemos construido. Y quiero que lo sepas con claridad: **quiero seguir contigo**. No por costumbre, ni por miedo, ni porque seas mi primer amor. Te elijo porque lo que siento por ti es real, porque contigo aprendí una forma de cariño que no había conocido antes, y porque a tu lado descubrí que amar también es aprender y crecer juntos.

En estos dos años he visto tu manera de querer: tranquila, firme, constante, hecha de gestos que a veces son silencios y otras veces son presencia. No necesito que seas distinto, ni que cambies tu forma de sentir. Me basta con que seas tú, porque eso es lo que amo.

Sé que a veces nuestras formas chocan un poco: yo siento muy fuerte, tú guardas más dentro. Pero incluso con esa diferencia, lo nuestro fluye, se ajusta y encuentra su propio ritmo. Para mí, eso significa muchísimo. Yo también estoy aprendiendo, también tengo mis inseguridades, y aun así te elijo con plena convicción.

Solo quiero pedirte algo sencillo: que conmigo no tengas que esconder lo que sientes. No te pido grandes discursos, solo que no cierres lo que te pesa. Estoy aquí para escucharte, para acompañarte, para cuidarnos mutuamente.

Y quiero decirte algo más… Desde hace tiempo, tú eres para mí lo que la rosa fue para el Principito. No por perfección, sino por significado. Porque lo importante no es cómo son las cosas por fuera, sino lo que construimos al cuidarlas día a día. **Eres mi rosa**, no porque te necesite, sino porque te quiero. Porque elegí cuidarte, y porque tú también me has cuidado a tu manera.

Así que hoy, después de dos años, mi respuesta es sencilla y profunda:
**sí quiero seguir contigo, con nuestra historia, con nuestras diferencias y con todo lo que nos falta por vivir.**
Quiero seguir aprendiendo a comunicarnos, a comprendernos y a darnos tranquilidad y amor.

Gracias por estos dos años, por tu presencia, por tu manera única de estar, por lo que hemos compartido y por lo que viene.
Te amo, mi Orión. Y te vuelvo a elegir.
` },

    { tipo: "carta", fecha: "2025-11-24", fechaTexto: "Sin fecha", titulo: "Te elijo",
      texto: `
“Te elijo porque contigo aprendí que el amor no se trata de llenar vacíos, sino de caminar juntos aun cuando tengamos miedo. Te elijo porque eres mi rosa: no por perfecta, sino por única, por todo lo que hemos vivido, por lo que cuidamos, por lo que somos cuando nos miramos con verdad. Te elijo porque, a pesar de las preguntas y las noches difíciles, tu corazón sigue hablando con el mío. Yo no me quedo por miedo a estar sola: me quedo porque contigo encuentro un hogar al que siempre quiero volver. Si tú me pides claridad, aquí está: mi respuesta es sí. Te elijo hoy, te elijo ahora, te elijo en lo que viene. Y ojalá tú también me elijas, no por necesidad, sino por decisión.”
` },

    { tipo: "poema", fecha: "2026-05-15", titulo: "Creo que te amaré solo 4 veces",
      texto: `
Creo que te amaré solo 4 veces, verano, primavera, otoño y invierno
O no quizás durante solo 3,
Ayer, hoy, mañana
No mejor creo que te amaré durante dos veces,
Día y noche
O quizás solo durante una,
Cada día
` },

    { tipo: "poema", fecha: "2026-05-19", titulo: "Para ti ❤",
      texto: `
Te pienso en las noches donde todo duele un poco más
cuando el silencio pesa
y el corazón no encuentra dónde descansar

Te pienso
y de alguna manera sobrevivo
Porque hay algo en ti
que calma mis miedos sin siquiera intentarlo
algo tan tuyo
tan sincero
tan humano
que hace que incluso mis días más rotos
se sientan menos solos

Te siento en las pequeñas cosas
en esa paz extraña que llega cuando recuerdo tu voz
en la forma en que mi alma descansa
cada vez que imagina quedarse contigo
Y quisiera que pudieras verte como yo te veo
con esa fuerza silenciosa que cargas incluso cansado con ese corazón noble
que sigue dando amor
aunque la vida a veces no haya sido amable contigo

Te amo de una forma que me asusta un poco
porque jamás había sentido a alguien tan dentro de mí
tan hogar
tan refugio
tan “quédate aquí”

Te amo incluso en tus tormentas
incluso en tus silencios
incluso en esos días donde dudas de ti mismo
porque si hay algo de lo que estoy segura
es de que mi corazón te elegiría
una y otra vez
aunque el mundo se estuviera cayendo

Y si algún día vuelves a sentirte perdido
quiero que recuerdes esto:
en algún lugar del mundo
existe alguien
que mira tu alma
y piensa
“por favor… nunca dejes de existir.”

Te amo
María Antonia ❤
` },

    { tipo: "poema", fecha: "2026-06-28", titulo: "No voy a pedirle al tiempo que corra",
      texto: `
No voy a pedirle al tiempo que corra,
ni al camino que te traiga de vuelta hoy;
quiero que vivas cada instante,
que guardes en el alma cada rincón.

Sí, te extraño...
porque la distancia tiene ese pequeño poder
de recordarme cuánto disfruto tu compañía,
y cuánto me emociona volverte a ver.

Mientras tú coleccionas paisajes,
yo voy coleccionando motivos
para escuchar tus historias,
esas que aún no conozco
y que ya me hacen sonreír.

Quiero imaginar tus ojos brillando
cuando me cuentes cada aventura,
cada risa, cada sorpresa,
cada instante que hizo especial tu viaje.
No quiero perderme ninguno.

Así que ve, disfruta, ríe y descubre.
No dejes que mi ausencia le quite color a tus días.
Aquí estaré,
esperando el momento de abrazarte,
de escucharte por horas
y de enamorarme otra vez
a través de todo lo que viviste.

Porque extrañarte no pesa cuando se ama así;
se convierte en la promesa silenciosa
de un reencuentro lleno de abrazos,
de historias por contar
y de un "ya volví"
que hará que toda esta espera
haya valido la pena.
` },

    { tipo: "carta", id: "enamoremos-otra-vez", fecha: "2026-10-23", titulo: "Enamoremos otra vez", destacado: true,
      texto: `
No me refiero a empezar de nuevo. No me refiero a cambiar las cosas. No quiero que algo tan bonito llegue a ser monótono en algún punto.
Siempre voy a recordar el día que yo me enamoré de ti: ese brillo especial y particular de tus ojos, la extraña sensación de que el corazón quería salirse de mi pecho, las tantas veces que se me subieron los colores a la cara porque decía algunos pensamientos en voz alta sobre ti, a veces frente a ti y otras estando sola en mi habitación, recordando el tiempo que pasamos juntos.
¿Sabes? Hoy en día aún me siento así. Me siento tan enamorada de ti. Y quizá por eso quiero poder provocar lo mismo en ti: que cada vez que me veas o que estemos juntos pienses en ese día en el que tú te enamoraste de mí, que todas esas sensaciones vuelvan a ti y te lo recuerden, que te den ganas de decir: “Enamoremos otra vez”, una y otra, y otra vez.
A veces pienso en quien era cuando llegaste a mi vida. Tenía mucha esperanza en este primer amor. Claramente, no todo ha sido perfecto ni color de rosa, pero siempre ha existido la misma constante: nos hemos sostenido por el amor que nos tenemos, un amor que ha crecido conforme pasan los días y las aventuras en esta relación.
Y creo que mi yo de aquel entonces no me creería si pudiera verme ahora.
Siempre fui una muchacha apartada del amor. Sabía que no era fea, pero siempre fui “la rara”. Ninguno de los muchachos se acercaba a conquistarme; siempre era a mis amigas. Me acostumbré tanto a eso que incluso ahora, sabiendo que me amas con todo tu ser y tu corazón, todavía te pregunto por qué lo haces, qué sentido tiene si no soy alguien extraordinaria, si físicamente no soy “wow” o si intelectualmente no supero al promedio.
Y tú solamente me dices: “Me gusta porque eres tú”.
Quizá no sabes cuánto significa para mí escucharte decir eso. Porque siento que ahora tengo a alguien que no necesita verme como algo extraordinario para amarme. Me quieres así: siendo rara, hablando de cosas poco convencionales, llorando por cualquier cosa porque soy demasiado sensible; alguien que me abraza y me consuela, que, así sea la cosa más estúpida que se me ocurra, se va a reír a carcajadas. Alguien que me va a alentar a crecer y que siempre me va a decir: “Me gusta porque eres tú. Eres el amor de mi vida y eres mi corazón”.
Y yo quiero ser esa persona para ti.
Quiero ser esa persona con la que puedas quedarte hasta las tres de la madrugada respondiendo preguntas tontas de internet, la persona que pueda acompañarte a enfrentar tus miedos, así como tú me acompañaste a enfrentar los míos al amanecer, en lo profundo de una montaña, y también quien pueda darte ganas de seguir luchando y mejorar.
Quiero que conmigo puedas sentirte seguro y no tengas que mostrarte fuerte. Quiero que podamos ver lo más simple como algo maravilloso: que puedas contarme tu día o tu trabajo, hablarme de tus vivencias en la oficina, que yo pueda contarte las mías y que terminemos riéndonos de todo.
Quiero una escapada para ver las estrellas. Quiero fantasear contigo con un viaje, con un hogar y con mascotas. Quiero seguir imaginando cosas juntos, incluso aquellas que todavía no sabemos si algún día serán nuestras.
Porque creo que también es eso lo que hace especial lo nuestro: mantener nuestra esencia tan intacta como podamos. Tu valentía y mi rareza, cada uno con nuestra propia esencia, pero también mantengamos la esencia de esta bonita relación. Encajamos tan bien que todo lo que hagamos juntos se vuelve especial.
Se siente como ese lugar del que nunca quieres irte. Nos reímos de todo, nos abrazamos, nos besamos, jugamos. Y quizá por esto es que quiero que nos enamoremos otra vez.
Quiero que mantengamos ese sentimiento de la primera vez, pero también que conozcamos estas nuevas versiones que han crecido juntas con estos años. Que recordemos con una sonrisa y riamos de todo lo que ya hicimos, que nos abracemos y soñemos juntos.
Enamoremos otra vez de todo lo que alguna vez nos generó diferencias y, aun así, no nos separó. Enamoremos otra vez de nuestras heridas internas e inseguridades que ya conocemos. Enamoremos otra vez para no olvidar cuánto nos hemos amado y cuánto nos vamos a amar.
Y si algún día volvemos a encontrarnos abrazados, mirándonos a los ojos, riéndonos de alguna estupidez o simplemente disfrutando de estar juntos, quiero que podamos volver a pensar lo mismo que tantas veces hemos sentido:
*“Esto es lo mejor que me ha podido pasar.”*
Te amo ❤️😘
` },

    { tipo: "momento", fecha: "hoy", icono: "💞", titulo: "Nuestro presente",
      texto: "Llevamos {dias} días juntos, y esta página sigue en blanco para todo lo que nos falta por vivir." }
  ],

  /* ---------- CARRUSELES DE FOTOS ----------
     Solo aparecen las fotos que existan en /fotos. Si no hay ninguna,
     la sección se esconde sola. Puedes crear varios carruseles.         */
  carruseles: [
    {
      titulo: "Nuestros recuerdos",
      subtitulo: "Pequeños pedazos de nuestra historia",
      intervalo: 5000,           // cada cuánto cambia de foto (ms)
      fotos: [
        { foto: "fotos/recuerdo-1.jpg", titulo: "Nuestra primera cita ☕", fecha: "20 de agosto, 2023", lugar: "", descripcion: "El comienzo de muchas salidas juntos." },
        { foto: "fotos/recuerdo-2.jpg", titulo: "El viaje a Jardín", fecha: "7 de septiembre, 2023", lugar: "Jardín", descripcion: "El viaje en el que supe que me gustabas mucho… y de donde te traje tu primera pulsera." },
        { foto: "fotos/recuerdo-3.jpg", titulo: "La rosa 🌹", fecha: "18 de noviembre, 2023", lugar: "", descripcion: "No me salieron las palabras, pero la rosa llegó a tus manos." },
        { foto: "fotos/recuerdo-4.jpg", titulo: "El día que dijiste que sí ❤️", fecha: "23 de noviembre, 2023 · 5:45 p.m.", lugar: "", descripcion: "La hora exacta en que empezó lo nuestro." },
        { foto: "fotos/recuerdo-5.jpg", titulo: "Nuestro primer aniversario", fecha: "23 de noviembre, 2024", lugar: "", descripcion: "Un año eligiéndonos." },
        { foto: "fotos/recuerdo-6.jpg", titulo: "Nuestro segundo aniversario", fecha: "23 de noviembre, 2025", lugar: "", descripcion: "Dos años juntos, y te vuelvo a elegir." }
      ]
    }
    // , { titulo: "Nuestro viaje a …", subtitulo: "…", fotos: [ { foto: "fotos/…jpg", titulo: "…", fecha: "…", lugar: "…", descripcion: "…" } ] }
  ],

  /* ---------- GALERÍA ----------
     Solo aparecen las fotos que existan. "categoria" debe coincidir con
     un "id" de la lista de categorías.                                  */
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

  /* ---------- RAZONES POR LAS QUE TE AMO ---------- */
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

  /* ---------- 🎵 NUESTRAS CANCIONES ----------
     listaYoutube: la lista de reproducción de YouTube. La página la lee
     cada vez que se abre, así que las canciones que agregues a la lista
     en YouTube aparecen solas (la lista debe ser pública o no listada).
     Si prefieres canciones sueltas, borra listaYoutube y usa "canciones".
     Nota: YouTube solo suena con la página publicada (GitHub Pages),
     no al abrir index.html directamente en tu computador.               */
  musica: {
    listaYoutube: "https://www.youtube.com/playlist?list=PLd0o2W-1Fff0",
    dedicatoria: "Estas canciones siempre me recuerdan a ti",
    reproducirAlAbrir: true,     // empieza a sonar al abrir el sobre
    volumen: 0.7,                // de 0 a 1
    aleatorio: false,            // true = orden al azar
    canciones: [
      // { youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX", titulo: "Nombre de la canción", artista: "Artista", dedicatoria: "Opcional: por qué me recuerda a ti" },
    ]
  },

  /* ---------- 🎬 VIDEOS (opcional) ----------
     La sección aparece sola cuando agregas al menos un video.
     - Archivo propio:  { archivo: "videos/playa.mp4", portada: "fotos/playa.jpg", titulo: "…" }
     - YouTube:         { youtube: "https://youtu.be/…", titulo: "…" }      */
  videos: [
  ],

  /* ---------- CIERRE ---------- */
  final: {
    foto: "fotos/final.jpg",
    titulo: "Gracias por ser mi persona favorita ❤️",
    fecha: "23 · 11 · 2023",
    fechaTexto: "5:45 p.m. · El día que dijiste que sí y empezó lo más bonito de mi vida",
    mensaje: "No sé qué nos depare el futuro, pero sé que quiero vivirlo contigo. Gracias por existir, por elegirme y por hacer de cada día un recuerdo que vale la pena guardar.",
    firma: "Con todo mi amor, para siempre ❤️",
    nombre: "María Antonia",
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
