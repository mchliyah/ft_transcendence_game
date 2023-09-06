
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { drawPaddle, drawBall, drawRounds, drawScore } from './DrawElements';
import { SetEventLisners, ListenOnSocket } from './Game.lisners';
import { ctxrend, cnvelem, initialState, State, Action, GameData } from '../../Game.types';

export type MySocket = ReturnType<typeof io>;

let gamedata : GameData = {
	playerpad: {x: 0, y: 0, width: 10, height: 50, dy: 0},
	otherpad: {x: 0, y: 0, width: 10, height: 50, dy: 0},
	ball: {x: 0, y: 0, radius: 5, dx: 0, dy: 0},
	playerScore: 0,
	otherScore: 0,
	rounds: 0,
	id: 0,
	padlleSpeed: 5,
}

export const gameReducer = (state: State, action: Action): State => {
	let newgameData = {...state.gamedata};
	switch (action.type) {
		case 'SET_WS':
		  return { ...state, ws: action.payload };
		case 'SET_PLAYER_PADDLE':
			{
				// console.log('SET_PLAYER_PADDLE', action.payload);
				newgameData.playerpad = {...action.payload};
				return { ...state, gamedata: newgameData };
			}
		case 'SET_OTHER_PADDLE':
			{
				// console.log('SET_OTHER_PADDLE', action.payload);
				newgameData.otherpad = {...action.payload};
				return { ...state, gamedata: newgameData };
			}
		case 'SET_BALL':
			{
				newgameData.ball = {...action.payload};
				return { ...state, gamedata: newgameData };
			}
		case 'SET_GAME_DATA':
			{
				newgameData = {...action.payload};
				return { ...state, gamedata: newgameData };
			}
		default:
		  return state;
	  }
};

function draw(ctx: ctxrend, canvas: cnvelem, gamedata: GameData) {
	// console.log('draw pdalles ', gamedata.playerpad);
	drawPaddle(gamedata.otherpad, 'red', ctx, canvas);
	drawPaddle(gamedata.playerpad, 'green', ctx, canvas);
	drawBall(ctx, gamedata.ball);
	drawRounds(gamedata.rounds, ctx, canvas);
	drawScore(gamedata.playerScore, gamedata.otherScore , ctx, canvas);
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
	const init = useState(false);
	let listning = false;

	const setupSocket = () => {
	console.log('connecting');
		const wsInstance = io('http://localhost:5432', {
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
			SetEventLisners( (newPaddle) => dispatch({ type: 'SET_PLAYER_PADDLE', payload: newPaddle}), gamedata, canvas);
		}
	};
	useEffectOnce(() => {
	//set up socket and listners
	setupSocket();
	setupEventListeners();
});

	useEffect(() => {
		console.log('useEffect callsed ');
		init[1](true);
	if (state.ws)
		state.ws.on('InitGame', (game: GameData) => {
			//   console.log('InitGame', gameData);
			gamedata = {...game};

		//   dispatch({ type: 'SET_BALL', payload: ball });
		//   dispatch({ type: 'SET_PLAYER_PADDLE', payload: paddle });
		//   dispatch({ type: 'SET_OTHER_PADDLE', payload: otherpad });
		  dispatch({ type: 'SET_GAME_DATA', payload: game });
		});
	}, [init]);

	const updateCanvas = () => {
		if (canvasRef.current && state.ws) {
			const canvas = canvasRef.current;
			const ctx: ctxrend = canvas.getContext('2d') as ctxrend;
			
			// console.log('clearing canvas');
			if (!listning){
				listning = true;
				ListenOnSocket(state.ws, dispatch, gamedata);
			} 
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			draw(ctx, canvas, state.gamedata);
		}
	};

	const update = () => {
		if (state.ws && state.gamedata.playerpad) {
			// console.log('UpdatePaddle');
			state.ws.emit('UpdatePlayerPaddle', state.gamedata.playerpad);
		}
	};

	useEffect(updateCanvas, [state.ws, state.gamedata]);
	useEffect(update, [state.ws, state.gamedata.playerpad]);

	return (
		<center>
			<canvas ref={canvasRef} width={600} height={300} />
		</center>
	);
};

export default Game;
