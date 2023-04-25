function generateModal(cell) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const banner = document.getElementById("banner");
  const modalText = document.getElementById("modal-text");
  const modalTable = document.getElementById("modal-table");
  modalTitle.innerText = `Cell ${cell.id}`;
  modalText.innerText = `Energy: ${cell.energy}\nBehavior: ${cell.behavior}\nDiet: ${cell.diet}\nPhenotype: ${cell.phenotype}\nHunting target: ${cell.target?.id}`;
  // display the actual color
  banner.style.backgroundColor = cell.color;
  modal.style.display = "block";
  modalTable.innerHTML = null;
}

export { generateModal };
