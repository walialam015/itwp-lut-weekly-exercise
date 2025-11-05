// Canvas and context
var gameCanvas = document.getElementById("gameCanvas");
var canvasContext = gameCanvas.getContext("2d");

// Images
var playerTankImage = new Image();
playerTankImage.src = "tank.png";

var enemySlowImage = new Image();
enemySlowImage.src = "enemy_slow.png";

var enemyFastImage = new Image();
enemyFastImage.src = "enemy_fast.png";

// Player
var playerTank = {
  x: gameCanvas.width / 2 - 25,
  y: gameCanvas.height - 60,
  width: 50,
  height: 50,
  speed: 6
};

// Arrays
var playerBullets = [];
var enemies = [];
var playerScore = 0;
var isGameOver = false;

// Input
var pressedKeys = {};
document.addEventListener("keydown", function(e) { pressedKeys[e.code] = true; });
document.addEventListener("keyup", function(e) { pressedKeys[e.code] = false; });

// Create enemy
function spawnEnemy() {
  var enemyType = Math.random() < 0.5 ? "slow" : "fast";
  var enemy = {
    x: Math.random() * (gameCanvas.width - 40),
    y: -50,
    width: 40,
    height: 40,
    speed: enemyType === "slow" ? 1.5 : 2.5,
    type: enemyType
  };
  enemies.push(enemy);
}

// Shoot bullet
function fireBullet() {
  var bullet = {
    x: playerTank.x + playerTank.width / 2 - 3,
    y: playerTank.y,
    width: 6,
    height: 10,
    speed: 6
  };
  playerBullets.push(bullet);
}

// Controls
document.addEventListener("keydown", function(e) {
  if (e.code === "Space" && !isGameOver) fireBullet();
  if (e.code === "Enter" && isGameOver) restartGame();
});

// Restart
function restartGame() {
  enemies = [];
  playerBullets = [];
  playerScore = 0;
  isGameOver = false;
  playerTank.x = gameCanvas.width / 2 - 25;
  playerTank.y = gameCanvas.height - 60;
}

// Update
function updateGame() {
  if (isGameOver) return;

  // Move player
  if (pressedKeys["ArrowLeft"] && playerTank.x > 0) playerTank.x -= playerTank.speed;
  if (pressedKeys["ArrowRight"] && playerTank.x < gameCanvas.width - playerTank.width) playerTank.x += playerTank.speed;
  if (pressedKeys["ArrowUp"] && playerTank.y > 0) playerTank.y -= playerTank.speed;
  if (pressedKeys["ArrowDown"] && playerTank.y < gameCanvas.height - playerTank.height) playerTank.y += playerTank.speed;

  // Move bullets
  for (var i = 0; i < playerBullets.length; i++) {
    playerBullets[i].y -= playerBullets[i].speed;
    if (playerBullets[i].y < 0) playerBullets.splice(i, 1);
  }

  // Move enemies
  for (var j = 0; j < enemies.length; j++) {
    enemies[j].y += enemies[j].speed;
    if (enemies[j].y > gameCanvas.height - 10) isGameOver = true;
  }

  // Check collisions
  for (var eIndex = 0; eIndex < enemies.length; eIndex++) {
    for (var bIndex = 0; bIndex < playerBullets.length; bIndex++) {
      var enemy = enemies[eIndex];
      var bullet = playerBullets[bIndex];
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemies.splice(eIndex, 1);
        playerBullets.splice(bIndex, 1);
        playerScore += enemy.type === "slow" ? 1 : 2;
        break;
      }
    }
  }
}

// Draw
function drawGame() {
  canvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Player
  if (playerTankImage.complete) {
    canvasContext.drawImage(playerTankImage, playerTank.x, playerTank.y, playerTank.width, playerTank.height);
  } else {
    canvasContext.fillStyle = "green";
    canvasContext.fillRect(playerTank.x, playerTank.y, playerTank.width, playerTank.height);
  }

  // Bullets
  canvasContext.fillStyle = "yellow";
  for (var i = 0; i < playerBullets.length; i++) {
    var bullet = playerBullets[i];
    canvasContext.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

  // Enemies
  for (var j = 0; j < enemies.length; j++) {
    var enemy = enemies[j];
    if (enemy.type === "slow" && enemySlowImage.complete) {
      canvasContext.drawImage(enemySlowImage, enemy.x, enemy.y, enemy.width, enemy.height);
    } else if (enemy.type === "fast" && enemyFastImage.complete) {
      canvasContext.drawImage(enemyFastImage, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      canvasContext.fillStyle = enemy.type === "slow" ? "red" : "orange";
      canvasContext.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }

  // Score
  canvasContext.fillStyle = "white";
  canvasContext.font = "20px Arial";
  canvasContext.fillText("Score: " + playerScore, 10, 25);

  // Game Over
  if (isGameOver) {
    canvasContext.fillStyle = "white";
    canvasContext.font = "40px Arial";
    canvasContext.fillText("💀 GAME OVER 💀", gameCanvas.width / 2 - 150, gameCanvas.height / 2);
    canvasContext.font = "20px Arial";
    canvasContext.fillText("Press Enter to Restart", gameCanvas.width / 2 - 100, gameCanvas.height / 2 + 40);
  }
}

// Loop
function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Spawn enemies
setInterval(function() {
  if (!isGameOver) spawnEnemy();
}, 1200);

// Start
gameLoop();
