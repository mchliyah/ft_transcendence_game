
import React, { useEffect, useReducer, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { drawPaddle, drawBall, drawRounds, drawScore } from './DrawElements';
import { SetEventLisners, ListenOnSocket } from './Game.lisners';
import { Ball, Paddle, GameData } from '../../../Types';
import { ctxrend, cnvelem, initialState, State, Action, InitBall, InitPlayerPaddle, initotherpaddle, InitGame} from '../../Game.types';

export type MySocket = ReturnType<typeof io>;

export interface Score{
	playerScore: number;
	computerScore: number;
}

let score: Score = {playerScore: 0, computerScore: 0};
let rounds: number = 3;

const paddleSpeed: number = 5;

export const gameReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_WS':
      return { ...state, ws: action.payload };
    case 'SET_PLAYER_PADDLE':
      return { ...state, playerPaddle: action.payload };
    case 'SET_OTHER_PADDLE':
      return { ...state, otherPaddle: action.payload };
    case 'SET_BALL':
		return { ...state, ball: action.payload };
    // case 'SET_GAME_DATA':
    //   return { ...state, gameData: action.payload };
    default:
      return state;
  }
};

function draw(ws: MySocket, ctx: ctxrend, canvas: cnvelem, ball: Ball, playerPaddle: Paddle, otherpaddle: Paddle) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (playerPaddle){
		// ctx.clearRect(playerPaddle.x, 0, playerPaddle.width, canvas.height);
		drawPaddle(playerPaddle, 'green', ctx, canvas);
	}
	if (otherpaddle)
	{
		// ctx.clearRect(otherpaddle.x, 0, otherpaddle.width, canvas.height);
		drawPaddle(otherpaddle, 'red', ctx, canvas);
	}
	if (ball)
		drawBall(ctx, ball);
	if (rounds)
	{
		// ctx.clearRect(canvas.width / 2 - 10, 0, 20, canvas.height);
		drawRounds(rounds, ctx, canvas);
	}
	if (score.playerScore || score.computerScore)
		drawScore(score.playerScore, score.computerScore , ctx, canvas);
	requestAnimationFrame(() => { draw(ws, ctx, canvas, ball, playerPaddle, otherpaddle); });
}

function useEffectOnce(effect: React.EffectCallback) {
	let ref = useRef(false);
	useEffect((...args) => {
		if (ref.current === false) {
			ref.current = true;
			effect(...args)
		}
	}, []);
}

const Game: React.FC = () => {
  const canvasRef = useRef<cnvelem | null>(null);

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setupSocket = () => {
	console.log('connecting');
    const wsInstance = io('http://10.14.1.8:5432', {
      withCredentials: true,
      forceNew: true,
      timeout: 100000,
      transports: ['websocket']
    });
    dispatch({ type: 'SET_WS', payload: wsInstance });
  };

	const setupEventListeners = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			SetEventLisners( (newPaddle) => dispatch({ type: 'SET_PLAYER_PADDLE',  payload: newPaddle}), canvas, paddleSpeed );
    }
  };
	
	const updateCanvas = () => {
		if (canvasRef.current && state.ws) {
			const canvas = canvasRef.current;
			const ctx: ctxrend = canvas.getContext('2d') as ctxrend;
			
			// console.log('clearing canvas');
			ListenOnSocket( state, state.ws, dispatch, score, rounds );
			// ctx.clearRect(0, 0, canvas.width, canvas.height);
			draw(state.ws, ctx, canvas, state.ball, state.playerPaddle, state.otherPaddle);
		}
	};

	const update = () => {
		if (state.ws && state.playerPaddle) {
			console.log('UpdatePaddle');
			state.ws.emit('UpdatePlayerPaddle', state.playerPaddle);
		}
	};


  useEffectOnce(() => {
	//set up socket and listners
    setupSocket();
    setupEventListeners();
  });

  useEffect(updateCanvas, [state.ws, state.playerPaddle, state.otherPaddle, state.ball]);
  useEffect(update, [state.ws, state.playerPaddle]);

  return (
    <center>
      <canvas ref={canvasRef} width={600} height={300} />
    </center>
  );
};

export default Game;
