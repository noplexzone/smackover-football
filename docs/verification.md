# Jersey illustrations and active-card acceptance

## Verified locally

- Built two pages; all 42 roster profiles and source statistics remain unchanged (`src/data.json` has no diff).
- Eight unit/data/resource tests and nine Playwright browser tests passed. Formatter and Impeccable detector passed.
- The first card is fully exposed by default. Hovering or keyboard-focusing another card expands that card to 64px; other cards become 24px strips. Total stack height remains unchanged. Leaving the stack restores its first card unless a card retains keyboard focus.
- Desktop 1366×768 and phone 390×844 screenshots show both formation rows without horizontal overflow. Offense field bottoms measured 753.3125px and 744.75px respectively.
- A separate real-mouse CDP sweep exercised every card in offense, defense, and special teams at both viewport widths without dismissing the preview between cards. Every card became active and every sibling strip remained hit-test reachable while the preview was visible.
- Browser tests cover native dialog Escape/focus restoration, real touch taps on every backup strip, no-JavaScript access to all 42 profiles, complete schedule, and bounded hover previews.
- Homepage uses newly illustrated white/away and black/home jerseys, not the supplied promotional photo crops. Each roster card uses its own numbered black jersey illustration. The original field photograph and district logo remain.
- Away lettering uses embedded Allura script font with its license included in generated assets, avoiding platform-dependent cursive fallback. Desktop/mobile visual inspection confirmed the script, both jersey silhouettes, and numbered cards render without clipping.
- The illustrations are reference-based interpretations, not exact replica claims. Uncertain brand marks were omitted. No player data, depth rankings, or individual portraits were invented.

## Publication and deployment

CI independently runs formatter, build, unit tests, Impeccable, Playwright, and actual nginx image smoke before publishing `develop` and the immutable commit image. Verify the final run and registry revision before handing off. Publishing this revision does not itself replace the existing LAN preview; container replacement requires Caleb's explicit approval.
