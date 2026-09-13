import { mkdir, readFile, writeFile, cp, unlink } from "node:fs/promises";
import { jerseySvg } from "./jersey.mjs";
const data = JSON.parse(await readFile("src/data.json", "utf8"));
const { players } = data;
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const href = (value) => {
  const u = new URL(value);
  if (u.protocol !== "https:") throw new Error("HTTPS source URL required");
  return esc(u.href);
};
await mkdir("dist/assets", { recursive: true });
for (const name of ["schedule", "program", "gameday", "community"])
  await unlink(`dist/${name}.html`).catch((e) => {
    if (e.code !== "ENOENT") throw e;
  });
await cp("src/assets", "dist/assets", { recursive: true });
for (const number of new Set([...players.map((p) => p.number), "6"])) {
  await writeFile(`dist/assets/jersey-home-${number}.svg`, jerseySvg(number));
}
await writeFile("dist/assets/jersey-away-6.svg", jerseySvg("6", "away"));
for (const name of ["styles.css", "roster.js"])
  await cp("src/" + name, "dist/" + name);
await cp(
  "node_modules/@fontsource/oswald/files/oswald-latin-700-normal.woff2",
  "dist/assets/oswald.woff2",
);
await cp(
  "node_modules/@fontsource/oswald/LICENSE",
  "dist/assets/FONT-LICENSE.txt",
);
await cp(
  "node_modules/@fontsource/allura/LICENSE",
  "dist/assets/ALLURA-LICENSE.txt",
);
const nav = [
  ["index.html", "Home"],
  ["roster.html", "Roster"],
];
function layout(file, title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Unofficial Smackover Buckaroos football concept. 2026 results, full roster, measurements and published player statistics."><title>${title} — Smackover Football Concept</title><link rel="icon" href="assets/buckaroo-logo.png" type="image/png"><link rel="stylesheet" href="styles.css"><link rel="preload" href="assets/oswald.woff2" as="font" type="font/woff2" crossorigin>${file === "roster.html" ? '<script src="roster.js" defer></script>' : ""}</head><body class="${file === "roster.html" ? "roster-page" : "home-page"}"><a href="#main" class="skip">Skip to content</a><div class="concept-bar"><span>INDEPENDENT PORTFOLIO CONCEPT</span><span>NOT AN OFFICIAL SCHOOL WEBSITE</span></div><header class="site-header"><a class="brand" href="index.html" aria-label="Buckaroos concept home"><img class="brand-logo" src="assets/buckaroo-logo.png" width="48" height="48" alt="Buckaroo logo"><span>SMACKOVER<small>BUCKAROOS FOOTBALL</small></span></a><nav aria-label="Main navigation">${nav.map(([url, label]) => `<a href="${url}" ${url === file ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><span class="season-label">2026 / VARSITY</span><a class="district-link" href="https://smackover.net/">School district ↗</a></header><main id="main">${body}</main><footer><a class="brand" href="index.html"><img class="brand-logo" src="assets/buckaroo-logo.png" width="48" height="48" alt="Buckaroo logo"><span>SMACKOVER<small>BUCKAROOS FOOTBALL</small></span></a><p>Small town. All heart.<br><span>Smackover, Arkansas</span></p><p class="disclaimer">Independent portfolio concept. Not affiliated with or endorsed by the school. Results and roster sourced from MaxPreps; published statistics may be incomplete. No confirmed depth order. Reference-based illustrations do not imply endorsement.</p><a href="https://www.maxpreps.com/ar/smackover/smackover-buckaroos/football/">Team information on MaxPreps ↗</a></footer></body></html>`;
}
const games = [...data.games].sort((a, b) => b.date.localeCompare(a.date));
const latest = games[0];
const dateLabel = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date.slice(0, 10) + "T12:00:00Z"));
const wins = games.filter((g) => g.pointsFor > g.pointsAgainst).length;
const losses = games.filter((g) => g.pointsFor < g.pointsAgainst).length;
const home = `<section class="hero"><div class="hero-copy"><p class="eyebrow">SMACKOVER, ARKANSAS / 2026 FOOTBALL</p><h1>SMALL TOWN.<br>BIG <span class="outline">FRIDAY</span><br>NIGHTS.</h1><p>One town. One team.<br>Nothing but black and white.</p><div class="actions"><a class="button" href="roster.html">Meet the full roster ↗</a><a class="text-link" href="#results">Full season schedule ↓</a></div><span class="hero-caption">${players.length} PLAYERS / ${wins}–${losses} RECORD / BUCKAROO COUNTRY</span></div><section class="hero-art last-game" aria-labelledby="last-game-title"><img src="assets/field.webp" width="376" height="355" alt=""><div class="score-content"><p class="eyebrow" id="last-game-title">LAST REPORTED GAME / FINAL</p><p class="game-date">${dateLabel(latest.date)}</p><div class="score-line"><span>SMACKOVER<small>BUCKAROOS</small></span><strong>${latest.pointsFor}</strong></div><div class="score-line opponent"><span>${esc(latest.opponent).toUpperCase()}</span><strong>${latest.pointsAgainst}</strong></div><div class="score-outcome">${latest.pointsFor > latest.pointsAgainst ? "BUCKAROOS WIN" : "FINAL RESULT"} <span>2026 SEASON</span></div><a href="${href(latest.source)}">View source box score ↗</a></div><span class="art-credit">USER-SUPPLIED FIELD PHOTOGRAPH / LOCATION NOT INDEPENDENTLY VERIFIED</span></section></section><div class="ticker"><span>SMACKOVER FOOTBALL</span><span>★</span><span>BLACK & WHITE</span><span>★</span><span>BUCKAROO COUNTRY</span></div><section class="wrap results-section" id="results"><div><p class="eyebrow">01 / THE 2026 SEASON</p><h2>THE SCHEDULE.</h2><p>All 10 regular-season games. ${games.length} reported finals; remaining games are scheduled, not results.</p></div><div class="results-list">${[
  ...data.schedule,
]
  .sort((a, b) => a.date.localeCompare(b.date))
  .map(
    (g) =>
      `<a class="result-row" data-status="${esc(g.status)}" href="${href(g.source)}"><time datetime="${esc(g.date)}">${dateLabel(g.date)}</time><span>${g.homeAway === "home" ? "vs" : "at"} ${esc(g.opponent)}</span>${g.status === "final" ? `<strong class="schedule-score">${esc(g.pointsFor)}–${esc(g.pointsAgainst)}</strong><b>Final</b>` : `<strong>${esc(g.time)}</strong><b>Scheduled</b>`}</a>`,
  )
  .join(
    "",
  )}<p class="fine-print">Source: MaxPreps. Latest reported result: ${dateLabel(latest.date)}. Snapshot checked September 12, 2026; not a live score feed.</p></div></section><section class="wrap home-feature"><div><p class="eyebrow">02 / EVERY PLAYER. EVERY POSITION.</p><h2>THE WHOLE<br>ROSTER.</h2><p>All ${players.length} published players. Explore each position group, every listed option, and the current season’s reported numbers.</p><a class="text-link" href="roster.html">Explore the roster ↗</a></div><div class="uniform-references"><figure><img src="assets/jersey-away-6.svg" width="300" height="280" alt="Reference-based white away jersey illustration, number 6"><figcaption>White / away · Jersey illustration</figcaption></figure><figure><img src="assets/jersey-home-6.svg" width="300" height="280" alt="Reference-based black home jersey illustration, number 6"><figcaption>Black / home · Jersey illustration</figcaption></figure><p class="fine-print">Reference-based illustrations, not photographs or exact uniform replicas. No sponsorship or endorsement implied.</p></div></section>`;
