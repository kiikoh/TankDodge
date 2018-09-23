let pack = require('./server.js');
let width;
let height;

module.exports =
  class Ball {
    constructor(x, y) {
      width = pack['pack']['server']['width'];
      height = pack['pack']['server']['height'];
      this.size = 25;
      this.x = x;
      this.y = y + this.size * 2;
      this.dir = null;
      this.active; //in the air, hitting will get a player out
      this.holder = null; //id of the holder
      this.speed = null;
      this.shooter = null; //reference of the shooter
    }

    pickedUp(id) {
      this.holder = id;
    }

    shoot(tank) {
      this.speed = 15;
      this.dir = tank.dir;
      this.x = tank.x;
      this.y = tank.y;
      this.x += (tank.size + this.size + 2 * tank.speed + 2) / 2 * Math.cos(this.dir * Math.PI / 180);
      this.y -= (tank.size + this.size + 2 * tank.speed + 2) / 2 * Math.sin(this.dir * Math.PI / 180);
      this.active = true;
      this.holder = null;
      this.shooter = tank;
    }

    update() {
      if (this.dir != null) {
        if (!this.active) {
          this.speed /= 1.02;
        }
        this.x += this.speed * Math.cos(this.dir * Math.PI / 180);
        this.y -= this.speed * Math.sin(this.dir * Math.PI / 180);
        if (this.x < this.size / 2) {
          this.x = this.size / 2;
          this.active = false;
          this.dir = 180 - this.dir;
          this.speed /= 1.5;
        }
        if (this.x > width - this.size / 2) {
          this.x = width - this.size / 2;
          this.active = false;
          this.dir = 180 - this.dir;
          this.speed /= 1.5;
        }
        if (this.y < this.size / 2) {
          this.y = this.size / 2;
          this.active = false;
          this.dir = -this.dir;
          this.speed /= 1.5;
        }
        if (this.y > height - this.size / 2) {
          this.y = height - this.size / 2;
          this.active = false;
          this.dir = -this.dir;
          this.speed /= 1.5;
        }
      }
    }
  }