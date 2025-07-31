const fileInput = document.getElementById("fileInput");
const board = document.getElementById("board");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const toggleBtn = document.getElementById("toggle");
const closeBtn = document.getElementById("close");

let currentQA = { question: "", answer: "" };
let showingQuestion = true;

fileInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        buildBoard(results.data);
      }
    });
  }
});

function buildBoard(data) {
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

  // Add category headers
  catNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "category";
    div.textContent = name;
    board.appendChild(div);
  });

  // Add tiles with point values
  for (let i = 0; i < 5; i++) {
    const pointValue = (i + 1) * 100;
    catNames.forEach(name => {
      const q = categories[name][i];
      if (q) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = `$${pointValue}`;
        tile.addEventListener("click", () => showModal(q));
        board.appendChild(tile);
      }
    });
  }
}

function showModal(q) {
  currentQA = q;
  showingQuestion = true;
  modalText.textContent = q.question;
  toggleBtn.textContent = "Show Answer";
  modal.style.display = "block";
}

toggleBtn.addEventListener("click", () => {
  if (showingQuestion) {
    modalText.textContent = currentQA.answer;
    toggleBtn.textContent = "Show Question";
    showingQuestion = false;
  } else {
    modalText.textContent = currentQA.question;
    toggleBtn.textContent = "Show Answer";
    showingQuestion = true;
  }
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// --- SCOREBOARD ---

const scoreboard = document.getElementById("scoreboard");
const addTeamBtn = document.getElementById("addTeam");

let teams = [];

addTeamBtn.addEventListener("click", () => {
  const team = {
    name: `Team ${teams.length + 1}`,
    score: 0
  };
  teams.push(team);
  renderScoreboard();
});

function renderScoreboard() {
  scoreboard.innerHTML = "";

  teams.forEach((team, index) => {
    const teamDiv = document.createElement("div");
    teamDiv.className = "team";

    const nameInput = document.createElement("input");
    nameInput.value = team.name;
    nameInput.addEventListener("change", (e) => {
      team.name = e.target.value;
    });

    const scoreP = document.createElement("p");
    scoreP.textContent = `Score: ${team.score}`;

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+100";
    plusBtn.addEventListener("click", () => {
      team.score += 100;
      renderScoreboard();
    });

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-100";
    minusBtn.addEventListener("click", () => {
      team.score -= 100;
      renderScoreboard();
    });

    teamDiv.appendChild(nameInput);
    teamDiv.appendChild(scoreP);
    teamDiv.appendChild(plusBtn);
    teamDiv.appendChild(minusBtn);

    scoreboard.appendChild(teamDiv);
  });
}
