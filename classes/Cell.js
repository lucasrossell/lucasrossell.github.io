import { generateRandomName } from "../utils/generateRandomName.js";

class Cell {
  constructor(x, y, genetics) {
    this.id = generateRandomName();
    this.position = { x, y };
    this.inSunlight = false;
    this.energy = 1500;
    // Other properties, such as health, age, speed, etc.
    this.color = genetics.color;
    this.behavior = genetics.behavior;
    this.diet = genetics.diet;
    this.phenotype = genetics.phenotype;
    this.ancestor = genetics.ancestor;
    this.target = null;
    this.warmth = 0;
    this.chanceToMove = 0;
  }

  birth() {
    // This method will be called when the cell reproduces
    // It will create a new cell with the same properties
    // as this one, but with some random variation
    if (this.energy < 1500 || Math.random() > 0.02) {
      return;
    }

    const x = this.position.x + Math.floor(Math.random() * 3) - 1;
    const y = this.position.y + Math.floor(Math.random() * 3) - 1;
    // make sure the new cell is not out of bounds
    if (x < 0 || x >= window.gridSize.x || y < 0 || y >= window.gridSize.y) {
      return;
    }
    // Check if the cell is occupied
    if (
      window.cells.some(
        (cell) => cell.position.x === x && cell.position.y === y
      )
    ) {
      return;
    }

    // make the color slightly different than the parent
    const mutationChance = 0.001; // .1% chance of mutation
    const isMutation = Math.random() < mutationChance;
    const colorChange = isMutation ? 40 : 8; // higher color change if mutation occurs

    const newColor = this.color.replace(/(\d+)/, (match) => {
      let newValue =
        Number(match) +
        Math.floor(Math.random() * colorChange * 2) -
        colorChange;
      newValue = Math.max(0, Math.min(255, newValue)); // clamp the value between 0 and 255
      return newValue;
    });

    let newBehavior = this.behavior;
    let newDiet = this.diet;
    let newPhenotype = this.phenotype;
    let newAncestor = this.ancestor;

    if (isMutation) {
      const diets = ["sun", "meat"];
      const movementBehaviors = ["random", "sedentary", "sunlight", "hunt"];
      const randomChoice = Math.random() < 0.5;
      if (randomChoice) {
        newBehavior =
          movementBehaviors[
            Math.floor(Math.random() * movementBehaviors.length)
          ];
      } else {
        newDiet = diets[Math.floor(Math.random() * diets.length)];
      }
      newPhenotype =
        Math.max(...window.cells.map((cell) => cell.phenotype)) + 1;
      newAncestor = this.phenotype;
    }

    this.energy -= 300;
    const newCell = new Cell(x, y, {
      color: newColor,
      behavior: newBehavior,
      diet: newDiet,
      phenotype: newPhenotype,
      ancestor: newAncestor,
    });
    window.cells.push(newCell);
  }

  eat() {
    switch (this.diet) {
      case "sun":
        // Check if the cell is in sunlight
        if (this.inSunlight) {
          // gain energy based on warmth
          if (this.warmth > 0) {
            this.energy += this.warmth;
          }
          this.energy += 5;
        }
        break;
      case "meat":
        // Check if the target is adjacent and alive
        if (
          this.target !== null &&
          Math.abs(this.position.x - this.target.position.x) < 2 &&
          Math.abs(this.position.y - this.target.position.y) < 2 &&
          window.cells.includes(this.target) &&
          this.energy < 1500
        ) {
          // kill the target
          //make sure target is not self
          if (this.target === this) {
            break;
          }
          const index = window.cells.indexOf(this.target);
          window.cells.splice(index, 1);
          this.energy += this.target.energy / 2;
          this.target = null;
        }
        break;
    }
  }

  lifeCycle() {
    // This method will be called every frame
    // It will be responsible for updating the cell's properties
    // and deciding whether it should die or reproduce
    this.energy -= 1;
    // check if cell is dead
    if (this.energy <= 0) {
      // remove cell from cells array
      window.cells.splice(window.cells.indexOf(this), 1);
    }
  }

