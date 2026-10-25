import { categories } from "./config.js";
import { stores } from "./data.js";
import { icon, wireTabKeyboard } from "./ui.js";

const descriptions = {
  Osh: "Guruch, go‘sht va sabzidan tayyorlanadigan an’anaviy taom.",
  Norin: "Mayin to‘g‘ralgan xamir va go‘sht bilan tayyorlanadigan milliy taom.",
  Manti: "Bug‘da pishiriladigan, xamir ichiga masalliq solingan taom.",
  "Lag‘mon": "Xamir va sabzavotli qayla uyg‘unlashgan to‘yimli taom.",
  "Sho‘rva": "Go‘sht va sabzavotlardan tayyorlanadigan issiq taom yo‘nalishi.",
  Mastava: "Guruch va sabzavotli milliy suyuq taom.",
  "Moshxo‘rda": "Mosh asosidagi to‘yimli suyuq taom.",
  Chuchvara:
    "Xamirga tugilgan kichik masalliqli donachalardan tayyorlanadigan taom.",
  "Tandir somsa": "Tandirda pishiriladigan an’anaviy somsa yo‘nalishi.",
  Qatlama: "Qavatli xamirdan tayyorlanadigan taom.",
  Patir: "Milliy dasturxonga mos non yo‘nalishi.",
  Gumma: "Ichiga masalliq solib tayyorlanadigan xamirli tamaddi.",
  Drel: "Teshish va turli ta’mirlash ishlari uchun elektr asbob.",
  "Bolg‘a": "Mayda ta’mir va ustaxona ishlariga kerak bo‘ladigan qo‘l asbobi.",
  Kalitlar: "Bolt va gaykalarni bo‘shatish yoki mahkamlash uchun asboblar.",
  "O‘lchov lentasi":
    "Ta’mir va joylashtirish ishlarida uzunlikni o‘lchash uchun.",
  Sement: "Qurilish ishlarida qo‘llanadigan bog‘lovchi material.",
  Gips: "Ichki pardozlash va turli qurilish yumushlari uchun material.",
  "Bo‘yoq": "Yuzalarga rang berish va pardozlash uchun yo‘nalish.",
  Shpatlyovka: "Yuzalarni tekislash va pardozga tayyorlash uchun material.",
  Smesitel: "Oshxona yoki yuvinish xonasi uchun suv aralashtirgich.",
  Quvur: "Suv o‘tkazish va ulash ishlariga oid buyumlar.",
  Kran: "Suv oqimini boshqarish uchun santexnika buyumi.",
  Dush: "Yuvinish xonasi uchun dush jihozlari yo‘nalishi.",
  "Idish-tovoq":
    "Ovqat tayyorlash va dasturxon bezash uchun uy-ro‘zg‘or buyumlari.",
  "Saqlash idishlari": "Oshxona va uyda buyumlarni tartib bilan saqlash uchun.",
  "Tozalash vositalari": "Kundalik uy yumushlari va tozalashga oid yo‘nalish.",
  Olma: "Kundalik dasturxon, tamaddi va turli retseptlar uchun meva.",
  Anor: "Dasturxonga rang va o‘ziga xos ta’m qo‘shadigan meva.",
  Pomidor: "Salat, qayla va turli issiq taomlar uchun sabzavot.",
  "Ko‘katlar": "Salat va taomlarga ta’m qo‘shish uchun kundalik tanlov.",
  Sut: "Nonushta va taom tayyorlash uchun sut mahsulotlari yo‘nalishi.",
  Qatiq: "Dasturxonga yoki ayrim taomlar yoniga mos sut mahsuloti.",
  Suzma: "Nonushta va milliy dasturxon uchun sut mahsuloti.",
  Pishloq: "Nonushta, tamaddi va taom tayyorlash uchun turli tanlovlar.",
  Guruch: "Osh, suyuq taom va garnirlar uchun bakaleya mahsuloti.",
  Un: "Non va xamirli taomlar tayyorlash uchun asosiy mahsulot.",
  Makaron: "Kundalik tushlik va kechki ovqat uchun bakaleya yo‘nalishi.",
  "O‘simlik yog‘i":
    "Turli taomlar tayyorlashda ishlatiladigan kundalik mahsulot.",
};
export function initCategories() {
  document.querySelectorAll("[data-categories]").forEach((browser) => {
    const key = browser.dataset.categories,
      rich = browser.hasAttribute("data-catalog");
    const store = stores.find((s) => s.key === key),
      panel = browser.querySelector(".category-panel");
    panel.id = `${key}-panel`;
    panel.setAttribute("role", "tabpanel");
    panel.tabIndex = 0;
    const tabs = categories[key].map((category, index) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.id = `${key}-tab-${index}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      tab.textContent = category.title;
      tab.addEventListener("click", () => select(index, true));
      browser.querySelector(".category-tabs").append(tab);
      return tab;
    });
    function select(index, updateUrl = false) {
      tabs.forEach((tab, i) => {
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", tabs[index].id);
      const category = categories[key][index];
      if (rich) {
        panel.innerHTML = `<div class="catalog-panel-title"><h3>${category.title}</h3><span>${category.items.length} ta mahsulot turi</span></div><div class="product-grid">${category.items.map((item, i) => `<article class="product-card"><span>${String(i + 1).padStart(2, "0")} /</span>${icon(key === "hardware" ? "grid" : key === "market" ? "leaf" : "bag")}<h4>${item}</h4><p>${descriptions[item] || `${item} — ${category.title.toLocaleLowerCase("uz")} yo‘nalishidagi tanlov. ${store.tips[index]}`}</p></article>`).join("")}</div>`;
        if (updateUrl) {
          const url = new URL(location.href);
          url.searchParams.set("kategoriya", String(index));
          history.replaceState(null, "", url);
        }
      } else {
        const label = document.createElement("span");
        label.className = "panel-label";
        label.textContent = category.title.toLocaleUpperCase("uz");
        const items = document.createElement("p");
        items.textContent = category.items.join(" · ");
        panel.replaceChildren(label, items);
      }
    }
    const initial = Number(
      new URLSearchParams(location.search).get("kategoriya") || 0,
    );
    select(
      rich && Number.isInteger(initial) && initial >= 0 && initial < tabs.length
        ? initial
        : 0,
    );
    wireTabKeyboard(tabs);
    if (rich)
      window.addEventListener("popstate", () => {
        const value = Number(
          new URLSearchParams(location.search).get("kategoriya") || 0,
        );
        select(
          Number.isInteger(value) && value >= 0 && value < tabs.length
            ? value
            : 0,
        );
      });
  });
}
export function initDirectory() {
  const input = document.querySelector("#store-search");
  if (!input) return;
  const buttons = [...document.querySelectorAll("[data-store-filter]")];
  const cards = [...document.querySelectorAll("#store-directory .store-card")];
  let group = "all";
  const normalize = (value) =>
    value
      .toLocaleLowerCase("uz")
      .replace(/[‘’ʻʼ`']/g, "")
      .trim();
  function filter() {
    const query = normalize(input.value);
    let count = 0;
    cards.forEach((card) => {
      const match =
        (group === "all" || group === card.dataset.group) &&
        normalize(card.dataset.search).includes(query);
      card.hidden = !match;
      if (match) {
        card.classList.remove("is-pending");
        count++;
      }
    });
    document.querySelector("#store-results").textContent = `${count} ta do‘kon`;
    document.querySelector("#store-empty").hidden = count > 0;
    buttons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.storeFilter === group),
      ),
    );
  }
  input.addEventListener("input", filter);
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      group = button.dataset.storeFilter;
      filter();
    }),
  );
  document
    .querySelector("#clear-store-search")
    .addEventListener("click", () => {
      input.value = "";
      group = "all";
      filter();
      input.focus();
    });
}
export function initFaq() {
  const input = document.querySelector("#faq-search");
  if (!input) return;
  const items = [...document.querySelectorAll("[data-faq-search]")];
  function filter() {
    const normalize = (value) =>
      value
        .toLocaleLowerCase("uz")
        .replace(/[‘’ʻʼ`']/g, "")
        .trim();
    const query = normalize(input.value);
    let count = 0;
    items.forEach((item) => {
      const match = normalize(item.dataset.faqSearch).includes(query);
      item.hidden = !match;
      if (match) {
        item.classList.remove("is-pending");
        count++;
      }
    });
    document.querySelector("#faq-results").textContent = `${count} ta savol`;
    document.querySelector("#faq-empty").hidden = count > 0;
    document.querySelectorAll(".faq-group").forEach((group) => {
      group.hidden = ![...group.querySelectorAll(".faq-item")].some(
        (item) => !item.hidden,
      );
    });
  }
  input.addEventListener("input", filter);
  document.querySelector("#clear-faq-search").addEventListener("click", () => {
    input.value = "";
    filter();
    input.focus();
  });
}
