var tree = [];
var walkers = [];
var num_walkers = 512;
var center;

var r = 4;
var R = r;
var R2 = R * R;
var S = 8 * r;
var S2 = S * S;
var step = 2;
var k = 30;
var b = 0.1;
var s = 0.2;

class RandomWalker {
  constructor(x, y, s, b) {
    this.p = createVector(x, y);
    this.s = s;
    this.b = b;
  }
  step() {
    var i = floor(random(4));
    var r = createVector(i % 2 == 0 ? (i > 1 ? 1 : -1) * this.s : 0, i % 2 == 1 ? (i > 1 ? 1 : -1) * this.s : 0);
    //*
    var d = p5.Vector.sub(center, this.p);
    d.setMag(this.s);
    this.p.add(createVector(lerp(r.x, d.x, this.b), lerp(r.y, d.y, this.b)));
    //*/
    //this.p.add(r);
  }
}

function setup() {
  createCanvas(1024, 1024);
  center = createVector(width / 2, height / 2);
  tree.push({
    p: center,
  });
  walkers = _.times(num_walkers, () => new RandomWalker(random(width), random(height), step, b));
}

function distSqr(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return dx * dx + dy * dy;
}

function createWalker() {
  var p = createVector(random(width), random(height));
  for(
    var i = 0;
    i < k && tree.some(node => distSqr(node.p.x, node.p.y, p.x, p.y) < S2);
    i++
  ) {
    p = createVector(random(width), random(height));
  }
  if(tree.some(node => distSqr(node.p.x, node.p.y, p.x, p.y) < S2)) {
    return null;
  }
  return new RandomWalker(p.x, p.y, step, b);
}

function draw() {
  walkers = walkers.map(walker => {
    walker.step();
    if(walker.p.x < 0 || walker.p.x >= width) {
      return createWalker();
    }
    if(walker.p.y < 0 || walker.p.y >= height) {
      return createWalker();
    }
    var parent;
    if(tree.some((node, i) => {
      var d = distSqr(node.p.x, node.p.y, walker.p.x, walker.p.y);
      if(d < R2 && random(1) < s) {
        parent = i;
        return true;
      }
      return false;
    })) {
      var p = createVector(walker.p.x, walker.p.y);
      tree.push({
        p,
        a: parent,
      });
      return createWalker();
    }
    return walker;
  }).filter(w => w);
  background(0);
  tree.forEach(node => {
    strokeWeight(r);
    stroke(255, 100);
    point(node.p.x, node.p.y);
    if(node.a) {
      strokeWeight(1);
      var parent = tree[node.a];
      line(node.p.x, node.p.y, parent.p.x, parent.p.y);
    }
  });
  walkers.forEach(walker => {
    strokeWeight(4);
    stroke(255, 0, 0, 100);
    point(walker.p.x, walker.p.y);
  });
}
