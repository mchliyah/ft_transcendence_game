import { useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';

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

type MySocket = ReturnType<typeof io>;

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

function useEffectOnce(effect: React.EffectCallback) {
	let ref = useRef(false);
	useEffect((...args) => {
		if (ref.current === false) {
			ref.current = true;
			effect(...args)
		}
	}, []);
}

function drawPaddle(x: number, y: number, width: number, height: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}
  
function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'black';
	ctx.fill();
	ctx.closePath();
}
  
function resetGame(ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle, canvas: HTMLCanvasElement) {
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
  
  
function drawScore(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	ctx.font = '32px Courier New';
	ctx.fillText(playerScore.toString(), canvas.width / 2 + 40, 50);
	ctx.fillText(computerScore.toString(), canvas.width / 2 - 60, 50);
}
  
function drawRounds(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	ctx.font = '32px Courier New';
	ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
}

function draw(ws: MySocket, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle) {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawScore(ctx, canvas);
	drawRounds(ctx, canvas);
	drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 'green', ctx);
	drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, 'red', ctx);
	drawBall(ctx, ball);
	update(ball, playerPaddle, computerPaddle, canvas);
	updatePlayerPaddlePosition(ws, playerPaddle);
	requestAnimationFrame(() => { draw(ws, ctx, canvas, ball, playerPaddle, computerPaddle); });
  }
  

function	updatePlayerPaddlePosition(ws: MySocket, playerPaddle: Paddle){
	  const message = {
		  type: 'updatePaddlePosition',
		  position: playerPaddle.y,
	  };
	  ws?.send(JSON.stringify(message));
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

function ballCollision(ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle, canvas: HTMLCanvasElement) {
  
	  if (
		  ball.x + ball.radius >= playerPaddle.x &&
		  ball.y >= playerPaddle.y &&
		  ball.y < playerPaddle.y + playerPaddle.height
		){
		  ball.dx *= -1; // Reverse the horizontal velocity of the ball
		} else if (
		  ball.x - ball.radius <= computerPaddle.x + computerPaddle.width &&
		  ball.y >= computerPaddle.y &&
		  ball.y < computerPaddle.y + computerPaddle.height
		) {
		  ball.dx *= -1; // Reverse the horizontal velocity of the ball
		} else if (ball.x + ball.radius > playerPaddle.x + playerPaddle.width) {
		  // Player misses the ball
		  rounds--;
		  computerScore++;
		  someonelose();
		  resetGame(ball, playerPaddle, computerPaddle, canvas);
		} else if (ball.x - ball.radius < computerPaddle.x - computerPaddle.width) {
		  // Computer misses the ball
		  rounds--;
		  playerScore++;
		  someonelose();
		  resetGame(ball, playerPaddle, computerPaddle, canvas);
		}
  }
  

  
function update(ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle, canvas: HTMLCanvasElement) {
	// Your logic to update the player's paddle position
	
	// Send the player's paddle position to the backend

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
	ballCollision(ball, playerPaddle, computerPaddle, canvas);
}

const Game = () => {
	const canvasRef = useRef<null | HTMLCanvasElement>(null);
	const [ws, setWs] = useState<null | MySocket>(null);
	
	useEffectOnce(() => {
		setWs(io('http://10.11.3.6:8000',
		{
			withCredentials: true,
			forceNew: true,
			timeout: 100000, //before connect_error and connect_timeout are emitted.
			transports: ['websocket'],
		}))
	});

	useEffect(() => {
		// Define the player paddle
		if (canvasRef.current && ws) {
			const canvas = canvasRef.current;
			const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
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
			
			canvas.addEventListener('mousemove', (event : any) => {
				const canvasRect = canvas.getBoundingClientRect();
				const mouseY = event.clientY - canvasRect.top;
				playerPaddle.y = mouseY - playerPaddle.height / 2;
				});
			
			// Start the game loop
			draw(ws, ctx, canvas, ball, playerPaddle, computerPaddle);
		}
	}, [ws])

	return (
		<center> <canvas  ref={canvasRef}  width={600} height={300} /> </center>
	);
	
}

export default Game;

//react componnent life cycle , useffect usestate useref