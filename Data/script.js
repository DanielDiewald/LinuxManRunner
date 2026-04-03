// setscoreonstart
function checksavescore() {
  document.getElementById("highscore").innerHTML =
    localStorage.getItem("yourscore") || 0;
  if (document.getElementById("lastscore")) {
    document.getElementById("lastscore").innerHTML =
      localStorage.getItem("lastscore") || 0;
  }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game dimensions
const GAME_WIDTH = 500;
const GAME_HEIGHT = 200;

// Load images
const images = {};
const imageUrls = {
  sky: "SPRITES/sky.png",
  clouds: "SPRITES/clouds.png",
  background: "SPRITES/background.png",
  lamps: "SPRITES/lamps.png",
  backgroundbuildings: "SPRITES/backgroundbuildings.png",
  train: "SPRITES/train.png",
  realtrain: "SPRITES/realtrain.png",
  player: "SPRITES/player.gif", // note: gifs will render as static in canvas unless handled, but it's acceptable for this basic rewrite or we can extract frames. Assuming static drawing as optimization.
  sneak: "SPRITES/sneak.gif",
};

let loadedImages = 0;
const totalImages = Object.keys(imageUrls).length;

for (let key in imageUrls) {
  images[key] = new Image();
  images[key].src = imageUrls[key];
  images[key].onload = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
      initGame();
    }
  };
}

// Background layers w/ parallax speeds
const bgLayers = [
  { img: "sky", x: 0, speed: 0 },
  { img: "clouds", x: 0, speed: 0.25 },
  { img: "background", x: 0, speed: 0.5 },
  { img: "backgroundbuildings", x: 0, speed: 0.77 },
  { img: "lamps", x: 0, speed: 1.66 },
  { img: "train", x: 0, speed: 0.52 },
  { img: "realtrain", x: 0, speed: 5 },
];

// Game State
let score = 0;
let counter = 0;
let gameRunning = false;
let lastTime = 0;
let enemySpawnTimer = 0;

const player = {
  x: 40,
  y: 130, // Restoring to 130
  width: 20,
  height: 40,
  velocityY: 0,
  gravity: 0.25,
  isJumping: false,
  isSneaking: false,
  jumpPower: -6,
};

const enemies = [];

// Input
window.onkeydown = function (e) {
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    jump();
  }
  if (e.code === "ArrowDown" || e.code === "KeyS") {
    sneak(true);
  }
};
window.onkeyup = function (e) {
  if (e.code === "ArrowDown" || e.code === "KeyS") {
    sneak(false);
  }
};

function jump() {
  if (!player.isJumping) {
    player.velocityY = player.jumpPower;
    player.isJumping = true;
  }
}

function sneak(isSneaking) {
  player.isSneaking = isSneaking;
  if (isSneaking) {
    player.height = 20;
    if (!player.isJumping) player.y = 150;
  } else {
    player.height = 40;
    if (!player.isJumping) player.y = 130;
  }
}

function initGame() {
  checksavescore();
  gameRunning = true;
  score = 0;
  counter = 0;
  requestAnimationFrame(gameLoop);
}

function spawnEnemy() {
  let randomenemy = Math.floor(Math.random() * 7);
  if (randomenemy < 1) return; // 'none' animation equivalent

  let isSpeedBlock = randomenemy === 4 || randomenemy === 5;
  let isFlying = randomenemy === 6 || randomenemy === 3; // Some flying blocks

  enemies.push({
    x: GAME_WIDTH,
    y: isFlying ? 130 : 150, // 120 for flying blocks (duck under), 150 for ground
    width: 20,
    height: 20,
    speed: isSpeedBlock ? 5 : 3,
  });
}

function update(deltaTime) {
  // Score
  counter += deltaTime;
  if (counter > 100) {
    score++;
    document.getElementById("scoreSpan").innerHTML = score;
    localStorage.setItem("lastscore", score);
    counter = 0;
  }

  // Background parallax
  for (let layer of bgLayers) {
    layer.x -= layer.speed * (deltaTime / 16);
    if (layer.x <= -GAME_WIDTH) {
      layer.x = 0;
    }
  }

  // Player Jump Physics
  if (player.isJumping) {
    player.y += player.velocityY;
    player.velocityY += player.gravity;

    let groundY = player.isSneaking ? 150 : 130;
    if (player.y >= groundY) {
      player.y = groundY;
      player.isJumping = false;
      player.velocityY = 0;
    }
  }

  // Enemies
  enemySpawnTimer += deltaTime;
  if (enemySpawnTimer > 1000) {
    spawnEnemy();
    enemySpawnTimer = 0;
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.x -= e.speed * (deltaTime / 16);

    // Collision Detection AABB
    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y
    ) {
      // Game Over
      gameOver();
      return;
    }

    // Remove offscreen
    if (e.x + e.width < 0) {
      enemies.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Disable smoothing to ensure pixel art remains sharp
  ctx.imageSmoothingEnabled = false;

  // Draw backgrounds
  for (let layer of bgLayers) {
    let img = images[layer.img];
    ctx.drawImage(img, Math.floor(layer.x), 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.drawImage(
      img,
      Math.floor(layer.x) + GAME_WIDTH,
      0,
      GAME_WIDTH,
      GAME_HEIGHT,
    );
  }

  // Draw Player
  let pImg = player.isSneaking ? images.sneak : images.player;
  ctx.drawImage(
    pImg,
    Math.floor(player.x),
    Math.floor(player.y),
    player.width,
    player.height,
  );

  // Draw Enemies (Block)
  ctx.fillStyle = "black";
  for (let e of enemies) {
    ctx.fillRect(Math.floor(e.x), Math.floor(e.y), e.width, e.height);
  }
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  if (!lastTime) lastTime = timestamp;
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  if (gameRunning) {
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function gameOver() {
  gameRunning = false;
  let hs = localStorage.getItem("yourscore") || 0;
  if (score > hs) {
    localStorage.setItem("yourscore", score);
  }
  location.href = "gameover.html";
}
