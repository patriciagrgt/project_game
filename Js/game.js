class Timer {
    constructor() {
        this.time = 0;
        this.intervalId = null;
        this.timerElement = document.getElementById('timer');
        this.timerElement.style.position = 'absolute';
        this.timerElement.style.top = '10px';
        this.timerElement.style.right = '20px';
        this.updateDisplay();
    }

    start() {
        this.time = 0;
        this.updateDisplay();
        this.intervalId = setInterval(() => {
            this.time++;
            this.updateDisplay();
        }, 1000);
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    getElapsedTime() {
        return this.time;
    }

    updateDisplay() {
        this.timerElement.textContent = `Time: ${this.time}s`;
    }
}


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


class Game {
    constructor() {
        this.diver = null;
        this.obstacles = [];
        this.timer = new Timer();
        this.gameInterval = null;
        this.bottleInterval = null;
        this.oxygenInterval = null;
        this.sharkInterval = null;
    }

    start() {
        document.getElementById('game-intro').style.display = 'none';
        document.querySelector('.game-container').style.display = 'block';
        document.getElementById('game-end').style.display = 'none';
        this.diver = new Diver();
        this.obstacles = [];
        this.timer.start();

    
        this.gameInterval = setInterval(() => {
            this.obstacles.forEach((obstacle, index) => {
                obstacle.move();
                obstacle.checkCollision(this.diver);
                if (!document.body.contains(obstacle.element)) {
                    this.obstacles.splice(index, 1);
                }
            });

            this.diver.updateLife(-0.5);
        }, 50);

        
        this.bottleInterval = setInterval(() => {
            const bottle = new Obstacle('bottle', 800);
            this.obstacles.push(bottle);
        }, 2000);

        this.oxygenInterval = setInterval(() => {
            const oxygen = new Obstacle('oxygen', 800);
            this.obstacles.push(oxygen);
        }, 7000);

        this.sharkInterval = setInterval(() => {
            const shark = new Obstacle('obstacle', 800);
            this.obstacles.push(shark);
        }, 4000);
    }

    end(win) {
        clearInterval(this.gameInterval);
        clearInterval(this.bottleInterval);
        clearInterval(this.oxygenInterval);
        clearInterval(this.sharkInterval);
        this.timer.stop();

        document.querySelector('.game-container').style.display = 'none';
        document.getElementById('game-end').style.display = 'block';

        document.getElementById('end-message').textContent = `Your score: ${this.timer.getElapsedTime()} s!`;
    }

    reset() {
        document.getElementById('game-end').style.display = 'none';
        document.getElementById('game-intro').style.display = 'block';

        this.obstacles.forEach((obstacle) => {
            if (obstacle.element && obstacle.element.parentNode) {
                obstacle.element.parentNode.removeChild(obstacle.element);
            }
        });

        this.obstacles = [];
    }
}


let game = new Game();


document.getElementById('start-button').addEventListener('click', () => game.start());
document.getElementById('restart-button').addEventListener('click', () => {
    game.reset();
    game = new Game();
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') game.diver.move(true);
    if (e.key === 'ArrowDown') game.diver.move(false);
});


function initializeGame() {
    document.getElementById('game-intro').style.display = 'block';
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('game-end').style.display = 'none';
    document.getElementById('timer').textContent = 'Time: 0s';
}

initializeGame();