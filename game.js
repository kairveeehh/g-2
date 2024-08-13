let scene, camera, renderer, paddle, ball, bricks;
let gameWidth = 800;
let gameHeight = 600;
let ballSpeed = { x: 3, y: -3 };
let paddleSpeed = 10;
let gameStarted = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, gameWidth / gameHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
    renderer.setSize(gameWidth, gameHeight);

    // Create paddle
    const paddleGeometry = new THREE.BoxGeometry(100, 20, 20);
    const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle.position.set(0, -250, 0);
    scene.add(paddle);

    // Create ball
    const ballGeometry = new THREE.SphereGeometry(10, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    resetBall();
    scene.add(ball);

    // Create bricks
    createBricks();

    camera.position.z = 400;

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    animate();
}

function createBricks() {
    if (bricks) {
        bricks.forEach(brick => scene.remove(brick));
    }
    bricks = [];
    const brickGeometry = new THREE.BoxGeometry(80, 30, 20);
    const brickMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            const brick = new THREE.Mesh(brickGeometry, brickMaterial);
            brick.position.set(j * 90 - 315, i * 40 + 200, 0);
            scene.add(brick);
            bricks.push(brick);
        }
    }
}

let leftPressed = false;
let rightPressed = false;

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    } else if (event.key === ' ') {
        if (!gameStarted) {
            startGame();
        }
    }
}

function onKeyUp(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function movePaddle() {
    if (leftPressed && paddle.position.x > -350) {
        paddle.position.x -= paddleSpeed;
    }
    if (rightPressed && paddle.position.x < 350) {
        paddle.position.x += paddleSpeed;
    }
}

function moveBall() {
    if (!gameStarted) return;

    ball.position.x += ballSpeed.x;
    ball.position.y += ballSpeed.y;

    // Wall collision
    if (ball.position.x > 390 || ball.position.x < -390) {
        ballSpeed.x = -ballSpeed.x;
    }
    if (ball.position.y > 290) {
        ballSpeed.y = -ballSpeed.y;
    }

    // Paddle collision
    if (ball.position.y < -240 && ball.position.y > -260 &&
        ball.position.x > paddle.position.x - 50 && ball.position.x < paddle.position.x + 50) {
        ballSpeed.y = -ballSpeed.y;
    }

    // Brick collision
    bricks.forEach((brick, index) => {
        if (ball.position.y > brick.position.y - 25 && ball.position.y < brick.position.y + 25 &&
            ball.position.x > brick.position.x - 40 && ball.position.x < brick.position.x + 40) {
            ballSpeed.y = -ballSpeed.y;
            scene.remove(brick);
            bricks.splice(index, 1);
        }
    });

    // Game over
    if (ball.position.y < -300) {
        alert('Game Over! Press Space to restart.');
        resetGame();
    }
}

function resetBall() {
    ball.position.set(0, -230, 0);
    ballSpeed = { x: 3, y: -3 };
}

function resetGame() {
    resetBall();
    paddle.position.set(0, -250, 0);
    createBricks();
    gameStarted = false;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        ballSpeed.y = -Math.abs(ballSpeed.y); }
}

function animate() {
    requestAnimationFrame(animate);
    movePaddle();
    moveBall();
    renderer.render(scene, camera);
}

init();