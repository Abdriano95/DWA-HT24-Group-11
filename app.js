//Game menu
function playGame() {
    setContent('Game Starting...');
}

function showInstructions() {
    setContent('Instructions shown here');
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

