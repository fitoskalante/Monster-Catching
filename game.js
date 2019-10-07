let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
let bgReady, heroReady, monsterReady, rockReady;
let bgImage, heroImage, monsterImage, rockImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 20;
let elapsedTime = 0;

let score = 0
let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
let rockX = 100;
let rockY = 100;
let monsterX = 249;
let monsterY = 100;
let keysDown = {};
let feedback = document.getElementById("feedback")
const timeFeedback = document.getElementById("timeFeedback")
const topScore = document.getElementById('topScore');
const topUser = document.getElementById('topUser')
let timer = document.getElementById('timeFeedback')
let progressValue = 0;

function setUsername() {
  let enterUsername = document.getElementById("playerName").value;
  document.getElementById("username").innerHTML = enterUsername;
}
function progressBar() {
  var progress = document.getElementById('progress');
  setInterval(function () {
    if (progressValue < 100) {
      progressValue++;
      progress.value = progressValue;
    }
  }, 1000);
}
function getAppState() {
  return JSON.parse(localStorage.getItem('appState')) || {
    User: document.getElementById('playerName').value || 'Anonymous',
    currentHighScore: 0,
  }
}
function saveAppState(appState) {
  return localStorage.setItem('appState', JSON.stringify(appState))
}
function showTopScore() {
  const appState = getAppState()
  topScore.innerHTML = appState.currentHighScore
  topUser.innerHTML = appState.User
}
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";

  rockImage = new Image();
  rockImage.onload = function () {
    rockReady = true;
  };
  rockImage.src = "images/rock.PNG";

  monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";

  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "images/hero.png";
}
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}
function moveHero() {
  if (score <= 2) {
    if (38 in keysDown) {
      heroY -= 5;
    }
    if (40 in keysDown) {
      heroY += 5;
    }
    if (37 in keysDown) {
      heroX -= 5;
    }
    if (39 in keysDown) {
      heroX += 5;
    }
  }
  if (score > 2) {
    if (38 in keysDown) {
      heroY -= 7;
    }
    if (40 in keysDown) {
      heroY += 7;
    }
    if (37 in keysDown) {
      heroX -= 7;
    }
    if (39 in keysDown) {
      heroX += 7;
    }
  }
  if (score > 7) {
    if (38 in keysDown) {
      heroY -= 10;
    }
    if (40 in keysDown) {
      heroY += 10;
    }
    if (37 in keysDown) {
      heroX -= 10;
    }
    if (39 in keysDown) {
      heroX += 10;
    }
  }

}
function heroLimitArea() {
  if (heroX <= 0) {
    heroX = 0
  }
  if (heroX >= canvas.width - 28) {
    heroX = canvas.width - 28
  }
  if (heroY <= 0) {
    heroY = 0
  }
  if (heroY >= canvas.height - 30) {
    heroY = canvas.height - 30
  }
}
function charactersInteraction() {
  const heroHasCaughtMonster = heroX <= (monsterX + 15)
    && monsterX <= (heroX + 15)
    && heroY <= (monsterY + 15)
    && monsterY <= (heroY + 15)

  const heroHastouchRock = heroX <= (rockX + 15)
    && rockX <= (heroX + 15)
    && heroY <= (rockY + 15)
    && rockY <= (heroY + 15)

  if (heroHasCaughtMonster) {
    score += 1
    document.getElementById('feedback').innerHTML = "Well Done!!"
    monsterX = Math.floor(Math.random() * 480);
    monsterY = Math.floor(Math.random() * 450);
    rockX = Math.floor(Math.random() * 480);
    rockY = Math.floor(Math.random() * 450);
    document.getElementById("currentScore").innerHTML = score;
    const appState = getAppState()
    if (appState.currentHighScore < score) {
      appState.currentHighScore = score;
      console.log('hauid', appState)
      saveAppState(appState)
    }
  }
  if (heroHastouchRock) {
    score -= 1
    document.getElementById('feedback').innerHTML = "Don't touch the rocks! They dicount holes"
    rockX = Math.floor(Math.random() * 480);
    rockY = Math.floor(Math.random() * 450);
    document.getElementById("currentScore").innerHTML = score;
    const appState = getAppState()
    if (appState.currentHighScore < score) {
      appState.currentHighScore = score;
      console.log('hauid', appState)
      saveAppState(appState)
    }
  }
}
function update() {
  elapsedTime = 0
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (elapsedTime >= SECONDS_PER_ROUND) {
    return;
  }
  moveHero()
  heroLimitArea()
  charactersInteraction()
  showTopScore()

}
function render() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (score >= 3) {
    if (rockReady) {
      ctx.drawImage(rockImage, rockX, rockY);
    }
  }
  if (score >= 6) {
    if (rockReady) {
      ctx.drawImage(rockImage, rockX, rockY);
    }
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (elapsedTime <= 19) {
    timer.innerHTML = `${SECONDS_PER_ROUND - elapsedTime} sec`
  } else {
    timer.innerHTML = "Game Over"
  }
}
function main() {
  update();
  render();
  requestAnimationFrame(main);
};
const w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


loadImages();
main();
setupKeyboardListeners();
progressBar();





