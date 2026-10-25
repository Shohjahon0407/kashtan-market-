import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPhotoBackdrop } from "./photo-backdrop.js";
import { stores, motionSettings } from "./data.js";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const phase = (p, start, end) => clamp((p - start) / (end - start));
const ease = gsap.parseEase("power2.inOut");

export async function initMotion() {
  const background = createPhotoBackdrop();
  const header = document.querySelector("#header"),
    backTop = document.querySelector(".back-top");
  const links = [...document.querySelectorAll("[data-nav]")],
    sections = [...document.querySelectorAll("[data-nav-group]")];
  const page = document.body.dataset.page;
  let navFrame = false;
  function navigation() {
    navFrame = false;
    const y = scrollY,
      total = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty(
      "--read-progress",
      String(total > 0 ? clamp(y / total) : 0),
    );
    header.classList.toggle("is-scrolled", y > 40);
    backTop.classList.toggle("is-visible", y > 650);
    let active =
      page === "home"
        ? ""
        : page === "directory" || page === "store"
          ? "stores"
          : page;
    if (page === "home")
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < innerHeight * 0.42)
          active = section.dataset.navGroup;
      });
    links.forEach((link) => {
      if (link.dataset.nav === active)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function scheduleNav() {
    if (!navFrame) {
      navFrame = true;
      requestAnimationFrame(navigation);
    }
  }
  window.addEventListener("scroll", scheduleNav, { passive: true });
  window.addEventListener("resize", scheduleNav, { passive: true });
  navigation();
  await document.fonts.ready;
  // Filtering, accordions and category changes move later reveal triggers.
  // Refresh after layout settles; transforms on the photo layers do not affect these boxes.
  let layoutTimer;
  const refreshLayout = () => {
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(() => ScrollTrigger.refresh(), 80);
  };
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(refreshLayout);
    document
      .querySelectorAll(
        ".store-grid,.gallery-grid,.faq-group,.category-panel,.feature-list",
      )
      .forEach((element) => observer.observe(element));
  }
  document.addEventListener(
    "toggle",
    (event) => {
      if (event.target.matches?.(".faq-item")) refreshLayout();
    },
    true,
  );
  const media = gsap.matchMedia();
  media.add(
    {
      always: "(min-width:0px)",
      normal: "(prefers-reduced-motion:no-preference)",
      tall: "(min-height:560px)",
      desktop: "(min-width:768px)",
    },
    (context) => {
      const { normal, tall, desktop } = context.conditions;
      background.setReduced(!normal);
      const cleanup = [];
      if (normal) {
        document.querySelectorAll(".reveal").forEach((element) => {
          gsap.from(element, {
            y: desktop ? 42 : 26,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 97%", once: true },
          });
        });
        document.querySelectorAll("[data-parallax]").forEach((image) => {
          gsap.fromTo(
            image,
            { y: desktop ? -22 : -10 },
            {
              y: desktop ? 22 : 10,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        });
        document
          .querySelectorAll(".page-hero h1,.store-hero h1")
          .forEach((heading) => {
            const original = heading.innerHTML;
            heading.innerHTML = original
              .split(/<br\s*\/?>/i)
              .map(
                (line) =>
                  `<span class="route-line"><span>${line}</span></span>`,
              )
              .join("");
            const scene = heading.closest(".page-hero,.store-hero");
            gsap.to(heading.querySelectorAll(".route-line>span"), {
              yPercent: -112,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top top",
                end: "bottom 25%",
                scrub: 0.6,
              },
            });
            cleanup.push(() => {
              heading.innerHTML = original;
            });
          });
        if (tall && document.querySelector(".hero-cinema")) {
          document.body.classList.add("is-motion-ready");
          cleanup.push(setupHero(background), setupStory(background));
        }
      }
      document.body.dataset.motionReady = "true";
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cleanup.forEach((fn) => fn?.());
        document.body.classList.remove("is-motion-ready");
        background.unlock("hero");
        background.unlock("story");
        gsap.set(background.element, {
          clearProps: "width,height,transform,borderRadius",
        });
        document
          .querySelectorAll(".story-panel,.hero-intro,.hero-collage")
          .forEach((element) => {
            element.inert = false;
            element.removeAttribute("aria-hidden");
          });
      };
    },
  );
}

