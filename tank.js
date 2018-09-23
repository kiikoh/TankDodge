let pack = require('./server.js');

function collision(obj1, obj2) {
  let dist = Math.sqrt(
    Math.pow(obj2.x - obj1.x, 2) +
    Math.pow(obj2.y - obj1.y, 2)
  );
  return dist < (obj1.size + obj2.size) / 2;
}

module.exports =
  class Tank {
    constructor(id, leftTeam) {;
      this.id = id;
      this.x = leftTeam ? 150 : pack.pack.server.width - 150;
      this.y = pack.pack.server.height / 2;
      this.active = true; //player is not dead and can play
      this.ball = null; //owning a ball
      this.sensitivity = 4;
      this.dir = leftTeam ? 0 : 180;
      this.speed = 7;
      this.movement = [false, false, false, false]; // U D L R
      this.size = 65;
      this.team = leftTeam; //bool , true if on left team
    }

    turnLeft() {
      this.dir += this.sensitivity;
    }

    turnRight() {
      this.dir -= this.sensitivity;
    }

    moveForward() {
      this.x += this.speed * Math.cos(this.dir * Math.PI / 180);
      this.y -= this.speed * Math.sin(this.dir * Math.PI / 180);
      if (this.x < this.size / 2) {
        this.x = this.size / 2;
      }
      if (this.y < this.size / 2) {
        this.y = this.size / 2;
      }
      if (this.team) {
        if (this.x > pack.pack.server.width / 2) {
          this.x = pack.pack.server.width / 2;
        }
      } else {
        if (this.x < pack.pack.server.width / 2) {
          this.x = pack.pack.server.width / 2;
        }
      }
      if (this.y > pack.pack.server.height - this.size / 2) {
        this.y = pack.pack.server.height - this.size / 2;
      }
    }

    moveBackward() {
      this.x -= this.speed * Math.cos(this.dir * Math.PI / 180);
      this.y += this.speed * Math.sin(this.dir * Math.PI / 180);
      if (this.x < this.size / 2) {
        this.x = this.size / 2;
      }
      if (this.y < this.size / 2) {
        this.y = this.size / 2;
      }
      if (this.team) {
        if (this.x > pack.pack.server.width / 2) {
          this.x = pack.pack.server.width / 2;
        }
      } else {
        if (this.x < pack.pack.server.width / 2) {
          this.x = pack.pack.server.width / 2;
        }
      }
      if (this.y > pack.pack.server.height - this.size / 2) {
        this.y = pack.pack.server.height - this.size / 2;
      }
    }

    shoot() {
      if (this.ball) {
        this.ball.shoot(this)
        this.ball = null;
      }
    }

    update() {
      if (pack.pack.server.gameActive) {
        if (this.movement[0] && !this.movement[1]) {
          this.moveForward();
        } else if (this.movement[1] && !this.movement[0]) {
          this.moveBackward();
        }
        if (this.movement[2] && !this.movement[3]) {
          this.turnLeft();
        } else if (this.movement[3] && !this.movement[2]) {
          this.turnRight();
        }
      }
      let balls = pack.pack.balls;
      for (let ball of balls) {
        if (collision(this, ball)) {
          if (ball.active) { //hit by ball
            ball.dir = 180 - ball.dir;
            ball.active = false;
            this.speed /= 1.5;
            this.die();
          } else if (ball.holder == null && this.ball == null) { //picked up ball
            this.ball = ball;
            ball.pickedUp(this.id);
          }
        }
      }
    }

    die() {
      if (this.active) {
        pack.sendNotif((this.team ? 'Left' : 'Right') + ' Team member dead!');
        this.active = false;
        pack.pack.server.players[this.team ? 'left' : 'right']--;
        if (this.ball) {
          this.ball.x = this.x;
          this.ball.y = this.y;
          this.ball.holder = null;
        }
      }
    }
  }