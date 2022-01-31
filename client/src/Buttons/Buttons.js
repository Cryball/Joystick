import React, { useState } from 'react';
import './Buttons.css'

function Buttons(props) {

    const [pressed, setPressed] = useState(false);

    let buttonOn = document.getElementById('buttonOn')
    let buttonOff = document.getElementById('buttonOff')

    if ((buttonOn !== null) && (buttonOff !== null)) {
        buttonOn.onmousedown = () => {
            props.ws.current.send(JSON.stringify({ buttons: "2:1:0" }))
            setPressed(true)
        }
        buttonOn.onmouseup = () => {
            props.ws.current.send(JSON.stringify({ buttons: "0:0:0" }))
            setPressed(false)
        }

        buttonOff.onmousedown = () => {
            if (pressed)
                props.ws.current.send(JSON.stringify({ buttons: "2:1:1" }))
            else
                props.ws.current.send(JSON.stringify({ buttons: "2:0:1" }))
        }
        buttonOff.onmouseup = () => {
            props.ws.current.send(JSON.stringify({ buttons: "0:0:0" }))
        }
    }

    return (<div className='buttons'>
        <button id='buttonOn'>ON</button>
        <button id='buttonOff'>OFF</button>
    </div>);
}

export default Buttons;
