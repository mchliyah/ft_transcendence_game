
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { drawPaddle, drawBall, drawRounds, drawScore } from './DrawElements';
import { SetEventLisners, ListenOnSocket } from './Game.lisners';
import { ctxrend, cnvelem, initialState, State, Action, GameData, Paddle} from '../../Game.types';

export type MySocket = ReturnType<typeof io>;

export const gameReducer = (state: State, action: Action): State => {
	switch (action.type) {
	  case 'SET_WS':
		return { ...state, ws: action.payload };
	  case 'SET_PLAYER_PADDLE':
			return { ...state, playerpad: action.payload  };
	  case 'SET_OTHER_PADDLE':
			return { ...state, otherpad: action.payload  };
	  case 'SET_BALL':
		return { ...state, ball: action.payload };
	  case 'SET_PLAYER_SCORE':
		return { ...state, playerScore: action.payload };
	  case 'SET_OTHER_SCORE':
		return { ...state, otherScore: action.payload };
	  case 'SET_ROUNDS':
		return { ...state, rounds: action.payload };
	  case 'SET_ID':
		return { ...state, id: action.payload };
	  case 'SET_PADDLE_SPEED':
		return { ...state, padlleSpeed: action.payload };
	  default:
		return state;
	}
  };

function draw(ctx: ctxrend, canvas: cnvelem, state: State) {
	// console.log('draw pdalles ', gamedata.playerpad);
	if (state.otherpad && state.playerpad)
	{
		drawPaddle(state.otherpad, 'red', ctx, canvas);
		drawPaddle(state.playerpad, 'green', ctx, canvas);
	}
	if (state.ball)
		drawBall(ctx, state.ball);
	if (state.rounds)
		drawRounds(state.rounds, ctx, canvas);
	if (state.playerScore && state.otherScore)
		drawScore(state.playerScore, state.otherScore , ctx, canvas);
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
	const [init, setInit] = useState(false);
	let listning = false;

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

		if (canvas)
			canvas.addEventListener('mousemove', (event: any) => {
			const canvasRect = canvas.getBoundingClientRect();
			const mouseY = event.clientY - canvasRect.top;
			let padd : Paddle ;
			if (state.playerpad)
			{
				padd = state.playerpad;	
				padd.y = mouseY - padd.height / 2;
				padd.y = Math.max(Math.min(padd.y, canvas.height - padd.height), 0); // Ensure it's not less than 0 or greater than canvas height - paddle height		
				dispatch({ type: 'SET_PLAYER_PADDLE', payload: padd}); // set the player paddle position based on the mouse position
			}
			// console.log('paddle at mousemove ', padd);

		});// need to send actions instead of values to the erver, (protection of data)
	};

	
	useEffect(() => {
		console.log('useEffect callsed ');
		if (state.ws && !init)
		state.ws.on('InitGame', (game: GameData) => {
			setInit(true);
			// console.log('InitGame', game);
			// let newgameData = {...gamedata, ...game};
			if(game.ball) 
			dispatch({ type: 'SET_BALL', payload: game.ball });
			if(game.playerpad) 
			dispatch({ type: 'SET_PLAYER_PADDLE', payload: game.playerpad });
			if(game.otherpad) 
			dispatch({ type: 'SET_OTHER_PADDLE', payload: game.otherpad });
			if(game.playerScore) 
			dispatch({ type: 'SET_PLAYER_SCORE', payload: game.playerScore });
			if(game.otherScore)
			dispatch({ type: 'SET_OTHER_SCORE', payload: game.otherScore });
			if(game.rounds)
			dispatch({ type: 'SET_ROUNDS', payload: game.rounds });
			if(game.id)
			dispatch({ type: 'SET_ID', payload: game.id });
			});
		}, [init, state.ws]);

	const updateCanvas = () => {
		if (canvasRef.current && state && state.ws) {
			const canvas = canvasRef.current;
			const ctx: ctxrend = canvas.getContext('2d') as ctxrend;
			
			// console.log('clearing canvas');
			if (!listning){
				listning = true;
				ListenOnSocket(state.ws, dispatch, state);
			} 
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// console.log('draw in front end', state);
			draw(ctx, canvas, state);
		}
	};

	useEffectOnce(() => {
	//set up socket and listners
	setupSocket();
	});
	useEffect(() => {
		if (init)
			setupEventListeners();
	}, [init]);

	const update = () => {
		console.log('update functiuon hase been called');
		if (state.ws && state.playerpad) {
			console.log('UpdatePaddle in front end', state.playerpad);

			state.ws.emit('UpdatePlayerPaddle', state.playerpad);
		}
	};

	useEffect(updateCanvas, [state]);
	useEffect(update, [state]);

	return (
		<center>
			<canvas ref={canvasRef} width={600} height={300} />
		</center>
	);
};

export default Game;