function setupHero(background) {
  const hero = document.querySelector(".hero-cinema"),
    stage = hero.querySelector(".hero-cinema-stage");
  const intro = hero.querySelector(".hero-intro"),
    collage = hero.querySelector(".hero-collage");
  const tiles = [...hero.querySelectorAll(".cinema-tile")];
  const lines = [...hero.querySelectorAll(".title-mask>span")];
  const kicker = hero.querySelector(".cinema-kicker"),
    description = hero.querySelector(".cinema-description"),
    actions = hero.querySelector(".cinema-actions"),
    cue = hero.querySelector(".hero-scroll-cue");
  const heading = hero.querySelector(".collage-heading"),
    note = hero.querySelector(".collage-note");
  const state = { progress: 0 };
  let locked = false,
    metrics,
    timeline;
  const primary = () =>
    tiles.find((tile) => tile.dataset.cinemaKey === background.active()) ||
    tiles[0];
  function measure() {
    metrics = {
      width: document.documentElement.clientWidth,
      height: innerHeight,
      tiles: new Map(
        tiles.map((tile) => [
          tile,
          {
            left: tile.offsetLeft,
            top: tile.offsetTop,
            width: tile.offsetWidth,
            height: tile.offsetHeight,
          },
        ]),
      ),
    };
  }
  function render() {
    const p = state.progress;
    if (p > 0.005 && p < 0.998 && !locked) {
      locked = true;
      background.lock("hero");
    }
    if ((p <= 0.005 || p >= 0.998) && locked) {
      locked = false;
      background.unlock("hero");
    }
    const main = primary(),
      rect = metrics.tiles.get(main);
    const fold = ease(phase(p, 0.12, 0.52)) * (1 - ease(phase(p, 0.78, 1)));
    gsap.set(background.element, {
      x: rect.left * fold,
      y: rect.top * fold,
      width: metrics.width + (rect.width - metrics.width) * fold,
      height: metrics.height + (rect.height - metrics.height) * fold,
      borderRadius: 6 * fold,
    });
    gsap.set(background.element.querySelector(".photo-shade"), {
      opacity: 1 - fold,
    });
    gsap.set(background.element.querySelector(".photo-grain"), {
      opacity: 0.025 * (1 - fold),
    });
    gsap.set(hero.querySelector(".cinema-vignette"), { opacity: 1 - fold });
    const exit = phase(p, 0.02, 0.31);
    gsap.set(lines[0], { yPercent: -115 * ease(exit) });
    gsap.set(lines[1], { yPercent: -115 * ease(phase(p, 0.07, 0.36)) });
    gsap.set(kicker, { opacity: 1 - phase(p, 0, 0.17), y: -25 * exit });
    gsap.set(description, { opacity: 1 - phase(p, 0.01, 0.19), y: -25 * exit });
    gsap.set(actions, { opacity: 1 - phase(p, 0.015, 0.2), y: -20 * exit });
    gsap.set(cue, { opacity: 1 - phase(p, 0, 0.13) });
    const tileIn = ease(phase(p, 0.2, 0.55)),
      tileOut = ease(phase(p, 0.78, 0.99));
    tiles.forEach((tile, index) => {
      const isPrimary = tile === main;
      tile.classList.toggle("is-primary", isPrimary);
      const x = [-1, 1, -1, 1][index] * metrics.width * 0.7 * (1 - tileIn);
      const y = [-1, -1, 1, 1][index] * metrics.height * 0.22 * (1 - tileIn);
      gsap.set(tile, {
        x: isPrimary ? 0 : x,
        y: isPrimary ? 0 : y,
        rotation: isPrimary ? 0 : [-6, 7, -5, 5][index] * tileIn,
        opacity: (isPrimary ? phase(p, 0.32, 0.5) : tileIn) * (1 - tileOut),
        scale: isPrimary ? 1 : 0.65 + 0.35 * tileIn,
      });
    });
    gsap.set(heading, {
      opacity: phase(p, 0.28, 0.48) * (1 - tileOut),
      y: 18 * (1 - tileIn),
    });
    gsap.set(note, { opacity: phase(p, 0.42, 0.58) * (1 - tileOut) });
    const introActive = p < 0.18,
      collageActive = p > 0.48 && p < 0.82;
    intro.inert = !introActive;
    intro.setAttribute("aria-hidden", String(!introActive));
    intro.classList.toggle("is-inactive", !introActive);
    collage.inert = !collageActive;
    collage.setAttribute("aria-hidden", String(!collageActive));
    collage.classList.toggle("is-interactive", collageActive);
    hero.dataset.cinemaProgress = p.toFixed(3);
  }
  measure();
  timeline = gsap.to(state, {
    progress: 1,
    ease: "none",
    scrollTrigger: {
      id: "photo-hero",
      trigger: hero,
      start: "top top",
      end: () => `+=${stage.clientHeight * motionSettings.heroScrollScreens}`,
      pin: stage,
      scrub: 0.65,
      invalidateOnRefresh: true,
      onRefresh: () => {
        measure();
        render();
      },
    },
    onUpdate: render,
  });
  function onPhotoChange() {
    tiles.forEach((tile) =>
      tile.classList.toggle("is-primary", tile === primary()),
    );
    if (state.progress < 0.01) render();
  }
  document.addEventListener("photochange", onPhotoChange);
  render();
  return () => {
    document.removeEventListener("photochange", onPhotoChange);
    background.unlock("hero");
    intro.inert = false;
    collage.inert = false;
    gsap.set(
      [kicker, description, actions, cue, heading, note, ...lines, ...tiles],
      { clearProps: "transform,opacity,visibility" },
    );
    gsap.set(hero.querySelector(".cinema-vignette"), { clearProps: "opacity" });
    gsap.set(background.element.querySelector(".photo-shade"), { opacity: 1 });
    gsap.set(background.element.querySelector(".photo-grain"), {
      opacity: 0.025,
    });
    tiles.forEach((tile) => tile.classList.remove("is-primary"));
  };
}

