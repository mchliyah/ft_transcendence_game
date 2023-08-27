import { OnModuleInit } from '@nestjs/common';
// import * as canvas from 'canvas';
import {
	MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway,  WebSocketServer} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Ball, Paddle, GameData } from '../../../Types';
// import { subscribe } from 'diagnostics_channel';
import { Server } from 'socket.io';

interface player {
	id: number;
	socket: Socket;
	paddle: Paddle;
}

let otherpaddle: Paddle = { 
	x: 10,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
	dy: 3, 
};

let playerPaddle: Paddle = { 
	x: 600 - 20,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
	dy: 3,
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

const players: player[] = [];

function resetGame(ball: Ball, playerPaddle: Paddle, otherpaddle: Paddle) {
	ball.x = 600 / 2;
    ball.y = 300 / 2;
    ball.dx = 3;
    ball.dy = 3;

    playerPaddle.x = 600 - 20;
    playerPaddle.y = 300 / 2 - 50 / 2;
    playerPaddle.dy = 3;

    otherpaddle.x = 10;
    otherpaddle.y = 300 / 2 - 50 / 2;
    otherpaddle.dy = 3;
	// rounds = 3;
	// playerScore = 0;
	// computerScore = 0;

}

async function ballCollision(ball: Ball, playerPaddle: Paddle, otherpaddle: Paddle)
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
		ball.x - ball.radius <= otherpaddle.x + otherpaddle.width &&
		ball.y >= otherpaddle.y &&
		ball.y < otherpaddle.y + otherpaddle.height) {
			// console.log("computer hit the ball");
			// const hitpoint = ball.y - (otherpaddle.y + otherpaddle.height / 2);
			const hitpoint = (ball.y - otherpaddle.y) / otherpaddle.height;
			ball.dy = (hitpoint - 0.5) * 8;
			ball.dx *= -1; // Reverse the horizontal velocity of the ball
	} else if (ball.x + ball.radius > playerPaddle.x) {
		// Player misses the ball
		rounds--;
		computerScore++;
		// someonelose();
		// console.log("player miss the ball");
		resetGame(ball, playerPaddle, otherpaddle,);
	} else if (ball.x - ball.radius < otherpaddle.x) {
		// Computer misses the ball
		rounds--;
		playerScore++;
		// someonelose();
		// console.log("computer miss the ball");
		resetGame(ball, playerPaddle, otherpaddle);
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
		console.log("connected as " + Client + " , and  number of players: " + players.length);
		if (players.length < 2) {
			const playerId = players.length + 1;
			const playerpad = playerId === 1 ? playerPaddle : otherpaddle;
			const newplayer: player = { id: playerId, socket: Client, paddle: playerpad };
			players.push(newplayer);
			
			ball.x = 300;
			ball.y = 150;
			const gameData: GameData = {
				playerPaddle: playerPaddle,
				otherpaddle: otherpaddle,
				ball: ball,
				playerScore: playerScore,
				computerScore: computerScore,
				rounds: rounds,
			};
			this.server.emit('InitGame', gameData);
		}
		else {
			Client.disconnect();
		}
	}

	handleDisconnect() {
		this.server.on('disconnect', (socket) => {
			players.splice(players.findIndex((p) => p.socket === socket.id), 1); //remove the player from the array
		console.log('Client disconnected: ', socket.id); //print the message on conssole when the client disconnected 
	});
	}

	@SubscribeMessage('UpdatePadlle') // Decorate with the event name from the frontend
	handleUpdatpadlle(client: any, data: Paddle) {
		const player = players.find((p) => p.socket === client.id);
		if (player) {
			console.log('UpdatePadlle: ' + data + ' from ' + client.id);
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
				otherpaddle.dy += otherpaddle.dy > 0 ? increaseSpeed : -increaseSpeed;
			}
			// Update paddle positions based on their velocity
			// if (ball.y > otherpaddle.y + otherpaddle.height / 2) {
			// otherpaddle.y += otherpaddle.dy;
			// } else {
			// 	otherpaddle.y -= otherpaddle.dy;
			// // }
			// otherpaddle.y = Math.max(otherpaddle.y, 0);
			// otherpaddle.y = Math.min(otherpaddle.y, 300 - otherpaddle.height); 

			ballCollision(ball, playerPaddle, otherpaddle);

			const gameData: GameData = {
				playerPaddle: playerPaddle,
				otherpaddle: otherpaddle,
				ball: ball,
				playerScore: playerScore,
				computerScore: computerScore,
				rounds: rounds,
			};
			this.server.emit('UpdateData', gameData);
			// client.broadcast.emit('UpdateData', gameData);
		}
	}
}