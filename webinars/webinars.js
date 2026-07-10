(function () {
  'use strict';

  var THEME_KEY = 'milpa-academy-theme';
  var CHECKLIST_KEY = 'milpa-academy-webinar-checklist-v1';
  var RUN_KEY = 'milpa-academy-webinar-run-v1';
  var NOTES_KEY = 'milpa-academy-webinar-notes-v1';
  var SESSION_LENGTH_MS = 60 * 60 * 1000;

  var root = document.documentElement;
  var body = document.body;

  function byId(id) {
    return document.getElementById(id);
  }

  function readValue(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeValue(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeValue(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function readObject(key) {
    var value = readValue(key);
    if (!value) return {};
    try {
      var parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  var savedTheme = readValue(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

  var themeToggle = byId('theme-toggle');

  function renderThemeControl() {
    if (!themeToggle) return;
    var isDark = root.dataset.theme !== 'light';
    themeToggle.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    themeToggle.setAttribute('data-tip', isDark ? 'Tema claro' : 'Tema oscuro');
  }

  renderThemeControl();
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      writeValue(THEME_KEY, root.dataset.theme);
      renderThemeControl();
    });
  }

  var navToggle = byId('nav-toggle');
  var navClose = byId('nav-close');
  var navDialog = byId('webinar-menu');

  if (navToggle && navDialog) {
    navToggle.addEventListener('click', function () {
      openDialog(navDialog);
      navToggle.setAttribute('aria-expanded', 'true');
    });
    navDialog.addEventListener('close', function () {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    });
    navDialog.addEventListener('click', function (event) {
      if (event.target === navDialog) closeDialog(navDialog);
    });
  }
  if (navClose) navClose.addEventListener('click', function () { closeDialog(navDialog); });
  Array.prototype.forEach.call(document.querySelectorAll('.ac-drawer-link'), function (link) {
    link.addEventListener('click', function () { closeDialog(navDialog); });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
  var blockLinks = Array.prototype.slice.call(document.querySelectorAll('[data-block-link]'));
  var currentIndex = 0;
  var presentationToggle = byId('presentation-toggle');
  var presentationLabel = presentationToggle ? presentationToggle.querySelector('.ac-present-label') : null;
  var presentationPosition = byId('presentation-position');
  var previousBlock = byId('previous-block');
  var nextBlock = byId('next-block');
  var exitPresentation = byId('exit-presentation');
  var currentBlockBadge = byId('current-block-badge');
  var currentBlockTitle = byId('current-block-title');
  var currentBlockTime = byId('current-block-time');

  function blockTitle(slide) {
    var heading = slide.querySelector('.mui-card__title');
    return heading ? heading.textContent.trim() : '';
  }

  function blockTime(slide) {
    var eyebrow = slide.querySelector('.ac-eyebrow');
    if (!eyebrow) return '';
    var parts = eyebrow.textContent.split('·');
    return parts.length > 1 ? parts[1].trim() + ' min' : eyebrow.textContent.trim();
  }

  function setActiveBlock(index, shouldFocus) {
    if (!slides.length) return;
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    var current = slides[currentIndex];

    slides.forEach(function (slide, slideIndex) {
      slide.dataset.active = slideIndex === currentIndex ? 'true' : 'false';
    });
    blockLinks.forEach(function (link) {
      var tracksCurrentBlock = link.classList.contains('ac-block-link') || link.classList.contains('ac-drawer-block');
      if (!tracksCurrentBlock) return;
      if (link.dataset.blockLink === current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    var title = blockTitle(current);
    var time = blockTime(current);
    if (currentBlockBadge) currentBlockBadge.textContent = 'Bloque ' + (currentIndex + 1) + ' de ' + slides.length;
    if (currentBlockTitle) currentBlockTitle.textContent = title;
    if (currentBlockTime) currentBlockTime.textContent = time;
    if (presentationPosition) presentationPosition.textContent = (currentIndex + 1) + ' / ' + slides.length + ' · ' + title;
    if (previousBlock) previousBlock.disabled = currentIndex === 0;
    if (nextBlock) nextBlock.disabled = currentIndex === slides.length - 1;

    if (shouldFocus) {
      var heading = current.querySelector('.mui-card__title');
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  blockLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var targetIndex = slides.findIndex(function (slide) { return slide.id === link.dataset.blockLink; });
      if (targetIndex >= 0) setActiveBlock(targetIndex, false);
    });
  });

  var initialHashIndex = slides.findIndex(function (slide) { return '#' + slide.id === window.location.hash; });
  setActiveBlock(initialHashIndex >= 0 ? initialHashIndex : 0, false);

  var runState = readObject(RUN_KEY);
  var agendaProgress = byId('agenda-progress');
  var agendaProgressBar = byId('agenda-progress-bar');
  var agendaProgressLabel = byId('agenda-progress-label');

  function renderBlockProgress() {
    var completeCount = slides.reduce(function (count, slide) {
      return count + (slide.dataset.complete === 'true' ? 1 : 0);
    }, 0);
    var percent = slides.length ? Math.round(completeCount / slides.length * 100) : 0;
    if (agendaProgress) {
      agendaProgress.setAttribute('aria-valuenow', String(completeCount));
      agendaProgress.setAttribute('aria-valuetext', completeCount + ' de ' + slides.length + ' bloques');
    }
    if (agendaProgressBar) agendaProgressBar.style.width = percent + '%';
    if (agendaProgressLabel) agendaProgressLabel.textContent = completeCount + ' de ' + slides.length + ' bloques';
  }

  function setBlockComplete(slide, isComplete, shouldSave) {
    if (!slide) return;
    slide.dataset.complete = isComplete ? 'true' : 'false';
    var button = slide.querySelector('[data-mark-block]');
    if (button) {
      button.setAttribute('aria-pressed', isComplete ? 'true' : 'false');
      button.textContent = isComplete ? '✓ Cubierto' : 'Marcar cubierto';
    }
    document.querySelectorAll('[data-block-link="' + slide.id + '"]').forEach(function (link) {
      if (link.classList.contains('ac-block-link')) link.dataset.complete = isComplete ? 'true' : 'false';
    });
    runState[slide.id] = isComplete;
    if (shouldSave) writeValue(RUN_KEY, JSON.stringify(runState));
    renderBlockProgress();
  }

  slides.forEach(function (slide) {
    setBlockComplete(slide, runState[slide.id] === true, false);
  });
  document.querySelectorAll('[data-mark-block]').forEach(function (button) {
    button.addEventListener('click', function () {
      var slide = byId(button.dataset.markBlock);
      setBlockComplete(slide, slide.dataset.complete !== 'true', true);
    });
  });

  if ('IntersectionObserver' in window) {
    var blockObserver = new IntersectionObserver(function (entries) {
      if (body.dataset.presenting === 'true') return;
      var visible = entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (!visible.length) return;
      var visibleIndex = slides.indexOf(visible[0].target);
      if (visibleIndex >= 0) setActiveBlock(visibleIndex, false);
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.05, 0.35, 0.65] });
    slides.forEach(function (slide) { blockObserver.observe(slide); });
  }

  function setPresentation(isPresenting) {
    body.dataset.presenting = isPresenting ? 'true' : 'false';
    if (presentationToggle) {
      presentationToggle.setAttribute('aria-pressed', isPresenting ? 'true' : 'false');
      presentationToggle.setAttribute('aria-label', isPresenting ? 'Salir del modo presentación' : 'Entrar al modo presentación');
    }
    if (presentationLabel) presentationLabel.textContent = isPresenting ? 'Salir' : 'Presentar';
    if (isPresenting) {
      window.scrollTo(0, 0);
      setActiveBlock(currentIndex, true);
    } else {
      slides[currentIndex].scrollIntoView({ block: 'start' });
      setActiveBlock(currentIndex, false);
    }
  }

  if (presentationToggle) {
    presentationToggle.addEventListener('click', function () {
      setPresentation(body.dataset.presenting !== 'true');
    });
  }
  if (exitPresentation) exitPresentation.addEventListener('click', function () { setPresentation(false); });
  if (previousBlock) previousBlock.addEventListener('click', function () { setActiveBlock(currentIndex - 1, true); });
  if (nextBlock) nextBlock.addEventListener('click', function () { setActiveBlock(currentIndex + 1, true); });

  document.addEventListener('keydown', function (event) {
    if (body.dataset.presenting !== 'true') return;
    var tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button' || tag === 'a') return;
    if (event.key === 'Escape') {
      setPresentation(false);
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      setActiveBlock(currentIndex + 1, true);
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      setActiveBlock(currentIndex - 1, true);
    }
  });

  var checklistState = readObject(CHECKLIST_KEY);
  var checklistItems = Array.prototype.slice.call(document.querySelectorAll('[data-check]'));
  var checklistProgress = byId('checklist-progress');
  var checklistProgressBar = byId('checklist-progress-bar');
  var checklistCount = byId('checklist-count');

  function renderChecklist() {
    var checked = checklistItems.filter(function (input) { return input.checked; }).length;
    var percent = checklistItems.length ? Math.round(checked / checklistItems.length * 100) : 0;
    if (checklistProgress) {
      checklistProgress.setAttribute('aria-valuenow', String(checked));
      checklistProgress.setAttribute('aria-valuetext', checked + ' de ' + checklistItems.length + ' tareas');
    }
    if (checklistProgressBar) checklistProgressBar.style.width = percent + '%';
    if (checklistCount) checklistCount.textContent = checked + ' / ' + checklistItems.length;
  }

  checklistItems.forEach(function (input) {
    input.checked = checklistState[input.dataset.check] === true;
    input.addEventListener('change', function () {
      checklistState[input.dataset.check] = input.checked;
      writeValue(CHECKLIST_KEY, JSON.stringify(checklistState));
      renderChecklist();
    });
  });
  renderChecklist();

  var notes = byId('facilitator-notes');
  var notesStatus = byId('notes-status');
  var notesTimer = null;
  if (notes) {
    notes.value = readValue(NOTES_KEY) || '';
    notes.addEventListener('input', function () {
      if (notesStatus) notesStatus.textContent = 'Guardando…';
      window.clearTimeout(notesTimer);
      notesTimer = window.setTimeout(function () {
        var saved = writeValue(NOTES_KEY, notes.value);
        if (notesStatus) notesStatus.textContent = saved ? 'Guardado' : 'Disponible en esta sesión';
      }, 250);
    });
  }

  var timerToggle = byId('timer-toggle');
  var timerReset = byId('timer-reset');
  var sessionTimer = byId('session-timer');
  var topbarClock = byId('topbar-clock');
  var timeProgress = byId('time-progress');
  var timeProgressBar = byId('time-progress-bar');
  var timeAlert = byId('time-alert');
  var timerInterval = null;
  var timerRunning = false;
  var timerRemaining = SESSION_LENGTH_MS;
  var timerEndsAt = 0;

  function displayTime(milliseconds) {
    var totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function currentRemaining() {
    return timerRunning ? Math.max(0, timerEndsAt - Date.now()) : timerRemaining;
  }

  function renderTimer() {
    var remaining = currentRemaining();
    var elapsed = SESSION_LENGTH_MS - remaining;
    var elapsedMinutes = Math.min(60, Math.floor(elapsed / 60000));
    var percent = Math.min(100, Math.max(0, elapsed / SESSION_LENGTH_MS * 100));
    var value = displayTime(remaining);
    if (sessionTimer) sessionTimer.textContent = value;
    if (topbarClock) topbarClock.textContent = value;
    if (timeProgress) {
      timeProgress.setAttribute('aria-valuenow', String(elapsedMinutes));
      timeProgress.setAttribute('aria-valuetext', elapsedMinutes + ' de 60 minutos');
    }
    if (timeProgressBar) timeProgressBar.style.width = percent + '%';

    if (timerRunning && remaining <= 0) {
      timerRunning = false;
      timerRemaining = 0;
      window.clearInterval(timerInterval);
      timerInterval = null;
      if (timerToggle) {
        timerToggle.setAttribute('aria-pressed', 'false');
        timerToggle.textContent = '▶ Reiniciar';
      }
      if (timeAlert) timeAlert.hidden = false;
    }
  }

  function pauseTimer() {
    timerRemaining = currentRemaining();
    timerRunning = false;
    window.clearInterval(timerInterval);
    timerInterval = null;
    if (timerToggle) {
      timerToggle.setAttribute('aria-pressed', 'false');
      timerToggle.textContent = '▶ Continuar';
    }
    renderTimer();
  }

  function startTimer() {
    if (timerRemaining <= 0) timerRemaining = SESSION_LENGTH_MS;
    timerEndsAt = Date.now() + timerRemaining;
    timerRunning = true;
    if (timeAlert) timeAlert.hidden = true;
    if (timerToggle) {
      timerToggle.setAttribute('aria-pressed', 'true');
      timerToggle.textContent = 'Ⅱ Pausar';
    }
    window.clearInterval(timerInterval);
    timerInterval = window.setInterval(renderTimer, 250);
    renderTimer();
  }

  function resetTimer() {
    timerRunning = false;
    timerRemaining = SESSION_LENGTH_MS;
    timerEndsAt = 0;
    window.clearInterval(timerInterval);
    timerInterval = null;
    if (timerToggle) {
      timerToggle.setAttribute('aria-pressed', 'false');
      timerToggle.textContent = '▶ Iniciar';
    }
    if (timeAlert) timeAlert.hidden = true;
    renderTimer();
  }

  if (timerToggle) timerToggle.addEventListener('click', function () { timerRunning ? pauseTimer() : startTimer(); });
  if (timerReset) timerReset.addEventListener('click', resetTimer);
  renderTimer();

  var resetSession = byId('reset-session');
  var resetDialog = byId('reset-dialog');
  var resetCancel = byId('reset-cancel');
  var resetConfirm = byId('reset-confirm');

  if (resetSession) resetSession.addEventListener('click', function () { openDialog(resetDialog); });
  if (resetCancel) resetCancel.addEventListener('click', function () { closeDialog(resetDialog); });
  if (resetDialog) {
    resetDialog.addEventListener('click', function (event) {
      if (event.target === resetDialog) closeDialog(resetDialog);
    });
  }
  if (resetConfirm) {
    resetConfirm.addEventListener('click', function () {
      checklistState = {};
      runState = {};
      checklistItems.forEach(function (input) { input.checked = false; });
      slides.forEach(function (slide) { setBlockComplete(slide, false, false); });
      if (notes) notes.value = '';
      if (notesStatus) notesStatus.textContent = 'Restablecido';
      removeValue(CHECKLIST_KEY);
      removeValue(RUN_KEY);
      removeValue(NOTES_KEY);
      renderChecklist();
      renderBlockProgress();
      resetTimer();
      closeDialog(resetDialog);
      if (resetSession) resetSession.focus();
    });
  }

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.ac-aside .mui-toc__link'));
  var tocSections = tocLinks.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && tocSections.length) {
    var tocObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; });
      if (!visible.length) return;
      var id = visible[0].target.id;
      tocLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0.01 });
    tocSections.forEach(function (section) { tocObserver.observe(section); });
  }
})();
