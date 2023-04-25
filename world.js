import Cell from "./classes/Cell.js";
import { generateModal } from "./utils/generateModal.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let requestId;
let isRunning = false;
const gridSize = { x: 80, y: 60 }; // Size of the grid in cells
const cellSize = {
  x: canvas.width / gridSize.x,
  y: canvas.height / gridSize.y,
}; // Size of each cell
let sunlight = { x: 40, y: 30 }; // Position of the sunlight
const movementBehaviors = ["random", "sedentary", "sunlight", "hunt"];
const diets = ["sun", "meat"];

const cells = [];
const occupiedCells = []; // Array of cells that are occupied

// clicking a cell on the canvas should open more context
canvas.addEventListener("click", (e) => {
  const x = Math.floor(e.offsetX / cellSize.x);
  const y = Math.floor(e.offsetY / cellSize.y);
  const cell = cells.find(
    (cell) => cell.position.x === x && cell.position.y === y
  );
  // create a modal popup with the cell properties
  if (cell) {
    generateModal(cell);
    console.log(cell);
  }
});

function initWorld(numCells) {
  for (let i = 0; i < numCells; i++) {
    const x = Math.floor(Math.random() * gridSize.x);
    const y = Math.floor(Math.random() * gridSize.y);
    // pick a random color that is not white
    const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`;
    const diet = diets[Math.floor(Math.random() * 2)];
    let behavior;
    if (diet === "sun") {
      // any behavior except hunt
      behavior =
        movementBehaviors[Math.floor(Math.random() * movementBehaviors.length)];
    } else {
      behavior = "hunt";
    }

    // check if the cell is already occupied
    if (occupiedCells.some((cell) => cell.x === x && cell.y === y)) {
      continue;
    }
    const cell = new Cell(x, y, { color, behavior, diet, phenotype: i });
    cells.push(cell);
    occupiedCells.push({ x, y });
  }
}

function update() {
  // Move cells around, make them interact, etc.
  let chanceToMove;
  // make the sun travel across the screen
  sunlight.x += 1;
  if (sunlight.x > gridSize.x) {
    sunlight.x = 0;
  }
  const cellsCopy = [...cells];
  cellsCopy.forEach((cell) => {
    switch (cell.diet) {
      case "sun":
        // Check if the cell is in sunlight
        if (cell.inSunlight) {
          const sunlightDistance = Math.sqrt(
            Math.pow(cell.position.x - sunlight.x, 2) +
              Math.pow(cell.position.y - sunlight.y, 2)
          );
          if (sunlightDistance < 10) {
            // cells get more energy if they are closer to the sun
            cell.energy += 10 - sunlightDistance;
          }
          cell.energy += 5;
        }
        break;
      case "meat":
        // Check if the target is adjacent and alive
        if (
          cell.target !== null &&
          Math.abs(cell.position.x - cell.target.position.x) < 2 &&
          Math.abs(cell.position.y - cell.target.position.y) < 2 &&
          cells.includes(cell.target) &&
          cell.energy < 1500
        ) {
          // kill the target
          //make sure target is not self
          if (cell.target === cell) {
            break;
          }
          const index = cells.indexOf(cell.target);
          cells.splice(index, 1);
          occupiedCells.splice(index, 1);
          cell.energy += cell.target.energy / 2;
          cell.target = null;
        }
        break;
    }

    switch (cell.behavior) {
      case "random":
        chanceToMove = 0.1;
        break;
      case "sedentary":
        chanceToMove = 0;
        break;
      case "sunlight":
        //check if within 20 units of sunlight
        if (
          Math.abs(cell.position.x - sunlight.x) < 20 &&
          Math.abs(cell.position.y - sunlight.y) < 20
        ) {
          chanceToMove = 0;
          cell.inSunlight = true;
        } else {
          chanceToMove = 0.1;
          cell.inSunlight = false;
        }
        break;
      case "hunt":
        // check if there are any other cells nearby
        // if so, move towards them
        chanceToMove = 0.1;
        if (cell.target !== null) {
          // check if the target is still alive
          if (!cells.includes(cell.target)) {
            cell.target = null;
          } else {
            chanceToMove = 0.8;
            // refresh the target
            const index = cells.indexOf(cell.target);
            cell.target = cells[index];
            if (cell.target.phenotype === cell.phenotype) {
              cell.target = null;
            }
          }
        }

        const nearbyCells = cells.filter(
          (otherCell) =>
            Math.abs(cell.position.x - otherCell.position.x) < 20 &&
            Math.abs(cell.position.y - otherCell.position.y) < 20
        );
        // make sure the cell isn't targeting itself
        const index = nearbyCells.indexOf(cell);
        if (index > -1) {
          nearbyCells.splice(index, 1);
        }
        if (nearbyCells.length > 0) {
          // set target to the closest cell
          const target = nearbyCells.reduce((closest, otherCell) => {
            const distanceToClosest = Math.sqrt(
              Math.pow(cell.position.x - closest.position.x, 2) +
                Math.pow(cell.position.y - closest.position.y, 2)
            );
            const distanceToOther = Math.sqrt(
              Math.pow(cell.position.x - otherCell.position.x, 2) +
                Math.pow(cell.position.y - otherCell.position.y, 2)
            );
            if (distanceToOther < distanceToClosest) {
              return otherCell;
            } else {
              return closest;
            }
          });
          // only set target if we are hungry
          if (cell.energy < 1500) cell.target = target;
        } else {
          cell.target = null;
        }
        break;
    }

    if (cell.energy > 1500) {
      // one in 100 chance of reproducing
      if (Math.random() < 0.02) {
        const x = cell.position.x + Math.floor(Math.random() * 3) - 1;
        const y = cell.position.y + Math.floor(Math.random() * 3) - 1;
        // Check if the cell is occupied
        if (occupiedCells.some((cell) => cell.x === x && cell.y === y)) {
          return;
        } else {
          const newCell = cell.birth(x, y);
          cells.push(newCell);
          occupiedCells.push({ x, y });
        }
      }
    }

    if (Math.random() < chanceToMove) {
      cell.lifeCycle();
      // check if cell has target and move towards it
      if (cell.target) {
        const distanceToTarget = Math.sqrt(
          Math.pow(cell.position.x - cell.target.position.x, 2) +
            Math.pow(cell.position.y - cell.target.position.y, 2)
        );
        if (distanceToTarget > 1) {
          // move towards target
          const x =
            cell.position.x +
            Math.sign(cell.target.position.x - cell.position.x - 1);
          const y =
            cell.position.y +
            Math.sign(cell.target.position.y - cell.position.y - 1);
          // Check if the cell is occupied
          if (occupiedCells.some((cell) => cell.x === x && cell.y === y)) {
            return;
          } else {
            occupiedCells.splice(occupiedCells.indexOf(cell.position), 1);
            cell.position = { x, y };
            occupiedCells.push(cell.position);
          }
        }
      } else {
        // move randomly
        const newPosition = {
          x: cell.position.x + Math.floor(Math.random() * 3) - 1,
          y: cell.position.y + Math.floor(Math.random() * 3) - 1,
        };
        // Check if the cell is occupied
        if (
          occupiedCells.some(
            (cell) => cell.x === newPosition.x && cell.y === newPosition.y
          )
        ) {
          return;
        }
        occupiedCells.splice(occupiedCells.indexOf(cell.position), 1);
        cell.position = newPosition;
        occupiedCells.push(cell.position);
      }
      // if we moved off the grid, wrap around
      if (cell.position.x < 0) {
        cell.position.x = gridSize.x - 1;
      }
      if (cell.position.x > gridSize.x - 1) {
        cell.position.x = 0;
      }
      if (cell.position.y < 0) {
        cell.position.y = gridSize.y - 1;
      }
      if (cell.position.y > gridSize.y - 1) {
        cell.position.y = 0;
      }
    }
    cell.lifeCycle();
    // check if cell is dead
    if (cell.energy <= 0) {
      // remove cell from cells array
      cells.splice(cells.indexOf(cell), 1);
      // remove cell from occupiedCells array
      occupiedCells.splice(occupiedCells.indexOf(cell.position), 1);
    }
  });
  draw();
  // Call the update function again in the next frame
  requestId = requestAnimationFrame(update);
}

function draw() {
  // Draw the cells
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cells.forEach((cell) => {
    ctx.fillStyle = cell.color;
    ctx.fillRect(
      cell.position.x * cellSize.x,
      cell.position.y * cellSize.y,
      cellSize.x,
      cellSize.y
    );
  });
  // draw the sun
  ctx.fillStyle = "yellow";
  ctx.fillRect(
    sunlight.x * cellSize.x,
    sunlight.y * cellSize.y,
    cellSize.x * 5,
    cellSize.y * 5
  );
}

function run() {
  initWorld(100);
}

function start() {
  if (!isRunning) {
    isRunning = true;
    update();
  }
}

function stop() {
  if (isRunning) {
    isRunning = false;
    cancelAnimationFrame(requestId);
  }
  console.log("stopped");
  const phenotypes = cells.map((cell) => cell.phenotype);
  //log only unique
  console.log("remaining phenotypes:");
  console.log([...new Set(phenotypes)]);
}
export { run, start, stop };
