# Current-season two-page revision

Goal: Home and Roster only, strictly black/white/grey; last game and previous results; all42 current players, verified measurements and all available2026 season statistics; positional depth groups with all options, no invented starter/backup order.

Jarvis owns UI, tests, review, and publication. Data-normalization worker writes only .preview/current-data.json. Preserve older data in git history. No DB writes; existing preview stays untouched until update explicitly approved. Photos remain pending school/photographer-provided current labeled assets; no2022 images presented as current players.

Files: scripts/build.mjs two-page renderer with explicit staging cleanup to exclude retired routes; src/data.json current snapshot; src/styles.css and assets grayscale; src/roster.js unit filter + native player dialog; tests unit/browser; CI two-page nginx smoke and404 retired pages.

Steps: failing tests for two-page output/full roster/neutral colors/multiple options per position; implement source-backed renderer; verify unique42 source IDs, join stats by verified identity, stats missing not0; build/tests/format/detector; desktop/mobile screenshots and source review; push acceptance CI and verify exact digest.

Photo acceptance remains blocked until properly identified current pictures and reuse permission are supplied. All other scoped changes should be completed, not deferred behind this gap.
