const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const dynamicFooter = document.getElementById('dynamicFooter');

let isJumping = false;
let score = 0;
let obstacleMoveInterval;

document.addEventListener('keydown', jump);
initializeGame();

function initializeGame() {
  score = 0;
  dynamicFooter.innerText = 'Score: 0';
  createObstacle();
}

function jump(event) {
  if (event.code === 'Space' && !isJumping) {
    isJumping = true;
    player.style.transition = 'bottom 0.3s';
    player.style.bottom = '150px';

    setTimeout(() => {
      player.style.bottom = '0';
      setTimeout(() => {
        isJumping = false;
      }, 300);
    }, 500);
  }
}

function updateScore() {
  score++;
  dynamicFooter.innerText = 'Score: ' + score;
}

function endGame() {
  alert('Game Over! Your Score: ' + score);
  clearInterval(obstacleMoveInterval);
  gameContainer.innerHTML = ''; 
  initializeGame();
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = '400px';
  gameContainer.appendChild(obstacle);

  obstacleMoveInterval = setInterval(() => {
    const playerBottom = parseInt(player.style.bottom);
    const playerLeft = parseInt(player.style.left);
    const obstacleLeft = parseInt(obstacle.style.left);
    const obstacleBottom = parseInt(obstacle.style.bottom);

    // Check for collision
    if (
      playerLeft < obstacleLeft + 30 &&
      playerLeft + 50 > obstacleLeft &&
      playerBottom < obstacleBottom + 30
    ) {
      endGame();
      return;
    }

    // Move the obstacle
    obstacle.style.left = obstacleLeft - 5 + 'px';

    // Check if obstacle is off the screen
    if (obstacleLeft < 0) {
      gameContainer.removeChild(obstacle);
      createObstacle();
      updateScore();
    }
  }, 20);
}
