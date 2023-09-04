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

interface Player {
  id: number;
  socket: Socket;
  paddle: Paddle;
  otherpaddle: Paddle;
  room: string;
}

const defaultPaddle: Paddle = {
  x: 10,
  y: 300 / 2 - 50 / 2,
  width: 5,
  height: 60,
  dy: 3,
};

const defaultOtherPaddle: Paddle = {
	x: 600 - 20,
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
const INTERVAL = 1000;
const INCREASE_SPEED = 0.2;

@WebSocketGateway()
@Injectable()
export class MyGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private players: Player[] = [];
  private rooms: Map<string, Player[]> = new Map();
  private gameInterval: any;

  onModuleInit() {
    // Initialize your socket server here
  }

  handleConnection(client: any) {
    console.log('Client connected: ', client.id);

    let roomFound = false;

    for (const [room, players] of this.rooms.entries()) {
      if (players.length === 1) {
        roomFound = true;
        players.push({ id: 2, socket: client, paddle: defaultPaddle, otherpaddle: defaultOtherPaddle, room });
        client.join(room);
        client.emit('JoinRoom', room);
        this.server.to(room).emit('StartGame', room);
        break;
      }
    }

    if (!roomFound) {
      const room = Math.random().toString(36).substring(7);
      this.rooms.set(room, [{ id: 1, socket: client, paddle: defaultPaddle, otherpaddle: defaultOtherPaddle, room }]);
      client.join(room);
      client.emit('JoinRoom', room);
    }

    if (this.rooms.size >= 2) {
      this.startGame();
    }
  }

  handleDisconnect(client: any) {
    const roomToRemove = this.players.find((p) => p.socket === client);
    if (roomToRemove) {
      this.rooms.delete(roomToRemove.room);
    }

    this.players = this.players.filter((player) => player.socket !== client);

    console.log('Client disconnected: ', client.id);

    if (this.players.length < 2) {
      this.stopGame();
    }
  }

  @SubscribeMessage('UpdatePaddle')
  handleUpdatePaddle(client: any, data: Paddle) {
    const player = this.players.find((p) => p.socket === client);

    if (player) {
      player.paddle = data;

      const gameData: GameData = {
        playerPaddle: player.paddle,
        otherPaddle: this.getOtherPaddle(player),
        ball: defaultBall,
        playerScore: INITIAL_SCORE.player,
        computerScore: INITIAL_SCORE.computer,
        rounds: ROUNDS,
      };

      this.server.to(player.room).emit('UpdateData', gameData);
    }
  }

  startGame() {
    this.gameInterval = interval(INTERVAL)
      .pipe(take(ROUNDS))
      .subscribe(() => {
        // Update game logic here
        this.updateGame();
      });
  }

  stopGame() {
    if (this.gameInterval) {
      this.gameInterval.unsubscribe();
    }
  }

  private updateGame() {
    // Update game logic here
	
    const gameData: GameData = {
		playerPaddle: defaultPaddle,
		otherPaddle: defaultPaddle,
		ball: defaultBall,
		playerScore: INITIAL_SCORE.player,
		computerScore: INITIAL_SCORE.computer,
		rounds: ROUNDS,
    };
	
	// Calculate ball position and collisions
    for (const player of this.players) {
		gameData.playerPaddle = player.paddle;
		gameData.otherPaddle = this.getOtherPaddle(player);
	
		// Calculate the new ball position based on its current position and velocity
		gameData.ball.x += gameData.ball.dx;
		gameData.ball.y += gameData.ball.dy;
	
		// Check for collisions with top and bottom walls
		if (gameData.ball.y - gameData.ball.radius < 0 || gameData.ball.y + gameData.ball.radius > 300) {
		  gameData.ball.dy *= -1; // Reverse the vertical velocity of the ball
		}
	
		// Check for collisions with paddles
		if (
		  gameData.ball.x + gameData.ball.radius >= gameData.playerPaddle.x &&
		  gameData.ball.y >= gameData.playerPaddle.y &&
		  gameData.ball.y < gameData.playerPaddle.y + gameData.playerPaddle.height
		) {
		  // Ball hits the player's paddle
		  gameData.ball.dx *= -1; // Reverse the horizontal velocity of the ball
		} else if (
		  gameData.ball.x - gameData.ball.radius <= gameData.otherPaddle.x + gameData.otherPaddle.width &&
		  gameData.ball.y >= gameData.otherPaddle.y &&
		  gameData.ball.y < gameData.otherPaddle.y + gameData.otherPaddle.height
		) {
		  // Ball hits the other player's paddle
		  gameData.ball.dx *= -1; // Reverse the horizontal velocity of the ball
		}
	
		// Check for scoring conditions
		if (gameData.ball.x + gameData.ball.radius > 600) {
		  // Player misses the ball
		  gameData.computerScore++;
		  this.resetBall(gameData.ball);
		} else if (gameData.ball.x - gameData.ball.radius < 0) {
		  // Other player misses the ball
		  gameData.playerScore++;
		  this.resetBall(gameData.ball);
		}
	  }
	
	  // Emit game data to all players in the room
	  for (const player of this.players) {
		this.server.to(player.room).emit('UpdateData', gameData);
	  }
	}

	private getOtherPaddle(player: Player): Paddle {
		const otherPlayer = this.players.find((p) => p !== player && p.room === player.room);
		return otherPlayer ? otherPlayer.paddle : defaultOtherPaddle;
	}

	private resetBall(ball: Ball) {
		ball.x = 600 / 2;
		ball.y = 300 / 2;
		ball.dx = 3;
		ball.dy = 3;
	}
}


