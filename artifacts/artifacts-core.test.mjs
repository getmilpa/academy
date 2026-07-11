import assert from "node:assert/strict";
import test from "node:test";

/* artifacts-core.js es script clásico (expone globalThis.AcademyCore para
   funcionar también en file://); el test lo carga por side effect. */
await import("./artifacts-core.js");
const {
  CHAOS_MODULES,
  MODULE_CATALOG,
  conceptualPipelineResult,
  coupleCheck,
  createGenerationPlan,
  decideVerification,
  evaluatePlanting,
  evaluateThemePair,
  frontierProject,
  projectOperation,
  projectProcess,
  resolveModuleOrder,
  runtimeTrace,
} = globalThis.AcademyCore;

test("planting accepts providers before consumers", () => {
  const database = MODULE_CATALOG.find((module) => module.id === "database");
  const payments = MODULE_CATALOG.find((module) => module.id === "payments");

  assert.deepEqual(evaluatePlanting(payments, []).missing, ["bd"]);
  assert.equal(evaluatePlanting(payments, [database]).accepted, true);
});

test("Kahn resolution returns providers before consumers", () => {
  const result = resolveModuleOrder([...MODULE_CATALOG].reverse());
  const ids = result.order.map((module) => module.id);

  assert.equal(result.ok, true);
  assert.ok(ids.indexOf("database") < ids.indexOf("payments"));
  assert.ok(ids.indexOf("queue") < ids.indexOf("mail"));
  assert.ok(ids.indexOf("payments") < ids.indexOf("store"));
  assert.ok(ids.indexOf("mail") < ids.indexOf("store"));
});

test("cycle detection reports a closed path", () => {
  const result = resolveModuleOrder(CHAOS_MODULES);

  assert.equal(result.ok, false);
  assert.deepEqual(result.cycle, ["A", "B", "A"]);
});

test("denied conceptual calls skip execution but still audit", () => {
  const result = conceptualPipelineResult({ hasPermission: false });
  const statuses = Object.fromEntries(result.stages.map((stage) => [stage.id, stage.status]));

  assert.equal(statuses.authorize, "denied");
  assert.equal(statuses.execute, "skipped");
  assert.equal(statuses.audit, "complete");
});

test("runtime trace distinguishes explicitly audited and uncovered exits", () => {
  assert.match(runtimeTrace("authorization").auditCoverage, /auditada/);
  assert.match(runtimeTrace("veto").auditCoverage, /sin auditoría explícita/);
});

test("verification rejects self-decision by construction", () => {
  const result = decideVerification({
    requester: "agent:bot-severo",
    decider: "agent:bot-severo",
    decision: "approved",
  });

  assert.equal(result.accepted, false);
  assert.equal(result.status, "rejected_by_construction");
});

test("event projection can be replayed to any point", () => {
  const events = [
    { type: "process.requested", actor: "agent:bot-severo" },
    { type: "verification.requested" },
    { type: "verification.waived", actor: "member:42" },
    { type: "execution.started" },
    { type: "process.completed" },
  ];

  assert.equal(projectProcess(events, 2).state, "esperando verificación");
  assert.equal(projectProcess(events, 3).waived, true);
  assert.equal(projectProcess(events).state, "completado");
});

test("theme evaluation composites translucent surfaces before contrast", () => {
  const opaque = evaluateThemePair({
    text: "#FAF5EF",
    surface: "#372F27",
    background: "#17120D",
    surfaceAlpha: 1,
  });
  const translucent = evaluateThemePair({
    text: "#FAF5EF",
    surface: "#FFFFFF",
    background: "#17120D",
    surfaceAlpha: 0.7,
  });

  assert.equal(opaque.passes, true);
  assert.equal(translucent.passes, false);
});

test("WriteGuard model blocks an existing target unless force is explicit", () => {
  assert.equal(createGenerationPlan({ targetExists: true }).writable, false);
  assert.equal(createGenerationPlan({ targetExists: true, force: true }).writable, true);
});

const OP = Object.freeze({ name: "crear:tarea", mutating: true, requiresConfirmation: true, scopes: ["tarea:crear"] });

