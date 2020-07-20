import React from 'react';

class MakeNotes extends React.Component {

    constructor(props){
        super(props);
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination)
        this.masterGain.gain.setValueAtTime(1.0, this.audioContext.currentTime)
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

    playNote = function(pitch, noteLength, amplitude, envelope) {
        const now = this.audioContext.currentTime
        const envelopeGain = this.audioContext.createGain()
        envelopeGain.gain.setValueAtTime(0.0, now)
        if (envelope.attack >= noteLength) {
            envelopeGain.gain.linearRampToValueAtTime(noteLength * (amplitude / envelope.attack), now + noteLength)
            envelopeGain.gain.linearRampToValueAtTime(0.0, now + (noteLength + envelope.release))
        } else if (envelope.attack + envelope.decay >= noteLength) {
            envelopeGain.gain.linearRampToValueAtTime(amplitude, now + envelope.attack)
            envelopeGain.gain.linearRampToValueAtTime(((amplitude - (envelope.sustain * amplitude)) / envelope.decay) * (noteLength - envelope.attack) + amplitude, now + noteLength)
            envelopeGain.gain.linearRampToValueAtTime(0.0, now + (noteLength + envelope.release))
        } else {
            envelopeGain.gain.linearRampToValueAtTime(amplitude, now + envelope.attack)
            envelopeGain.gain.linearRampToValueAtTime(amplitude * envelope.sustain, now + (envelope.attack +  envelope.decay))
            envelopeGain.gain.linearRampToValueAtTime(0.0, now + (noteLength + envelope.release))
        }

        const oscillator = this.audioContext.createOscillator();
        let wave;
        let waveParts = new Promise ( (resolve, reject) => {
            let w = this.createWaveForm();
            resolve(w);
        });

        waveParts.then(result => {
            wave = this.audioContext.createPeriodicWave(result[0], result[1]);
            oscillator.setPeriodicWave(wave);
        }, function(err) {
            console.log(err);
        });
        oscillator.frequency.setValueAtTime(pitch, now)
        oscillator.connect(envelopeGain).connect(this.audioContext.destination);
        oscillator.start(now)
        oscillator.stop(now + (noteLength + envelope.release));
        return {envelope, oscillator}
    }

    componentDidMount () {
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        const playhead = this.props.playhead;
        const flowers = this.props.flowers;
        const audioParams = this.props.audioParams;
        const envelope = this.props.envelope;
        const width = this.props.windowDims.width;

        for (let i = 0; i < flowers.length; i++) {
            let flower = flowers[i];

            if (flower.normalX * width <= playhead && playhead < flower.normalX * width + audioParams.speed) {
                let pitch = 16.35 * Math.pow(audioParams.maxFreq / 16.35, (1 - flower.normalY))
                let amplitude = flower.radius / 100.0;
                // NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
                // mapping 0 - 3 speed slider to 3.5 - .5 notelength, fast speed shorter notes
                let noteLength = -1.0 * ((((audioParams.speed - 0.0) * (-0.5 - -3.5)) / (3.0 - 0.0)) + -3.5)
                this.playNote(pitch, noteLength, amplitude, envelope)
            }
        }
    }

    componentWillUnmount () {
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

export default MakeNotes;
