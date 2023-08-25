import { Paddle, Ball } from "../../../Types";


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

	
	
// function drawScore(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	// ctx.font = '32px Courier New';
	// ctx.fillText(playerScore.toString(), canvas.width / 2 + 40, 50);
	// ctx.fillText(computerScore.toString(), canvas.width / 2 - 60, 50);
// }
  
// function drawRounds(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	// ctx.font = '32px Courier New';
	// ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
// }

export { drawBall, drawPaddle};