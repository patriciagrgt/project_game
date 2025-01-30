class Obstacle {
    constructor(type, xPosition) {
        this.element = document.createElement('div');
        this.element.classList.add(type);
        const screenWidth = document.getElementById('game-area').offsetWidth;
        this.element.style.left = `${screenWidth}px`;
        this.element.style.bottom = `${Math.random() * 80 }%`;
        document.getElementById('game-area').appendChild(this.element);
        this.type = type;
    }

    move() {
        const currentLeft = parseInt(this.element.style.left);
        this.element.style.left = `${currentLeft - 8}px`;
        if (currentLeft < -50) {
            this.element.remove();
        }
    }

    checkCollision(diver) {
        const diverRect = diver.element.getBoundingClientRect();
        const obstacleRect = this.element.getBoundingClientRect();

        if (
            diverRect.left < obstacleRect.right &&
            diverRect.right > obstacleRect.left &&
            diverRect.top < obstacleRect.bottom &&
            diverRect.bottom > obstacleRect.top
        ) {
            this.element.remove();
            if (this.type === 'bottle') {
                diver.updateLife(20);
            } else if (this.type === 'oxygen') {
                diver.lives += 1;
                diver.updateLivesDisplay();
            } else if (this.type === 'obstacle') {
                game.end(false);
            }
        }
    }
}