# Smackover Football Implementation Plan

> **For Hermes:** Implement directly in Hermes with an independent read-only reviewer.

**Goal:** A working unofficial football portfolio concept with a formation roster inspired by the supplied image.

**Architecture:** Static HTML pages generated from shared layouts and sourced JSON. Native JavaScript handles group filters and accessible player details. No database.

**Tech Stack:** Node build script, plain CSS/JS, Playwright tests, nginx container.

## Global Constraints
- Portfolio concept, not official school site.
- Include home, schedule, program, game day, community, and roster.
- Cards reveal names/details on hover, focus, and touch.
- No invented athlete information; source sample labeled as historical/unverified-current.
- No existing container changes; smackover-db is unrelated and remains untouched.
- Repository /mnt/user/appdata/dev/smackover-football; publish develop and sha only.

## Task 1: Content and shared site (Jarvis)
Files: src/data.json, scripts/build.mjs, src/styles.css, src/assets/*.svg, docs/content.md. Generate semantic pages into dist. Record evidence for sourced facts and original assets. Test navigation and page availability using npm test after npm run build. Prototype path approved by first-draft request.

## Task 2: Formation roster (Jarvis; depends on task 1)
Files: src/roster.js, tests/site.spec.js. Filters consume data-player group attributes. Details use native dialog with Escape, close button, and focus restoration. Test filtering, hover/focus details, mobile tap, no overflow, and reduced motion. Run npm run test:e2e.

## Task 3: Review and publish (Jarvis + independent reviewer)
Run tests/build, Impeccable detector, bounded desktop/mobile screenshot review, and independent source review. Fix confirmed defects. Commit and push. GitHub Actions repeats checks and publishes Docker Hub develop + sha-commit. Verify digest and runtime HTTP. No production replacements.
