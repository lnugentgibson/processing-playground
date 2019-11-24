var center, y;

var triangles = [];

var graph;

function setup() {
  createCanvas(1024, 1024);
  graph = new Graph();
  for(var i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  for(i = 0; i < 12; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)), 1, 10);
  }
  for(i = 0; i < 5; i++) {
    var j = (i + 1) % 5;
    var k = (i + 4) % 5;
    graph.addEdge(i, j);
    graph.addEdge(19 - i, 19 - j);
    graph.addEdge(i, i + 5);
    graph.addEdge(19 - i, 19 - i - 5);
    graph.addEdge(i + 5, i + 10);
    graph.addEdge(19 - i - 5, 19 - i - 10);
    graph.addEdge(i + 10, j + 5);
    graph.addEdge(19 - i - 10, 19 - j - 5);
    var t = 0.001;
    graph.addEdge(i, 20, 1, t);
    graph.addEdge(19 - i, 31, 1, t);
    graph.addEdge(i, 21 + i, 1, t);
    graph.addEdge(19 - i, 30 - i, 1, t);
    graph.addEdge(i, 21 + k, 1, t);
    graph.addEdge(19 - i, 30 - k, 1, t);
    graph.addEdge(i + 5, 21 + i, 1, t);
    graph.addEdge(19 - i - 5, 30 - i, 1, t);
    graph.addEdge(i + 5, 21 + k, 1, t);
    graph.addEdge(19 - i - 10, 30 - k, 1, t);
    graph.addEdge(i + 10, 21 + i, 1, t);
    graph.addEdge(19 - i - 10, 30 - i, 1, t);
  }
  /*
  for(i = 0; i < 40; i++) {
    graph.addEdge(floor(random(0, 20)), floor(random(0, 20)));
  }
  var ids = graph.filterNodes((node) => node.cardinality() <= 1);
  i = 5;
  while(ids.length && i) {
    graph.removeNodes(ids);
    ids = graph.filterNodes((node) => node.cardinality() <= 1);
    i--;
  }
  */
  center = createVector(0, 0, 0);
  var gs = GranSchmidt(
    createVector(1, 0, 0),
    createVector(0, 0, 1),
    createVector(0, 1, 0)
  );
  y = createVector(0, 0, 1);
}

var t = 0;
function draw() {
  background(0);
  graph.draw(
    center,
    createVector(cos(t), sin(t), 0),
    y,
    createVector(-sin(t), cos(t), 0)
  );
  t += 0.005;
  for(var i = 0; i < 10; i++) {
    graph.update();
  }
}
