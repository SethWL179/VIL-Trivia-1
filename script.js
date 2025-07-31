document.getElementById("load").addEventListener("click", () => {
  Papa.parse("trivia.csv", {
    download: true,
    header: true,
    complete: function(results) {
      buildBoard(results.data);
    }
  });
});

function buildBoard(data) {
  const board = document.getElementById("board");
  board.innerHTML = "";

  const categories = {};

  data.forEach(row => {
    if (!categories[row.Category]) {
      categories[row.Category] = [];
    }
    categories[row.Category].push({
      question: row.Question,
      answer: row.Answer
    });
  });

  const catNames = Object.keys(categories).slice(0, 5);

  catNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "category";
    div.textContent = name;
    board.appendChild(div);
  });

  for (let i = 0; i < 5; i++) {
    catNames.forEach(name => {
      const q = categories[name][i];
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = "?";
      let showing = 0;

      tile.addEventListener("click", () => {
        if (showing === 0) {
          tile.textContent = q.question;
          showing = 1;
        } else if (showing === 1) {
          tile.textContent = q.answer;
          showing = 2;
        }
      });

      board.appendChild(tile);
    });
  }
}
