class Node {
  constructor(id_, p_, m_ = 1, c_ = 1) {
    this.id = id_;
    this.edges = [];
    this.nodes = [];
  }
  addEdge(edge, node) {
    this.edges.push(edge);
    this.nodes.push(node);
  }
  removeEdge(id) {
    let {
      nodes,
      edges,
    } = this;
    var i = edges.indexOf(id);
    if(i < 0) {
      return;
    }
    nodes.splice(i, 1);
    edges.splice(i, 1);
  }
  isAdjacent(node) {
    var id = node.id != undefined ? node.id : node;
    var i = this.nodes.indexOf(id);
    return i < 0 ? -1 : this.edges[i];
  }
  cardinality() {
    return this.edges.length;
  }
  clear(graph) {
    this.edges.forEach((id) => {
      graph.removeEdge(id);
    });
  }
}

class Edge {
  constructor(id_, a_, b_) {
    this.id = id_;
    this.a = a_;
    this.b = b_;
  }
}

class Graph {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.nodeIds = [0,];
    this.edgeIds = [0,];
  }
  addNode() {
    let {
      nodes,
      nodeIds,
    } = this;
    var id = nodeIds[0];
    nodeIds.splice(0, 1);
    if(!nodeIds.length) {
      nodeIds.push(id + 1);
    }
    nodes[id] = new Node(id);
    return id;
  }
  addEdge(a, b) {
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
    e = edges[id] = new Edge(id, a.id, b.id);
    a.addEdge(id, b.id);
    b.addEdge(id, a.id);
    return id;
  }
  removeNode(id) {
    let {
      nodes,
      edges,
      nodeIds,
    } = this;
    var i = nodes.indexOf(id);
    if(i < 0) {
      return;
    }
    var node = nodes[id];
    var incident = node.edges.map((id) => id);
    incident.forEach((id) => {
      this.removeEdge(id);
    });
    nodes.splice(i, 1);
    edgeIds.push(id);
    nodeIds = nodeIds.sort();
  }
  removeNodes(ids) {
    ids.forEach((id) => {
      this.removeNode(id);
    });
  }
  removeEdge(id) {
    let {
      nodes,
      edges,
      edgeIds,
    } = this;
    var i = edges.indexOf(id);
    if(i < 0) {
      return;
    }
    var edge = edges[id];
    edges.splice(i, 1);
    nodes[edge.a].removeEdge(id);
    nodes[edge.b].removeEdge(id);
    edgeIds.push(id);
    edgeIds = edgeIds.sort();
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
  forEachNode(f) {
    let {
      nodes,
    } = this;
    Object.keys(nodes).filter((id, i) => {
      var node = nodes[id];
      f.call(this, node, i, id);
    });
  }
  mapNodes(f) {
    let {
      nodes,
    } = this;
    return Object.keys(nodes).map((id, i) => {
      var node = nodes[id];
      return f.call(this, node, i, id);
    });
  }
  filterNodes(f) {
    let {
      nodes,
    } = this;
    return Object.keys(nodes).filter((id, i) => {
      var node = nodes[id];
      return f.call(this, node, i, id);
    });
  }
  update(r = 0, ke = 500, G = 0.1, friction = 0.01, max_force = 5) {
    let {
      nodes,
      edges,
    } = this;
    var ids = Object.keys(nodes);
    for(var i = 0; i < ids.length; i++) {
      var a = nodes[ids[i]];
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
            only_tension,
          } = edges[e];
          var o = d - l;
          if(only_tension) {
            o = max(o, 0);
          }
          var f = o * k;
          var Ft = p5.Vector.mult(u, f);
          if(Ft.mag() > max_force) {
            Ft.setMag(max_force);
          }
          a.a.add(p5.Vector.div(Ft, a.m));
          b.a.add(p5.Vector.div(Ft, -b.m));
        }
        
        var Fe = p5.Vector.mult(u, ke * a.c * b.c / d2);
        if(Fe.mag() > max_force) {
          Fe.setMag(max_force);
        }
        a.a.add(p5.Vector.div(Fe, -a.m));
        b.a.add(p5.Vector.div(Fe, b.m));
        
        u = a.p.copy();
        u.normalize();
        d = a.p.mag();
        d2 = d * d;
        var Fg = p5.Vector.mult(u, -G * a.m / d2);
        if(Fg.mag() > max_force) {
          Fg.setMag(max_force);
        }
        a.a.add(p5.Vector.div(Fg, a.m));
        
        u = a.v.copy();
        u.normalize();
        var Ff = p5.Vector.mult(u, -friction * a.v.mag());
        if(Ff.mag() > max_force) {
          Ff.setMag(max_force);
        }
        a.a.add(p5.Vector.div(Ff, a.m));
        
        u = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
        u.normalize();
        var Fr = p5.Vector.mult(u, random(r));
        if(Fr.mag() > max_force) {
          Fr.setMag(max_force);
        }
        a.a.add(p5.Vector.div(Fr, a.m));
      }
    }
    for(i = 0; i < ids.length; i++) {
      nodes[ids[i]].update();
    }
  }
  draw(o, x, y, z) {
    let {
      nodes,
      edges,
    } = this;
    var c = createVector(width / 2, height / 2, 0);
    ellipseMode(RADIUS);
    noStroke();
    fill(255);
    var ids = Object.keys(nodes);
    for(var i = 0; i < ids.length; i++) {
      var node = nodes[ids[i]];
      var p = Flatten(node.p, o, x, y, z);
      p.add(c);
      ellipse(p.x, p.y, 4, 4);
    }
    noFill();
    stroke(255);
    ids = Object.keys(edges);
    for(i = 0; i < ids.length; i++) {
      var edge = edges[ids[i]];
      let {
        a,
        b,
      } = edge;
      a = nodes[a];
      b = nodes[b];
      var ap = Flatten(a.p, o, x, y, z);
      var bp = Flatten(b.p, o, x, y, z);
      ap.add(c);
      bp.add(c);
      line(ap.x, ap.y, bp.x, bp.y);
    }
  }
}

class GraphTri {
  constructor(graph_, i_, j_, k_) {
    this.graph = graph_;
    this.i = i_;
    this.j = j_;
    this.k = k_;
    this.triangle = new Triangle(graph_.node(i_).p, graph_.node(j_).p, graph_.node(k_).p);
  }
  update() {
    let {
      i,
      j,
      k,
      graph,
      triangle,
    } = this;
    triangle.a = graph.node(i).p;
    triangle.b = graph.node(j).p;
    triangle.c = graph.node(k).p;
  }
}

class GraphPoly {
  constructor(graph_, ids_) {
    this.graph = graph_;
    this.ids = ids_;
    var center = this.computeCenter();
    this.triangles = ids_.map((id, i) => {
      return new Triangle(center, graph_.node(ids_[i]).p, graph_.node(ids_[(i + 1) % ids_.length]).p);
    });
  }
  computeCenter() {
    let {
      ids,
      graph,
    } = this;
    var center = graph.node(ids[0]).p.copy();
    for(var i = 1; i < ids.length; i++) {
      center.add(graph.node(ids[i]).p);
    }
    center.mult(1 / ids.length);
    this.center = center;
    return center;
  }
  update() {
    this.computeCenter();
    let {
      ids,
      graph,
      triangles,
      center,
    } = this;
    triangles.forEach((triangle, i) => {
      triangle.a = center;
      triangle.b = graph.node(ids[i]).p;
      triangle.c = graph.node(ids[(i + 1) % ids.length]).p;
    });
  }
}
