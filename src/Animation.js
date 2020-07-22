import React from 'react';
import './ControlBoard.css';
import SynthCanvas from './SynthCanvas';

class Animation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playhead: 0.0
        }
        this.updatePlayhead = this.updatePlayhead.bind(this);
        this.resetPlayhead = this.resetPlayhead.bind(this);
        this.updateAnimationState = this.updateAnimationState.bind(this);
        this.render = this.render.bind(this)
    }

    componentDidMount() {
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    updateAnimationState() {
        this.setState(prevState => ({playhead: prevState.playhead + this.props.speed}));
        if (this.state.playhead >= this.props.width) {
            this.setState({playhead: 0})
        }
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
    }

    updatePlayhead () {
        this.playhead += this.props.audioParams.speed
    }

    resetPlayhead () {
        this.playhead = 0.0
    }

    render() {
        return (
            <SynthCanvas
                playhead={this.state.playhead}
                width={this.props.width}
                height={this.props.height}
                speed={this.props.speed}
                flowers={this.props.flowers}
                index={this.props.index}
                action={this.props.action}
                offsetNormalX={this.props.offsetNormalX}
                offsetNormalY={this.props.offsetNormalY}
                playNote={this.props.playNote}
            />
        )
    }
}

export default Animation;
