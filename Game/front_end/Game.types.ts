import React from 'react';
import { MySocket} from './src/game/Game';

type ctxrend = CanvasRenderingContext2D;
type cnvelem = HTMLCanvasElement;
type ballstat = React.Dispatch<React.SetStateAction<Ball>>;
type paddlestat = React.Dispatch<React.SetStateAction<Paddle>>;

export interface Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	dy: number;
}

export interface Ball {
	x: number;
	y: number;
	radius: number;
	dx: number;
	dy: number;
}

export interface ballAction {
	type: 'SET_BALL';
	payload: Ball;
}

export interface playerPaddleAction {
	type: 'SET_PLAYER_PADDLE';
	payload: Paddle;
}

export interface otherPaddleAction {
	type: 'SET_OTHER_PADDLE';
	payload: Paddle;
}

export interface gameDataAction {
	type: 'SET_GAME_DATA';
	payload: GameData;
}

const initialBall: Ball = {
	x: 300,
	y: 150,
	radius: 5,
	dx: 3,
	dy: 3,
};

export const initialPlayerPaddle: Paddle = {
	x: 600 - 20,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
	dy: 3,
};

const initalotherpaddle: Paddle = {
	x: 10,
	y: 300 / 2 - 50 / 2,
	width: 5,
	height: 60,
	dy: 3,
};

interface State {
	ws: MySocket | null;
	gamedata: GameData | {
		playerpad: Paddle;
		otherpad: Paddle;
		ball: Ball;
		playerScore: number;
		otherScore: number;
		rounds: number;
		id: number;
		padlleSpeed: number;
	};
}

interface GameData {
	playerpad: Paddle;
	otherpad: Paddle;
	ball: Ball;
	playerScore: number;
	otherScore: number;
	rounds: number;
	id: number;
	padlleSpeed: number;
}

type Action =
	| { type: 'SET_WS'; payload: MySocket }
	| { type: 'SET_PLAYER_PADDLE'; payload: Paddle }
	| { type: 'SET_OTHER_PADDLE'; payload: Paddle }
	| { type: 'SET_BALL'; payload: Ball }
	| { type: 'SET_GAME_DATA'; payload: GameData };
  
const initialState: State = {
	ws: null,
	gamedata: {
		playerpad: initialPlayerPaddle,
		otherpad: initalotherpaddle,
		ball: initialBall,
		playerScore: 0,
		otherScore: 0,
		rounds: 0,
		id: 0,
		padlleSpeed: 3,
	},
};

export {initialState};
export type { ctxrend, cnvelem, ballstat, paddlestat , State, Action, GameData};