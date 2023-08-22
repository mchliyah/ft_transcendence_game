import { OnModuleInit } from '@nestjs/common';
// import * as canvas from 'canvas';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway, 
	WebSocketServer} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { subscribe } from 'diagnostics_channel';
import { Server } from 'socket.io';

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

interface GameData {
	playerPaddle: Paddle;
	computerPaddle: Paddle;
	ball: Ball;
}

let computerPaddle: Paddle = { 
	x: 10,
	y: 300 / 2 - 50 / 2,
	width: 10,
	height: 50,
	dy: 0, 
};

let playerPaddle: Paddle = { 
	x: 600 - 20,
	y: 300 / 2 - 50 / 2,
	width: 10,
	height: 80,
	dy: 0,
};

let ball: Ball = { 
	x: 600 / 2,
	y: 300 / 2,
	radius: 5,
	dx: 3,
	dy: 3 
};

let playerScore : number = 0;
let computerScore : number = 0;
let rounds : number = 3;
let interval : number = 1000;
let lastSpeedIncrease : number = 0;
let increaseSpeed : number = 0.2;

// let canvas : HTMLCanvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;



function resetGame(ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle) {
	// Reset player paddle position
	playerPaddle.y = 150 - playerPaddle.height / 2;
	// Reset computer paddle position
	computerPaddle.y = 150 - computerPaddle.height / 2;
	// Reset ball position
	// ball.x = canvas.width / 2;
	ball.x = 300;
	ball.y = 150;
	// ball.y = canvas.height / 2;
	// Reset ball velocity
	ball.dx = Math.random() > 0.5 ? 3 : -3; // Randomize the horizontal velocity
	ball.dy = Math.random() > 0.5 ? 3 : -3; // Randomize the vertical velocity
}

function ballCollision(ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle)
{
	
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
				// rounds--;
				// computerScore++;
				// someonelose();
				resetGame(ball, playerPaddle, computerPaddle,);
			} else if (ball.x - ball.radius < computerPaddle.x - computerPaddle.width) {
				// Computer misses the ball
				// rounds--;
				// playerScore++;
				// someonelose();
				resetGame(ball, playerPaddle, computerPaddle);
			}
		}
		
@WebSocketGateway()
export class Mygetway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()

		server: Server;
			
			
	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('New connection on socket id: ', socket.id);//print the message on conssole when the client connected 
			// console.log(`${JSON.stringify(socket.client.request.headers, undefined, 4)}`);
		});
	}

	handleConnection(Client: Socket) {
		//this.server.emit('BallPosition', {ball: this.BallPosition});
		console.log("connected !!");
		ball.x = 300;
		ball.y = 150;
		const gameData: GameData = {
			playerPaddle: playerPaddle,
			computerPaddle: computerPaddle,
			ball: ball,
		};
		this.server.emit('InitGame', gameData);
	}

	handleDisconnect() {
		this.server.on('disconnect', (socket) => {
		console.log('Client disconnected: ', socket.id); //print the message on conssole when the client disconnected 
	});
	}

	@SubscribeMessage('UpdateGameData') // Decorate with the event name from the frontend
	handleUpdateGameData(client: any, data: Paddle) {
	  playerPaddle = data;
	  // calculate ball position on canvas
	  ball.x += ball.dx;
	  ball.y += ball.dy;
	if (ball.y + ball.radius > 300 || ball.y - ball.radius < 0) {
		ball.dy *= -1; // Reverse the vertical velocity of the ball
	}

	ballCollision(ball, playerPaddle, computerPaddle);

	  // calculate computer paddle position on canvas
	  computerPaddle.y += computerPaddle.dy;
	  // calculate player paddle position on canvas
		const gameData: GameData = {
			playerPaddle: playerPaddle,
			computerPaddle: computerPaddle,
			ball: ball,
		};
		this.server.emit('UpdateData', gameData);
		// client.broadcast.emit('UpdateData', gameData);
	}
}