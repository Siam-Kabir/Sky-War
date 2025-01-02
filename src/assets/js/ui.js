import { startGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    fetch('src/assets/html/ui.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('gameUI').innerHTML = data;

            const startButton = document.getElementById('startButton');
            if (startButton) {
                startButton.addEventListener('click', () => {
                    const uiContainer = document.getElementById('uiContainer');
                    if (uiContainer) {
                        uiContainer.style.display = 'none';
                    }

                    // Show the game canvas and score container
                    const gameCanvas = document.getElementById('gameCanvas');
                    const scoreContainer = document.getElementById('scoreContainer');
                    if (gameCanvas && scoreContainer) {
                        gameCanvas.classList.remove('hidden');
                        scoreContainer.classList.remove('hidden');
                    }

                    // Initialize the game
                    startGame();
                });

                // Ensure the start button is displayed after it is loaded
                startButton.style.display = 'block';
            } else {
                console.error('Start button not found');
            }
        })
        .catch(error => console.error('Error loading UI:', error));
});