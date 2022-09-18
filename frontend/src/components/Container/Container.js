import { React } from 'react';
import './Container.css'

function Container({ content }) {
    return(
        <div className='grid-item-container'>
            {content}
        </div>
    )
}

export default Container;