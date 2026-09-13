import { test, expect } from "@playwright/test";

for (const width of [1366, 390, 320]) {
  test(`active jerseys use readable painted dimensions at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/roster.html");
    const card = page.locator('[data-position="QB"] .stack-card').first();
    const measure = async () =>
      card.locator("img").evaluate((img) => {
        const r = img.getBoundingClientRect();
        const scale = Math.min(
          r.width / img.naturalWidth,
          r.height / img.naturalHeight,
        );
        return {
          paintedHeight: img.naturalHeight * scale,
          surnameHeight: (20 * img.naturalHeight * scale) / 280,
        };
      });
    await expect(card).toHaveClass(/is-active/);
    await expect(card.locator("img")).toBeVisible();
    const size = await measure();
    expect(size.paintedHeight).toBeGreaterThanOrEqual(width > 760 ? 130 : 38);
    if (width > 760) expect(size.surnameHeight).toBeGreaterThanOrEqual(9);
    const backup = page.locator('[data-position="QB"] .stack-card').nth(1);
    const firstHeight = (await card.boundingBox()).height;
    await backup.focus();
    expect((await backup.boundingBox()).height).toBe(firstHeight);
    expect((await card.boundingBox()).height).toBe(24);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}
