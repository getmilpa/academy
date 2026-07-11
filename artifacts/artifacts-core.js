(() => {
"use strict";
/* Los campos de PROSA de estas tablas de datos viajan como {es,en} (Task 4):
   el consumidor (artifacts.js) resuelve el idioma con pick(). id/shortName/
   provides/requires son CÓDIGOS del grafo (cableado semántico) — se preservan
   neutros en ambos idiomas para que la lógica (resolveModuleOrder,
   evaluatePlanting) no cambie. El átomo cross-origin (milpa-artifact.js) NO
   consume estas tablas, así que el cambio es seguro para su embed. */
const MODULE_CATALOG = Object.freeze([
  {
    id: "database",
    name: { es: "Base de datos", en: "Database" },
    shortName: "BD",
    provides: ["bd"],
    requires: [],
    description: { es: "Persistencia para pagos y datos de la tienda.", en: "Persistence for payments and store data." },
  },
  {
    id: "queue",
    name: { es: "Cola", en: "Queue" },
    shortName: "cola",
    provides: ["cola"],
    requires: [],
    description: { es: "Entrega trabajo asíncrono al módulo de correo.", en: "Delivers async work to the mail module." },
  },
  {
    id: "mail",
    name: { es: "Correo", en: "Mail" },
    shortName: "mail",
    provides: ["correo"],
    requires: ["cola"],
    description: { es: "Envía notificaciones sin conocer la cola por dentro.", en: "Sends notifications without knowing the queue internals." },
  },
  {
    id: "payments",
    name: { es: "Pagos", en: "Payments" },
    shortName: "pagos",
    provides: ["pagos"],
    requires: ["bd"],
    description: { es: "Registra cobros mediante una capacidad de persistencia.", en: "Records charges through a persistence capability." },
  },
  {
    id: "store",
    name: { es: "Tienda", en: "Store" },
    shortName: "tienda",
    provides: ["tienda"],
    requires: ["correo", "pagos"],
    description: { es: "Compone correo y pagos sin acoplarse a sus clases.", en: "Composes mail and payments without coupling to their classes." },
  },
]);

const CHAOS_MODULES = Object.freeze([
  {
    id: "chaos-a",
    name: { es: "Módulo A", en: "Module A" },
    shortName: "A",
    provides: ["capacidad-a"],
    requires: ["capacidad-b"],
  },
  {
    id: "chaos-b",
    name: { es: "Módulo B", en: "Module B" },
    shortName: "B",
    provides: ["capacidad-b"],
    requires: ["capacidad-a"],
  },
]);

const CONCEPTUAL_PIPELINE = Object.freeze([
  { id: "resolve", label: "resolver" },
  { id: "validate", label: "validar" },
  { id: "authorize", label: "autorizar" },
  { id: "execute", label: "ejecutar" },
  { id: "audit", label: "auditar" },
]);

const SURFACES = Object.freeze([
  { id: "cli", label: "coa" },
  { id: "mcp", label: "MCP" },
  { id: "http", label: "POST" },
]);

function deriveHttpPath(name) {
  return "/" + name.split(":").map((segment) => segment.replace(/_/g, "-")).join("/");
}

function projectOperation(op, surface, { scopeGranted = true } = {}) {
  const scopesEnforced = surface === "mcp";
  const denied = !scopeGranted && scopesEnforced;
  const missingScope = op.scopes?.[0] ?? "scope";

  const stages = CONCEPTUAL_PIPELINE.map((stage) => {
    if (!denied) {
      return { id: stage.id, status: "complete" };
    }
    if (stage.id === "authorize") {
      return { id: stage.id, status: "denied", noteCode: "denied_missing_scope" };
    }
    if (stage.id === "execute") {
      return { id: stage.id, status: "skipped" };
    }
    if (stage.id === "audit") {
      return { id: stage.id, status: "complete", noteCode: "denied_still_audits" };
    }
    return { id: stage.id, status: "complete" };
  });

  const meta = { surface };
  if (surface === "cli") {
    meta.invocation = `coa ${op.name} --titulo=…${op.requiresConfirmation ? " --yes" : ""}`;
    meta.confirmCode = op.requiresConfirmation ? "flag" : "none";
  } else if (surface === "mcp") {
    meta.invocation = `tools/call · ${op.name}`;
    meta.confirmCode = op.requiresConfirmation ? "inherited-gate" : "none";
  } else {
    meta.verb = op.mutating ? "POST" : "GET";
    meta.statusCode = op.mutating ? 201 : 200;
    meta.path = deriveHttpPath(op.name);
    meta.invocation = `${meta.verb} ${meta.path}`;
    meta.confirmCode = op.requiresConfirmation ? "token" : "none";
  }

  return {
    ...meta,
    scopesEnforced,
    stages,
    outcome: denied ? "denied" : "success",
    reasonCode: denied ? "missing_scope" : "applied",
    scope: denied ? missingScope : null,
  };
}

/* label/note son prosa bilingüe {es,en}; id es el código de etapa (neutro).
   runtimeTrace hace spread de ...stage pero sólo depende de stage.id, así que
   la lógica no cambia. renderRuntimeRail (artifacts.js) resuelve con pick(). */
const RUNTIME_STAGES = Object.freeze([
  { id: "resolve", label: { es: "Resolver", en: "Resolve" }, note: { es: "Busca la tool declarada.", en: "Looks up the declared tool." } },
  { id: "validate", label: { es: "Validar", en: "Validate" }, note: { es: "Valida el schema de entrada.", en: "Validates the input schema." } },
  { id: "clamp", label: { es: "Acotar", en: "Clamp" }, note: { es: "Aplica límites declarados a los argumentos.", en: "Applies declared limits to the arguments." } },
  { id: "authorize", label: { es: "Autorizar", en: "Authorize" }, note: { es: "Evalúa scopes y PolicyGate.", en: "Evaluates scopes and PolicyGate." } },
  { id: "rate-limit", label: { es: "Rate limit", en: "Rate limit" }, note: { es: "Consume presupuesto por caller y tool.", en: "Consumes budget per caller and tool." } },
  { id: "plan-confirm", label: { es: "Plan / confirmar", en: "Plan / confirm" }, note: { es: "Previsualiza o solicita confirmación.", en: "Previews or requests confirmation." } },
  { id: "intercept", label: { es: "Interceptar", en: "Intercept" }, note: { es: "Permite cache, reemplazo o veto después de auth.", en: "Allows cache, replacement or veto after auth." } },
  { id: "execute", label: { es: "Ejecutar", en: "Execute" }, note: { es: "Invoca el callback y mide el tiempo.", en: "Invokes the callback and measures the time." } },
  { id: "audit", label: { es: "Auditar", en: "Audit" }, note: { es: "Emite tool.executed o tool.failed.", en: "Emits tool.executed or tool.failed." } },
]);

const FAILURE_STAGE = Object.freeze({
  validation: "validate",
  authorization: "authorize",
  "rate-limit": "rate-limit",
  confirmation: "plan-confirm",
  veto: "intercept",
  execution: "execute",
});

function availableCapabilities(modules, baseCapabilities = ["config"]) {
  const capabilities = new Set(baseCapabilities);

  for (const module of modules) {
    for (const capability of module.provides ?? []) {
      capabilities.add(capability);
    }
  }

  return [...capabilities];
}

function evaluatePlanting(module, plantedModules, baseCapabilities = ["config"]) {
  const available = new Set(availableCapabilities(plantedModules, baseCapabilities));
  const missing = (module.requires ?? []).filter((capability) => !available.has(capability));

  return {
    accepted: missing.length === 0,
    missing,
    available: [...available],
  };
}

function findCycle(edges, nodeIds) {
  const active = new Set();
  const visited = new Set();
  const stack = [];

  function visit(nodeId) {
    if (active.has(nodeId)) {
      const start = stack.indexOf(nodeId);
      return [...stack.slice(start), nodeId];
    }

    if (visited.has(nodeId)) {
      return null;
    }

    visited.add(nodeId);
    active.add(nodeId);
    stack.push(nodeId);

    for (const next of edges.get(nodeId) ?? []) {
      const cycle = visit(next);
      if (cycle) {
        return cycle;
      }
    }

    stack.pop();
    active.delete(nodeId);
    return null;
  }

  for (const nodeId of nodeIds) {
    const cycle = visit(nodeId);
    if (cycle) {
      return cycle;
    }
  }

  return [];
}

function resolveModuleOrder(modules, baseCapabilities = ["config"]) {
  const byId = new Map(modules.map((module) => [module.id, module]));
  const providers = new Map();
  const duplicates = [];

  for (const module of modules) {
    for (const capability of module.provides ?? []) {
      if (providers.has(capability)) {
        duplicates.push({
          capability,
          providers: [providers.get(capability), module.id],
        });
      } else {
        providers.set(capability, module.id);
      }
    }
  }

  const base = new Set(baseCapabilities);
  const missing = [];
  const edges = new Map(modules.map((module) => [module.id, new Set()]));
  const indegree = new Map(modules.map((module) => [module.id, 0]));

  for (const module of modules) {
    for (const capability of module.requires ?? []) {
      if (base.has(capability)) {
        continue;
      }

      const providerId = providers.get(capability);
      if (!providerId) {
        missing.push({ module: module.id, capability });
        continue;
      }

      if (!edges.get(providerId).has(module.id)) {
        edges.get(providerId).add(module.id);
        indegree.set(module.id, indegree.get(module.id) + 1);
      }
    }
  }

  if (missing.length > 0) {
    return { ok: false, order: [], missing, cycle: [], duplicates };
  }

  const queue = modules
    .filter((module) => indegree.get(module.id) === 0)
    .map((module) => module.id);
  const order = [];

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);

    for (const consumer of edges.get(current) ?? []) {
      const nextDegree = indegree.get(consumer) - 1;
      indegree.set(consumer, nextDegree);
      if (nextDegree === 0) {
        queue.push(consumer);
      }
    }
  }

  if (order.length !== modules.length) {
    const unresolved = modules
      .map((module) => module.id)
      .filter((id) => !order.includes(id));
    const cycleIds = findCycle(edges, unresolved);

    return {
      ok: false,
      order,
      missing: [],
      cycle: cycleIds.map((id) => byId.get(id)?.shortName ?? id),
      duplicates,
    };
  }

  return {
    ok: true,
    order: order.map((id) => byId.get(id)),
    missing: [],
    cycle: [],
    duplicates,
  };
}

