class Triangle {
  constructor(a_, b_, c_) {
    Object.assign(this, {
      a: a_.copy(),
      b: b_.copy(),
      c: c_.copy(),
    });
  }
  bounds(n) {
    let {
      a,
      b,
      c,
    } = this;
    var an = a.dot(n);
    var bn = b.dot(n);
    var cn = c.dot(n);
    return [
      min(min(an, bn), cn),
      (an + bn + cn) / 3,
      max(max(an, bn), cn),
    ];
  }
  draw(o, x, y, z) {
    let {
      a,
      b,
      c,
    } = this;
    var ap = Flatten(a, o, x, y, z);
    var bp = Flatten(b, o, x, y, z);
    var cp = Flatten(c, o, x, y, z);
    triangle(ap.x, ap.y, bp.x, bp.y, cp.x, cp.y);
  }
}

class Node {
  constructor(id_, p_, m_ = 1, c_ = 1) {
    this.id = id_;
    this.p = p_;
    this.m = m_;
    this.c = c_;
    this.v = createVector(0, 0, 0);
    this.a = createVector(0, 0, 0);
    this.edges = [];
    this.nodes = [];
  }
  addEdge(edge, node) {
    this.edges.push(edge);
    this.nodes.push(node);
  }
  adjacent(node) {
    var id = node.id != undefined ? node.id : node;
    var i = this.nodes.indexOf(id);
    return i < 0 ? -1 : this.edges[i];
  }
  update() {
    let {
      p,
      m,
      c,
      v,
      a,
    } = this;
    p.add(v);
    v.add(a);
    a.mult(0);
  }
}

class Edge {
  constructor(id_, a_, b_, l_ = 32, k_ = 1, only_tension_ = true) {
    this.id = id_;
    this.a = a_;
    this.b = b_;
    this.l = l_;
    this.k = k_;
    this.only_tension = only_tension_;
  }
}

class Graph {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.nodeIds = [0,];
    this.edgeIds = [0,];
  }
  addNode(p) {
    let {
      nodes,
      nodeIds,
    } = this;
    var id = nodeIds[0];
    nodeIds.splice(0, 1);
    if(!nodeIds.length) {
      nodeIds.push(id + 1);
    }
    nodes[id] = new Node(id, p);
    return id;
  }
  addEgde(a, b) {
    let {
      nodes,
      edges,
      edgeIds,
    } = this;
    a = nodes[a];
    b = nodes[b];
    if(!a || !b) {
      return -1;
    }
    var e = a.adjacent(b);
    if(e >= 0) {
      return -1;
    }
    var id = edgeIds[0];
    edgeIds.splice(0, 1);
    if(!edgeIds.length) {
      edgeIds.push(id + 1);
    }
    e = edges[id] = new Edge(id, a, b);
    a.addEdge(e, b);
    b.addEdge(e, a);
    return id;
  }
  node(id) {
    return this.nodes[id];
  }
  nodes(ids) {
    return ids.map((id) => this.nodes[id]);
  }
  edge(id) {
    return this.edges[id];
  }
  edges(ids) {
    return ids.map((id) => this.edges[id]);
  }
  update(ke = 1, G = 1, friction = 1) {
    let {
      nodes,
      edges,
    } = this;
    var ids = Object.keys(nodes);
    for(var i = 0; i < ids.length; i++) {
      var a = nodes[i];
      for(var j = i + 1; j < ids.length; j++) {
        var b = nodes[j];
        var D = p5.Vector.sub(b.p, a.p);
        var u = D.copy();
        u.normalize();
        var d = D.mag();
        var d2 = d * d;
        
        var e = a.adjacent(b);
        if(e >= 0) {
          let {
            l,
            k,
          } = edges[e];
          var o = d - l;
          if(only_tension) {
            o = max(o, 0);
          }
          var f = o * k;
          var F = p5.Vector.mult(u, f);
          a.a.add(p5.Vector.div(F, a.m));
          b.a.add(p5.Vector.div(F, -b.m));
        }
        
        var Fe = p5.Vector.mult(u, ke * a.c * b.c / d2);
        a.a.add(p5.Vector.div(Fe, -a.m));
        b.a.add(p5.Vector.div(Fe, b.m));
        
        var Fg = p5.Vector.mult(u, G * a.m * b.m / d2);
        a.a.add(p5.Vector.div(Fg, a.m));
        b.a.add(p5.Vector.div(Fg, -b.m));
        
        u = a.v.copy();
        u.normalize();
        var Ff = p5.Vector.mult(u, -friction * a.v.mag());
        a.a.add(p5.Vector.div(Ff, a.m));
      }
    }
    for(i = 0; i < ids.length; i++) {
      nodes[i].update();
    }
  }
  draw(o, x, y, z) {
    let {
      nodes,
      edges,
    } = this;
    ellipseMode(RADIUS);
    noStroke();
    fill(255);
    var ids = Object.keys(nodes);
    for(var i = 0; i < ids.length; i++) {
      var node = nodes[i];
      var p = Flatten(node.p, o, x, y, z);
      ellipse(p.x, p.y, 4, 4);
    }
    noFill();
    stroke(255);
    ids = Object.keys(edges);
    for(i = 0; i < ids.length; i++) {
      var edge = edges[i];
      let {
        a,
        b,
      } = edge;
      var ap = Flatten(a.p, o, x, y, z);
      var bp = Flatten(b.p, o, x, y, z);
      line(ap.x, ap.y, bp.x, bp.y);
    }
  }
}

var origin, x, y, z;

var triangles = [];

var graph;

function setup() {
  createCanvas(1024, 1024);
  graph = new Graph();
  for(var i = 0; i < 20; i++) {
    graph.addNode(createVector(random(-64, 64), random(-64, 64), random(-64, 64)));
  }
  for(i = 0; i < 40; i++) {
    graph.addEdge(floor(random(-64, 64)), floor(random(-64, 64)));
  }
  origin = createVector(0, 0, 0);
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
  graph.draw(origin, x, y, z);
  graph.update();
}
