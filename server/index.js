const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const server = http.createServer(app);
const cors = require("cors");
const { v4: uuidV4 } = require('uuid');
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
  }
})

const PORT = process.env.PORT || 8080;

app.set('views', __dirname + '/views')
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())

app.use(cors());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('index', { roomId: req.params.room })
})

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected to server channel`)

  socket.on('send_message', (data) => {
    socket.broadcast.emit('recieve_message', data)
    console.log(data);
  })

  socket.on('join-room', (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('user-connected', data.id);
    console.log(`${data.username} has connected to room ${data.room} with id: ${data.id}`);
  })

  socket.on('leave-room', (data) => {
    console.log(data)
    socket.leave(data.room);
    socket.broadcast.to(data.room).emit('user-disconnected', data);
    console.log(`user: ${data.username} with id: ${data.id} has left the room: ${data.room}`);
  })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected from server channel`)
  })
})

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
