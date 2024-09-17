//Variables
const gridContainer = document.querySelector('.grid-container');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

//Game logic
document.querySelector(".score").textContent = score;
fetch("./data/cards.json")
    .then(res => res.json())
    .then(data => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });
function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for(let cards of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", "card.name");
        //not completed...
    }
}

//Game menu
function playGame() {
    window.location.href = 'game.html';
}

function showInstructions() {
    window.location.href = 'instructions.html';
}

function showHighscore() {
    window.location.href = 'highscores.html';
}

function quitGame() {
    setContent('Exiting Game...');

    //Attempt to close the window after displaying the exit message
    setTimeout(() => {
        window.close();
    }, 2000); // Adds a delay of 2 second before closing the window.
}

function setContent(text) {
    const menu = document.getElementById('menu');
    const content = document.getElementById('content');

    content.innerHTML = `<p>${text}</p>`;
    menu.style.display = 'none';
    content.style.display = 'block';
}

