import React from 'react';

class Audio extends React.Component{

    constructor(props) {
        super (props)
    }

    componentDidMount() {
        this.oscillator = this.context.createOscillator();
        this.oscillator.type = 'sawtooth';
        this.gain = this.context.createGain();
        this.oscillator.connect(this.gain);
        this.gain.connect(this.context.destination);
    }

    componentWillUnmount() {
        this.oscillator.disconnect();
        this.gain.disconnect();
    }




    play(pitchScalar, lengthScalar) {
        this.init();
        const time = this.context.currentTime;
        this.oscillator.frequency.value = 10000 * pitchScalar;
        this.gain.gain.setValueAtTime(1, time);
        this.oscillator.start(time);

        this.stop(lengthScalar);

    }

    stop(time) {
        this.gain.gain.setValueAtTime(0, time);
        this.oscillator.stop(time);
    }

}

export default Audio;

let audioContext, masterGain

// function createSawOscillator () {
//   const now = audioContext.currentTime
//   const oscillator = audioContext.createOscillator()
//   oscillator.type = 'sawtooth'
//   oscillator.start(now)
//
//   const gain = audioContext.createGain()
//   gain.connect(masterGain)
//   oscillator.connect(gain)
//
//   // Sweep from A3 to A6.
//   oscillator.frequency.setValueAtTime(220, now)
//   oscillator.frequency.linearRampToValueAtTime(1760, now + 4)
//
//   // Play for 4 seconds, then fade out.
//   gain.gain.setValueAtTime(0.1, now)
//   gain.gain.setValueAtTime(0.1, now + 4)
//   gain.gain.linearRampToValueAtTime(0.0, now + 5)
//
//   return {gain, oscillator}
// }
//
// $(function main () {
//   audioContext = new (window.AudioContext || window.webkitAudioContext)()
//   masterGain = audioContext.createGain()
//   masterGain.connect(audioContext.destination)
//   const song = new Audio('//zacharydenton.github.io/noisehack/static/zero_centre.mp3')
//   song.crossOrigin = 'anonymous'
//   const songSource = audioContext.createMediaElementSource(song)
//   let songPlaying = false
//   songSource.connect(masterGain)
//
//   $('.play-btn').click(createSawOscillator)
//   $('.song-btn').click(function() {
//     if (songPlaying) {
//       $('.song-btn').text('Play Song')
//       song.pause()
//     } else {
//       $('.song-btn').text('Pause')
//       song.play()
//     }
//     songPlaying = !songPlaying
//   })
//   $('pre.sourceCode.javascript').each(function() {
//     const script = document.createElement('script')
//     script.textContent = this.textContent
//     this.parentNode.insertBefore(script, this)
//   })
// })
