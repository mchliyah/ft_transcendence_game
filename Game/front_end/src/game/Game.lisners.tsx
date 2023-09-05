import { GameData, Paddle, Ball } from "../../../Types";
import { ballstat, cnvelem, gamestat, initotherpaddle, paddlestat } from "../../Game.types";
import { MySocket } from "./Game";
import { Action } from "../../Game.types";
import { Dispatch , SetStateAction} from "react";
import { initialPlayerPaddle , State} from "../../Game.types";
import { Score } from "./Game";

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

function ListenOnSocket(ws: MySocket, dispatch: React.Dispatch<Action>, score: Score, rounds: number ) {
	ws.on('InitGame', (ball : Ball, paddle : Paddle, playerScore: number, computerScore: number, rounds: number) => {
	//   console.log('InitGame', gameData);
	  dispatch({ type: 'SET_BALL', payload: ball });
	  dispatch({ type: 'SET_PLAYER_PADDLE', payload: paddle });
	//   dispatch({ type: 'SET_GAME_DATA', payload: gameData });
	  score.playerScore = playerScore;
	  score.computerScore = computerScore;
	  rounds = rounds;
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
	ws.on('JoinRoom', (message: string) => {
		console.log('JoinRoom', message);
	});
  
	ws.on('StartGame', (message: string) => {
		console.log('StartGame on room', message); // print the start game message	
	});

	ws.on('SET_OTHER_PADDLE', (paddle: Paddle) => {
		console.log('SET_OTHER_PADDLE', paddle); // print the other paddle position
		dispatch({ type: 'SET_OTHER_PADDLE', payload: paddle }); // set the other paddle position based on the server
	})

	ws.on('UPDATE', (ball: Ball, other: Paddle) => {
		console.log('UPDATE ball ', ball);
		console.log('UPDATE paddle ', other);
		dispatch({ type: 'SET_BALL', payload: ball });
		dispatch({ type: 'SET_OTHER_PADDLE', payload: other });
	})
}

export { SetEventLisners , ListenOnSocket};