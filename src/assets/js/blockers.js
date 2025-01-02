import { boundingBoxCollision } from './collision.js';
class Block {
    constructor(x, y, health, image) {
        this.x = x;
        this.y = y;
        this.width = 110;
        this.height = 110;
        this.health = health;
        this.initialHealth = health; // Store the initial health

        this.image = image;
        this.velocity = 0.4; // Initial velocity
    }

    update() {
        this.y += this.velocity; // Move downwards
        this.velocity += 0.001; // Increase velocity over time
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        // Set shadow properties
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = 'white';
        ctx.font = '20px "Press Start 2P", Arial'; // Use the custom font
        ctx.fillText(this.health, this.x + this.width / 2 - 5, this.y + this.height / 2 + 5);

        // Reset shadow properties to avoid affecting other drawings
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }


    isDestroyed() {
        return this.health <= 0;
    }
}

export default Block;

let blocks = [];
const asteroidImages = [];

// Load asteroid images
function loadAsteroidImages(callback) {
    const imagePaths = [
        'src/assets/images/Asteroid/asteroid1.png',
        'src/assets/images/Asteroid/asteroid2.png',
        'src/assets/images/Asteroid/asteroid3.png'
    ];

    let loadedImages = 0;

    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            loadedImages++;
            console.log(`Loaded image: ${path}`);
            if (loadedImages === imagePaths.length) {
                callback();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            loadedImages++;
            if (loadedImages === imagePaths.length) {
                callback();
            }
        };
        asteroidImages.push(img);
    });
}

function getRandomAsteroidImage() {
    const randomIndex = Math.floor(Math.random() * asteroidImages.length);
    return asteroidImages[randomIndex];
}

function spawnBlocks(canvas, blocksToSpawn, blockHealth) {
    const blockSpacing = 60; // Space between blocks
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    for (let i = 0; i < blocksToSpawn; i++) {
        const x = Math.random() * (canvasWidth - blockSpacing); // Random x position
        const y = Math.random() * -canvasHeight - 100; // Random y position above the canvas, ensuring it starts off-screen
        const image = getRandomAsteroidImage(); // Get a random asteroid image
        blocks.push(new Block(x, y, blockHealth, image));
        console.log(`Spawned block at (${x}, ${y})`);
    }
}

function updateBlocks(ctx, canvas) {
    const canvasHeight = canvas.height;
    blocks = blocks.filter(block => !block.isDestroyed() && block.y < canvasHeight);
    blocks.forEach(block => {
        block.update();
        block.draw(ctx);
    });
}

export { loadAsteroidImages, spawnBlocks, updateBlocks, blocks };