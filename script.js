const buildBtn = document.getElementById("buildBtn");
const textInput = document.getElementById("textInput");
const board = document.getElementById("board");

buildBtn.addEventListener("click", () => {
  const text = textInput.value.trim();

  console.log("Raw input:", text);

  if (!text) {
    alert("No text found!");
    return;
  }

  const lines = text.split("\n").filter(line => line.trim());
  console.log("Lines:", lines);

  const data = [];

  lines.forEach((line, index) => {
    if (line.toLowerCase().startsWith("category")) return;
    const parts = line.split(",");
    if (parts.length >= 3) {
      data.push({
        Category: parts[0].trim(),
        Question: parts[1].trim(),
        Answer: parts.slice(2).join(",").trim()
      });
    }
  });

  console.log("Parsed data:", data);

  if (data.length === 0) {
    alert("No valid questions found.");
    return;
  }

  buildBoard(data);
});

function buildBoard(data) {
  board.innerHTML = "";
  data.forEach((q, idx) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = q.Category + ": " + q.Question;
    board.appendChild(tile);
  });
}
