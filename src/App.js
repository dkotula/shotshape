import React, {useEffect} from 'react'
import Canvas from './Canvas'
import io from "socket.io-client";


function App() {
    let x = 100, y = 100;

    const socket = io('http://localhost:3001', {transports: ['websocket']});

    useEffect(() => {
        let interval = setInterval(() => {
            socket.emit('position', {x: x});
        }, 1000);

        socket.on('position', function (data) {
            console.log(data);
        });

        socket.on('disconnect', function () {
            clearInterval(interval);
        });
    }, []);

    const draw = (ctx, frameCount) => {
        // if (frameCount === 0 || frameCount % 100 === 0) {
        //     // x = 100 + Math.random() * 500;
        //     // y = 100 + Math.random() * 500;
        // }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.beginPath();
        ctx.fillStyle = "#b4f5b0";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "#0000FF";
        ctx.beginPath();
        ctx.arc(
            x,
            y,
            20,
            0,
            2 * Math.PI
        );
        ctx.fill();
    };

    const mouseMove = (e) => {
        x = e.clientX;
        y = e.clientY;
    }

    const mouseClick = (e) => {
        console.log(e)
    }

    return (
        <Canvas draw={draw} width={window.innerWidth} height={window.innerHeight} mouseMove={mouseMove}
                mouseClick={mouseClick}/>
    );
}

export default App