const modeToggle = document.getElementById("modeToggle");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const animationToggle = document.getElementById("animationToggle");
const modeLabel = document.getElementById("modeLabel");

const pathSunHouse = document.getElementById("path-sun-house");
const pathHouseGrid = document.getElementById("path-house-grid");
const dotsSun = document.querySelectorAll(".dot--sun");
const dotsGrid = document.querySelectorAll(".dot--grid");

let lastTimestamp = 0;
let progressSun = 0;
let progressGrid = 0;
let animationActive = true;

const sunLength = pathSunHouse.getTotalLength();
const gridLength = pathHouseGrid.getTotalLength();

const dotOffsets = [0, 0.45];

const updateLabel = () => {
  modeLabel.textContent = modeToggle.checked ? "Modus: Überschuss" : "Modus: Bezug";
};

const updateSpeedLabel = () => {
  speedValue.textContent = `${Number(speedSlider.value).toFixed(1)}×`;
};

const placeDots = (path, length, dots, progress, reverse = false) => {
  dots.forEach((dot, index) => {
    const offset = dotOffsets[index] ?? 0;
    let position = (progress + offset) % 1;
    if (reverse) {
      position = 1 - position;
    }
    const point = path.getPointAtLength(position * length);
    dot.setAttribute("cx", point.x);
    dot.setAttribute("cy", point.y);
  });
};

const animate = (timestamp) => {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (animationActive) {
    const speed = Number(speedSlider.value);
    progressSun = (progressSun + delta * 0.35 * speed) % 1;
    progressGrid = (progressGrid + delta * 0.35 * speed) % 1;
  }

  placeDots(pathSunHouse, sunLength, dotsSun, progressSun, false);
  placeDots(pathHouseGrid, gridLength, dotsGrid, progressGrid, !modeToggle.checked);

  requestAnimationFrame(animate);
};

modeToggle.addEventListener("change", updateLabel);
speedSlider.addEventListener("input", updateSpeedLabel);
animationToggle.addEventListener("change", (event) => {
  animationActive = event.target.checked;
});

updateLabel();
updateSpeedLabel();
requestAnimationFrame(animate);
