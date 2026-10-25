import { test, expect } from "@playwright/test";
import { pages, stores } from "../src/data.js";

for (const route of pages.filter((p) => p.kind !== "home")) {
  test(`direct navigation, assets and responsive layout: ${route.path}`, async ({
    page,
  }) => {
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        failures.push(`${response.status()} ${response.url()}`);
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [320, 360, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const response = await page.goto(route.path);
      expect(response.status()).toBe(200);
      await expect(page).toHaveTitle(route.title);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(async () => {
        await document.fonts.ready;
        [...document.images].forEach((image) => (image.loading = "eager"));
        await Promise.all(
          [...document.images].map((image) => image.decode().catch(() => {})),
        );
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      expect(
        await page
          .locator("img")
          .evaluateAll((images) =>
            images.filter((i) => !i.naturalWidth).map((i) => i.src),
          ),
      ).toEqual([]);
      await expect(page.locator('a[href="#"]')).toHaveCount(0);
      await page.locator(".footer").scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
    }
    expect(failures).toEqual([]);
  });
}

test("directory combines search and filters, handles empty results and clears", async ({
  page,
}) => {
  await page.goto("/dokonlar/");
  await page.locator('[data-store-filter="food"]').click();
  await expect(
    page.locator("#store-directory .store-card:visible"),
  ).toHaveCount(2);
  await page.locator("#store-search").fill("manti");
  await expect(
    page.locator("#store-directory .store-card:visible"),
  ).toHaveCount(1);
  await expect(
    page.locator("#store-directory .store-card:visible"),
  ).toHaveAttribute("href", "/dokonlar/ofiyat/");
  await page.locator('[data-store-filter="home"]').click();
  await expect(page.locator("#store-empty")).toBeVisible();
  await page.locator("#clear-store-search").click();
  await expect(
    page.locator("#store-directory .store-card:visible"),
  ).toHaveCount(4);
  await expect(page.locator("#store-search")).toBeFocused();
  await page.locator("#store-search").fill("qO'Y");
  await expect(
    page.locator("#store-directory .store-card:visible"),
  ).toHaveCount(1);
  await expect(page.locator("#store-results")).toHaveText("1 ta do‘kon");
});

test("all four store category deep links survive reload and invalid values fall back", async ({
  page,
}) => {
  for (const store of stores) {
    await page.goto(`${store.href}?kategoriya=2`);
    await expect(page.locator(`#${store.key}-tab-2`)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.locator(".product-card")).toHaveCount(
      store.categories[2].items.length,
    );
    await page.locator(`#${store.key}-tab-1`).click();
    await expect(page).toHaveURL(/kategoriya=1$/);
    await page.reload();
    await expect(page.locator(`#${store.key}-tab-1`)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  }
  await page.goto("/dokonlar/ofiyat/?kategoriya=999");
  await expect(page.locator("#ofiyat-tab-0")).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("a previously lower directory card is revealed after filtering moves it into view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dokonlar/");
  await page.locator('[data-store-filter="home"]').click();
  const card = page.locator("#store-directory .store-card:not([hidden])");
  await expect(card).toHaveCount(1);
  await expect(card).toHaveAttribute("href", "/dokonlar/xojalik/");
  await expect(card).toHaveCSS("opacity", "1");
});

test("gallery filters, keyboard navigation, focus restoration and touch swipe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/galereya/");
  await page.locator('[data-gallery-filter="market"]').click();
  await expect(page.locator(".gallery-item:visible")).toHaveCount(2);
  const first = page.locator(".gallery-item:visible").first();
  await first.click();
  const dialog = page.locator("#gallery-dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("#lightbox-position")).toContainText("1 / 2");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#lightbox-position")).toContainText("2 / 2");
  const surface = page.locator(".lightbox-image");
  await surface.dispatchEvent("pointerdown", {
    pointerType: "touch",
    clientX: 270,
    clientY: 230,
  });
  await surface.dispatchEvent("pointerup", {
    pointerType: "touch",
    clientX: 90,
    clientY: 230,
  });
  await expect(page.locator("#lightbox-position")).toContainText("1 / 2");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(first).toBeFocused();
  await page.locator('[data-gallery-filter="hardware"]').click();
  await page.locator(".gallery-item:visible").click();
  await expect(page.locator("#gallery-next")).toBeDisabled();
  await expect(page.locator("#lightbox-store")).toHaveAttribute(
    "href",
    "/dokonlar/xojalik/",
  );
});

test("FAQ search updates groups and lets keyboard users expand an answer", async ({
  page,
}) => {
  await page.goto("/savollar/");
  await page.locator("#faq-search").fill("yuklab");
  await expect(page.locator(".faq-item:visible")).toHaveCount(1);
  await page.locator(".faq-item:visible summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".faq-item:visible")).toHaveAttribute("open", "");
  await page.locator("#faq-search").fill("xyzabc");
  await expect(page.locator("#faq-empty")).toBeVisible();
  await page.locator("#clear-faq-search").click();
  await expect(page.locator(".faq-item:visible")).toHaveCount(12);
  await expect(page.locator("#faq-search")).toBeFocused();
});

test("mobile bottom navigation changes real pages and preserves the active item", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".bottom-nav")).toBeVisible();
  await page
    .locator(".bottom-nav")
    .getByRole("link", { name: "Do‘konlar" })
    .click();
  await expect(page).toHaveURL(/\/dokonlar\/$/);
  await expect(page.locator('.bottom-nav [aria-current="page"]')).toHaveText(
    "Do‘konlar",
  );
  await page.locator(".store-card").first().click();
  await expect(page).toHaveURL(/\/dokonlar\/ofiyat\/$/);
  await expect(page.locator('.bottom-nav [aria-current="page"]')).toHaveText(
    "Do‘konlar",
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/dokonlar\/$/);
});

test("all generated internal links point to a built page and existing anchor", async ({
  page,
  request,
}) => {
  const known = new Set(pages.map((p) => p.path));
  for (const route of pages) {
    await page.goto(route.path);
    const links = await page.locator("a[href]").evaluateAll((links) =>
      links.map((link) => ({
        path: new URL(link.href).pathname,
        hash: new URL(link.href).hash,
        origin: new URL(link.href).origin,
      })),
    );
    for (const link of links) {
      if (link.origin !== "http://127.0.0.1:4173") continue;
      expect(known.has(link.path), `${route.path} -> ${link.path}`).toBe(true);
      if (link.hash && link.path === route.path)
        await expect(
          page.locator(`[id="${decodeURIComponent(link.hash.slice(1))}"]`),
        ).toHaveCount(1);
    }
  }
});
