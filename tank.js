module.exports =
  class Tank {
    constructor(x, y, id) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.active; //player is not dead and can play
      this.hasBall; //bool for owning a ball
    }

    update() {

    }
  }