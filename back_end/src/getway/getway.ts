import { OnModuleInit } from '@nestjs/common';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway, 
	WebSocketServer} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';

interface BallPosition {
	x: number;
	y: number;
}

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

@WebSocketGateway()

export class Mygetway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

	private BallPosition: BallPosition = {x : 0, y : 0};
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
	}

	handleDisconnect() {
		this.server.on('disconnect', (socket) => {
		console.log('Client disconnected: ', socket.id); //print the message on conssole when the client disconnected 
	});
	}

	@SubscribeMessage('updateGameData') // Decorate with the event name from the frontend
	handleUpdateGameData(client: any, data: GameData) {

	  console.log('Received game data:');
	//   console.log('Received game data:', data);
  
	  // broadcast the data to all clients except the sender
	  client.broadcast.emit('gameDataUpdated', data);
	}

	// @SubscribeMessage('updateGameData')
	// handleupdateGameData(@MessageBody() data: GameData) {
	// 	console.log('updateGameData');
	// 	// console.log(data);
	// }
}