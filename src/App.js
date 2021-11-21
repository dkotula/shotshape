import React, {useEffect} from 'react'
import Canvas from './Canvas'
import io from "socket.io-client";


function App() {
    let x = 100, y = 100;
    let positions = [];
    let isMouseDown = false;
    let isKeyDown = {
        a: false,
        d: false,
        w: false,
        s: false
    }

    const socket = io('http://localhost:3001', {transports: ['websocket']});

    useEffect(() => {
        socket.emit('client');

        let interval = setInterval(() => {
            socket.emit('position', {x: x, y: y, isMouseDown: isMouseDown, isKeyDown: isKeyDown});
        }, 20);

        socket.on('position', function (data) {
            positions = data;
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
                let radius = 20;
                if (positions[player].controls.isMouseDown) {
                    radius = 40;
                }
                ctx.fillStyle = positions[player].color;
                ctx.beginPath();
                ctx.arc(
                    positions[player].controls.x,
                    positions[player].controls.y,
                    radius,
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

    const mouseUp = () => {
        isMouseDown = false
    }

    const mouseDown = () => {
        isMouseDown = true;
    }

    const keyDown = (e) => {
        if (isKeyDown.hasOwnProperty(e.key)) {
            isKeyDown[e.key] = true;
        }
    }

    const keyUp = (e) => {
        if (isKeyDown.hasOwnProperty(e.key)) {
            isKeyDown[e.key] = false;
        }
    }

    return (
        <Canvas draw={draw} width={window.innerWidth} height={window.innerHeight} mouseMove={mouseMove}
                mouseUp={mouseUp} mouseDown={mouseDown} keyDown={keyDown} keyUp={keyUp}/>
    );
}

export default App