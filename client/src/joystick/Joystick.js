import React from 'react';
import './Joystick.css'

function Joystick(props) {

    let canvas, ctx;
    let width, height, radius, x_orig, y_orig;
    let coord = { x: 0, y: 0 };
    let paint = false;

    window.addEventListener('load', () => {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        resize();

        document.addEventListener('mousedown', startDrawing);
        document.addEventListener('mouseup', stopDrawing);
        document.addEventListener('mousemove', Draw);

        document.addEventListener('touchstart', startDrawing);
        document.addEventListener('touchend', stopDrawing);
        document.addEventListener('touchcancel', stopDrawing);
        document.addEventListener('touchmove', Draw);
        window.addEventListener('resize', resize);

        document.getElementById("x_coordinate").innerText = 0;
        document.getElementById("y_coordinate").innerText = 0;
        document.getElementById("distance").innerText = 0;
        document.getElementById("angle").innerText = 0;
        document.getElementById("quarter").innerText = 0;
    });

    function resize() {
        width = window.innerWidth;
        radius = 100;
        height = radius * 6.5;
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        backgroundJoystick();
        viewJoystick(width / 2, height / 3);
    }

    function backgroundJoystick() {
        x_orig = width / 2;
        y_orig = height / 3;

        ctx.beginPath();
        ctx.arc(x_orig, y_orig, radius + 20, 0, Math.PI * 2, true);
        ctx.fillStyle = '#ECE5E5';
        ctx.fill();
    }

    function viewJoystick(width, height) {
        ctx.beginPath();
        ctx.arc(width, height, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = '#F08080';
        ctx.fill();
        ctx.strokeStyle = '#F6ABAB';
        ctx.lineWidth = 8;
        ctx.stroke();
    }

    function getPosition(event) {
        let mouse_x = event.clientX || event.touches[0].clientX;
        let mouse_y = event.clientY || event.touches[0].clientY;
        coord.x = mouse_x - canvas.offsetLeft;
        coord.y = mouse_y - canvas.offsetTop;
    }

    function circleCheck() {
        let current_radius = Math.sqrt(Math.pow(coord.x - x_orig, 2) + Math.pow(coord.y - y_orig, 2));
        if (radius >= current_radius)
            return true
        else
            return false
    }

    function startDrawing(event) {
        paint = true;
        getPosition(event);
        if (circleCheck()) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            backgroundJoystick();
            viewJoystick(coord.x, coord.y);
            Draw();
        }
    }

    function stopDrawing() {
        paint = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        backgroundJoystick();
        viewJoystick(width / 2, height / 3);

        document.getElementById("x_coordinate").innerText = 0;
        document.getElementById("y_coordinate").innerText = 0;
        document.getElementById("distance").innerText = 0;
        document.getElementById("angle").innerText = 0;
        document.getElementById("quarter").innerText = 0;
    }

    function Draw(event) {
        if (paint) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            backgroundJoystick();
            let angle_in_degrees, x, y;
            let angle = Math.atan2((coord.y - y_orig), (coord.x - x_orig));

            if (Math.sign(angle) === -1) {
                angle_in_degrees = Math.round(-angle * 180 / Math.PI);
            }
            else {
                angle_in_degrees = Math.round(360 - angle * 180 / Math.PI);
            }

            if (circleCheck()) {
                viewJoystick(coord.x, coord.y);
                x = coord.x;
                y = coord.y;
            }
            else {
                x = radius * Math.cos(angle) + x_orig;
                y = radius * Math.sin(angle) + y_orig;
                viewJoystick(x, y);
            }

            getPosition(event);

            let quarter;

            if ((angle_in_degrees >= 0) && (angle_in_degrees < 90)) {
                quarter = '1:0:0:0:1'
            }

            if ((angle_in_degrees >= 90) && (angle_in_degrees < 180)) {
                quarter = '1:0:0:1:0'
            }

            if ((angle_in_degrees >= 180) && (angle_in_degrees < 270)) {
                quarter = '1:0:1:0:0'
            }

            if ((angle_in_degrees >= 270) && (angle_in_degrees < 360)) {
                quarter = '1:1:0:0:0'
            }

            let distance = Math.round(100 * Math.sqrt(Math.pow(x - x_orig, 2) + Math.pow(y - y_orig, 2)) / radius);

            document.getElementById("x_coordinate").innerText = Math.round(x - x_orig);
            document.getElementById("y_coordinate").innerText = Math.round(y - y_orig);
            document.getElementById("distance").innerText = distance;
            document.getElementById("angle").innerText = angle_in_degrees;
            document.getElementById("quarter").innerText = quarter;

            sendToServer(quarter, distance)
        }
    }

    function sendToServer(quarter, distance) {
        let data = { quarter: quarter, distance: distance };
        props.ws.current.send(JSON.stringify(data));
    }


    return (<div>
        <div className='joystickCoords'>
            X: <span id="x_coordinate" style={{ marginRight: "5px" }} />
            Y: <span id="y_coordinate" style={{ marginRight: "5px" }} />
            Distance: <span id="distance" style={{ marginRight: "5px" }} />
            Angle: <span id="angle" style={{ marginRight: "5px" }} />
            Quarter: <span id="quarter" style={{ marginRight: "5px" }} />
        </div>

        <canvas id="canvas" name="game"></canvas>
    </div>);
}

export default Joystick;