const units = {
  offense: [
    ["OT", "OG", "C", "OG", "OT", "TE"],
    ["WR", "HB", "QB", "FB", "WR"],
  ],
  defense: [
    ["S", "OLB", "ILB", "ILB", "OLB", "S"],
    ["CB", "DE", "DT", "DE", "CB"],
  ],
  special: [["K", "P", "PR", "KR"]],
};
const aliases = { OL: "OT", RB: "HB", NG: "DT", DB: "CB", MLB: "ILB" };
function formation(unit, rows) {
  const used = {};
  return `<div class="unit-formation" data-unit="${unit}">${rows
    .map(
      (row) =>
        `<div class="formation-row">${row
          .map((code) => {
            const slot = used[code] || 0;
            used[code] = slot + 1;
            const occurrences = rows.flat().filter((c) => c === code).length;
            const pool = players
              .filter((p) =>
                p.positions.some((pos) => (aliases[pos] || pos) === code),
              )
              .sort(
                (a, b) =>
                  Number(a.number) - Number(b.number) ||
                  a.id.localeCompare(b.id),
              );
            // Round-robin assignment is visual distribution, never a depth ranking.
            const options = pool.filter(
              (_, index) => index % occurrences === slot,
            );
            return `<section class="position-group" data-position="${code}"><div class="position-title"><h3>${code}</h3><span>${options.length} listed</span></div><div class="card-stack">${options.map((p, index) => playerCard(p, index)).join("")}</div></section>`;
          })
          .join("")}</div><!-- /row -->`,
    )
    .join("")}</div><!-- /unit -->`;
}
function quickStats(p) {
  const selected = p.stats
    .filter(
      (s) =>
        s.value !== null &&
        s.value !== "" &&
        s.label !== "Games Played" &&
        [
          "Passing Yards",
          "Rushing Yards",
          "Receiving Yards",
          "Total Tackles",
          "Tackles",
          "Total TDs",
          "Sacks",
          "Interceptions",
        ].includes(s.label),
    )
    .filter(
      (s, i, all) => all.findIndex((other) => other.label === s.label) === i,
    )
    .slice(0, 3);
  return selected.length
    ? selected
        .map((s) => `<span>${esc(s.label)}: <b>${esc(s.value)}</b></span>`)
        .join("")
    : "<span>Open profile for reported season stats.</span>";
}
function playerCard(p, index) {
  return `<button class="stack-card${index ? " stack-backup" : " stack-front is-active"}" data-id="${esc(p.id)}" aria-haspopup="dialog" aria-label="View ${esc(p.name)}, number ${esc(p.number)}"><img class="stack-jersey" src="assets/jersey-home-${esc(p.number)}.svg" width="300" height="280" alt="" aria-hidden="true"><span class="stack-strip"><b>#${esc(p.number)}</b><span>${esc(p.name)}</span></span><template class="preview-source"><b>${esc(p.name)}</b><span>#${esc(p.number)} · ${p.positions.map(esc).join(" / ")}</span><span>${esc(p.grade)} · ${esc(p.height)} · ${esc(p.weight)}</span>${quickStats(p)}<span>Open full profile ↗</span></template></button>`;
}
function detail(p) {
  const categories = [...new Set(p.stats.map((s) => s.category))];
  return `<p class="eyebrow">2026 / #${esc(p.number)} / ${p.positions.map(esc).join(" · ")}</p><h2 id="dialog-title">${esc(p.name)}</h2><dl class="bio"><div><dt>Grade</dt><dd>${esc(p.grade)}</dd></div><div><dt>Positions</dt><dd>${p.positions.map(esc).join(" / ")}</dd></div><div><dt>Height</dt><dd>${esc(p.height)}</dd></div><div><dt>Weight</dt><dd>${esc(p.weight)}</dd></div></dl><p class="photo-note">Player photograph not available. Measurements are those published on the current MaxPreps roster.</p><h3 class="stats-title">2026 season statistics</h3><p class="fine-print">Published season totals; stats updated September 6, 2026. Unreported values are not zero.</p>${
    categories.length
      ? categories
          .map(
            (category, i) =>
              `<details class="stat-category" ${i === 0 ? "open" : ""}><summary>${esc(category)}</summary><dl class="stat-grid">${p.stats
                .filter((s) => s.category === category)
                .map(
                  (s) =>
                    `<div><dt>${esc(s.label)}</dt><dd>${s.value === null || s.value === "" ? "Not reported" : esc(s.value)}</dd></div>`,
                )
                .join("")}</dl></details>`,
          )
          .join("")
      : '<p class="no-stats">No individual season statistics reported in the source snapshot. This does not mean the player has not played.</p>'
  }<div class="profile-sources"><a href="${href(p.source)}">Player source ↗</a><a href="${href(data.statsSource)}">Team statistics source ↗</a></div>`;
}
const roster = `<section class="page-intro wrap"><p class="eyebrow">2026 / VARSITY</p><h1>THE ROSTER.</h1><p>${players.length} players. Every published position and statistic.</p></section><section class="roster-section wrap"><div class="roster-toolbar" hidden><div class="unit-controls" role="group" aria-label="Position group"><button data-group="offense" aria-pressed="true">Offense</button><button data-group="defense" aria-pressed="false">Defense</button><button data-group="special" aria-pressed="false">Special teams</button></div></div><div class="field"><div class="field-heading"><h2 id="formation-label">All position groups</h2><span>SMACKOVER / 2026</span></div><p class="field-instruction">NUMBER ORDER, NOT DEPTH RANK · TAP ANY NAME FOR STATS</p><div class="formation">${Object.entries(
  units,
)
  .map(([unit, rows]) => formation(unit, rows))
  .join(
    "",
  )}</div><div class="field-footer"><span id="player-count" aria-live="polite">${players.length} unique players</span><span>ALL LISTED OPTIONS · NO CONFIRMED STARTERS</span></div></div><p id="roster-fallback">Enable JavaScript for unit filters and player dialogs; the complete roster and statistics are available below.</p><details class="complete-roster"><summary>Full directory & statistics — all ${players.length} players</summary><div class="roster-directory">${players.map((p) => `<details><summary>#${esc(p.number)} ${esc(p.name)} · ${p.positions.map(esc).join(" / ")}</summary>${detail(p).replace('id="dialog-title"', 'class="directory-name"')}</details>`).join("")}</div></details><p class="fine-print">Roster updated September 10; source snapshot September 12, 2026. Reference-based jersey illustrations, not player photographs. Jersey-number order is not starter/backup rank. Repeated slots share each position pool evenly. Multi-position players appear in each applicable category. Display aliases: OL → OT, RB → HB, NG → DT, DB → CB, MLB → ILB; profiles retain source positions. <a href="${href(data.rosterSource)}">MaxPreps roster ↗</a></p></section><div id="player-preview" hidden><button id="dismiss-preview" aria-label="Dismiss player preview">×</button><div id="preview-content"></div><button id="preview-open">Full profile ↗</button></div><dialog id="player-dialog" aria-labelledby="dialog-title"><button id="close-dialog" class="close-button" aria-label="Close player details" autofocus>Close ×</button><div id="dialog-content"></div></dialog>${players.map((p) => `<template id="detail-${esc(p.id)}">${detail(p)}</template>`).join("")}`;
for (const [file, title, body] of [
  ["index.html", "Home", home],
  ["roster.html", "Roster", roster],
])
  await writeFile("dist/" + file, layout(file, title, body));
console.log(
  `Built 2 pages, ${players.length} unique players and ${games.length} completed games.`,
);
