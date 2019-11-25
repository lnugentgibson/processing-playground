var tree = [];
var grid;
var walkers = [];
var num_walkers = 1024;
var center;
var type = 1;

var r = 4;
var R = r;
var R2 = R * R;
var S = 8 * r;
var S2 = S * S;
var step = 2;
var k = 30;
var b = 0.02;
var s = 0.1;

function setup() {
  createCanvas(1024, 1024);
  background(0);
  center = createVector(width / 2, height / 2);
  grid = new Grid(width, height, 2 * R);
  var p;
  switch(type) {
    case 0:
      p = center;
      break;
    case 1:
      p = createVector(width / 2, height - 1);
      break;
  }
  var root = {
    p,
    f: 0,
  };
  tree.push(root);
  grid.push(root, root.p);
  strokeWeight(r);
  stroke(255, 64);
  point(root.p.x, root.p.y);
  switch(type) {
    case 0:
      walkers = _.times(num_walkers, () => createCirclePointWalker(true));
      break;
    case 1:
      walkers = _.times(num_walkers, () => createLineWalker(true));
      break;
  }
}

function draw() {
  for(var iteration = 0; iteration < 20; iteration++) {
    walkers = walkers.map(walker => {
      walker.step();
      /*
      if(walker.p.x < 0 || walker.p.x >= width) {
        return createCircleCenterWalker();
      }
      if(walker.p.y < 0 || walker.p.y >= height) {
        return createCircleCenterWalker();
      }
      //*/
      var parent;
      var stuck = grid.some((node, i, j, k) => {
        var d = distSqr(node.p.x, node.p.y, walker.p.x, walker.p.y);
        if(d < R2 && random(1) < s) {
          parent = k;
          return true;
        }
        return false;
      }, null, walker.p);
      if(type == 1) {
        stuck = stuck || height - walker.p.y < R;
      }
      if(stuck) {
        var p = createVector(walker.p.x, walker.p.y);
        var node = {
          p,
          a: parent,
          f: 0,
        };
        tree.push(node);
        grid.push(node, node.p);
        strokeWeight(r);
        stroke(255, 64);
        point(node.p.x, node.p.y);
        switch(type) {
          case 0:
            return createCirclePointWalker();
          case 1:
            return createLineWalker();
        }
      }
      return walker;
    }).filter(w => w);
  }
  background(0);
  ///*
  tree.forEach(node => {
    strokeWeight(r);
    stroke(255);
    point(node.p.x, node.p.y);
    if(false && node.a) {
      stroke(255);
      strokeWeight(1);
      var parent = tree[node.a];
      line(node.p.x, node.p.y, parent.p.x, parent.p.y);
    }
  });
  walkers.forEach(walker => {
    strokeWeight(4);
    stroke(255, 0, 0);
    point(walker.p.x, walker.p.y);
  });
  //*/
}