function setupStory(background) {
  const section = document.querySelector(".store-story"),
    stage = section.querySelector(".story-stage");
  const panels = [...section.querySelectorAll(".story-panel")];
  const steps = [...section.querySelectorAll("[data-story-step]")];
  const state = { cursor: 0 };
  let engaged = false,
    selected = -1;
  function activePanel(index) {
    if (index === selected) return;
    const previous = panels[selected];
    selected = index;
    panels.forEach((panel, i) => {
      panel.inert = i !== index;
      panel.setAttribute("aria-hidden", String(i !== index));
      panel.classList.toggle("is-active", i === index);
    });
    if (previous?.contains(document.activeElement))
      panels[index].querySelector("a").focus({ preventScroll: true });
    section.dataset.activeStore = stores[index].key;
    section.querySelector("[data-story-count]").textContent =
      stores[index].number;
  }
  function render() {
    if (!engaged) return;
    const position = clamp(state.cursor, 0, 3.99999),
      index = Math.floor(position),
      fraction = position - index;
    const next = Math.min(index + 1, 3),
      transition = index === 3 ? 0 : ease(phase(fraction, 0.61, 0.98));
    const variant = ["wipe", "circle", "zoom"][index] || "zoom";
    background.scrub(stores[index].key, stores[next].key, transition, variant);
    panels.forEach((panel, i) => {
      const outgoing = i === index,
        incoming = i === next && next !== index;
      const opacity = outgoing ? 1 - transition : incoming ? transition : 0;
      gsap.set(panel, { autoAlpha: opacity });
      gsap.set(panel.querySelector(".story-copy"), {
        y: outgoing ? -42 * transition : incoming ? 55 * (1 - transition) : 0,
      });
      const lineSpans = panel.querySelectorAll(".story-line>span");
      gsap.set(lineSpans, {
        yPercent: outgoing
          ? -15 * transition
          : incoming
            ? 35 * (1 - transition)
            : 0,
      });
    });
    activePanel(transition >= 0.5 ? next : index);
    steps.forEach((step, i) =>
      step.style.setProperty("--step-progress", String(clamp(position - i))),
    );
  }
  function enter() {
    engaged = true;
    background.lock("story");
    gsap.set(background.element, {
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: innerHeight,
      borderRadius: 0,
    });
    render();
  }
  function leave() {
    engaged = false;
    background.unlock("story");
  }
  panels.forEach((panel) => {
    panel.inert = true;
    panel.setAttribute("aria-hidden", "true");
  });
  gsap.set(panels, { autoAlpha: 0 });
  gsap.to(state, {
    cursor: 4,
    ease: "none",
    scrollTrigger: {
      id: "store-story",
      trigger: section,
      start: "top top",
      end: () => `+=${stage.clientHeight * motionSettings.storyScrollScreens}`,
      pin: stage,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onEnter: enter,
      onEnterBack: enter,
      onLeave: () => {
        state.cursor = 4;
        render();
        leave();
      },
      onLeaveBack: () => {
        state.cursor = 0;
        render();
        leave();
      },
      onRefresh: (self) => {
        if (self.isActive) enter();
      },
    },
    onUpdate: render,
  });
  return () => {
    engaged = false;
    background.unlock("story");
    panels.forEach((panel) => {
      panel.inert = false;
      panel.removeAttribute("aria-hidden");
      panel.classList.remove("is-active");
    });
    gsap.set(
      [...panels, ...section.querySelectorAll(".story-copy,.story-line>span")],
      { clearProps: "transform,opacity,visibility" },
    );
    delete section.dataset.activeStore;
  };
}
