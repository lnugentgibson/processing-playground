let {
  PI
} 
= Math;

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

var jellies = [];
var num = 256;

class JellyStepGenerator {
  constructor(w, h, position_buffer, size_min, size_max, size_buffer) {
    this.w = w;
    this.h = h;
    this.position_buffer = position_buffer;
    this.size_min = size_min;
    this.size_max = size_max;
    this.size_buffer = size_buffer;
  }
  step(current) {
    this.d = 4;
    var step = [];
    var position_range = 16;
    var size_range = 4;
    var angle_range = 0.5;
    var x_offset = 0;
    var y_offset = 0;
    var size_offset = 0;
    if (current[0] < this.position_buffer)
      x_offset = map(current[0], 0, this.position_buffer, position_range, 0);
    else if (this.w - current[0] < this.position_buffer)
      x_offset = map(current[0], this.w -  this.position_buffer, this.w, 0, -position_range);
    if (current[1] < this.position_buffer)
      y_offset = map(current[1], 0, this.position_buffer, position_range, 0);
    else if (this.h - current[1] < this.position_buffer)
      y_offset = map(current[1], this.h -  this.position_buffer, this.h, 0, -position_range);
    if (current[2] - this.size_min < this.size_buffer)
      size_offset = map(current[2], this.size_min, this.size_min + this.size_buffer, size_range, 0);
    else if (this.size_max - current[2] < this.size_buffer)
      size_offset = map(current[2], this.size_max -  this.size_buffer, this.size_max, 0, -size_range);
    step[0] = (random(2) - 1) * position_range + x_offset;
    step[1] = (random(2) - 1) * position_range + y_offset;
    step[2] = (random(2) - 1) * size_range + size_offset;
    step[3] = (random(2) - 1) * angle_range;
    return step;
  }
}

class Jelly {
  constructor(r, g, b, a, w, h, position_buffer, size_min, size_max, size_buffer, smoothing) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.walker = new RandomWalker(4, w / 2, h / 2, new JellyStepGenerator(w, h, position_buffer, size_min, size_max, size_buffer), smoothing);
  }
  draw() {
    var smooth = this.walker.smoothedPosition();
    ellipseMode(RADIUS);
    noFill();
    stroke(this.r, this.g, this.b, this.a);
    ellipse(smooth[0], smooth[1], smooth[2], smooth[2]);
    var n = 12;
    for (var t = 0; t < n; t++) {
      line(smooth[0] + 0.9 * smooth[2] * cos(smooth[3] + 2 * PI * (t / n)), smooth[1] + 0.9 * smooth[2] * sin(smooth[3] + 2 * PI * (t / n)), smooth[0] + 1.1 * smooth[2] * cos(smooth[3] + 2 * PI * (t / n)), smooth[1] + 1.1 * smooth[2] * sin(smooth[3] + 2 * PI * (t / n)));
    }
  }
  update() {
    this.walker.step();
  }
}

function setup() {
  createCanvas(3 * 512, 1024);
  //RandomStepGenerator steps = new CardinalStepGenerator(2);
  //RandomStepGenerator steps = new IndependentStepGenerator(2);
  //RandomStepGenerator steps = new JellyStepGenerator(width, height, 50, 10, 20, 5);
  //walker = new RandomWalker(4, width / 2, height / 2, steps , 32);
  colorMode(HSB, 360, 100, 100, 100);
  for (var i = 0; i < num; i++)
    jellies.push(new Jelly((2 * (random(2) - 1) + 216.92), (20 * (random(2) - 1) + 94.55), (10 * (random(2) - 1) + 43.14), 100, width, height, width / 16, 10, 20, 2.5, 8));
  background(216.92, 94.55, 43.14);
  background(286.67, 98.18, 43.14);
  background(19.35, 60.78, 100);
}

function draw() {
  fill(19.35, 60.78, 100, 20);
  noStroke();
  rect(0, 0, width, height);
  //walker.drawLine();
  //walker.drawSmoothedPoint();
  //walker.step();
  jellies.forEach(jelly => {
    jelly.draw();
    jelly.update();
  }
  );
}
