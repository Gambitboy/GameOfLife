var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const cellWidth = 5;
const cellHeight = 5;
const WORLD_X = 1400;
const WORLD_Y = 700;
var gameSpeed = null;

var game = null;
var gameState = false;
var world = initWorld();

function initWorld() {
  var world = new Array(WORLD_X);
  for (var x = 0; x < WORLD_X; x++) {
    world[x] = new Array(WORLD_Y);
  }
  return resetWorld(world);
}

function resetWorld(world) {
  loopThroughWorld(function (x, y) {
    world[x][y] = false;
  })
  return world;
}

function runGameOfLife() {
  clearInterval(game);
  gameState = true;
  gameSpeed = document.getElementById('game_speed').value || 100
  initGameOfLife();
  gameLoop();
}

function initGameOfLife() {
  loopThroughWorld(setRandomWorld);
}

function loopThroughWorld(callBack) {
  for(var x = 0; x < WORLD_X / cellWidth; x++) {
    for(var y = 0; y < WORLD_Y / cellHeight; y++) {
      callBack(x, y);
    }
  }
}

function setRandomWorld(x, y) {
  state = Math.floor((Math.random() * 2) + 0);
  world[x][y] = state === 1 ? true : false;
  if (state) {
    drawCell(x, y)
  }
}

function drawCell(x, y) {
  ctx.fillStyle = 'black';
  ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
}

function gameLoop() {
  game = setInterval(calculateNextDay, gameSpeed);
}

function calculateNextDay() {
  if (gameState) {
    tempWorld = initWorld();
    ctx.clearRect(0, 0, 1400, 700);
    loopThroughWorld(calculateNextDayCell);
    world = tempWorld
  }
}

function calculateNextDayCell(x, y) {
  var currentCell = getCellState(x, y);
  var alive = aliveNeighbours(x, y);
  var on = false;

  if (currentCell) {
    if (alive < 2 || alive > 3) { // Under and Over Population
      on = false;
    } else { // Sustainable Life
      on = true;
    }
  } else if (alive === 3) { // Birth
    on = true;
  }

  if (on) {
    tempWorld[x][y] = on;
    drawCell(x, y);
  }
}

function aliveNeighbours(x, y) {
  var neighbours = [
    getCellState(x + 1, y),
    getCellState(x - 1, y),
    getCellState(x, y + 1),
    getCellState(x, y - 1),
    getCellState(x + 1, y + 1),
    getCellState(x + 1, y - 1),
    getCellState(x - 1, y + 1),
    getCellState(x - 1, y - 1)
  ];
  return neighbours.filter(x => x === true).length;
}

function getCellState(x, y) {
  if (x < 0 || y < 0 || x > WORLD_X || y > WORLD_Y) {
      return false;
  }
  return world[x][y];
}

function stop() {
  gameState = false;
  clearInterval(game);
}

function pause() {
  if (gameState) {
    gameState = false;
  } else {
    gameState = true;
  }
}