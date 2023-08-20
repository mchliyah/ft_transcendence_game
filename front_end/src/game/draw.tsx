import { Paddle, Ball } from "./Game";


function drawPaddle(x: number, y: number, width: number, height: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	// console.log("drawBall", ball.x, ball.y, ball.radius);
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'black';
	ctx.fill();
	ctx.closePath();
}

function resetGame(ball: Ball, playerPaddle: Paddle, computerPaddle: Paddle, canvas: HTMLCanvasElement) {
	// Reset player paddle position
	playerPaddle.y = canvas.height / 2 - playerPaddle.height / 2;
	// Reset computer paddle position
	computerPaddle.y = canvas.height / 2 - computerPaddle.height / 2;
	// Reset ball position
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	// Reset ball velocity
	ball.dx = Math.random() > 0.5 ? 3 : -3; // Randomize the horizontal velocity
	ball.dy = Math.random() > 0.5 ? 3 : -3; // Randomize the vertical velocity
}

export { drawBall, drawPaddle, resetGame };