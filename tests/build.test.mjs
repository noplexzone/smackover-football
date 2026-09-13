import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat, readdir } from "node:fs/promises";
const pages = ["index", "roster"];
test("exact two-row formations and presentation-only aliases", async () => {
  const html = await readFile("dist/roster.html", "utf8");
  const data = JSON.parse(await readFile("src/data.json"));
  const expected = {
    offense: [
      ["OT", "OG", "C", "OG", "OT", "TE"],
      ["WR", "HB", "QB", "FB", "WR"],
    ],
    defense: [
      ["S", "OLB", "ILB", "ILB", "OLB", "S"],
      ["CB", "DE", "DT", "DE", "CB"],
    ],
  };
  const aliases = { OL: "OT", RB: "HB", NG: "DT", DB: "CB", MLB: "ILB" };
  for (const [unit, rows] of Object.entries(expected)) {
    const block = html.match(
      new RegExp(
        `<div class="unit-formation" data-unit="${unit}">([\\s\\S]*?)<!-- /unit -->`,
      ),
    )?.[1];
    assert.ok(block, `${unit} formation exists`);
    const renderedRows = [
      ...block.matchAll(/<div class="formation-row">([\s\S]*?)<!-- \/row -->/g),
    ];
    assert.deepEqual(
      renderedRows.map((r) =>
        [...r[1].matchAll(/data-position="([^"]+)"/g)].map((m) => m[1]),
      ),
      rows,
    );
    for (const code of new Set(rows.flat())) {
      const groups = [
        ...block.matchAll(
          /<section class="position-group" data-position="([^"]+)">([\s\S]*?)<\/section>/g,
        ),
      ].filter((m) => m[1] === code);
      const pools = groups.map((g) =>
        [...g[2].matchAll(/data-id="([^"]+)"/g)].map((m) => m[1]),
      );
      const ids = pools.flat();
      const expectedIds = data.players
        .filter((p) =>
          p.positions.some((pos) => (aliases[pos] || pos) === code),
        )
        .sort(
          (a, b) =>
            Number(a.number) - Number(b.number) || a.id.localeCompare(b.id),
        )
        .map((p) => p.id);
      pools.forEach((pool, index) =>
        assert.deepEqual(
          pool,
          expectedIds.filter((_, i) => i % pools.length === index),
        ),
      );
      assert.deepEqual(
        [...ids].sort(),
        expectedIds.sort(),
        `${unit} ${code} covers pool once`,
      );
      assert.ok(
        Math.max(...pools.map((p) => p.length)) -
          Math.min(...pools.map((p) => p.length)) <=
          1,
      );
    }
  }
  assert.equal((html.match(/<template id="detail-/g) || []).length, 42);
  assert.doesNotMatch(html, /data-position="(?:OL|NG|DB|RB)"/);
});
test("complete chronological schedule and supplied media", async () => {
  const html = await readFile("dist/index.html", "utf8");
  const data = JSON.parse(await readFile("src/data.json"));
  assert.equal(data.schedule?.length, 10);
  const rows = [
    ...html.matchAll(
      /<a class="result-row" data-status="([^"]+)"[\s\S]*?<\/a>/g,
    ),
  ];
  assert.equal(rows.length, 10);
  assert.equal(rows.filter((r) => r[1] === "final").length, 2);
  assert.equal(rows.filter((r) => r[1] === "scheduled").length, 8);
  for (const row of rows.filter((r) => r[1] === "scheduled")) {
    const date = row[0].match(/datetime="([^"]+)"/)[1];
    assert.ok(row[0].includes(data.schedule.find((g) => g.date === date).time));
    assert.match(row[0], /Scheduled/);
    assert.doesNotMatch(row[0], /class="schedule-score"/);
  }
  assert.deepEqual(
    rows.map((r) => r[0].match(/datetime="([^"]+)"/)[1]),
    data.schedule.map((g) => g.date).sort(),
  );
  for (const name of [
    "field.webp",
    "jersey-away-6.svg",
    "jersey-home-6.svg",
    "buckaroo-logo.png",
  ])
    assert.ok(html.includes(`assets/${name}`));
  assert.doesNotMatch(html, /assets\/(stadium|favicon|jersey)\.svg|brand-mark/);
  assert.match(html, /not independently verified/i);
});
for (const page of pages)
  test(`${page}: resources and two-page navigation`, async () => {
    const html = await readFile(`dist/${page}.html`, "utf8");
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /NOT AN OFFICIAL SCHOOL WEBSITE/);
    assert.doesNotMatch(html, /(schedule|program|gameday|community)\.html/);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"#]+)"/g))
      if (!url.startsWith("http"))
        assert.ok((await stat("dist/" + url.split("?")[0])).isFile());
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
