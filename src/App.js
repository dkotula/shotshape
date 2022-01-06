import React, {useEffect} from 'react'
import Canvas from './Canvas'
import io from "socket.io-client";
import Bullet_minus from './Bonusy/Bullet_minus.png';
import Bullet_plus from './Bonusy/Bullet_plus.png';
import Bullet_strength_minus from './Bonusy/Bullet_strength_minus.png';
import Bullet_strength_plus from './Bonusy/Bullet_strength_plus.png';
import life_full from './Bonusy/life_full.png';
import life_full_now from './Bonusy/life_full_now.png';
import life_minus from './Bonusy/life_minus.png';
import Speed_x2_minus from './Bonusy/Speed_x2_minus.png';
import Speed_x2_plus from './Bonusy/Speed_x2_plus.png';
import Speed_x3_minus from './Bonusy/Speed_x3_minus.png';
import Speed_x3_plus from './Bonusy/Speed_x3_plus.png';
const sqrt_2 = Math.sqrt(2);

function App() {
    let x = 100, y = 100;
    let players = [];
    let bullets = [];
    let bonuses = [];
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
            if (data.hasOwnProperty("players") && data.hasOwnProperty("bullets") && data.hasOwnProperty("bonuses")) {
                players = data.players;
                bullets = data.bullets;
                bonuses = data.bonuses;
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
            if (players[player].hp > 0) {
                ctx.fillStyle = players[player].color;
                ctx.beginPath();
                ctx.arc(
                    players[player].position.x,
                    players[player].position.y,
                    20,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                ctx.textAlign = "center";
                ctx.font = "20px Arial";
                ctx.fillText(players[player].points, players[player].position.x, players[player].position.y + 50);
            }

                if (players[player].hp > 0) {
                    let size = 49;
                    let x = players[player].position.x;
                    let y = players[player].position.y;
                    let rotation = players[player].rotation;

                    ctx.beginPath();
                    ctx.strokeStyle = players[player].color;
                    ctx.rect(x - 50, y - 50, 100, 10);
                    ctx.stroke();
                    ctx.fillRect(x - 50, y - 50, players[player].hp, 10);
                    ctx.closePath();

                    ctx.translate(x, y);
                    ctx.rotate(Math.PI * rotation / 360);
                    ctx.translate(-x, -y);

                    ctx.beginPath();
                    ctx.moveTo(x, y - size / 2);
                    ctx.lineTo(x - size / 2, y);
                    ctx.lineTo(x, y + size / 2);
                    ctx.lineTo(x + size / 2, y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillRect(x - size / 4 * sqrt_2, y - size / 4 * sqrt_2, size / 2 * sqrt_2, size / 2 * sqrt_2);

                    ctx.translate(x, y);
                    ctx.rotate(-Math.PI * rotation / 360);
                    ctx.translate(-x, -y);
            }
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
        for (let bonus in bonuses) {
            if (bonuses.hasOwnProperty(bonus)) {
                let img = new Image();
                switch (bonuses[bonus].src) {
                    case "Bullet_minus":
                        img.src = Bullet_minus;
                        break;
                    case "Bullet_plus":
                        img.src = Bullet_plus;
                        break;
                    case "Bullet_strength_minus":
                        img.src = Bullet_strength_minus;
                        break;
                    case "Bullet_strength_plus":
                        img.src = Bullet_strength_plus;
                        break;
                    case "life_full":
                        img.src = life_full;
                        break;
                    case "life_full_now":
                        img.src = life_full_now;
                        break;
                    case "life_minus":
                        img.src = life_minus;
                        break;
                    case "Speed_x2_minus":
                        img.src = Speed_x2_minus;
                        break;
                    case "Speed_x2_plus":
                        img.src = Speed_x2_plus;
                        break;
                    case "Speed_x3_minus":
                        img.src = Speed_x3_minus;
                        break;
                    case "Speed_x3_plus":
                        img.src = Speed_x3_plus;
                        break;
                }
                ctx.drawImage(img, bonuses[bonus].position.x - 25, bonuses[bonus].position.y - 25);
            }
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