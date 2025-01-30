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


class Game {
    constructor() {
        this.diver = null;
        this.obstacles = [];
        this.timer = new Timer();
        this.gameInterval = null;
        this.bottleInterval = null;
        this.oxygenInterval = null;
        this.sharkInterval = null;

        //música
        this.introAudio = document.getElementById('intro-audio');
        this.gameAudio = document.getElementById('game-audio');
        this.endAudio = document.getElementById('end-audio');
    }

    start() {
        //música
        this.stopAllAudio();
        this.gameAudio.play();


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
        //música
        this.stopAllAudio();
        this.endAudio.play();

        clearInterval(this.gameInterval);
        clearInterval(this.bottleInterval);
        clearInterval(this.oxygenInterval);
        clearInterval(this.sharkInterval);
        this.timer.stop();

        document.querySelector('.game-container').style.display = 'none';
        document.getElementById('game-end').style.display = 'block';

        document.getElementById('end-message').textContent = `Your score: ${this.timer.getElapsedTime()} s`;
    }

    reset() {
        this.stopAllAudio();
        this.introAudio.play(); // Volver a la música de introducción

        document.getElementById('game-end').style.display = 'none';
        document.getElementById('game-intro').style.display = 'block';

        this.obstacles.forEach((obstacle) => {
            if (obstacle.element && obstacle.element.parentNode) {
                obstacle.element.parentNode.removeChild(obstacle.element);
            }
        });

        this.obstacles = [];
    }

    stopAllAudio() {
        this.introAudio.pause();
        this.introAudio.currentTime = 0;
        this.gameAudio.pause();
        this.gameAudio.currentTime = 0;
        this.endAudio.pause();
        this.endAudio.currentTime = 0;
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

    // Reproduce el audio de introducción
    game.introAudio.play();
}



initializeGame();
