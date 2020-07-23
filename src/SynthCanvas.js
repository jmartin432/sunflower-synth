import React from 'react';
import sunflower from './static/sunflower.png';

class SynthCanvas extends React.Component {

    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.image = new Image();
    }

    componentWillMount() {
        this.image.src = sunflower;
    }

    componentDidMount () {
    }

    drawCircles(ctx, x, y, r) {
        ctx.globalAlpha = 0.3;
        ctx.beginPath()
        ctx.arc(x, y, r * 1.05, 0, 2 * Math.PI)
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(x, y, r * 0.7, 0, 2 * Math.PI)
        ctx.fillStyle = 'green'
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(x, y, r * 0.35, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
        ctx.globalAlpha = 1.0;
    }

    drawFrame(playhead, speed, flowers, canvas, width, index) {
        const ctx = canvas.getContext('2d');
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        for (let i = 0; i < flowers.length; i++) {
            let flower = flowers[i];
            let flowerX = flower.normalX * width;
            let flowerY = flower.normalY * height;
            //Check for note
            if (flower.normalX * width <= playhead && playhead < flower.normalX * width + speed) {
                this.props.playNote(flower.normalY, flower.radius)
            }
            if (i === index) {
                ctx.globalAlpha = 0.3;
                ctx.drawImage(this.image, flowerX - flower.radius, flowerY - flower.radius, flower.radius * 2, flower.radius * 2);
                if (!flower.fresh) {
                   this.drawCircles(ctx, flowerX, flowerY, flower.radius)
                }
            } else {
                ctx.globalAlpha = 1.0
                ctx.drawImage(this.image, flowerX - flower.radius, flowerY - flower.radius, flower.radius * 2, flower.radius * 2);
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

    componentDidUpdate (prevProps, prevState, snapshot) {
        this.drawFrame(
            this.props.playhead,
            this.props.speed,
            this.props.flowers,
            this.canvasRef.current,
            this.props.width,
            this.props.index
        )
    }

    componentWillUnmount () {
    }

    render() {
        return (
            <div>
                <canvas id="synth-canvas" width={this.props.width} height={this.props.height} ref={this.canvasRef} />
            </div>
        )
    }
}

export default SynthCanvas;
