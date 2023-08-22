import React, { useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';
import { drawPaddle, drawBall }  from './draw';
// import { Socket } from 'socket.io-client';

type MySocket = ReturnType<typeof io>;

export interface Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	dy: number;
}

export interface Ball {
	x: number;
	y: number;
	radius: number;
	dx: number;
	dy: number;
}
export interface GameData {
	playerPaddle: Paddle;
	computerPaddle: Paddle;
	ball: Ball;
}

let ball: Ball = {
	x: 300,
	y: 150, 
	radius: 5,
	dx: 3, // The ball's horizontal velocity
	dy: 3 // The ball's vertical velocity
};
let playerPaddle: Paddle = {
	x: 600 - 20,
	y: 300 / 2 -50 /2,
	width: 10,
	height: 80,
	dy: 0
};

let computerPaddle: Paddle = {
	x: 10,
	y: 300 / 2 - 50  / 2,
	width: 10,
	height: 80,
	dy: 0
};

// // Paddle properties
const paddleSpeed : number = 5;

function useEffectOnce(effect: React.EffectCallback) {
	let ref = useRef(false);
	useEffect((...args) => {
		if (ref.current === false) {
			ref.current = true;
			effect(...args)
		}
	}, []);
}

async function updatePlayerPaddlePosition(ws: MySocket, playerPaddle: Paddle) {
	ws?.emit('UpdateGameData', { playerPaddle });
	// console.log("sending data to server"d , message);
	// ws?.send(JSON.stringify(message));
}

function draw(ws: MySocket, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle) {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// drawScore(ctx, canvas);
	// drawRounds(ctx, canvas);
	drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 'green', ctx);
	drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, 'red', ctx);
	// drawBall(ctx, ball);
	update(ws,ball, playerPaddle, computerPaddle, canvas, ctx);

	requestAnimationFrame(() => { draw(ws, ctx, canvas, ball, playerPaddle, computerPaddle); });
}

function update(ws: MySocket, ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) 
{
	// if (Date.now() - lastSpeedIncrease > interval) {
	// 		lastSpeedIncrease = Date.now();
	// 		ball.dx += ball.dx > 0 ? increaseSpeed : -increaseSpeed;
	// 		ball.dy += ball.dy > 0 ? increaseSpeed : -increaseSpeed;
	// }
	// Update paddle positions based on their velocity
	// playerPaddle.y += playerPaddle.dy;
	
	// Update computer paddle position to track the ball 
	if (computerPaddle.y < ball.y) {
		computerPaddle.dy = paddleSpeed; // Move the computer paddle down
	} else if (computerPaddle.y > ball.y) {
		computerPaddle.dy = -paddleSpeed; // Move the computer paddle up
	} else {
		computerPaddle.dy = 0; // Stop the computer paddle
	}
	
	// computerPaddle.y += computerPaddle.dy;

	updatePlayerPaddlePosition(ws, playerPaddle);
	ws.on('UpdateData', (data : GameData) => {
		// console.log('ballposition', data);
		ball = data.ball;
		// playerPaddle = data.playerPaddle;
		computerPaddle = data.computerPaddle;
	}
	);
	drawBall(ctx, ball);
}
	
const Game = () => {
	const canvasRef = useRef<null | HTMLCanvasElement>(null);
	const [ws, setWs] = useState<null | MySocket>(null);
	const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);

	useEffectOnce(() => {
		setWs(io('http://localhost:8000',
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
			let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

			ws.on('InitGame', (gameData : GameData) => {
				console.log('InitGame', gameData);
				ball = gameData.ball;
				playerPaddle = gameData.playerPaddle;
				computerPaddle = gameData.computerPaddle;
			}
			);
			// Handle keyboard events to control the player paddle
			
			ws.on('connect', () => {
				console.log('connected');
			}
			);
			ws.on('disconnect', () => {
				console.log('disconnected');
			}
			);

			ws.on('message', (data) => {
				console.log('message', data);
				setBroadcastMessage(data);
			});
		
			ws.on('error', (error) => {
				console.log('error', error);
			});
			
			ws.on('update', (message) => {
				console.log('Received update:', message);
				// Handle the received update message as needed
			});
			
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
		<center> 
			<canvas  ref={canvasRef}  width={600} height={300} /> 
			{broadcastMessage && <p>{broadcastMessage}</p>}	
		</center>
		);
		
	}
	
	export default Game;
	
	//react componnent life cycle , useffect usestate useref
	
	
	
	// function drawScore(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	// 	ctx.font = '32px Courier New';
	// 	ctx.fillText(playerScore.toString(), canvas.width / 2 + 40, 50);
	// 	ctx.fillText(computerScore.toString(), canvas.width / 2 - 60, 50);
	// }
	  
	// function drawRounds(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	// 	ctx.font = '32px Courier New';
	// 	ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
	// }