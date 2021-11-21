import React, {useEffect} from 'react'
import Canvas from './Canvas'
import io from "socket.io-client";


function App() {
    let x = 100, y = 100;
    let positions = [];

    const socket = io('http://localhost:3001', {transports: ['websocket']});

    useEffect(() => {
        let interval = setInterval(() => {
            socket.emit('position', {x: x, y: y});
        }, 20);

        socket.on('position', function (data) {
            let isInArray = false;
            for (let player in positions) {
                if (positions.hasOwnProperty(player) && positions[player].id === data.id) {
                    positions[player].positions = data.positions;
                    isInArray = true;
                    break;
                }
            }
            if (!isInArray) {
                positions.push(data)
            }
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

        for (let player in positions) {
            if (positions.hasOwnProperty(player)) {
                ctx.fillStyle = positions[player].color;
                ctx.beginPath();
                ctx.arc(
                    positions[player].positions.x,
                    positions[player].positions.y,
                    20,
                    0,
                    2 * Math.PI
                );
            }
            ctx.fill();
        }
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