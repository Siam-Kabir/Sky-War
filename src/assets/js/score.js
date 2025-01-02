let currentScore = 0;

export function incrementScore(points) {
    console.log('Incrementing score by:', points);
    if (isNaN(points)) {
        console.error('Invalid points:', points); // Debugging log
    }
    currentScore += points;
    updateScoreDisplay();
}


export function resetScore() {
    currentScore = 0;
    updateScoreDisplay();
}

export function getCurrentScore() {
    return currentScore;
}

function updateScoreDisplay() {
    const scoreValueElement = document.getElementById('scoreValue');
    if (scoreValueElement) {
        scoreValueElement.textContent = currentScore;
    }
}

export function drawScore(ctx) {
    updateScoreDisplay();
}