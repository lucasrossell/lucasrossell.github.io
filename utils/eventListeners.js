import { start, stop } from "../world.js";
import { generateModal } from "./generateModal.js";
import { generatePhenotypeInfo } from "./generatePhenotypeInfo.js";

export function handleStartStopBtnClick() {
  const startStopBtn = document.getElementById("start-stop-btn");
  let bool = false;
  let isRunning = false;
  startStopBtn.addEventListener("click", () => {
    if (bool) {
      startStopBtn.style.backgroundColor = "green";
      bool = false;
    } else {
      startStopBtn.style.backgroundColor = "red";
      bool = true;
    }
  });
  startStopBtn.addEventListener("click", () => {
    if (isRunning) {
      stop();
      isRunning = false;
      startStopBtn.innerText = "Start";
    } else {
      start();
      isRunning = true;
      startStopBtn.innerText = "Stop";
    }
  });
}

export function handlePhenotypeInfoClick() {
  const phenotypeInfoBtn = document.getElementById("phenotype-info-btn");
  phenotypeInfoBtn.addEventListener("click", () => {
    generatePhenotypeInfo();
  });
}

export function handleCloseBtnClick() {
  const closeBtn = document.getElementById("close-btn");
  closeBtn.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  });
}

export function handleCanvasClick() {
  const canvas = document.getElementById("canvas");
  canvas.addEventListener("click", (e) => {
    const x = Math.floor(e.offsetX / window.cellSize.x);
    const y = Math.floor(e.offsetY / window.cellSize.y);
    const cell = window.cells.find(
      (cell) => cell.position.x === x && cell.position.y === y
    );
    // create a modal popup with the cell properties
    if (cell) {
      generateModal(cell);
      console.log(cell);
    }
  });
}
