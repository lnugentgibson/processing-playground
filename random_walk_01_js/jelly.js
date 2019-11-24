class JellyStepGenerator {
  constructor(w, h, position_buffer, size_min, size_max, size_buffer) {
    this.d = 7;
    this.w = w;
    this.h = h;
    this.position_buffer = position_buffer;
    this.size_min = size_min;
    this.size_max = size_max;
    this.size_buffer = size_buffer;
  }
  step(current) {
    var step = [];
    var position_range = 16;
    var size_range = 4;
    var axis_range = 0.1;
    var angle_range = 0.5;
    var x_offset = 0;
    var y_offset = 0;
    var size_offset = 0;
    if (current[0] < this.position_buffer) {
      x_offset = map(current[0], 0, this.position_buffer, position_range, 0);
    }
    else if (this.w - current[0] < this.position_buffer) {
      x_offset = map(current[0], this.w -  this.position_buffer, this.w, 0, -position_range);
    }
    if (current[1] < this.position_buffer) {
      y_offset = map(current[1], 0, this.position_buffer, position_range, 0);
    }
    else if (this.h - current[1] < this.position_buffer) {
      y_offset = map(current[1], this.h -  this.position_buffer, this.h, 0, -position_range);
    }
    if (current[2] - this.size_min < this.size_buffer) {
      size_offset = map(current[2], this.size_min, this.size_min + this.size_buffer, size_range, 0);
    }
    else if (this.size_max - current[2] < this.size_buffer) {
      size_offset = map(current[2], this.size_max -  this.size_buffer, this.size_max, 0, -size_range);
    }
    step[0] = (random(2) - 1) * position_range + x_offset;
    step[1] = (random(2) - 1) * position_range + y_offset;
    step[2] = (random(2) - 1) * size_range + size_offset;
    var axis_x = current[3] + (random(2) - 1) * axis_range;
    var axis_y = current[4] + (random(2) - 1) * axis_range;
    var axis_z = current[5] + (random(2) - 1) * axis_range;
    var axis = createVector(axis_x, axis_y, axis_z);
    axis.normalize();
    step[3] = axis.x - current[3];
    step[4] = axis.y - current[4];
    step[5] = axis.z - current[5];
    step[6] = (random(2) - 1) * angle_range;
    return step;
  }
}

class Jelly {
  constructor(r, g, b, a, w, h, position_buffer, size_min, size_max, size_buffer, smoothing) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.walker = new RandomWalker(7, w / 2, h / 2, new JellyStepGenerator(w, h, position_buffer, size_min, size_max, size_buffer), smoothing);
  }
  draw() {
    var smooth = this.walker.smoothedPosition();
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
    this.walker.step();
  }
}
