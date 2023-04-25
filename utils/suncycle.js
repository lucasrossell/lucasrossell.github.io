export function suncycle() {
  const amplitude = 5; // adjust the amplitude of the sine wave
  const frequency = 0.05; // adjust the frequency of the sine wave
  const yOffset = window.gridSize.y / 2 - 1; // adjust the vertical offset of the sine wave
  window.sunlight.x += 1;
  window.sunlight.y =
    amplitude * Math.sin(frequency * window.sunlight.x) + yOffset;
  if (window.sunlight.x > window.gridSize.x) {
    window.sunlight.x = 0;
    window.sunlight.y = yOffset; // Set the Y position to the middle
  }
}
