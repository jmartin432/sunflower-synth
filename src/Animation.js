import React, {useState} from 'react';
import logo from './static/sunflower.png';
import './SynthBoard.css';
import SynthCanvas from './SynthCanvas';

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
    this.setState(prevState => ({ playhead: prevState.playhead + this.props.audioParams.speed }));
    if (this.state.playhead >= this.props.width){
      this.setState({playhead: 0})
    }
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    return <SynthCanvas audioContext={this.props.audioContext} width={this.props.width} height={this.props.height} playhead={this.state.playhead} audioParams={this.props.audioParams} envelope={this.props.envelope} flowers={this.props.flowers}/>;
  }
}

export default Animation;
