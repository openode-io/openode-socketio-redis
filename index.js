const express = require('express');
const app = express();
const server = require('http').Server(app);
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const io = require('socket.io')(server);

const pubClient = createClient({ url: process.env.REDIS_URL });
pubClient.connect().then(() => {
    console.log(`connected.`)
})

const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

var your_namespace_socket = io.of('/');

your_namespace_socket.on('connection', function(socket) {
  socket.on('join', function(room){
    socket.join(room);
  });

  socket.on('room1', function(msg) {
      io.to('room1').emit('chat message', msg);
  })
});

app.use(express.static('public'));

const port = process.env.PORT || 3000

server.listen(port, function(){
   console.log(`listening on *:${port}`);
});