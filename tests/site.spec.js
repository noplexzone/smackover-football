import { test, expect } from "@playwright/test";
for (const viewport of [
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
]) {
  test(`two formation rows remain reachable at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.url());
    });
    for (const route of ["index", "roster"]) {
      await page.goto(`/${route}.html`);
      await expect(page.locator("nav a")).toHaveCount(2);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(viewport.width);
    }
    for (const unit of ["offense", "defense", "special"]) {
      await page.locator(`[data-group="${unit}"]`).click();
      // Readability takes precedence over fitting the whole field vertically.
      const rows = page.locator(
        `.unit-formation[data-unit="${unit}"] .formation-row`,
      );
      await expect(rows).toHaveCount(unit === "special" ? 1 : 2);
      const geometry = await page
        .locator(`.unit-formation[data-unit="${unit}"] .card-stack`)
        .evaluateAll((stacks) =>
          stacks.map((stack) => {
            const cards = [...stack.querySelectorAll("button")];
            return {
              height: stack.getBoundingClientRect().height,
              count: cards.length,
            };
          }),
        );
      for (const stack of geometry) {
        expect(stack.height).toBe(
          (viewport.width > 760 ? 184 : 100) + 24 * (stack.count - 1),
        );
        // Offscreen rows are reached by normal document scrolling.
      }
      expect(
        await page
          .locator(
            ".field, .formation, .formation-row, .position-group, .card-stack",
          )
          .evaluateAll((elements) =>
            elements.every(
              (e) =>
                !["auto", "scroll"].includes(getComputedStyle(e).overflowY),
            ),
          ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
test("all ten schedule rows distinguish future games from finals", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".last-game")).toContainText("JUNCTION CITY");
  await expect(page.locator(".score-line").first()).toContainText("55");
  await expect(page.locator(".result-row")).toHaveCount(10);
  await expect(page.locator('[data-status="final"]')).toHaveCount(2);
  await expect(page.locator('[data-status="scheduled"]')).toHaveCount(8);
  await expect(
    page.locator('[data-status="scheduled"] .schedule-score'),
  ).toHaveCount(0);
  for (const row of await page.locator('[data-status="scheduled"]').all()) {
    await expect(row.locator("strong")).toHaveText(/\d{1,2}:\d{2}pm/);
    await expect(row).toContainText("Scheduled");
  }
});
test("keyboard full details, native Escape and focus restore", async ({
  page,
}) => {
  await page.goto("/roster.html");
  const cards = page.locator('[data-position="QB"] .stack-card');
  await expect(cards).toHaveCount(2);
  await cards.first().focus();
  await cards.first().press("Enter");
  await expect(page.locator("#dialog-title")).toHaveText("Trason Parlor");
  await expect(page.getByRole("dialog")).toContainText("253");
  await page.keyboard.press("Escape");
  await expect(cards.first()).toBeFocused();
  await cards.nth(1).press("Enter");
  await expect(page.locator("#dialog-title")).toHaveText("Derrick Goodwin");
  await page.getByRole("button", { name: "Close player details" }).click();
  await expect(cards.nth(1)).toBeFocused();
});
test("touch exposes every backup strip", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8779/roster.html");
  for (const unit of ["offense", "defense", "special"]) {
    await page.locator(`[data-group="${unit}"]`).tap();
    for (const card of await page
      .locator(`.unit-formation[data-unit="${unit}"] .stack-backup`)
      .all()) {
      const expectedName = (await card.getAttribute("aria-label")).match(
        /^View (.*), number /,
      )[1];
      await card.scrollIntoViewIfNeeded();
      const box = await card.boundingBox();
      await page.touchscreen.tap(
        box.x + box.width / 2,
        box.y + box.height - 10,
      );
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.locator("#dialog-title")).toHaveText(expectedName);
      await page.getByRole("button", { name: "Close player details" }).tap();
    }
  }
  await context.close();
});
test("no JavaScript retains 42 complete profiles", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
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
  await context.close();
});
test("preview is hoverable outside stack, unclipped and dismissible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/roster.html");
  const card = page.locator('[data-position="QB"] .stack-backup');
  await card.scrollIntoViewIfNeeded();
  // Flush the scroll event (which dismisses previews) before pointer entry.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 10);
  const preview = page.locator("#player-preview");
  await expect(preview).toBeVisible();
  await preview.hover();
  await page.waitForTimeout(250);
  await expect(preview).toBeVisible();
  const rect = await preview.boundingBox();
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.x + rect.width).toBeLessThanOrEqual(1366);
  expect(rect.y + rect.height).toBeLessThanOrEqual(768);
  await page.keyboard.press("Escape");
  await expect(preview).toBeHidden();
  await page.mouse.move(0, 0);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 10);
  await page.getByRole("button", { name: "Dismiss player preview" }).click();
  await expect(preview).toBeHidden();
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
]) {
  test(`every accordion strip and active card is exposed at ${viewport.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/roster.html");
    const assertStack = async (stack, activeIndex) => {
      const geometry = await stack.evaluate((el) =>
        [...el.children].map((card) => {
          const r = card.getBoundingClientRect();
          return {
            top: r.top,
            bottom: r.bottom,
            height: r.height,
            exposed: [2, r.height / 2, r.height - 2].every((y) =>
              card.contains(
                document.elementFromPoint(r.x + r.width / 2, r.y + y),
              ),
            ),
          };
        }),
      );
      expect((await stack.boundingBox()).height).toBe(
        (viewport.width > 760 ? 184 : 100) + 24 * (geometry.length - 1),
      );
      for (const [index, card] of geometry.entries()) {
        expect(card.height).toBe(
          index === activeIndex ? (viewport.width > 760 ? 184 : 100) : 24,
        );
        expect(card.exposed).toBe(true);
        if (index) expect(card.top).toBe(geometry[index - 1].bottom);
      }
    };
    for (const unit of ["offense", "defense", "special"]) {
      await page.locator(`[data-group="${unit}"]`).click();
      for (const stack of await page
        .locator(`[data-unit="${unit}"] .card-stack`)
        .all()) {
        await stack.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        await assertStack(stack, 0);
        const cards = await stack.locator(".stack-card").all();
        for (const [index, card] of cards.entries()) {
          const box = await card.boundingBox();
          await page.mouse.move(box.x + box.width / 2, box.y + box.height - 4);
          await expect(card).toHaveClass(/is-active/);
          await assertStack(stack, index);
          await page.keyboard.press("Escape");
          await assertStack(stack, index);
          await page.mouse.move(0, 0);
          await assertStack(stack, 0);
          await card.focus();
          await page.keyboard.press("Escape");
          await page.mouse.move(0, 0);
          await assertStack(stack, index);
          await page.locator(`[data-group="${unit}"]`).focus();
          await stack.scrollIntoViewIfNeeded();
          await assertStack(stack, 0);
        }
      }
    }
  });
}

