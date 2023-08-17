export default function drawPaddle(x: number, y: number, width: number, height: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}