import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  photoBackdrop,
  cinemaHero,
  storeStory,
} from "./cinematic-components.mjs";
import { stores, pages, faqs, gallery } from "../src/data.js";
import {
  icon,
  image,
  ambient,
  eyebrow,
  link,
  sprite,
  header,
  footer,
  card,
  breadcrumbs,
  pageHero,
  categoryBrowser,
  appDemo,
  coming,
  faqItems,
  sectionHeading,
} from "./components.mjs";

function home() {
  return `${cinemaHero()}
<div class="brand-ribbon" aria-label="Do‘konlar">${stores.map((s) => `<a href="${s.href}"><span style="color:${s.color}">✳</span>${s.name}</a>`).join("")}</div>
${storeStory()}
<section class="stores section-pad" id="dokonlar" data-nav-group="stores" data-scene="#00b894"><div class="container">${sectionHeading("BIZNING DO‘KONLAR", "HAR BIRINING<br>O‘Z <em>dunyosi.</em>", "Bir-biridan farqli. Sizga birdek yaqin.", "/dokonlar/", "Barcha do‘konlar")}<div class="store-grid">${stores.map((s) => card(s)).join("")}</div><p class="image-disclaimer">Rasmlar do‘kon yo‘nalishlarini ifodalaydi.</p></div></section>
<section class="discovery-section section-pad dark-section scroll-scene" data-scene="#26d9d9">${ambient()}<div class="container">${sectionHeading("BIR JOYDA — TURLI DUNYOLAR", "BUGUN SIZGA<br>NIMA <em>kerak?</em>", "Biror mazali taommi, uyga kerakli jihozmi? Yo‘nalishni tanlashdan boshlang.")}<div class="discovery-grid">${stores.map((s) => `<a href="${s.href}" class="discovery-card reveal" style="--accent:${s.color}"><span>${s.number} /</span>${icon(s.key === "hardware" ? "grid" : s.key === "market" ? "leaf" : "bag")}<h3>${s.type}</h3><p>${s.tagline}</p>${icon("arrow-up-right", "discovery-arrow")}</a>`).join("")}</div></div></section>
${stores.map((s, index) => `<section class="showcase ${s.key} section-pad scroll-scene" id="${s.id}" style="--accent:${s.color}" data-nav-group="stores" data-scene="${s.color}"><div class="container showcase-layout ${index % 2 ? "showcase-reverse" : ""}"><div class="showcase-visual reveal"><div class="showcase-photo">${image(s.image, s.name, 'loading="lazy" data-parallax', s.width, s.height)}</div><span class="visual-tag">${s.short}<i>${s.type}</i></span><div class="photo-caption"><span>${s.type}</span><span>${s.number} — KASHTAN</span></div></div><div class="showcase-copy reveal">${eyebrow(`${s.number} / ${s.type.toLocaleUpperCase("uz")}`)}<h2>${s.headline}</h2><p>${s.description}</p>${categoryBrowser(s)}${link(s.href, "Do‘konni yaqindan o‘rganing", "button button-outline")}<div class="store-signature"><span>${s.name}</span>${icon("plus")}</div></div></div></section>`).join("")}
<section class="gallery-preview section-pad" data-scene="#ff8454"><div class="container">${sectionHeading("KO‘RING. HIS QILING.", "DASTURXONDAN<br><em>ustaxonagacha.</em>", "Har bir yo‘nalishning o‘z rangi va kayfiyati bor.", "/galereya/", "Galereyaga o‘tish")}</div><div class="gallery-rail">${gallery
    .slice(0, 4)
    .map(
      (g, i) =>
        `<a href="/galereya/#${g.id}" class="gallery-rail-card reveal">${image(g.image, g.alt, 'loading="lazy"', g.width, g.height)}<span><small>0${i + 1} / ${g.label}</small><strong>${g.title}</strong>${icon("arrow-up-right")}</span></a>`,
    )
    .join("")}</div></section>
<section class="app-section section-pad" id="ilova" data-nav-group="app" data-scene="#00b894"><div class="container">${sectionHeading("KEYINGI QADAM — ILOVADA", "DO‘KONLARINGIZ.<br>ENDI <em>yaqinroq.</em>", "Ilova ustida ishlayapmiz. Rejalashtirilgan qulayliklar bilan tanishing.", "/ilova/", "Ilova haqida batafsil")}${appDemo()}</div></section>
<section class="faq-section section-pad"><div class="container faq-layout"><div>${sectionHeading("BILISH FOYDALI", "SAVOL BORMI?<br><em>Javob shu yerda.</em>", "Loyiha va do‘konlar haqida qisqacha.", "/savollar/", "Barcha savol-javoblar")}</div><div>${faqItems(faqs.slice(0, 4))}</div></div></section>${coming()}`;
}

