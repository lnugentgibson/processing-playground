class GraphNode {
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
