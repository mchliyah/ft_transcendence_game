
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
export interface GameData {
	playerPaddle: Paddle;
	otherpaddle: Paddle;
	ball: Ball;
	playerScore: number;
	computerScore: number;
	rounds: number;
}