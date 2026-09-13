# Readable active-card acceptance

## Current sizing correction

- Default-first, hovered and keyboard-focused cards share one enlarged size: 184px desktop / 100px phone. Siblings remain 24px strips, with constant total stack height and no overlapping cards.
- Art regions are 160px desktop / 76px phone, clipped inside the card. At 1366px the contained SVG paints at 156px high (previously 36px), with about 11px surname lettering. At 390px the six-column formation limits the painted SVG to about 52px high; numbers are visible, but jersey surnames are not reliably readable. Full names remain accessible by touch/dialog and the complete directory. This is not a claim of desktop-sized phone typography.
- Readability supersedes the former whole-field viewport-height requirement. Normal document scrolling is intentional; exact two offense/defense rows and no horizontal overflow are retained.
- Regression RED: all three new painted-size tests failed against the previous CSS (36px painted height). GREEN: 10 unit tests and 13 Playwright tests passed after enlargement and scroll-aware interaction checks.
- Tests check actual object-fit dimensions, not only image element bounds; every active jersey remains contained. All 42 sourced rear-view surnames/numbers, exact position rows, no-JS directory, real touch on backup strips, mouse/keyboard activation, preview dismissal, and native modal/focus restoration remain covered. Source data and homepage artwork are unchanged.
- `npm run build`, `npm test`, `npm run test:e2e`, `npm run format:check`, and `npm run design:check` are the required gates. There is no separate lint/typecheck script in this static JS project.
- Bounded visual inspection: `.preview/sizing-1366.png`, `.preview/sizing-390.png`, and focused backup crops `.preview/sizing-active-1366.png`, `.preview/sizing-active-390.png`. Desktop surnames/numbers legible; no card overlap or artwork escape. Phone numbers visible, surname limitation documented above. Browser capture reported no page errors or failed requests.

## Publication and LAN preview

CI independently runs formatter, build, unit tests, Impeccable, Playwright, and actual nginx image smoke before publishing `develop` and the immutable commit image. Verify the final run, manifest digest and OCI revision before deployment. Caleb authorizes automatic replacement of `smackover-football-preview` after verified builds; retain the stopped previous container for rollback and preserve live runtime config. Verify HTTP pages/assets byte-for-byte and the running image revision; record deployment evidence in `/mnt/user/appdata/dev/CONTAINERS.md`.

CSS/JS URLs remain content-versioned, with nginx revalidation to avoid mixed cached layout assets. Homepage front-view illustrated uniforms remain unchanged; roster art is rear-view and reference-based, not an exact replica or player photograph.
