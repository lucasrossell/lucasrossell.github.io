export function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * window.gridSize.x),
    y: Math.floor(Math.random() * window.gridSize.y),
  };
}
