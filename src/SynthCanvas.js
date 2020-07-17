import React from 'react';
import sunflower from './static/sunflower.png';

class SynthCanvas extends React.Component {

    constructor(props){
        super(props);
        this.notes = [];
        this.audioCtx = this.props.audioContext;
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.connect(this.audioCtx.destination)
        this.masterGain.gain.setValueAtTime(1.0, this.audioCtx.currentTime)
        this.canvasRef = React.createRef();
        this.image = new Image();
    }

    createWaveForm () {
        let real = new Float32Array(12);
        let imag = new Float32Array(12);

        real[0] = 0;
        real[1] = 0.4;
        real[2] = 0.4;
        real[3] = 1;
        real[4] = 1;
        real[5] = 1;
        real[6] = 0.3;
        real[7] = 0.7;
        real[8] = 0.6;
        real[9] = 0.5;
        real[10] = 0.9;
        real[11] = 0.8;

        // imag[0] = Math.random();
        // imag[1] = Math.random();
        // imag[2] = Math.random();
        // imag[3] = Math.random();
        // imag[4] = Math.random();
        // imag[5] = Math.random();
        // imag[6] = Math.random();
        // imag[7] = Math.random();
        // imag[8] = Math.random();
        // imag[9] = Math.random();
        // imag[10] = Math.random();
        // imag[11] = Math.random();


        return [real, imag];
    }

    playNote = function(pitch, speed, noteLength, envelope) {
        console.log(pitch)
        const now = this.audioCtx.currentTime
        const envelopeGain = this.audioCtx.createGain()
        envelopeGain.gain.setValueAtTime(0.0, now)
        envelopeGain.gain.linearRampToValueAtTime(1.0, now + envelope.attack)
        envelopeGain.gain.linearRampToValueAtTime(envelope.sustain, now + (envelope.attack + envelope.decay))
        envelopeGain.gain.linearRampToValueAtTime(0.0, now + (noteLength + envelope.release))

        const oscillator = this.audioCtx.createOscillator();
        let wave;
        let waveParts = new Promise ( (resolve, reject) => {
            let w = this.createWaveForm();
            resolve(w);
        });

        waveParts.then(result => {
            wave = this.audioCtx.createPeriodicWave(result[0], result[1]);
            oscillator.setPeriodicWave(wave);
        }, function(err) {
            console.log(err);
        });
        oscillator.frequency.setValueAtTime(pitch, now)
        oscillator.connect(envelopeGain).connect(this.audioCtx.destination);
        oscillator.start(now)
        oscillator.stop(now + (noteLength + envelope.release));
        return {envelope, oscillator}
    }

    componentDidMount () {
        this.image.src = sunflower;
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        const playhead = this.props.playhead;
        const flowers = this.props.flowers;
        const canvas = this.canvasRef.current;
        const audioParams = this.props.audioParams;
        const envelope = this.props.envelope;
        const ctx = canvas.getContext('2d');
        const width = this.props.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        for (let i = 0; i < flowers.length; i++) {
            let flower = flowers[i];
            ctx.globalAlpha = flower.alpha;
            let x = flower.normalX * width;
            let y = ((flower.normalY) * height);
            let r = flower.radius;
            ctx.drawImage(this.image, x - r, y - r, r * 2, r * 2);

            // Check for note
            if (flower.normalX * width <= playhead && playhead < flower.normalX * width + audioParams.speed) {
                console.log(flower.normalY)
                let pitch = 16.35 * Math.pow(audioParams.maxFreq / 16.35, (1 - flower.normalY))
                let noteLength = flower.radius / 20.0;
                this.playNote(pitch, audioParams.speed, noteLength, envelope)
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
