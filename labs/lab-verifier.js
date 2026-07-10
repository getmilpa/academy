(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MilpaLabVerifier = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function normalizeOutput(value) {
    return String(value ?? "")
      .replace(/\u001b\[[0-?]*[ -\/]*[@-~]/g, "")
      .replace(/\r\n?/g, "\n")
      .trim();
  }

  function countMatches(text, pattern) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    return [...text.matchAll(new RegExp(pattern.source, flags))].length;
  }

  function lineFor(text, pattern) {
    return text.split("\n").find((line) => pattern.test(line))?.trim() ?? "";
  }

  function patternRule(id, label, pattern) {
    return {
      id,
      label,
      inspect(text) {
        const excerpt = lineFor(text, pattern);
        return { pass: excerpt !== "", excerpt };
      },
    };
  }

  function countRule(id, label, pattern, minimum) {
    return {
      id,
      label,
      inspect(text) {
        const count = countMatches(text, pattern);
        return {
          pass: count >= minimum,
          excerpt: count > 0 ? `${count} ocurrencia(s); se requieren ${minimum}` : "",
        };
      },
    };
  }

  function evaluate(id, value, rules) {
    const output = normalizeOutput(value);
    const evidence = rules.map((rule) => ({ id: rule.id, label: rule.label, ...rule.inspect(output) }));
    const passed = evidence.filter((item) => item.pass).length;

    return Object.freeze({
      id,
      valid: output.length > 0 && passed === evidence.length,
      passed,
      required: evidence.length,
      evidence: Object.freeze(evidence.map(Object.freeze)),
    });
  }

  const doctorRules = Object.freeze([
    patternRule("doctor-header", "La sesión pertenece a `coa doctor`.", /milpa\s*[·.]\s*coa doctor/i),
    patternRule("doctor-root", "El comando reportó la raíz de la aplicación.", /^root:\s*\S+/i),
    patternRule("doctor-plugins", "El kernel contó plugins configurados y arrancados.", /\d+\s+plugin\(s\) configured,\s*\d+\s+booted:/i),
    patternRule("doctor-container", "La salida identifica el contenedor real.", /container:\s*[A-Za-z_\\][A-Za-z0-9_\\]+/i),
    patternRule("doctor-dispatcher", "La salida identifica el dispatcher real.", /dispatcher:\s*[A-Za-z_\\][A-Za-z0-9_\\]+/i),
    patternRule("doctor-routes", "El diagnóstico contó las rutas declaradas.", /\d+\s+route\(s\) declared\s*\(RouteProviderInterface plugins\)/i),
    patternRule("doctor-boot", "El kernel terminó de arrancar sin consultas a base de datos.", /kernel booted\s*[—-]\s*zero database queries\./i),
  ]);

  const capabilityRules = Object.freeze([
    countRule("validate-two-runs", "Hay dos ejecuciones de `coa validate`: antes y después de reparar.", /milpa\s*[·.]\s*coa validate/gi, 2),
    patternRule("validate-static", "La validación declara que ocurre antes de `boot()`.", /static pre-boot capability check\s*\(boot\(\) never runs\)/i),
    patternRule("validate-failure", "El primer grafo falla por `MailConsumer` y la capacidad `mailer` ausente.", /capability graph:.*Plugin\s+["']MailConsumer["']\s+requires\s+["']mailer["'],\s+which is not available\./i),
    patternRule("validate-success", "El segundo grafo satisface todos los contratos `requires/provides`.", /\d+\s+plugin\(s\) instantiate cleanly and satisfy every #\[PluginMetadata\] requires\/provides\./i),
  ]);

  const routeRules = Object.freeze([
    patternRule("route-controller-file", "El generador escribió `PingController.php`.", /wrote\s+\S*PingController\.php/i),
    patternRule("route-plugin-file", "El generador escribió `PingPlugin.php`.", /wrote\s+\S*PingPlugin\.php/i),
    patternRule("route-inspect", "La evidencia incluye `coa inspect:routes`.", /milpa\s*[·.]\s*coa inspect:routes/i),
    patternRule("route-row", "La tabla contiene `GET /academy-health`, su controller y `PingPlugin`.", /^\s*GET\s+\/academy-health\s+->\s+\S*PingController\S*\s+\[PingPlugin\]\s*$/im),
    patternRule("route-count", "La inspección cerró con un conteo de rutas.", /^\s*\d+\s+route\(s\)\.\s*$/im),
  ]);

  const toolRules = Object.freeze([
    patternRule("agent-header", "La sesión contiene `coa agent:enable`.", /milpa\s*[·.]\s*coa agent:enable\s*[—-]\s*enabling the agent-ready surface/i),
    patternRule("agent-packages", "La habilitación instaló `tool-runtime` y `mcp-server`.", /composer require milpa\/tool-runtime milpa\/mcp-server/i),
    patternRule("agent-enabled", "El comando confirmó la superficie MCP habilitada.", /agent-ready enabled\s*[—-]\s*bin\/mcp-server\.php now exposes your tools over MCP\./i),
    patternRule("tool-file", "El generador escribió `HealthSummaryTool.php`.", /wrote\s+\S*HealthSummaryTool\.php/i),
    patternRule("tool-inspect", "La evidencia incluye `coa inspect:tools`.", /milpa\s*[·.]\s*coa inspect:tools/i),
    patternRule("tool-row", "El registro expone `health_summary` con su descripción.", /^\s*health_summary\s+Summariza el estado de salud\.?\s*$/im),
    patternRule("tool-count", "La inspección cerró con herramientas registradas.", /^\s*[1-9]\d*\s+tool\(s\) registered\.\s*$/im),
  ]);

  const validators = Object.freeze({
    doctor: (output) => evaluate("doctor", output, doctorRules),
    capabilities: (output) => evaluate("capabilities", output, capabilityRules),
    route: (output) => evaluate("route", output, routeRules),
    tool: (output) => evaluate("tool", output, toolRules),
  });

  function verifyLab(id, output) {
    const validator = validators[id];
    if (!validator) throw new RangeError(`Laboratorio desconocido: ${id}`);
    return validator(output);
  }

  return Object.freeze({ normalizeOutput, verifyLab, validators });
}));
