import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { normalizeOutput, verifyLab } = require("./lab-verifier.js");

const doctorOutput = String.raw`milpa · coa doctor
root: /tmp/milpa-lab
✔ 1 plugin(s) configured, 1 booted: HelloPlugin
✔ container: Milpa\Container\DIContainer
✔ dispatcher: Symfony\Component\EventDispatcher\EventDispatcher
✔ 1 route(s) declared (RouteProviderInterface plugins)
✔ config: app.greeting = 'Hola desde Milpa'
✔ kernel booted — zero database queries.`;

const capabilityOutput = String.raw`milpa · coa validate — static pre-boot capability check (boot() never runs)
✗ capability graph: Plugin "MailConsumer" requires "mailer", which is not available.

milpa · coa validate — static pre-boot capability check (boot() never runs)
✔ 3 plugin(s) instantiate cleanly and satisfy every #[PluginMetadata] requires/provides.`;

const routeOutput = String.raw`✔ wrote /tmp/milpa-lab/src/Plugins/PingPlugin/Controllers/PingController.php
✔ wrote /tmp/milpa-lab/src/Plugins/PingPlugin/PingPlugin.php

milpa · coa inspect:routes

  GET        /academy-health          -> App\Plugins\PingPlugin\Controllers\PingController [PingPlugin]

2 route(s).`;

const toolOutput = String.raw`milpa · coa agent:enable — enabling the agent-ready surface (MCP/tools)
$ composer require milpa/tool-runtime milpa/mcp-server
✔ agent-ready enabled — bin/mcp-server.php now exposes your tools over MCP.
✔ wrote /tmp/milpa-lab/src/Plugins/HelloPlugin/Tools/HealthSummaryTool.php

milpa · coa inspect:tools

  health_summary                 Summariza el estado de salud

1 tool(s) registered.`;

test("normaliza ANSI y saltos de línea sin alterar la evidencia", () => {
  assert.equal(normalizeOutput("\u001b[32mok\u001b[0m\r\nnext\r\n"), "ok\nnext");
});

test("doctor acepta una salida completa del kernel", () => {
  const result = verifyLab("doctor", doctorOutput);
  assert.equal(result.valid, true);
  assert.equal(result.passed, result.required);
  assert.ok(result.required >= 7);
});

test("doctor rechaza un mensaje de éxito sin evidencia estructural", () => {
  const result = verifyLab("doctor", "milpa · coa doctor\n✔ kernel booted — zero database queries.");
  assert.equal(result.valid, false);
  assert.ok(result.passed < result.required);
});

test("capabilities exige el fallo y la reparación en dos corridas", () => {
  assert.equal(verifyLab("capabilities", capabilityOutput).valid, true);
  assert.equal(verifyLab("capabilities", capabilityOutput.split("\n\n")[1]).valid, false);
});

test("capabilities no acepta un fallo de otra capacidad", () => {
  const wrongCapability = capabilityOutput.replaceAll("mailer", "cache");
  assert.equal(verifyLab("capabilities", wrongCapability).valid, false);
});

test("route conecta archivos escritos, fila de ruta y conteo", () => {
  assert.equal(verifyLab("route", routeOutput).valid, true);
  assert.equal(verifyLab("route", routeOutput.replace("GET", "POST")).valid, false);
});

test("route rechaza una ruta con el handler correcto en el plugin equivocado", () => {
  assert.equal(verifyLab("route", routeOutput.replace("[PingPlugin]", "[OtherPlugin]")).valid, false);
});

test("tool exige opt-in, archivo generado y registro observable", () => {
  assert.equal(verifyLab("tool", toolOutput).valid, true);
  assert.equal(verifyLab("tool", toolOutput.replace("health_summary", "health_check")).valid, false);
});

test("tool rechaza agent-ready sin una tool registrada", () => {
  const enableOnly = toolOutput.split("✔ wrote")[0];
  assert.equal(verifyLab("tool", enableOnly).valid, false);
});

test("un id desconocido falla explícitamente", () => {
  assert.throws(() => verifyLab("missing", "anything"), /Laboratorio desconocido/);
});
