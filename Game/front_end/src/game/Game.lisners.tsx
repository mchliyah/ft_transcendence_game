import { State, cnvelem} from "../../Game.types";
import { MySocket } from "./Game";
import { Action } from "../../Game.types";
import { Ball, Paddle} from "../../Game.types";

// function SetEventLisners( dispatch: React.Dispatch<Action>, padle: Paddle, canvas: cnvelem) {
// 	// window.addEventListener('keydown', (event) => {
// 	//   if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
// 	// 	let padlle = gamedata.playerpad;
// 	// 	padlle.dy = event.code === 'ArrowUp' ? -gamedata.padlleSpeed : gamedata.padlleSpeed;
// 	// 	dispatch({
// 	// 	  type: 'SET_PLAYER_PADDLE',
// 	// 	  payload: {...padlle}
// 	// 	});
// 	//   }
// 	// });
  
// 	// window.addEventListener('keyup', (event) => {
// 	//   if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
// 	// 	let paddle = gamedata.playerpad;
// 	// 	paddle.dy = 0;
// 	// 	dispatch({
// 	// 	  type: 'SET_PLAYER_PADDLE',
// 	// 	  payload: {...paddle}
// 	// 	});
// 	//   }
// 	// });
  
// 	canvas.addEventListener('mousemove', (event: any) => {
// 		const canvasRect = canvas.getBoundingClientRect();
// 		const mouseY = event.clientY - canvasRect.top;
// 		let padd : Paddle = padle;
// 		padd.y = mouseY - padd.height / 2;
// 		padd.y = Math.max(Math.min(padd.y, canvas.height - padd.height), 0); // Ensure it's not less than 0 or greater than canvas height - paddle height		
// 		// newPaddle.y = Math.max(newPaddle.y, 0); // Ensure it's not less than 0
// 		// newPaddle.y = Math.min(newPaddle.y, 300 - newPaddle.height);
// 		dispatch({ type: 'SET_PLAYER_PADDLE', payload: padd}); // set the player paddle position based on the mouse position
// 		// console.log('paddle at mousemove ', padd);

// 	});// need to send actions instead of values to the erver, (protection of data)
//   }

function ListenOnSocket(ws: MySocket, dispatch: React.Dispatch<Action>, state: State) {
  
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

	// ws.on('SET_OTHER_PADDLE', (paddle: Paddle) => {
	// 	let newgameData = {...gamedata, otherpad: {...paddle}};
	// 	dispatch({ type: 'SET_GAME_DATA', payload: newgameData }); // set the other paddle position based on the server
	// })

	ws.on('UPDATE', (ball: Ball, other: Paddle) => {
		// console.log('paddle from server ', other);

		// Dispatch an action to update the game data
		dispatch({ type: 'SET_BALL', payload: ball});
		dispatch({ type: 'SET_OTHER_PADDLE', payload: other});
	  });
}

export { ListenOnSocket};