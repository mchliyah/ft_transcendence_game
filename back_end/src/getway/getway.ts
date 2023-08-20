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

let playerScore : number = 0;
let computerScore : number = 0;
let rounds : number = 3;
let interval : number = 1000;
let lastSpeedIncrease : number = 0;
let increaseSpeed : number = 0.2;

@WebSocketGateway()

export class Mygetway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

	private computerPaddle: Paddle = { 
		x: 10,
		y: 300 / 2 - 50 / 2,
		width: 10,
		height: 50,
		dy: 0, 
	};

	private playerPaddle: Paddle = { 
		x: 600 - 20,
		y: 300 / 2 - 50 / 2,
		width: 10,
		height: 50,
		dy: 0, 
	};

	private ball: Ball = { 
		x: 600 / 2,
		y: 300 / 2,
		radius: 5,
		dx: 3,
		dy: 3 
	};

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
		const gameData: GameData = {
			playerPaddle: this.playerPaddle,
			computerPaddle: this.computerPaddle,
			ball: this.ball,
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
	console.log('Received game data:', data);
	  this.playerPaddle = data;
		const gameData: GameData = {
			playerPaddle: this.playerPaddle,
			computerPaddle: this.computerPaddle,
			ball: this.ball,
		};
		this.server.emit('UpdateData', gameData);
		// client.broadcast.emit('UpdateData', gameData);
	}
}