// import { Injectable, OnModuleInit } from '@nestjs/common';
// // import * as canvas from 'canvas';
// import {
// 	MessageBody,
// 	OnGatewayConnection,
// 	OnGatewayDisconnect,
// 	SubscribeMessage,
// 	WebSocketGateway,
// 	WebSocketServer
// 	} from '@nestjs/websockets';
// import { Socket } from 'dgram';
// import { Ball, Paddle, GameData } from '../../../Types';
// // import { subscribe } from 'diagnostics_channel';
// import { Server } from 'socket.io';
// import { interval , take} from 'rxjs';


// type Action =
// 	| { type: 'SET_PLAYER_PADDLE'; payload: Paddle }
// 	| { type: 'SET_OTHER_PADDLE'; payload: Paddle }
// 	| { type: 'SET_BALL'; payload: Ball }
// 	| { type: 'SET_GAME_DATA'; payload: GameData };

// interface Player {
// 	id: number;
// 	socket: Socket;
// 	paddle: Paddle;
// 	room: string;
// }

// let otherpaddle: Paddle = { 
// 	x: 10,
// 	y: 300 / 2 - 50 / 2,
// 	width: 5,
// 	height: 60,
// 	dy: 3, 
// };

// let playerPaddle: Paddle = { 
// 	x: 600 - 20,
// 	y: 300 / 2 - 50 / 2,
// 	width: 5,
// 	height: 60,
// 	dy: 3,
// };

// let ball: Ball = { 
// 	x: 600 / 2,
// 	y: 300 / 2,
// 	radius: 5,
// 	dx: 3,
// 	dy: 3 
// };

// let playerScore : number = 0;
// let computerScore : number = 0;
// let rounds : number = 3;
// let Interval : number = 1000;
// let lastSpeedIncrease : number = 0;
// let increaseSpeed : number = 0.2;

// // let canvas : HTMLCanvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;

// const players: Player[] = [];
// const rooms: Map<string, Player[]> = new Map();

// function resetGame(ball: Ball, playerPaddle: Paddle, otherpaddle: Paddle) {
// 	ball.x = 600 / 2;
//     ball.y = 300 / 2;
//     ball.dx = 3;
//     // ball.dy = 3;

//     playerPaddle.x = 600 - 20;
//     playerPaddle.y = 300 / 2 - 50 / 2;
//     // playerPaddle.dy = 3;

//     otherpaddle.x = 10;
//     otherpaddle.y = 300 / 2 - 50 / 2;
//     // otherpaddle.dy = 3;
// 	// rounds = 3;
// 	// playerScore = 0;
// 	// computerScore = 0;

// }

// async function ballCollision(ball: Ball, playerPaddle: Paddle, otherpaddle: Paddle)
// {
// 	if (
// 		ball.x + ball.radius >= playerPaddle.x &&
// 		ball.y >= playerPaddle.y &&
// 		ball.y < playerPaddle.y + playerPaddle.height
// 		){
// 			// console.log("player hit the ball");
// 			// const hitpoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
// 			// ball.dy = hitpoint * 0.2;
// 			const hitpoint = (ball.y - playerPaddle.y) / playerPaddle.height;
// 			ball.dy = (hitpoint - 0.5) * 8;
// 			ball.dx *= -1; // Reverse the horizontal velocity of the ball
// 	} else if (
// 		ball.x - ball.radius <= otherpaddle.x + otherpaddle.width &&
// 		ball.y >= otherpaddle.y &&
// 		ball.y < otherpaddle.y + otherpaddle.height) {
// 			// console.log("computer hit the ball");
// 			// const hitpoint = ball.y - (otherpaddle.y + otherpaddle.height / 2);
// 			const hitpoint = (ball.y - otherpaddle.y) / otherpaddle.height;
// 			ball.dy = (hitpoint - 0.5) * 8;
// 			ball.dx *= -1; // Reverse the horizontal velocity of the ball
// 	} else if (ball.x + ball.radius > playerPaddle.x) {
// 		// Player misses the ball
// 		rounds--;
// 		computerScore++;
// 		// someonelose();
// 		// console.log("player miss the ball");
// 		resetGame(ball, playerPaddle, otherpaddle,);
// 	} else if (ball.x - ball.radius < otherpaddle.x) {
// 		// Computer misses the ball
// 		rounds--;
// 		playerScore++;
// 		// someonelose();
// 		// console.log("computer miss the ball");
// 		resetGame(ball, playerPaddle, otherpaddle);
// 	}
// }

