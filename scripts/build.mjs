import { mkdir, readFile, writeFile, cp } from "node:fs/promises";
const { players } = JSON.parse(await readFile("src/data.json", "utf8"));
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
await mkdir("dist/assets", { recursive: true });
await cp("src/assets", "dist/assets", { recursive: true });
await cp("src/styles.css", "dist/styles.css");
await cp("src/roster.js", "dist/roster.js");
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
  ["schedule.html", "Schedule"],
  ["program.html", "The program"],
  ["gameday.html", "Game day"],
  ["community.html", "Community"],
];
function layout(file, title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="An unofficial Smackover Buckaroos football portfolio concept. Explore the program, a source-sample roster, and game-day resources."><title>${title} — Smackover Football Concept</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="styles.css"><link rel="preload" href="assets/oswald.woff2" as="font" type="font/woff2" crossorigin>${file === "roster.html" ? '<script src="roster.js" defer></script>' : ""}</head><body><a href="#main" class="skip">Skip to content</a><div class="concept-bar"><span>INDEPENDENT PORTFOLIO CONCEPT</span><span>NOT AN OFFICIAL SCHOOL WEBSITE</span></div><header class="site-header"><a class="brand" href="index.html" aria-label="Buckaroos concept home"><span class="brand-mark">B<span>★</span></span><span>SMACKOVER<small>BUCKAROOS FOOTBALL</small></span></a><nav aria-label="Main navigation">${nav.map(([href, label]) => `<a href="${href}" ${href === file ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><a class="district-link" href="https://smackover.net/">School district ↗</a></header><main id="main">${body}</main><footer><a class="brand footer-brand" href="index.html"><span class="brand-mark">B<span>★</span></span><span>SMACKOVER<small>BUCKAROOS FOOTBALL</small></span></a><p>Small town. All heart.<br><span>Smackover, Arkansas</span></p><p class="disclaimer">An independent design study. Not affiliated with or endorsed by Smackover-Norphlet School District. Player information is a historical source sample, not a current roster.</p><a href="https://smackover.net/">Visit the official district website ↗</a></footer></body></html>`;
}
const intro = (num, kicker, title, description) =>
  `<section class="page-intro wrap"><p class="eyebrow">${num} / ${kicker}</p><h1>${title}</h1><p class="lede">${description}</p></section>`;
const source =
  '<a href="https://hootens.com/teams/smackover">Hooten’s source ↗</a>';
const home = `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> SMACKOVER, ARKANSAS / BUCKAROO COUNTRY</p><h1>SMALL TOWN.<br>BIG <span class="outline">FRIDAY</span><br>NIGHTS.</h1><p>Under the lights. Behind our boys.<br>One town, wearing black and white.</p><div class="actions"><a class="button" href="roster.html">Meet the Buckaroos <span>↗</span></a><a class="text-link" href="gameday.html">Plan your game night →</a></div><span class="hero-caption">A TRIBUTE TO THE SPIRIT OF SMACKOVER FOOTBALL</span></div><div class="hero-art"><img src="assets/stadium.svg" width="1400" height="1000" alt="Original illustration of a football field beneath stadium lights"><span class="art-label">FRIDAY NIGHT / UNDER THE LIGHTS</span><div class="hero-stamp">GO<br>BUCKS<span>BLACK & WHITE. ALL NIGHT.</span></div><span class="art-credit">CONCEPT ARTWORK · NOT STADIUM PHOTOGRAPHY</span></div></section><div class="ticker" aria-label="Team identity"><span>SMACKOVER FOOTBALL</span><span>★</span><span>BLACK & WHITE</span><span>★</span><span>BUCKAROO COUNTRY</span><span>★</span></div><section class="wrap home-feature"><div><p class="eyebrow">01 / THE PEOPLE IN THE JERSEY</p><h2>MORE THAN<br>A NUMBER.</h2><p>The roster, reimagined. Explore player cards by position group and get to know the names behind the numbers.</p><a class="text-link" href="roster.html">Explore the roster concept ↗</a><p class="fine-print">Historical source sample. Not the current team or an official depth chart.</p></div><a class="featured-jersey" href="roster.html" aria-label="Explore the roster concept"><span>THE ROSTER / FIELD VIEW</span><img src="assets/jersey.svg" width="300" height="280" alt="Illustrated black-and-white football jersey"><strong>BUCKS</strong><span class="jersey-bottom">FIND YOUR POSITION. MEET YOUR TEAM. ↗</span></a></section><section class="resource-strip wrap"><div><p class="eyebrow">02 / YOUR NEXT FRIDAY NIGHT</p><h2>BE THERE.</h2></div><a href="schedule.html"><span>01</span>Follow the schedule <b>↗</b></a><a href="gameday.html"><span>02</span>Find the stadium <b>↗</b></a><a href="community.html"><span>03</span>Back the Buckaroos <b>↗</b></a></section>`;
function detail(p) {
  return `<p class="eyebrow">#${esc(p.number)} / ${p.positions.map(esc).join(" · ")}</p><h2 id="dialog-title">${esc(p.name)}</h2><dl><div><dt>Class year</dt><dd>${esc(p.class || "Not listed")}</dd></div><div><dt>Height</dt><dd>${esc(p.height || "Not listed")}</dd></div><div><dt>Weight</dt><dd>${esc(p.weight || "Not listed")}</dd></div><div><dt>Positions</dt><dd>${p.positions.map(esc).join(" / ")}</dd></div></dl><p class="fine-print">Historical public source sample. Current participation and measurements are not verified. Field placement does not indicate starting status.</p>${source}`;
}
const sortOrder = ["T", "G", "C", "TE", "WR", "QB", "RB", "SB"];
const sorted = [...players].sort((a, b) => {
  const rank = (p) =>
    Math.min(
      ...p.positions.map((pos) =>
        sortOrder.includes(pos) ? sortOrder.indexOf(pos) : 99,
      ),
    );
  return rank(a) - rank(b);
});
const roster =
  intro(
    "01",
    "THE ROSTER",
    "NAMES BEHIND<br>THE NUMBERS.",
    "A field-level look at the Buckaroos. Pick a unit, then hover, focus, or tap a card to explore the player.",
  ) +
  `<section class="roster-section wrap"><div class="source-note"><strong>Historical roster sample</strong><p>Selected public profiles, including class years 2026–2028. Not a verified current roster or a starting lineup. Jersey artwork is illustrative.</p>${source}</div><div class="roster-toolbar" hidden><div class="unit-controls" role="group" aria-label="Position group"><button data-group="offense" aria-pressed="true">Offense</button><button data-group="defense" aria-pressed="false">Defense</button><button data-group="special" aria-pressed="false">Special teams</button></div><span class="field-view">↗ POSITION GROUP VIEW</span></div><div class="field"><div class="field-heading"><h2 id="formation-label">All source profiles</h2><span>SMACKOVER / AR</span></div><p class="field-instruction">HOVER TO SCOUT · TAP FOR PLAYER DETAILS</p><div class="formation">${sorted.map((p) => `<button class="player-card" data-id="${p.id}" data-groups="${p.groups.join(" ")}" aria-haspopup="dialog" aria-label="View ${esc(p.name)}, number ${p.number}, ${p.positions.join(", ")}"><span class="card-top"><span>${p.positions.join(" / ")}</span><span>SHS</span></span><span class="portrait"><img src="assets/jersey.svg" alt="" width="300" height="280"><strong>${p.number}</strong></span><span class="player-name">${esc(p.name)}</span><span class="card-base">${p.class ? "CLASS OF " + p.class : "CLASS NOT LISTED"}<span>↗</span></span><span class="hover-detail"><b>${esc(p.name)}</b><span>${p.positions.join(" / ")} · #${p.number}</span><span>${p.height || "Height not listed"} / ${p.weight || "Weight not listed"}</span><span>${p.class ? "Class of " + p.class : "Class not listed"}</span><span class="detail-hint">Open full profile ↗</span></span></button>`).join("")}</div><div class="field-footer"><span id="player-count" aria-live="polite">${players.length} source profiles</span><span>ILLUSTRATIVE PLACEMENT / NOT A DEPTH CHART</span></div></div><p id="roster-fallback">All sampled players are shown. JavaScript enables unit filters and expanded profiles; each card still includes the published details on hover or focus.</p><p class="fine-print">Numbers may repeat in the original source. Players with multiple positions appear in more than one unit. Special teams includes only the published punter profile; no additional assignments are inferred.</p></section><dialog id="player-dialog" aria-labelledby="dialog-title"><button id="close-dialog" class="close-button" aria-label="Close player details" autofocus>Close ×</button><div id="dialog-content"></div></dialog>${players.map((p) => `<template id="detail-${p.id}">${detail(p)}</template>`).join("")}`;
const schedule =
  intro(
    "02",
    "THE SCHEDULE",
    "MAKE FRIDAY<br>YOUR NIGHT.",
    "Follow the season through the people who cover it. This concept does not publish unverified dates or scores.",
  ) +
  `<section class="wrap editorial"><div class="feature-panel"><p class="eyebrow">SEASON INFORMATION</p><h2>THE NEXT KICKOFF?<br>CHECK THE SOURCE.</h2><p>Available public listings mix seasons and contain conflicting details. Rather than pass those along as a live schedule, this first draft connects you directly to the district and football coverage.</p><a class="button" href="https://smackover.net/">District announcements ↗</a></div><div class="link-stack"><a href="https://hootens.com/teams/smackover"><small>TEAM COVERAGE</small><h3>Hooten’s <span>↗</span></h3><p>Published schedule, results, and team information.</p></a><a href="https://fearlessfriday.com/schools/smackover/"><small>FOOTBALL COVERAGE</small><h3>Fearless Friday <span>↗</span></h3><p>Program history and football coverage.</p></a><p class="fine-print">Confirm kickoff times, venue changes, and admission details with the district before traveling.</p></div></section>`;
const program =
  intro(
    "03",
    "THE PROGRAM",
    "BLACK. WHITE.<br>BUCKAROO.",
    "A football identity rooted in Smackover, Arkansas. A small-town program with history behind the name.",
  ) +
  `<section class="wrap editorial"><div class="feature-panel"><p class="eyebrow">THE COLORS NEVER CHANGE</p><h2>A TOWN’S COLORS.<br>A TEAM’S IDENTITY.</h2><p>Black and white. The Buckaroos. This concept takes those familiar ingredients and gives them a new digital home, built around the players and the people who show up for them.</p><a class="text-link" href="roster.html">Explore the player cards ↗</a></div><div><p class="eyebrow">IN THE RECORD BOOKS</p><h2>STATE CHAMPIONS</h2><div class="championships"><strong>1940</strong><strong>1943</strong><strong>1949</strong></div><p>Championship years as listed by Hooten’s.</p>${source}<p class="fine-print">Current coaching staff and new program stories will be added only after verification. No staff appointments are asserted in this draft.</p></div></section>`;
const gameday =
  intro(
    "04",
    "GAME DAY",
    "SEE YOU<br>UNDER THE LIGHTS.",
    "Your game-night starting point. Find the stadium, check the official details, and wear your black and white.",
  ) +
  `<section class="wrap editorial"><div class="feature-panel stadium-panel"><p class="eyebrow">HOME TURF</p><h2>BUCKAROO<br>STADIUM.</h2><address>1 Buckaroo Ln<br>Smackover, AR 71762</address><a class="button" href="https://www.google.com/maps/search/?api=1&query=Buckaroo+Stadium+1+Buckaroo+Ln+Smackover+AR+71762">Get directions ↗</a><p class="fine-print">Address source: <a href="https://fearlessfriday.com/schools/smackover/">Fearless Friday</a>. Confirm visitor access before traveling.</p></div><div class="game-checklist"><div><span>01</span><h3>Check before you go.</h3><p>Kickoff times and weather-related changes should be confirmed with the district.</p></div><div><span>02</span><h3>Tickets & entry.</h3><p>This concept does not sell tickets. Check official announcements for admission, parking, and stadium policies.</p></div><div><span>03</span><h3>Bring the black & white.</h3><p>Home crowd or visiting fan, make room for a good Friday night.</p></div><a class="text-link" href="https://smackover.net/">Official district information ↗</a></div></section>`;
const community =
  intro(
    "05",
    "BUCKAROO COUNTRY",
    "A TEAM TAKES<br>A WHOLE TOWN.",
    "For the families in the stands, the alumni coming home, and the neighbors who never miss a Friday.",
  ) +
  `<section class="wrap editorial"><div class="feature-panel"><p class="eyebrow">THE PEOPLE BEHIND THE PROGRAM</p><h2>ROOM FOR<br>YOUR STORY.</h2><p>This space is designed for approved booster updates, community stories, and local sponsors. No partnerships, fundraising campaigns, or endorsements are claimed in this portfolio concept.</p><a class="button" href="https://smackover.net/">Connect through the district ↗</a></div><div class="community-list"><article><p class="eyebrow">FAMILIES & FANS</p><h3>Stay connected.</h3><p>The official district website remains the source for school announcements and contact information.</p></article><article><p class="eyebrow">FUTURE EDITORIAL SPACE</p><h3>Local stories. Real voices.</h3><p>A place for school-approved photography and stories, with permission from the people featured.</p></article><article><p class="eyebrow">PORTFOLIO NOTE</p><h3>Built as a design study.</h3><p>An exploration of what a focused, mobile-friendly football website could look like—not an official replacement.</p></article></div></section>`;
for (const [file, title, body] of [
  ["index.html", "Home", home],
  ["roster.html", "Roster", roster],
  ["schedule.html", "Schedule", schedule],
  ["program.html", "The program", program],
  ["gameday.html", "Game day", gameday],
  ["community.html", "Community", community],
])
  await writeFile("dist/" + file, layout(file, title, body));
console.log(`Built 6 pages and ${players.length} sourced player profiles.`);