test("jersey artwork is contained, rear-facing and hidden on strips", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1366, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/roster.html");
    for (const unit of ["offense", "defense", "special"]) {
      await page.locator(`[data-group="${unit}"]`).click();
      const cards = await page
        .locator(`.unit-formation[data-unit="${unit}"] .stack-card`)
        .all();
      for (const card of cards) {
        await card.focus();
        await page.keyboard.press("Escape");
        const contained = await card.evaluate((b) => {
          const r = b.getBoundingClientRect(),
            a = b.querySelector(".stack-art").getBoundingClientRect(),
            i = b.querySelector("img").getBoundingClientRect();
          return (
            i.width > 0 &&
            i.height > 0 &&
            i.x >= a.x &&
            i.y >= a.y &&
            i.right <= a.right &&
            i.bottom <= a.bottom &&
            a.x >= r.x &&
            a.y >= r.y &&
            a.right <= r.right &&
            a.bottom <= r.bottom &&
            b.querySelector("img").naturalWidth > 0
          );
        });
        expect(contained).toBe(true);
        const paintedHeight = await card.locator("img").evaluate((img) => {
          const r = img.getBoundingClientRect();
          return Math.min(r.height, (r.width * 280) / 300);
        });
        expect(paintedHeight).toBeGreaterThanOrEqual(
          viewport.width > 760 ? 130 : 50,
        );
      }
      for (const art of await page
        .locator(
          `.unit-formation[data-unit="${unit}"] .stack-card:not(.is-active) .stack-art`,
        )
        .all())
        await expect(art).toBeHidden();
    }
  }
});