function directory() {
  return `${pageHero("SIZNING TANLOVINGIZ", "TO‘RT DO‘KON.<br>SIZGA MOS <em>tanlov.</em>", "Ta’m, ro‘zg‘or, uy va yangi g‘oyalar. Kerakli yo‘nalishni tanlang va o‘z do‘koningizni toping.", [["Do‘konlar"]])}<section class="directory-section section-pad" id="dokonlar"><div class="container"><div class="directory-tools"><label class="search-field">${icon("search")}<input id="store-search" type="search" placeholder="Do‘kon yoki mahsulot izlang…" aria-label="Do‘kon yoki mahsulot izlash" autocomplete="off" /></label><div class="filter-chips" aria-label="Do‘kon yo‘nalishlari">${[
    ["all", "Barchasi"],
    ["food", "Taom va shashlik"],
    ["home", "Uy va xo‘jalik"],
    ["groceries", "Oziq-ovqat"],
  ]
    .map(
      ([v, t], i) =>
        `<button type="button" data-store-filter="${v}" aria-pressed="${!i}">${t}${i ? "" : " <span>04</span>"}</button>`,
    )
    .join(
      "",
    )}</div></div><p class="results-count" id="store-results" aria-live="polite">4 ta do‘kon</p><div class="store-grid directory-grid" id="store-directory">${stores.map((s) => card(s)).join("")}</div><div class="empty-state" id="store-empty" hidden>${icon("search")}<h2>Hozircha topilmadi</h2><p>Boshqa so‘z bilan izlang yoki filtrni tozalang.</p><button class="button button-dark" id="clear-store-search">Qidiruvni tozalash${icon("arrow")}</button></div><p class="image-disclaimer">Mahsulot nomlari tanishtirish uchun berilgan. Amaldagi narx va mavjudlik ko‘rsatilmagan.</p></div></section><section class="section-pad soft-section"><div class="container">${sectionHeading("TANLOVNI SODDALASHTIRAMIZ", "QAYERDAN<br><em>boshlaymiz?</em>")}<div class="steps-grid">${[
    [
      "01",
      "Yo‘nalishni toping",
      "Taom, marinad, xo‘jalik yoki kundalik oziq-ovqatdan birini tanlang.",
    ],
    [
      "02",
      "Yaqindan tanishing",
      "Do‘kon sahifasida kategoriyalar, tavsiyalar va tanlovlar bilan tanishing.",
    ],
    [
      "03",
      "Ilovani kuzatib boring",
      "Yangi imkoniyatlarni ilova sahifasida ko‘rib chiqing.",
    ],
  ]
    .map(
      ([n, t, p]) =>
        `<article class="step-card reveal"><span>${n}</span><h3>${t}</h3><p>${p}</p></article>`,
    )
    .join("")}</div></div></section>${coming()}`;
}

