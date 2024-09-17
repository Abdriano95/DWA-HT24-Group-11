//Game menu
function playGame() {
    window.location.href = 'game.html';
}

function showInstructions() {
    window.location.href = 'instructions.html';
}

function showHighscore() {
    setContent('Highscore...');
}

function quitGame() {
    setContent('Exiting Game...');
}

function setContent(text) {
    const menu = document.getElementById('menu');
    const content = document.getElementById('content');

    content.innerHTML = `<p>${text}</p>`;
    menu.style.display = 'none';
    content.style.display = 'block';
}

