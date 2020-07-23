import React from 'react';

class SynthEngine extends React.Component {

    constructor(props) {
        super(props);
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        // this.offlineAudioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)()
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination)
        this.reverb = {};
        this.state = {
            waveform: null,
            reverb: null
        }
    }

    updateReverb = (reverbLength) => {
        let convolver = this.audioContext.createConvolver();
        let bufferLength = Math.round(reverbLength * this.audioContext.sampleRate)
        let noiseBuffer = this.audioContext.createBuffer(2, bufferLength, this.audioContext.sampleRate);
        let left = noiseBuffer.getChannelData(0);
        let right = noiseBuffer.getChannelData(1);

        for (let i = 0; i < noiseBuffer.length; i++) {
            left[i] = Math.random() * 2 - 1;
            right[i] = Math.random() * 2 - 1;
        }
        convolver.buffer = noiseBuffer;
        this.setState({reverb: convolver});
    }


    updateWaveform = () => {
        let waveParts = new Promise ( (resolve, reject) => {
            let w = this.createWaveForm();
            resolve(w);
        });

        waveParts.then(result => {
            this.setState({waveform: this.audioContext.createPeriodicWave(result[0], result[1])})
        }, function(err) {
            console.log(err);
        });
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

    playNote = function(y, r, s) {
        console.log('note: ', y, r)
        let pitch = 16.35 * Math.pow(this.props.maxFreq / 16.35, (1 - y))
        let amplitude = r / 100.0;
        // NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
        // mapping 0 - 3 speed slider to 3.5 - .5 notelength, fast speed shorter notes
        //let noteLength = -1.0 * ((((s - 0.0) * (-0.5 - -3.5)) / (3.0 - 0.0)) + -3.5)
        let noteLength = this.props.noteLength
        const now = this.audioContext.currentTime
        const envelopeGain = this.audioContext.createGain()
        envelopeGain.gain.setValueAtTime(0.0, now)
        if (this.props.attack >= noteLength) {
            envelopeGain.gain.linearRampToValueAtTime(noteLength * (amplitude / this.props.attack), now + noteLength)
            envelopeGain.gain.linearRampToValueAtTime(0.0, now + (noteLength + this.props.release))
        } else if (this.props.attack + this.props.decay >= noteLength) {
            envelopeGain.gain.linearRampToValueAtTime(amplitude, now + this.props.attack)
            envelopeGain.gain.linearRampToValueAtTime(((amplitude - (this.props.sustain * amplitude)) / this.props.decay) * (noteLength - this.props.attack) + amplitude, now + noteLength)
            envelopeGain.gain.linearRampToValueAtTime(0.0, now + (noteLength + this.props.release))
        } else {
            envelopeGain.gain.linearRampToValueAtTime(amplitude, now + this.props.attack)
            envelopeGain.gain.linearRampToValueAtTime(amplitude * this.props.sustain, now + (this.props.attack +  this.props.decay))
            envelopeGain.gain.linearRampToValueAtTime(0.0, now + (noteLength + this.props.release))
        }

        const reverb = this.state.reverb
        const waveform = this.state.waveform

        const oscillator = this.audioContext.createOscillator();
        oscillator.setPeriodicWave(waveform);

        oscillator.frequency.setValueAtTime(pitch, now)
        oscillator.connect(envelopeGain)
        envelopeGain.connect(reverb)
        reverb.connect(this.masterGain);
        oscillator.start(now)
        oscillator.stop(now + (noteLength + this.props.release));
    }

    componentWillMount() {
    }

    componentDidMount () {
        this.updateReverb(1.0);
        this.updateWaveform()
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate(nextProps, nextState,snapshot) {
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (prevProps.reverbLength !== this.props.reverbLength) {
            this.updateReverb(this.props.reverbLength)
        }
        if (prevProps.masterGain !== this.props.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(this.props.masterGain, this.audioContext.currentTime + 0.1)
        }
    }

    componentWillUnmount () {
        this.audioContext.close()
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

export default SynthEngine;
