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
    var i;
    for (i = 0; i < this.d; i++) {
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

class ForcedRandomWalker {
  constructor(d, x, y, step_generator, smoothing) {
    this.d = d;
    this.smoothing = smoothing;
    this.step_generator = step_generator;
    this.previous = [];
    this.position = [x, y,];
    this.velocity = [0, 0,];
    for (var i = 2; i < d; i++) {
      this.position[i] = 0;
      this.velocity[i] = 0;
    }
  }
  smoothedStep() {
    var step = [];
    var i;
    this.previous.forEach((previous, j) => {
      for (var i = 0; i < this.d; i++) {
        if(!j) {
          step[i] = 0;
        }
        step[i] += previous[i];
      }
    });
    var smoothing = this.smoothing;
    if (this.previous.length < smoothing) {
      smoothing = this.previous.length;
    }
    for (i = 0; i < this.d; i++) {
      step[i] /= smoothing;
    }
    return step;
  }
  step(a) {
    var step = this.step_generator.step(this.position);
    this.previous.push(step);
    if (this.previous.length > this.smoothing) {
      this.previous.splice(0, 1);
    }
    var smooth = this.smoothedStep();
    for (var i = 0; i < this.d; i++) {
      this.velocity[i] = this.velocity[i] + (a == undefined ? 0 : a[i]) + smooth[i];
      this.position[i] = this.position[i] + this.velocity[i];
    }
  }
}
