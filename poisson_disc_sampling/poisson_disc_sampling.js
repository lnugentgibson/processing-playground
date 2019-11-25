var r = 8;
var k = 10;
var n = 2;

var grid;

var active = [];

function setup() {
  createCanvas(1024, 1024);
  grid = new Grid(width, height, floor(r / sqrt(n)));
  var initial = createVector(random(width), random(height));
  initial = {
    position: initial,
    active: true,
  };
  grid.push(initial, initial.position);
  active.push(initial);
}

function draw() {
  for(var iteration = 0; iteration < 20 && active.length; iteration++) {
    var ai = floor(random(active.length));
    var current = active[ai];
    var added = 0;
    for(var n = 0; n < k; n++) {
      var a = random(2 * PI);
      var m = random(r, 2 * r);
      var c = createVector(m * cos(a), m * sin(a));
      c.add(current.position);
      if(c.x < 0 || c.x >= width) {
        continue;
      }
      if(c.y < 0 || c.y >= height) {
        continue;
      }
      if(grid.some(p => dist(c.x, c.y, p.position.x, p.position.y) < r, null, c)) {
        continue;
      }
      c = {
        position: c,
        active: true,
      };
      grid.push(c, c.position);
      active.push(c);
      added++;
    }
    if(!added) {
      current.active = false;
      active.splice(ai, 1);
    }
  }
  background(0);
  strokeWeight(4);
  grid.forEach(p => {
    if(p.active) {
      stroke(255, 0, 0);
    } else {
      stroke(255);
    }
    point(p.position.x, p.position.y);
  });
}
