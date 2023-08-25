import { GameData, Paddle, Ball } from "../../../Types";
import { MySocket } from "./Game";

function SetEventLisners(playerPaddle: Paddle , canvas : HTMLCanvasElement, paddleSpeed : number)
{
    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowUp') {
            playerPaddle.dy = -paddleSpeed; // Move the player paddle up
        } else if (event.code === 'ArrowDown') {
            playerPaddle.dy = paddleSpeed; // Move the player paddle down
        }
    });
    
    window.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
            playerPaddle.dy = 0; // Stop the player paddle
        }
    });
    
    canvas.addEventListener('mousemove', (event : any) => {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseY = event.clientY - canvasRect.top;
        playerPaddle.y = mouseY - playerPaddle.height / 2;
    });
}

function ListenOnSocket(ws : MySocket, ball : Ball , computerPaddle : Paddle)
{
    ws.on('InitGame', (gameData : GameData) => {
        console.log('InitGame', gameData);
            ball = gameData.ball;
            computerPaddle = gameData.computerPaddle;
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