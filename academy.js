(function () {
  "use strict";
  var catalog = window.MilpaCurriculum;
  var progress = window.MilpaProgress;
  var i18n = window.MilpaI18n;
  if (!catalog || !progress || !i18n) return;

  /* Script clásico (sin import/export): no puede importar el módulo ESM
     PORTAL, así que el runtime que hidrata el portal trae su propia tabla
     {es,en} — mismo enfoque que artifacts/milpa-artifact.js. Todo el texto
     que academy.js genera en el cliente (botón de tema, conectores de las
     tarjetas de ruta, prefijo de "continuar") vive acá. */
  var STRINGS = {
    es: {
      themeDark: "Tema: oscuro",
      themeLight: "Tema: claro",
      themeAriaSwitch: function (toTheme) {
        return "Cambiar a tema " + (toTheme === "light" ? "claro" : "oscuro");
      },
      routeProgress: function (completed, total) {
        return completed + " de " + total + " aprobadas";
      },
      routeProgressAria: function (trackTitle) {
        return "Progreso en " + trackTitle;
      },
      completionMeta: function (completed, total) {
        return completed + " de " + total + " evaluaciones";
      },
      continuePrefix: "Continuar: "
    },
    en: {
      themeDark: "Theme: dark",
      themeLight: "Theme: light",
      themeAriaSwitch: function (toTheme) {
        return "Switch to " + (toTheme === "light" ? "light" : "dark") + " theme";
      },
      routeProgress: function (completed, total) {
        return completed + " of " + total + " passed";
      },
      routeProgressAria: function (trackTitle) {
        return "Progress in " + trackTitle;
      },
      completionMeta: function (completed, total) {
        return completed + " of " + total + " assessments";
      },
      continuePrefix: "Continue: "
    }
  };

  var lang = i18n.currentLang();
  var strings = STRINGS[lang];
  var pick = i18n.pick;
  window.localStorage.setItem(i18n.LANG_KEY, lang); // solo preferencia — la URL manda, esto no redirige
  var store = progress.createStore(window.localStorage);
  var state = store.read();
  var allUnits = catalog.allUnits();
  var routeGrid = document.getElementById("routeGrid");
  var primary = document.getElementById("primaryLearningAction");
  var secondary = document.getElementById("secondaryLearningAction");
  var themeButton = document.getElementById("themeBtn");
  var menu = document.getElementById("mainMenu");
  var menuToggle = document.getElementById("menuToggle");
  var menuClose = document.getElementById("menuClose");
  var langSwitch = document.getElementById("langSwitch");

  /* GA4 (Task 7): siempre guardado — window.MilpaAnalytics (analytics.js)
     puede no estar cargado (p.ej. bajo test) y en ese caso no debe romper
     el resto de la hidratación del portal. */
  function track(name, params) {
    if (window.MilpaAnalytics && window.MilpaAnalytics.track) window.MilpaAnalytics.track(name, params);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  function minutes(value) {
    return value >= 60 ? Math.round(value / 60 * 10) / 10 + " h" : value + " min";
  }

  function key(track, unit) {
    return progress.unitKey(track.id, unit.id);
  }

  function trackUnits(track) {
    return track.units.map(function (unit) {
      return { id: unit.id, trackId: track.id };
    });
  }

  function renderRoutes() {
    routeGrid.innerHTML = catalog.tracks.map(function (track) {
      var units = trackUnits(track);
      var completed = progress.countCompleted(state, units);
      var value = progress.percent(state, units);
      var next = track.units.find(function (unit) {
        return !state.completed[key(track, unit)];
      }) || track.units[track.units.length - 1];
      return "<a class=\"mui-card mui-card--interactive ac-route\" href=\"./learn/#" + track.id + "/" + next.id + "\">" +
        "<div class=\"mui-card__body\">" +
          "<span class=\"mui-section__kicker\">" + escapeHtml(pick(track.eyebrow, lang)) + "</span>" +
          "<h3>" + escapeHtml(pick(track.title, lang)) + "</h3>" +
          "<p>" + escapeHtml(pick(track.summary, lang)) + "</p>" +
          "<div class=\"ac-route__meta\">" +
            "<span class=\"mui-badge\">" + escapeHtml(pick(track.level, lang)) + "</span>" +
            "<span class=\"mui-badge mui-badge--secondary\">" + escapeHtml(minutes(track.durationMinutes)) + "</span>" +
          "</div>" +
          "<div class=\"ac-route__progress\">" +
            "<div class=\"ac-route__progress-copy\"><span>" + escapeHtml(strings.routeProgress(completed, track.units.length)) + "</span><span>" + value + "%</span></div>" +
            "<div class=\"mui-progress\" role=\"progressbar\" aria-label=\"" + escapeHtml(strings.routeProgressAria(pick(track.title, lang))) + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"" + value + "\">" +
              "<div class=\"mui-progress__bar\" style=\"width:" + value + "%\"></div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</a>";
    }).join("");
  }

  function setTheme(theme) {
    var selected = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = selected;
    themeButton.textContent = selected === "dark" ? strings.themeDark : strings.themeLight;
    themeButton.setAttribute("aria-label", strings.themeAriaSwitch(selected === "dark" ? "light" : "dark"));
    try {
      window.localStorage.setItem("milpa-academy-theme", selected);
    } catch (error) {
      return;
    }
  }

  document.getElementById("trackCount").textContent = catalog.tracks.length;
  document.getElementById("unitCount").textContent = allUnits.length;
  document.getElementById("completionCount").textContent = progress.percent(state, allUnits) + "%";
  document.getElementById("completionMeta").textContent = strings.completionMeta(progress.countCompleted(state, allUnits), allUnits.length);

  if (state.lastUnit) {
    var parts = state.lastUnit.split("/");
    var found = parts.length === 2 ? catalog.getUnit(parts[0], parts[1]) : null;
    if (found) {
      primary.href = "./learn/#" + parts[0] + "/" + parts[1];
      primary.textContent = strings.continuePrefix + pick(found.unit.title, lang);
    }
  }

  renderRoutes();
  menuToggle.addEventListener("click", function () {
    menu.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
  });
  menuClose.addEventListener("click", function () {
    menu.close();
  });
  menu.addEventListener("close", function () {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  });
  menu.addEventListener("click", function (event) {
    if (event.target === menu) menu.close();
  });
  themeButton.addEventListener("click", function () {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  primary.addEventListener("click", function () {
    track("cta_click", { cta_id: "primary" });
  });
  if (secondary) {
    secondary.addEventListener("click", function () {
      track("cta_click", { cta_id: "secondary" });
    });
  }
  if (langSwitch) {
    langSwitch.addEventListener("click", function () {
      var to = langSwitch.getAttribute("hreflang") || (lang === "es" ? "en" : "es");
      track("lang_switch", { from: lang, to: to });
    });
  }
  [].forEach.call(document.querySelectorAll("[data-outbound-kind]"), function (link) {
    link.addEventListener("click", function () {
      track("outbound_click", { href: link.getAttribute("href"), kind: link.getAttribute("data-outbound-kind") });
    });
  });

  var savedTheme = "dark";
  try {
    savedTheme = window.localStorage.getItem("milpa-academy-theme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }
  setTheme(savedTheme);
})();
