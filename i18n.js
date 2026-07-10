(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaI18n = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var LANG_KEY = "milpa-academy-lang";

  function pick(node, lang) {
    if (node && typeof node === "object" && ("es" in node || "en" in node)) {
      return node[lang === "en" ? "en" : "es"];
    }
    return node;
  }

  function currentLang() {
    var l = (typeof document !== "undefined" && document.documentElement.lang) || "es";
    return l.indexOf("en") === 0 ? "en" : "es";
  }

  function switchUrl(pathname, toLang) {
    var isEn = pathname === "/en" || pathname.indexOf("/en/") === 0;
    var base = isEn ? pathname.replace(/^\/en(\/|$)/, "/") : pathname;
    if (base === "") base = "/";
    return toLang === "en" ? ("/en" + (base === "/" ? "/" : base)) : base;
  }

  return { pick: pick, currentLang: currentLang, switchUrl: switchUrl, LANG_KEY: LANG_KEY };
});
