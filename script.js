let teams = [];
let showingAnswer = false;
let currentTile = null;
let currentValue = 0;

document.getElementById('addTeam').addEventListener('click', () => {
  const team = {
    name: `Team ${teams.length + 1}`,
    score: 0
  };
  teams.push(team);
  renderTeams();
});

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

document.getElementById('fileInput').addEventListener('change', function (e) {
  Papa.parse(e.target.files[0], {
    header: true,
    complete: function (results) {
      buildBoard(results.data);
    }
  });
});

function buildBoard(data) {
  const board = document.getElementById('board');
  board.innerHTML = '';

  const categories = [...new Set(data.map(q => q.Category))];
  categories.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'category';
    div.textContent = cat;
    board.appendChild(div);
  });

  const maxQuestions = data.length / categories.length;

  for (let i = 0; i < maxQuestions; i++) {
    categories.forEach(cat => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      const value = (i + 1) * 100;
      tile.textContent = value;
      tile.dataset.category = cat;
      tile.dataset.value = value;
      const question = data.find(q => q.Category === cat && parseInt(q.Value) === value);
      if (question) {
        tile.dataset.question = question.Question;
        tile.dataset.answer = question.Answer;
        tile.addEventListener('click', () => openModal(tile));
      } else {
        tile.textContent = '';
      }
      board.appendChild(tile);
    });
  }
}

function openModal(tile) {
  currentTile = tile;
  currentValue = parseInt(tile.dataset.value);
  showingAnswer = false;
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-category').textContent = tile.dataset.category;
  document.getElementById('modal-text').textContent = tile.dataset.question;

  // Clear and show team buttons
  const modalTeams = document.getElementById('modal-teams');
  modalTeams.innerHTML = '';
  teams.forEach((team, i) => {
    const btn = document.createElement('button');
    btn.textContent = team.name;
    btn.addEventListener('click', () => {
      teams[i].score += currentValue;
      renderTeams();
      closeModal();
    });
    modalTeams.appendChild(btn);
  });
}

document.getElementById('modal').addEventListener('click', function (e) {
  // Ignore clicks on team buttons
  if (e.target.closest('#modal-teams')) return;

  if (!showingAnswer) {
    document.getElementById('modal-text').textContent = currentTile.dataset.answer;
    showingAnswer = true;
  }
});

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  currentTile.classList.add('used');
}
