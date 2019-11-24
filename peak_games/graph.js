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
    nodes[id] = new GraphNode(this, id);
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
    if(a.isAdjacent(b) || b.isAdjacent(a)) {
      return -1;
    }
    var id = edgeIds[0];
    edgeIds.splice(0, 1);
    if(!edgeIds.length) {
      edgeIds.push(id + 1);
    }
    edges[id] = new GraphEdge(this, id, a.id, b.id);
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
    var ids = Object.keys(nodes);
    var i = ids.indexOf('' + id);
    if(i < 0) {
      return false;
    }
    var node = nodes[id];
    node.removeAllEdges();
    delete nodes[id];
    nodeIds.push(id);
    this.nodeIds = nodeIds.sort();
    return true;
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
    var ids = Object.keys(edges);
    var i = ids.indexOf('' + id);
    if(i < 0) {
      return false;
    }
    var edge = edges[id];
    delete edges[id];
    nodes[edge.a].removeEdge(id);
    nodes[edge.b].removeEdge(id);
    edgeIds.push(id);
    this.edgeIds = edgeIds.sort();
  }
  getNode(id) {
    return this.nodes[id];
  }
  getNodes(ids) {
    if(ids) {
      return ids.map((id) => this.nodes[id]);
    }
    var nodes = {};
    Object.keys(this.nodes).forEach((id) => {
      nodes[id] = this.nodes[id];
    });
    return nodes;
  }
  getEdge(id) {
    return this.edges[id];
  }
  getEdges(ids) {
    if(ids) {
      return ids.map((id) => this.edges[id]);
    }
    var edges = {};
    Object.keys(this.edges).forEach((id) => {
      edges[id] = this.edges[id];
    });
    return edges;
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
}
