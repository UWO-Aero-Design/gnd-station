import { React, useState, useEffect } from 'react';
import logo from './Aerodesign_Logo_White.png'
import './Timer.css'

const MAX_DROP_TIME_MS = 5*1000*60;
const MAX_FLY_TIME_MS = 6*1000*60;

const DROP_TIME_CRITICAL_PERCENT = 0.2;
const FLY_TIME_CRITICAL_PERCENT = 0.2;

function Timer({ telemetry, isFlying }) {
    const [clt, setClt] = useState(new Date());
    const [flyTime, setFlyTime] = useState(null);
    const [dropTime, setDropTime] = useState(null);
    const [landTime, setLandTime] = useState(null);

    useEffect(() => {
        if(isFlying) {
            start_flight()
        }
        else {
            stop_flight();
        }
    }, [isFlying])

    const date_to_string = (date) => {
        let string = ''
        string += date.getHours().toString().padStart(2, '0');
        string += ':' + date.getMinutes().toString().padStart(2, '0')
        string += ':' + date.getSeconds().toString().padStart(2, '0')
        string += ':' + date.getMilliseconds().toString().substring(0,2).padStart(2, '0')
        return string
    
    }

    const date_to_utc_string = (date) => {
        let string = '';
        string += date.getUTCHours().toString().padStart(2, '0');
        string += ':' + date.getMinutes().toString().padStart(2, '0')
        string += ':' + date.getSeconds().toString().padStart(2, '0')
        string += ':' + date.getMilliseconds().toString().substring(0,2).padStart(2, '0')
        return string;
    }

    const start_flight = () => {
        const now = new Date();
        setFlyTime(now);
        setDropTime(new Date(now.getTime() + MAX_DROP_TIME_MS))
        setLandTime(new Date(now.getTime() + MAX_FLY_TIME_MS))
    }

    const stop_flight = () => {
        setFlyTime(null);
        setDropTime(null)
        setLandTime(null)
    }

    useEffect(() => {
        setInterval(() => {
            setClt(new Date())
        }, 10)

        setInterval(() => {
            // console.log(telemetry)
        },500)
    }, [])

    const now = new Date();

    const clt_display = date_to_string(clt);
    let vot_display
    if(telemetry?.header?.time) vot_display = date_to_utc_string(new Date(telemetry.header.time))
    else vot_display = '00:00:00:00'
    const fly_display = (flyTime === null) ? '00:00:00:00' : date_to_utc_string(new Date(now - flyTime));

    const time_to_drop = new Date(dropTime - now);
    const remaining_drop_percent = time_to_drop/MAX_DROP_TIME_MS
    const drop_display = (dropTime === null) ? '00:05:00:00' : date_to_utc_string(time_to_drop);

    const time_to_land = new Date(landTime - now);
    const remaining_fly_percent = time_to_land/MAX_FLY_TIME_MS
    const land_display = (landTime === null) ? '00:06:00:00' : date_to_utc_string(time_to_land);

    return(
        <div className='timer'>
            <img className='logo' src={logo} alt="Western Aero Design"></img>
            <div className='timer-grid'>
                <div className='timer-grid-1 timer-grid-item-label'>CLT:</div>
                <div className='timer-grid-2 timer-grid-item-content'>{clt_display}</div>
                <div className='timer-grid-3 timer-grid-item-label'>VOT:</div>
                <div className='timer-grid-4 timer-grid-item-content'>{vot_display}</div>
                <div className='timer-grid-5 timer-grid-item-label'>FLY:</div>
                <div className='timer-grid-6 timer-grid-item-content'>{fly_display}</div>
                <div className='timer-grid-7 timer-grid-item-label'>DROP:</div>
                <div className={`timer-grid-8 timer-grid-item-content ${(dropTime !== null && remaining_drop_percent < DROP_TIME_CRITICAL_PERCENT) ? 'time-critical' : ''}`}>{drop_display}</div>
                <div className='timer-grid-9 timer-grid-item-label'>LAND:</div>
                <div className={`timer-grid-10 timer-grid-item-content ${(landTime !== null && remaining_fly_percent < FLY_TIME_CRITICAL_PERCENT) ? 'time-critical' : ''}`}>{land_display}</div>
            </div>
        </div>
    )
}

export default Timer;