var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const cellWidth = 5;
const cellHeight = 5;

var WORLD_X;
var WORLD_Y;

initWindow();

var game = null;
var gameSpeed = null;
var gameState = false;
var circle = false;
var color = false;
var world = initWorld();

function initWindow() {
  WORLD_X = roundToInterval(window.innerWidth, cellWidth) - 15;
  WORLD_Y = roundToInterval(window.innerHeight, cellHeight) - 50;

  ctx.canvas.width = WORLD_X;
  ctx.canvas.height = WORLD_Y;
}

window.addEventListener('resize', windowWasResized);

function windowWasResized() {
  stop();
  initWindow();
  initWorld();
}

function roundToInterval(number, interval) {
  return Math.floor(number / interval) * interval;
}

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

function start() {
  clearCanvas();
  clearInterval(game);
  gameState = true;
  gameSpeed = document.getElementById('game_speed').value || 100
  circle = document.getElementById('circle').checked
  color = document.getElementById('color').checked
  initGameOfLife();
  runGameOfLife();
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
  if (circle) {
    ctx.beginPath();
    ctx.fillStyle = getColor();
    ctx.arc(x * cellWidth, y * cellHeight, 2, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    ctx.fillStyle = getColor();
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
  }
}

function getColor() {
  if (color) {
    type = Math.floor((Math.random() * 4) + 0);
    switch(type) {
      case 0: return '#2E1F27';
      case 1: return '#3F826D';
      case 2: return '#FB3640';
      case 3: return '#FFBE0B';
    }
  } else {
    return 'black'
  } 
}

function runGameOfLife() {
  game = setInterval(calculateNextDay, gameSpeed);
}

function calculateNextDay() {
  if (gameState) {
    tempWorld = initWorld();
    clearCanvas();
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

function clearCanvas() {
  ctx.clearRect(0, 0, WORLD_X, WORLD_Y);
}