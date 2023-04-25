function generatePhenotypeInfo() {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const banner = document.getElementById("banner");
  const modalText = document.getElementById("modal-text");
  const modalTable = document.getElementById("modal-table");
  const phenotypeGroups = window.cells.reduce((acc, cell) => {
    if (acc[cell.phenotype]) {
      acc[cell.phenotype].count += 1;
    } else {
      acc[cell.phenotype] = {
        count: 1,
        diets: cell.diet,
        behaviors: cell.behavior,
        color: cell.color,
      };
    }
    return acc;
  }, {});

  modalTitle.innerText = `Phenotype Info`;
  modalText.innerText = null;
  // put phenotype info in a table
  modalTable.innerHTML = `
    <tr>
      <th> </th>
      <th>Phenotype</th>
      <th>Count</th>
      <th>Diet</th>
      <th>Behavior</th>
    </tr>
  `;

  // Create table rows and cells
  // Create table rows and cells
  for (const phenotype in phenotypeGroups) {
    const group = phenotypeGroups[phenotype];
    const row = document.createElement("tr");
    const colorCell = document.createElement("td");
    const phenotypeCell = document.createElement("td");
    const countCell = document.createElement("td");
    const dietCell = document.createElement("td");
    const behaviorCell = document.createElement("td");

    colorCell.style.backgroundColor = group.color;
    colorCell.style.height = "10px";
    colorCell.style.width = "2px";
    phenotypeCell.innerText = phenotype;
    countCell.innerText = group.count;
    dietCell.innerText = group.diets;
    behaviorCell.innerText = group.behaviors;

    row.appendChild(colorCell);
    row.appendChild(phenotypeCell);
    row.appendChild(countCell);
    row.appendChild(dietCell);
    row.appendChild(behaviorCell);
    modalTable.appendChild(row);
  }

  modal.style.display = "block";
  banner.style.backgroundColor = "grey";
}

export { generatePhenotypeInfo };
