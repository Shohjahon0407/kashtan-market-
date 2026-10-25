import { test, expect } from "@playwright/test";

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`layout, assets and readable content at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") failures.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400)
        failures.push(`${response.status()} ${response.url()}`);
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const selector of [
      "#top",
      "#dokonlar",
      "#ofiyat",
      "#shashlik",
      "#xojalik",
      "#misqol",
      "#ilova",
      "#tez-kunda",
      ".footer",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(160);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      expect(overflow, `overflow at ${selector}`).toBeLessThanOrEqual(1);
    }
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((image) => image.decode().catch(() => {})),
      );
    });
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((image) => !image.naturalWidth)
            .map((image) => image.src),
        ),
    ).toEqual([]);
    expect(failures).toEqual([]);
    await expect(page.locator(".store-card")).toHaveCount(4);
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
    await expect(page.locator("#contact-links")).toBeHidden();
    await expect(page.locator("a[data-platform]")).toHaveCount(0);
  });
}

test("mobile menu traps focus, closes on Escape and restores the trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Menyuni ochish" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Menyuni yopish" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "Kashtan Market — bosh sahifa" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("dialog").getByRole("link", { name: "Tez kunda" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "Kashtan Market — bosh sahifa" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Menyuni yopish" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Do‘konlar" })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/#dokonlar$/);
  await expect(page.locator("#dokonlar")).toBeFocused();
});

test("each store has independently operable keyboard tabs", async ({
  page,
}) => {
  await page.goto("/");
  for (const key of ["ofiyat", "shashlik", "hardware", "market"]) {
    const browser = page.locator(`[data-categories="${key}"]`);
    const tabs = browser.getByRole("tab");
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(browser.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      `${key}-tab-1`,
    );
    await expect(
      browser.getByRole("tabpanel").locator(".panel-label"),
    ).toHaveText((await tabs.nth(1).textContent()).toLocaleUpperCase("uz"));
    await page.keyboard.press("End");
    await expect(tabs.nth(3)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  }
});

test("app tabs change the preview by keyboard without starting a video", async ({
  page,
}) => {
  await page.goto("/");
  const tabs = page.locator(".feature-tab");
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator("#app-preview")).toHaveAttribute(
    "aria-labelledby",
    "feature-1",
  );
  await expect(page.locator(".phone-video")).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Space");
  await expect(page.locator("#app-preview")).toHaveAttribute(
    "aria-labelledby",
    "feature-2",
  );
  await expect(page.locator(".phone-demo-heading")).toHaveText(
    "Qidirganingiznibizga ayting.",
  );
  await tabs.nth(0).click();
  await expect(page.locator(".phone-store")).toHaveCount(4);
});

test("navigation tracks the active store and app sections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#ofiyat").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-nav="stores"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  await page.locator("#ilova").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-nav="app"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect(page.locator("#header")).toHaveClass(/is-scrolled/);
});

test("reduced motion keeps all content visible, including live preference changes", async ({
  page,
}) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".is-pending")).toHaveCount(0);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  for (const element of await page.locator(".reveal").all())
    await expect(element).toHaveCSS("opacity", "1");
  await page.reload();
  await expect(page.locator(".is-pending")).toHaveCount(0);
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
});

test("primary content is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".store-card")).toHaveCount(4);
  await expect(page.locator("#ofiyat .category-panel")).toContainText("Osh");
  await expect(page.locator(".is-pending")).toHaveCount(0);
  await context.close();
});
