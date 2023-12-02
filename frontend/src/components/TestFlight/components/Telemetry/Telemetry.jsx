import React, { useState } from 'react'
import { useEffect } from 'react';
import { DraggableTele } from './DraggableTele';
import { useInView } from "react-intersection-observer";
import { DragDropContext } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';


export const Telemetry = () => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const initialList=[
    {id: '1', label: 'Heading', val: '150 units'},
    {id: '2', label: 'Altitude', val: '200 ft'},
    {id: '3', label: 'Speed', val: '50 m/s'},
    {id: '4', label: 'GPS', val: '150 coord'}
  ]

  const [dragDropList,setDragDropList]=useState(initialList);

  const onDragComplete = (result) => {
    if (!result.destination) return;
  
    const arr = [...dragDropList];
    
  
    //Changing the position of Array element
    let removedItem = arr.splice(result.source.index, 1)[0];
    arr.splice(result.destination.index, 0, removedItem);
  
    //Updating the list
    setDragDropList(arr);
  };

  
  return (
      <DragDropContext  onDragEnd={onDragComplete} >
        <Droppable droppableId="drag-drop-list" direction="horizontal">
          {(provided, snapshot) => (
              <div className={`tele`  }              
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                  {dragDropList.map((item,index)=>{ 
                    return <Draggable key={item.id} draggableId={item.label} index={index}>
                      {(provided) => (
                        <DraggableTele provided={provided} props={item}/>
                      )}
                    </Draggable>
                  })}
                  
              </div>
          )}
        </Droppable>
      </DragDropContext>
  )
}
