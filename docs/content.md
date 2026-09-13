# Content provenance — current2026 revision

The website is an unofficial portfolio concept, not an official depth chart. It now covers the current2026–27 MaxPreps roster rather than the historical Hooten’s sample (retained in git history).

- Roster: https://www.maxpreps.com/ar/smackover/smackover-buckaroos/football/roster/ — live browser verified42 rows, updated Sep10,2026 19:41GMT. All42 heights/weights and names retained as published. Current positions split on commas for grouping, not guessed from jersey numbers.
- Stats: https://www.maxpreps.com/ar/smackover/smackover-buckaroos/football/stats/ — live source reports updated Sep6,2026 13:22GMT. Reused the verified2026 acquisition package and legacy-ID/career-ID crosswalk from the earlier authorized acquisition task. All855 player-stat cells across14 categories matched against source raw values;304 remain null.29 players have reported stats;13 have none, not zero.
- Scores: MaxPreps game source URLs are attached to each row in src/data.json. Aug28 McGehee38–6; Sep3 Junction City55–12. Two completed games;93 points for18 against. Preserve source date even where another provider lists a conflicting date.
- Source check: September12,2026. Not a live feed; no new n8n automation created. No database writes.

## Photos and depth ordering

Live roster has no portraits. Profiles checked (Trason Parlor, Carter Walker, Connor Knight) supplied no player portrait. The listed MaxPreps gallery is from2022, not current. Do not harvest old or unidentifiable images. Caleb supplied two promotional uniform references as design input only, not as rendered homepage photo crops. This is not a complete player-portrait set. Do not assign Trason’s likeness or the unidentified black-uniform player to otherplayers.

MaxPreps lists positions, not starter/backup ranks. Display pools are remapped at Caleb’s request: OL->OT, RB->HB, NG->DT, DB->CB. Raw positions remain unchanged in profiles. Repeated slots split pools deterministically by jersey number and are not a published left/right assignment or depth ranking. Every source player remains available.

## Rights and artwork

Caleb previously reported MaxPreps permission for2026 data acquisition; this does not establish photo licensing or commercial redistribution rights. Site remains an unofficial personal/LAN portfolio concept. No MaxPreps editorial text, gallery photos, or logos copied. The homepage uses reference-based illustrated jerseys and the real district mark; no invented B-star logo appears. Oswald and the embedded Allura script use their included SIL Open Font Licenses.


## Supplied media and full schedule revision (crop history, superseded below)

- Schedule: all10 rows from the verified MaxPreps2026 schedule acquisition now appear on Home:2 completed,8 upcoming. Retain provider dates, local kickoff text (including Prescott5:00pm), venue and source links. Future scores are null. No live-update automation added.
- Official logo: https://files.smartsites.parentsquare.com/6590/footer_logo_img_gbpflb.png — found in the footer background of https://smackover.net/ . Original160x160 horse/rider-and-horseshoe artwork retained as `assets/buckaroo-logo.png`; no redraw or removal of symbol parts. Used for identification at Caleb’s request, not a claim of school endorsement or unrestricted trademark license.
- Field: user attachment `img_328272a71c06.webp`,376x355. Converted to grayscale `field.webp`; no invented field markings or replacement logo. Location not independently verified; describe it as the user-supplied field photograph.
- White/away uniform: user attachment `img_212cb04519d2.png`,1179x1481. Crop[108,447,829,1210],721x763, then grayscale. Supplied Andy’s/42Sports Trason Parlor spotlight composite. Preserve attribution in caption; not an independent site sponsorship, nor a clean jersey/product photograph.
- Black/home uniform: user attachment `img_1b7a263e3156.png`,526x701. Crop[287,214,477,505],190x291, then grayscale. Supplied Buckaroos countdown promotional composite; crop avoids presenting the old40days countdown as current. No player identity inferred.
- WebP derivatives encoded losslessly after grayscale conversion; source dimensions retained rather than claiming upscaling adds resolution. All source assets are served locally.


## Jersey illustration correction — authoritative current rendering

The earlier uniform-crop rendering was rejected. The two promotional attachments are reference input only. Keep existing crop files as historical derivatives, but neither page renders them. `scripts/jersey.mjs` generates external SVGs using the original illustration silhouette: black/home BUCKAROOS, white front number, white sleeve bands and shallow-V black collar; white/away cursive Smackover, black front number and black shoulder/sleeve bands. Home displays both variants; each player card displays the black variant with the published number. These are labeled reference-based illustrations, not photos or exact replicas. Exact sleeve details and brand/sponsor marks are unverified and intentionally simplified or omitted. The embedded Allura script font is packaged through @fontsource/allura, with `assets/ALLURA-LICENSE.txt`; there are no external font requests. Field photograph, real logo and all source roster/stat/schedule data remain unchanged.
