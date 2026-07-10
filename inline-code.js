(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaInlineCode = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /**
   * Tokeniza texto con code-spans estilo Markdown (`código`) sin tocar HTML.
   * Cada token es { code: boolean, text: string }. Nunca escapa, nunca
   * lanza, nunca descarta texto: un backtick sin cierre queda literal.
   */
  function splitCodeSpans(text) {
    var value = text === undefined || text === null ? "" : String(text);
    if (value === "") return [{ code: false, text: "" }];

    var tokens = [];
    var pattern = /`([^`]+)`/g;
    var cursor = 0;
    var match;

    while ((match = pattern.exec(value)) !== null) {
      if (match.index > cursor) {
        tokens.push({ code: false, text: value.slice(cursor, match.index) });
      }
      tokens.push({ code: true, text: match[1] });
      cursor = pattern.lastIndex;
    }

    if (cursor < value.length) {
      tokens.push({ code: false, text: value.slice(cursor) });
    }

    if (tokens.length === 0) {
      tokens.push({ code: false, text: value });
    }

    return tokens;
  }

  return { splitCodeSpans: splitCodeSpans };
});
