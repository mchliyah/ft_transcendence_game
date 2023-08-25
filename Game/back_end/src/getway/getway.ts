import { OnModuleInit } from '@nestjs/common';
// import * as canvas from 'canvas';
import {
	MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway,  WebSocketServer} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Ball, Paddle, GameData } from '../../../Types';
// import { subscribe } from 'diagnostics_channel';
import { Server } from 'socket.io';


let computerPaddle: Paddle = { 
	x: 10,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
	dy: 0, 
};

let playerPaddle: Paddle = { 
	x: 600 - 20,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
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
	ball.x = 600 / 2;
    ball.y = 300 / 2;
    ball.dx = 3;
    ball.dy = 3;

    playerPaddle.x = 600 - 20;
    playerPaddle.y = 300 / 2 - 50 / 2;
    playerPaddle.dy = 3;

    computerPaddle.x = 10;
    computerPaddle.y = 300 / 2 - 50 / 2;
    computerPaddle.dy = 3;
	// rounds = 3;
	// playerScore = 0;
	// computerScore = 0;

}

async function ballCollision(ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle)
{
	if (
		ball.x + ball.radius >= playerPaddle.x &&
		ball.y >= playerPaddle.y &&
		ball.y < playerPaddle.y + playerPaddle.height
		){
			// console.log("player hit the ball");
			// const hitpoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
			// ball.dy = hitpoint * 0.2;
			const hitpoint = (ball.y - playerPaddle.y) / playerPaddle.height;
			ball.dy = (hitpoint - 0.5) * 8;
			ball.dx *= -1; // Reverse the horizontal velocity of the ball
	} else if (
		ball.x - ball.radius <= computerPaddle.x + computerPaddle.width &&
		ball.y >= computerPaddle.y &&
		ball.y < computerPaddle.y + computerPaddle.height) {
			// console.log("computer hit the ball");
			// const hitpoint = ball.y - (computerPaddle.y + computerPaddle.height / 2);
			const hitpoint = (ball.y - computerPaddle.y) / computerPaddle.height;
			ball.dy = (hitpoint - 0.5) * 8;
			ball.dx *= -1; // Reverse the horizontal velocity of the ball
	} else if (ball.x + ball.radius > playerPaddle.x) {
		// Player misses the ball
		rounds--;
		computerScore++;
		// someonelose();
		// console.log("player miss the ball");
		resetGame(ball, playerPaddle, computerPaddle,);
	} else if (ball.x - ball.radius < computerPaddle.x) {
		// Computer misses the ball
		rounds--;
		playerScore++;
		// someonelose();
		// console.log("computer miss the ball");
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
			playerScore: playerScore,
			computerScore: computerScore,
			rounds: rounds,
		};
		this.server.emit('InitGame', gameData);
	}

	handleDisconnect() {
		this.server.on('disconnect', (socket) => {
		console.log('Client disconnected: ', socket.id); //print the message on conssole when the client disconnected 
	});
	}

	@SubscribeMessage('UpdatePadlle') // Decorate with the event name from the frontend
	handleUpdateGameData(client: any, data: Paddle) {
		playerPaddle = data;

		//calculate ball position on canvas
		ball.x += ball.dx;
		ball.y += ball.dy;
		if(ball.y + ball.radius > 300 || ball.y - ball.radius < 0) {
			ball.dy *= -1; // Reverse the vertical velocity of the ball
		}

		if (Date.now() - lastSpeedIncrease > interval) {
			lastSpeedIncrease = Date.now();
			ball.dx += ball.dx > 0 ? increaseSpeed : -increaseSpeed;
			ball.dy += ball.dy > 0 ? increaseSpeed : -increaseSpeed;
			computerPaddle.dy += computerPaddle.dy > 0 ? increaseSpeed : -increaseSpeed;
		}
		// Update paddle positions based on their velocity
		if (ball.y > computerPaddle.y + computerPaddle.height / 2) {
		computerPaddle.y += computerPaddle.dy;
		} else {
			computerPaddle.y -= computerPaddle.dy;
		}
		computerPaddle.y = Math.max(computerPaddle.y, 0);
    	computerPaddle.y = Math.min(computerPaddle.y, 300 - computerPaddle.height); 

		ballCollision(ball, playerPaddle, computerPaddle);

		// calculate computer paddle position on canvas
		// calculate player paddle position on canvas
		const gameData: GameData = {
			playerPaddle: playerPaddle,
			computerPaddle: computerPaddle,
			ball: ball,
			playerScore: playerScore,
			computerScore: computerScore,
			rounds: rounds,
		};
		this.server.emit('UpdateData', gameData);
		// client.broadcast.emit('UpdateData', gameData);
	}
}