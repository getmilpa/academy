/* Fuente bilingüe única del CHROME del shell de laboratorios (labs/index.html):
   head, header, intro, bloque de progreso, aside de navegación y footer. El
   contenido de cada práctica (título, objetivo, comandos, pasos, evidencia) NO
   vive acá — vive en labs/catalog.js ({es,en}) y lo resuelve el runner (labs.js,
   T2) o el resumen estático del SSG (scripts/gen/labs.mjs) vía pick().

   es VERBATIM del labs/index.html legado; en técnico natural (es-MX de origen).
   Sin dependencias, determinista (data pura, sin Date/Math.random). La
   completeness walk de tests/i18n-contract.test.mjs recorre este módulo: toda
   hoja { es, en } debe traer ambos idiomas. */

export const LABS_SHELL = {
  pageTitle: { es: "Laboratorios · Milpa Academy", en: "Labs · Milpa Academy" },
  metaDescription: {
    es: "Cuatro prácticas verificables para arrancar, validar y extender una aplicación Milpa real.",
    en: "Four verifiable practices to boot, validate and extend a real Milpa application.",
  },
  skipLink: { es: "Saltar a la práctica", en: "Skip to the practice" },

  brandAria: { es: "Milpa Academy, inicio", en: "Milpa Academy, home" },
  brandName: { es: "Milpa Academy", en: "Milpa Academy" },
  brandBadge: { es: "labs", en: "labs" },

  navAria: { es: "Principal", en: "Main" },
  navLearn: { es: "Aprender", en: "Learn" },
  navArtifacts: { es: "Artifacts", en: "Artifacts" },

  themeAria: { es: "Cambiar a tema claro", en: "Switch to light theme" },
  themeTip: { es: "Cambiar tema", en: "Switch theme" },

  introKicker: { es: "hacer · observar · verificar", en: "do · observe · verify" },
  h1: { es: "Laboratorios con evidencia real", en: "Labs with real evidence" },
  lede: {
    es: "Ejecuta cada práctica en tu copia del skeleton. Academy revisa la salida que pegues; nunca simula ni ejecuta comandos en tu máquina.",
    en: "Run each practice on your own copy of the skeleton. Academy reviews the output you paste; it never simulates or runs commands on your machine.",
  },

  progressBlockLabel: { es: "Progreso local", en: "Local progress" },
  /* Coincide con labs.js t.progressLabel(0, 4) por idioma (mismo texto inicial). */
  progressInitial: { es: "0 de 4 prácticas", en: "0 of 4 practices" },
  progressBarAria: { es: "Progreso de laboratorios", en: "Labs progress" },

  labsSectionAria: { es: "Prácticas", en: "Practices" },
  navSectionAria: { es: "Ruta de laboratorios", en: "Labs path" },
  eyebrow: { es: "Ruta práctica", en: "Practice path" },

  /* Resumen estático (PE, visible sin JS): encabezado + los 4 labs (título +
     objetivo desde el catalog). El runner reemplaza este contenido al hidratar. */
  summaryHeading: { es: "Las cuatro prácticas", en: "The four practices" },

  footerVersion: { es: "@milpa/design 0.9.0", en: "@milpa/design 0.9.0" },
  footerNote: {
    es: "Comandos verificados contra milpa/skeleton · corte 2026-07-10",
    en: "Commands verified against milpa/skeleton · snapshot 2026-07-10",
  },
};
