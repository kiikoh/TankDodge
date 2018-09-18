const socket = io();
let ready = false;

socket.on('connect', function() {
  socket.on('data', function(data) {
      drawData();
    }
  });
});

function preload() {}

function drawData() {
  if (ready) { //prevents from drawing before p5 loads

  }
}

function setup() {
  ready = true;
}

function keyPressed() {

}

function keyReleased() {}