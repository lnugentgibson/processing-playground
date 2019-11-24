class RandomWalker {
  constructor(d, x, y, step_generator, smoothing) {
    this.d = d;
    this.smoothing = smoothing;
    this.step_generator = step_generator;
    this.previous = [];
    this.position = [];
    this.position[0] = x;
    this.position[1] = y;
    for (var i = 2; i < d; i++) {
      this.position[i] = 0;
    }
  }
  smoothedPosition() {
    var smooth = [];
    for (var i = 0; i < this.d; i++) {
      smooth[i] = this.position[i];
    }
    var j = 0;
    this.previous.forEach((previous, j) => {
      if (j < this.smoothing - 1) {
        for (var i = 0; i < this.d; i++) {
          smooth[i] += previous[i];
        }
      }
    }
    );
    var smoothing = this.smoothing;
    if (this.previous.length + 1 < smoothing) {
      smoothing = this.previous.length + 1;
    }
    for (i = 0; i < this.d; i++) {
      smooth[i] /= smoothing;
    }
    return smooth;
  }
  step() {
    var step = this.step_generator.step(this.position);
    var next = [];
    for (var i = 0; i < this.d; i++) {
      next[i] = this.position[i] + step[i];
    }

    this.previous.push(this.position);
    if (this.previous.length > this.smoothing) {
      this.previous.splice(0, 1);
    }
    this.position = next;
  }
}

class LightningStepGenerator {
  constructor(tx, ty, speed, factor) {
    this.tx = tx;
    this.ty = ty;
    this.speed = speed;
    this.factor = factor;
  }
  step(current) {
    let {
      tx,
      ty,
      speed,
      factor,
    } = this;
    var step = [];
    var r = createVector(random(-1, 1), random(-1, 1));
    r.setMag(random(speed));
    r.mult(1 - factor);
    var d = createVector(tx - current[0], ty - current[1]);
    d.setMag(random(speed));
    d.mult(factor);
    var v = p5.Vector.add(r, d);
    step[0] = v.x;
    step[1] = v.y;
    return step;
  }
}

var sparks = [];
var num = 256;

var start, end;

function setup() {
  createCanvas(1024, 1024);
  start = createVector(width / 2, 4 * height / 5);
  end = createVector(width / 2, height / 5);
  for (var i = 0; i < num; i++) {
    sparks.push(new RandomWalker(4, start.x, start.y, new LightningStepGenerator(end.x, end.y, 8, 0.25), 4));
  }
}


function draw() {
  background(0);
  fill(128);
  ellipseMode(RADIUS);
  ellipse(start.x, start.y, 32, 32);
  ellipse(end.x, end.y, 32, 32);
  fill(255);
  sparks.forEach((spark) => {
    var smooth = spark.smoothedPosition();
    ellipse(smooth[0], smooth[1], 4, 4);
    spark.step();
  });
}
