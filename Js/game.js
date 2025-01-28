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
            this.position = Math.min(90, this.position + 10);
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
            endGame(false);
        } else {
            this.lifePercent = 100;
            this.lifeBar.style.width = '100%';
        }
    }

    updateLivesDisplay() {
        const livesContainer = document.getElementById('lives');
        livesContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const life = document.createElement('div');
            life.classList.add('life');
            livesContainer.appendChild(life);
        }
    }
}

class Obstacle {
    constructor(type, xPosition) {
        this.element = document.createElement('div');
        this.element.classList.add(type);
        this.element.style.left = `${xPosition}px`;
        this.element.style.bottom = `${Math.random() * 90}%`;
        document.getElementById('game-area').appendChild(this.element);
        this.type = type;
    }

    move() {
        const currentLeft = parseInt(this.element.style.left);
        this.element.style.left = `${currentLeft - 4}px`;
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
                endGame(false);
            }
        }
    }
}

let diver;
let obstacles = [];
let gameInterval;
let bottleInterval, oxygenInterval, sharkInterval;

function startGame() {
    document.getElementById('game-intro').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('game-end').style.display = 'none';
    diver = new Diver();

    
    gameInterval = setInterval(() => {
        obstacles.forEach((obstacle, index) => {
            obstacle.move();
            obstacle.checkCollision(diver);
            if (!document.body.contains(obstacle.element)) {
                obstacles.splice(index, 1);
            }
        });

        diver.updateLife(-0.5);
    }, 50);

    
    bottleInterval = setInterval(() => {
        const bottle = new Obstacle('bottle', 800);
        obstacles.push(bottle);
    }, 1000);

   
    oxygenInterval = setInterval(() => {
        const oxygen = new Obstacle('oxygen', 800);
        obstacles.push(oxygen);
    }, 5000);

   
    sharkInterval = setInterval(() => {
        const shark = new Obstacle('obstacle', 800);
        obstacles.push(shark);
    }, 3000);
}

function endGame(win) {
    clearInterval(gameInterval);
    clearInterval(bottleInterval);
    clearInterval(oxygenInterval);
    clearInterval(sharkInterval);
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('game-end').style.display = 'block';
    document.getElementById('end-message').textContent = win ? 'You Win!' : 'Game Over';
}

function initializeGame() {
    document.getElementById('game-intro').style.display = 'block';
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('game-end').style.display = 'none';
}

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('game-end').style.display = 'none';
    document.getElementById('game-intro').style.display = 'block';
    obstacles = [];
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') diver.move(true);
    if (e.key === 'ArrowDown') diver.move(false);
});

initializeGame();