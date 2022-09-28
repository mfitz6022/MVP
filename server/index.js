const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
const PORT = 8080;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
  }
})

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected to server channel`)

  socket.on('send_message', (data) => {
    socket.broadcast.emit('recieve_message', data)
    console.log(data);
  })

  socket.on('connect_call', (data) => {
    io.to(data.usersToCall).emit('callUsers', {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    })
  })

  socket.on('answer_call', (data) => {
    io.to(data.to).emit('callAccepted', data.signal)
  })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected from server channel`)
  })
})

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})