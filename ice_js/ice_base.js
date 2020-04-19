class Base {
  constructor(id, position) {
    var owner;
    var health = 100;
    var angle = random(TWO_PI);
    var direction = random(1) < 0.5;
    Object.defineProperties(this, {
      id: {
        get: () => id
      },
      position: {
        get: () => position.copy()
      },
      owner: {
        get: () => owner,
        set: (v) => {
          owner = v;
        }
      },
      health: {
        get: () => health
      },
      angle: {
        get: () => angle
      },
      direction: {
        get: () => direction
      },
      update: {
        get: () => {
          return (n) => {
            if (n == undefined) {
              n = 1;
            }
            health = min(100, health + n * 0.01);
            angle = angle + n * 0.01 * (direction ? 1 : -1);
          };
        }
      }
    });
  }
  draw() {
    let { position, owner, health, angle, direction, outs } = this;
    if (owner == undefined) {
      stroke(255);
    } else {
      stroke(owner.color);
    }
    push();
    translate(position.x, position.y);
    strokeWeight(5);
    noFill();
    ellipseMode(RADIUS);
    strokeCap(SQUARE);
    if (health > 99.5) {
      ellipse(0, 0, 32, 32);
    } else {
      arc(0, 0, 32, 32, 0, map(health, 0, 100, 0, TWO_PI));
    }
    rotate(angle);
    strokeWeight(2);
    rectMode(CENTER);
    square(0, 0, 25);
    noStroke();
    if (owner == undefined) {
      fill(255);
    } else {
      fill(owner.color);
    }
    strokeWeight(0.5);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(NORMAL);
    text(floor(health), 0, 0);
    pop();
  }
}
