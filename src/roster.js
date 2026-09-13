const controls = document.querySelectorAll("[data-group]");
const groups = [...document.querySelectorAll(".position-group")];
const cards = [...document.querySelectorAll("[data-id]")];
const count = document.querySelector("#player-count");
controls.forEach((button) =>
  button.addEventListener("click", () => {
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
    count.textContent = `${ids.size} unique players in this unit`;
    document.querySelector("#formation-label").textContent = button.textContent;
  }),
);
const dialog = document.querySelector("#player-dialog");
let opener;
cards.forEach((card) => {
  card.addEventListener("click", () => {
    opener = card;
    const source = document.getElementById(`detail-${card.dataset.id}`);
    document
      .querySelector("#dialog-content")
      .replaceChildren(source.content.cloneNode(true));
    dialog.showModal();
  });
  card.addEventListener("pointerleave", () =>
    card.classList.remove("preview-dismissed"),
  );
  card.addEventListener("blur", () =>
    card.classList.remove("preview-dismissed"),
  );
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !dialog.open)
    cards.forEach((card) => card.classList.add("preview-dismissed"));
});
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
dialog.addEventListener("close", () => opener?.focus());
controls[0].click();
document.querySelector(".roster-toolbar").hidden = false;
document.querySelector("#roster-fallback").hidden = true;
