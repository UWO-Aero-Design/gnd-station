import React from 'react'
import logo from './img/Aerodesign_Logo_White.png'

export const Time = () => {
  return (
    <div className='fpv-card text shadow'>
        <img src={logo} alt="" className='logo-timer'/>
        <div className='timer-container'>
            <div className='timer'>
                <div className='timer_card'>
                    <p className='timer-card-title'>CLT:</p>
                    <p>00:00:00:00</p>
                </div>
                <div className='timer_card'>
                    <p className='timer-card-title'>VOT:</p>
                    <p>00:00:00:00</p>
                </div>
                <div className='timer_card'>
                    <p className='timer-card-title'>FLY:</p>
                    <p>00:00:00:00</p>
                </div>
                <div className='timer_card'>
                    <p className='timer-card-title'>DROP:</p>
                    <p>00:00:00:00</p>
                </div>
                <div className='timer_card'>
                    <p className='timer-card-title'>LAND:</p>
                    <p>00:00:00:00</p>
                </div>
            </div>
            <button className='timer-btn'>Button!</button>
        </div>
    </div>
  )
}
