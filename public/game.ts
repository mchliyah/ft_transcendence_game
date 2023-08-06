
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
let windowWidth: number = window.innerWidth;
let windowHeight: number = window.innerHeight;
console.log(windowWidth, windowHeight);

import('socket.io-client').then(io => {
let ws = io('http://localhost:3000');

ws.on('connect', () => {
	console.log('Connected to server');
});

ws.on('disconnect', () => {
	console.log('Disconnected from server');
});
  }).catch(error => {
	console.log(error);
  });





// Paddle properties
const paddleWidth : number = 10;
const paddleHeight : number = 80;
const paddleSpeed : number = 5;
let playerScore : number = 0;
let computerScore : number = 0;
let rounds : number = 3;
let interval : number = 1000;
let lastSpeedIncrease : number = 0;
let increaseSpeed : number = 0.2;

// Define the player paddle
const playerPaddle: Paddle = {
  x: canvas.width - paddleWidth - 10, 
  y: canvas.height / 2 - paddleHeight / 2, 
  width: paddleWidth,
  height: paddleHeight,
  dy: 0 // The player paddle's vertical velocity
};

// Define the computer paddle
const computerPaddle: Paddle = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0 // The computer paddle's vertical velocity
};

// Ball properties
const ball: Ball = {
  x: canvas.width / 2, 
  y: canvas.height / 2, 
  radius: 5,
  dx: 3, // The ball's horizontal velocity
  dy: 3 // The ball's vertical velocity
};

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

function drawPaddle(x: number, y: number, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function resetGame() {
	// Reset player paddle position
	playerPaddle.y = canvas.height / 2 - playerPaddle.height / 2;
	// Reset computer paddle position
	computerPaddle.y = canvas.height / 2 - computerPaddle.height / 2;
	// Reset ball position
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	// Reset ball velocity
	ball.dx = Math.random() > 0.5 ? 3 : -3; // Randomize the horizontal velocity
	ball.dy = Math.random() > 0.5 ? 3 : -3; // Randomize the vertical velocity
}


function drawScore() {
	ctx.font = '32px Courier New';
	ctx.fillText(playerScore.toString(), canvas.width / 2 + 40, 50);
	ctx.fillText(computerScore.toString(), canvas.width / 2 - 60, 50);
}

function drawRounds() {
	ctx.font = '32px Courier New';
	ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
}

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawScore();
	drawRounds();
	drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 'green');
	drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, 'red');
	drawBall();
	update();
	// updatePlayerPaddlePosition();
	requestAnimationFrame(draw);
}

function someonelose() {
if (rounds === 0) {
	if (playerScore > computerScore) {
		playerScore = 0;
		computerScore = 0;
	}
	else {
		playerScore = 0;
		computerScore = 0;
	}
	rounds = 3;
  }
}


function ballCollision() {

	if (
		ball.x + ball.radius >= playerPaddle.x &&
		ball.y >= playerPaddle.y &&
		ball.y < playerPaddle.y + playerPaddle.height
	  ) {
		ball.dx *= -1; // Reverse the horizontal velocity of the ball
	  } else if (
		ball.x - ball.radius <= computerPaddle.x + computerPaddle.width &&
		ball.y >= computerPaddle.y &&
		ball.y < computerPaddle.y + computerPaddle.height
	  ) {
		ball.dx *= -1; // Reverse the horizontal velocity of the ball
	  } else if (ball.x + ball.radius > canvas.width) {
		// Player misses the ball
		rounds--;
		computerScore++;
		someonelose();
		resetGame();
	  } else if (ball.x - ball.radius < 0) {
		// Computer misses the ball
		rounds--;
		playerScore++;
		someonelose();
		resetGame();
	  }
}

function updatePlayerPaddlePosition() {
	// Your logic to update the player's paddle position
  
	// Send the player's paddle position to the backend
	const message = {
	  type: 'updatePaddlePosition',
	  position: playerPaddle.y,
	};
	ws.send(JSON.stringify(message));
  }

function update() {
	if (Date.now() - lastSpeedIncrease > interval) {
		lastSpeedIncrease = Date.now();
		ball.dx += ball.dx > 0 ? increaseSpeed : -increaseSpeed;
		ball.dy += ball.dy > 0 ? increaseSpeed : -increaseSpeed;
	}
	// Update paddle positions based on their velocity
	playerPaddle.y += playerPaddle.dy;
  
	// Update computer paddle position to track the ball
	if (computerPaddle.y < ball.y) {
	  computerPaddle.dy = paddleSpeed; // Move the computer paddle down
	} else if (computerPaddle.y > ball.y) {
	  computerPaddle.dy = -paddleSpeed; // Move the computer paddle up
	} else {
	  computerPaddle.dy = 0; // Stop the computer paddle
	}
  
	computerPaddle.y += computerPaddle.dy;
  
	// Update ball position
	ball.x += ball.dx;
	ball.y += ball.dy;

	// Check ball collision with top and bottom walls
	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
	  ball.dy *= -1; // Reverse the vertical velocity of the ball
	}

	// Check ball collision with player and computer paddles
	ballCollision();
  }

// Handle keyboard events to control the player paddle
window.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowUp') {
    playerPaddle.dy = -paddleSpeed; // Move the player paddle up
  } else if (event.code === 'ArrowDown') {
    playerPaddle.dy = paddleSpeed; // Move the player paddle down
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
    playerPaddle.dy = 0; // Stop the player paddle
  }
});

canvas.addEventListener('mousemove', (event) => {
	const canvasRect = canvas.getBoundingClientRect();
	const mouseY = event.clientY - canvasRect.top;
	playerPaddle.y = mouseY - playerPaddle.height / 2;
  });

// Start the game loop
draw();
