import React, { useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';
import { drawPaddle, drawBall }  from './draw';
import { SetEventLisners, ListenOnSocket} from './Game.lisners';
import { Ball, Paddle, GameData } from '../../../Types';
// import { Socket } from 'socket.io-client';

export type MySocket = ReturnType<typeof io>;

let playerScore : number;
let computerScore : number;
let rounds: number;

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

function updatePlayerPaddlePosition(ws: MySocket, playerPaddle: Paddle) {
	ws?.emit('UpdatePadlle', playerPaddle);
	// console.log("sending data to server" , playerPaddle);
	// ws?.send(JSON.stringify(message));
}

function draw(ws: MySocket, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle) {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawScore(ctx, canvas);
	drawRounds(ctx, canvas);
	drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 'green', ctx);
	drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, 'red', ctx);
	// drawBall(ctx, ball);
	update(ws,ball, playerPaddle, computerPaddle, canvas, ctx);

	requestAnimationFrame(() => { draw(ws, ctx, canvas, ball, playerPaddle, computerPaddle); });
}

function update(ws: MySocket, ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) 
{
	
	
	// Update computer paddle position to track the ball 
	// if (computerPaddle.y < ball.y) {
	// 	computerPaddle.dy = paddleSpeed; // Move the computer paddle down
	// } else if (computerPaddle.y > ball.y) {
	// 	computerPaddle.dy = -paddleSpeed; // Move the computer paddle up
	// } else {
	// 	computerPaddle.dy = 0; // Stop the computer paddle
	// }
	
	// computerPaddle.y += computerPaddle.dy;
	updatePlayerPaddlePosition(ws, playerPaddle);
	ws.on('UpdateData', (data : GameData) => {
		// console.log('ballposition', data);
		// const newball : Ball = data.ball;
		// ball = {...data.ball};
		// ball = Object.assign({}, data.ball);
		ball.x = data.ball.x;
		ball.y = data.ball.y;
		ball.dy = data.ball.dy;
		ball.dx = data.ball.dx;
		playerScore = data.playerScore;
		computerScore = data.computerScore;
		rounds = data.rounds;
		// playerPaddle = data.playerPaddle;
		// computerPaddle = data.computerPaddle;
		computerPaddle.y = data.computerPaddle.y;
	}
	);
	// console.log('revieved ball data frome server ', ball);
	drawBall(ctx, ball);
}
	
const Game = () => {
	const canvasRef = useRef<null | HTMLCanvasElement>(null);
	const [ws, setWs] = useState<null | MySocket>(null);
	// const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);

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
			
			// Handle keyboard events to control the player paddle
			ListenOnSocket(ws, ball, computerPaddle); // socket events 
			SetEventLisners(playerPaddle, canvas, paddleSpeed); // keyboard and mouse events 
			// Start the game loop
			draw(ws, ctx, canvas, ball, playerPaddle, computerPaddle);
		}
	}, [ws])
	
	return (
		<center> 
			<canvas  ref={canvasRef}  width={600} height={300} /> 
			{/* {broadcastMessage && <p>{broadcastMessage}</p>}	 */}
		</center> 
		);
		
	}
	
	export default Game;
	
	//react componnent life cycle , useffect usestate useref
	
	
	
	function drawScore(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		ctx.font = '32px Courier New';
		ctx.fillText(playerScore.toString(), canvas.width / 2 + 40, 50);
		ctx.fillText(computerScore.toString(), canvas.width / 2 - 60, 50);
	}
	  
	function drawRounds(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		ctx.font = '32px Courier New';
		ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
	}