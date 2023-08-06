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
// import { subscribe } from 'diagnostics_channel';

@WebSocketGateway()

export class Mygetway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server
	private ball: typeof ball;
	private playerPaddle: typeof playerPaddle;

	constructor() {
		this.ball = {
			x: canvas.width / 2, // The ball's starting x-position
			y: canvas.height / 2, // The ball's starting y-position
			radius: 5,
			dx: 3, // The ball's horizontal velocity
			dy: 3 // The ball's vertical velocity
		};

		this.playerPaddle = {
			x: canvas.width - paddleWidth - 10, // The player paddle's starting x-position
			y: canvas.height / 2 - paddleHeight / 2, // The player paddle's starting y-position
			width: paddleWidth,	
			height: paddleHeight,
			dy: 0 // The player paddle's vertical velocity
		};
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('New connection on socket id: ', socket.id);

		});
		this.updatePositions();
	}

	handleConnection(socket: Socket) {
		socket.emit('initialePosition', {ball: this.ball, playerPaddle: this.playerPaddle});
	}

	handleDisconnect() {
		this.server.on('disconnect', (socket) => {
		console.log('Client disconnected: ', socket.id);
	});
	}

	@SubscribeMessage('moeve paddle')
	
	onMovePaddle(@MessageBody() position: number) {
		this.playerPaddle.y = position;
	}

	updatePositions() {
		// Update the ball's position
		this.server.emit('position', {ball: this.ball, playerPaddle: this.playerPaddle});
		setTimeout(() => this.updatePositions(), 1000 / 60); // 60 frames per second
	}

	@SubscribeMessage('replay message')
	onReplayMessage(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('onreplay', {
			msg : 'reply message',
			content: body,
		});
	}
}