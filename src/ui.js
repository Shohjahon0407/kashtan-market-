export const icon = (name) =>
  `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
export function wireTabKeyboard(tabs, vertical = false) {
  tabs.forEach((tab, index) =>
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === (vertical ? "ArrowDown" : "ArrowRight"))
        next = (index + 1) % tabs.length;
      if (event.key === (vertical ? "ArrowUp" : "ArrowLeft"))
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].focus();
      }
    }),
  );
}
export function trapFocus(dialog) {
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...dialog.querySelectorAll(
        'a[href],button:not([disabled]),input,[tabindex="0"]',
      ),
    ].filter((e) => e.getClientRects().length);
    const first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
}
export function initMenu() {
  const menu = document.querySelector("#mobile-menu"),
    toggle = document.querySelector(".menu-toggle");
  let focusTarget = null;
  toggle.addEventListener("click", () => {
    menu.showModal();
    toggle.setAttribute("aria-expanded", "true");
    menu.querySelector(".menu-close").focus();
  });
  menu
    .querySelector(".menu-close")
    .addEventListener("click", () => menu.close());
  trapFocus(menu);
  menu.addEventListener("close", () => {
    toggle.setAttribute("aria-expanded", "false");
    (focusTarget || toggle).focus({ preventScroll: true });
    focusTarget = null;
  });
  menu.querySelectorAll("nav a").forEach((link) =>
    link.addEventListener("click", () => {
      const targetUrl = new URL(link.href);
      if (targetUrl.pathname === location.pathname && targetUrl.hash) {
        const target = document.getElementById(targetUrl.hash.slice(1));
        if (target) {
          target.setAttribute("tabindex", "-1");
          focusTarget = target;
        }
      }
      menu.close();
    }),
  );
  matchMedia("(min-width:1080px)").addEventListener("change", (e) => {
    if (e.matches && menu.open) menu.close();
  });
}
