import { cnvelem} from "../../Game.types";
import { MySocket } from "./Game";
import { Action } from "../../Game.types";
import { GameData, Ball, Paddle} from "../../Game.types";

function SetEventLisners( dispatch: React.Dispatch<Action>, gamedata: GameData, canvas: cnvelem) {
	window.addEventListener('keydown', (event) => {
	  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
		let padlle = gamedata.playerpad;
		padlle.dy = event.code === 'ArrowUp' ? -gamedata.padlleSpeed : gamedata.padlleSpeed;
		dispatch({
		  type: 'SET_PLAYER_PADDLE',
		  payload: {...padlle}
		});
	  }
	});
  
	window.addEventListener('keyup', (event) => {
	  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
		let paddle = gamedata.playerpad;
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
		let newgameData = {...gamedata};
		newgameData.playerpad.y = mouseY - newgameData.playerpad.height / 2;
		// paddle.y = mouseY - paddle.height / 2;
		// paddle.y = Math.max(paddle.y, 0); // Ensure it's not less than 0
		// paddle.y = Math.min(paddle.y, 300 - paddle.height);
		dispatch({
		type: 'SET_GAME_DATA',
		payload: newgameData
	  });
	});
  }

function ListenOnSocket(ws: MySocket, dispatch: React.Dispatch<Action>, gamedata: GameData) {
  
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
		let newgameData = {...gamedata, otherpad: {...paddle}};
		dispatch({ type: 'SET_GAME_DATA', payload: newgameData }); // set the other paddle position based on the server
	})

	ws.on('UPDATE', (ball: Ball, other: Paddle) => {
		// console.log('paddle', other);
		let newgameData = {...gamedata, ball : {...ball}, otherpad: other};
		dispatch({ type: 'SET_GAME_DATA', payload: newgameData });
	})
}

export { SetEventLisners , ListenOnSocket};