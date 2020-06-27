import React, {useState} from 'react';
import logo from './static/sunflower.png';
import './SynthBoard.css';
import SynthCanvas from './SynthCanvas';
import Animation from "./Animation";

class SynthBoard extends React.Component {

    constructor(props){
        super(props);
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.updateBoardDimensions = this.updateBoardDimensions.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.updateSpeed = this.updateSpeed.bind(this);
        this.activateMenu = this.activateMenu.bind(this);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            moving: false,
            sizing: false,
            creating: false,
            deleting: false,
            index: null,
            speed: 1.0,
            onMenu: false,
            flowers: []
        }
    }

    componentDidMount () {
        this.updateBoardDimensions();
        window.addEventListener('resize', this.updateBoardDimensions);
        //document.addEventListener("click", this.handleClick, false);
        document.addEventListener("keydown", this.handleKey, false);
        document.addEventListener("mousedown", this.handleMouseDown, false);
        document.addEventListener("mouseup", this.handleMouseUp, false);
    }

    updateBoardDimensions() {
        console.log("Resize: ", window.innerWidth, window.innerHeight);
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.updateBoardDimensions);
        document.removeEventListener("click", this.handleClick, false);
    }

    handleKey = (event) => {
        console.log("Key", event);
        console.log(this.state.flowers);
    }

    handleMouseDown = (event) => {
        if (!this.state.onMenu) {
            let normalMouseX = event.clientX / this.state.width;
            let normalMouseY = event.clientY / this.state.height;
            for (let i = this.state.flowers.length - 1; i >= 0; i--) {
                let xDistance = Math.pow((normalMouseX - this.state.flowers[i].normalX), 2);
                let yDistance = Math.pow((normalMouseY - this.state.flowers[i].normalY), 2);
                if ((xDistance + yDistance) < .001) {
                    console.log("M: ", i);
                    let flowers = [...this.state.flowers];
                    let flower = flowers[i];
                    flower.alpha = 0.3;
                    flowers[i] = flower;
                    this.setState({moving: true, index: i, flowers: flowers});
                    return;
                }
                if (0.001 <= (xDistance + yDistance) && (xDistance + yDistance) < 0.002) {
                    console.log("S: ", i);
                    let flowers = [...this.state.flowers];
                    let flower = flowers[i];
                    flower.alpha = 0.7;
                    flowers[i] = flower;
                    this.setState({sizing: true, index: i, flowers: flowers});
                    return;
                }
            }
            this.setState({creating: true});
        }
    }

    handleMouseUp = (event) => {
        if (this.state.creating) {
            let normalX = event.clientX / this.state.width;
            let normalY = event.clientY / this.state.height;
            this.state.flowers.push({'normalX': normalX, 'normalY': normalY, 'radius': 50, 'alpha': 1.0})
        }
        if (this.state.moving) {
            let normalX = event.clientX / this.state.width;
            let normalY = event.clientY / this.state.height;
            let flowers = [...this.state.flowers];
            let flower = flowers[this.state.index];
            flower.alpha = 1.0;
            flower.normalX = normalX;
            flower.normalY = normalY;
            flowers[this.state.index] = flower;
            this.setState({flowers})
        }
        if (this.state.sizing) {
            let flowers = [...this.state.flowers];
            let flower = flowers[this.state.index];
            flower.alpha = 1.0;
            flowers[this.state.index] = flower;
            this.setState({flowers})
        }
        this.setState({creating: false, moving: false, sizing: false, index: null})
    }

    clearAll () {
        this.setState({flowers: []});
    }

    updateSpeed (event) {
        this.setState({speed: parseFloat(event.target.value)});
    }

    activateMenu (event) {
        this.setState({onMenu: event.type === "mouseover"});
    }

    render() {
        return (
            <div id={"synth-board"}>
                <div id={"menu"} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <button onClick={this.clearAll}>
                        Clear
                    </button>
                    <input type="range" min="0" max="3" step="0.1" defaultValue="1.0" className="slider" id="speed-slider" onChange={this.updateSpeed} ></input>
                </div>
                <Animation audioContext={this.audioContext} width={this.state.width} height={this.state.height} speed={this.state.speed} flowers={this.state.flowers}/>
            </div>
        )
    }
}

export default SynthBoard;
