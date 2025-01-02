import { incrementScore } from './score.js';

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
    }

    update() {
        this.y -= 5; // Move upwards
    }

    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y < 0;
    }

    collidesWith(block) {
        return this.x < block.x + block.width &&
               this.x + this.width > block.x &&
               this.y < block.y + block.height &&
               this.y + this.height > block.y;
    }
}

let bullets = [];

function fireBullet(jet) {
    const bullet = new Bullet(jet.x + jet.width / 2 - 2.5, jet.y);
    bullets.push(bullet);
}

function updateBullets(ctx, blocks) {
    bullets = bullets.filter(bullet => !bullet.isOffScreen());
    bullets.forEach((bullet, bulletIndex) => {
        bullet.update();
        bullet.draw(ctx);
        blocks.forEach((block, blockIndex) => {
            if (bullet.collidesWith(block)) {
                const hitSound = document.getElementById('hitSound');
                if (hitSound) {
                    hitSound.playbackRate = 6; // Set playback rate to 2x
    
                    hitSound.play();
                }
                bullets.splice(bulletIndex, 1); // Remove bullet on hit
                
                block.health -= 1;

                if (block.health <= 0) {
                    incrementScore(block.initialHealth); // Increment score by block's initial health
                    blocks.splice(blockIndex, 1); // Remove block if health is 0 or less
                }
            }
        });
    });
}

export { fireBullet, updateBullets };