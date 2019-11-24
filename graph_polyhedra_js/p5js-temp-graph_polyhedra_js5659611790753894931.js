var center, y;

var triangles = [];

var graph;

function setup() {
  createCanvas(1024, 1024);
  graph = new Graph();
  for(var i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  for(i = 0; i < 5; i++) {
    var j = (i + 1) % 5;
    graph.addEdge(i, j);
    graph.addEdge(19 - i, 19 - j);
    graph.addEdge(i, i + 5);
    graph.addEdge(19 - i, 19 - i - 5);
    graph.addEdge(i + 5, i + 10);
    graph.addEdge(19 - i - 5, 19 - i - 10);
    graph.addEdge(i + 10, j + 5);
    graph.addEdge(19 - i - 10, 19 - j - 5);
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
