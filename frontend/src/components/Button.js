import React from 'react'
import "./ButtonLayout.css"
function Button({ButtonText, BackgroundColor, Style, clickFn}){
// const [ isClicked, setIsClicked ] = useState(false);
// const handleClick =()=>{
//     setIsClicked(!isClicked);
// }
//Try having the function as a parameter and actually defining the function in the Altimeter component 
//So different functions can be implemented such as the CanDrop syncing with the button to show when it can be dropped 
//The reset button not switching colour but only when clicked.
  
  let cssProperties = {
    '--btn-bg-color': BackgroundColor
  }
  // if (isClicked) {
  //   cssProperties['--btn-bg-color'] = '#FF0000'
  //   cssProperties['--btn-color'] = '#000000'
  //   console.log("clicked")
  // }
 
  return (
    <div className='container' style={cssProperties}>
      <button  style = {Style} className='btn' onClick={clickFn}>
        {ButtonText}
      </button>
    </div>
  )
}
export default Button;