# Design

Strictly black, white and grey in CSS, artwork and grayscale supplied media. Oswald bold with system sans. Two pages: Home and Roster. Preserve the actual district horse/rider-and-horseshoe mark and supplied field photograph.

Home (Persuade): latest reported final over the field photograph, full chronological 10-game 2026 schedule, and illustrated black/home plus white/away uniforms. Do not render promotional jersey photo crops. Reuse the original jersey illustration silhouette, with reference-based uniform details rather than claiming exact replicas.

Uniforms: black home body, compact white BUCKAROOS chest wordmark, large white athletic number, white sleeve band and shallow-V black collar. White away body, black cursive Smackover chest wordmark, large black block number and black shoulder/sleeve bands. Embed the SIL-OFL Allura script font in the away SVG for deterministic lettering without network or host-font dependencies. Omit uncertain logos, sponsors and exact stripe-count claims. Every roster card uses the black illustration with its own source jersey number. Label these as reference-based illustrations, not photographs.

Roster (Operate): nonoverlapping vertical flex accordions. First card is fully exposed by default (64px); every other card remains a reachable 24px name strip. Pointer entry or keyboard focus activates a card without changing total stack height: 64 + 24 × (count − 1). No negative margins, layering or layout animation. On leaving a whole stack, restore the focused card if focus remains inside, otherwise the first card. Moving keyboard focus out restores the hovered card or first card. Hover previews sit outside the entire formation so no active jersey or inactive strip is occluded. Previews may scroll; formation containers do not. Native click/touch dialogs retain full details and restore focus.

Exact offense top OT OG C OG OT TE; bottom WR HB QB FB WR. Defense top S OLB ILB ILB OLB S; bottom CB DE DT DE CB. Presentation mappings OL→OT, RB→HB, NG→DT, DB→CB, MLB→ILB never mutate source profiles. Numeric order and pool splitting are illustrative, not confirmed depth ranking. Fit the complete field at 1366×768 and 390×844. Preserve the no-JS full 42-player directory and independent-concept disclaimer.

Impeccable: detector-only integration retained; narrow layout/a11y correction, not a redesign.
