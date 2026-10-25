import { test, expect } from "@playwright/test";
import { createShuffleBag } from "../src/shuffle-bag.js";
import { stores } from "../src/data.js";

async function ready(page, path = "/") {
  await page.goto(path);
  await expect(page.locator("body")).toHaveAttribute(
    "data-motion-ready",
    "true",
  );
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-ready",
    "true",
  );
}
async function metrics(page) {
  return page.evaluate(() => {
    const hero = document.querySelector(".hero-cinema"),
      story = document.querySelector(".store-story");
    const stage = hero.querySelector(".hero-cinema-stage");
    return {
      heroTravel: hero.offsetHeight - stage.clientHeight,
      storyTop: story.getBoundingClientRect().top + scrollY,
      storyTravel:
        story.offsetHeight - story.querySelector(".story-stage").clientHeight,
    };
  });
}
async function jump(page, y) {
  await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
  await page.waitForTimeout(850);
}

test("shuffle cycles include all four stores and never repeat at a boundary", () => {
  const keys = stores.map((s) => s.key);
  let seed = 19;
  const next = createShuffleBag(
    keys,
    () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646,
  );
  const sequence = Array.from({ length: 80 }, next);
  for (let i = 0; i < sequence.length; i += 4)
    expect(new Set(sequence.slice(i, i + 4)).size).toBe(4);
  for (let i = 1; i < sequence.length; i++)
    expect(sequence[i]).not.toBe(sequence[i - 1]);
});

test("photo autoplay shows all four stores using two decoded layers", async ({
  page,
}) => {
  test.setTimeout(45000);
  await page.clock.install();
  await ready(page);
  const seen = [
    await page.locator("#photo-backdrop").getAttribute("data-active"),
  ];
  for (let i = 0; i < 3; i++) {
    await page.clock.runFor(6500);
    seen.push(
      await page.locator("#photo-backdrop").getAttribute("data-active"),
    );
  }
  expect(new Set(seen).size).toBe(4);
  for (let i = 1; i < seen.length; i++) expect(seen[i]).not.toBe(seen[i - 1]);
  await expect(page.locator(".photo-layer")).toHaveCount(2);
  expect(
    await page
      .locator(".photo-layer img")
      .evaluateAll((images) =>
        images.every((i) => i.complete && i.naturalWidth > 0),
      ),
  ).toBe(true);
});

test("pause freezes autoplay and persists when navigating to another page", async ({
  page,
}) => {
  await page.clock.install();
  await ready(page);
  await page.locator("[data-photo-pause]").click();
  const initial = await page
    .locator("#photo-backdrop")
    .getAttribute("data-active");
  await page.clock.runFor(11000);
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-active",
    initial,
  );
  await ready(page, "/galereya/");
  await expect(page.locator("[data-photo-pause]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const next = await page
    .locator("#photo-backdrop")
    .getAttribute("data-active");
  await page.locator("[data-photo-pause]").click();
  await page.clock.runFor(6500);
  await expect(page.locator("#photo-backdrop")).not.toHaveAttribute(
    "data-active",
    next,
  );
});

test("a failed next photo keeps the current image and skips to another store", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.999;
  });
  await page.clock.install();
  await page.route("**/shashlik-800.webp", (route) => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-active",
    "ofiyat",
  );
  await page.clock.runFor(6500);
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-active",
    "ofiyat",
  );
  expect(
    await page
      .locator(".photo-layer")
      .first()
      .locator("img")
      .evaluate((i) => i.naturalWidth > 0),
  ).toBe(true);
  await page.clock.runFor(6500);
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-active",
    "hardware",
  );
});

test("store detail backgrounds remain specific to that store", async ({
  page,
}) => {
  await page.clock.install();
  await ready(page, "/dokonlar/xojalik/");
  await page.clock.runFor(12500);
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-active",
    "hardware",
  );
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-single",
    "true",
  );
});