test("HTTP surface derives verb, path and status from mutating + name", () => {
  const r = projectOperation(OP, "http");
  assert.equal(r.verb, "POST");
  assert.equal(r.path, "/crear/tarea");
  assert.equal(r.statusCode, 201);
});
test("removing the scope denies MCP but not CLI or HTTP (the audited asymmetry)", () => {
  assert.equal(projectOperation(OP, "mcp", { scopeGranted: false }).outcome, "denied");
  assert.equal(projectOperation(OP, "cli", { scopeGranted: false }).outcome, "success");
  assert.equal(projectOperation(OP, "http", { scopeGranted: false }).outcome, "success");
});
test("a denied projection skips execution but still audits", () => {
  const s = Object.fromEntries(projectOperation(OP, "mcp", { scopeGranted: false }).stages.map((x) => [x.id, x.status]));
  assert.equal(s.authorize, "denied"); assert.equal(s.execute, "skipped"); assert.equal(s.audit, "complete");
});
test("scopesEnforced is true only for MCP", () => {
  assert.equal(projectOperation(OP, "mcp").scopesEnforced, true);
  assert.equal(projectOperation(OP, "cli").scopesEnforced, false);
  assert.equal(projectOperation(OP, "http").scopesEnforced, false);
});
test("projectOperation emits neutral codes, no locale prose", () => {
  const denied = projectOperation(OP, "mcp", { scopeGranted: false });
  assert.equal(denied.reason, undefined);
  assert.equal(denied.reasonCode, "missing_scope");
  assert.equal(denied.scope, "tarea:crear");
  const stagesById = Object.fromEntries(denied.stages.map((stage) => [stage.id, stage]));
  assert.equal(stagesById.authorize.noteCode, "denied_missing_scope");
  assert.equal("note" in stagesById.authorize, false);
  assert.equal(stagesById.audit.noteCode, "denied_still_audits");
  for (const stage of denied.stages) {
    assert.equal("note" in stage, false);
  }

  const success = projectOperation(OP, "mcp");
  assert.equal(success.reasonCode, "applied");
  assert.equal(success.scope, null);
});

/* frontierProject: el motor de la frontera SOLO reporta si un código está en el
   mapa; no decide el passthrough (esa es la lección — el consumidor decide, y ahí
   se filtra el idioma equivocado). Neutro: sin prosa, sin locale. */
test("frontierProject reports the mapped value when the code is in the map", () => {
  const map = { "sin iniciar": "not started", detenido: "stopped" };
  assert.deepEqual(frontierProject("detenido", map), { code: "detenido", mapped: true, value: "stopped" });
});
test("frontierProject reports mapped:false / value:null for a code the map does not cover (the leak)", () => {
  const map = { "sin iniciar": "not started" };
  assert.deepEqual(frontierProject("detenido", map), { code: "detenido", mapped: false, value: null });
});
test("frontierProject on an empty map never claims coverage", () => {
  assert.deepEqual(frontierProject("detenido", {}), { code: "detenido", mapped: false, value: null });
});
test("frontierProject: a code absent from a map that still has orphan keys is unmapped, not passed through", () => {
  const map = { orphan_a: "A", orphan_b: "B" };
  const r = frontierProject("detenido", map);
  assert.equal(r.mapped, false);
  assert.equal(r.value, null);
});

/* coupleCheck: acopla los códigos que EMITE el núcleo con las claves que TRADUCE
   el mapa de la frontera. missing = un código sin traducción (se filtraría en
   prod); orphan = una clave muerta que el núcleo ya no emite. ok sólo si la
   cobertura es total en ambos sentidos. Neutro: opera sobre arrays de códigos. */
test("coupleCheck is ok when core codes and map keys cover each other exactly", () => {
  const r = coupleCheck(["a", "b", "c"], ["c", "b", "a"]);
  assert.deepEqual(r, { missing: [], orphan: [], ok: true });
});
test("coupleCheck detects a core code with no map key (missing translation)", () => {
  const r = coupleCheck(["a", "b", "c"], ["a", "b"]);
  assert.deepEqual(r.missing, ["c"]);
  assert.deepEqual(r.orphan, []);
  assert.equal(r.ok, false);
});
test("coupleCheck detects a map key the core never emits (orphan)", () => {
  const r = coupleCheck(["a", "b"], ["a", "b", "z"]);
  assert.deepEqual(r.missing, []);
  assert.deepEqual(r.orphan, ["z"]);
  assert.equal(r.ok, false);
});
test("coupleCheck reports both a missing translation and an orphan key at once", () => {
  const r = coupleCheck(["a", "b", "c"], ["a", "b", "z"]);
  assert.deepEqual(r.missing, ["c"]);
  assert.deepEqual(r.orphan, ["z"]);
  assert.equal(r.ok, false);
});
