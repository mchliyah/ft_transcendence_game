
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
	otherPaddle: Paddle;
	ball: Ball;
	playerScore: number;
	computerScore: number;
	rounds: number;
}

export interface ballAction {
	type: 'SET_BALL';
	payload: Ball;
}

export interface playerPaddleAction {
	type: 'SET_PLAYER_PADDLE';
	payload: Paddle;
}

export interface otherPaddleAction {
	type: 'SET_OTHER_PADDLE';
	payload: Paddle;
}

export interface gameDataAction {
	type: 'SET_GAME_DATA';
	payload: GameData;
}