test("the full photo folds into a four-photo collage and reverses on scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const m = await metrics(page);
  await jump(page, m.heroTravel * 0.6);
  expect(
    await page
      .locator("#photo-backdrop")
      .evaluate((e) => e.getBoundingClientRect().width),
  ).toBeLessThan(390 * 0.6);
  await expect(page.locator(".cinema-tile")).toHaveCount(4);
  expect(await page.locator(".hero-intro").evaluate((e) => e.inert)).toBe(true);
  expect(await page.locator(".hero-collage").evaluate((e) => e.inert)).toBe(
    false,
  );
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-owner",
    "hero",
  );
  await jump(page, 0);
  expect(
    await page
      .locator("#photo-backdrop")
      .evaluate((e) => e.getBoundingClientRect().width),
  ).toBeGreaterThan(389);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.locator(".hero-intro").evaluate((e) => e.inert)).toBe(
    false,
  );
});

test("all four story chapters match the background, reverse, and isolate hidden links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const m = await metrics(page);
  for (const index of [0, 1, 2, 3, 2, 1, 0]) {
    await jump(page, m.storyTop + ((index + 0.25) / 4) * m.storyTravel);
    await expect(page.locator(".store-story")).toHaveAttribute(
      "data-active-store",
      stores[index].key,
    );
    await expect(page.locator("#photo-backdrop")).toHaveAttribute(
      "data-active",
      stores[index].key,
    );
    expect(
      await page
        .locator(".story-panel")
        .evaluateAll((panels) => panels.filter((p) => !p.inert).length),
    ).toBe(1);
    await expect(
      page.locator('.story-panel[aria-hidden="false"] a'),
    ).toHaveAttribute("href", stores[index].href);
  }
  await jump(page, m.storyTop + m.storyTravel + 200);
  expect(
    await page
      .locator("#photo-backdrop")
      .evaluate((e) => e.getBoundingClientRect().width),
  ).toBeGreaterThan(389);
});

test("mid-transition story images use wipe, circle and zoom masks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const m = await metrics(page);
  for (const [index, variant] of [
    [0, "wipe"],
    [1, "circle"],
    [2, "zoom"],
  ]) {
    await jump(page, m.storyTop + ((index + 0.795) / 4) * m.storyTravel);
    const next = page.locator(".photo-layer").nth(1);
    if (variant === "circle")
      await expect(next).toHaveCSS("clip-path", /circle/);
    if (variant === "wipe") await expect(next).toHaveCSS("clip-path", /inset/);
    if (variant === "zoom")
      expect(
        await next
          .locator("img")
          .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a),
      ).toBeGreaterThan(1);
  }
});

test("rotation removes pins on short screens and rebuilds the portrait experience", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const m = await metrics(page);
  await jump(page, m.heroTravel * 0.6);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator("body")).not.toHaveClass(/is-motion-ready/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(
    await page
      .locator(".story-panel")
      .evaluateAll((panels) => panels.every((p) => !p.inert)),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("body")).toHaveClass(/is-motion-ready/);
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
});

test("reduced motion inside a scene restores all content and freezes the photos", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const m = await metrics(page);
  await jump(page, m.heroTravel * 0.6);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-photo-pause]")).toBeDisabled();
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  expect(
    await page
      .locator(".story-panel")
      .evaluateAll((panels) =>
        panels.every((p) => !p.inert && getComputedStyle(p).opacity === "1"),
      ),
  ).toBe(true);
  await expect(page.locator(".hero-intro")).toHaveCSS("opacity", "1");
  await expect(page.locator(".photo-shade")).toHaveCSS("opacity", "1");
});

test("autoplay pauses while the document is hidden", async ({ page }) => {
  await page.clock.install();
  await ready(page);
  const initial = await page
    .locator("#photo-backdrop")
    .getAttribute("data-active");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(11000);
  await expect(page.locator("#photo-backdrop")).toHaveAttribute(
    "data-active",
    initial,
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(6500);
  await expect(page.locator("#photo-backdrop")).not.toHaveAttribute(
    "data-active",
    initial,
  );
});

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`animated intro, collage and story remain within ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    const m = await metrics(page);
    for (const y of [0, m.heroTravel * 0.6, m.storyTop + m.storyTravel * 0.4]) {
      await jump(page, y);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
    }
  });
}
