const socket = io();
let ready = false;
let debug;


socket.on('connect', function() {
  socket.on('data', function(data) {
    drawData(data);
  })
});

function drawTank(tank) {
  push();
  rectMode(CENTER);
  translate(tank.x, tank.y);
  rotate(90 - tank.dir);
  rect(-tank.size / 4, 0, tank.size / 5, tank.size); //left tread
  rect(tank.size / 4, 0, tank.size / 5, tank.size); //right tread
  rect(0, tank.size / 8, tank.size / 2, tank.size / 2); //main body
  if (tank.ball)
    fill(255, 0, 0)
  rect(0, -tank.size / 5, tank.size / 16, tank.size / 2); //gun
  pop();
}

function drawData(data) {
  debug = data;
  if (ready) { //prevents from drawing before p5 loads
    push()
    scale(windowWidth / data.server.width);
    rectMode(CORNER);
    fill(55, 127, 242);
    rect(0, 0, data.server.width / 2, data.server.height);
    fill(237, 170, 26);
    rect(data.server.width / 2, 0, data.server.width / 2, data.server.height);
    for (let tank in data.tanks) {
      if (data.tanks.hasOwnProperty(tank)) {
        tank = data.tanks[tank];
        //show every tank, tank is each individual tank at this point
        if (tank.active) {
          fill(0, 255, 0);
          drawTank(tank);
        }
      }
    }
    for (ball of data.balls) {
      if (ball.holder == null) {
        if (ball.active) {
          fill(130, 0, 0);
        } else {
          fill(255, 0, 0);
        }
        ellipse(ball.x, ball.y, ball.size);
      }
    }
    pop();
  }
}

function setup() {
  ready = true;
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function keyPressed() {
  if (key.toUpperCase() === 'A') { // Left
    socket.emit('keyDown', {
      value: 'turnLeft'
    })
  } else if (key.toUpperCase() === 'D') { // Right
    socket.emit('keyDown', {
      value: 'turnRight'
    })
  } else if (key.toUpperCase() === 'W') { // Up
    socket.emit('keyDown', {
      value: 'moveForward'
    })
  } else if (key.toUpperCase() === 'S') { // Down
    socket.emit('keyDown', {
      value: 'moveBackward'
    })
  } else if (key.toUpperCase() === 'F') { // Shoot
    socket.emit('keyDown', {
      value: 'shoot'
    })
  } else if (keyCode === 32) { // reset
    socket.emit('keyDown', {
      value: 'reset'
    })
  }
}

function keyReleased() {
  if (key.toUpperCase() === 'A') { // L
    socket.emit('keyUp', {
      value: 'turnLeft'
    })
  } else if (key.toUpperCase() === 'D') { // R
    socket.emit('keyUp', {
      value: 'turnRight'
    })
  } else if (key.toUpperCase() === 'W') { // U
    socket.emit('keyUp', {
      value: 'moveForward'
    })
  } else if (key.toUpperCase() === 'S') { // D
    socket.emit('keyUp', {
      value: 'moveBackward'
    })
  }
}