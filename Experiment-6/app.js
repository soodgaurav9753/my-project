const canvas = document.getElementById("drawingArea");
const ctx = canvas.getContext("2d");

let isDrawing = false;

function getMousePosition(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const { x, y } = getMousePosition(e);

  ctx.beginPath();
  ctx.moveTo(x, y);

  ctx.strokeStyle = "#1e88e5";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const { x, y } = getMousePosition(e);
  ctx.lineTo(x, y);
  ctx.stroke();
});

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  ctx.closePath();
}

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
document.addEventListener("mouseup", stopDrawing);
