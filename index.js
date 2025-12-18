const colors = ["white", "red", "blue"];
let currentColorIndex = 0;

const swatch = document.getElementById("swatch");

window.onload = () => {
  const svgBox = document.getElementById("svgBox");
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 50; col++) {
      const useElem = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );
      const href = (col + row) % 2 === 0 ? "#triangle" : "#triangle-down";
      useElem.setAttribute("href", href);
      useElem.setAttribute("x", col * 25 - 25);
      useElem.setAttribute("y", row * 42 - 30);
      useElem.setAttribute("data-selected", "false");
      svgBox.appendChild(useElem);
    }
  }
};

window.addEventListener("mouseup", (e) => {
  if (e.target.tagName === "use") {
    e.target.style.fill = colors[currentColorIndex];
    updateSwatchCounts();
  }
});

function countColoredTriangles(color) {
  const svgBox = document.getElementById("svgBox");
  const uses = svgBox.getElementsByTagName("use");
  let count = 0;
  for (let useElem of uses) {
    if (useElem.style.fill === color) {
      count++;
    }
  }
  return count;
}

function updateSwatchCounts() {
  const redCount = countColoredTriangles("red");
  document.getElementById("redCount").textContent = redCount;
  const blueCount = countColoredTriangles("blue");
  document.getElementById("blueCount").textContent = blueCount;
}

const colorBtn = document.getElementById("colorBtn");
colorBtn.onclick = () => {
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  swatch.style.backgroundColor = colors[currentColorIndex];
};
