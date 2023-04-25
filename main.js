import { run } from "./world.js";
import {
  handleStartStopBtnClick,
  handleCloseBtnClick,
  handleCanvasClick,
} from "./utils/eventListeners.js";

// Start the simulation
run();

// Event listeners
handleStartStopBtnClick();
handleCloseBtnClick();
handleCanvasClick();
