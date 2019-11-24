var center, x, y, z;

var triangles = [];

var graph;

function setup() {
  createCanvas(1024, 1024);
  graph = new Graph();
  for(var i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  for(i = 0; i < 40; i++) {
    graph.addEdge(floor(random(0, 20)), floor(random(0, 20)));
  }
  center = createVector(0, 0, 0);
  var gs = GranSchmidt(
    createVector(0, 1, 0),
    createVector(1, 0, 0),
    createVector(0, 0, 1)
  );
  x = gs.x;
  y = gs.y;
  z = gs.z;
}

function draw() {
  background(0);
  graph.draw(center, x, y, z);
  graph.update();
}
