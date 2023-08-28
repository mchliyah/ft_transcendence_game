import { GameData, Paddle, Ball } from "../../../Types";
import { MySocket } from "./Game";
import { Dispatch , SetStateAction} from "react";

function SetEventLisners(setplayerpaddle: Dispatch<SetStateAction<Paddle>> , canvas : HTMLCanvasElement, paddleSpeed : number)
{
    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowUp') {
			setplayerpaddle(prev=>{ prev.dy = -paddleSpeed; return prev}); // move paddle up 
		} else if (event.code === 'ArrowDown') {
            setplayerpaddle(prev=>{ prev.dy = paddleSpeed; return prev}); // move paddle down
        } // to be changed 
    });
    
    window.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
			setplayerpaddle(prev=>{ prev.dy = 0; return prev}); // stop paddle to be changed 
        }
    });
    
    canvas.addEventListener('mousemove', (event : any) => {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseY = event.clientY - canvasRect.top;
		setplayerpaddle(prev=>{
			const paddle = {...prev};
			paddle.y = mouseY - paddle.height / 2;
			paddle.y = Math.max(paddle.y, 0); // Ensure it's not less than 0
			paddle.y = Math.min(paddle.y, 300 - paddle.height); // Ensure it's not greater than canvas height -
			// console.log('prev in mousemove ', paddle);
			return paddle;});
	});
}

function ListenOnSocket(ws : MySocket, ball : Ball , otherpaddle : Paddle)
{
    ws.on('InitGame', (gameData : GameData) => {
        console.log('InitGame', gameData);
            ball = gameData.ball;
            otherpaddle = gameData.otherpaddle;
			// rounds = gameData.rounds;
        }
        );
        
        ws.on('connect', () => {
            console.log('connected');
        }
        );
        ws.on('disconnect', () => {
            console.log('disconnected');
        }
        );

        // ws.on('message', (data) => {
        //     console.log('message', data);
        //     setBroadcastMessage(data);
        // });
    
        ws.on('error', (error) => {
            console.log('error', error);
        });
        
        ws.on('update', (message) => {
            console.log('Received update:', message);
            // Handle the received update message as needed
        });
}

export { SetEventLisners , ListenOnSocket};