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

class Spark {
  constructor(start, end, range, max) {
    var r = createVector(random(-1, 1), random(-1, 1));
    r.setMag(random(range));
    r.add(start);
    this.walker = new RandomWalker(2, r.x, r.y, new LightningStepGenerator(end.x, end.y, 16, 0.25), 4);
    this.path = [r,];
    this.end = end;
    this.range = range;
    this.max = max || 0;
    this.graphics = createGraphics(1024, 1024);
  }
  update() {
    let {
      walker,
      path,
      end,
      range,
      max,
      graphics,
    } = this;
    for(var i = 0; i < 16; i++) {
      walker.step();
      var smooth = walker.smoothedPosition();
      var w = createVector(smooth[0], smooth[1]);
      path.push(w);
      var d = p5.Vector.sub(w, end);
      if(d.mag() < range || (max > 0 && path.length >= max)) {
        this.generated = true;
        this.len = 0;
        setTimeout(() => {
          var spark = createGraphics(1024, 1024);
          spark.background(0);
          spark.noFill();
          spark.stroke(128, 128, 255);
          spark.strokeWeight(4);
          spark.strokeJoin(BEVEL);
          spark.beginShape();
          path.forEach((p, i) => {
            spark.vertex(p.x, p.y);
          });
          spark.endShape();
          //spark.filter(BLUR, 4);
          graphics.image(spark, 0, 0);
          /*
          graphics.blendMode(SCREEN);
          //spark.filter(BLUR, 1);
          graphics.image(spark, 0, 0);
          //*/
          this.ready = true;
        }, 5);
        return;
      }
    }
  }
  draw() {
    if(!this.generated || !this.ready || this.finished) {
      return;
    }
    let {
      path,
      len,
      graphics,
    } = this;
    len += 16;
    image(graphics, 0, 0);
    this.len = len;
    if(len >= path.length) {
      this.finished = true;
    }
  }
}

var sparks = [];
var num = 6;

var start, end;
var range = 64;

//var sparksGraphics;

function setup() {
  createCanvas(1024, 1024);
  start = createVector(width / 2, 3 * height / 4);
  end = createVector(width / 2, height / 4);
  for (var i = 0; i < num; i++) {
    sparks.push(new Spark(start, end, range, random(240, 320)));
  }
  //sparksGraphics = createGraphics(1024, 1024);
}


function draw() {
  background(0);
  noStroke();
  /*
  pointLight(255, 255, 255, 0, 128, 64);
  specularColor(128, 128, 255);
  specularMaterial(255);
  //*/
  fill(128);
  ellipseMode(RADIUS);
  ellipse(start.x, start.y, range, range);
  blendMode(SCREEN);
  sparks = sparks.map((spark) => {
    /*
    var path = spark.path;
    var p = path[path.length - 1];
    if(spark.generated) {
      fill(0, 255, 0);
    } else if(spark.finished) {
      fill(255, 0, 0);
    } else {
      fill(255, 255, 0);
    }
    ellipse(p.x, p.y, 4, 4);
    //*/
    if(!spark.finished) {
      if(!spark.generated) {
        spark.update();
      }
      if(spark.generated) {
        //spark.draw(sparksGraphics);
        spark.draw();
      }
    }
    return !spark.finished ? spark : new Spark(start, end, range, random(240, 320));
  });
  blendMode(BLEND);
  fill(128);
  ellipse(end.x, end.y, range, range);
}
