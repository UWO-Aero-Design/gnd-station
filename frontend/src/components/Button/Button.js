import React from 'react'
import "./ButtonLayout.css"
function Button({ButtonText, BackgroundColor, Style, clickFn}){
  
  let cssProperties = {
    '--btn-bg-color': BackgroundColor
  }
 
  return (
    <div className='container' style={cssProperties}>
      <button  style = {Style} className='btn' onClick={clickFn}>
        {ButtonText}
      </button>
    </div>
  )
}
export default Button;