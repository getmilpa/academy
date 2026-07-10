(function () {
  "use strict";
  var catalog = window.MilpaCurriculum;
  var progress = window.MilpaProgress;
  var i18n = window.MilpaI18n;
  if (!catalog || !progress || !i18n) return;

  var lang = i18n.currentLang();
  var pick = i18n.pick;
  var store = progress.createStore(window.localStorage);
  var state = store.read();
  var allUnits = catalog.allUnits();
  var routeGrid = document.getElementById("routeGrid");
  var primary = document.getElementById("primaryLearningAction");
  var themeButton = document.getElementById("themeBtn");
  var menu = document.getElementById("mainMenu");
  var menuToggle = document.getElementById("menuToggle");
  var menuClose = document.getElementById("menuClose");

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
            "<div class=\"ac-route__progress-copy\"><span>" + completed + " de " + track.units.length + " aprobadas</span><span>" + value + "%</span></div>" +
            "<div class=\"mui-progress\" role=\"progressbar\" aria-label=\"Progreso en " + escapeHtml(pick(track.title, lang)) + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"" + value + "\">" +
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
    themeButton.textContent = selected === "dark" ? "Tema: oscuro" : "Tema: claro";
    themeButton.setAttribute("aria-label", "Cambiar a tema " + (selected === "dark" ? "claro" : "oscuro"));
    try {
      window.localStorage.setItem("milpa-academy-theme", selected);
    } catch (error) {
      return;
    }
  }

  document.getElementById("trackCount").textContent = catalog.tracks.length;
  document.getElementById("unitCount").textContent = allUnits.length;
  document.getElementById("completionCount").textContent = progress.percent(state, allUnits) + "%";
  document.getElementById("completionMeta").textContent = progress.countCompleted(state, allUnits) + " de " + allUnits.length + " evaluaciones";

  if (state.lastUnit) {
    var parts = state.lastUnit.split("/");
    var found = parts.length === 2 ? catalog.getUnit(parts[0], parts[1]) : null;
    if (found) {
      primary.href = "./learn/#" + parts[0] + "/" + parts[1];
      primary.textContent = "Continuar: " + pick(found.unit.title, lang);
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

  var savedTheme = "dark";
  try {
    savedTheme = window.localStorage.getItem("milpa-academy-theme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }
  setTheme(savedTheme);
})();
