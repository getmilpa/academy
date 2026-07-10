/* Fuente bilingüe única del portal (home de Milpa Academy). Todo string
   visible vive acá como { es, en }. scripts/gen-site.mjs (Task 6) lo consume
   para emitir site/index.html (es) y site/en/index.html (en) — sin
   dependencias, determinista.

   El es es literal del index.html original (root, previo a la migración
   bilingüe); el en es traducción técnica, no calco palabra por palabra.
   La card de webinar queda deliberadamente fuera de practice.* — el kit de
   webinar se orfanea en esta fase (Task 6). */

export const PORTAL = {
  meta: {
    title: { es: "Milpa Academy", en: "Milpa Academy" },
    description: {
      es: "Aprende la arquitectura de Milpa con rutas, artifacts y laboratorios verificables.",
      en: "Learn Milpa's architecture through verifiable tracks, artifacts, and labs.",
    },
    ogTitle: { es: "Milpa Academy", en: "Milpa Academy" },
    ogDescription: {
      es: "Currículo público para entender la arquitectura y construir con Milpa.",
      en: "Public curriculum for understanding the architecture and building with Milpa.",
    },
  },

  nav: {
    learn: { es: "Aprender", en: "Learn" },
    labs: { es: "Laboratorios", en: "Labs" },
    artifacts: { es: "Artifacts", en: "Artifacts" },
    source: { es: "Código fuente", en: "Source code" },
  },

  hero: {
    kicker: {
      es: "Currículo público · arquitectura verificable",
      en: "Public curriculum · verifiable architecture",
    },
    h1: { es: "Milpa Academy", en: "Milpa Academy" },
    lede: {
      es: "Aprende cómo se compone Milpa, construye un host real y valida cada unidad con escenarios calificables y fuentes primarias.",
      en: "Learn how Milpa is composed, build a real host, and validate each unit with graded scenarios and primary sources.",
    },
    thesis: {
      es: "Milpa no promete ahorrarte pensar; promete enseñarte a pensar mientras construyes.",
      en: "Milpa doesn't promise to save you from thinking; it promises to teach you to think while you build.",
    },
    ctaPrimary: { es: "Empezar Fundamentos", en: "Start Fundamentals" },
    ctaSecondary: { es: "Abrir laboratorios", en: "Open labs" },
  },

  /* Labels de las tres stat cards del hero; los números (trackCount,
     unitCount, completionCount) y el meta de progreso los hidrata academy.js
     en runtime — acá solo viven los labels estáticos. */
  stats: {
    tracks: { es: "Rutas públicas", en: "Public tracks" },
    units: { es: "Unidades", en: "Units" },
    progress: { es: "Tu avance", en: "Your progress" },
  },

  routes: {
    kicker: { es: "Elige un recorrido", en: "Choose a track" },
    title: { es: "Rutas de aprendizaje", en: "Learning tracks" },
    method: {
      es: "En todas: Entender → Ver → Hacer → Verificar.",
      en: "In every track: Understand → See → Do → Verify.",
    },
  },

  practice: {
    kicker: { es: "Trabaja con evidencia", en: "Work with evidence" },
    title: {
      es: "Práctica, inspección y enseñanza",
      en: "Practice, inspection, and teaching",
    },
    labs: {
      badge: { es: "Hacer", en: "Do" },
      h3: { es: "Laboratorios verificables", en: "Verifiable labs" },
      body: {
        es: "Ejecuta el CLI real, pega su salida y comprueba señales concretas de boot, capabilities, rutas y tools.",
        en: "Run the real CLI, paste its output, and check concrete signals for boot, capabilities, routes, and tools.",
      },
      link: { es: "Abrir 4 prácticas →", en: "Open 4 exercises →" },
    },
    artifacts: {
      badge: { es: "Ver", en: "See" },
      h3: { es: "Artifacts de arquitectura", en: "Architecture artifacts" },
      body: {
        es: "Manipula el grafo, el pipeline, las compuertas, el event log y los contratos sin reducirlos a diapositivas.",
        en: "Manipulate the graph, the pipeline, the gates, the event log, and the contracts without reducing them to slides.",
      },
      link: { es: "Abrir 9 artifacts →", en: "Open 9 artifacts →" },
    },
  },

  boundary: {
    kicker: { es: "Una base, dos contextos", en: "One foundation, two contexts" },
    h1: {
      es: "Público por defecto. Interno por extensión.",
      en: "Public by default. Internal by extension.",
    },
    body: {
      es: "Este repo contiene el motor y el currículo verificable para cualquier developer. TeamX puede inyectar un catálogo privado durante su propio deploy para procesos, repos y credenciales internas.",
      en: "This repo contains the engine and the verifiable curriculum for any developer. TeamX can inject a private catalog during its own deploy for internal processes, repos, and credentials.",
    },
  },

  footer: {
    mantra: {
      es: "Aprender la arquitectura con evidencia.",
      en: "Learning architecture through evidence.",
    },
    ecosystem: { es: "Ecosistema", en: "Ecosystem" },
  },

  jsonld: {
    type: "EducationalOrganization",
    sameAs: [
      "https://milpa.lat",
      "https://github.com/getmilpa",
      "https://www.npmjs.com/package/@milpa/design",
    ],
  },
};
