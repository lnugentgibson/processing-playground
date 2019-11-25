let {
  max,
  abs
} = Math;

function vabs(v) {
  return createVector(abs(v.x), abs(v.y));
}

function vmaxv(a, b) {
  return createVector(max(a.x, b.x), max(a.y, b.y));
}

function vmaxs(a, b) {
  return createVector(max(a.x, b), max(a.y, b));
}

class Shape {
  constructor(dist, args) {
    this.dist = dist;
    var params = {};
    Object.keys(args).forEach(param => {
      params[param] = args[param];
      Object.defineProperty(this, param, {
        get: () => params[param],
        set: v => {
          params[param] = v;
        }
      });
    });
  }
  D(point) {
    return this.dist.call(this, point);
  }
  trace(point, dir) {
    var d = this.D(point), td = d;
    var p = p5.Vector.add(point, p5.Vector.mult(dir, td));
    var i = 0;
    while(d > 0.001 && td < 1000000 && i < 20) {
      var pp = p;
      var ptd = td;
      d = this.D(p);
      td += d;
      p = p5.Vector.add(point, p5.Vector.mult(dir, td));
      if(false) {
      console.log({
        pp,
        ptd,
        d,
        td,
        p,
        i,
      });
      }
      i++;
    }
    return {p,d:td,};
  }
}

function DistanceSphere(point) {
  let {
    center,
    radius,
    type
  } = this;
  var d = p5.Vector.sub(center, point).mag() - radius;
  switch (type) {
    case 1:
      return max(d, 0);
    case 2:
      return abs(d);
    default:
      return d;
  }
}

function DistanceBox(point) {
  let {
    center,
    size,
    type
  } = this;
  var diff = p5.Vector.sub(vabs(p5.Vector.sub(point, center)), size);
  if(type == 0) {
    return min(max(diff.x,diff.y),0.0) + vmaxs(diff,0.0).mag();
  }
  return vmaxs(diff,0.0).mag();
}

function DistanceRoundBox(point) {
  let {
    center,
    size,
    roundness
  } = this;
  return vmaxs(p5.Vector.add(p5.Vector.sub(vabs(p5.Vector.sub(point, center)), size),roundness),0.0).mag()-roundness;
}

var shapes = [];

function setup() {
  createCanvas(1024, 1024);
  for(var i = 0; i < 32; i++) {
    var r = random(1);
    if(r < 0.5) {
      shapes.push(new Shape(DistanceSphere, {
        center: createVector(random(width), random(height)),
        radius: random(4, 64),
        type: 0,
      }));
    } else if(r < 0.75) {
      var size = createVector(random(4, 64),random(4, 64));
      shapes.push(new Shape(DistanceRoundBox, {
        center: createVector(random(width), random(height)),
        size,
        roundness: random(2, min(20, min(size.x, size.y) / 2 - 2)),
      }));
    } else {
      shapes.push(new Shape(DistanceBox, {
        center: createVector(random(width), random(height)),
        size: createVector(random(4, 64),random(4, 64)),
        type: 0,
      }));
    }
  }
}

function mouseClicked() {
  shapes = [];
  for(var i = 0; i < 32; i++) {
    var r = random(1);
    if(r < 0.5) {
      shapes.push(new Shape(DistanceSphere, {
        center: createVector(random(width), random(height)),
        radius: random(4, 64),
        type: 0,
      }));
    } else if(r < 0.75) {
      var size = createVector(random(4, 64),random(4, 64));
      shapes.push(new Shape(DistanceRoundBox, {
        center: createVector(random(width), random(height)),
        size,
        roundness: random(2, min(20, min(size.x, size.y) / 2 - 2)),
      }));
    } else {
      shapes.push(new Shape(DistanceBox, {
        center: createVector(random(width), random(height)),
        size: createVector(random(4, 64),random(4, 64)),
        type: 0,
      }));
    }
  }
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(4);
  //var light = createVector(width / 2, height / 2);
  var light = createVector(mouseX, mouseY);
  for(var t = 0; t < 2 * PI; t += PI / 512) {
    var dir = createVector(cos(t), sin(t));
    var p = shapes.reduce((dist, shape) => {
      var res = shape.trace(light, dir);
      let {p,d} = res;
      return d < dist.d ? res : dist;
    }, {d:1000000,p:p5.Vector.add(light, p5.Vector.mult(dir, 1000000)),});
    line(light.x, light.y, p.p.x, p.p.y);
  }
  noStroke();
  fill(255, 0, 0);
  ellipseMode(RADIUS);
  ellipse(mouseX, mouseY, 8, 8);
}
