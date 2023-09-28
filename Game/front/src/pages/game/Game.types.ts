import React from 'react';

type ctxrend = CanvasRenderingContext2D;
type cnvelem = HTMLDivElement;
type ballstat = React.Dispatch<React.SetStateAction<Ball>>;
type paddlestat = React.Dispatch<React.SetStateAction<Paddle>>;

export interface Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	dy: number;
}

export interface Ball {
	x: number;
	y: number;
	radius: number;
	dx: number;
	dy: number;
}

interface GameData {
	playerpad: Paddle | null;
	otherpad: Paddle | null;
	ball: Ball | null;
	playerScore: number | null;
	otherScore: number | null;
	rounds: number | null;
	padlleSpeed: number | null;
	containerHeight: number | null;
	containerWidth: number | null;
	id: number | null;

}

export type { ctxrend, cnvelem, ballstat, paddlestat , GameData};