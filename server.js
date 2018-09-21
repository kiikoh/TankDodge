const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TICKRATE = 50;

//Classes
const Tank = require('./tank.js');
const Ball = require('./ball.js');

exports.pack = {
  tanks: {},
  balls: [],
  server: {
    tickrate: TICKRATE,
    width: 1000,
    height: 509,
    players: 0
  }
}

for (var i = 0; i < 5; i++) {
  exports.pack.balls.push(new Ball(exports.pack.server.width / 2, i * exports.pack.server.height / 5));
}

//runs the server
app.use("/client", express.static(__dirname + '/client'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

//If running on heroku else use localhost:3000
if (process.env.PORT) {
  http.listen(process.env.PORT, function(x) {
    console.log('Server running');
  });
} else {
  http.listen(3000, function(x) {
    console.log('Server running on localhost:' + 3000);
  });
}

//when a user connects
io.on('connection', function(socket) {
  exports.pack.tanks[socket.id] = new Tank(socket.id, exports.pack.server.players % 2 === 0);
  console.log(exports.pack.server.players % 2 === 0);
  exports.pack.server.players++;
  exports.pack.tanks[socket.id].moveForward();

  socket.on('disconnect', function() {
    delete exports.pack.tanks[socket.id];
    exports.pack.server.players--;
  });

  socket.on('keyDown', function(input) {
    if (input.value === 'turnLeft') {
      exports.pack.tanks[socket.id].movement[2] = true;
    } else if (input.value === 'turnRight') {
      exports.pack.tanks[socket.id].movement[3] = true;
    } else if (input.value === 'moveForward') {
      exports.pack.tanks[socket.id].movement[0] = true;
    } else if (input.value === 'moveBackward') {
      exports.pack.tanks[socket.id].movement[1] = true;
    } else if (input.value === 'shoot') {
      exports.pack.tanks[socket.id].shoot();
    }
  });

  socket.on('keyUp', function(input) {
    if (input.value === 'turnLeft') {
      exports.pack.tanks[socket.id].movement[2] = false;
    } else if (input.value === 'turnRight') {
      exports.pack.tanks[socket.id].movement[3] = false;
    } else if (input.value === 'moveForward') {
      exports.pack.tanks[socket.id].movement[0] = false;
    } else if (input.value === 'moveBackward') {
      exports.pack.tanks[socket.id].movement[1] = false;
    }
  });
});

//main server method
setInterval(function() {
  io.emit('data', exports.pack);
  let ids = Object.keys(io.sockets.sockets);
  // console.log(ids);
  for (id of ids) {
    let tank = exports.pack.tanks[id];
    if (tank.active) {
      tank.update();
    }
  }
  for (ball of exports.pack.balls) {
    ball.update();
  }
}, 1000 / TICKRATE); //updates at the tickrate