function storePage(s) {
  return `<section class="store-hero dark-section scroll-scene" id="top" style="--accent:${s.color}" data-scene="${s.color}">${ambient()}<div class="container">${breadcrumbs([["Do‘konlar", "/dokonlar/"], [s.name]])}<div class="store-hero-layout"><div class="store-hero-copy reveal">${eyebrow(`${s.number} / ${s.type}`)}<h1>${s.headline}</h1><p>${s.description}</p>${link("#kategoriyalar", "Yo‘nalishlarni ko‘rish", "button button-accent")}<span class="store-hero-note">KASHTAN MARKET OILASIDA</span></div><div class="store-hero-image reveal">${image(s.image, s.name, 'fetchpriority="high" data-parallax', s.width, s.height)}<span class="store-hero-brand">${s.name}${icon("spark")}</span><span class="store-big-number" aria-hidden="true">${s.number}</span></div></div></div></section><nav class="chapter-nav" aria-label="Do‘kon bo‘limlari"><a href="#tanishing">Tanishing</a><a href="#kategoriyalar">Kategoriyalar</a><a href="#tavsiyalar">Tanlashga yordam</a><a href="#boshqa-dokonlar">Boshqa do‘konlar</a></nav><section class="section-pad" id="tanishing"><div class="container store-intro-layout">${eyebrow(s.name.toLocaleUpperCase("uz"))}<div><h2 class="reveal">${s.tagline}</h2><p class="lead-text reveal">${s.intro}</p><div class="store-meta-row"><span>${s.categories.length} ta yo‘nalish</span><span>${s.type}</span><span>Kashtan Market</span></div></div></div></section><section class="section-pad catalog-section" id="kategoriyalar" style="--accent:${s.color}"><div class="container">${sectionHeading("TANLOV SIZDAN", "SIZGA MOS<br><em>yo‘nalishlar.</em>", "Kategoriya ustiga bosing va uning ichidagi mahsulot turlari bilan tanishing.")}${categoryBrowser(s, true)}<p class="image-disclaimer">Bu — mahsulot yo‘nalishlari namoyishi. Narxlar va amaldagi mavjudlik ko‘rsatilmagan.</p></div></section><section class="section-pad" id="tavsiyalar"><div class="container">${sectionHeading("KUNDALIK HAYOTGA MOS", "HAR BIR VAZIYATGA<br>O‘Z <em>tanlovi.</em>")}<div class="occasion-grid">${s.occasions.map(([t, p], i) => `<article class="occasion-card reveal" style="--accent:${s.color}"><span class="occasion-number">0${i + 1}</span>${icon(["home", "spark", "bag"][i])}<h3>${t}</h3><p>${p}</p></article>`).join("")}</div><div class="tips-panel reveal"><div>${eyebrow("TANLASHGA YORDAM")}<h3>Kichik maslahatlar.<br>Qulayroq tanlov.</h3></div><ul>${s.tips.map((t) => `<li>${icon("check")}<span>${t}</span></li>`).join("")}</ul></div></div></section><section class="section-pad related-section" id="boshqa-dokonlar"><div class="container">${sectionHeading("KASHF ETISH DAVOM ETADI", "YANA NIMALAR<br><em>kerak bo‘lishi mumkin?</em>", "Boshqa yo‘nalishlar bilan ham tanishing.")}<div class="related-grid">${stores
    .filter((v) => v.key !== s.key)
    .map((v) => card(v, "related-card"))
    .join("")}</div></div></section>${coming()}`;
}

function app() {
  return `${pageHero("MOBIL ILOVA · TEZ KUNDA", "BIR ILOVA.<br>TO‘RTTA <em>do‘kon.</em>", "Sevimli do‘konlaringizni bir joyga jamlaydigan yangi tajriba tayyorlanmoqda. Rejalashtirilgan imkoniyatlar bilan tanishing.", [["Mobil ilova"]], '<span class="hero-status"><span class="status-dot"></span>TAYYORLANMOQDA</span>')}<section class="app-section section-pad" id="ilova"><div class="container">${sectionHeading("KO‘RINISHIGA BIR NAZAR", "KICHIK EKRANDA<br>KATTA <em>qulaylik.</em>", "Tugmalar orqali ilovaning turli ko‘rinishlarini ko‘rib chiqing.")}${appDemo()}</div></section><section class="section-pad soft-section"><div class="container">${sectionHeading("REJALASHTIRILGAN IMKONIYATLAR", "KUNDALIK XARIDGA<br>YANGICHA <em>yondashuv.</em>")}<div class="app-features-grid">${[
    [
      "grid",
      "To‘rt do‘kon bir joyda",
      "Yo‘nalishlar orasida oson almashish va har bir do‘kon bilan alohida tanishish.",
    ],
    [
      "bag",
      "Har do‘konga alohida savat",
      "Turli do‘konlar xaridlarini alohida ko‘rib chiqish va rasmiylashtirish g‘oyasi.",
    ],
    [
      "play",
      "Jonliroq video lenta",
      "Mahsulot va do‘konlar haqidagi qisqa videolar orqali tanlov qilish.",
    ],
    [
      "message",
      "Topilmagan mahsulot so‘rovi",
      "Kerakli narsani matn, rasm yoki ovoz orqali tasvirlab berish.",
    ],
    [
      "home",
      "Yetkazish imkoniyatlari",
      "Yetkazish tartibi, hududlar va shartlar ilova ishga tushganda e’lon qilinadi.",
    ],
    [
      "phone",
      "Telefonga mos tajriba",
      "Kategoriyalar va do‘konlar orasida sodda, tushunarli navigatsiya.",
    ],
  ]
    .map(
      ([i, t, p], n) =>
        `<article class="app-feature-card reveal"><span class="feature-card-icon">${icon(i)}</span><small>0${n + 1} /</small><h3>${t}</h3><p>${p}</p><span class="planned-label">REJALASHTIRILGAN</span></article>`,
    )
    .join(
      "",
    )}</div></div></section><section class="section-pad"><div class="container compact-container">${sectionHeading("ILOVA HAQIDA SAVOLLAR", "OLDINDAN<br><em>bilib oling.</em>")}${faqItems(faqs.filter((f) => f.group === "Ilova").slice(0, 3))}</div></section>${coming()}`;
}

