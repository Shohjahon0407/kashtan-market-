import { stores, sceneMedia } from "../src/data.js";
import { icon, image, link, eyebrow } from "./components.mjs";

export function photoBackdrop(page) {
  const key = page.store?.key || "ofiyat",
    store = stores.find((s) => s.key === key),
    media = sceneMedia[key];
  return `<div class="photo-backdrop" id="photo-backdrop" aria-hidden="true" data-active="${key}" data-phase="idle" data-single="${page.kind === "store"}"><div class="photo-layer" data-key="${key}"><picture><source media="(max-width:767px)" srcset="${media.mobile}"/><img src="${media.desktop}" alt="" fetchpriority="high" style="--focus-mobile:${media.focusMobile};--focus-desktop:${media.focusDesktop}"/></picture></div><div class="photo-layer photo-layer-next" data-key="${key}"><img src="${media.mobile}" alt="" style="--focus-mobile:${media.focusMobile};--focus-desktop:${media.focusDesktop}"/></div><div class="photo-shade"></div><div class="photo-grain"></div></div><div class="photo-controls"><button type="button" class="photo-pause" data-photo-pause aria-label="Fon almashishini pauza qilish" aria-pressed="false"><span class="pause-symbol" aria-hidden="true"><i></i><i></i></span></button><span class="photo-now" aria-hidden="true"><small>HOZIR FONDA</small><span data-photo-name>${store.number} / ${store.short}</span></span><span class="photo-pips" aria-hidden="true">${stores.map((s) => `<i data-photo-pip="${s.key}" ${s.key === key ? 'class="is-current"' : ""}></i>`).join("")}</span></div>`;
}

export function cinemaHero() {
  return `<section class="hero hero-cinema" id="top" aria-labelledby="hero-title"><div class="hero-cinema-stage"><div class="cinema-vignette" aria-hidden="true"></div><div class="container hero-intro"><p class="cinema-kicker"><span class="status-dot"></span>TO‘RTTA DUNYO. BITTA MANZIL.</p><h1 id="hero-title"><span class="title-mask"><span>TO‘RT DO‘KON.</span></span><span class="title-mask"><span class="cinema-outline">BIR JOYDA.</span></span></h1><p class="cinema-description">Dasturxon uchun. Xonadon uchun. Siz uchun.<br>Har bir ehtiyojga — o‘z do‘koni.</p><div class="cinema-actions">${link("#dokonlar", "Do‘konlarni kashf eting", "button button-mint")}<a href="/biz-haqimizda/" class="cinema-about">Biz haqimizda ${icon("arrow")}</a></div><span class="hero-scroll-cue"><span class="scroll-cue-line"></span>SCROLL QILING. DUNYOLAR ALMASHADI.</span></div><div class="hero-collage" aria-label="To‘rtta do‘kon bilan tanishing"><div class="collage-heading"><span>HAR BIRINING O‘Z DUNYOSI</span><h2>HAMMASI <em>bir joyda.</em></h2></div>${stores.map((s, index) => `<a href="${s.href}" class="cinema-tile cinema-tile-${index}" data-cinema-key="${s.key}" style="--accent:${s.color}"><div class="cinema-tile-image">${image(s.image, s.type, 'loading="lazy" sizes="50vw"', s.width, s.height)}</div><span class="cinema-tile-label"><small>${s.number}</small><strong>${s.short}</strong>${icon("arrow-up-right")}</span></a>`).join("")}<span class="collage-note">YAXSHI TANLOVLAR SHU YERDAN BOSHLANADI ↓</span></div><span class="cinema-edition" aria-hidden="true">KASHTAN MARKET / 01—04</span></div></section>`;
}

export function storeStory() {
  return `<section class="store-story" id="dokonlar-hikoyasi" aria-label="To‘rtta do‘kon hikoyasi" data-nav-group="stores"><div class="story-stage"><div class="story-topline"><span>DO‘KONLARIMIZ BILAN TANISHING</span><span class="story-counter"><b data-story-count>01</b> / 04</span></div><div class="story-panels">${stores
    .map(
      (s, index) =>
        `<article class="story-panel" data-story-key="${s.key}" style="--accent:${s.color};--story-image-mobile:url('${sceneMedia[s.key].mobile}');--story-image-desktop:url('${sceneMedia[s.key].desktop}')"><div class="story-number" aria-hidden="true">${s.number}</div><div class="story-copy">${eyebrow(s.type)}<h2>${s.headline
          .split("<br>")
          .map((line) => `<span class="story-line"><span>${line}</span></span>`)
          .join(
            "",
          )}</h2><p>${s.description}</p>${link(s.href, "Do‘kon bilan tanishing", "button button-story")}</div><span class="story-side-label" aria-hidden="true">${s.name}</span></article>`,
    )
    .join(
      "",
    )}</div><div class="story-progress" aria-hidden="true">${stores.map((s) => `<span data-story-step="${s.key}"><i></i><b>${s.number}</b><small>${s.short}</small></span>`).join("")}</div></div></section>`;
}
