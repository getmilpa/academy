import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const catalog = require("./catalog.js");
const labsCatalog = require("../labs/catalog.js");
const { pick } = require("../i18n.js");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("el catálogo público tiene cuatro rutas completas y IDs estables", () => {
  assert.equal(catalog.tracks.length, 4);
  const trackIds = new Set();
  const unitKeys = new Set();

  for (const track of catalog.tracks) {
    assert.match(track.id, /^[a-z0-9-]+$/);
    assert.equal(track.visibility, "public");
    assert.equal(track.packId, "academy-public");
    assert.ok(!trackIds.has(track.id), "ruta duplicada: " + track.id);
    trackIds.add(track.id);
    assert.ok(track.title && track.summary && track.level && track.audience);
    assert.ok(Number.isInteger(track.durationMinutes) && track.durationMinutes > 0);
    assert.ok(Array.isArray(track.units) && track.units.length > 0);

    for (const unit of track.units) {
      const key = track.id + "/" + unit.id;
      assert.match(unit.id, /^[a-z0-9-]+$/);
      assert.ok(!unitKeys.has(key), "unidad duplicada: " + key);
      unitKeys.add(key);
      assert.ok(unit.title && Number.isInteger(unit.durationMinutes));
      assert.ok(unit.objectives.length >= 2);
      assert.ok(unit.understand.length >= 1);
      assert.ok(unit.see.label && unit.see.href && unit.see.note);
      assert.ok(unit.do.label && unit.do.href && Array.isArray(unit.do.commands));
      assert.ok(unit.verify.length >= 2);
      assert.ok(unit.sources.length >= 1);
      assert.match(unit.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
  assert.equal(unitKeys.size, 20);
});

test("las prerrequisitos forman un grafo válido y acíclico", () => {
  const tracks = new Map(catalog.tracks.map((track) => [track.id, track]));
  const visiting = new Set();
  const visited = new Set();

  function visit(id) {
    assert.ok(tracks.has(id), "prerrequisito inexistente: " + id);
    if (visited.has(id)) return;
    assert.ok(!visiting.has(id), "ciclo curricular en " + id);
    visiting.add(id);
    for (const dependency of tracks.get(id).prerequisites) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }

  for (const id of tracks.keys()) visit(id);
  assert.equal(visited.size, tracks.size);
});

test("todos los destinos locales del currículo existen y sus artifacts/labs conservan el hash", () => {
  for (const unit of catalog.allUnits()) {
    for (const destination of [unit.see, unit.do]) {
      if (/^[a-z]+:/i.test(destination.href)) continue;
      const [relative, fragment] = destination.href.split("#");
      let target = path.resolve(root, "learn", relative || ".");
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
      assert.ok(fs.existsSync(target), unit.trackId + "/" + unit.id + ": no existe " + destination.href);
      if (fragment && target.endsWith(path.join("artifacts", "index.html"))) {
        const html = fs.readFileSync(target, "utf8");
        assert.match(html, new RegExp("\\bid=[\"']" + fragment + "[\"']"), "hash ausente: " + fragment);
      }
      if (fragment && target.endsWith(path.join("labs", "index.html"))) {
        assert.ok(
          labsCatalog.getLab(fragment),
          unit.trackId + "/" + unit.id + ": lab inexistente en labs/catalog.js: " + fragment
        );
      }
    }
  }
});

test("ningún href apunta al repo inexistente getmilpa/design", () => {
  const raw = fs.readFileSync(path.join(root, "curriculum", "catalog.js"), "utf8");
  assert.ok(!raw.includes("github.com/getmilpa/design"),
    "github.com/getmilpa/design es 404 — el repo público es getmilpa/milpa-design");
});

test("catalog track metadata and unit titles are bilingual", () => {
  for (const track of catalog.tracks) {
    for (const f of ["title", "eyebrow", "summary", "level", "audience"]) {
      assert.ok(track[f] && track[f].es && track[f].en, `track ${track.id}.${f}`);
    }
    for (const unit of track.units) assert.ok(unit.title.es && unit.title.en, `unit ${unit.id}.title`);
  }
  assert.equal(typeof pick(catalog.tracks[0].title, "en"), "string");
});

test("catalog unit bodies are bilingual on every leaf", () => {
  for (const track of catalog.tracks) for (const unit of track.units) {
    for (const f of ["objectives", "understand", "verify"]) unit[f].forEach((leaf, i) => assert.ok(leaf.es && leaf.en, `${unit.id}.${f}[${i}]`));
    assert.ok(unit.see.label.es && unit.see.label.en); assert.ok(unit.see.note.es && unit.see.note.en);
    assert.ok(unit.do.label.es && unit.do.label.en);
    unit.sources.forEach((s, i) => assert.ok(s.label.es && s.label.en, `${unit.id}.sources[${i}]`));
  }
});

test("un pack privado requiere visibilidad interna y no colisiona con lo público", () => {
  assert.throws(
    () => catalog.registerPack({ id: "bad", tracks: [{ id: "oculta", units: [{ id: "u" }] }] }),
    /visibility: internal/
  );
  assert.throws(
    () => catalog.registerPack({ id: "bad", tracks: [{ id: "fundamentos", visibility: "internal", units: [{ id: "u" }] }] }),
    /id único/
  );
  assert.equal(catalog.tracks.filter((track) => track.visibility === "internal").length, 0);
});