function about() {
  return `${pageHero("BIZ HAQIMIZDA", "HAYOTGA YAQIN.<br>TANLOVGA <em>boy.</em>", "Bir dasturxon, bir xonadon, bir kun ichida turli ehtiyojlar bor. Kashtan Market shu kundalik tanlovlarni bir joyga jamlash g‘oyasidan boshlanadi.", [["Biz haqimizda"]])}<section class="section-pad"><div class="container about-statement"><span class="statement-spark reveal" aria-hidden="true">✳</span><div>${eyebrow("BIZNING G‘OYA")}<h2 class="reveal">HAR KUNI KERAK.<br>HAR BIRIDA <em>o‘zgacha.</em></h2><p class="lead-text reveal">Taom tanlash bilan uyga jihoz izlash bir-biridan farq qiladi. Shu sabab har bir yo‘nalishning o‘z dunyosi, o‘z kayfiyati va alohida sahifasi bor.</p><p class="reveal">Biz tanishtirishni sodda qilishni istaymiz: kerakli do‘konni toping, yo‘nalishlarini o‘rganing va sizga nima mosligini tushunib oling.</p></div></div></section><section class="section-pad dark-section scroll-scene" data-scene="#26d9d9">${ambient()}<div class="container">${sectionHeading("TO‘RTTA YO‘NALISH", "BITTA NOM OSTIDA.<br>TURLI <em>dunyolar.</em>")}<div class="about-stores">${stores.map((s) => `<a href="${s.href}" class="about-store-row reveal" style="--accent:${s.color}"><span>${s.number}</span><h3>${s.name}</h3><p>${s.type}</p>${icon("arrow-up-right")}</a>`).join("")}</div></div></section><section class="section-pad"><div class="container">${sectionHeading("BIZ UCHUN MUHIM", "SODDA. TUSHUNARLI.<br>SIZGA <em>mos.</em>")}<div class="steps-grid">${[
    [
      "01",
      "Aniq yo‘nalishlar",
      "Har bir do‘kon nimaga ixtisoslashganini tushunish oson bo‘lsin.",
    ],
    [
      "02",
      "Mazmunli tanishtiruv",
      "Chiroyli rasmlar bilan birga, kategoriyalar va foydali ma’lumotlar ham bo‘lsin.",
    ],
    [
      "03",
      "Telefonda ham qulay",
      "Ko‘pchilik kichik ekrandan kiradi. Tanlov ham, navigatsiya ham shunga mos bo‘lsin.",
    ],
  ]
    .map(
      ([n, t, p]) =>
        `<article class="step-card reveal"><span>${n}</span><h3>${t}</h3><p>${p}</p></article>`,
    )
    .join(
      "",
    )}</div></div></section><section class="section-pad soft-section"><div class="container next-chapter reveal"><div>${eyebrow("BU HALI BOSHLANISHI")}<h2>KEYINGI UCHRASHUV —<br><em>ilovada.</em></h2><p>Do‘konlarni birlashtiradigan mobil ilova tayyorlanmoqda. Undagi rejalashtirilgan qulayliklarni hozirdan ko‘rishingiz mumkin.</p></div>${link("/ilova/", "Ilova bilan tanishing", "button button-dark")}</div></section>`;
}