// @WebSocketGateway()
// @Injectable()

// export class Mygetway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

// 	@WebSocketServer()

// 	server: Server;

// 	onModuleInit() {
// 		this.server.on('connection', (socket) => {
// 			console.log('New connection on socket id: ', socket.id);//print the message on conssole when the client connected 
// 			// console.log(`${JSON.stringify(socket.client.request.headers, undefined, 4)}`);
// 		});
// 	}
		
// 	handleConnection(Client: Socket) {
// 		console.log('Client connected: ', Client.id); //print the message on conssole when the client connected
// 		let roomfound = false;
// 		for (const [room, players] of rooms.entries()) {
// 			if (players.length === 1) {
// 				roomfound = true;
// 				players.push({ id: 2, socket: Client, paddle: playerPaddle, room: room });
// 				Client.join(room);
// 				Client.emit('JoinRoom', room);
// 				this.server.to(room).emit('StartGame', room);
// 				break;
// 			}
// 		}
// 		if (!roomfound) {
// 			const room = Math.random().toString(36).substring(7);
// 			rooms.set(room, [{ id: 1, socket: Client, paddle: otherpaddle, room: room }]);
// 			Client.join(room);
// 			Client.emit('JoinRoom', room);
// 		}

// 		if (rooms.size >= 2) {
// 			//sart the game when the two players are connected
// 			this.startGame();
// 		}
// 	}

// 	handleDisconnect() {
// 		this.server.on('disconnect', (socket) => {
// 			players.splice(players.findIndex((p) => p.socket === socket.id), 1); //remove the player from the array
// 		console.log('Client disconnected: ', socket.id); //print the message on conssole when the client disconnected 
// 	});
// 	}

// 	@SubscribeMessage('UpdatePadlle') // Decorate with the event name from the frontend
// 	handleUpdatpadlle(client: any, data: Paddle) {
// 		// const player: Player | undefined = players.find((p) => p.socket === client.socket);
// 		// // exit(0);
// 		// if (player) {
// 			// console.log('UpdatePadlele: ' + data + ' from ' + client.id);
// 			playerPaddle = data;
// 			//calculate ball position on canvas
// 			ball.x += ball.dx;
// 			ball.y += ball.dy;
// 			if(ball.y + ball.radius > 300 || ball.y - ball.radius < 0) {
// 				ball.dy *= -1; // Reverse the vertical velocity of the ball
// 			}
// 			if (Date.now() - lastSpeedIncrease > Interval) {
// 				lastSpeedIncrease = Date.now();
// 				ball.dx += ball.dx > 0 ? increaseSpeed : -increaseSpeed;
// 				ball.dy += ball.dy > 0 ? increaseSpeed : -increaseSpeed;
// 				otherpaddle.dy += otherpaddle.dy > 0 ? increaseSpeed : -increaseSpeed;
// 			}
// 			ballCollision(ball, playerPaddle, otherpaddle);

// 			const gameData: GameData = {
// 				playerPaddle: playerPaddle,
// 				otherpaddle: otherpaddle,
// 				ball: ball,
// 				playerScore: playerScore,
// 				computerScore: computerScore,
// 				rounds: rounds,
// 			};
// 			// this.server.emit('UpdateData', gameData);
// 			// client.broadcast.emit('UpdateData', gameData);
// 		// }
// 	}

// 	startGame() {
// 		// need to initialize the game

// 		.pipe(take(rounds))
// 		.subscribe(() => {
// 			// update the game
// 			const gameData: GameData = {
// 				playerPaddle: playerPaddle,
// 				otherpaddle: otherpaddle,
// 				ball: ball,
// 				playerScore: playerScore,
// 				computerScore: computerScore,
// 				rounds: rounds,
// 			};
// 			this.server.emit('UpdateData', gameData);
// 		});
// }