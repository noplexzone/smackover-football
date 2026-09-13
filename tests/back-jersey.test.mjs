import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { jerseySvg } from "../scripts/jersey.mjs";
test("player jerseys are rear views with surnames and safe text", async () => {
  const data = JSON.parse(await readFile("src/data.json"));
  const html = await readFile("dist/roster.html", "utf8");
  for (const p of data.players) {
    const file = `assets/jersey-back-${p.id}.svg`;
    assert.ok(html.includes(file));
    const svg = await readFile("dist/" + file, "utf8");
    assert.ok(svg.includes(p.name.split(" ").at(-1).toUpperCase()));
    assert.match(svg, /data-view="back"/);
    assert.ok(svg.includes(`data-number="${p.number}"`));
    assert.doesNotMatch(svg, /BUCKAROOS|UniformScript/);
  }
  assert.ok(jerseySvg(6, "home", "A<&").includes("A&lt;&amp;"));
});
test("stylesheet and interaction script use content revision URLs", async () => {
  const html = await readFile("dist/roster.html", "utf8");
  assert.match(html, /styles\.css\?v=[a-f0-9]{12}/);
  assert.match(html, /roster\.js\?v=[a-f0-9]{12}/);
});
