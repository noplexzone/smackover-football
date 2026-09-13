import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
test("reference-based jerseys replace crops and use every player's number", async () => {
  const data = JSON.parse(await readFile("src/data.json"));
  const home = await readFile("dist/index.html", "utf8");
  const roster = await readFile("dist/roster.html", "utf8");
  assert.doesNotMatch(home + roster, /uniform-(home|away)\.webp/);
  assert.match(home, /Reference-based illustrations/i);
  for (const player of data.players) {
    assert.ok(roster.includes(`src="assets/jersey-home-${player.number}.svg"`));
    const svg = await readFile(
      `dist/assets/jersey-home-${player.number}.svg`,
      "utf8",
    );
    assert.match(svg, /BUCKAROOS/);
    assert.ok(svg.includes(`data-number="${player.number}"`));
    assert.match(svg, /Reference-based/);
    assert.doesNotMatch(svg, /<image|https?:\/\/(?!www.w3.org)/);
  }
  assert.match(
    await readFile("dist/assets/jersey-away-6.svg", "utf8"),
    /Smackover/,
  );
});
