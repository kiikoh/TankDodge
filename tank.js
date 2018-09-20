let pack = require('./server.js');
let width;
let height;

function collision(obj1, obj2) {
  let dist = Math.sqrt(
    Math.pow(obj2.x - obj1.x, 2) +
    Math.pow(obj2.y - obj1.y, 2)
  );
  return dist < (obj1.size + obj2.size) / 2;
}

module.exports =
  class Tank {
    constructor(id, leftTeam) {
      width = pack['pack']['server']['width'];
      height = pack['pack']['server']['height'];
      this.id = id;
      this.x = leftTeam ? 150 : width - 150;
      this.y = height / 2;
      this.active; //player is not dead and can play
      this.ball = null; //owning a ball
      this.sensitivity = 4;
      this.dir = 90;
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
        if (this.x > width / 2) {
          this.x = width / 2;
        }
      } else {
        if (this.x < width / 2) {
          this.x = width / 2;
        }
      }
      if (this.y > height - this.size / 2) {
        this.y = height - this.size / 2;
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
        if (this.x > width / 2) {
          this.x = width / 2;
        }
      } else {
        if (this.x < width / 2) {
          this.x = width / 2;
        }
      }
      if (this.y > height - this.size / 2) {
        this.y = height - this.size / 2;
      }
    }

    shoot() {
      if (this.ball) {
        this.ball.shoot(this)
        this.ball = null;
      }
    }

    update() {
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
      let balls = pack['pack']['balls'];
      for (let ball of balls) {
        if (collision(this, ball)) {
          if (ball.active) { //hit by ball
            this.die();
          } else if (ball.holder == null && this.ball == null) { //picked up ball
            this.ball = ball;
            ball.pickedUp(this.id);
          }
        }
      }
    }

    die() {
      console.log(this.id);
    }
  }