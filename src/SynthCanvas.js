import React from 'react';
import sunflower from './static/sunflower.png';
import Flower from './Flower';
import Audio from './Audio';
import SynthBoard from './SynthBoard'

class SynthCanvas extends React.Component {

    constructor(props){
        super(props);
        this.notes = [];
        this.canvasRef = React.createRef();
        this.image = new Image();
    }

    playNote = function(pitchScalar, lengthScalar, speed) {
        const context = this.props.audioContext;
        const masterGain = context.createGain()
        masterGain.connect(context.destination)
        const now = context.currentTime
        const oscillator = context.createOscillator()
        oscillator.type = 'sawtooth'
        oscillator.start(now)

        const gain = context.createGain()
        gain.connect(masterGain)
        oscillator.connect(gain)

        oscillator.frequency.setValueAtTime(pitchScalar * 5000, now)

        gain.gain.setValueAtTime(0.0, now)
        gain.gain.setValueAtTime(0.7, now + .010)
        gain.gain.linearRampToValueAtTime(0.0, now + (lengthScalar / 50) / speed)
        oscillator.stop(now + (lengthScalar / 50) / speed);
        return {gain, oscillator}
    }

    componentDidMount () {
        this.image.src = sunflower;
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        const playhead = this.props.playhead;
        const flowers = this.props.flowers;
        const canvas = this.canvasRef.current;
        const speed = this.props.speed;
        const ctx = canvas.getContext('2d');
        const width = this.props.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        for (let i = 0; i < flowers.length; i++) {
            let flower = flowers[i];
            ctx.globalAlpha = flower.alpha;
            let x = flower.normalX * width;
            let y = flower.normalY * height;
            let r = flower.radius;
            ctx.drawImage(this.image, x - r, y - r, r * 2, r * 2);

            // Check for note
            if (flower.normalX * width <= playhead && playhead < flower.normalX * width + speed) {
                this.playNote(1 - flower.normalY, flower.radius, speed)
            }
        }
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(playhead, height);
        ctx.lineTo(playhead, 0);
        ctx.stroke();
        //ctx.restore();
    }

    componentWillUnmount () {
    }

    render() {
        return (
            <div>
                <canvas id="synth-canvas" width={this.props.width} height={this.props.height} ref={this.canvasRef} />
                {/*<Audio id="synth-note" notes={this.notes} />*/}
            </div>
        )
    }
}

export default SynthCanvas;
