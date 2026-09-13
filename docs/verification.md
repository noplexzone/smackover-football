# First-draft verification

- Local build: six pages, 17 unique historical-source player profiles.
- Unit/resource suite: 7 passing tests; local links and assets exist.
- Prettier check and Impeccable 4.1.0 detector: passing, no findings.
- Browser: real Chromium/CDP, desktop 1440px and mobile 390px. Offense/defense/special filters and native dialog inspected. Desktop and mobile screenshots reviewed; mobile navigation wrapping corrected and visually confirmed.
- GitHub Actions at commit 3b15555: all five Playwright tests passed, including keyboard/hover/dialog, a real touch-enabled tap context, reduced motion, resources/reflow, and no-JavaScript fallback.
- First CI failure: noscript content was absent in the disabled-JavaScript browser check. Replaced with progressive enhancement: visible fallback, controls enabled only after script loads. Regression passed.
- Local Playwright browser installation timed out; browser tests run on the Ubuntu CI runner, not claimed as local.
- Final CI additionally builds and runs the exact nginx image, compares all six HTTP responses to built files, checks missing route 404 and revision label, then publishes develop and sha only.
- No Unraid container created, replaced, restarted, or modified. Existing smackover-db not used. Deployment requires separate approval.

## Content limitations
Historical source sample only; no verified current roster/depth chart, live schedule, current coach appointments, real player photographs, ticket sales, sponsor endorsements, or live news. Original jersey/stadium illustrations and licensed locally hosted font.
