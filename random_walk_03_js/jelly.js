class JellyForceGenerator {
  constructor() {
    this.d = 2;
  }
  step(current) {
    var step = [];
    var position_range = .2;
    var x_offset = 0;
    var y_offset = 0;
    step[0] = (random(2) - 1) * position_range + x_offset;
    step[1] = (random(2) - 1) * position_range + y_offset;
    return step;
  }
}

class JellyStepGenerator {
  constructor() {
    this.d = 5;
    this.size_min = 50;
    this.size_max = 100;
    this.size_buffer = 10;
  }
  step(current) {
    var step = [];
    var size_range = 4;
    var axis_range = 0.1;
    var angle_range = 0.5;
    var size_offset = 0;
    if (current[0] - this.size_min < this.size_buffer) {
      size_offset = map(current[0], this.size_min, this.size_min + this.size_buffer, size_range, 0);
    }
    else if (this.size_max - current[0] < this.size_buffer) {
      size_offset = map(current[0], this.size_max -  this.size_buffer, this.size_max, 0, -size_range);
    }
    step[0] = (random(2) - 1) * size_range + size_offset;
    var axis_x = current[1] + (random(2) - 1) * axis_range;
    var axis_y = current[2] + (random(2) - 1) * axis_range;
    var axis_z = current[3] + (random(2) - 1) * axis_range;
    var axis = createVector(axis_x, axis_y, axis_z);
    axis.normalize();
    step[1] = axis.x - current[1];
    step[2] = axis.y - current[2];
    step[3] = axis.z - current[3];
    step[4] = (random(2) - 1) * angle_range;
    return step;
  }
}

class Jelly {
  constructor(r, g, b, a, w, h, size_min, size_max, size_buffer, smoothing) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.walker1 = new ForcedRandomWalker(2, w / 2, h / 2, new JellyForceGenerator(), 1);
    this.walker2 = new RandomWalker(5, random(50, 100), random(360), new JellyStepGenerator(), smoothing);
    this.c = createVector(w / 2, h / 2);
  }
  draw() {
    var smooth = this.walker1.position.concat(this.walker2.smoothedPosition());
    ellipseMode(RADIUS);
    var c = createVector(smooth[0], smooth[1], 0);
    var q = FromAxisAngle(smooth[6], createVector(smooth[3], smooth[4], smooth[5]));
    var e, d, t, i, s;
    for (t = 0; t < 6; t++) {
      i = floor(t / 2);
      s = 2 * (t % 2) - 1;
      d = createVector(i == 0 ? s * smooth[2] : 0, i == 1 ? s * smooth[2] : 0, i == 2 ? s * smooth[2] : 0);
      d = q.rotate(d);
      if (d.z <= 0) {
        e = p5.Vector.add(c, d);
        noFill();
        stroke(this.r, this.g, this.b);
        ellipse(e.x, e.y, 0.2 * smooth[2], 0.2 * smooth[2]);
        noStroke();
        fill((i * 120 + 180 * (t % 2)) % 360, 100, 100);
        ellipse(e.x, e.y, 0.1 * smooth[2], 0.1 * smooth[2]);
      }
    }
    noFill();
    stroke(this.r, this.g, this.b);
    ellipse(c.x, c.y, smooth[2], smooth[2]);
    noStroke();
    fill(0, 0, 100);
    ellipse(c.x, c.y, 0.15 * smooth[2], 0.15 * smooth[2]);
    noStroke();
    fill(this.r, this.g, this.b, 90);
    ellipse(c.x, c.y, 0.4 * smooth[2], 0.4 * smooth[2]);
    for (t = 0; t < 6; t++) {
      i = floor(t / 2);
      s = 2 * (t % 2) - 1;
      d = createVector(i == 0 ? s * smooth[2] : 0, i == 1 ? s * smooth[2] : 0, i == 2 ? s * smooth[2] : 0);
      d = q.rotate(d);
      if (d.z >= 0) {
        e = p5.Vector.add(c, d);
        noFill();
        stroke(this.r, this.g, this.b);
        ellipse(e.x, e.y, 0.2 * smooth[2], 0.2 * smooth[2]);
        noStroke();
        fill((i * 120 + 180 * (t % 2)) % 360, 100, 100);
        ellipse(e.x, e.y, 0.1 * smooth[2], 0.1 * smooth[2]);
      }
    }
  }
  update() {
    var p = createVector(this.walker1.position[0], this.walker1.position[1]);
    p.sub(this.c);
    p.mult(-0.0001);
    var v = createVector(this.walker1.velocity[0], this.walker1.velocity[1]);
    v.mult(-0.2);
    //p.add(v);
    this.walker1.step([p.x, p.y,]);
    //this.walker1.velocity = this.walker1.velocity.map((v) => v * 0.95);
    this.walker2.step();
  }
}
