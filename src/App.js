import React from 'react';
import './App.css';
import ControlBoard from './ControlBoard';

class App extends React.Component{

    constructor(props){
        super(props)
        this.updateBoardDimensions = this.updateBoardDimensions.bind(this);
        this.state = {
            windowDims: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
    }

    componentDidMount () {
        this.updateBoardDimensions();
        window.addEventListener('resize', this.updateBoardDimensions);
    }

    updateBoardDimensions = (event) => {
        this.setState({ windowDims: {width: window.innerWidth, height: window.innerHeight }});
    }

    render() {
        return (
            <ControlBoard windowDims={this.state.windowDims} />
        )
    }
}

export default App;
