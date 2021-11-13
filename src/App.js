import React from 'react'
import Canvas from './Canvas'

function App() {
    let x = 100, y = 100;
    const draw = (ctx, frameCount) => {
        // if (frameCount === 0 || frameCount % 100 === 0) {
        //     // x = 100 + Math.random() * 500;
        //     // y = 100 + Math.random() * 500;
        // }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
        <Canvas draw={draw} width={window.innerWidth} height={window.innerHeight} mouseMove={mouseMove} mouseClick={mouseClick}/>
    );
}

export default App