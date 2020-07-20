import React from 'react';
import sunflower from './static/sunflower.png';

class SynthCanvas extends React.Component {

    constructor(props){
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.canvasRef = React.createRef();
        this.image = new Image();
        this.state = {
            canvasMouse: {
                mouseX: 0,
                mouseY: 0,

            }
        }
    }

    componentDidMount () {
        this.image.src = sunflower;
    }

    handleMouseMove = (event) => {
        this.setState({
            canvasMouse: {
                mouseX: event.clientX,
                mouseY: event.clientY
            }
        })
    }

    drawCircles(ctx, x, y, ) {
        ctx.globalAlpha = 0.3;
        ctx.beginPath()
        ctx.arc(x, y, 60, 0, 2 * Math.PI)
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(x, y, 40, 0, 2 * Math.PI)
        ctx.fillStyle = 'green'
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
        ctx.globalAlpha = 1.0;
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        const playhead = this.props.playhead;
        const flowers = this.props.flowers;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = this.props.windowDims.width;
        const height = canvas.height;
        const index = this.props.activeFlower.index;
        const mouseX = this.state.canvasMouse.mouseX;
        const mouseY = this.state.canvasMouse.mouseY;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        let hovering = false;
        for (let i = 0; i < flowers.length; i++) {
            let flower = flowers[i];
            let x = flower.normalX * width;
            let y = flower.normalY * height;
            let r = flower.radius;
            let distanceSqrd = Math.pow((mouseX - x), 2) + Math.pow((mouseY - y), 2)
            if (i === index || (distanceSqrd <= 3600 && !hovering)) {
                ctx.globalAlpha = 0.3
                hovering = true;
            } else {
                ctx.globalAlpha = 1.0
            }
            ctx.drawImage(this.image, x - r, y - r, r * 2, r * 2);
            if ((i === index || (distanceSqrd <= 3600 && hovering)) && !flower.fresh) {
                console.log(flower.fresh)
                this.drawCircles(ctx, x, y)
            }
        }
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(playhead, height);
        ctx.lineTo(playhead, 0);
        ctx.stroke();
        ctx.restore();
    }

    componentWillUnmount () {
    }

    render() {
        return (
            <div>
                <canvas id="synth-canvas" width={this.props.windowDims.width} height={this.props.windowDims.height} ref={this.canvasRef} onMouseMove={this.handleMouseMove} />
            </div>
        )
    }
}

export default SynthCanvas;
