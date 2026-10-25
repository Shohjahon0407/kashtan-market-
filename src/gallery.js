import { gallery, stores } from "./data.js";
import { trapFocus } from "./ui.js";
export function initGallery() {
  const dialog = document.querySelector("#gallery-dialog");
  if (!dialog) return;
  const buttons = [...document.querySelectorAll("[data-gallery]")];
  const filters = [...document.querySelectorAll("[data-gallery-filter]")];
  const close = dialog.querySelector(".gallery-close");
  const previous = dialog.querySelector("#gallery-prev"),
    next = dialog.querySelector("#gallery-next");
  let visible = buttons,
    current = 0,
    trigger = null;
  function render() {
    const entry = gallery.find(
      (g) => g.id === visible[current].dataset.gallery,
    );
    const image = document.createElement("img");
    image.src = `/assets/images/${entry.image}.webp`;
    image.alt = entry.alt;
    image.width = entry.width;
    image.height = entry.height;
    dialog.querySelector(".lightbox-image").replaceChildren(image);
    dialog.querySelector("#lightbox-title").textContent = entry.title;
    dialog.querySelector("#lightbox-position").textContent =
      `${current + 1} / ${visible.length} · ${entry.label}`;
    dialog.querySelector("#lightbox-store").href = stores.find(
      (store) => store.key === entry.store,
    ).href;
    previous.disabled = next.disabled = visible.length < 2;
  }
  function show(button) {
    trigger = button;
    current = visible.indexOf(button);
    if (current < 0) return;
    render();
    dialog.showModal();
    close.focus();
  }
  function change(step) {
    current = (current + step + visible.length) % visible.length;
    render();
  }
  buttons.forEach((button) =>
    button.addEventListener("click", () => show(button)),
  );
  filters.forEach((filter) =>
    filter.addEventListener("click", () => {
      const group = filter.dataset.galleryFilter;
      visible = buttons.filter(
        (button) => group === "all" || button.dataset.galleryStore === group,
      );
      buttons.forEach((button) => {
        button.hidden = !visible.includes(button);
        if (!button.hidden) button.classList.remove("is-pending");
      });
      filters.forEach((button) =>
        button.setAttribute("aria-pressed", String(button === filter)),
      );
      document.querySelector("#gallery-results").textContent =
        `${visible.length} ta rasm`;
    }),
  );
  close.addEventListener("click", () => dialog.close());
  previous.addEventListener("click", () => change(-1));
  next.addEventListener("click", () => change(1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      change(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      change(-1);
    }
  });
  dialog.addEventListener("close", () =>
    trigger?.focus({ preventScroll: true }),
  );
  trapFocus(dialog);
  let gesture;
  const surface = dialog.querySelector(".lightbox-image");
  surface.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch")
      gesture = { x: event.clientX, y: event.clientY };
  });
  surface.addEventListener("pointerup", (event) => {
    if (!gesture) return;
    const dx = event.clientX - gesture.x,
      dy = event.clientY - gesture.y;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 65) change(dx < 0 ? 1 : -1);
    gesture = null;
  });
  surface.addEventListener("pointercancel", () => {
    gesture = null;
  });
}
