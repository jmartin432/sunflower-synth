import React from 'react';
import './ControlBoard.css';
import Animation from "./Animation";
import SynthEngine from "./SynthEngine";

let deepEqual = require('deep-equal')
flock-menu,1109,29,166,29

class ControlBoard extends React.Component {

    constructor(props){
        super(props);
        this.onMenu = null;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.updateMasterGain = this.updateMasterGain.bind(this);
        this.updateSpeed = this.updateSpeed.bind(this);
        this.updateMaxFreq = this.updateMaxFreq.bind(this);
        this.updateNoteLength = this.updateNoteLength.bind(this);
        this.updateAttack = this.updateAttack.bind(this);
        this.updateDecay = this.updateDecay.bind(this);
        this.updateSustain = this.updateSustain.bind(this);
        this.updateRelease = this.updateRelease.bind(this);
        this.updateReverbLength = this.updateReverbLength.bind(this);
        this.activateMenu = this.activateMenu.bind(this);
        this.state = {
            envelope: {
                attack: 0.1,
                decay: 0.1,
                sustain: 1.0,
                release: 0.1,
            },
            audioParams: {
                masterGain: 1.0,
                speed: 1.0,
                maxFreq: 130.81,
                noteLength: 1.0
            },
            reverbParams: {
                reverbLength: 1.0
            },
            flowers: [],
            activeFlower: {
                index: -1,
                action: null,
                offsetNormalX: 0.0,
                offsetNormalY: 0.0
            }
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
    }

    componentWillUnmount () {}

    clampValue = (val, min, max) => {
        return val > max ? max : val < min ? min : val;
    }

    handleMouseMove = (event) => {
        if (this.onMenu) return;
        let flowers = [...this.state.flowers];
        let flower;
        let activeFLower = {};
        let action = this.state.activeFlower.action
        let index = this.state.activeFlower.index
        let tempIndex = -1
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        let normalMouseX = event.clientX / this.props.width;
        let normalMouseY = event.clientY / this.props.height;
        let offSetNormalX = this.state.activeFlower.offsetNormalX
        let offSetNormalY = this.state.activeFlower.offsetNormalY
        if (action == null) {
            for (let i = flowers.length - 1; i >= 0; i--) {
                flower = flowers[i];
                let flowerX = flower.normalX * this.props.width;
                let flowerY = flower.normalY * this.props.height;
                let distanceSqrd = Math.pow((mouseX - flowerX), 2) + Math.pow((mouseY - flowerY), 2)
                if (distanceSqrd <= Math.pow(flower.radius, 2)) {
                    tempIndex = i;
                    break;
                }
            }
            index = (tempIndex > -1) ? tempIndex : -1
        } else if (index >= 0) {
            flower = flowers[index];
            let flowerX = flower.normalX * this.props.width;
            let flowerY = flower.normalY * this.props.height;
            if (action === 'add') {
                flower.normalX = normalMouseX;
                flower.normalY = normalMouseY;
            }
            if (action === 'move') {
                flower.normalX = normalMouseX - offSetNormalX;
                flower.normalY = normalMouseY - offSetNormalY;
            }
            if (action === 'resize') {
                let radius = Math.hypot((flowerX - mouseX), (flowerY - mouseY));
                flower.radius = this.clampValue(radius, 10, 100)
            }
            flowers[index] = flower;
        }
        activeFLower = {
            action: action,
            index: index,
            offsetNormalX: offSetNormalX,
            offsetNormalY: offSetNormalY
        }
        if (!deepEqual(flowers, this.state.flowers) || !deepEqual(activeFLower, this.state.activeFlower)) {
            this.setState({
                flowers: flowers,
                activeFlower: activeFLower
            })
        }
    }

    handleMouseDown = (event) => {
        if (this.onMenu) return;
        let mouseX = event.clientX
        let mouseY = event.clientY
        let normalMouseX = event.clientX / this.props.width;
        let normalMouseY = event.clientY / this.props.height;
        let flowers = [...this.state.flowers];
        let flower;
        let activeFLower = {}
        let index = this.state.activeFlower.index;
        let action = null;
        if (index > -1) {
            flower = flowers[index]
            let flowerX = flower.normalX * this.props.width;
            let flowerY = flower.normalY * this.props.height;
            let distanceSqrd = Math.pow((mouseX - flowerX), 2) + Math.pow((mouseY - flowerY), 2)
            if (distanceSqrd <= Math.pow((flower.radius * 0.35), 2)) {
                action = 'delete';
            } else if (distanceSqrd <= Math.pow((flower.radius * 0.7), 2)) {
                action = 'move';
            } else if (distanceSqrd <= Math.pow((flower.radius * 1.05), 2)) {
                action = 'resize';
            }
        } else {
            action = 'add';
            flower = {'normalX': normalMouseX, 'normalY': normalMouseY, 'radius': 50, 'alpha': 0.3, 'fresh': true}
            flowers.push(flower)
            index = flowers.length - 1;
        }
        document.getElementById("control-board").addEventListener('mousemove', this.handleMouseMove)
        activeFLower = {
            action: action,
            index: index,
            offsetNormalX: normalMouseX - flower.normalX,
            offsetNormalY: normalMouseY - flower.normalY
        }
        if (!deepEqual(flowers, this.state.flowers) || !deepEqual(activeFLower, this.state.activeFlower)) {
            this.setState({
                flowers: flowers,
                activeFlower: activeFLower
            })
        }
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
        let activeFLower = {}
        let flowerX = flowers[index].normalX * this.props.width;
        let flowerY = flowers[index].normalY * this.props.height;
        if (action === 'add') {
            flower.fresh = false;
        }
        if (action === 'delete') {
            let distance = Math.hypot((flowerX - mouseX), (flowerY - mouseY))
            if (distance < 20.0) {
                flowers.splice(index, 1);
            }
            index = null;
        }
        activeFLower = {
            action: null,
            index: index,
            offsetNormalX: 0.0,
            offsetNormalY: 0.0
        }
        if (!deepEqual(flowers, this.state.flowers) || !deepEqual(activeFLower, this.state.activeFlower)) {
            this.setState({
                flowers: flowers,
                activeFlower: activeFLower
            })
        }
    }

    clearAll () {
        this.setState({flowers: []});
    }

    updateMasterGain (event) {
        let audioParams = this.state.audioParams
        audioParams.masterGain = parseFloat(event.target.value)
        this.setState({audioParams});
    }

    updateSpeed (event) {
        let audioParams = this.state.audioParams
        audioParams.speed = parseFloat(event.target.value)
        this.setState({audioParams});
    }

    updateMaxFreq (event) {
        let audioParams = this.state.audioParams
        audioParams.maxFreq = parseFloat(event.target.value)
        this.setState({audioParams});
    }

    updateNoteLength (event) {
        let audioParams = this.state.audioParams
        audioParams.noteLength = parseFloat(event.target.value)
        this.setState({audioParams});
    }

    updateAttack (event) {
        let envelope = this.state.envelope
        envelope.attack = parseFloat(event.target.value)
        this.setState({envelope});
    }

    updateDecay (event) {
        let envelope = this.state.envelope
        envelope.decay = parseFloat(event.target.value)
        this.setState({envelope});
    }

    updateSustain (event) {
        let envelope = this.state.envelope
        envelope.sustain = parseFloat(event.target.value)
        this.setState({envelope});
    }

    updateRelease (event) {
        let envelope = this.state.envelope
        envelope.release = parseFloat(event.target.value)
        this.setState({envelope});
    }

    updateReverbLength (event) {
        let reverbParams = this.state.reverbParams
        reverbParams.reverbLength = parseFloat(event.target.value)
        this.setState({reverbParams});
    }

    activateMenu (event) {
        this.onMenu = (event.type === "mouseover")
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

    updateDraggability(event, id, status) {
        let menu = document.getElementById(id)
        menu.setAttribute('draggable', status)
    }

    render() {
        return (
            <div id={"control-board"} draggable={false} onDragOver={this.allowDropMenu} onDrop={this.dropMenu} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove}>
                <div className={"menu"} id={"adsr-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"adsr-menu-header"}>ADSR</h1>
                    <div className={"menu-content"} id={"adsr-menu-content"}>
                        <p>Attack</p>
                        <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="attack-slider" onMouseEnter={(event) => this.updateDraggability(event, "adsr-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "adsr-menu", true)} onChange={this.updateAttack} />
                        <p>Decay</p>
                        <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="decay-slider" onMouseEnter={(event) => this.updateDraggability(event, "adsr-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "adsr-menu", true)} onChange={this.updateDecay} />
                        <p>Sustain</p>
                        <input type="range" min="0" max="1.0" step="0.01" defaultValue="1.0" className="slider" id="sustain-slider" onMouseEnter={(event) => this.updateDraggability(event, "adsr-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "adsr-menu", true)} onChange={this.updateSustain} ></input>
                        <p>Release</p>
                        <input type="range" min=".090" max="1.0" step=".001" defaultValue=".1" className="slider" id="release-slider" onMouseEnter={(event) => this.updateDraggability(event, "adsr-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "adsr-menu", true)} onChange={this.updateRelease} ></input>
                    </div>
                </div>
                <div className={"menu"} id={"flower-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"flower-menu-header"}>Flowers</h1>
                    <div className={"menu-content"} id={"flower-menu-content"}>
                        <button onMouseEnter={(event) => this.updateDraggability(event, "flower-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "flower-menu", true)} onClick={this.clearAll}>Clear</button>
                    </div>
                </div>
                <div className={"menu"} id={"params-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"params-menu-header"}>Parameters</h1>
                    <div className={"menu-content"} id={"params-menu-content"}>
                        <p>Master Gain</p>
                        <input type="range" min="0.0" max="1.0" step="0.01" defaultValue="1.0" className="slider" id="master-gain-slider" onMouseEnter={(event) => this.updateDraggability(event, "params-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "params-menu", true)} onChange={this.updateMasterGain} ></input>
                        <p>Max Frequency</p>
                        <input type="range" min="16.35" max="523.25" step="0.1" defaultValue="130.81" className="slider" id="maxFreq-slider" onMouseEnter={(event) => this.updateDraggability(event, "params-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "params-menu", true)} onChange={this.updateMaxFreq} ></input>
                        <p>Speed</p>
                        <input type="range" min="0" max="3" step="0.1" defaultValue="1.0" className="slider" id="speed-slider" onMouseEnter={(event) => this.updateDraggability(event, "params-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "params-menu", true)} onChange={this.updateSpeed} ></input>
                        <p>Note Length</p>
                        <input type="range" min="0.5" max="3" step="0.01" defaultValue="1.0" className="slider" id="note-length-slider" onMouseEnter={(event) => this.updateDraggability(event, "params-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "params-menu", true)} onChange={this.updateNoteLength} ></input>
                    </div>
                </div>
                <div className={"menu"} id={"reverb-menu"} draggable={true} onDragStart={this.menuDragStart} onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"reberb-menu-header"}>Reverb</h1>
                    <div className={"menu-content"} id={"reverb-menu-content"}>
                        <p>Buffer Length</p>
                        <input type="range" min="0.1" max="2.0" step="0.1" defaultValue="1.0" className="slider" id="reverb-length-slider" onMouseEnter={(event) => this.updateDraggability(event, "reverb-menu", false)} onMouseLeave={(event) => this.updateDraggability(event, "reverb-menu", true)} onChange={this.updateReverbLength} ></input>
                    </div>
                </div>
                <SynthEngine masterGain={this.state.audioParams.masterGain}
                             speed={this.state.audioParams.speed}
                             maxFreq={this.state.audioParams.maxFreq}
                             noteLength={this.state.audioParams.noteLength}
                             attack={this.state.envelope.attack}
                             decay={this.state.envelope.decay}
                             sustain={this.state.envelope.sustain}
                             release={this.state.envelope.release}
                             reverbLength={this.state.reverbParams.reverbLength}
                             ref={instance => { this.synthEngine = instance; }}
                />
                <Animation width={this.props.width}
                           height={this.props.height}
                           speed={this.state.audioParams.speed}
                           flowers={this.state.flowers}
                           index={this.state.activeFlower.index}
                           action={this.state.activeFlower.action}
                           offsetNormalX={this.state.activeFlower.offsetNormalX}
                           offsetNormalY={this.state.activeFlower.offsetNormalY}
                           playNote={(flowerY, radius) => this.synthEngine.playNote(flowerY, radius) }
                />
            </div>
        )
    }
}

export default ControlBoard;
