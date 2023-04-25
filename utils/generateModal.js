function generateModal(cell) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const banner = document.getElementById("banner");
  const modalText = document.getElementById("modal-text");
  const cellPosition = document.getElementById("cell-position");

  modalTitle.innerText = `Cell ${cell.id}`;
  modalText.innerText = `Energy: ${cell.energy}\nBehavior: ${cell.behavior}\nDiet: ${cell.diet}\nPhenotype: ${cell.phenotype}\nHunting target: ${cell.target?.id}`;
  // display the actual color
  banner.style.backgroundColor = cell.color;
  modal.style.display = "block";
}

export { generateModal };
