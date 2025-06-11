const emojis = ["😍", "😍", "😂", "😂", "😭", "😭","😡","😡","😨","😨","😎","😎","🤡","🤡","😈","😈"];
let shuf_emojis = emojis.sort(() => (Math.random() > 0.5) ? 2 : -1);

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

const gameContainer = document.querySelector('.game');
const scoreDisplay = document.createElement('div');
scoreDisplay.className = 'score';
scoreDisplay.innerHTML = `Score: ${score}`;
gameContainer.parentNode.insertBefore(scoreDisplay, gameContainer);

function updateScore(points) {
    score = score + points
    scoreDisplay.innerHTML = `Score: ${score}`;
}

for (let i = 0; i < emojis.length; i++) {
    let box = document.createElement("div");
    box.className = 'item';
    box.innerHTML = shuf_emojis[i];

    box.onclick = function () {
        if (lockBoard || this.classList.contains('boxOpen') || this.classList.contains('boxMatch')) return;

        this.classList.add('boxOpen');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        setTimeout(() => {
            if (firstCard.innerHTML === secondCard.innerHTML) {
                firstCard.classList.add('boxMatch');
                secondCard.classList.add('boxMatch');
                updateScore(20); 
            } else {
                updateScore(-10);
            }

            firstCard.classList.remove('boxOpen');
            secondCard.classList.remove('boxOpen');

            if (firstCard.innerHTML === secondCard.innerHTML) {
                // le carte combaciano: rimangono aperte
                firstCard.classList.remove('boxOpen');
                secondCard.classList.remove('boxOpen');
            }

            firstCard = null;
            secondCard = null;
            lockBoard = false;

            if (document.querySelectorAll('.boxMatch').length === emojis.length) {
                alert(`Hai vinto! Punteggio finale: ${score}`);
                window.parent.postMessage({ type: 'submitScore', score: score }, '*');
            }
        }, 500);
    };

    document.querySelector('.game').appendChild(box);
}