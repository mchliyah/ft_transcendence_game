import { Ball, Paddle } from "../../Game.types";
import { ctxrend, cnvelem } from "../../Game.types";

function drawPaddle(paddle: Paddle, color: string, ctx: ctxrend, canvas: cnvelem) {
	ctx.fillStyle = color;
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall(ctx: ctxrend, ball: Ball) {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}

function drawScore(playerScore: number, computerScore : number, ctx: ctxrend, canvas: cnvelem) {
	ctx.font = '32px Courier New';
	ctx.fillText(playerScore.toString(), canvas.width / 2 + 100, 50);
	ctx.fillText(computerScore.toString(), canvas.width / 2 - 100, 50);
}
// Draw the number of rounds
function drawRounds(rounds : number, ctx: ctxrend, canvas: cnvelem) {
	ctx.font = '32px Courier New';
	ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
}

export { drawBall, drawPaddle, drawScore, drawRounds};