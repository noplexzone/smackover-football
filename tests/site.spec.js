import { test, expect } from "@playwright/test";
for (const width of [390, 1440])
  test(`two-page navigation and reflow ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.url());
    });
    for (const route of ["index", "roster"]) {
      await page.goto(`/${route}.html`);
      await expect(page.locator("nav a")).toHaveCount(2);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
test("latest and previous results, retired pages404", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".last-game")).toContainText("JUNCTION CITY");
  await expect(page.locator(".score-line").first()).toContainText("55");
  await expect(page.locator(".result-row")).toContainText("McGehee");
  await expect(page.locator(".result-row")).toContainText("38");
  for (const route of ["schedule", "program", "gameday", "community"]) {
    const response = await page.request.get(`/${route}.html`);
    expect(response.status()).toBe(404);
  }
});
test("all positional options, hover, keyboard and full player stats", async ({
  page,
}) => {
  await page.goto("/roster.html");
  const qb = page.locator('[data-position="QB"]');
  await expect(qb.locator("[data-id]")).toHaveCount(2);
  const main = qb.locator(".player-card");
  await expect(main).toContainText("Trason Parlor");
  const backup = qb.locator(".roster-option");
  await expect(backup).toContainText("Derrick Goodwin");
  await main.hover();
  await expect(main.locator(".hover-detail")).toHaveCSS("opacity", "1");
  await page.keyboard.press("Escape");
  await expect(main.locator(".hover-detail")).toHaveCSS("opacity", "0");
  await page.mouse.move(0, 0);
  await main.focus();
  await expect(main.locator(".hover-detail")).toHaveCSS("opacity", "1");
  await main.press("Enter");
  await expect(page.locator("#dialog-title")).toHaveText("Trason Parlor");
  await expect(page.getByRole("dialog")).toContainText("253");
  await expect(page.getByRole("dialog")).toContainText("170 lbs");
  await page.keyboard.press("Escape");
  await expect(main).toBeFocused();
  await backup.click();
  await expect(page.locator("#dialog-title")).toHaveText("Derrick Goodwin");
  await page.getByRole("button", { name: "Close player details" }).click();
  await page.getByRole("button", { name: "Defense", exact: true }).click();
  await expect(page.locator('[data-unit="offense"]:visible')).toHaveCount(0);
  await page
    .getByRole("button", { name: "Special teams", exact: true })
    .click();
  await expect(page.locator('[data-position="K"] [data-id]')).toHaveCount(3);
  await expect(page.locator('[data-position="P"] [data-id]')).toHaveCount(2);
});
test("touch backup profile, reduced motion and screenshots", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    baseURL: "http://127.0.0.1:8779",
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/roster.html");
  await page.locator('[data-position="QB"] .roster-option').tap();
  await expect(page.locator("#dialog-title")).toHaveText("Derrick Goodwin");
  await page.getByRole("button", { name: "Close player details" }).tap();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["index", "roster"]) {
      await page.goto(`/${route}.html`);
      await page.screenshot({
        path: `.preview/current-${route}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await context.close();
});
test("no JavaScript retains full roster and statistics", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 720, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8779/roster.html");
  await expect(page.locator("#roster-fallback")).toBeVisible();
  await expect(page.locator(".roster-toolbar")).not.toBeVisible();
  await page.locator(".complete-roster>summary").click();
  await expect(page.locator(".roster-directory>details")).toHaveCount(42);
  await page
    .locator(".roster-directory>details")
    .filter({ has: page.locator("summary", { hasText: "Trason Parlor" }) })
    .locator("summary")
    .first()
    .click();
  await expect(page.locator(".roster-directory")).toContainText("253");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
