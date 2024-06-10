// variables
let lives = 6,
    points = 0,
    meteorMOVE = false,
    fireSPEED = 8,
    speed = 8,
    gameOver = false,
    shipLEFT = false,
    shipRIGHT = false,
    shipFOR = false,
    shipBACK = false,
    fireUP = false,
    LEFT = 37,
    RIGHT = 39,
    FORWARD = 670,
    BACKWARD = 270;

let id;

// images
background = new Image();
background.src = "img/bg.jpg";

let shipIMG = new Image();
shipIMG.src = "img/ship.png";

let meteorIMG = new Image();
meteorIMG.src = "img/meteor.png";

let bulletIMG = new Image();
bulletIMG.src = "img/bullet.png";

let cnv = document.querySelector('canvas');
let ctx = cnv.getContext('2d');

// objects
let ship = {
    x: 270,
    y: 670,
    w: 80,
    h: 100
}

bullets = [];

let meteors = [
    { x: Math.floor(Math.random() * 520) + 1, y: -70, w: 40, h: 60 },
    { x: Math.floor(Math.random() * 520) + 1, y: -60, w: 40, h: 60 },
    { x: Math.floor(Math.random() * 520) + 1, y: -90, w: 40, h: 60 }
];


window.addEventListener("keydown", function keyDown(e) {
    let key = e.keyCode;

    if (key === LEFT) shipLEFT = true;
    if (key === RIGHT) shipRIGHT = true;
    if (key === 38) shipFOR = true;  // Up arrow
    if (key === 40) shipBACK = true; // Down arrow
    if (key === 32) { // Spacebar
        let side = Math.floor(Math.random() * 2) + 1;
        if (side === 1) {
            bullets.push({ x: ship.x + 17, y: ship.y + 35, w: 5, h: 10 });
        } else {
            bullets.push({ x: ship.x + 55, y: ship.y + 35, w: 5, h: 10 });
        }
        fireUP = true;
    }
});

window.addEventListener("keyup", function keyUp(e) {
    let key = e.keyCode;

    if (key === LEFT) shipLEFT = false;
    if (key === RIGHT) shipRIGHT = false;
    if (key === 38) shipFOR = false;  // Up arrow
    if (key === 40) shipBACK = false; // Down arrow
});

function shipAction() {
    if (shipLEFT) {
        ship.x -= speed;
        ship.angle = -0.1; // Tilt left
    }
    if (shipRIGHT) {
        ship.x += speed;
        ship.angle = 0.1; // Tilt right
    }
    if (shipFOR) {
        ship.y -= speed;
        ship.angle = -0.05; // Tilt forward
    }
    if (shipBACK) {
        ship.y += speed;
        ship.angle = 0.05; // Tilt backward
    }

    if (!shipLEFT && !shipRIGHT && !shipFOR && !shipBACK) {
        ship.angle = 0; // Reset tilt
    }

    if (ship.x > 520) ship.x = 520;
    if (ship.x < 0) ship.x = 0;
    if (ship.y > 670) ship.y = 670;
    if (ship.y < 0) ship.y = 0;

    if (fireUP) {
        bullets.forEach(function (bullet, i) {
            bullets[i].y -= 4;
        });
    }
}

function bulletCollision() {
    bullets.forEach((bullet, i) => {
        meteors.forEach((meteor, m) => {
            if (isColliding(bullet, meteor)) {
                meteors[m] = { x: Math.floor(Math.random() * 520) + 1, y: -30, w: 40, h: 60 };
                bullets[i] = null;
                points += 1;
            }
        });
    });
    bullets = bullets.filter(bullet => bullet !== null);
}

function clearBullets() {
    bullets = bullets.filter(bullet => bullet.y > 0);
}

function checkStatus() {
    if (meteorMOVE) {
        meteors.forEach((meteor, i) => {
            meteors[i].y += 2;
        });
    }

    if (lives <= 0) {
        gameOver = true;
    }
}

// Utility function to check collision
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w &&
        obj1.x + obj1.w > obj2.x &&
        obj1.y < obj2.y + obj2.h &&
        obj1.y + obj2.h > obj2.y;
}

// Increase meteor speed based on points
function increaseDifficulty() {
    if (points % 10 === 0 && fireSPEED < 20) {
        fireSPEED += 1;
    }
}

// Render function with optimizations
function render() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.drawImage(background, 0, 0);

    // text information
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgb(236, 240, 241)";

    let textString = "p3 SPACESHIP",
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, (cnv.width / 2) - (textWidth / 2), 100);
    ctx.fillText("SCORE: " + points, 20, 790);
    ctx.fillText("LIVES: " + lives, 450, 790);

    // Draw ship with rotation
    ctx.save();
    ctx.translate(ship.x + ship.w / 2, ship.y + ship.h / 2);
    ctx.rotate(ship.angle);
    ctx.drawImage(shipIMG, -ship.w / 2, -ship.h / 2, ship.w, ship.h);
    ctx.restore();

    // Draw meteors and check for collisions
    meteors.forEach((meteor, i) => {
        ctx.drawImage(meteorIMG, meteor.x, meteor.y, meteor.w, meteor.h);

        if (isColliding(ship, meteor)) {
            lives -= 1;
            meteors[i] = { x: Math.floor(Math.random() * 520) + 1, y: -30, w: 40, h: 60 };
        } else if (meteor.y > 800) {
            meteors[i] = { x: Math.floor(Math.random() * 520) + 1, y: -30, w: 40, h: 60 };
        }
    });

    // Draw bullets
    bullets.forEach((bullet, i) => {
        ctx.drawImage(bulletIMG, bullet.x, bullet.y, bullet.w, bullet.h);
    });

    if (gameOver) {
        bullets = [];
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.drawImage(background, 0, 0);
        ctx.font = "25px Arial";
        let textString = "GAME OVER",
            textWidth = ctx.measureText(textString).width;
        ctx.fillText(textString, (cnv.width / 2) - (textWidth / 2), 320);
        ctx.font = "15px Arial";
        ctx.fillText("Your score " + points, 230, 350);
        document.getElementById('restart').style.display = 'block';
        document.getElementById('stop').style.display = 'block';
        cancelAnimationFrame(id);
    }
}

function start() {
    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'none';
    meteorMOVE = true;
}

function stop() {
    document.getElementById('stop').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('p3-game').style.display = 'none';
    document.getElementById('p3-game-btn').style.display = 'block';
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.drawImage(background, 0, 0);
    cancelAnimationFrame(id);
}

function restart() {
    id = requestAnimationFrame(main, cnv);
    document.getElementById('restart').style.display = 'none';
    document.getElementById('stop').style.display = 'inline-block';
    meteors.forEach((meteor, i) => {
        meteors[i].y = -70;
    });
    gameOver = false;
    lives = 3;
    meteorMOVE = true;
    points = 0;
}

function main() {
    if (!gameOver) {
        id = requestAnimationFrame(main, cnv);
        shipAction();
        bulletCollision();
        checkStatus();
        clearBullets();
        render();
    }
}

function init() {

    if (document.getElementById('p3-game-btn')) {

        document.getElementById('p3-game-btn').addEventListener('click', () => {

            document.getElementById('p3-game').style.display = 'flex';
            document.getElementById('p3-game-btn').style.display = 'none';
            document.getElementById('start').style.display = 'inline-block';

            ctx.clearRect(0, 0, cnv.width, cnv.height);
            ctx.drawImage(background, 0, 0);
        });

        document.getElementById('start').addEventListener('click', () => {
            main();
        }, false);
    }
}

init();