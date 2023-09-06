
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
	playerpad: Paddle;
	otherpad: Paddle;
	ball: Ball;
	playerScore: number;
	otherScore: number;
	rounds: number;
	id: number;
	padlleSpeed: number;
}


