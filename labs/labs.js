(function () {
  "use strict";

  const { labs, getLab } = globalThis.MilpaLabCatalog;
  const { verifyLab } = globalThis.MilpaLabVerifier;
  const storageKey = "milpa-academy-labs-v1";
  const themeKey = "milpa-academy-theme";
  const navigation = document.querySelector("#lab-navigation");
  const workspace = document.querySelector("#lab-workspace");
  const progress = document.querySelector("#course-progress");
  const progressBar = document.querySelector("#course-progress-bar");
  const progressLabel = document.querySelector("#progress-label");
  const themeToggle = document.querySelector("#theme-toggle");
  let activeId = labs[0].id;

  function readState() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (!value || !Array.isArray(value.completed) || typeof value.drafts !== "object") throw new TypeError("invalid state");
      return {
        completed: value.completed.filter((id) => getLab(id)),
        drafts: value.drafts ?? {},
      };
    } catch {
      return { completed: [], drafts: {} };
    }
  }

  let state = readState();
  state.completed = state.completed.filter((id) => verifyLab(id, state.drafts[id] ?? "").valid);
  writeState();

  function writeState() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* storage may be unavailable */ }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-label", `Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`);
    try { localStorage.setItem(themeKey, theme); } catch { /* use document default */ }
  }

  try {
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  } catch { /* use document default */ }

  themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  function updateProgress() {
    const completed = labs.filter((lab) => state.completed.includes(lab.id)).length;
    const percent = Math.round((completed / labs.length) * 100);
    progress.setAttribute("aria-valuenow", String(completed));
    progressBar.style.width = `${percent}%`;
    progressLabel.textContent = `${completed} de ${labs.length} práctica${completed === 1 ? "" : "s"}`;
  }

  function renderNavigation() {
    navigation.replaceChildren();
    labs.forEach((lab) => {
      const item = element("li", "mui-steps__item");
      if (lab.id === activeId) item.setAttribute("aria-current", "step");

      const marker = element("span", "mui-steps__marker");
      marker.setAttribute("aria-hidden", "true");
      const button = element("button", "mui-steps__title ac-step-button", lab.shortTitle);
      button.type = "button";
      button.addEventListener("click", () => selectLab(lab.id, { focus: true }));

      const meta = element("p", "mui-steps__body ac-step-meta");
      const duration = element("span", "", lab.duration);
      const complete = state.completed.includes(lab.id);
      const status = element("span", "ac-step-status", complete ? "completa" : "pendiente");
      status.dataset.complete = String(complete);
      status.setAttribute("aria-label", complete ? "Práctica completada" : "Práctica pendiente");
      meta.append(duration, status);
      item.append(marker, button, meta);
      navigation.append(item);
    });
  }

  function renderCommand(command, labId, index) {
    const terminal = element("div", "mui-terminal ac-command-terminal");
    const bar = element("div", "mui-terminal__bar");
    const label = element("span", "ac-command-label", command.label);
    const copy = element("button", "mui-btn mui-btn--ghost mui-btn--sm", "Copiar");
    copy.type = "button";
    copy.dataset.copy = `${labId}-${index}`;
    copy.addEventListener("click", async () => {
      const copied = await copyText(command.code);
      copy.textContent = copied ? "Copiado" : "Selecciona el texto";
      window.setTimeout(() => { copy.textContent = "Copiar"; }, 1600);
    });
    bar.append(label, copy);

    const body = element("div", "mui-terminal__body");
    body.tabIndex = 0;
    body.setAttribute("aria-label", `Comandos: ${command.label}`);
    const line = element("div", "mui-terminal__line");
    line.append(element("span", "mui-terminal__out", command.code));
    body.append(line);
    terminal.append(bar, body);
    return terminal;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const fallback = element("textarea", "mui-sr-only");
      fallback.value = text;
      fallback.setAttribute("readonly", "");
      document.body.append(fallback);
      fallback.select();
      const copied = document.execCommand("copy");
      fallback.remove();
      return copied;
    }
  }

  function appendResult(container, result, { restored = false } = {}) {
    container.hidden = false;
    container.className = `mui-callout ${result.valid ? "mui-callout--tip" : "mui-callout--danger"} ac-result`;
    container.replaceChildren();

    const icon = element("span", "mui-callout__icon", result.valid ? "✓" : "!");
    icon.setAttribute("aria-hidden", "true");
    const content = element("div", "mui-callout__content");
    const title = element("p", "mui-callout__title", result.valid ? (restored ? "Evidencia guardada" : "Práctica verificada") : "Evidencia incompleta");
    const body = element("div", "mui-callout__body");
    const summary = element("p", "ac-result-summary", `${result.passed} de ${result.required} señales comprobadas.`);
    const list = element("ul", "ac-evidence-list");

    result.evidence.forEach((evidence) => {
      const item = element("li", "ac-evidence-item");
      item.dataset.pass = String(evidence.pass);
      const mark = element("span", "ac-evidence-item__mark", evidence.pass ? "✓" : "×");
      mark.setAttribute("aria-hidden", "true");
      const copy = element("div");
      copy.append(element("p", "", evidence.label));
      if (evidence.excerpt) copy.append(element("code", "", evidence.excerpt));
      item.append(mark, copy);
      list.append(item);
    });

    body.append(summary, list);
    content.append(title, body);
    container.append(icon, content);
  }

  function renderLab(lab) {
    workspace.replaceChildren();

    const header = element("header", "ac-lab-header");
    const meta = element("div", "ac-lab-header__meta");
    meta.append(
      element("span", "mui-badge mui-badge--accent", `Práctica ${lab.number}`),
      element("span", "mui-badge mui-badge--secondary", lab.level),
      element("span", "mui-badge", lab.duration),
    );
    const title = element("h2", "", lab.title);
    title.id = `title-${lab.id}`;
    header.append(meta, title, element("p", "", lab.objective));

    const layout = element("div", "ac-practice-layout");
    const commandColumn = element("div", "ac-command-column");
    const commandSection = element("section");
    commandSection.setAttribute("aria-labelledby", `commands-${lab.id}`);
    const commandTitle = element("h3", "ac-section-heading", "Comandos");
    commandTitle.id = `commands-${lab.id}`;
    const stack = element("div", "ac-command-stack");
    lab.commands.forEach((command, index) => stack.append(renderCommand(command, lab.id, index)));
    commandSection.append(commandTitle, stack);

    const warning = element("aside", "mui-callout mui-callout--warning", "");
    warning.setAttribute("role", "note");
    const warningIcon = element("span", "mui-callout__icon", "!");
    warningIcon.setAttribute("aria-hidden", "true");
    const warningContent = element("div", "mui-callout__content");
    warningContent.append(
      element("p", "mui-callout__title", "La página no ejecuta shell"),
      element("p", "mui-callout__body", "Corre los comandos en tu propia terminal. Aquí solo se valida texto que tú decides pegar."),
    );
    warning.append(warningIcon, warningContent);

    const procedure = element("section", "ac-procedure");
    procedure.setAttribute("aria-labelledby", `procedure-${lab.id}`);
    const procedureTitle = element("h3", "ac-section-heading", "Procedimiento");
    procedureTitle.id = `procedure-${lab.id}`;
    const steps = element("ol", "mui-steps");
    lab.steps.forEach((step, index) => {
      const item = element("li", "mui-steps__item");
      const marker = element("span", "mui-steps__marker");
      marker.setAttribute("aria-hidden", "true");
      item.append(marker, element("p", "mui-steps__title", `Paso ${index + 1}`), element("p", "mui-steps__body", step));
      steps.append(item);
    });
    procedure.append(procedureTitle, steps);
    commandColumn.append(commandSection, warning, procedure);

    const evidenceColumn = element("div", "ac-evidence-column");
    const evidencePanel = element("section", "ac-evidence-panel");
    evidencePanel.setAttribute("aria-labelledby", `evidence-${lab.id}`);
    const evidenceTitle = element("h3", "ac-section-heading", "Evidencia");
    evidenceTitle.id = `evidence-${lab.id}`;
    const field = element("div", "ac-field");
    const label = element("label", "", "Salida real de tu terminal");
    label.htmlFor = `output-${lab.id}`;
    const hint = element("p", "ac-field-hint", lab.evidenceHint);
    hint.id = `hint-${lab.id}`;
    const textarea = element("textarea", "mui-textarea ac-output");
    textarea.id = `output-${lab.id}`;
    textarea.placeholder = "Pega aquí la salida completa, sin resumirla…";
    textarea.setAttribute("aria-describedby", hint.id);
    textarea.spellcheck = false;
    textarea.value = state.drafts[lab.id] ?? "";
    field.append(label, hint, textarea);

    const actions = element("div", "ac-actions");
    const verify = element("button", "mui-btn mui-btn--primary", "Verificar evidencia");
    verify.type = "button";
    const clear = element("button", "mui-btn mui-btn--ghost", "Borrar salida");
    clear.type = "button";
    actions.append(verify, clear);

    const result = element("div", "ac-result");
    result.hidden = true;
    result.tabIndex = -1;
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");

    let inputTimer;
    textarea.addEventListener("input", () => {
      window.clearTimeout(inputTimer);
      if (state.completed.includes(lab.id)) {
        state.completed = state.completed.filter((id) => id !== lab.id);
        renderNavigation();
        updateProgress();
      }
      inputTimer = window.setTimeout(() => {
        state.drafts[lab.id] = textarea.value;
        writeState();
      }, 200);
      result.hidden = true;
    });

    verify.addEventListener("click", () => {
      const verification = verifyLab(lab.id, textarea.value);
      state.drafts[lab.id] = textarea.value;
      if (verification.valid && !state.completed.includes(lab.id)) state.completed.push(lab.id);
      if (!verification.valid) state.completed = state.completed.filter((id) => id !== lab.id);
      writeState();
      appendResult(result, verification);
      renderNavigation();
      updateProgress();
      result.focus();
    });

    clear.addEventListener("click", () => {
      textarea.value = "";
      delete state.drafts[lab.id];
      state.completed = state.completed.filter((id) => id !== lab.id);
      writeState();
      result.hidden = true;
      renderNavigation();
      updateProgress();
      textarea.focus();
    });

    evidencePanel.append(evidenceTitle, field, actions, result);
    evidenceColumn.append(evidencePanel);

    const currentIndex = labs.findIndex((item) => item.id === lab.id);
    if (currentIndex < labs.length - 1) {
      const next = element("div", "ac-next");
      const nextButton = element("button", "mui-btn mui-btn--secondary", `Siguiente: ${labs[currentIndex + 1].shortTitle}`);
      nextButton.type = "button";
      nextButton.addEventListener("click", () => selectLab(labs[currentIndex + 1].id, { focus: true }));
      next.append(nextButton);
      evidenceColumn.append(next);
    }

    layout.append(commandColumn, evidenceColumn);
    workspace.append(header, layout);

    const savedOutput = state.drafts[lab.id] ?? "";
    if (savedOutput && state.completed.includes(lab.id)) {
      const restored = verifyLab(lab.id, savedOutput);
      if (restored.valid) appendResult(result, restored, { restored: true });
    }
  }

  function selectLab(id, { focus = false, updateHash = true } = {}) {
    const lab = getLab(id);
    if (!lab) return;
    activeId = id;
    renderNavigation();
    renderLab(lab);
    if (updateHash) history.replaceState(null, "", `#${id}`);
    if (focus) {
      workspace.focus({ preventScroll: true });
      workspace.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.addEventListener("hashchange", () => selectLab(location.hash.slice(1), { updateHash: false }));

  const initialId = getLab(location.hash.slice(1))?.id ?? labs[0].id;
  selectLab(initialId, { updateHash: location.hash.slice(1) !== initialId });
  updateProgress();
}());
