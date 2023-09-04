import { Paddle, Ball } from "../../../Types";
import { ctxrend, cnvelem, ballstat, paddlestat, gamestat, Action } from "../../Game.types";
import { playerScore, computerScore, rounds } from "./Game";

function drawPaddle(paddle: Paddle, color: string, ctx: ctxrend, canvas: cnvelem) {
	ctx.fillStyle = color;
	ctx.clearRect(paddle.x, 0, paddle.width, canvas.height);
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall(ctx: ctxrend, ball: Ball) {
	ctx.clearRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}

function drawScore(playerScore: number, computerScore : number, ctx: ctxrend, canvas: cnvelem) {
	ctx.font = '32px Courier New';
	ctx.clearRect(canvas.width / 2 - 100, 0, 200, 50);
	ctx.clearRect(canvas.width / 2 + 100, 0, 200, 50);
	ctx.fillText(playerScore.toString(), canvas.width / 2 + 100, 50);
	ctx.fillText(computerScore.toString(), canvas.width / 2 - 100, 50);
}
// Draw the number of rounds
function drawRounds(rounds : number, ctx: ctxrend, canvas: cnvelem) {
	ctx.font = '32px Courier New';
	ctx.clearRect(canvas.width / 2 - 10, 0, 20, 50);
	ctx.fillText(rounds.toString(), canvas.width / 2 - 10, 50);
}

export { drawBall, drawPaddle, drawScore, drawRounds};