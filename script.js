let teams = [];
let showingAnswer = false;
let currentTile = null;

// Add team button handler
document.getElementById('addTeam').addEventListener('click', () => {
  const team = { name: `Team ${teams.length + 1}`, score: 0 };
  teams.push(team);
  renderTeams();
});

// Render teams in sidebar
function renderTeams() {
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = '';
  teams.forEach((team, i) => {
    const div = document.createElement('div');
    div.className = 'team';
    div.innerHTML = `
      <input value="${team.name}" onchange="teams[${i}].name = this.value" />
      <div>Score: ${team.score}</div>
      <button onclick="teams[${i}].score -= 100; renderTeams()">-100</button>
      <button onclick="teams[${i}].score += 100; renderTeams()">+100</button>
    `;
    scoreboard.appendChild(div);
  });
}

// Parse CSV upload
document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      if (!results.data || results.data.length === 0) {
        alert('CSV is empty or formatted incorrectly.');
        return;
      }
      buildBoard(results.data);
    }
  });
});

// Build the Jeopardy board: 6 categories, 5 questions each with values 100,200,...500
function buildBoard(data) {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // Group questions by category
  const categories = {};
  data.forEach(q => {
    if (!categories[q.Category]) categories[q.Category] = [];
    categories[q.Category].push(q);
  });

  // Get the first 6 categories only
  const categoryNames = Object.keys(categories).slice(0, 6);

  // Clear board before building
  board.innerHTML = '';

  // Create category headers
  categoryNames.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';
    catDiv.textContent = cat;
    board.appendChild(catDiv);
  });

  // Point values for 5 rows
  const pointValues = [100, 200, 300, 400, 500];

  // Create tiles row by row
  for (let i = 0; i < 5; i++) {
    categoryNames.forEach(cat => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = pointValues[i];

      // Find the question in this category with matching value or fallback to index
      let questionObj = categories[cat].find(q => {
        // Try to parse and match value from CSV; if no Value field, fallback
        return parseInt(q.Value) === pointValues[i];
      });
      if (!questionObj) {
        // fallback: just take question at this index if exists
        questionObj = categories[cat][i];
      }

      if (questionObj) {
        tile.dataset.question = questionObj.Question;
        tile.dataset.answer = questionObj.Answer;
        tile.dataset.value = pointValues[i];
        tile.dataset.category = cat;

        tile.addEventListener('click', () => openModal(tile));
      } else {
        tile.textContent = '';
        tile.classList.add('empty');
      }

      board.appendChild(tile);
    });
  }
}

// Open modal on question click
function openModal(tile) {
  if (tile.classList.contains('used')) return; // prevent reopening used tiles
  currentTile = tile;
  showingAnswer = false;

  const modal = document.getElementById('modal');
  modal.style.display = 'flex';

  document.getElementById('modal-category').textContent = tile.dataset.category;
  document.getElementById('modal-text').textContent = tile.dataset.question;
}

// Clicking modal toggles question/answer or closes modal
document.getElementById('modal').addEventListener('click', () => {
  if (!showingAnswer) {
    // Show answer
    document.getElementById('modal-text').textContent = currentTile.dataset.answer;
    showingAnswer = true;
  } else {
    // Close modal and disable tile
    document.getElementById('modal').style.display = 'none';
    currentTile.classList.add('used');
    // Remove click listener to prevent reopening
    currentTile.replaceWith(currentTile.cloneNode(true));
    currentTile = null;
  }
});
