// import { Socket } from 'dgram';
import { Subscription } from 'rxjs';
export class Paddle {
  constructor(x: number, y: number, width: number, height: number, dy: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dy = dy;
  }
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

export class Ball {
  constructor(x: number, y: number, radius: number, dx: number, dy: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
  }
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}
export interface GameData {
  playerpad: Paddle;
  otherpad: Paddle;
  ball: Ball;
  playerScore: number;
  otherScore: number;
  rounds: number;
  containerHeight: number;
  containerWidth: number;
  id: number;
}

export class Player {
  constructor(
    id: number,
    socket_id: string,
    paddle: Paddle,
    room: string,
    score: number,
  ) {
    this.id = id;
    this.socket_id = socket_id;
    this.paddle = paddle;
    this.room = room;
    this.score = score;
  }
  id: number;
  socket_id: string;
  paddle: Paddle;
  room: string;
  score: number;
}

export interface IventMouse {
  y: number;
  top: number;
  hight: number;
  width: number;
}

export class Room {
  constructor(roomName: string) {
	this.id = null
    this.roomName = roomName;
    this.players = [];
    this.gameActive = false;
    this.gameInterval = null;
    this.lastspeedincrease = Date.now();
    this.ball = new Ball(500, 500, 10, 3, 3);
    this.rounds = 5;
  }
  id: number;
  roomName: string;
  players: Player[];
  gameActive: boolean;
  gameInterval: Subscription;
  lastspeedincrease: number;
  ball: Ball;
  rounds: number;
}

// export interface MatchData {
// 	start: Date;
// 	result: string;
// 	playerAId: number;
// 	playerBId: number;
// 	winnerId: number;
// }


export const INTERVAL = 16.66;
export const INCREASE_SPEED = 0.2;
export const SPEED_INTERVAL = 1000;
