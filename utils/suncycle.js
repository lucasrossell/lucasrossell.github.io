export function suncycle() {
  const amplitude = 5; // adjust the amplitude of the sine wave
  const frequency = 0.05; // adjust the frequency of the sine wave
  const speed = parseFloat(document.getElementById("sunlight-speed").value);
  let yOffset = parseInt(document.getElementById("sunlight-position").value);
  yOffset = window.gridSize.y - yOffset;
  window.sunlight.x += speed;
  window.sunlight.y =
    amplitude * Math.sin(frequency * window.sunlight.x) + yOffset;
  if (window.sunlight.x > window.gridSize.x) {
    window.sunlight.x = 0;
    window.sunlight.y = yOffset; // Set the Y position to the middle
  }
}
