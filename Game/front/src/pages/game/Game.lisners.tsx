
import { Ball, Paddle } from "./Game.types";
import { MySocket } from "./Game";

type numberstate = React.Dispatch<React.SetStateAction<number>>;
type ballstate = React.Dispatch<React.SetStateAction<Ball | null>>;
type paddstate = React.Dispatch<React.SetStateAction<Paddle | null>>;

function ListenOnSocket(socket: MySocket, setPadd: paddstate, setBall: ballstate,
		setOtherpad: paddstate, setPlayerScore: numberstate, setOtherScore: numberstate ) {
	
	socket.on('connect', () => {
	  console.log('connected');
	});

	socket.on('disconnect', () => {
	  console.log('disconnected');
	});
  
	socket.on('error', (error) => {
	  console.log('error', error);
	});
	socket.on('JoinRoom', (message: string) => {
		console.log('JoinRoom', message);
	});
  
	socket.on('StartGame', (message: string) => {
		console.log('StartGame on room', message); // print the start game message	
	});

	socket.on('UPDATE', (update: {ball: Ball, paddle: Paddle, otherPaddle: Paddle}) => {
		setPadd(update.paddle);
		setBall(update.ball);
		setOtherpad(update.otherPaddle );
	});
	socket.on('GAME OVER', (payload: any) => {
		console.log('GAME OVER', payload.winner);
		if (payload.winner)
			alert('You win');
		else
			alert('You lose');
	});
	socket.on('UPDATE SCORE', (update: {playerScore: number, otherScore: number}) => {
		setPlayerScore(update.playerScore);
		setOtherScore(update.otherScore);
	});
}

export { ListenOnSocket};