  move() {
    if (Math.random() < this.chanceToMove) {
      this.lifeCycle();
      // check if cell has target and move towards it
      if (this.target) {
        const distanceToTarget = Math.sqrt(
          Math.pow(this.position.x - this.target.position.x, 2) +
            Math.pow(this.position.y - this.target.position.y, 2)
        );
        if (distanceToTarget > 1) {
          // move towards target
          const x =
            this.position.x +
            Math.sign(this.target.position.x - this.position.x - 1);
          const y =
            this.position.y +
            Math.sign(this.target.position.y - this.position.y - 1);
          // Check if the cell is occupied
          if (
            window.cells.some(
              (cell) => cell.position.x === x && cell.position.y === y
            )
          ) {
            return;
          } else {
            this.position = { x, y };
          }
        }
      } else {
        // move randomly
        const newPosition = {
          x: this.position.x + Math.floor(Math.random() * 3) - 1,
          y: this.position.y + Math.floor(Math.random() * 3) - 1,
        };
        // Check if the cell is occupied
        if (
          window.cells.some(
            (cell) =>
              cell.position.x === newPosition.x &&
              cell.position.y === newPosition.y
          )
        ) {
          return;
        }
        this.position = newPosition;
      }
      // if we moved off the grid, wrap around
      if (this.position.x < 0) {
        this.position.x = window.gridSize.x - 1;
      }
      if (this.position.x > window.gridSize.x - 1) {
        this.position.x = 0;
      }
      if (this.position.y < 0) {
        this.position.y = window.gridSize.y - 1;
      }
      if (this.position.y > window.gridSize.y - 1) {
        this.position.y = 0;
      }
    }
  }

  think() {
    switch (this.behavior) {
      case "random":
        this.chanceToMove = 0.5;
        break;
      case "sedentary":
        this.chanceToMove = 0.01;
        break;
      case "sunlight":
        //check if within 20 units of sunlight
        // get sunlight distance
        const sunlightDistance = Math.sqrt(
          Math.pow(this.position.x - window.sunlight.x, 2) +
            Math.pow(this.position.y - window.sunlight.y, 2)
        );
        this.warmth = 20 - sunlightDistance;
        if (sunlightDistance < 20) {
          this.chanceToMove = 0;
          this.inSunlight = true;
        } else {
          this.chanceToMove = 0.1;
          this.inSunlight = false;
        }
        break;
      case "hunt":
        // check if there are any other cells nearby
        // if so, move towards them
        this.chanceToMove = 0.25;
        if (this.target !== null) {
          // check if the target is still alive
          if (!window.cells.includes(this.target)) {
            this.target = null;
          } else {
            this.chanceToMove = 0.8;
            // refresh the target
            const index = window.cells.indexOf(this.target);
            this.target = window.cells[index];
            if (this.target.phenotype === this.phenotype) {
              this.target = null;
            }
          }
        } else if (this.energy < 1500) {
          const nearbyCells = window.cells.filter(
            (otherCell) =>
              Math.abs(this.position.x - otherCell.position.x) < 20 &&
              Math.abs(this.position.y - otherCell.position.y) < 20
          );
          // make sure the cell isn't targeting itself
          const index = nearbyCells.indexOf(this);
          if (index > -1) {
            nearbyCells.splice(index, 1);
          }
          if (nearbyCells.length > 0) {
            // set target to the closest cell
            const target = nearbyCells.reduce((closest, otherCell) => {
              const distanceToClosest = Math.sqrt(
                Math.pow(this.position.x - closest.position.x, 2) +
                  Math.pow(this.position.y - closest.position.y, 2)
              );
              const distanceToOther = Math.sqrt(
                Math.pow(this.position.x - otherCell.position.x, 2) +
                  Math.pow(this.position.y - otherCell.position.y, 2)
              );
              if (distanceToOther < distanceToClosest) {
                return otherCell;
              } else {
                return closest;
              }
            });
            this.target = target;
          }
        }
        break;
    }
  }
}

export default Cell;
