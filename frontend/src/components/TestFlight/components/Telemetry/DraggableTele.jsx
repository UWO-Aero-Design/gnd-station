import React from 'react'
import { useInView } from "react-intersection-observer";

export const DraggableTele = ({provided, props}) => {



  return (

      <div                     
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps} 
      className={`tele-card shadow`}
      >
        <div>
          <p>{`${props.label}`}</p>
          <h2 className='semibold'>{props.val}</h2>
        </div>
      </div>


  )
}
