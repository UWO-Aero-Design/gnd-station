import React from 'react';
import './Altimeter.css'
import Button from '../Button/Button'

const MAX_ALTITUDE_FEET = 50;
const GREEN = '#00e676';
const RED = '#ff1744';
const METRES_TO_FEET = 3.28084;

function Altimeter({ telemetry, dropCommand, resetCommand, offset, zeroAlt, resetAlt }) {
    const [dropHeight, setDropHeight] = React.useState(null);

    const can_drop = () => {
        return alt <= MAX_ALTITUDE_FEET;
    }

    const drop = () => {
        setDropHeight(altDisplay);
        dropCommand();
    }

    const reset = () => {
        setDropHeight(null);
        resetCommand();
    }

    const alt = telemetry?.enviro?.altitude*METRES_TO_FEET - offset*METRES_TO_FEET;
    const altDisplay = (telemetry?.enviro?.altitude === undefined) ? '---' : parseFloat(alt).toFixed(2);
    const padaAltDisplay = dropHeight != null ? dropHeight : '----'
    const background_colour = can_drop() ?  GREEN : RED;



    return(
        <div className='altimeter'>
            <div className='altimeter-button-top'>
                <button className='altimeter-button' onClick={zeroAlt}>Zero Alt</button>
                <button className='altimeter-button' onClick={resetAlt}>Reset Alt</button>
            </div>
            <div className='altimeter-altitude'>
                <h3 className='altimeter-label'>Altitude</h3>
                <p className='inch-text'>{ altDisplay } ft</p>
                <h3 className='altimeter-label'>PADA Drop Height</h3>
                <p className='inch-text'>{ padaAltDisplay } ft</p>
            </div>
            <div className='altimeter-button-bottom'>
                <button className='altimeter-button' onClick={drop} style={{ backgroundColor: background_colour }}>Drop PADA</button>
                <button className='altimeter-button' onClick={reset}>Reset PADA</button>
            </div>
        </div>
    )
}

export default Altimeter;