# Jersey and stack correction implementation plan

> **For Hermes:** Implement directly; parent owns independent review and publishing.

**Goal:** Fully expose the first or interacting player while restoring illustrated, reference-based uniforms.
**Architecture:** Nonoverlapping flex accordion with one active 64px card and 24px inactive strips. Shared build-time SVG generator serves home/away homepage art and black numbered player jerseys.
**Tech stack:** Static HTML/CSS/JS, Node build, Playwright.

## Global constraints
- Sole implementer in `/mnt/user/appdata/dev/smackover-football`; no commits, push, deployment or container modifications.
- Keep exact formations, all42 profiles, source data, actual field photo/logo, viewport fit1366x768/390x844, hover details and click/touch modal.
- TOP/FIRST fully visible default; hovered/focus card expands within unchanged total stack height. Restore first on leaving unless focus inside.
- Reference-based illustrations, not photo crops or exact-replica claims; no uncertain logos.
- Local browser server uses8780, never8779.

## Task1 — Accordion correction
Modify `tests/site.spec.js`, `playwright.config.js`, `scripts/build.mjs`, `src/styles.css`, `src/roster.js`. Add geometry tests for each strip/active card, focus and leave. RED: new tests fail on old overlapping geometry. GREEN: flex siblings, active class, pointer/focus selection and reset; maintain preview/modal.

## Task2 — Illustrated jerseys
Modify `tests/build.test.mjs`; create `scripts/jersey.mjs`; update build and CI asset checks. RED: rendered pages lack illustration assets. GREEN: shared neutral SVG artwork with player number, home BUCKAROOS and away script Smackover. Update DESIGN/content/changelog to supersede photo-crop requirement.

## Verification and next gate
Run `npm run build`, `npm test`, `npm run test:e2e`, `npm run format:check`, `npm run design:check`, `git diff --check`. If local Chromium unavailable, exercise browser CDP on8780 or report concrete blocker; parent independently checks browser and publishes. Keep source data diff empty.