function conceptualPipelineResult({ hasPermission = true } = {}) {
  const denied = !hasPermission;

  return {
    outcome: denied ? "denied" : "success",
    reason: denied ? "denegado: falta correo:enviar" : "correo enviado",
    stages: CONCEPTUAL_PIPELINE.map((stage) => {
      if (!denied) {
        return { ...stage, status: "complete" };
      }
      if (stage.id === "authorize") {
        return { ...stage, status: "denied" };
      }
      if (stage.id === "execute") {
        return { ...stage, status: "skipped" };
      }
      return { ...stage, status: "complete" };
    }),
  };
}

function runtimeTrace(failure = "none") {
  const stopAt = FAILURE_STAGE[failure] ?? null;
  let stopped = false;

  const stages = RUNTIME_STAGES.map((stage) => {
    if (stopped) {
      return { ...stage, status: "skipped" };
    }

    if (stage.id === stopAt) {
      stopped = true;
      return { ...stage, status: "failed" };
    }

    return { ...stage, status: "complete" };
  });

  const explicitAudit = new Set(["validation", "authorization", "rate-limit", "execution"]);
  const auditCoverage = failure === "none"
    ? "tool.executed"
    : explicitAudit.has(failure)
      ? "ruta auditada explícitamente"
      : "retorno sin auditoría explícita en ToolRegistry::call()";

  return {
    outcome: failure === "none" ? "success" : "stopped",
    failure,
    stages,
    auditCoverage,
  };
}

