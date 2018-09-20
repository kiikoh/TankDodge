module.exports =
  class Ball {
    constructor(x, y) {
      this.id;
      this.size = 15;
      this.x = x;
      this.y = y + this.size;
      this.dir = null;
      this.active; //in the air, hitting will get a player out
      this.holder = null; //id of the holder
      this.speed = 10;
    }

    shoot(dir) {
      this.dir = dir;
      this.active = true;
    }

    update() {
      this.x += this.speed * Math.cos(this.dir * Math.PI / 180);
      this.y -= this.speed * Math.sin(this.dir * Math.PI / 180);
      if (this.x < this.size / 2) {}
      if (this.y < this.size / 2) {}
      if (this.x > width - this.size / 2) {}
      if (this.y > height - this.size / 2) {}
    }
  }