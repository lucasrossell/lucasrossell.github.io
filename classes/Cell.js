class Cell {
  constructor(x, y, genetics) {
    this.id = Math.random().toString(16).slice(2);
    this.position = { x, y };
    this.inSunlight = false;
    this.energy = 1500;
    // Other properties, such as health, age, speed, etc.
    this.color = genetics.color;
    this.behavior = genetics.behavior;
    this.diet = genetics.diet;
    this.phenotype = genetics.phenotype;
    this.target = null;
  }

  birth(x, y) {
    // This method will be called when the cell reproduces
    // It will create a new cell with the same properties
    // as this one, but with some random variation

    // make the color slightly different than the parent
    const newColor = this.color.replace(
      /(\d+)/,
      (match) => Number(match) + Math.floor(Math.random() * 10) - 5
    );
    this.energy -= 300;
    return new Cell(x, y, {
      color: newColor,
      behavior: this.behavior,
      diet: this.diet,
      phenotype: this.phenotype,
    });
  }

  lifeCycle() {
    // This method will be called every frame
    // It will be responsible for updating the cell's properties
    // and deciding whether it should die or reproduce
    this.energy -= 1;
  }
}

export default Cell;
