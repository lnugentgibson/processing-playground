class GraphEdge {
  constructor(graph, id, a, b) {
    this.graph = graph;
    this.id = id;
    this.a = a;
    this.b = b;
    this.attributes = {};
  }
  attr(obj) {
    let {
      attributes,
    } = this;
    Object.keys(obj).forEach((key) => {
      var attribute = obj[key];
      attributes[key] = attribute;
    });
  }
  getAttr(keys) {
    let {
      attributes,
    } = this;
    var obj = {};
    keys.forEach((key) => {
      var attribute = attributes[key];
      obj[key] = attribute;
    });
    return obj;
  }
}
