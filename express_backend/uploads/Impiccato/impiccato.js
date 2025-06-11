// Initial References
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");

// Canvas Context
const context = canvas.getContext("2d");

// Words and Categories
const options = {
    Animali: ["GATTO", "CANE", "ELEFANTE", "LEONE", "ZEBRA", "CANGURO", "FENICE", "CRICETO", "TRICHECO", "CAVALLO", "FALCO", "TIGRE"],
    Colori: ["ROSSO", "VERDE", "BLU", "GIALLO", "VIOLA", "ARANCIONE", "BIANCO", "NERO", "MARRONE", "GRIGIO", "ROSA", "LILLA"],
    Paesi: ["ITALIA", "FRANCIA", "SPAGNA", "GERMANIA", "BRASILE", "CINA", "GIAPPONE", "STATI UNITI D'AMERICA", "RUSSIA", "CANADA", "AUSTRALIA", "INGHILTERRA", "COREA DEL SUD"],
    Frutta: ["MELA", "BANANA", "PESCA", "ANANAS", "KIWI", "CILIEGIA", "POMPELMO", "LIMONE", "UVA", "PERE", "MIRTILLI", "FRAGOLA"],
    Sport: ["CALCIO", "BASKET", "TENNIS", "PALLAVOLO", "CICLISMO", "NUOTO", "RUGBY", "GOLF", "ATLETICA", "BOXE", "PATTINAGGIO", "SCI"],
};

let chosenWord = "";
let mistakes = 0;
let maxMistakes = 6;

// Initialize Game
const initializeGame = () => {
    optionsContainer.innerHTML = "";
    letterContainer.innerHTML = "";
    userInputSection.innerHTML = "";
    resultText.innerHTML = "";
    newGameContainer.classList.add("hide");
    mistakes = 0;

    // Draw initial canvas
    drawCanvas();

    // Create category buttons
    for (let category in options) {
        const button = document.createElement("button");
        button.innerText = category;
        button.onclick = () => startGame(category);
        optionsContainer.appendChild(button);
    }
};

// Start Game
const startGame = (category) => {
    // Disabilita tutti i pulsanti delle categorie
    const categoryButtons = document.querySelectorAll("#options-container button");
    categoryButtons.forEach((button) => {
        button.disabled = true;
        button.classList.add("disabled");
    });

    letterContainer.classList.remove("hide");

    // Scegli una parola casuale
    const words = options[category];
    chosenWord = words[Math.floor(Math.random() * words.length)];

    // Mostra i trattini per la parola
    userInputSection.innerHTML = chosenWord
        .split("")
        .map(() => "_")
        .join(" ");

    // Layout alfabetico e responsivo
    letterContainer.innerHTML = ""; // Pulisce eventuali lettere precedenti
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const gridDiv = document.createElement("div");
    gridDiv.classList.add("letter-grid");
    alphabet.split("").forEach((letter) => {
        const button = document.createElement("button");
        button.innerText = letter;
        button.onclick = () => handleGuess(button);
        gridDiv.appendChild(button);
    });
    letterContainer.appendChild(gridDiv);
};

// Handle Guess
const handleGuess = (button) => {
    const letter = button.innerText;
    button.disabled = true;

    if (chosenWord.includes(letter)) {
        const wordArray = userInputSection.innerText.split(" ");
        chosenWord.split("").forEach((char, index) => {
            if (char === letter) {
                wordArray[index] = char;
            }
        });
        userInputSection.innerText = wordArray.join(" ");

        if (!wordArray.includes("_")) {
            resultText.innerHTML = `<h2 class="win-msg">Hai vinto!</h2>`;
            newGameContainer.classList.remove("hide");
        }
    } else {
        mistakes++;
        drawHangman(mistakes);

        if (mistakes === maxMistakes) {
            resultText.innerHTML = `<h2 class="lose-msg">Hai perso!</h2><p>La parola era: <span>${chosenWord}</span></p>`;
            newGameContainer.classList.remove("hide");
        }
    }
};

// Draw Canvas
const drawCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height); // Pulisce il canvas
    context.lineWidth = 2;
    context.strokeStyle = "#000";

    // Base
    context.beginPath();
    context.moveTo(10, 130); // Punto iniziale della base
    context.lineTo(130, 130); // Punto finale della base
    context.stroke();

    // Palo verticale
    context.beginPath();
    context.moveTo(70, 130); // Punto iniziale del palo verticale
    context.lineTo(70, 10); // Punto finale del palo verticale
    context.stroke();

    // Palo orizzontale
    context.beginPath();
    context.moveTo(70, 10); // Punto iniziale del palo orizzontale
    context.lineTo(120, 10); // Punto finale del palo orizzontale
    context.stroke();

    // Corda
    context.beginPath();
    context.moveTo(120, 10); // Punto iniziale della corda
    context.lineTo(120, 20); // Punto finale della corda
    context.stroke();
};

// Draw Hangman
const drawHangman = (mistakes) => {
    switch (mistakes) {
        case 1: // Testa
            context.beginPath();
            context.arc(120, 30, 10, 0, Math.PI * 2); // Testa centrata sotto la corda
            context.stroke();
            break;
        case 2: // Corpo
            context.beginPath();
            context.moveTo(120, 40); // Inizio del corpo sotto la testa
            context.lineTo(120, 80); // Fine del corpo
            context.stroke();
            break;
        case 3: // Braccio sinistro
            context.beginPath();
            context.moveTo(120, 50); // Punto di partenza del braccio sinistro
            context.lineTo(100, 70); // Punto finale del braccio sinistro
            context.stroke();
            break;
        case 4: // Braccio destro
            context.beginPath();
            context.moveTo(120, 50); // Punto di partenza del braccio destro
            context.lineTo(140, 70); // Punto finale del braccio destro
            context.stroke();
            break;
        case 5: // Gamba sinistra
            context.beginPath();
            context.moveTo(120, 80); // Punto di partenza della gamba sinistra
            context.lineTo(100, 110); // Punto finale della gamba sinistra
            context.stroke();
            break;
        case 6: // Gamba destra
            context.beginPath();
            context.moveTo(120, 80); // Punto di partenza della gamba destra
            context.lineTo(140, 110); // Punto finale della gamba destra
            context.stroke();
            break;
    }
};

// New Game
newGameButton.onclick = initializeGame;

// Initialize Game on Load
window.onload = initializeGame;