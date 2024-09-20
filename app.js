//Variables
const gridContainer = document.querySelector('.grid-container');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

//Card data
const cardData = [
    {name: 'card1', emoji: '🐶'},
    {name: 'card2', emoji: '🐱'},
    {name: 'card3', emoji: '🐰'},
    {name: 'card4', emoji: '🦁'},
    {name: 'card5', emoji: '🐨'},
    {name: 'card6', emoji: '🦄'},
    {name: 'card7', emoji: '🦉'},
    {name: 'card8', emoji: '🐻'},
    {name: 'card9', emoji: '🦒'},
    {name: 'card10', emoji: '🦓'}
];

//Game logic
document.querySelector(".score").textContent = score;
cards = [...cardData, ...cardData];
shuffleCards();
generateCards();


function shuffleCards() {
    let currentIndex = cards.length, randomIndex, temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    gridContainer.innerHTML = ''; // Clear existing cards
    cards.forEach(card => {
        console.log('Creating card:', card); // Debugging line
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <div class="front-content">${card.emoji}</div> <!-- Use emoji -->
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if(!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}




function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    // Show the selected page
    document.getElementById(pageId).style.display = 'block';
}
/*
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
}
*/

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

