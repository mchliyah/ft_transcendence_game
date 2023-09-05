import React from 'react';
import {Paddle, Ball, GameData } from '../Types';
import { MySocket } from './src/game/Game';

type ctxrend = CanvasRenderingContext2D;
type cnvelem = HTMLCanvasElement;
type ballstat = React.Dispatch<React.SetStateAction<Ball>>;
type paddlestat = React.Dispatch<React.SetStateAction<Paddle>>;
type gamestat = React.Dispatch<React.SetStateAction<GameData>>;

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

const InitBall: Action = {
	type: 'SET_BALL',
	payload: initialBall,
};

const InitPlayerPaddle: Action = {
	type: 'SET_PLAYER_PADDLE',
	payload: initialPlayerPaddle,
};

const initotherpaddle: Action = {
	type: 'SET_OTHER_PADDLE',
	payload: initalotherpaddle,
};

interface State {
	ws: MySocket | null;
	playerPaddle: Paddle;
	otherPaddle: Paddle;
	ball: Ball;
}

type Action =
	| { type: 'SET_WS'; payload: MySocket }
	| { type: 'SET_PLAYER_PADDLE'; payload: Paddle }
	| { type: 'SET_OTHER_PADDLE'; payload: Paddle }
	| { type: 'SET_BALL'; payload: Ball }
	| { type: 'SET_GAME_DATA'; payload: GameData };
  
const initialState: State = {
	ws: null,
	playerPaddle: initialPlayerPaddle,
	otherPaddle: initalotherpaddle,
	ball: initialBall,
	// gameData: InitGame
};

export {initialState, InitBall, InitPlayerPaddle, initotherpaddle};
export type { ctxrend, cnvelem, ballstat, paddlestat, gamestat , State, Action};