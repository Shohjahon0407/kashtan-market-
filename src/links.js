import { siteConfig } from "./config.js";
export function initLinks() {
  // Missing contact details and platform links never produce placeholder links.
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  };
  document.querySelectorAll("[data-platform]").forEach((badge) => {
    const href = safeUrl(siteConfig.links[badge.dataset.platform]);
    if (!href) return;
    const link = document.createElement("a");
    link.className = badge.className;
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = badge.innerHTML;
    link.querySelector("small").textContent = "YUKLAB OLING";
    badge.replaceWith(link);
  });
  const contactContainer = document.querySelector("#contact-links");
  function addContact(label, href) {
    const element = document.createElement(href ? "a" : "span");
    element.textContent = label;
    if (href) element.href = href;
    if (href?.startsWith("https:")) {
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
    contactContainer.append(element);
    contactContainer.hidden = false;
  }
  if (siteConfig.contacts.phone.trim())
    addContact(
      siteConfig.contacts.phone,
      `tel:${siteConfig.contacts.phone.replace(/[^+\d]/g, "")}`,
    );
  if (siteConfig.contacts.email.trim())
    addContact(
      siteConfig.contacts.email,
      `mailto:${siteConfig.contacts.email}`,
    );
  if (siteConfig.contacts.address.trim())
    addContact(siteConfig.contacts.address);
  for (const name of ["telegram", "instagram"]) {
    const href = safeUrl(siteConfig.links[name]);
    if (href) addContact(name === "telegram" ? "Telegram" : "Instagram", href);
  }
  document.querySelector("#copyright-year").textContent =
    new Date().getFullYear();
}
