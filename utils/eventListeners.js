import { start, stop } from "../world.js";

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

export function handleCloseBtnClick() {
  const closeBtn = document.getElementById("close-btn");
  closeBtn.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  });
}
