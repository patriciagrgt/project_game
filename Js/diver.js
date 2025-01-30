class Diver {
    constructor() {
        this.element = document.getElementById('player');
        this.position = 50;
        this.lives = 2;
        this.lifeBar = document.getElementById('life-fill');
        this.lifePercent = 100;
        this.updateLivesDisplay();
    }

    move(up) {
        if (!up) {
            this.position = Math.max(0, this.position - 10);
        } else {
            this.position = Math.min(70, this.position + 10);
        }
        this.element.style.bottom = `${this.position}%`;
    }

    updateLife(change) {
        this.lifePercent = Math.max(0, Math.min(100, this.lifePercent + change));
        this.lifeBar.style.width = `${this.lifePercent}%`;

        if (this.lifePercent === 0) {
            this.loseLife();
        }
    }

    loseLife() {
        this.lives -= 1;
        this.updateLivesDisplay();
        if (this.lives === 0) {
            game.end(false);
        } else {
            this.lifePercent = 100;
            this.lifeBar.style.width = '100%';
        }
    }

    updateLivesDisplay() {
        const livesContainer = document.getElementById('lives');
        livesContainer.innerHTML = '';
        const maxLives = 5;
        for (let i = 0; i < Math.min(this.lives, maxLives); i++) {
            const life = document.createElement('div');
            life.classList.add('life');
            livesContainer.appendChild(life);
        }
    }
}