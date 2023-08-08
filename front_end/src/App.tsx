import { useEffect, useRef, useState } from 'react';
import { Game } from './game/main'
import './styles.css';

function App() {
	const canvas = useRef(null)
	const isRunning = useRef(true)
	const [state, setState] = useState(0)
	useEffect(() => {

		// console.log(canvas.current)
		Game(canvas.current);
		

	}, []);



	return (
		<>
			<center> <canvas  ref={canvas}  width={600} height={300} /> </center>
		</>
	)
}

export default App
