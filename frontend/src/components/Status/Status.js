import { React, useState } from 'react';
import Telemetry from '../Telemetry/Telemetry'
import './Status.css'

const READY_LABEL_COLOUR = '#2ecc71'
const PADA_ARMED_LABEL_COLOUR = '#9b59b6'
const SERVER_DISCONNECTED_LABEL_COLOUR = '#e17055'
const NO_TELEMETRY_LABEL_COLOUR = '#e74c3c'

function Status({ telemetry, status, ports, updateComPorts, selectComPort, currentPort, packetRate, sendCommands, currentStream }) {
    const get_label_colour = (status) => {
        status = status.toUpperCase();
        switch(status) {
            case 'READY':
                return READY_LABEL_COLOUR;
            case 'PADA ARMED':
                return PADA_ARMED_LABEL_COLOUR;
            case 'NO TELEMETRY':
                return NO_TELEMETRY_LABEL_COLOUR;
            case 'SERVER DISCONNECTED':
            default:
                return SERVER_DISCONNECTED_LABEL_COLOUR;
        }
    }

    const handle_com_select = () => {
        const path = document.getElementById('com-port-selection').value;
        if(!path || path == 'DEFAULT') {
            return;
        }
        selectComPort(path)
    }

    const get_options = () => {
        let result;
        if(ports.length == 0) result = <option value='DEFAULT' disabled >No COM ports</option>
        else {
            result = ports.map((port, key) => {
                return <option key={key} value={port.path} disabled={currentPort===port.path}>{port.path}</option>
            })
        }
        return result;
    }
    

    return(
        <div className='status-container'>
            <div className='status-label' style={{ backgroundColor: get_label_colour(status) }}>
                { status }
            </div>
            <Telemetry telemetry={telemetry} packetRate={packetRate}></Telemetry>
            <div className='status-com-form'>
                <select defaultValue={'DEFAULT'} id='com-port-selection'>{get_options()}</select>
                <button onClick={ updateComPorts }>Update</button>
                <button onClick={ handle_com_select }>Select</button>
            </div>
            <p>Current port: {currentPort}</p>
            <p>Current stream: {currentStream}</p>
            <button onClick={() => { sendCommands([ { command: 'RESET_PROCESSOR' } ]) }}>Reset Processor</button>
        </div>
        
        
    )
}

export default Status;