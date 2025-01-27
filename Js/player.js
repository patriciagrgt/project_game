const player = document.getElementById('player');
let playerSpeed = 5;

function movePlayer(event) {
    let top = parseInt(player.style.top) || window.innerHeight / 2;

    if (event.key === 'ArrowUp' && top > 0) top -= playerSpeed;
    if (event.key === 'ArrowDown' && top < window.innerHeight - 50) top += playerSpeed;

    player.style.top = top + 'px';
}
window.addEventListener('keydown', movePlayer);