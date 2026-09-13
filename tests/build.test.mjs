import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat, readdir } from "node:fs/promises";
const pages = ["index", "roster"];
for (const page of pages)
  test(`${page}: resources and two-page navigation`, async () => {
    const html = await readFile(`dist/${page}.html`, "utf8");
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /NOT AN OFFICIAL SCHOOL WEBSITE/);
    assert.doesNotMatch(html, /(schedule|program|gameday|community)\.html/);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"#]+)"/g))
      if (!url.startsWith("http"))
        assert.ok((await stat("dist/" + url)).isFile());
  });
test("only two built pages; retired routes absent", async () =>
  assert.deepEqual(
    (await readdir("dist")).filter((n) => n.endsWith(".html")).sort(),
    ["index.html", "roster.html"],
  ));
test("complete current roster and sourced stats", async () => {
  const d = JSON.parse(await readFile("src/data.json"));
  assert.equal(d.season, 2026);
  assert.equal(d.players.length, 42);
  assert.equal(new Set(d.players.map((p) => p.id)).size, 42);
  for (const p of d.players) {
    assert.ok(p.height && p.weight && p.source);
    assert.ok(Array.isArray(p.stats));
  }
  assert.equal(d.games.length, 2);
  assert.equal(
    d.games.reduce((s, g) => s + g.pointsFor, 0),
    93,
  );
  assert.equal(
    d.games.reduce((s, g) => s + g.pointsAgainst, 0),
    18,
  );
  assert.equal(d.players.filter((p) => p.positions.includes("QB")).length, 2);
});
test("CSS and SVG palette is neutral", async () => {
  for (const file of [
    "src/styles.css",
    ...["jersey", "stadium", "favicon"].map((n) => `src/assets/${n}.svg`),
  ]) {
    const s = await readFile(file, "utf8");
    for (const [, hex] of s.matchAll(
      /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/gi,
    )) {
      const rgb =
        hex.length <= 4
          ? hex
              .slice(0, 3)
              .split("")
              .map((x) => x + x)
          : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)];
      assert.ok(
        rgb.every((x) => x.toLowerCase() === rgb[0].toLowerCase()),
        `${file}: chromatic ${hex}`,
      );
    }
  }
});
