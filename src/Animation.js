import React, {useState} from 'react';
import './ControlBoard.css';
import SynthCanvas from './SynthCanvas';
import MakeNotes from './MakeNotes';

class Animation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playhead: 0.0
        };
        this.updateAnimationState = this.updateAnimationState.bind(this);
    }

    componentDidMount() {
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    updateAnimationState() {
        this.setState(prevState => ({playhead: prevState.playhead + this.props.audioParams.speed}));
        if (this.state.playhead >= this.props.windowDims.width) {
            this.setState({playhead: 0})
        }
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
    }

    render() {

        return [
            <SynthCanvas
                key={0}
                playhead={this.state.playhead}
                windowDims={this.props.windowDims}
                audioParams={this.props.audioParams}
                envelope={this.props.envelope}
                flowers={this.props.flowers}
                activeFlower={this.props.activeFlower}
            />,
            <MakeNotes
                key={1}
                playhead={this.state.playhead}
                windowDims={this.props.windowDims}
                audioParams={this.props.audioParams}
                envelope={this.props.envelope}
                flowers={this.props.flowers}
                activeFlower={this.props.activeFlower}
            />
        ]
    }
}

export default Animation;
