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

const initotherpaddle: Paddle = {
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
	// console.log('ball position in draw ', ball);
	// console.log('playerPaddle in draw ', playerPaddle);
	// ctx.clearRect(ball.x - 5, ball.y - 5, ball.x + 5, ball.y + 5);
	ctx.clearRect(20, 0, canvas.width - 60, canvas.height);
	drawPaddle(otherpaddle.x, otherpaddle.y, otherpaddle.width, otherpaddle.height, 'red', ctx);
	drawBall(ctx, ball);
	drawRounds(rounds, ctx, canvas);
	drawScore(playerScore, computerScore , ctx, canvas);
	update(ws, setBall, setOtherPlayerpadle);

	requestAnimationFrame(() => { draw(ws, ctx, canvas, ball, playerPaddle, otherpaddle, setBall, setOtherPlayerpadle); });
}

function update(ws: MySocket, setBall: React.Dispatch<React.SetStateAction<Ball>>, setOtherPlayerpadle : React.Dispatch<React.SetStateAction<Paddle>>)
{
	//listen to socket events to update data
	ws.on('UpdateData', (data : GameData) => {
		console.log('data in update ', data);
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
	// const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ws, setWs] = useState<null | MySocket>(null);
	// try usestate in ws
    const [playerPaddle, setplayerpaddle] = useState<Paddle>(initialPlayerPaddle);
    const [otherpaddle, setOtherPlayerpadle] = useState<Paddle>(initotherpaddle);
    const [ball, setBall] = useState<Ball>(initialBall);
    const [gameData, setGameData] = useState<GameData | null>(null);
	let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
	
	useEffectOnce(() => {
		setWs(io('http://localhost:5243',
		{
			withCredentials: true,
			forceNew: true,
			timeout: 100000, //before connect_error and connect_timeout are emitted.
			transports: ['websocket'],
		}))
	});[ws]
	
	const onLoadEvent = (element:HTMLCanvasElement) => {
		if (ws){
			ListenOnSocket(ws, ball, otherpaddle);
			ctx = element?.getContext('2d') as CanvasRenderingContext2D;
			draw(ws, ctx, element, ball, playerPaddle, otherpaddle, setBall, setOtherPlayerpadle);
			drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 'green', ctx);
		}
	}
	useEffect(() => {
        // Update player paddle position on server when it changes locally
        ws?.emit('UpdatePadlle', playerPaddle);
		if (ctx)
		{
			ctx.clearRect(playerPaddle.x, 0, playerPaddle.width, ctx.canvas.height);
			drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 'green', ctx);
		}
    }, [playerPaddle]);

	useEffect(() => {
		const canvas = canvasRef.current;
		console.log('ws in useeffect ', ws);
		const handleIntersection :IntersectionObserverCallback = (entries) => {
		  const [entry] = entries;
		  if (entry.isIntersecting) {
			const theCanvas = entry.target as HTMLCanvasElement;
			onLoadEvent(theCanvas);
			SetEventLisners(setplayerpaddle, theCanvas, paddleSpeed);
			setOtherPlayerpadle(initotherpaddle);
		  }
		};
	
		const options = {
		  root: null, // Use the viewport as the root
		  rootMargin: '0px', // Margin around the root
		  threshold: 0.5, // The ratio of the element's visibility needed to trigger the callback
		};
	
		const observer = new IntersectionObserver(handleIntersection, options);
		if (canvas) {
		  observer.observe(canvas);
		}
		return () => {
		  observer.disconnect();
		};
    }, []);

	useEffect(() => {
        // Update local game data when received from server
        if (gameData) {
            setBall(gameData.ball);
            // Update other game data properties
			setOtherPlayerpadle(gameData.otherpaddle);
        }
    }, [gameData]);
	
	return (
		<center> 
			<canvas ref={canvasRef}  width={600} height={300} />
		</center> 
		);
		
	}
	
	export default Game;
	
	//react componnent life cycle , useffect usestate useref
	
