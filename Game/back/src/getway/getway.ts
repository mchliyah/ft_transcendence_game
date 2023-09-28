import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { interval } from 'rxjs';
import { colision } from './colision';
import {
  GameData,
  Room,
  Paddle,
  INTERVAL,
  INCREASE_SPEED,
  SPEED_INTERVAL,
  Player,
} from './types';

import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { match } from 'assert';

@WebSocketGateway()
@Injectable()
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  // In your WebSocket gateway class
  private activeSockets: Map<string, Socket> = new Map();

  private rooms: Map<string, Room> = new Map();
  constructor(private prisma: PrismaService) {} // Inject the PrismaService

  //onModuleInit() {}
  private containerWidth = 1080;
  private containerHeight = 720;
  private async createMatch(room: Room) {
    const match = await this.prisma.match
      .create({
        data: {
          start: new Date(),
          result: 'ongoing',
        },
      })
      .then((match) => {
        console.log(`Created match with ID: ${match.id}`);
        // You can store the match ID or use it as needed
		room.id = match.id;
      })
      .catch((error) => {
        console.error('Error creating match:', error);
      });
  }

  async handleConnection(client: Socket) {
    try {
      this.activeSockets.set(client.id, client);
      console.log('Client connected: ', client.id);
      const identifier = client.handshake.query.identifier;
      console.log('identifier: ', identifier);
      const user = await this.prisma.user.findUnique({
        where: { email: 'mchliyah@student.1337.ma' },
      });
      console.log('user: ', user);
      let exist = false;
      const padd = new Paddle(10, this.containerHeight / 2, 8, 80, 3);
      const otherpadd = new Paddle(
        this.containerWidth - 10,
        this.containerHeight / 2,
        8,
        80,
        3,
      );

      for (const existRoom of this.rooms.values()) {
        console.log(
          'at room ',
          existRoom.roomName,
          ' players ',
          existRoom.players.length,
        );
        if (existRoom.players.length === 1) {
          exist = true;
          const playerNumber = existRoom.players.length + 1;
          const player = new Player(
            playerNumber,
            client.id,
            padd,
            existRoom.roomName,
            0,
          );
          existRoom.players.push(player);
          client.join(existRoom.roomName);
          const gamedata: GameData = {
            playerpad: player.paddle,
            otherpad: playerNumber === 1 ? otherpadd : padd,
            ball: existRoom.ball,
            playerScore: 0,
            otherScore: 0,
            rounds: existRoom.rounds,
            containerHeight: this.containerHeight,
            containerWidth: this.containerWidth,
            id: playerNumber,
          };
          client.emit('JoinRoom', existRoom.roomName);
          client.emit('InitGame', gamedata);
          this.server
            .to(existRoom.roomName)
            .emit('StartGame', existRoom.roomName);
          this.startGame(existRoom);
          break;
        }
      }

      if (!exist) {
        const room = new Room(Math.random().toString(36).substring(7));
        this.rooms.set(room.roomName, room);
        console.log('new room created with name ', room.roomName);
        const playerNumber = room.players.length + 1;
        const player = new Player(
          playerNumber,
          client.id,
          otherpadd,
          room.roomName,
          0,
        );
        room.players.push(player);
        client.join(room.roomName);

        const gamedata: GameData = {
          playerpad: player.paddle,
          otherpad: playerNumber === 1 ? otherpadd : padd,
          ball: room.ball,
          playerScore: 0,
          otherScore: 0,
          rounds: room.rounds,
          containerHeight: this.containerHeight,
          containerWidth: this.containerWidth,
          id: playerNumber,
        };
        client.emit('JoinRoom', room.roomName);
        client.emit('InitGame', gamedata);
      }
    } catch (e) {
      console.log('error: canot find user');
    }
  }

  handleDisconnect(client: Socket) {
    const room = this.findRoomByPlayerSocket(client);

    if (room) {
      room.players = room.players.filter(
        (player) => player.socket_id !== client.id,
      );
      if (room.players.length < 2) {
        this.stopGame(room);
        room.gameActive = false;
        this.activeSockets.delete(client.id);
        this.rooms.delete(room.roomName); // Remove the room if it's empty
      }
    }
  }

  private findRoomByPlayerSocket(socket: Socket): Room | undefined {
    for (const room of this.rooms.values()) {
      const playerInRoom = room.players.find(
        (player) => player.socket_id === socket.id,
      );
      if (playerInRoom) {
        return room;
      }
    }

    return undefined;
  }
  @SubscribeMessage('UpdatePlayerPaddle')
  handleUpdatePaddle(client: Socket, eventData: any) {
    const room = this.findRoomByPlayerSocket(client);

    if (room) {
      const player = room.players.find((p) => p.socket_id === client.id);

      if (player) {
        // Receive relative mouse position and container height from the client
        const relativeMouseYPercentage = eventData.relativeMouseY;
        const containerHeight = this.containerHeight;

        // Calculate the new paddle position based on the received data
        player.paddle.y = (relativeMouseYPercentage / 100) * containerHeight;
      }
    }
  }

  private startGame(room: Room) {
    console.log('startGame');
    if (!room.gameActive) {
      room.gameActive = true;
      room.gameInterval = interval(INTERVAL).subscribe(() => {
        if (!room.gameActive) {
          this.stopGame(room);

          return;
        }
        this.updateGame(room);
      });
	  this.createMatch(room);
    }
  }

  private stopGame(room: Room) {
    console.log('stopGame');
    //dell room from map
    this.rooms.delete(room.roomName);
    room.gameActive = false;
    if (room.gameInterval) {
      // this.rooms
      room.gameInterval.unsubscribe();
    }
  }

  private updateGame(room: Room) {
    // Calculate the new ball position based on its current position and velocity
    if (Date.now() - room.lastspeedincrease > SPEED_INTERVAL) {
      room.lastspeedincrease = Date.now();
      room.ball.dx += room.ball.dx > 0 ? INCREASE_SPEED : -INCREASE_SPEED;
      room.ball.dy += room.ball.dy > 0 ? INCREASE_SPEED : -INCREASE_SPEED;
    }
    // room.ball.setXY(room.ball.x + room.ball.dx, room.ball.y + room.ball.dy);
    room.ball.x += room.ball.dx;
    room.ball.y += room.ball.dy;
    // Check for collisions with top and bottom walls
    if (
      room.ball.y - room.ball.radius <= 0 ||
      room.ball.y + room.ball.radius > this.containerHeight
    ) {
      // Reverse the vertical velocity of the ball
      room.ball.dy *= -1;
    }
    colision(room, this.activeSockets, this.prisma);
  }
}
