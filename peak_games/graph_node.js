class GraphNode {
  constructor(graph, id) {
    this.graph = graph;
    this.id = id;
    this.incident = [];
    this.adjacent = [];
    this.attributes = {};
  }
  attr(obj) {
    let {
      attributes,
    } = this;
    Object.keys(obj).forEach((key) => {
      attributes[key] = obj[key];
    });
  }
  getAttr(keys) {
    let {
      attributes,
    } = this;
    var obj = {};
    keys.forEach((key) => {
      obj[key] = attributes[key];
    });
    return obj;
  }
  addEdge(edge, node) {
    let {
      incident,
      adjacent,
    } = this;
    this.incident.push(edge);
    this.adjacent.push(node);
    /*
    var links = incident.map((e, i) => {
      return {
        edge: e,
        node: adjacent[i],
      };
    });
    links.push({
      edge,
      node,
    });
    links = links.sort((a, b) => {
      return 0;
    });
    //*/
  }
  removeEdge(edge) {
    let {
      incident,
      adjacent,
    } = this;
    var i = incident.indexOf(edge);
    if(i < 0) {
      return false;
    }
    adjacent.splice(i, 1);
    incident.splice(i, 1);
    return true;
  }
  getIncident() {
    return this.incident.map(edge => edge);
  }
  getAdjacent() {
    return this.adjacent.map(edge => edge);
  }
  isIncident(edge) {
    edge = edge.id != undefined ? edge.id : edge;
    var i = this.incident.indexOf(edge);
    return i >= 0;
  }
  isAdjacent(node) {
    node = node.id != undefined ? node.id : node;
    var i = this.adjacent.indexOf(node);
    return i >= 0;
  }
  cardinality() {
    return this.incident.length;
  }
  removeAllEdges() {
    this.getIncident().forEach((edge) => {
      this.graph.removeEdge(edge);
    });
  }
  remove() {
    this.removeAllEdges();
    this.graph.removeNode(this.id);
  }
}
