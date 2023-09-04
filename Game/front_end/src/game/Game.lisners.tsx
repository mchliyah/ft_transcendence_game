import { GameData, Paddle, Ball } from "../../../Types";
import { ballstat, cnvelem, gamestat, initotherpaddle, paddlestat } from "../../Game.types";
import { MySocket } from "./Game";
import { Action } from "../../Game.types";
import { Dispatch , SetStateAction} from "react";
import { initialPlayerPaddle , State} from "../../Game.types";
import { gameReducer } from "./Game";

function SetEventLisners(
	dispatch: React.Dispatch<Action>,
	canvas: cnvelem,
	paddleSpeed: number
  ) {
	window.addEventListener('keydown', (event) => {
	  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
		let padlle = initialPlayerPaddle;
		padlle.dy = event.code === 'ArrowUp' ? -paddleSpeed : paddleSpeed
		dispatch({
		  type: 'SET_PLAYER_PADDLE',
		  payload: {...padlle}
		});
	  }
	});
  
	window.addEventListener('keyup', (event) => {
	  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
		let paddle = initialPlayerPaddle;
		paddle.dy = 0;
		dispatch({
		  type: 'SET_PLAYER_PADDLE',
		  payload: {...paddle}
		});
	  }
	});
  
	canvas.addEventListener('mousemove', (event: any) => {
		const canvasRect = canvas.getBoundingClientRect();
		const mouseY = event.clientY - canvasRect.top;
		let paddle = initialPlayerPaddle;
		paddle.y = mouseY - paddle.height / 2;
		paddle.y = Math.max(paddle.y, 0); // Ensure it's not less than 0
		paddle.y = Math.min(paddle.y, 300 - paddle.height);
		dispatch({
		type: 'SET_PLAYER_PADDLE',
		payload: {...paddle}
	  });
	});
  }

function ListenOnSocket(state : State, ws: MySocket, dispatch: React.Dispatch<Action>, playerScore: number, computerScore: number, rounds: number ) {
	ws.on('InitGame', (gameData: GameData) => {
	//   console.log('InitGame', gameData);
	  dispatch({ type: 'SET_BALL', payload: gameData.ball });
	  dispatch({ type: 'SET_OTHER_PADDLE', payload: gameData.otherpaddle });
	  dispatch({ type: 'SET_GAME_DATA', payload: gameData });
	});
  
	ws.on('connect', () => {
	  console.log('connected');
	});
  
	ws.on('disconnect', () => {
	  console.log('disconnected');
	});
  
	ws.on('error', (error) => {
	  console.log('error', error);
	});
  
	ws.on('update', (message) => {
	  console.log('Received update:', message);
	  // Handle the received update message as needed
	});
  
	ws.on('UpdateData', (data: GameData) => {

		// playerScore = data.playerScore;
		// computerScore = data.computerScore;
		// rounds = data.rounds;
		// let ball = {...data.ball};
		// let otherpaddle = {...data.otherpaddle};
		// dispatch({ type: 'SET_BALL' ,payload: ball });
		// dispatch({type: 'SET_OTHER_PADDLE', payload: otherpaddle});
		dispatch({ type: 'SET_GAME_DATA', payload: data });
	})
}

export { SetEventLisners , ListenOnSocket};