import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const url = process.env.SITE_PREVIEW_URL || "http://localhost:5180";
const output = resolve("artifacts");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    (existsSync("/usr/bin/google-chrome")
      ? "/usr/bin/google-chrome"
      : undefined),
  args: ["--no-sandbox"],
});
function unique(name) {
  let path = join(output, name),
    index = 1;
  while (existsSync(path))
    path = join(output, name.replace(".mp4", `_${index++}.mp4`));
  return path;
}
async function scroll(page, target, duration) {
  await page.evaluate(
    ({ target, duration }) =>
      new Promise((resolve) => {
        const from = scrollY;
        let started;
        function step(t) {
          started ??= t;
          const p = Math.min(1, (t - started) / duration);
          const eased =
            p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          scrollTo({
            top: from + (target - from) * eased,
            behavior: "instant",
          });
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      }),
    { target, duration },
  );
}
try {
  for (const [name, width, height] of [
    ["mobile", 390, 844],
    ["desktop", 1440, 1000],
  ]) {
    const raw = await mkdtemp(join(tmpdir(), "kashtan-walkthrough-"));
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: name === "mobile",
      hasTouch: name === "mobile",
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
      recordVideo: { dir: raw, size: { width, height } },
    });
    await context.addInitScript(() => {
      Math.random = () => 0.999;
    });
    const page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const video = page.video();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () =>
        document.body.dataset.motionReady === "true" &&
        document.querySelector("#photo-backdrop").dataset.ready === "true",
    );
    const initial = await page
      .locator("#photo-backdrop")
      .getAttribute("data-active");
    await page.waitForFunction(
      (initial) =>
        document.querySelector("#photo-backdrop").dataset.active !== initial,
      initial,
      { timeout: 10000 },
    );
    const m = await page.evaluate(() => {
      const hero = document.querySelector(".hero-cinema"),
        story = document.querySelector(".store-story");
      return {
        heroTravel:
          hero.offsetHeight -
          hero.querySelector(".hero-cinema-stage").clientHeight,
        storyTop: story.getBoundingClientRect().top + scrollY,
        storyTravel:
          story.offsetHeight - story.querySelector(".story-stage").clientHeight,
      };
    });
    await scroll(page, m.heroTravel * 0.6, 2300);
    await page.waitForTimeout(1000);
    for (let index = 0; index < 4; index++) {
      await scroll(
        page,
        m.storyTop + ((index + 0.25) / 4) * m.storyTravel,
        index ? 1400 : 1900,
      );
      await page.waitForTimeout(650);
    }
    for (const index of [2, 1]) {
      await scroll(
        page,
        m.storyTop + ((index + 0.25) / 4) * m.storyTravel,
        1100,
      );
      await page.waitForTimeout(300);
    }
    await scroll(page, m.storyTop + m.storyTravel + height + 130, 2000);
    await page.waitForTimeout(1000);
    await context.close();
    if (errors.length) throw new Error(errors.join("\n"));
    const file = unique(`cinematic_${name}_scroll.mp4`);
    execFileSync("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      "0.7",
      "-i",
      await video.path(),
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "22",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      file,
    ]);
    console.log(file);
  }
} finally {
  await browser.close();
}
