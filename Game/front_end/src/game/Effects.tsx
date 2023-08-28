// import { useEffect } from 'react';
// import draw  from './Game';
// import { SetEventLisners, ListenOnSocket} from './Game.lisners';
// import { Ball, Paddle, GameData } from '../../../Types';
// import { MySocket } from './Game';
// // import { io } from 'socket.io-client';

// export default function Effects(ws: MySocket , canvasRef: React.RefObject<HTMLCanvasElement>, ball: Ball, setBall: React.Dispatch<React.SetStateAction<Ball>>, playerPaddle: Paddle, setplayerpaddle: React.Dispatch<React.SetStateAction<Paddle>>, otherpaddle: Paddle, setOtherPlayerpadle: React.Dispatch<React.SetStateAction<Paddle>>, gameData: GameData, initotherpaddle: Paddle, paddleSpeed: number) {
// 	useEffect(() => {
//         // Update player paddle position on server when it changes locally
// 		console.log('playerPaddle in useEffect ', playerPaddle);
//         if (ws) {
//             ws.emit('UpdatePadlle', playerPaddle);
// 			console.log('playerPaddle in useEffect ', playerPaddle);
//         }
//     }, [playerPaddle, ws]);

// 	useEffect(() => {
//         // Set up event listeners for controlling the player paddle
//         const canvas = canvasRef.current;
//         if (canvas) {
//             SetEventLisners(setplayerpaddle, canvas, paddleSpeed);
// 			setOtherPlayerpadle(initotherpaddle);
//         }
//     }, []);

// 	useEffect(() => {
//         // Update local game data when received from server
//         if (gameData) {
//             setBall(gameData.ball);
//             // Update other game data properties
// 			setOtherPlayerpadle(gameData.otherpaddle);
//         }
//     }, [gameData]);
	
// 	useEffect(() => {
// 		// Define the player paddle
// 		if (canvasRef.current && ws) {
// 			const canvas = canvasRef.current;
// 			const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
			
// 			// Handle keyboard events to control the player paddle
// 			ListenOnSocket(ws, ball, otherpaddle); // socket events 
// 			// Start the game loop
// 			draw(ws, ctx, canvas, ball, playerPaddle, otherpaddle, setBall, setOtherPlayerpadle);
// 		}
// 	}, [ws])
// }