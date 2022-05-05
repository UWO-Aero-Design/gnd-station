import { React } from 'react';
import sample_camera from './sample_camera.png'
import './Camera.css'

function Camera() {
    return(
        <img className='camera-sample-img' src={sample_camera} alt="Camera"></img>
    )
}

export default Camera;