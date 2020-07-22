import React from 'react';
import './App.css';
import ControlBoard from './ControlBoard';

let deepEqual = require('deep-equal')

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
        window.addEventListener('resize', this.updateBoardDimensions);
        this.updateBoardDimensions();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // leave this for test in production
        console.log('app update: ')
    }

    updateBoardDimensions = (event) => {
        this.setState({ windowDims: {width: window.innerWidth, height: window.innerHeight }});
    }

    render() {
        // leave this for test in production
        console.log('app render: ')
        return (
            <ControlBoard
                width={this.state.windowDims.width}
                height={this.state.windowDims.height}
            />
        )
    }
}

export default App;
