//Variables
const gridContainer = document.querySelector('.grid-container');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let totalCards = 20;
let matchedCards = 0;
let highScores = [];
let loggedInUser = null; // Login functionality

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

// Function to hash the password using SHA-256 (CryptoJS)
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

// Function to create and store a new user
function createUser(username, password) {
    const hashedPassword = hashPassword(password);
    const users = JSON.parse(localStorage.getItem('users')) || {}; // Fetch existing users or create an empty object
    users[username] = hashedPassword; // Store the new user's hashed password
    localStorage.setItem('users', JSON.stringify(users)); // Save back to localStorage
    console.log("User created and stored!");
}

// Function to validate login
function validateLogin(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || {}; // Fetch stored users
    const hashedPassword = hashPassword(password);


    if (users[username] && users[username] === hashedPassword) {
        console.log("Login successful via local storage");
        loggedInUser = username;
        loginSuccess();
        sendLoginRequest(username, hashedPassword);
    } else {
        console.log("Local login failed, sending login request to server...");
        loginFailure("Invalid username or password");
        sendLoginRequest(username, hashedPassword);
    }
}

//Adding a hardcoded user to Local Storage
createUser('hacker', '123'); // Hardcoded user: hacker, password: 123

// Function to send login request to the web service
function sendLoginRequest(username, hashedPassword) {
    const url = 'https://www.kihlman.eu/formcheck.php'; // Web service URL

    // Sending login request using fetch API
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Form URL encoding
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(hashedPassword)}` // Send form data
    })
        .then(response => response.text()) // Expect plain text response
        .then(data => {
            console.log("Server response:", data); // Logging the server response

            if (data === 'OK') { // The web service returns "OK" if successful
                console.log("Login successful via server.");
                loginSuccess(); // Call the success function when login is OK
            } else {
                loginFailure('Invalid username or password from web service');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loginFailure('Login request failed');
        });
}

// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate the user login
    validateLogin(username, password);
});

// Login success and failure handlers
function loginSuccess() {
    console.log("Login Success!"); // Log success message
    document.getElementById('login').classList.remove('active');
    showPage('menu'); // Redirect to menu or game page
}

function loginFailure(message) {
    console.log("Login Failure: ", message); // Log failure message
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.textContent = message;
    loginMessage.style.color = 'red';
}

//Game logic
document.querySelector(".score").textContent = score;
cards = [...cardData, ...cardData];
shuffleCards();
generateCards();

//Function to shuffle cards
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

//Function to generate cards
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

//Function to flip the cards
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if(!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

// Function to check if the cards that has been flipped are matched
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        disableCards();
        cardMatched();
    }
    else {
        unflipCards();
    }

}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
}

function unflipCards() {
    score++;
    document.querySelector(".score").textContent = score;
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

// Function to restart the game
function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}
// Saves the highscore
function saveScore(score) {
    const userScore = {username: loggedInUser, score: score};
    highScores.push(userScore);
    highScores.sort((a, b) => a.score - b.score);

    if (highScores.length > 5) {
        highScores = highScores.slice(0, 5);
    }
    displayHighScores();
}

// Displays the highscores in the 'highscore'-page
function displayHighScores() {

    const highscoreTableBody = document.querySelector('#highscore tbody');
    highscoreTableBody.innerHTML = '';


    // Iterates over the highscore list and displays them
    highScores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${score.username}</td>
            <td>${score.score}</td>
        `;
        highscoreTableBody.appendChild(row);

    });
}

//Game menu
function cardMatched() {
    matchedCards += 2;  // Every matching contains two cards

    // checks if all cards are matched
    if (matchedCards === totalCards) {
        gameOver();  // Ends the game if all the cards have been matched
    }
}

function gameOver() {
    setTimeout(() => {
        alert('Congratulations! You matched all the cards. Your score is: ' + score);
        saveScore(score);  // Saves the players highscore
        displayHighScores();
        matchedCards = 0;  // Resetts the matched cards for the next game.
        score = 0;  // resets the highscore for the next game
    }, 500);
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    // Show the selected page
    document.getElementById(pageId).style.display = 'block';
    if (pageId === 'highscore') {
        displayHighScores();
    }
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