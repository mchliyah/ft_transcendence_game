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


@WebSocketGateway()

export class Mygetway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

	private BallPosition: BallPosition = {x : 0, y : 0};
	@WebSocketServer()
	
	server: Server;


	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('New connection on socket id: ', socket.id);
		});
	}

	handleConnection(Client: Socket) {
		this.server.emit('BallPosition', {ball: this.BallPosition});
	}

	handleDisconnect() {
		this.server.on('disconnect', (socket) => {
		console.log('Client disconnected: ', socket.id);
	});
	}

	@SubscribeMessage('move paddle')
	
	  // Handle ball position update from the client
	  @SubscribeMessage('updateBallPosition')
	  handleUpdateBallPosition(@MessageBody() data: BallPosition) {
		// Update the ball position in the backend
		this.BallPosition = data;
	
		// Broadcast the updated ball position to all connected clients
		this.server.emit('BallPositionUpdate', { ball: this.BallPosition });
		console.log('Ball position updated: ', this.BallPosition);
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