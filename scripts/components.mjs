import { stores } from "../src/data.js";

export const icon = (name, extra = "") =>
  `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}" /></svg>`;
export const image = (
  name,
  alt = "",
  extra = "",
  width = 1500,
  height = 1000,
) => {
  const responsive = ["ofiyat", "shashlik", "hardware", "market"].includes(
    name,
  );
  const sources = responsive
    ? `srcset="/assets/images/${name}-420.webp 420w, /assets/images/${name}-800.webp 800w, /assets/images/${name}.webp ${width}w"`
    : "";
  const sizes =
    responsive && !extra.includes("sizes=")
      ? 'sizes="(max-width:767px) 100vw, 50vw"'
      : "";
  return `<img src="/assets/images/${name}.webp" ${sources} ${sizes} alt="${alt}" width="${width}" height="${height}" ${extra} />`;
};
export const brand = () =>
  `<a class="brand" href="/" aria-label="Kashtan Market — bosh sahifa"><span class="brand-mark">k<span>+</span></span><span>KASHTAN<span class="brand-sub">MARKET</span></span></a>`;
export const ambient = () =>
  `<div class="ambient" aria-hidden="true"><span class="ambient-orb orb-one"></span><span class="ambient-orb orb-two"></span><span class="ambient-ring"></span><span class="ambient-grid"></span></div>`;
export const eyebrow = (text) =>
  `<p class="eyebrow"><span class="tiny-cross">+</span>${text}</p>`;
export const link = (href, text, cls = "text-link") =>
  `<a class="${cls}" href="${href}">${text}${icon("arrow-up-right")}</a>`;
