import React from 'react'
import img from './img/logo_plane.png'
import { DarkMode } from './DarkMode/DarkMode'

export const NavBar = () => {
  return (
    <nav>
        <div className='logo'>
          <img className='img' src={img} alt="" />
          <h2>Ground Station</h2>
        </div>
        <div>
          <DarkMode />
        </div>
    </nav>
  )
}
