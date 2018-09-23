const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TICKRATE = 50;

//Classes
const Tank = require('./tank.js');
const Ball = require('./ball.js');

module.exports.pack = {
  tanks: {},
  balls: [],
  server: {
    tickrate: TICKRATE,
    width: 1000,
    height: 509,
    players: {
      left: 0,
      right: 0
    },
    gameActive: false,
    timeToStart: 5 * TICKRATE
  }
}

//spawn 5 balls
for (var i = 0; i < 5; i++) {
  module.exports.pack.balls.push(new Ball(module.exports.pack.server.width / 2, i * module.exports.pack.server.height / 5));
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

function pickTeam() {
  let left = module.exports.pack.server.players.left;
  let right = module.exports.pack.server.players.right;
  if (left <= right) {
    module.exports.pack.server.players.left++;
    return true;
  }
  module.exports.pack.server.players.right++;
  return false;
}

function resetServer() {
  module.exports.pack = {
    tanks: {},
    balls: [],
    server: {
      tickrate: TICKRATE,
      width: 1000,
      height: 509,
      players: {
        left: 0,
        right: 0
      },
      gameActive: false,
      timeToStart: 5 * TICKRATE
    }
  }
  //spawn 5 balls
  for (var i = 0; i < 5; i++) {
    module.exports.pack.balls.push(new Ball(module.exports.pack.server.width / 2, i * module.exports.pack.server.height / 5));
  }
  let ids = Object.keys(io.sockets.sockets);
  for (id of ids) {
    module.exports.pack.tanks[id] = new Tank(id, pickTeam());
  }
}

//when a user connects
io.on('connection', function(socket) {
  // module.exports.pack.tanks[socket.id] = new Tank(socket.id, pickTeam());

  socket.on('disconnect', function() {
    if (module.exports.pack.tanks[socket.id]) {
      if (module.exports.pack.tanks[socket.id].team) {
        module.exports.pack.server.players.left--;
      } else {
        module.exports.pack.server.players.right--;
      }
      delete module.exports.pack.tanks[socket.id];
    }
  });

  socket.on('keyDown', function(input) {
    if (module.exports.pack.tanks[socket.id]) {
      if (input.value === 'turnLeft') {
        module.exports.pack.tanks[socket.id].movement[2] = true;
      } else if (input.value === 'turnRight') {
        module.exports.pack.tanks[socket.id].movement[3] = true;
      } else if (input.value === 'moveForward') {
        module.exports.pack.tanks[socket.id].movement[0] = true;
      } else if (input.value === 'moveBackward') {
        module.exports.pack.tanks[socket.id].movement[1] = true;
      } else if (input.value === 'shoot') {
        module.exports.pack.tanks[socket.id].shoot();
      } else if (input.value === 'reset') {
        resetServer();
      }
    }
  });

  socket.on('keyUp', function(input) {
    if (module.exports.pack.tanks[socket.id]) {
      if (input.value === 'turnLeft') {
        module.exports.pack.tanks[socket.id].movement[2] = false;
      } else if (input.value === 'turnRight') {
        module.exports.pack.tanks[socket.id].movement[3] = false;
      } else if (input.value === 'moveForward') {
        module.exports.pack.tanks[socket.id].movement[0] = false;
      } else if (input.value === 'moveBackward') {
        module.exports.pack.tanks[socket.id].movement[1] = false;
      }
    }
  });
});

//main server method
setInterval(function() {
  io.emit('data', module.exports.pack);
  if (!module.exports.pack.server.gameActive) {
    if (module.exports.pack.server.players.left > 0 && module.exports.pack.server.players.right > 0) { // players ready
      module.exports.pack.server.timeToStart--;
      if (module.exports.pack.server.timeToStart <= 0) {
        module.exports.pack.server.gameActive = true;
      }
    } else {
      resetServer();
    }
  } else {
    module.exports.pack.server.gameActive = module.exports.pack.server.players.left > 0 && module.exports.pack.server.players.right > 0;
    let ids = Object.keys(io.sockets.sockets);
    for (id of ids) {
      let tank = module.exports.pack.tanks[id];
      if (tank && tank.active) {
        tank.update();
      }
    }
    for (ball of module.exports.pack.balls) {
      ball.update();
    }
  }
}, 1000 / TICKRATE); //updates at the tickrate