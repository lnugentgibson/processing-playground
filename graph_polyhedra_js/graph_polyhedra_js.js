<<<<<<< HEAD
var center, y;

var polies = [];
var triangles = [];

var graph;

function setup() {
  createCanvas(1024, 1024);
  graph = new Graph();
  var poly;
  var i, j, k, l;
  for(i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  //*
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    k = (i + 4) % 5;
    graph.addEdge(i, j);
    graph.addEdge(19 - i, 19 - j);
    graph.addEdge(i, i + 5);
    graph.addEdge(19 - i, 19 - i - 5);
    graph.addEdge(i + 5, i + 10);
    graph.addEdge(19 - i - 5, 19 - i - 10);
    graph.addEdge(i + 10, j + 5);
    graph.addEdge(19 - i - 10, 19 - j - 5);
  }
  poly = new GraphPoly(graph, [0, 1, 2, 3, 4,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    poly = new GraphPoly(graph, [i, i + 5, i + 10, j + 5, j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
    poly = new GraphPoly(graph, [19 - i, 19 - i - 5, 19 - i - 10, 19 - j - 5, 19 - j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
  }
  poly = new GraphPoly(graph, [19, 18, 17, 16, 15,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  //*/
  /*
  for(l = 0; l < 60; l++) {
    i = floor(random(0, 20));
    j = floor(random(0, 20));
    k = floor(random(0, 20));
    graph.addEdge(i, j);
    graph.addEdge(j, k);
    graph.addEdge(k, i);
    poly = new GraphTri(graph, i, j, k);
    polies.push(poly);
    triangles.push(poly.triangle);
  }
  var ids = graph.filterNodes((node) => node.cardinality() <= 1);
  i = 5;
  while(ids.length && i) {
    graph.removeNodes(ids);
    ids = graph.filterNodes((node) => node.cardinality() <= 1);
    i--;
  }
  //*/
  center = createVector(0, 0, 0);
  y = createVector(0, 0, 0.5);
  light = createVector(1024, 1024, 1024);
}

var t = 0;
function draw() {
  background(0);
  var x = createVector(cos(t), sin(t), 0);
  var z = createVector(-sin(t), cos(t), 0);
  x.mult(0.5);
  z.mult(0.5);
  graph.draw(
    center,
    x,
    y,
    z
  );
  t += 0.005;
  polies.forEach((poly) => {
    poly.update();
  });
  var light = createVector(cos(-t), sin(-t), 1);
  light.mult(1024);
  noStroke();
  triangles.sort((a, b) => {
    var ab = a.bounds(z);
    var bb = b.bounds(z);
    return ab[1] - bb[1];
  }).forEach((triangle) => {
    triangle.draw(
      center,
      x,
      y,
      z,
      light
    );
  });
  for(var i = 0; i < 10; i++) {
    graph.update(0.1);
  }
}

function mouseClicked() {
  polies = [];
  triangles = [];
  graph = new Graph();
  var poly;
  var i, j, k, l;
  for(i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  //*
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    k = (i + 4) % 5;
    graph.addEdge(i, j);
    graph.addEdge(19 - i, 19 - j);
    graph.addEdge(i, i + 5);
    graph.addEdge(19 - i, 19 - i - 5);
    graph.addEdge(i + 5, i + 10);
    graph.addEdge(19 - i - 5, 19 - i - 10);
    graph.addEdge(i + 10, j + 5);
    graph.addEdge(19 - i - 10, 19 - j - 5);
  }
  poly = new GraphPoly(graph, [0, 1, 2, 3, 4,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    poly = new GraphPoly(graph, [i, i + 5, i + 10, j + 5, j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
    poly = new GraphPoly(graph, [19 - i, 19 - i - 5, 19 - i - 10, 19 - j - 5, 19 - j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
  }
  poly = new GraphPoly(graph, [19, 18, 17, 16, 15,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  //*/
  /*
  for(l = 0; l < 60; l++) {
    i = floor(random(0, 20));
    j = floor(random(0, 20));
    k = floor(random(0, 20));
    graph.addEdge(i, j);
    graph.addEdge(j, k);
    graph.addEdge(k, i);
    poly = new GraphTri(graph, i, j, k);
    polies.push(poly);
    triangles.push(poly.triangle);
  }
  var ids = graph.filterNodes((node) => node.cardinality() <= 1);
  i = 5;
  while(ids.length && i) {
    graph.removeNodes(ids);
    ids = graph.filterNodes((node) => node.cardinality() <= 1);
    i--;
  }
  //*/
}
=======
var center, y;

var polies = [];
var triangles = [];

var graph;

function setup() {
  createCanvas(1024, 1024);
  graph = new Graph();
  var poly;
  var i, j, k, l;
  for(i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  //*
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    k = (i + 4) % 5;
    graph.addEdge(i, j);
    graph.addEdge(19 - i, 19 - j);
    graph.addEdge(i, i + 5);
    graph.addEdge(19 - i, 19 - i - 5);
    graph.addEdge(i + 5, i + 10);
    graph.addEdge(19 - i - 5, 19 - i - 10);
    graph.addEdge(i + 10, j + 5);
    graph.addEdge(19 - i - 10, 19 - j - 5);
  }
  poly = new GraphPoly(graph, [0, 1, 2, 3, 4,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    poly = new GraphPoly(graph, [i, i + 5, i + 10, j + 5, j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
    poly = new GraphPoly(graph, [19 - i, 19 - i - 5, 19 - i - 10, 19 - j - 5, 19 - j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
  }
  poly = new GraphPoly(graph, [19, 18, 17, 16, 15,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  //*/
  /*
  for(l = 0; l < 60; l++) {
    i = floor(random(0, 20));
    j = floor(random(0, 20));
    k = floor(random(0, 20));
    graph.addEdge(i, j);
    graph.addEdge(j, k);
    graph.addEdge(k, i);
    poly = new GraphTri(graph, i, j, k);
    polies.push(poly);
    triangles.push(poly.triangle);
  }
  var ids = graph.filterNodes((node) => node.cardinality() <= 1);
  i = 5;
  while(ids.length && i) {
    graph.removeNodes(ids);
    ids = graph.filterNodes((node) => node.cardinality() <= 1);
    i--;
  }
  //*/
  center = createVector(0, 0, 0);
  y = createVector(0, 0, 0.5);
  light = createVector(1024, 1024, 1024);
}

var t = 0;
function draw() {
  background(0);
  var x = createVector(cos(t), sin(t), 0);
  var z = createVector(-sin(t), cos(t), 0);
  x.mult(0.5);
  z.mult(0.5);
  graph.draw(
    center,
    x,
    y,
    z
  );
  t += 0.005;
  polies.forEach((poly) => {
    poly.update();
  });
  var light = createVector(cos(-t), sin(-t), 1);
  light.mult(1024);
  noStroke();
  triangles.sort((a, b) => {
    var ab = a.bounds(z);
    var bb = b.bounds(z);
    return ab[1] - bb[1];
  }).forEach((triangle) => {
    triangle.draw(
      center,
      x,
      y,
      z,
      light
    );
  });
  for(var i = 0; i < 10; i++) {
    graph.update(0.1);
  }
}

function mouseClicked() {
  polies = [];
  triangles = [];
  graph = new Graph();
  var poly;
  var i, j, k, l;
  for(i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  //*
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    k = (i + 4) % 5;
    graph.addEdge(i, j);
    graph.addEdge(19 - i, 19 - j);
    graph.addEdge(i, i + 5);
    graph.addEdge(19 - i, 19 - i - 5);
    graph.addEdge(i + 5, i + 10);
    graph.addEdge(19 - i - 5, 19 - i - 10);
    graph.addEdge(i + 10, j + 5);
    graph.addEdge(19 - i - 10, 19 - j - 5);
  }
  poly = new GraphPoly(graph, [0, 1, 2, 3, 4,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  for(i = 0; i < 5; i++) {
    j = (i + 1) % 5;
    poly = new GraphPoly(graph, [i, i + 5, i + 10, j + 5, j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
    poly = new GraphPoly(graph, [19 - i, 19 - i - 5, 19 - i - 10, 19 - j - 5, 19 - j,]);
    polies.push(poly);
    triangles = triangles.concat(poly.triangles);
  }
  poly = new GraphPoly(graph, [19, 18, 17, 16, 15,]);
  polies.push(poly);
  triangles = triangles.concat(poly.triangles);
  //*/
  /*
  for(l = 0; l < 60; l++) {
    i = floor(random(0, 20));
    j = floor(random(0, 20));
    k = floor(random(0, 20));
    graph.addEdge(i, j);
    graph.addEdge(j, k);
    graph.addEdge(k, i);
    poly = new GraphTri(graph, i, j, k);
    polies.push(poly);
    triangles.push(poly.triangle);
  }
  var ids = graph.filterNodes((node) => node.cardinality() <= 1);
  i = 5;
  while(ids.length && i) {
    graph.removeNodes(ids);
    ids = graph.filterNodes((node) => node.cardinality() <= 1);
    i--;
  }
  //*/
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
