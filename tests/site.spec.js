import { test, expect } from "@playwright/test";
const pages = [
  "index",
  "roster",
  "schedule",
  "program",
  "gameday",
  "community",
];
for (const width of [390, 1440])
  test(`navigation, resources, reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    for (const name of pages) {
      await page.goto(`/${name}.html`);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator('nav a[aria-current="page"]')).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });
test("roster hover, keyboard, filter and dialog", async ({ page }) => {
  await page.goto("/roster.html");
  const first = page.locator(".player-card:visible").first();
  await first.hover();
  await expect(first.locator(".hover-detail")).toHaveCSS("opacity", "1");
  await first.focus();
  await expect(first.locator(".hover-detail")).toHaveCSS("opacity", "1");
  await first.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#dialog-title")).not.toBeEmpty();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(first).toBeFocused();
  for (const [name, group] of [
    ["Defense", "defense"],
    ["Special teams", "special"],
    ["Offense", "offense"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    const visible = page.locator(".player-card:visible");
    expect(await visible.count()).toBeGreaterThan(0);
    for (const card of await visible.all())
      expect((await card.getAttribute("data-groups")).split(" ")).toContain(
        group,
      );
  }
  await page
    .getByRole("button", { name: "Special teams", exact: true })
    .click();
  await expect(page.locator(".player-card:visible")).toHaveCount(1);
  await page.locator(".player-card:visible").click();
  await expect(page.locator("#dialog-title")).toHaveText("Samuel Zapata");
  await page.getByRole("button", { name: "Close player details" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("mobile tap, reduced motion and screenshots", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    baseURL: "http://127.0.0.1:8779",
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/roster.html");
  await page.locator(".player-card:visible").first().tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close player details" }).click();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["index", "roster"]) {
      await page.goto(`/${route}.html`);
      await page.screenshot({
        path: `.preview/${route}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await context.close();
});
test("no-JavaScript roster and 200 percent equivalent reflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 720, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8779/roster.html");
  await expect(
    page.getByText("Mitchell Polk", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator("#roster-fallback")).toBeVisible();
  await expect(page.locator(".player-card")).toHaveCount(17);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
