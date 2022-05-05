import { React } from 'react';
import sample_map from './sample_map.png'
import './Map.css'

function Map() {
    return(
        <img className='map-sample-img' src={sample_map} alt="Map"></img>
    )
}

export default Map;