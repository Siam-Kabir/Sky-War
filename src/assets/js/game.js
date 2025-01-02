import { incrementScore, resetScore, drawScore } from './score.js';

import { fireBullet, updateBullets } from './firing.js';
import { loadAsteroidImages, spawnBlocks, updateBlocks, blocks } from './blockers.js';
import { boundingBoxCollision } from './collision.js';
// import { loadUI } from './ui.js';

class Jet {
    constructor(canvasWidth, canvasHeight) {
        this.width = 80;
        this.height = 120;
        this.x = canvasWidth / 2 - this.width / 2;
        this.y = canvasHeight - this.height - 10;
        this.speed = 5;
        this.image = new Image();
        this.image.src = 'src/assets/images/jett.png';
        this.image.onload = () => {
            console.log('Jet image loaded');
        };
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        console.log(`Drawing jet at (${this.x}, ${this.y})`);
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }
}

let canvas, ctx;
let jet;
let keys = {};
let bulletInterval = 500; // Start with a slower firing rate
let bulletFiringInterval;
let blocksToSpawn = 2; // Start with a low number of blocks
let blockHealth = 1; // Start with low health
let gameOver = false; // Game over flag
let paused = false;
let animationFrameId;
export function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas size based on window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log(`Canvas size set to (${canvas.width}, ${canvas.height})`);

    jet = new Jet(canvas.width, canvas.height);
    loadAsteroidImages(() => {
        spawnBlocks(canvas, blocksToSpawn, blockHealth);
        gameLoop();
    });
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    const maxBlocks = 20; // Set the maximum number of blocks

    // Auto fire bullets at the initial interval
    bulletFiringInterval = setInterval(() => fireBullet(jet), bulletInterval);
    
    // Periodically spawn new blocks
    setInterval(() => {
        if (blocks.length < maxBlocks) {
            spawnBlocks(canvas, blocksToSpawn, blockHealth);
        }
    }, 5000);
    
    // Increase the number of blocks to spawn every 10 seconds
    setInterval(() => {
        if (blocks.length + blocksToSpawn <= maxBlocks) {
            blocksToSpawn++;
        }
    }, 10000);
    
    // Increase the health of blocks every 15 seconds
    setInterval(() => blockHealth++, 15000);
    
    // Decrease the bullet firing interval every 10 seconds
    setInterval(() => {
        if (bulletInterval > 100) { // Set a minimum interval limit
            bulletInterval -= 50; // Decrease the interval by 50ms
            clearInterval(bulletFiringInterval);
            bulletFiringInterval = setInterval(() => fireBullet(jet), bulletInterval);
        }
    }, 10000);

    // Move jet directly under touch
    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        jet.x = x - jet.width / 2;

        // Prevent jet from going off-screen
        if (jet.x < 0) jet.x = 0;
        if (jet.x > canvas.width - jet.width) {
            jet.x = canvas.width - jet.width;
        }
    });
}

function keyDownHandler(e) {
    keys[e.key] = true;
}

function keyUpHandler(e) {
    keys[e.key] = false;
}


function handleJetMovement() {
    if (keys['ArrowLeft'] && jet.x > 0) {
        jet.moveLeft();
    }
    if (keys['ArrowRight'] && jet.x < canvas.width - jet.width) {
        jet.moveRight();
    }
}

function displayGameOver() {
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('scoreContainer').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';

    const finalScore = document.getElementById('finalScoreValue');
    finalScore.textContent = document.getElementById('scoreValue').textContent; // Display final score
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function resetGame() {
    // Stop the game loop
    gameOver = false;
    
    // Reset game variables
    keys = {};
    bulletInterval = 500; // Reset firing rate
    blocksToSpawn = 2; // Reset initial block spawn
    blockHealth = 1; // Reset initial block health
    blocks.length = 0; // Clear all blocks

    // Clear intervals
    clearInterval(bulletFiringInterval);
    const intervalId = window.setInterval(() => {}, 9999); // Dummy interval to get max ID
    for (let i = 0; i < intervalId; i++) {
        clearInterval(i);
    }

    // Reset UI
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('scoreContainer').style.display = 'block';

    // Reset score
    resetScore();
    backgroundMusic.play();
    // Restart the game
    init();
    console.log('Game successfully reset!');
}



function gameLoop() {
    if (gameOver) {
        displayGameOver();
        return; // Stop the game loop
    }
    if (paused) {
        return; // Stop the game loop if game is over or paused
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleJetMovement();
    updateBullets(ctx, blocks); // Ensure this is called
    updateBlocks(ctx, canvas); // Ensure this is called
    drawScore(ctx); // Draw the score

    // Check for collisions
    blocks.forEach(block => {
        if (boundingBoxCollision(block, jet)) {
            // Play explosion sound
            const explosionSound = document.getElementById('explosionSound');
            if (explosionSound) {
                explosionSound.play();
            }

            gameOver = true;
            console.log('Game Over');
        }
    });

    jet.draw(ctx); // Draw the jet last to ensure it's on top
    requestAnimationFrame(gameLoop);
}
async function loadUI() {
    const response = await fetch('src/assets/html/ui.html');
    const data = await response.text();
    document.getElementById('gameUI').innerHTML = data;
}
export async function startGame() {
    // document.getElementById('startButton').style.display = 'none';
    document.getElementById('uiContainer').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';

    // Ensure score container is visible
    const scoreContainer = document.getElementById('scoreContainer');
    if (scoreContainer) {
        scoreContainer.style.display = 'block';
    }
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.1;
        backgroundMusic.play();
    }
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.classList.remove('hidden');
    }
    resetScore(); // Reset the score at the start of the game
    init();
}
function togglePause() {
    paused = !paused;
    const pauseIcon = document.getElementById('pauseIcon');
    const resumeIcon = document.getElementById('resumeIcon');
    if (paused) {
        cancelAnimationFrame(animationFrameId); // Cancel the current animation frame request
        if (pauseIcon) pauseIcon.classList.add('hidden');
        if (resumeIcon) resumeIcon.classList.remove('hidden');
    } else {
        gameLoop(); // Resume the game loop if unpaused
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        if (resumeIcon) resumeIcon.classList.add('hidden');
    }
}
window.onload = async () => {
    await loadUI(); // Load UI on page load
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('retryButton').addEventListener('click', resetGame);
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.addEventListener('click', togglePause);
    }
};