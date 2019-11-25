class RandomCirclePointWalker {
  constructor(x, y, s, b) {
    this.p = createVector(x, y);
    this.s = s;
    this.b = b;
  }
  step() {
    var a = random(2 * PI);
    var r = createVector(cos(a), sin(a));
    //*
    var d = p5.Vector.sub(center, this.p);
    d.setMag(this.s);
    this.p.add(createVector(lerp(r.x, d.x, this.b), lerp(r.y, d.y, this.b)));
    //*/
    //this.p.add(r);
  }
}

function createCirclePointWalker(interior) {
  var s = max(width, height) / 2;
  var a = random(2 * PI);
  var m = interior ? random(s) : s;
  var p = createVector(m * cos(a), m * sin(a));
  p.add(center);
  for(
    var i = 0;
    i < k && tree.some(node => distSqr(node.p.x, node.p.y, p.x, p.y) < S2);
    i++
  ) {
    a = random(2 * PI);
    m = interior ? random(s) : s;
    p = createVector(m * cos(a), m * sin(a));
    p.add(center);
  }
  if(tree.some(node => distSqr(node.p.x, node.p.y, p.x, p.y) < S2)) {
    return null;
  }
  return new RandomCirclePointWalker(p.x, p.y, step, b);
}

class RandomLineWalker {
  constructor(x, y, s, b) {
    this.p = createVector(x, y);
    this.s = s;
    this.b = b;
  }
  step() {
    var a = random(2 * PI);
    var r = createVector(cos(a), sin(a));
    //*
    var d = createVector(0, 1);
    this.p.add(createVector(lerp(r.x, d.x, this.b), lerp(r.y, d.y, this.b)));
    //*/
    //this.p.add(r);
  }
}

function createLineWalker(interior) {
  var a = random(width);
  var y = interior ? random(height) : 0;
  var p = createVector(a, y);
  for(
    var i = 0;
    i < k && tree.some(node => distSqr(node.p.x, node.p.y, p.x, p.y) < S2);
    i++
  ) {
    a = random(width);
    y = interior ? random(height) : 0;
    p = createVector(a, y);
  }
  if(tree.some(node => distSqr(node.p.x, node.p.y, p.x, p.y) < S2)) {
    return null;
  }
  return new RandomLineWalker(p.x, p.y, step, b);
}