export function sprite() {
  return `<svg class="svg-library" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 5l7 7-7 7"/></symbol><symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M5 19 19 5M5 5h14v14"/></symbol><symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></symbol><symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 7h14l1 14H4L5 7ZM8 7V5a4 4 0 0 1 8 0v2"/></symbol><symbol id="i-play" viewBox="0 0 24 24"><path d="m9 5 11 7-11 7V5Z"/></symbol><symbol id="i-message" viewBox="0 0 24 24"><path d="M20 15a3 3 0 0 1-3 3H9l-6 4V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v9ZM7 8h9M7 12h6"/></symbol><symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol><symbol id="i-home" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10H3V10ZM9 20v-7h6v7"/></symbol><symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></symbol><symbol id="i-image" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-7 5 7"/></symbol><symbol id="i-phone" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4M10 19h4"/></symbol><symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></symbol><symbol id="i-close" viewBox="0 0 24 24"><path d="m5 5 14 14M19 5 5 19"/></symbol><symbol id="i-chevron" viewBox="0 0 24 24"><path d="m8 4 8 8-8 8"/></symbol><symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19C-1 4 13 2 21 3c1 9-2 20-16 16ZM5 19 17 7"/></symbol><symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/></symbol><symbol id="i-apple" viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.2-.9-1.7 0-3.2 1-4.1 2.5-1.8 3-.5 7.5 1.2 10 .8 1.2 1.8 2.6 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.5.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-4ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4Z"/></symbol><symbol id="i-google-play" viewBox="0 0 24 24"><path d="M4 3v18l10-9L4 3ZM5 2l12 7-3 3M5 22l12-7-3-3m3-3 4 2.3a.8.8 0 0 1 0 1.4L17 15"/></symbol></defs></svg>`;
}
export function header(page) {
  const home = page.kind === "home";
  return `<div class="reading-progress" aria-hidden="true"></div><header class="header" id="header"><div class="container nav-row">${brand()}<nav class="desktop-nav" aria-label="Asosiy navigatsiya"><a href="${home ? "#dokonlar" : "/dokonlar/"}" data-nav="stores">Do‘konlar <sup>04</sup></a><a href="/galereya/" data-nav="gallery">Galereya</a><a href="/biz-haqimizda/" data-nav="about">Biz haqimizda</a><a href="${home ? "#ilova" : "/ilova/"}" data-nav="app">Ilova haqida</a></nav><a class="header-cta" href="${home ? "#tez-kunda" : "/ilova/#tez-kunda"}"><span class="status-dot"></span>Ilova tez kunda${icon("arrow-up-right")}</a><button class="menu-toggle" aria-label="Menyuni ochish" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button></div></header><dialog class="mobile-menu" id="mobile-menu" aria-label="Mobil navigatsiya"><div class="mobile-menu-top">${brand()}<button class="icon-button menu-close" aria-label="Menyuni yopish">${icon("close")}</button></div><span class="menu-kicker">KASHF ETISHGA TAYYORMISIZ?</span><nav aria-label="Mobil navigatsiya">${[
    [home ? "#dokonlar" : "/dokonlar/", "Do‘konlar", "01"],
    ["/galereya/", "Galereya", "02"],
    ["/biz-haqimizda/", "Biz haqimizda", "03"],
    [home ? "#ilova" : "/ilova/", "Ilova haqida", "04"],
    ["/savollar/", "Savol-javob", "05"],
    [home ? "#tez-kunda" : "/ilova/#tez-kunda", "Tez kunda", "06"],
  ]
    .map(
      ([href, text, n]) =>
        `<a href="${href}"><small>${n}</small>${text}${icon("arrow-up-right")}</a>`,
    )
    .join(
      "",
    )}</nav><div class="menu-bottom"><span>TO‘RT DO‘KON.<br>BIR JOYDA.</span><span class="menu-spark" aria-hidden="true">✳</span></div></dialog>`;
}
export function footer(page) {
  let active =
    page.kind === "home"
      ? "home"
      : page.kind === "store" || page.kind === "directory"
        ? "stores"
        : page.kind;
  return `<footer class="footer"><div class="container"><div class="footer-top"><div>${brand()}<p>Dasturxon uchun. Xonadon uchun.<br>Hayotingizga yaqinroq.</p></div><nav aria-label="Do‘kon havolalari"><span class="footer-label">DO‘KONLAR</span>${stores.map((s) => `<a href="${s.href}">${s.name}</a>`).join("")}</nav><nav aria-label="Qo‘shimcha sahifalar"><span class="footer-label">KASHF ETING</span><a href="/biz-haqimizda/">Biz haqimizda</a><a href="/galereya/">Galereya</a><a href="/ilova/">Mobil ilova</a><a href="/savollar/">Savol-javob</a></nav><div id="contact-links" class="contact-links" hidden></div></div><div class="footer-wordmark" aria-hidden="true">KASHTAN<span>✳</span></div><div class="footer-bottom"><span>© <span id="copyright-year">2026</span> Kashtan Market</span><span>TO‘RT DO‘KON. BIR JOYDA.</span><a href="#top">Yuqoriga ↑</a></div></div></footer><nav class="bottom-nav" aria-label="Tezkor navigatsiya">${[
    ["/", "home", "Bosh sahifa", "home"],
    ["/dokonlar/", "grid", "Do‘konlar", "stores"],
    ["/galereya/", "image", "Galereya", "gallery"],
    ["/ilova/", "phone", "Ilova", "app"],
  ]
    .map(
      ([href, i, label, key]) =>
        `<a href="${href}" ${active === key ? 'aria-current="page"' : ""}>${icon(i)}<span>${label}</span>${active === key ? "<i></i>" : ""}</a>`,
    )
    .join(
      "",
    )}</nav><a class="back-top" href="#top" aria-label="Sahifa boshiga qaytish">↑</a>`;
}
export function card(store, cls = "store-card") {
  return `<a class="${cls} reveal" href="${store.href}" style="--accent:${store.color}" data-group="${store.group}" data-search="${store.name.toLocaleLowerCase("uz")} ${store.type.toLocaleLowerCase("uz")} ${store.categories
    .map((c) => `${c.title} ${c.items.join(" ")}`)
    .join(" ")
    .toLocaleLowerCase(
      "uz",
    )}"><div class="store-card-image">${image(store.image, store.name, 'loading="lazy" sizes="(min-width:1080px) 24vw, 48vw"', store.width, store.height)}<span class="card-number">${store.number} /</span><span class="card-arrow">${icon("arrow-up-right")}</span><span class="store-image-tag">${store.type}</span></div><div class="store-card-copy"><p class="eyebrow">${store.type}</p><h3>${store.name}</h3><p>${store.tagline}</p><span class="card-link">Yaqindan tanishing${icon("arrow")}</span></div></a>`;
}
export function breadcrumbs(items = []) {
  return `<nav class="breadcrumbs" aria-label="Sahifa yo‘li"><a href="/">Bosh sahifa</a>${items.map(([text, href]) => `${icon("chevron")}${href ? `<a href="${href}">${text}</a>` : `<span aria-current="page">${text}</span>`}`).join("")}</nav>`;
}
export function pageHero(label, title, description, crumbs, extra = "") {
  return `<section class="page-hero dark-section scroll-scene" id="top" data-scene="#00b894">${ambient()}<div class="container">${breadcrumbs(crumbs)}<div class="page-hero-copy reveal">${eyebrow(label)}<h1>${title}</h1><p>${description}</p>${extra}</div><span class="page-hero-spark" aria-hidden="true">✳</span></div></section>`;
}
export function categoryBrowser(store, rich = false) {
  return `<div class="category-browser ${rich ? "rich-categories" : ""}" data-categories="${store.key}" ${rich ? "data-catalog" : ""}><div class="category-tabs" role="tablist" aria-label="${store.short} mahsulot yo‘nalishlari"></div><div class="category-panel"><span class="panel-label">${store.categories[0].title.toLocaleUpperCase("uz")}</span><p>${store.categories[0].items.join(" · ")}</p></div></div>`;
}
export function appDemo() {
  return `<div class="app-layout"><div class="feature-list reveal" role="tablist" aria-label="Ilova imkoniyatlari" aria-orientation="vertical">${[
    [
      "bag",
      "To‘rt do‘kon, bir ilova",
      "Taom, marinad, uy-ro‘zg‘or va oziq-ovqat — kerakli yo‘nalishni bir joydan toping.",
    ],
    [
      "play",
      "Ko‘ring. Ilhomlaning.",
      "Do‘kon va mahsulotlarni qisqa videolar orqali yaqindan kashf eting.",
    ],
    [
      "message",
      "Qidirganingiz topilmasa…",
      "Mahsulotni matn, rasm yoki ovoz orqali so‘rash imkoniyati rejalashtirilgan.",
    ],
  ]
    .map(
      ([i, title, desc], n) =>
        `<button class="feature-tab" id="feature-${n}" role="tab" aria-selected="${n === 0}" aria-controls="app-preview" ${n ? 'tabindex="-1"' : ""} data-feature="${n}"><span class="feature-icon">${icon(i)}</span><span><span class="feature-title">${title}</span><span class="feature-description">${desc}</span></span><span class="feature-number">0${n + 1}</span></button>`,
    )
    .join(
      "",
    )}</div><div class="phone-scene reveal"><span class="phone-orbit" aria-hidden="true"></span><span class="phone-note note-top">${icon("check")}4 do‘kon. 1 ilova.</span><div class="phone" id="app-preview" role="tabpanel" aria-labelledby="feature-0" tabindex="0"><div class="phone-camera" aria-hidden="true"></div><div class="phone-screen" id="phone-screen">${image("app-original", "Mobil ilova ko‘rinishi", 'loading="lazy"', 361, 1156)}</div><div class="phone-home" aria-hidden="true"></div></div><span class="phone-note note-bottom">ILOVA KO‘RINISHIDAN NAMUNA ↗</span></div></div>`;
}
export function coming() {
  return `<section class="coming-soon dark-section section-pad scroll-scene" id="tez-kunda" data-nav-group="app" data-scene="#26d9d9">${ambient()}<div class="container coming-layout"><div class="reveal">${eyebrow("YANGI QULAYLIKLAR YO‘LDA")}<span class="coming-pill"><span class="status-dot"></span>TEZ KUNDA</span><h2>TO‘RT DO‘KON.<br><span class="outline-text">CHO‘NTAGINGIZDA.</span></h2><p>Kashtan Market ilovasi tayyorlanmoqda.<br>Yangi xarid tajribasi — tez kunda.</p><div class="store-badges" id="store-badges">${[
    ["googlePlay", "google-play", "Google Play"],
    ["appStore", "apple", "App Store"],
  ]
    .map(
      ([key, i, name]) =>
        `<span class="store-badge" data-platform="${key}">${icon(i)}<span><small>TEZ KUNDA</small><strong>${name}</strong></span></span>`,
    )
    .join(
      "",
    )}</div></div><div class="coming-symbol reveal" aria-hidden="true">k<span>+</span><i>YAXSHI TANLOV.<br>HAR KUNI.</i></div></div></section>`;
}
export function faqItems(items) {
  return items
    .map(
      (item, index) =>
        `<details class="faq-item reveal" data-faq-search="${(item.q + " " + item.a).toLocaleLowerCase("uz")}"><summary><span class="faq-index">${String(index + 1).padStart(2, "0")}</span><span>${item.q}</span>${icon("plus")}</summary><div class="faq-answer"><p>${item.a}</p></div></details>`,
    )
    .join("");
}
export function sectionHeading(
  label,
  title,
  description = "",
  href = "",
  text = "Barchasini ko‘rish",
) {
  return `<div class="section-heading reveal"><div>${eyebrow(label)}<h2>${title}</h2></div><div class="heading-aside">${description ? `<p>${description}</p>` : ""}${href ? link(href, text) : ""}</div></div>`;
}
