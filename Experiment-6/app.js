const svg = document.getElementById("drawingArea");

let isDrawing = false;
let currentPath = null;

function getMousePosition(evt) {
  const rect = svg.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

svg.addEventListener("mousedown", (e) => {
  isDrawing = true;

  const { x, y } = getMousePosition(e);
  currentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

  currentPath.setAttribute("stroke", "#1e88e5");
  currentPath.setAttribute("stroke-width", "3");
  currentPath.setAttribute("stroke-linecap", "round");
  currentPath.setAttribute("stroke-linejoin", "round");
  currentPath.setAttribute("fill", "none");

  currentPath.setAttribute("d", `M ${x} ${y}`);
  svg.appendChild(currentPath);
});

svg.addEventListener("mousemove", (e) => {
  if (!isDrawing || !currentPath) return;

  const { x, y } = getMousePosition(e);
  const d = currentPath.getAttribute("d");
  currentPath.setAttribute("d", `${d} L ${x} ${y}`);
});

function stopDrawing() {
  isDrawing = false;
  currentPath = null;
}

svg.addEventListener("mouseup", stopDrawing);
svg.addEventListener("mouseleave", stopDrawing);
document.addEventListener("mouseup", stopDrawing);
