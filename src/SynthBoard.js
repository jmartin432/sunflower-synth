import React, {useState} from 'react';
import logo from './static/sunflower.png';
import './SynthBoard.css';
import SynthCanvas from './SynthCanvas';
import Animation from "./Animation";

class SynthBoard extends React.Component {

    constructor(props){
        super(props);
        this.onMenu = null
        this.flowerIndex = null
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.updateBoardDimensions = this.updateBoardDimensions.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.updateSpeed = this.updateSpeed.bind(this);
        this.updateMaxFreq = this.updateMaxFreq.bind(this);
        this.updateAttack = this.updateAttack.bind(this);
        this.updateDecay = this.updateDecay.bind(this);
        this.updateSustain = this.updateSustain.bind(this);
        this.updateRelease = this.updateRelease.bind(this);
        this.handleActionChange = this.handleActionChange.bind(this);
        this.activateMenu = this.activateMenu.bind(this);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            action: 'add',
            envelope: {
                attack: 0.1,
                decay: 0.1,
                sustain: 1.0,
                release: 0.1,
            },
            audioParams: {
                speed: 1.0,
                maxFreq: 130.81
            },
            flowers: []
        }
    }

    componentDidMount () {
        this.updateBoardDimensions();
        window.addEventListener('resize', this.updateBoardDimensions);
        document.addEventListener("keydown", this.handleKey, false);
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
        if (this.onMenu) return;
        let mouseX = event.clientX
        let mouseY = event.clientY
        let normalMouseX = event.clientX / this.state.width;
        let normalMouseY = event.clientY / this.state.height;
        if (this.state.action === 'add') {
            this.state.flowers.push({'normalX': normalMouseX, 'normalY': normalMouseY, 'radius': 50, 'alpha': 0.3})
            this.flowerIndex = this.state.flowers.length - 1;
            document.getElementById("synth-board").addEventListener('mousemove', this.handleMouseMove)
            return;
        }
        let flowers = [...this.state.flowers];
        if (this.state.action === 'move') {
            if (flowers.length === 0) return
            for (let i=flowers.length-1; i>=0; i--){
                let flowerX = flowers[i].normalX * this.state.width;
                let flowerY = flowers[i].normalY * this.state.height;
                if (Math.hypot((flowerX - mouseX), (flowerY - mouseY)) < 20.0) {
                    this.flowerIndex = i;
                    flowers[i].alpha = 0.3
                    this.setState({flowers})
                    document.getElementById("synth-board").addEventListener('mousemove', this.handleMouseMove)
                    return;
                }
            }
        }
        if (this.state.action === 'delete') {
            if (flowers.length === 0) return
            for (let i=flowers.length-1; i>=0; i--){
                let flowerX = flowers[i].normalX * this.state.width;
                let flowerY = flowers[i].normalY * this.state.height;
                if (Math.hypot((flowerX - mouseX), (flowerY - mouseY)) < 20.0) {
                    this.flowerIndex = i;
                    return;
                }
            }
        }
    }

    handleMouseMove = (event) => {
        if (this.flowerIndex === null) return
        let normalMouseX = event.clientX / this.state.width;
        let normalMouseY = event.clientY / this.state.height;
        let flowers = [...this.state.flowers];
        let flower = flowers[this.flowerIndex];
        flower.normalX = normalMouseX;
        flower.normalY = normalMouseY;
        flowers[this.flowerIndex] = flower;
        this.setState({flowers})
    }

    handleMouseUp = (event) => {
        if (this.onMenu) return;
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        let flowers = [...this.state.flowers];
        let flower = flowers[this.flowerIndex];
        if (this.state.action === 'add' || this.state.action === 'move') {
            if (this.state.action === 'move' && flowers.length === 0) return;
            if (this.state.action === 'move' && this.flowerIndex === null) return;
            flower.alpha = 1.0;
            flowers[this.flowerIndex] = flower;
            this.flowerIndex = null;
            this.setState({flowers})
            document.getElementById("synth-board").removeEventListener('mousemove', this.handleMouseMove)
            return;
        }
        if (this.state.action === 'delete') {
            if (this.flowerIndex === null) return
            let flowerX = flowers[this.flowerIndex].normalX * this.state.width;
            let flowerY = flowers[this.flowerIndex].normalY * this.state.height;
            if (Math.hypot((flowerX - mouseX), (flowerY - mouseY)) < 20.0) {
                flowers.splice(this.flowerIndex, 1);
                this.flowerIndex = null;
                this.setState({flowers})
            }
        }
    }

    clearAll () {
        this.setState({flowers: []});
    }

    updateSpeed (event) {
        let audioParams = this.state.audioParams
        audioParams.speed = parseFloat(event.target.value)
        this.setState({audioParams: audioParams});
    }

    updateMaxFreq (event) {
        let audioParams = this.state.audioParams
        audioParams.maxFreq = parseFloat(event.target.value)
        this.setState({audioParams: audioParams});
    }

    updateAttack (event) {
        let envelope = this.state.envelope
        envelope.attack = parseFloat(event.target.value)
        this.setState({envelope: envelope});
    }

    updateDecay (event) {
        let envelope = this.state.envelope
        envelope.decay = parseFloat(event.target.value)
        this.setState({envelope: envelope});
    }

    updateSustain (event) {
        let envelope = this.state.envelope
        envelope.sustain = parseFloat(event.target.value)
        this.setState({envelope: envelope});
    }

    updateRelease (event) {
        let envelope = this.state.envelope
        envelope.release = parseFloat(event.target.value)
        this.setState({envelope: envelope});
    }

    activateMenu (event) {
        this.onMenu = (event.type === "mouseover")
    }

    handleActionChange (event) {
        this.setState({action: event.target.id})
    }

    menuDragStart(event) {
        let target = event.currentTarget
        let style = window.getComputedStyle(event.target, null);
        let id = target.id
        let mouseX = event.pageX
        let mouseY = event.pageY
        let offsetX = event.clientX - parseInt(style.getPropertyValue("left").replace('px', ''))
        let offsetY = event.clientY - parseInt(style.getPropertyValue("top").replace('px', ''))
        let data = (id + ',' + mouseX + ',' + mouseY + ',' + offsetX + ',' + offsetY)
        event.dataTransfer.setData("text/plain", data)
    }

    menuDragEnd (event) {
    }

    allowDropMenu(event) {
        event.preventDefault()
    }

    dropMenu(event) {
        let data = event.dataTransfer.getData("text/plain").split(',');
        let menu = document.getElementById(data[0])
        menu.style.left = (event.pageX - parseInt(data[3])) + 'px';
        menu.style.top = (event.pageY - parseInt(data[4])) + 'px';
        event.preventDefault()
    }

    render() {
        return (
            <div id={"synth-board"} draggable={false} onDragOver={this.allowDropMenu} onDrop={this.dropMenu} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                <div className={"menu"} id={"adsr-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <p>Max Frequency</p>
                    <input type="range" min="16.35" max="523.25" step="0.1" defaultValue="130.81" className="slider" id="maxFreq-slider" onChange={this.updateMaxFreq} ></input>
                    <p>Speed</p>
                    <input type="range" min="0" max="3" step="0.1" defaultValue="1.0" className="slider" id="speed-slider" onChange={this.updateSpeed} ></input>
                    <p>Attack</p>
                    <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="attack-slider" onChange={this.updateAttack} ></input>
                    <p>Decay</p>
                    <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="decay-slider" onChange={this.updateDecay} ></input>
                    <p>Sustain</p>
                    <input type="range" min="0" max="1.0" step="0.01" defaultValue="1.0" className="slider" id="sustain-slider" onChange={this.updateSustain} ></input>
                    <p>Release</p>
                    <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="release-slider" onChange={this.updateRelease} ></input>
                </div>
                <div className={"menu"} id={"flower-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <label htmlFor="add">Add</label><br></br>
                    <input type="radio" id="add" name="action" value="add" checked={this.state.action === 'add'} onChange={this.handleActionChange}></input>
                    <label htmlFor="move">Move</label><br></br>
                    <input type="radio" id="move" name="action" value="move" checked={this.state.action === 'move'} onChange={this.handleActionChange}></input>
                    <label htmlFor="delete">Delete</label><br></br>
                    <input type="radio" id="delete" name="action" value="delete" checked={this.state.action === 'delete'} onChange={this.handleActionChange}></input>
                    <button onClick={this.clearAll}>Clear</button>
                </div>
                <Animation audioContext={this.audioContext}
                           width={this.state.width}
                           height={this.state.height}
                           audioParams={this.state.audioParams}
                           envelope={this.state.envelope}
                           flowers={this.state.flowers}
                           action={this.state.action}
                />
            </div>
        )
    }
}

export default SynthBoard;
