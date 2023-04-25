export function suncycle() {
  window.sunlight.x += 1;
  if (window.sunlight.x > window.gridSize.x) {
    window.sunlight.x = 0;
  }
}
