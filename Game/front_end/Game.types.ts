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


// const initialBall: Ball = {
// 	x: 300,
// 	y: 150,
// 	radius: 5,
// 	dx: 3,
// 	dy: 3,
// };

// export const initialPlayerPaddle: Paddle = {
// 	x: 600 - 20,
// 	y: 300 / 2 - 50 / 2,
// 	width: 5,
// 	height: 60,
// 	dy: 3,
// };

// const initalotherpaddle: Paddle = {
// 	x: 10,
// 	y: 300 / 2 - 50 / 2,
// 	width: 5,
// 	height: 60,
// 	dy: 3,
// };

interface State {
	ws: MySocket | null;
	playerpad: Paddle | null;
	otherpad: Paddle | null;
	ball: Ball | null;
	playerScore: number | null;
	otherScore: number | null;
	rounds: number | null;
	id: number | null;
	padlleSpeed: number | null;
}

interface GameData {
	playerpad: Paddle | null;
	otherpad: Paddle | null;
	ball: Ball | null;
	playerScore: number | null;
	otherScore: number | null;
	rounds: number | null;
	id: number | null;
	padlleSpeed: number | null;
}

type Action =
  | { type: 'SET_WS'; payload: MySocket }
  | { type: 'SET_PLAYER_PADDLE'; payload: Paddle }
  | { type: 'SET_OTHER_PADDLE'; payload: Paddle }
  | { type: 'SET_BALL'; payload: Ball }
  | { type: 'SET_PLAYER_SCORE'; payload: number }
  | { type: 'SET_OTHER_SCORE'; payload: number }
  | { type: 'SET_ROUNDS'; payload: number }
  | { type: 'SET_ID'; payload: number }
  | { type: 'SET_PADDLE_SPEED'; payload: number };
  
const initialState: State = {
	ws: null,
	playerpad: null,
	otherpad: null,
	ball: null,
	playerScore: null,
	otherScore: null,
	rounds: null,
	id: null,
	padlleSpeed: null,
};

export {initialState};
export type { ctxrend, cnvelem, ballstat, paddlestat , State, Action, GameData};