(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaAnalytics = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* Script clásico (sin import/export), mismo patrón UMD que i18n.js y
     curriculum/catalog.js. No depende de MilpaI18n a propósito: el átomo
     (site/atomo/, site/en/atomo/) no carga i18n.js, así que este módulo
     deriva el idioma directo de document.documentElement.lang. */
  function lang() {
    var value = (typeof document !== "undefined" && document.documentElement.lang) || "es";
    return value.indexOf("en") === 0 ? "en" : "es";
  }

  /* No-op seguro: si window.gtag no está presente (por ejemplo, cuando
     milpa-artifact.js se embebe cross-origin en un sitio que no carga este
     archivo) no hace nada — nunca lanza, nunca dispara analytics ajenos. */
  function track(name, params) {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    var payload = Object.assign({ language: lang() }, params || {});
    window.gtag("event", name, payload);
  }

  return { track: track };
});
