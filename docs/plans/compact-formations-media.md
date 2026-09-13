# Compact formations and supplied media implementation plan

> For Hermes: execute directly with scoped delegation; no external coding CLI required.

Goal: a compact two-row roster plus complete schedule and real supplied imagery.
Architecture: static generator preserves42 source profiles/stats, builds presentation-only positional pools and overlapping clickable stacks. Native dialogs retain full data; source records remain unchanged.

## Exact formation constraints
- Offense Top Row: OT OG C OG OT TE
- Offense Bottom Row: WR HB QB FB WR
- Defense Top Row: S OLB ILB ILB OLB S
- Defense Bottom Row: CB DE DT DE CB
- Display mappings only: OL->OT, RB->HB, NG->DT, DB->CB. Deterministic distribution across repeated slots, no confirmed depth ranking.
- Each unit board fits1366x768 and390x844 with no horizontal/nested scrolling; stats dialog/full directory may scroll when explicitly opened.
- Preserve all42 players and855 source stat cells, measurements, nulls and raw positions.
- Only Home/Roster. Neutral grayscale, real district horse/rider emblem, supplied field and cropped promotional uniforms. Never imply supplied photos are independently verified or sponsor endorsements.
- Full10game source schedule:2finals,8upcoming; future scores remain null, no invented results.
- No live container replacement without fresh explicit approval for this revision.

## Ownership and gates
1. Jarvis: assets, scheduledata, provenance, CIbranch trigger, docs. UI worker exclusively owns build.mjs, roster.js, styles.css and tests; no overlapping writes, no worker commits/deployment.
2. Worker: failing unit tests against old build, then exact formations, compact stacks, fullschedule and imagery integration. npm run build; npm test; npm run format:check; npm run design:check. Browser tests verify exact row order, backup interaction, pointer/focus/Escape, no-JS, viewport fit and schedule.
3. Jarvis: inspect actualdiff, local build/tests, one batched desktop/mobile visual pass and one consolidated fix, independent read-only review, feature CI and nginx smoke. Merge only green; publishmain develop+sha, verifyregistrydigest+revision. Report literal image/tag/digest and pendingdeployment status.
