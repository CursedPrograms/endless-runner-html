// Endless Runner: jump the blocks. Space, up arrow, or tap / click to jump.

const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

const GRAVITY = 0.9;          // px per frame per frame
const JUMP_SPEED = 15;        // px per frame, upwards
const START_SPEED = 4;        // obstacle speed, px per frame
const MAX_SPEED = 11;

let playerY = 0;              // height above the ground
let velocity = 0;
let obstacles = [];
let speed = START_SPEED;
let score = 0;
let best = 0;
let running = false;
let nextObstacleIn = 0;

function jump() {
  if (!running) {
    start();
    return;
  }
  if (playerY === 0) velocity = JUMP_SPEED;
}

function start() {
  obstacles.forEach((o) => o.el.remove());
  obstacles = [];
  playerY = 0;
  velocity = 0;
  speed = START_SPEED;
  score = 0;
  nextObstacleIn = 60;
  running = true;
  messageEl.hidden = true;
  updateScore();
  requestAnimationFrame(frame);
}

function spawnObstacle() {
  const el = document.createElement('div');
  el.className = 'obstacle';
  const tall = Math.random() < 0.3;
  el.style.height = tall ? '45px' : '30px';
  gameContainer.appendChild(el);
  obstacles.push({ el, x: gameContainer.clientWidth, width: 30, height: tall ? 45 : 30 });
  // the faster it goes, the more room between blocks
  nextObstacleIn = 55 + Math.floor(Math.random() * 60) + Math.floor(speed * 2);
}

function hits(o) {
  const px = player.offsetLeft, pw = player.offsetWidth;
  return px < o.x + o.width && px + pw > o.x && playerY < o.height;
}

function frame() {
  if (!running) return;

  velocity -= GRAVITY;
  playerY = Math.max(0, playerY + velocity);
  if (playerY === 0) velocity = 0;
  player.style.bottom = playerY + 'px';

  if (--nextObstacleIn <= 0) spawnObstacle();
  for (const o of obstacles) {
    o.x -= speed;
    o.el.style.left = o.x + 'px';
    if (hits(o)) {
      gameOver();
      return;
    }
  }
  const passed = obstacles.filter((o) => o.x + o.width < 0);
  passed.forEach((o) => {
    o.el.remove();
    score++;
    speed = Math.min(MAX_SPEED, speed + 0.15);
  });
  if (passed.length) {
    obstacles = obstacles.filter((o) => !passed.includes(o));
    updateScore();
  }
  requestAnimationFrame(frame);
}

function updateScore() {
  best = Math.max(best, score);
  scoreEl.textContent = `Score: ${score}   Best: ${best}`;
}

function gameOver() {
  running = false;
  messageEl.textContent = `Game over! Score: ${score} - jump to play again`;
  messageEl.hidden = false;
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    jump();
  }
});
gameContainer.addEventListener('pointerdown', jump);

updateScore();
