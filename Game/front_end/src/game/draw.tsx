import { Paddle, Ball } from "./Game";


function drawPaddle(x: number, y: number, width: number, height: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	// console.log('ball in draw ball ', ball);
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'black';
	ctx.fill();
	ctx.closePath();
}



export { drawBall, drawPaddle};