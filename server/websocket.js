
const ws = require('ws');

const wss = new ws.Server({
    port: 5000,
}, () => console.log('Server started on 5000'))

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        console.log("Quarter: ", message.quarter || "0:0:0:0:0", "Distance: ", message.distance || 0, "Buttons: ", message.buttons || "0:0:0")
        broadcastMessage(message)
    })
})

function broadcastMessage(message, id) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}