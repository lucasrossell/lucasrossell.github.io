import Cell from "./classes/Cell.js";
import { suncycle } from "./utils/suncycle.js";

// getting the canvas and setting other fun variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let requestId;
let isRunning = false;

// make global variables for the sim
window.gridSize = { x: 80, y: 60 }; // canvas in index.html is 800x600
window.cellSize = {
  x: canvas.width / window.gridSize.x,
  y: canvas.height / window.gridSize.y,
}; // each cell is 10x10
window.sunlight = { x: 40, y: 30 }; // the sun starts in the middle
window.cells = []; // array of cells

function initWorld(numCells) {
  // for numCells, create a new cell at a random position
  for (let i = 0; i < numCells; i++) {
    const x = Math.floor(Math.random() * window.gridSize.x);
    const y = Math.floor(Math.random() * window.gridSize.y);
    // pick a random color that is not white
    const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`;
    // pick a random behavior and diet
    const diets = ["sun", "meat"];
    const diet = diets[Math.floor(Math.random() * 2)];
    let behavior;
    if (diet === "sun") {
      // any behavior except hunt
      const movementBehaviors = ["random", "sedentary", "sunlight"];
      behavior =
        movementBehaviors[Math.floor(Math.random() * movementBehaviors.length)];
    } else {
      behavior = "hunt";
    }

    // check if the cell is already occupied
    if (
      window.cells.some(
        (cell) => cell.position.x === x && cell.position.y === y
      )
    ) {
      continue;
    }
    // create the cell and add it to the array
    const cell = new Cell(x, y, { color, behavior, diet, phenotype: i });
    window.cells.push(cell);
  }
}

function update() {
  // make the sun travel across the screen
  suncycle();
  // this is the main loop where all the cells do their thing
  [...window.cells].forEach((cell) => {
    cell.think();
    cell.eat();
    cell.birth();
    cell.move();
    cell.lifeCycle();
  });
  // draw the canvas again
  draw();
}

function draw() {
  // Draw the cells
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.cells.forEach((cell) => {
    ctx.fillStyle = cell.color;
    ctx.fillRect(
      cell.position.x * window.cellSize.x,
      cell.position.y * window.cellSize.y,
      window.cellSize.x,
      window.cellSize.y
    );
  });
  // draw the sun
  ctx.fillStyle = "yellow";
  ctx.fillRect(
    window.sunlight.x * window.cellSize.x,
    window.sunlight.y * window.cellSize.y,
    window.cellSize.x * 5,
    window.cellSize.y * 5
  );
  // this makes the loop run again
  requestId = requestAnimationFrame(update);
}

function run() {
  initWorld(100);
}

function start() {
  console.log("started");
  if (!isRunning) {
    isRunning = true;
    update();
  }
}

function stop() {
  console.log("stopped");
  if (isRunning) {
    isRunning = false;
    // this stops the loop in the draw function
    cancelAnimationFrame(requestId);
  }
  //log only unique
  console.log("remaining phenotypes:");
  const uniquePhenotypes = window.cells
    .map((cell) => cell.phenotype)
    .sort((a, b) => {
      return a - b;
    })
    .filter((phenotype, index, self) => {
      return self.indexOf(phenotype) === index;
    });
  console.log(uniquePhenotypes);
}
export { run, start, stop };
