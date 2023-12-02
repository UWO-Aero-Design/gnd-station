import React, { useRef, useState } from 'react'
import vid from './img/drone.mp4'
import { Time } from './Time'

export const FPV = () => {
  const vidRef= useRef(null)
  const [clicked,setClicked] = useState(false)
  const btnClick = () => {
    setClicked(prev=>!prev)
    if(clicked){
      vidRef.current.play()
    }else{
      vidRef.current.pause()
    }
  }

  return (
    <div className='fpv '>
        <div className='fpv-card vid shadow'>
            <video
                ref={vidRef}
                className='video'
                src={vid}
                autoPlay
                loop
                muted
            ></video>
            <div className='btn'>
              <button onClick={btnClick}>Disable camera</button>
            </div>
        </div>
        <Time />
    </div>
  )
}
