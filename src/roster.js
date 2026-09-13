const controls = document.querySelectorAll("[data-group]");
const cards = [...document.querySelectorAll(".player-card")];
const count = document.querySelector("#player-count");
controls.forEach((button) =>
  button.addEventListener("click", () => {
    controls.forEach((control) =>
      control.setAttribute("aria-pressed", String(control === button)),
    );
    const group = button.dataset.group;
    cards.forEach((card) => {
      card.hidden = !card.dataset.groups.split(" ").includes(group);
    });
    count.textContent = `${cards.filter((card) => !card.hidden).length} players in this source sample`;
    document.querySelector("#formation-label").textContent = button.textContent;
  }),
);
const dialog = document.querySelector("#player-dialog");
let opener;
cards.forEach((card) =>
  card.addEventListener("click", () => {
    opener = card;
    const source = document.querySelector(`#detail-${card.dataset.id}`);
    document
      .querySelector("#dialog-content")
      .replaceChildren(source.content.cloneNode(true));
    dialog.showModal();
  }),
);
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => opener?.focus());
controls[0]?.click();
