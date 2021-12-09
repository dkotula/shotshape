import React, {useEffect} from 'react'
import Canvas from './Canvas'
import io from "socket.io-client";


function App() {
    let x = 100, y = 100;
    let players = [];
    let bullets = [];
    let isMouseDown = false;
    let isKeyDown = {a: false, d: false, w: false, s: false};
    let autofire = false;

    const socket = io('http://localhost:3001', {transports: ['websocket']});

    useEffect(() => {
        socket.emit('client');

        let interval = setInterval(() => {
            const object = {
                x: x,
                y: y,
                isMouseDown: isMouseDown,
                isKeyDown: isKeyDown,
                autofire: autofire,
            }
            socket.emit('position', object);
        }, 20);

        socket.on('position', function (data) {
            if (data.hasOwnProperty("players") && data.hasOwnProperty("bullets")) {
                players = data.players;
                bullets = data.bullets;
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
        ctx.fillStyle = "#e0f6df";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let player in players) {
            if (players.hasOwnProperty(player)) {
                ctx.fillStyle = players[player].color;
                ctx.beginPath();
                ctx.arc(
                    players[player].position.x,
                    players[player].position.y,
                    20,
                    0,
                    2 * Math.PI
                );
            }
            ctx.fill();
        }
        for (let bullet in bullets) {
            if (bullets.hasOwnProperty(bullet)) {
                ctx.fillStyle = bullets[bullet].color;
                ctx.globalAlpha = bullets[bullet].lifeTime / 100
                ctx.beginPath();
                ctx.arc(
                    bullets[bullet].position.x,
                    bullets[bullet].position.y,
                    10,
                    0,
                    2 * Math.PI
                );
            }
            ctx.fill();
            ctx.globalAlpha = 1;
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
        } else if (e.key === 'e') {
            autofire = !autofire;
        }
    }

    return (
        <Canvas draw={draw} width={window.innerWidth} height={window.innerHeight} mouseMove={mouseMove}
                mouseUp={mouseUp} mouseDown={mouseDown} keyDown={keyDown} keyUp={keyUp}/>
    );
}

export default App