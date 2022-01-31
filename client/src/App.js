import React, { useState, useRef } from 'react';
import './App.css';
import Buttons from './Buttons/Buttons';
import Joystick from './joystick/Joystick';

function App() {
  const [connected, setConnected] = useState(false);
  const socket = useRef()

  socket.current = new WebSocket('ws://localhost:5000')

  socket.current.onopen = () => {
    setConnected(true)
    console.log("Connected")
  }
  socket.current.onclose = () => {
    console.log('WebSocket closed')
  }
  socket.current.onerror = () => {
    console.log('WebSocket Error')
  }

  return (
    <div className="app">
      <Joystick ws={socket} />

      <Buttons ws={socket} />
      <div className='info'>
        <div>WebSocket data in VScode console</div>
        {connected ? <p>WebSocket is working</p> : <p>WebSocket doesn't work :c </p>}
      </div>
    </div>
  );
}

export default App;
