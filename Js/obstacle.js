class Obstacle {
    constructor(type, xPosition, gameTime) {
        this.element = document.createElement('div');
        this.element.classList.add(type);
        const screenWidth = document.getElementById('game-area').offsetWidth; // Obtener el ancho del área de juego.
        this.element.style.left = `${screenWidth}px`; // Asegúrate de que siempre esté fuera del margen derecho.
        this.element.style.bottom = `${Math.random() * 70 + 10}%`;
        document.getElementById('game-area').appendChild(this.element);
        this.type = type;
        this.speed = this.calculateSpeed(gameTime); // Velocidad inicial basada en el tiempo del juego
    }

    calculateSpeed(gameTime) {
        return 10 + Math.floor(gameTime / 10); // Incrementar velocidad cada 10 segundos
    }

    move(gameTime) {
        this.speed = this.calculateSpeed(gameTime); // Actualizar velocidad según el tiempo
        const currentLeft = parseInt(this.element.style.left);
        this.element.style.left = `${currentLeft - this.speed}px`;
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
                diver.lives = Math.min(5, diver.lives + 1); // Límite de 5 vidas
                diver.updateLivesDisplay();
            } else if (this.type === 'obstacle') {
                game.end(false);
            }
        }
    }
}