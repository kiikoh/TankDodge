const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TICKRATE = 50;

//Classes
const Tank = require('./tank.js');
const Ball = require('./ball.js');

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

});

//main server method
setInterval(function() {

}, 1000 / TICKRATE); //updates at the tickrate