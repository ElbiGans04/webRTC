const path = require("path");
const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const options = {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
};
const io = require("socket.io")(httpServer, options);
const cors = require('cors');

app.use(cors())
app.use('/assest', express.static('./public'));
app.get('/', (req,res) => {
    const location = path.resolve(path.join(__dirname, '/index.html'));
    res.sendFile(location)
});

io.on("connection", socket =>{
    console.log(`connect with id: ${socket.id}`);
    socket.on('offer', (message) => {
        socket.broadcast.emit("offer", message);
    });

    socket.on('new', (message) => {
        socket.broadcast.emit('new', message)
    })
});

httpServer.listen(3000);