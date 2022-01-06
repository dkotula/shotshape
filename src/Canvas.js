import React from "react";
import PropTypes from "prop-types";
import useCanvas from "./useCanvas";

const Canvas = props => {
    const {draw, options, ...rest} = props;
    const canvasRef = useCanvas(draw, options);
    return <div>
        <canvas ref={canvasRef} onMouseMove={rest.mouseMove} onMouseDown={rest.mouseDown} onMouseUp={rest.mouseUp}
                   onKeyUp={rest.keyUp} onKeyDown={rest.keyDown} tabIndex="0"/>
        <div id="rank">
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
            <p className="rankp"/>
        </div>
        <div id="messageContainer">
            <div id="message">
                <h1 id="header">Wpisz nazwę postaci</h1>
                <input type="text" id="name" name="name"/>
                <div id="start" onClick={rest.changeName}>Graj</div>
            </div>
        </div>
    </div>;
};

Canvas.defaultProps = {
    draw: () => {
    }
};

Canvas.propTypes = {
    draw: PropTypes.func.isRequired,
    options: PropTypes.shape({
        context: PropTypes.oneOf([
            "2d",
            "webgl",
            "experimental-webgl",
            "webgl2",
            "bitmaprenderer"
        ])
    })
};

export default Canvas;