const controls = [...document.querySelectorAll("[data-group]")];
const groups = [...document.querySelectorAll(".unit-formation")];
const cards = [...document.querySelectorAll("[data-id]")];
const dialog = document.querySelector("#player-dialog");
const preview = document.querySelector("#player-preview");
let opener;
let previewCard;
let hideTimer;
function hidePreview() {
  clearTimeout(hideTimer);
  preview.hidden = true;
}
function deferHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hidePreview, 180);
}
function showPreview(card) {
  if (dialog.open) return;
  clearTimeout(hideTimer);
  previewCard = card;
  document
    .querySelector("#preview-content")
    .replaceChildren(card.querySelector("template").content.cloneNode(true));
  preview.hidden = false;
  const rect = card.getBoundingClientRect();
  const formation = card.closest(".unit-formation").getBoundingClientRect();
  // Keep the whole formation reachable, rather than covering later strips.
  // A compact preview can scroll independently of the fixed-height formation.
  const above = formation.top - 8;
  const below = innerHeight - formation.bottom - 8;
  const useAbove = above >= below;
  preview.style.maxHeight = `${Math.max(80, useAbove ? above : below)}px`;
  const width = preview.offsetWidth;
  const height = preview.offsetHeight;
  preview.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - width - 8))}px`;
  preview.style.top = `${Math.max(8, useAbove ? formation.top - height : formation.bottom)}px`;
}
function openProfile(card) {
  hidePreview();
  opener = card;
  document
    .querySelector("#dialog-content")
    .replaceChildren(
      document
        .getElementById(`detail-${card.dataset.id}`)
        .content.cloneNode(true),
    );
  dialog.showModal();
}
controls.forEach((button) =>
  button.addEventListener("click", () => {
    hidePreview();
    controls.forEach((control) =>
      control.setAttribute("aria-pressed", String(control === button)),
    );
    groups.forEach((group) => {
      group.hidden = group.dataset.unit !== button.dataset.group;
    });
    const ids = new Set(
      groups
        .filter((g) => !g.hidden)
        .flatMap((g) =>
          [...g.querySelectorAll("[data-id]")].map((c) => c.dataset.id),
        ),
    );
    document.querySelector("#player-count").textContent =
      `${ids.size} unique players in this unit`;
    document.querySelector("#formation-label").textContent = button.textContent;
  }),
);
function activateCard(card) {
  if (!card) return;
  for (const sibling of card.parentElement.children) {
    sibling.classList.toggle("is-active", sibling === card);
  }
}
for (const stack of document.querySelectorAll(".card-stack")) {
  stack.addEventListener("pointerleave", () => {
    const focused = stack.contains(document.activeElement)
      ? document.activeElement
      : null;
    activateCard(focused || stack.firstElementChild);
  });
  stack.addEventListener("focusout", (event) => {
    if (!stack.contains(event.relatedTarget)) {
      activateCard(
        stack.querySelector(".stack-card:hover") || stack.firstElementChild,
      );
    }
  });
}
cards.forEach((card) => {
  card.addEventListener("click", () => openProfile(card));
  card.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      activateCard(card);
      showPreview(card);
    }
  });
  card.addEventListener("pointerleave", deferHide);
  card.addEventListener("focus", () => {
    activateCard(card);
    if (card.matches(":focus-visible")) showPreview(card);
  });
  card.addEventListener("blur", deferHide);
});
preview.addEventListener("pointerenter", () => clearTimeout(hideTimer));
preview.addEventListener("pointerleave", deferHide);
preview.addEventListener("focusin", () => clearTimeout(hideTimer));
preview.addEventListener("focusout", (event) => {
  if (!preview.contains(event.relatedTarget)) deferHide();
});
document.querySelector("#dismiss-preview").addEventListener("click", () => {
  previewCard?.focus();
  hidePreview();
});
document
  .querySelector("#preview-open")
  .addEventListener("click", () => openProfile(previewCard));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hidePreview();
});
window.addEventListener("resize", hidePreview);
window.addEventListener("scroll", hidePreview);
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  opener?.focus();
  hidePreview();
});
controls[0].click();
document.querySelector(".roster-toolbar").hidden = false;
document.querySelector("#roster-fallback").hidden = true;
