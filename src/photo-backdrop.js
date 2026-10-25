import { gsap } from "gsap";
import { sceneMedia, stores, motionSettings } from "./data.js";
import { createShuffleBag } from "./shuffle-bag.js";

export function createPhotoBackdrop() {
  const element = document.querySelector("#photo-backdrop");
  const layers = [...element.querySelectorAll(".photo-layer")];
  const button = document.querySelector("[data-photo-pause]");
  const label = document.querySelector("[data-photo-name]");
  const keys = stores.map((store) => store.key),
    nextKey = createShuffleBag(keys);
  const loaded = new Map(),
    pending = new Map(),
    failed = new Set(),
    locks = new Set();
  const pans = [null, null];
  let active = element.dataset.active,
    front = 0,
    timer,
    fade,
    requestId = 0,
    scrubId = 0;
  let reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
  let paused = false;
  try {
    paused = sessionStorage.getItem("kashtan-photo-paused") === "true";
  } catch {}
  const single = element.dataset.single === "true";
  const mediaQuery = matchMedia("(max-width:767px)");
  const source = (key) =>
    sceneMedia[key][mediaQuery.matches ? "mobile" : "desktop"];
  const blocked = () => paused || reduced || document.hidden || locks.size > 0;
  function updateLabel(key) {
    const store = stores.find((s) => s.key === key);
    element.dataset.active = key;
    label.textContent = `${store.number} / ${store.short}`;
    document
      .querySelectorAll("[data-photo-pip]")
      .forEach((pip) =>
        pip.classList.toggle("is-current", pip.dataset.photoPip === key),
      );
    if (active !== key) {
      active = key;
      document.dispatchEvent(
        new CustomEvent("photochange", { detail: { key } }),
      );
    }
  }
  function load(key) {
    const url = source(key);
    if (loaded.has(url)) return Promise.resolve(true);
    if (failed.has(url)) return Promise.resolve(false);
    if (pending.has(url)) return pending.get(url);
    const promise = new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = async () => {
        try {
          await image.decode();
        } catch {}
        loaded.set(url, true);
        pending.delete(url);
        resolve(true);
      };
      image.onerror = () => {
        failed.add(url);
        pending.delete(url);
        resolve(false);
      };
      image.src = url;
    });
    pending.set(url, promise);
    return promise;
  }
  function assign(layer, key) {
    if (
      layer.dataset.key === key &&
      layer.querySelector("img").getAttribute("src") === source(key)
    )
      return;
    layer.querySelectorAll("source").forEach((e) => e.remove());
    const image = layer.querySelector("img");
    image.src = source(key);
    image.style.setProperty("--focus-mobile", sceneMedia[key].focusMobile);
    image.style.setProperty("--focus-desktop", sceneMedia[key].focusDesktop);
    layer.dataset.key = key;
  }
  function stopTimer() {
    clearTimeout(timer);
    timer = null;
  }
  function pan(index) {
    pans[index]?.kill();
    const img = layers[index].querySelector("img");
    gsap.set(img, { scale: 1.025, xPercent: 0, yPercent: 0 });
    pans[index] = gsap.to(img, {
      scale: 1.105,
      xPercent: index ? 1 : -1,
      yPercent: -1,
      duration: 14,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      paused: blocked() || index !== front,
    });
  }
  function sync() {
    stopTimer();
    button.setAttribute("aria-pressed", String(paused));
    button.classList.toggle("is-paused", paused);
    button.setAttribute(
      "aria-label",
      paused
        ? "Fon almashishini davom ettirish"
        : "Fon almashishini pauza qilish",
    );
    button.disabled = reduced;
    element.dataset.paused = String(paused || reduced || document.hidden);
    pans.forEach((tween, i) => {
      if (tween) tween.paused(blocked() || i !== front);
    });
    if (fade) fade.paused(paused || reduced || document.hidden);
    if (!blocked() && !single)
      timer = setTimeout(advance, motionSettings.autoplayMs);
  }
  function normalize() {
    assign(layers[0], active);
    front = 0;
    gsap.set(layers[0], {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
    });
    gsap.set(layers[1], {
      opacity: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
    });
    pan(0);
    pan(1);
    element.dataset.phase = "idle";
  }
  async function advance() {
    if (blocked() || single) return;
    let key = nextKey();
    if (key === active) key = nextKey();
    const id = ++requestId;
    const ready = await load(key);
    if (id !== requestId || blocked()) return;
    if (!ready) {
      sync();
      return;
    }
    const back = 1 - front;
    assign(layers[back], key);
    gsap.set(layers[back], {
      opacity: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
    });
    pan(back);
    pans[back]?.play();
    element.dataset.phase = "crossfade";
    element.dataset.next = key;
    fade = gsap
      .timeline({
        onComplete: () => {
          gsap.set(layers[front], { opacity: 0 });
          pans[front]?.pause();
          front = back;
          pans[front]?.paused(blocked());
          updateLabel(key);
          element.dataset.phase = "idle";
          delete element.dataset.next;
          fade = null;
        },
      })
      .to(layers[back], {
        opacity: 1,
        duration: motionSettings.crossfadeMs / 1000,
        ease: "sine.inOut",
      });
    sync();
    pans[back]?.play();
  }
  function lock(reason) {
    locks.add(reason);
    ++requestId;
    stopTimer();
    if (fade) {
      fade.progress(1);
      fade = null;
    }
    pans.forEach((t) => t?.pause());
    element.dataset.owner = reason;
  }
  function unlock(reason) {
    locks.delete(reason);
    element.dataset.owner = [...locks].at(-1) || "auto";
    if (reason === "story") {
      ++scrubId;
      normalize();
    }
    sync();
  }
  function applyScrub(from, to, mix, variant) {
    assign(layers[0], from);
    assign(layers[1], to);
    front = 0;
    gsap.set(layers[0], {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
    });
    const mask =
      variant === "circle"
        ? `circle(${mix * 150}% at 55% 48%)`
        : variant === "wipe"
          ? `inset(0% ${(1 - mix) * 100}% 0% 0%)`
          : "inset(0% 0% 0% 0%)";
    gsap.set(layers[1], {
      opacity: variant === "zoom" ? mix : mix > 0 ? 1 : 0,
      clipPath: mask,
      scale: 1,
    });
    gsap.set(layers[0].querySelector("img"), {
      scale: 1.04,
      xPercent: 0,
      yPercent: 0,
    });
    gsap.set(layers[1].querySelector("img"), {
      scale: variant === "zoom" ? 1.22 - mix * 0.22 : 1.04,
      xPercent: 0,
      yPercent: 0,
    });
    updateLabel(mix >= 0.5 ? to : from);
    element.dataset.phase = "scroll";
  }
  function scrub(from, to, mix, variant) {
    const id = ++scrubId;
    if (loaded.has(source(from)) && loaded.has(source(to))) {
      applyScrub(from, to, mix, variant);
      return;
    }
    Promise.all([load(from), load(to)]).then((ready) => {
      if (id === scrubId && ready.every(Boolean) && locks.has("story"))
        applyScrub(from, to, mix, variant);
    });
  }
  async function start() {
    const key = single || reduced ? active : nextKey();
    if (await load(key)) {
      assign(layers[0], key);
      updateLabel(key);
    }
    pan(0);
    pan(1);
    sync();
    // The other three photos are decoded ahead of the pinned story.
    if (!reduced) keys.filter((k) => k !== key).forEach(load);
    element.dataset.ready = "true";
  }
  button.addEventListener("click", () => {
    paused = !paused;
    try {
      sessionStorage.setItem("kashtan-photo-paused", String(paused));
    } catch {}
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  const modalObserver = new MutationObserver(() => {
    if (document.querySelector("dialog[open]")) lock("modal");
    else unlock("modal");
  });
  document.querySelectorAll("dialog").forEach((dialog) =>
    modalObserver.observe(dialog, {
      attributes: true,
      attributeFilter: ["open"],
    }),
  );
  mediaQuery.addEventListener("change", async () => {
    ++requestId;
    stopTimer();
    if (await load(active)) {
      assign(layers[front], active);
      sync();
    }
  });
  start();
  return {
    element,
    load,
    lock,
    unlock,
    scrub,
    active: () => active,
    setReduced(value) {
      reduced = value;
      ++requestId;
      if (fade) {
        fade.progress(1);
        fade = null;
      }
      if (reduced) {
        locks.delete("hero");
        locks.delete("story");
        normalize();
      }
      sync();
    },
  };
}
