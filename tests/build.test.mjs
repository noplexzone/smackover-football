import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
const pages = [
  "index",
  "roster",
  "schedule",
  "program",
  "gameday",
  "community",
];
for (const page of pages)
  test(`${page}: semantic page and local resources`, async () => {
    const html = await readFile(`dist/${page}.html`, "utf8");
    assert.match(html, /<!doctype html>/i);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /NOT AN OFFICIAL SCHOOL WEBSITE/);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"#]+)"/g))
      if (!url.startsWith("http"))
        assert.ok((await stat("dist/" + url)).isFile());
  });
test("source profiles have unique ids and honest missing fields", async () => {
  const data = JSON.parse(await readFile("src/data.json"));
  assert.equal(
    new Set(data.players.map((p) => p.id)).size,
    data.players.length,
  );
  for (const p of data.players) {
    assert.ok(p.name);
    assert.ok(p.groups.length);
    assert.ok(!("rating" in p));
  }
});