function galleryPage() {
  return `${pageHero("GALEREYA", "TANISH DUNYO.<br>YANGI <em>nigoh.</em>", "Dasturxondan ustaxonagacha. Do‘kon yo‘nalishlarining rangi va kayfiyatini rasmlar orqali kashf eting.", [["Galereya"]])}<section class="section-pad"><div class="container"><div class="filter-chips gallery-filters" aria-label="Galereya yo‘nalishlari"><button data-gallery-filter="all" aria-pressed="true">Barchasi <span>06</span></button>${stores.map((s) => `<button data-gallery-filter="${s.key}" aria-pressed="false">${s.short}</button>`).join("")}</div><p class="results-count" id="gallery-results" aria-live="polite">6 ta rasm</p><div class="gallery-grid">${gallery.map((g, i) => `<button class="gallery-item reveal" data-gallery="${g.id}" data-gallery-store="${g.store}" id="${g.id}" aria-label="${g.title} — rasmni kattalashtirish"><div>${image(g.image, g.alt, 'loading="lazy"', g.width, g.height)}<span class="gallery-zoom">${icon("plus")}</span><span class="gallery-item-number">0${i + 1} /</span></div><span class="gallery-caption"><small>${g.label}</small><strong>${g.title}</strong>${icon("arrow-up-right")}</span></button>`).join("")}</div><p class="image-disclaimer">Rasmlar yo‘nalishlarni ifodalaydi. Ular do‘konlardagi mahsulot mavjudligini tasdiqlamaydi.</p></div></section><dialog class="gallery-dialog" id="gallery-dialog" aria-label="Rasm ko‘rish"><button class="icon-button gallery-close" aria-label="Rasmni yopish">${icon("close")}</button><div class="lightbox-image"></div><div class="lightbox-bottom"><div><p id="lightbox-title"></p><span id="lightbox-position"></span></div><div><button class="icon-button" id="gallery-prev" aria-label="Oldingi rasm">${icon("arrow", "flip-icon")}</button><button class="icon-button" id="gallery-next" aria-label="Keyingi rasm">${icon("arrow")}</button></div></div><a id="lightbox-store" class="text-link" href="/dokonlar/">Do‘kon bilan tanishing${icon("arrow-up-right")}</a></dialog><section class="section-pad soft-section"><div class="container next-chapter reveal"><div>${eyebrow("RASMDAN HAM KO‘PROQ")}<h2>ENDI YAQINDAN<br><em>tanishamizmi?</em></h2></div>${link("/dokonlar/", "Do‘konlarga o‘tish", "button button-dark")}</div></section>`;
}

function faqPage() {
  return `${pageHero("SAVOL-JAVOB", "SAVOLLAR SIZDAN.<br>JAVOBLAR <em>bizdan.</em>", "Do‘konlar, sayt va kelajakdagi ilova haqida kerakli ma’lumotlarni bir joyga jamladik.", [["Savol-javob"]])}<section class="section-pad"><div class="container compact-container"><label class="search-field faq-search">${icon("search")}<input id="faq-search" type="search" placeholder="Masalan, ilova yoki buyurtma…" aria-label="Savollar orasidan izlash" autocomplete="off" /></label><p class="results-count" id="faq-results" aria-live="polite">${faqs.length} ta savol</p>${["Sayt haqida", "Do‘konlar", "Ilova"].map((group) => `<section class="faq-group" aria-labelledby="group-${group === "Ilova" ? "app" : group === "Do‘konlar" ? "stores" : "site"}"><h2 id="group-${group === "Ilova" ? "app" : group === "Do‘konlar" ? "stores" : "site"}">${group}</h2>${faqItems(faqs.filter((f) => f.group === group))}</section>`).join("")}<div id="faq-empty" class="empty-state" hidden>${icon("search")}<h2>Mos savol topilmadi</h2><p>Qisqaroq yoki boshqa so‘z bilan izlab ko‘ring.</p><button class="button button-dark" id="clear-faq-search">Qidiruvni tozalash${icon("arrow")}</button></div></div></section>${coming()}`;
}

const renderers = {
  home,
  directory,
  store: (p) => storePage(p.store),
  app,
  about,
  gallery: galleryPage,
  faq: faqPage,
};
for (const page of pages) {
  const html = `<!doctype html><html lang="uz"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/><meta name="theme-color" content="#092f26"/><meta name="description" content="${page.description}"/><meta property="og:title" content="${page.title}"/><meta property="og:description" content="${page.description}"/><meta property="og:type" content="website"/><title>${page.title}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"/><link rel="preload" href="/assets/fonts/barlow-condensed-600.woff2" as="font" type="font/woff2" crossorigin/><link rel="stylesheet" href="/src/style.css"/><link rel="stylesheet" href="/src/premium.css"/><link rel="stylesheet" href="/src/cinematic.css"/><script type="module" src="/src/main.js"></script></head><body class="photo-experience" data-page="${page.kind}"><a class="skip-link" href="#main">Asosiy mazmunga o‘tish</a>${sprite()}${photoBackdrop(page)}${header(page)}<main id="main">${renderers[page.kind](page)}</main>${footer(page)}</body></html>`;
  await mkdir(dirname(page.file), { recursive: true });
  await writeFile(page.file, html);
}
console.log(`${pages.length} ta sahifa tayyorlandi.`);