function decideVerification({ requester, decider, decision }) {
  if (!requester || !decider) {
    throw new TypeError("requester and decider are required");
  }

  if (!["approved", "rejected", "waived"].includes(decision)) {
    throw new RangeError(`unsupported decision: ${decision}`);
  }

  if (requester === decider) {
    return {
      accepted: false,
      status: "rejected_by_construction",
      reason: "el principal que abrió la compuerta no puede resolverla por esa misma ruta",
    };
  }

  return {
    accepted: true,
    status: decision,
    reason: decision === "waived" ? "compuerta exonerada explícitamente" : null,
  };
}

function projectProcess(events, until = events.length) {
  const projection = {
    state: "sin iniciar",
    verification: "ninguna",
    actor: null,
    waived: false,
    applied: 0,
  };

  for (const event of events.slice(0, Math.max(0, until))) {
    projection.applied += 1;
    projection.actor = event.actor ?? projection.actor;

    switch (event.type) {
      case "process.requested":
        projection.state = "solicitado";
        break;
      case "verification.requested":
        projection.state = "esperando verificación";
        projection.verification = "pendiente";
        break;
      case "verification.approved":
        projection.state = "listo para ejecutar";
        projection.verification = "aprobada";
        break;
      case "verification.rejected":
        projection.state = "detenido";
        projection.verification = "rechazada";
        break;
      case "verification.waived":
        projection.state = "listo para ejecutar";
        projection.verification = "exonerada";
        projection.waived = true;
        break;
      case "execution.started":
        projection.state = "ejecutando";
        break;
      case "process.completed":
        projection.state = "completado";
        break;
      case "process.failed":
        projection.state = "fallido";
        break;
      default:
        break;
    }
  }

  return projection;
}

