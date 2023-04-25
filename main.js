import { run, start, stop } from "./world.js";
let isRunning = false;
run();
document.getElementById("start-stop-btn").addEventListener("click", () => {
  if (isRunning) {
    stop();
    isRunning = false;
    document.getElementById("start-stop-btn").innerText = "Start";
  } else {
    start();
    isRunning = true;
    document.getElementById("start-stop-btn").innerText = "Stop";
  }
});
document.getElementById("close-btn").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
});
