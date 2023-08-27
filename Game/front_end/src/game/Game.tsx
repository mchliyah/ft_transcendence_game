import React, { useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';
import { drawPaddle, drawBall }  from './DrawElements';
import { SetEventLisners, ListenOnSocket} from './Game.lisners';
import { Ball, Paddle, GameData } from '../../../Types';
// import { Socket } from 'socket.io-client';

export type MySocket = ReturnType<typeof io>;

let playerScore : number = 0;
let computerScore : number = 0;
let rounds: number = 3;

const initialBall: Ball = {
	x: 300,
	y: 150, 
	radius: 5,
	dx: 3, // The ball's horizontal velocity
	dy: 3 // The ball's vertical velocity
};

const  initialPlayerPaddle: Paddle = {
	x: 600 - 20,
	y: 300 / 2 -50 /2,
	width: 5,
	height: 60,
	dy: 3
};

let otherpaddle: Paddle = {
	x: 10,
	y: 300 / 2 - 50  / 2,
	width: 5,
	height: 60,
	dy: 3
};


// Draw the score
function drawScore(playerScore: number, computerScore : number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	ctx.font = '32px Courier New';
	ctx.fillText(playerScore.toString(), canvas.width / 2 + 100, 50);
	ctx.fillText(computerScore.toString(), canvas.width / 2 - 100, 50);
}
// Draw the number of rounds
function drawRounds(rounds : number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	ctx.font = '32px Courier New';
	ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
}

// // Paddle properties
const paddleSpeed : number = 5;

function useEffectOnce(effect: React.EffectCallback) {
	let ref = useRef(false);
	useEffect((...args) => {
		if (ref.current === false) {
			ref.current = true;
			effect(...args)
		}
	}, []);
}

function draw(ws: MySocket, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ball: Ball, playerPaddle: Paddle, otherpaddle: Paddle, setBall: React.Dispatch<React.SetStateAction<Ball>>, setOtherPlayerpadle : React.Dispatch<React.SetStateAction<Paddle>>) {
	// Clear the canvas
	// console.log('playerPaddle in draw ', playerPaddle);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 'green', ctx);
	drawPaddle(otherpaddle.x, otherpaddle.y, otherpaddle.width, otherpaddle.height, 'red', ctx);
	update(ws,ball, otherpaddle, setBall, setOtherPlayerpadle);
	drawBall(ctx, ball);
	drawRounds(rounds, ctx, canvas);
	drawScore(playerScore, computerScore , ctx, canvas);

	requestAnimationFrame(() => { draw(ws, ctx, canvas, ball, playerPaddle, otherpaddle, setBall, setOtherPlayerpadle); });
}

function update(ws: MySocket, ball: Ball, otherpaddle: Paddle, setBall: React.Dispatch<React.SetStateAction<Ball>>, setOtherPlayerpadle : React.Dispatch<React.SetStateAction<Paddle>>)
{
	//listen to socket events to update data
	ws.on('UpdateData', (data : GameData) => {
		setBall(data.ball);
		playerScore = data.playerScore;
		computerScore = data.computerScore;
		rounds = data.rounds;
		setOtherPlayerpadle(prev=>{prev.dy = data.otherpaddle.dy; return prev});
	}
	);
	// drawRounds(rounds, ctx, canvas);
	// drawScore(playerScore, computerScore, ctx, canvas);

}
	
const Game = () => {
	const canvasRef = useRef<null | HTMLCanvasElement>(null);
	const [ws, setWs] = useState<null | MySocket>(null);
	// const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);
    const [playerPaddle, setplayerpaddle] = useState<Paddle>(initialPlayerPaddle);
    const [otherpaddle, setOtherPlayerpadle] = useState<Paddle>(initialPlayerPaddle);
    const [ball, setBall] = useState<Ball>(initialBall);
    const [gameData, setGameData] = useState<GameData | null>(null);

	useEffectOnce(() => {
		setWs(io('http://localhost:8000',
		{
			withCredentials: true,
			forceNew: true,
			timeout: 100000, //before connect_error and connect_timeout are emitted.
			transports: ['websocket'],
		}))
	});

	useEffect(() => {
        // Update player paddle position on server when it changes locally
        if (ws) {
            ws.emit('UpdatePadlle', playerPaddle);
			console.log('playerPaddle in useEffect ', playerPaddle);
        }
    }, [playerPaddle]);

	useEffect(() => {
        // Set up event listeners for controlling the player paddle
        const canvas = canvasRef.current;
        if (canvas) {
            SetEventLisners(setplayerpaddle, canvas, paddleSpeed);
			setOtherPlayerpadle(otherpaddle);
        }
    }, []);

	useEffect(() => {
        // Update local game data when received from server
        if (gameData) {
            setBall(gameData.ball);
            // Update other game data properties
			setOtherPlayerpadle(gameData.otherpaddle);
        }
    }, [gameData]);
	
	useEffect(() => {
		// Define the player paddle
		if (canvasRef.current && ws) {
			const canvas = canvasRef.current;
			const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
			
			// Handle keyboard events to control the player paddle
			ListenOnSocket(ws, ball, otherpaddle); // socket events 
			// Start the game loop
			draw(ws, ctx, canvas, ball, playerPaddle, otherpaddle, setBall, setOtherPlayerpadle);
		}
	}, [ws])
	
	return (
		<center> 
			<canvas  ref={canvasRef}  width={600} height={300} />
		</center> 
		);
		
	}
	
	export default Game;
	
	//react componnent life cycle , useffect usestate useref
	
