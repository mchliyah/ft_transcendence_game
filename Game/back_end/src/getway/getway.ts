import { Injectable, OnModuleInit } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Ball, Paddle, GameData } from '../../../Types';
import { Server } from 'socket.io';
import { interval, take } from 'rxjs';
// import {exit} from 'process';

interface Player {
	id: number;
	socket: Socket;
	paddle: Paddle;
	room: string;
}


class Room {
	players: Player[] = [];
	ball: Ball = defaultBall;
	roomName: string = "";
	}

const defaultPaddle: Paddle = {
	x: 600 - 20,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
	dy: 3,
};

const defaultOtherPaddle: Paddle = {
	x: 10,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
	dy: 3,
};

const defaultBall: Ball = {
	x: 600 / 2,
	y: 300 / 2,
	radius: 5,
	dx: 3,
	dy: 3,
};

const INITIAL_SCORE = { player: 0, computer: 0 };
const ROUNDS = 3;
const INTERVAL = 16;
const INCREASE_SPEED = 0.2;

@WebSocketGateway()
@Injectable()
export class MyGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

//	 private players: Player[] = [];
	private rooms: Map<string, Room> = new Map();
	private gameInterval: any;
	private gameActive = false;

	onModuleInit() {
		// Initialize env variables if nedded not socket
	}

	handleConnection(client: any) {
		console.log('Client connected: ', client.id);

		let room : Room | undefined;

	for (const existRoom of this.rooms.values()) {
		if (existRoom.players.length === 1) {
			room = existRoom;
			break;
		}
	}

	if (!room) {
		room = new Room();
		room.roomName = Math.random().toString(36).substring(7);
		this.rooms.set(room.roomName, room);
		room.players.push({ id: room.players.length + 1, socket: client, paddle: defaultPaddle, room: room.roomName });
		client.join(room.roomName);
		client.emit('JoinRoom', room.roomName);
		let gamedata: GameData = {
			playerpad: defaultPaddle,
			otherpad: defaultOtherPaddle,
			ball: defaultBall,
			playerScore: INITIAL_SCORE.player,
			otherScore: INITIAL_SCORE.computer,
			rounds: ROUNDS,
			id: room.players.length + 1,
			padlleSpeed: 3,
		};
		client.emit('InitGame', gamedata);
	}
	else
	{
		room.players.push({ id: room.players.length + 1, socket: client, paddle: defaultOtherPaddle, room: room.roomName });
		client.join(room.roomName);
		client.emit('JoinRoom', room.roomName);
		const gamedata: GameData = {
			playerpad: defaultOtherPaddle,
			otherpad: defaultPaddle,
			ball: defaultBall,
			playerScore: INITIAL_SCORE.player,
			otherScore: INITIAL_SCORE.computer,
			rounds: ROUNDS,
			id: room.players.length + 1,
			padlleSpeed: 3,
		};
		client.emit('InitGame', gamedata);
		this.server.to(room.roomName).emit('StartGame', room.roomName);
		this.startGame(room);
		this.gameActive = true;
	}
}

handleDisconnect(client: any) {
	const room = this.findRoomByPlayerSocket(client);
	
	if (room) {
		room.players = room.players.filter((player) => player.socket !== client);
		if (room.players.length < 2) {
			this.stopGame();
			this.gameActive = false;
			this.rooms.delete(room.roomName); // Remove the room if it's empty
		}
	}
}

private findRoomByPlayerSocket(socket: any): Room | undefined {
	for (const room of this.rooms.values()) {
		const playerInRoom = room.players.find((player) => player.socket === socket);
		if (playerInRoom) {
			return room;
		}
	}
	return undefined;
}

	@SubscribeMessage('UpdatePlayerPaddle')
	handleUpdatePaddle(client: any, paddle: Paddle) {
	const room = this.findRoomByPlayerSocket(client);

	if (room) {
		const player = room.players.find((p) => p.socket === client);
	
		if (player) {
			player.paddle = paddle;
			// Emit the updated paddle to the other player in the same room
		// 	const otherPlayer = room.players.find((p) => p !== player);
		// 	if (otherPlayer) {
		// 		console.log('PLAYE ', player.id, 'PADDLE ', player.paddle,  ' OTHER ', otherPlayer.id, 'PADDLE ', otherPlayer.paddle);
		// 		otherPlayer.socket.emit('SET_OTHER_PADDLE', player.paddle);
		// }
		}
	}
}

private startGame(room: Room) {
	console.log("startGame");
	if (!this.gameActive) {
		this.gameActive = true;
		this.gameInterval = interval(INTERVAL).subscribe(() => {
			if (!this.gameActive) {
			this.gameInterval.unsubscribe();
			return;
			}
			this.updateGame(room);
		});
	}
}

private stopGame() {
	console.log("stopGame");
		this.gameActive = false;
	if (this.gameInterval)
		this.gameInterval.unsubscribe();
}

private updateGame(room: Room) {
	// Calculate the new ball position based on its current position and velocity
	room.ball.x += room.ball.dx;
	room.ball.y += room.ball.dy;
	let newgameData 
	// Check for collisions with top and bottom walls
	if (room.ball.y - room.ball.radius < 0 || room.ball.y + room.ball.radius > 300) {
		room.ball.dy *= -1; // Reverse the vertical velocity of the ball
	}

	// Check for collisions with paddles
	for (const player of room.players) {
		const otherPlayer = room.players.find((p) => p !== player);
		if (
			room.ball.x + room.ball.radius >= player.paddle.x &&
			room.ball.y >= player.paddle.y &&
			room.ball.y < player.paddle.y + player.paddle.height
		) {
			// Ball hits the player's paddle
			room.ball.dx *= -1; // Reverse the horizontal velocity of the ball
		} else if (
			room.ball.x - room.ball.radius <= otherPlayer.paddle.x + otherPlayer.paddle.width &&
			room.ball.y >= otherPlayer.paddle.y &&
			room.ball.y < otherPlayer.paddle.y + otherPlayer.paddle.height
		) {
			// Ball hits the other player's paddle
			room.ball.dx *= -1; // Reverse the horizontal velocity of the ball
		}

		// Check for scoring conditions
		if (room.ball.x + room.ball.radius > 600) {
			// Player misses the ball
		//	 computerScore++;
			this.resetBall(room.ball);
		} else if (room.ball.x - room.ball.radius < 0) {
			// Other player misses the ball
		//	 playerScore++;
			this.resetBall(room.ball);
		}
		// Emit updated ball position to the current player and the other player paddle
		player.socket.emit('UPDATE', room.ball, otherPlayer.paddle);
		otherPlayer.socket.emit('UPDATE', room.ball, player.paddle);
		break;
		}
}

private resetBall(ball: Ball) {
		ball.x = 600 / 2;
		ball.y = 300 / 2;
		ball.dx = 3;
		ball.dy = 3;
	}
}
