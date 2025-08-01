const fileInput = document.getElementById("fileInput");
const board = document.getElementById("board");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const modalCategory = document.getElementById("modal-category");

let currentQA = { question: "", answer: "", category: "" };
let showingQuestion = true;
let activeTile = null; // track currently open tile

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      buildBoard(results.data);
    }
  });
});

function buildBoard(data) {
  if (data.length === 0) {
    alert("No valid questions found. Check your CSV format.");
    return;
  }

  board.innerHTML = "";

  const categories = {};

  data.forEach(row => {
    if (!row.Category || !row.Question || !row.Answer) return;

    if (!categories[row.Category]) {
      categories[row.Category] = [];
    }
    categories[row.Category].push({
      question: row.Question,
      answer: row.Answer
    });
  });

  const catNames = Object.keys(categories).slice(0, 5);

  // Add category headers
  catNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "category";
    div.textContent = name;
    board.appendChild(div);
  });

  // Add tiles row by row
  for (let i = 0; i < 5; i++) {
    const pointValue = (i + 1) * 100;
    catNames.forEach(name => {
      const q = categories[name][i];
      if (q) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = `$${pointValue}`;
        tile.style.cursor = "pointer";
        tile.addEventListener("click", () => {
          // Prevent reopening if disabled
          if (tile.classList.contains("used")) return;

          activeTile = tile;
          showModal(q, name);
        });
        board.appendChild(tile);
      }
    });
  }
}

function showModal(q, category) {
  currentQA = { ...q, category };
  showingQuestion = true;
  modalCategory.textContent = category;
  modalText.textContent = q.question;
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.textAlign = "center";
  modal.style.cursor = "pointer";
}

modal.addEventListener("click", () => {
  if (showingQuestion) {
    // Show answer
    modalText.textContent = currentQA.answer;
    showingQuestion = false;
  } else {
    // Close modal
    modal.style.display = "none";
    showingQuestion = true;
    // Grey out and disable the tile
    if (activeTile) {
      activeTile.classList.add("used");
      activeTile.style.backgroundColor = "#555555";
      activeTile.style.color = "#ccc";
      activeTile.style.cursor = "default";
      activeTile.removeEventListener("click", null); // remove all listeners
      activeTile = null;
    }
  }
});