function normalizeChannel(channel) {
  return Math.max(0, Math.min(255, channel)) / 255;
}

function linearize(channel) {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function hexToRgb(hex) {
  const normalized = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new TypeError(`invalid six-digit hex color: ${hex}`);
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function compositeColor(foreground, background, alpha = 1) {
  const amount = Math.max(0, Math.min(1, Number(alpha)));
  return {
    r: Math.round(foreground.r * amount + background.r * (1 - amount)),
    g: Math.round(foreground.g * amount + background.g * (1 - amount)),
    b: Math.round(foreground.b * amount + background.b * (1 - amount)),
  };
}

function contrastRatio(foreground, background) {
  const luminance = (color) => (
    0.2126 * linearize(normalizeChannel(color.r))
    + 0.7152 * linearize(normalizeChannel(color.g))
    + 0.0722 * linearize(normalizeChannel(color.b))
  );
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));

  return (light + 0.05) / (dark + 0.05);
}

function evaluateThemePair({
  text,
  surface,
  background,
  surfaceAlpha = 1,
  minimum = 4.5,
}) {
  const textRgb = typeof text === "string" ? hexToRgb(text) : text;
  const surfaceRgb = typeof surface === "string" ? hexToRgb(surface) : surface;
  const backgroundRgb = typeof background === "string" ? hexToRgb(background) : background;
  const effectiveSurface = compositeColor(surfaceRgb, backgroundRgb, surfaceAlpha);
  const ratio = contrastRatio(textRgb, effectiveSurface);

  return {
    ratio,
    passes: ratio >= minimum,
    effectiveSurface,
    minimum,
  };
}

function createGenerationPlan({ targetExists = false, force = false } = {}) {
  const files = [
    "src/Plugins/Shop/Entities/Product.php",
    "src/Plugins/Shop/Repositories/ProductRepository.php",
    "src/Plugins/Shop/ShopPlugin.php",
  ];
  const writable = !targetExists || force;

  return {
    files: files.map((path, index) => ({
      path,
      status: targetExists && index === 0 && !force ? "blocked" : "planned",
    })),
    verifyKind: "entity",
    verifyTarget: "App\\Plugins\\Shop\\Entities\\Product",
    writable,
    reason: writable ? null : `${files[0]} already exists (use --force to overwrite)`,
  };
}

/* Exposición para navegador (script clásico — funciona en file:// donde los
   módulos ES no cargan) y para el test (que lo importa por side effect). */
globalThis.AcademyCore = Object.freeze({
  MODULE_CATALOG,
  CHAOS_MODULES,
  CONCEPTUAL_PIPELINE,
  SURFACES,
  RUNTIME_STAGES,
  availableCapabilities,
  evaluatePlanting,
  resolveModuleOrder,
  conceptualPipelineResult,
  projectOperation,
  runtimeTrace,
  decideVerification,
  projectProcess,
  hexToRgb,
  compositeColor,
  contrastRatio,
  evaluateThemePair,
  createGenerationPlan,
});
})();
