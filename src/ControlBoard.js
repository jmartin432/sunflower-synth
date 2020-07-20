import React, {useState} from 'react';
import './ControlBoard.css';
import Animation from "./Animation";

class ControlBoard extends React.Component {

    constructor(props){
        super(props);
        this.onMenu = null
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
            flowers: [],
            activeFlower: {
                index: -1,
                action: null
            }
        }
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
    }

    componentWillUnmount () {}

    clampValue = (val, min, max) => {
        return val > max ? max : val < min ? min : val;
    }

    handleMouseDown = (event) => {
        if (this.onMenu) return;
        let mouseX = event.clientX
        let mouseY = event.clientY
        let normalMouseX = event.clientX / this.props.windowDims.width;
        let normalMouseY = event.clientY / this.props.windowDims.height;
        let flowers = [...this.state.flowers];
        let index;
        let action = null;
        for (let i=flowers.length-1; i>=0; i--){
            let flowerX = flowers[i].normalX * this.props.windowDims.width;
            let flowerY = flowers[i].normalY * this.props.windowDims.height;
            let distanceSqrd = Math.pow((mouseX - flowerX), 2) + Math.pow((mouseY - flowerY), 2)
            if (distanceSqrd <= 400.0) {
                index = i;
                action = 'delete'
                break;
            } else if (distanceSqrd <= 1600.0){
                index = i;
                action = 'move'
                break;
            } else if (distanceSqrd <= 3600.0) {
                index = i;
                action = 'resize'
                break;
            }
        }
        if (action === null) {
            action = 'add';
            flowers.push({'normalX': normalMouseX, 'normalY': normalMouseY, 'radius': 50, 'alpha': 0.3, 'fresh': true})
            index = flowers.length - 1;
        }
        document.getElementById("control-board").addEventListener('mousemove', this.handleMouseMove)
        console.log('down: ', action)
        this.setState({
            flowers: flowers,
            activeFlower: {
                action: action,
                index: index
            }
        })
    }

    handleMouseMove = (event) => {
        // if (this.state.activeFlower.index === null) return
        if (this.state.flowers.length === 0) return
        let action = this.state.activeFlower.action
        let index = this.state.activeFlower.index
        if (action === null || index < 0) {
            return
        }
        let flowers = [...this.state.flowers];
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        let normalMouseX = event.clientX / this.props.windowDims.width;
        let normalMouseY = event.clientY / this.props.windowDims.height;
        let flower = flowers[index];
        let flowerX = flower.normalX * this.props.windowDims.width;
        let flowerY = flower.normalY * this.props.windowDims.height;
        if (action === 'add' || action === 'move') {
            flower.normalX = normalMouseX;
            flower.normalY = normalMouseY;
        }
        if (action === 'resize') {
            let radius = Math.hypot((flowerX - mouseX), (flowerY - mouseY));
            flower.radius = this.clampValue(radius, 10, 100)
        }
        flowers[index] = flower;
        this.setState({
            flowers: flowers,
        })
    }

    handleMouseUp = (event) => {
        if (this.state.activeFlower.index === -1) return
        if (this.state.activeFlower.action === null) return
        let index = this.state.activeFlower.index
        let action = this.state.activeFlower.action
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        let flowers = [...this.state.flowers];
        let flower = flowers[index];
        let flowerX = flowers[index].normalX * this.props.windowDims.width;
        let flowerY = flowers[index].normalY * this.props.windowDims.height;
        if (action === 'add') {
            flower.fresh = false;
        }
        if (action === 'delete') {
            let distance = Math.hypot((flowerX - mouseX), (flowerY - mouseY))
            if (distance < 20.0) {
                flowers.splice(index, 1);
            }
        }
        this.setState({
            flowers: flowers,
            activeFlower: {
                action: null,
                index: -1
            }
        })
        document.getElementById("control-board").removeEventListener('mousemove', this.handleMouseMove)
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
            <div id={"control-board"} draggable={false} onDragOver={this.allowDropMenu} onDrop={this.dropMenu} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                <div className={"menu"} id={"adsr-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"adsr-menu-header"}>ADSR</h1>
                    <div className={"menu-content"} id={"adsr-menu-content"}>
                        <p>Attack</p>
                        <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="attack-slider" onChange={this.updateAttack} ></input>
                        <p>Decay</p>
                        <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="decay-slider" onChange={this.updateDecay} ></input>
                        <p>Sustain</p>
                        <input type="range" min="0" max="1.0" step="0.01" defaultValue="1.0" className="slider" id="sustain-slider" onChange={this.updateSustain} ></input>
                        <p>Release</p>
                        <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="release-slider" onChange={this.updateRelease} ></input>
                    </div>
                </div>
                <div className={"menu"} id={"flower-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"flower-menu-header"}>Flowers</h1>
                    <div className={"menu-content"} id={"flower-menu-content"}>
                        {/*<label htmlFor="add">Add</label><br></br>*/}
                        {/*<input type="radio" id="add" name="action" value="add" checked={this.state.action === 'add'} onChange={this.handleActionChange}></input>*/}
                        {/*<label htmlFor="move">Move</label><br></br>*/}
                        {/*<input type="radio" id="move" name="action" value="move" checked={this.state.action === 'move'} onChange={this.handleActionChange}></input>*/}
                        {/*<label htmlFor="resize">Resize</label><br></br>*/}
                        {/*<input type="radio" id="resize" name="action" value="resize" checked={this.state.action === 'resize'} onChange={this.handleActionChange}></input>*/}
                        {/*<label htmlFor="delete">Delete</label><br></br>*/}
                        {/*<input type="radio" id="delete" name="action" value="delete" checked={this.state.action === 'delete'} onChange={this.handleActionChange}></input>*/}
                        <button onClick={this.clearAll}>Clear</button>
                    </div>
                </div>
                <div className={"menu"} id={"params-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"params-menu-header"}>Parameters</h1>
                    <div className={"menu-content"} id={"params-menu-content"}>
                        <p>Max Frequency</p>
                        <input type="range" min="16.35" max="523.25" step="0.1" defaultValue="130.81" className="slider" id="maxFreq-slider" onChange={this.updateMaxFreq} ></input>
                        <p>Speed</p>
                        <input type="range" min="0" max="3" step="0.1" defaultValue="1.0" className="slider" id="speed-slider" onChange={this.updateSpeed} ></input>
                    </div>
                </div>
                <Animation flowers={this.state.flowers}
                           activeFlower={this.state.activeFlower}
                           windowDims={this.props.windowDims}
                           audioParams={this.state.audioParams}
                           envelope={this.state.envelope}
                />
            </div>
        )
    }
}

export default ControlBoard;
