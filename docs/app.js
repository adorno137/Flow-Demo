const pvInput = document.getElementById("pvInput");
const loadInput = document.getElementById("loadInput");
const pvValue = document.getElementById("pvValue");
const loadValue = document.getElementById("loadValue");
const gridValue = document.getElementById("gridValue");
const animationToggle = document.getElementById("animationToggle");

const layout = document.querySelector(".layout");
const tileSun = document.getElementById("tile-sun");
const tileHouse = document.getElementById("tile-house");
const tileGrid = document.getElementById("tile-grid");
const connections = document.querySelector(".connections");

const pathSunHouse = document.getElementById("path-sun-house");
const pathSunGrid = document.getElementById("path-sun-grid");
const pathGridHouse = document.getElementById("path-grid-house");
const dotsSunHouse = document.querySelectorAll(".dot--sun-house");
const dotsSunGrid = document.querySelectorAll(".dot--sun-grid");
const dotsGridHouse = document.querySelectorAll(".dot--grid-house");

let lastTimestamp = 0;
let progressSunHouse = 0;
let progressSunGrid = 0;
let progressGridHouse = 0;
let animationActive = true;

let sunHouseLength = 0;
let sunGridLength = 0;
let gridHouseLength = 0;

const dotOffsets = [0, 0.45];
// Normalisierung für Linien-Dicke und Punktgeschwindigkeit.
const maxPowerW = 8000;
// Basisgeschwindigkeit für die Animation (wird pro Verbindung skaliert).
const baseSpeed = 0.35;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizePower = (value) => clamp(value / maxPowerW, 0, 1);

const formatWatts = (value) => `${Math.round(value)} W`;

const getCenterPoint = (element, containerRect) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
  };
};

const buildCurvedPath = (start, end, curvature = 0.2, direction = 1) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy) || 1;
  const offset = Math.min(60, distance * curvature);
  const perpX = (-dy / distance) * offset * direction;
  const perpY = (dx / distance) * offset * direction;
  const controlX = (start.x + end.x) / 2 + perpX;
  const controlY = (start.y + end.y) / 2 + perpY;

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

const updateConnectionPaths = () => {
  if (!layout || !connections || !tileSun || !tileHouse || !tileGrid) {
    return;
  }
  const containerRect = layout.getBoundingClientRect();
  const width = Math.max(0, containerRect.width);
  const height = Math.max(0, containerRect.height);

  connections.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const sunCenter = getCenterPoint(tileSun, containerRect);
  const houseCenter = getCenterPoint(tileHouse, containerRect);
  const gridCenter = getCenterPoint(tileGrid, containerRect);

  pathSunHouse.setAttribute("d", buildCurvedPath(sunCenter, houseCenter, 0.18, -1));
  pathSunGrid.setAttribute("d", buildCurvedPath(sunCenter, gridCenter, 0.18, 1));
  pathGridHouse.setAttribute("d", buildCurvedPath(gridCenter, houseCenter, 0.18, 1));

  sunHouseLength = pathSunHouse.getTotalLength();
  sunGridLength = pathSunGrid.getTotalLength();
  gridHouseLength = pathGridHouse.getTotalLength();
};

const updateReadouts = (pvW, loadW, gridW) => {
  pvValue.textContent = `PV: ${formatWatts(pvW)}`;
  loadValue.textContent = `Load: ${formatWatts(loadW)}`;
  gridValue.textContent = `Netz: ${formatWatts(gridW)}`;
};

const applyConnectionState = (path, dots, powerW) => {
  const active = powerW > 0;
  const norm = normalizePower(powerW);
  const strokeWidth = 2 + norm * 6;
  const speedFactor = 0.6 + norm * 2.0;

  path.style.opacity = active ? "1" : "0";
  path.style.strokeWidth = active ? strokeWidth.toFixed(2) : "0";
  dots.forEach((dot) => {
    dot.style.opacity = active ? "0.95" : "0";
  });

  return speedFactor;
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

  const pvW = Number(pvInput.value);
  const loadW = Number(loadInput.value);
  const gridW = loadW - pvW;
  const pvToHouseW = Math.min(pvW, loadW);
  const pvToGridW = Math.max(0, pvW - loadW);
  const gridToHouseW = Math.max(0, gridW);

  updateReadouts(pvW, loadW, gridW);

  const sunHouseSpeed = applyConnectionState(pathSunHouse, dotsSunHouse, pvToHouseW);
  const sunGridSpeed = applyConnectionState(pathSunGrid, dotsSunGrid, pvToGridW);
  const gridHouseSpeed = applyConnectionState(pathGridHouse, dotsGridHouse, gridToHouseW);

  if (animationActive) {
    progressSunHouse = (progressSunHouse + delta * baseSpeed * sunHouseSpeed) % 1;
    progressSunGrid = (progressSunGrid + delta * baseSpeed * sunGridSpeed) % 1;
    progressGridHouse = (progressGridHouse + delta * baseSpeed * gridHouseSpeed) % 1;
  }

  placeDots(pathSunHouse, sunHouseLength, dotsSunHouse, progressSunHouse, false);
  placeDots(pathSunGrid, sunGridLength, dotsSunGrid, progressSunGrid, false);
  placeDots(pathGridHouse, gridHouseLength, dotsGridHouse, progressGridHouse, false);

  requestAnimationFrame(animate);
};

pvInput.addEventListener("input", () => {
  updateReadouts(Number(pvInput.value), Number(loadInput.value), Number(loadInput.value) - Number(pvInput.value));
});

loadInput.addEventListener("input", () => {
  updateReadouts(Number(pvInput.value), Number(loadInput.value), Number(loadInput.value) - Number(pvInput.value));
});

animationToggle.addEventListener("change", (event) => {
  animationActive = event.target.checked;
});

updateReadouts(Number(pvInput.value), Number(loadInput.value), Number(loadInput.value) - Number(pvInput.value));
window.addEventListener("resize", updateConnectionPaths);
window.addEventListener("orientationchange", updateConnectionPaths);
window.addEventListener("load", updateConnectionPaths);
updateConnectionPaths();
requestAnimationFrame(animate);
