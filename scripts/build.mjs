import { mkdir, readFile, writeFile, cp, unlink } from "node:fs/promises";
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
const nav = [
  ["index.html", "Home"],
  ["roster.html", "Roster"],
];
function layout(file, title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Unofficial Smackover Buckaroos football concept. 2026 results, full roster, measurements and published player statistics."><title>${title} — Smackover Football Concept</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="styles.css"><link rel="preload" href="assets/oswald.woff2" as="font" type="font/woff2" crossorigin>${file === "roster.html" ? '<script src="roster.js" defer></script>' : ""}</head><body><a href="#main" class="skip">Skip to content</a><div class="concept-bar"><span>INDEPENDENT PORTFOLIO CONCEPT</span><span>NOT AN OFFICIAL SCHOOL WEBSITE</span></div><header class="site-header"><a class="brand" href="index.html" aria-label="Buckaroos concept home"><span class="brand-mark">B<span>★</span></span><span>SMACKOVER<small>BUCKAROOS FOOTBALL</small></span></a><nav aria-label="Main navigation">${nav.map(([url, label]) => `<a href="${url}" ${url === file ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><span class="season-label">2026 / VARSITY</span><a class="district-link" href="https://smackover.net/">School district ↗</a></header><main id="main">${body}</main><footer><a class="brand" href="index.html"><span class="brand-mark">B<span>★</span></span><span>SMACKOVER<small>BUCKAROOS FOOTBALL</small></span></a><p>Small town. All heart.<br><span>Smackover, Arkansas</span></p><p class="disclaimer">Independent portfolio concept. Not affiliated with or endorsed by the school. Results and roster sourced from MaxPreps; published statistics may be incomplete. No confirmed depth order or player photos supplied.</p><a href="https://www.maxpreps.com/ar/smackover/smackover-buckaroos/football/">Team information on MaxPreps ↗</a></footer></body></html>`;
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
const home = `<section class="hero"><div class="hero-copy"><p class="eyebrow">SMACKOVER, ARKANSAS / 2026 FOOTBALL</p><h1>SMALL TOWN.<br>BIG <span class="outline">FRIDAY</span><br>NIGHTS.</h1><p>One town. One team.<br>Nothing but black and white.</p><div class="actions"><a class="button" href="roster.html">Meet the full roster ↗</a><a class="text-link" href="#results">Season results ↓</a></div><span class="hero-caption">${players.length} PLAYERS / ${wins}–${losses} RECORD / BUCKAROO COUNTRY</span></div><section class="hero-art last-game" aria-labelledby="last-game-title"><img src="assets/stadium.svg" width="1400" height="1000" alt=""><div class="score-content"><p class="eyebrow" id="last-game-title">LAST REPORTED GAME / FINAL</p><p class="game-date">${dateLabel(latest.date)}</p><div class="score-line"><span>SMACKOVER<small>BUCKAROOS</small></span><strong>${latest.pointsFor}</strong></div><div class="score-line opponent"><span>${esc(latest.opponent).toUpperCase()}</span><strong>${latest.pointsAgainst}</strong></div><div class="score-outcome">${latest.pointsFor > latest.pointsAgainst ? "BUCKAROOS WIN" : "FINAL RESULT"} <span>2026 SEASON</span></div><a href="${href(latest.source)}">View source box score ↗</a></div><span class="art-credit">ILLUSTRATED FIELD / NOT STADIUM PHOTOGRAPHY</span></section></section><div class="ticker"><span>SMACKOVER FOOTBALL</span><span>★</span><span>BLACK & WHITE</span><span>★</span><span>BUCKAROO COUNTRY</span></div><section class="wrap results-section" id="results"><div><p class="eyebrow">01 / THE SEASON SO FAR</p><h2>THE SCOREBOARD.</h2><p>Earlier results below; the latest game is featured above. ${games.length} completed games reported this season.</p></div><div class="results-list">${games
  .slice(1)
  .map(
    (g) =>
      `<a class="result-row" href="${href(g.source)}"><time datetime="${g.date.slice(0, 10)}">${dateLabel(g.date)}</time><span>Smackover <small>vs ${esc(g.opponent)}</small></span><strong>${g.pointsFor} <span>–</span> ${g.pointsAgainst}</strong><b>${g.pointsFor > g.pointsAgainst ? "W" : "L"} ↗</b></a>`,
  )
  .join(
    "",
  )}<p class="fine-print">Source: MaxPreps. Latest reported result: ${dateLabel(latest.date)}. Snapshot checked September 12, 2026; not a live score feed.</p></div></section><section class="wrap home-feature"><div><p class="eyebrow">02 / EVERY PLAYER. EVERY POSITION.</p><h2>THE WHOLE<br>ROSTER.</h2><p>All ${players.length} published players. Explore each position group, every listed option, and the current season’s reported numbers.</p><a class="text-link" href="roster.html">Explore the roster ↗</a></div><a class="featured-jersey" href="roster.html"><span>2026 / VARSITY FOOTBALL</span><img src="assets/jersey.svg" width="300" height="280" alt="Illustrated jersey; current player photos have not been supplied"><strong>BUCKS</strong><span class="jersey-bottom">FULL POSITION GROUPS / SEASON STATS ↗</span></a></section>`;
const units = {
  offense: [
    ["OT", "Tackles", ["OT"]],
    ["OG", "Guards", ["OG"]],
    ["C", "Centers", ["C"]],
    ["OL", "Offensive line", ["OL"]],
    ["TE", "Tight ends", ["TE"]],
    ["WR", "Receivers", ["WR"]],
    ["QB", "Quarterbacks", ["QB"]],
    ["RB", "Running backs", ["RB"]],
    ["FB", "Fullbacks", ["FB"]],
  ],
  defense: [
    ["DE", "Defensive ends", ["DE"]],
    ["DT", "Defensive tackles", ["DT"]],
    ["NG", "Nose guards", ["NG"]],
    ["ILB", "Inside linebackers", ["ILB", "MLB"]],
    ["OLB", "Outside linebackers", ["OLB"]],
    ["CB", "Cornerbacks", ["CB"]],
    ["S", "Safeties", ["S"]],
    ["DB", "Defensive backs", ["DB"]],
  ],
  special: [
    ["K", "Kickers", ["K"]],
    ["P", "Punters", ["P"]],
    ["PR", "Punt returners", ["PR"]],
    ["KR", "Kick returners", ["KR"]],
  ],
};
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
function playerCard(p, compact = false) {
  return `<button class="${compact ? "roster-option" : "player-card"}" data-id="${esc(p.id)}" aria-haspopup="dialog" aria-label="View ${esc(p.name)}, number ${esc(p.number)}"><span class="card-top">#${esc(p.number)} <span>${esc(p.grade)}</span></span>${compact ? "" : `<span class="portrait"><img src="assets/jersey.svg" width="300" height="280" alt=""><strong>${esc(p.number)}</strong></span>`}<span class="player-name">${esc(p.name)}</span><span class="measurements">${esc(p.height)} · ${esc(p.weight)}</span>${compact ? "" : `<span class="photo-status">PHOTO NOT AVAILABLE</span>`}<span class="hover-detail"><b>${esc(p.name)}</b><span>${p.positions.map(esc).join(" / ")} · ${esc(p.grade)}</span><span>${esc(p.height)} / ${esc(p.weight)}</span>${quickStats(p)}<span class="detail-hint">2026 stats & full profile ↗</span></span></button>`;
}
function positionGroup(code, label, positions, unit) {
  const options = players
    .filter((p) => p.positions.some((pos) => positions.includes(pos)))
    .sort((a, b) => Number(a.number) - Number(b.number));
  if (!options.length) return "";
  return `<section class="position-group" data-unit="${unit}" data-position="${code}"><div class="position-title"><h3>${code}</h3><span>${label}<small>${options.length} listed</small></span></div>${playerCard(options[0])}${
    options.length > 1
      ? `<p class="depth-label">MORE AT THIS POSITION</p><div class="depth-options">${options
          .slice(1)
          .map((p) => playerCard(p, true))
          .join("")}</div>`
      : ""
  }</section>`;
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
const roster = `<section class="page-intro wrap"><p class="eyebrow">2026 / VARSITY ROSTER</p><h1>EVERY NAME.<br>EVERY NUMBER.</h1><p class="lede">${players.length} Buckaroos. Full position groups, published measurements, and the season’s reported statistics.</p></section><section class="roster-section wrap"><div class="source-note"><strong>2026–27 roster</strong><p>Roster updated September 10. All listed players included; position groups are ordered by jersey number, not starter/backup rank.</p><a href="${href(data.rosterSource)}">MaxPreps source ↗</a></div><div class="roster-toolbar" hidden><div class="unit-controls" role="group" aria-label="Position group"><button data-group="offense" aria-pressed="true">Offense</button><button data-group="defense" aria-pressed="false">Defense</button><button data-group="special" aria-pressed="false">Special teams</button></div><span class="field-view">FULL POSITION GROUPS</span></div><div class="field"><div class="field-heading"><h2 id="formation-label">All position groups</h2><span>SMACKOVER / 2026</span></div><p class="field-instruction">HOVER OR FOCUS FOR DETAILS · TAP ANY PLAYER FOR STATS</p><div class="formation">${Object.entries(
  units,
)
  .map(([unit, groups]) =>
    groups.map((args) => positionGroup(...args, unit)).join(""),
  )
  .join(
    "",
  )}</div><div class="field-footer"><span id="player-count" aria-live="polite">${players.length} unique players</span><span>JERSEY NUMBER ORDER / NOT A CONFIRMED DEPTH CHART</span></div></div><p id="roster-fallback">All position groups are shown. Enable JavaScript for unit filters and player dialogs; the complete roster and statistics remain available below.</p><details class="complete-roster"><summary>Complete roster & season statistics — all ${players.length} players</summary><div class="roster-directory">${players.map((p) => `<details><summary>#${esc(p.number)} ${esc(p.name)} · ${p.positions.map(esc).join(" / ")}</summary>${detail(p).replace('id="dialog-title"', 'class="directory-name"')}</details>`).join("")}</div></details><p class="fine-print">Multi-position players appear in each applicable group. A published roster does not establish starter/backup order. Current player photos have not been supplied; jerseys are illustrations.</p></section><dialog id="player-dialog" aria-labelledby="dialog-title"><button id="close-dialog" class="close-button" aria-label="Close player details" autofocus>Close ×</button><div id="dialog-content"></div></dialog>${players.map((p) => `<template id="detail-${esc(p.id)}">${detail(p)}</template>`).join("")}`;
for (const [file, title, body] of [
  ["index.html", "Home", home],
  ["roster.html", "Roster", roster],
])
  await writeFile("dist/" + file, layout(file, title, body));
console.log(
  `Built 2 pages, ${players.length} unique players and ${games.length} completed games.`,
);
