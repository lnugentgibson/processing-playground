<<<<<<< HEAD
function dijkstra(graph, start) {
  var nodes = graph.getNodes();
  Object.keys(nodes).forEach((id) => {
    var node = nodes[id];
    nodes[id] = {
      node,
      visited: false,
      distance: null,
      finalized: false,
      from: null,
    };
  });
  nodes[start].visited = true;
  nodes[start].distance = 0;
  nodes[start].finalized = true;
  var currentId = start;
  while(currentId != -1) {
    let {
      node: current,
      distance,
    } = nodes[currentId];
    var adjacent = current.getAdjacent();
    adjacent.filter(id => {
      return !nodes[id].visited;
    }).forEach(id => {
      if(nodes[id].distance == null || nodes[id].distance > distance + 1) {
        nodes[id].distance = distance + 1;
        nodes[id].from = currentId;
      }
    });
    nodes[currentId].visited = true;
    var unvisited = Object.keys(nodes).filter(id => {
      return !nodes[id].visited;
    }).sort((a, b) => {
      if(nodes[a].distance == null) {
        return 1;
      }
      if(nodes[b].distance == null) {
        return -1;
      }
      return nodes[a].distance - nodes[b].distance;
    });
    currentId = unvisited.length == 0 ? -1 : unvisited[0];
  }
  return nodes;
}
=======
function dijkstra(graph, start) {
  var nodes = graph.getNodes();
  Object.keys(nodes).forEach((id) => {
    var node = nodes[id];
    nodes[id] = {
      node,
      visited: false,
      distance: null,
      finalized: false,
      from: null,
    };
  });
  nodes[start].visited = true;
  nodes[start].distance = 0;
  nodes[start].finalized = true;
  var currentId = start;
  while(currentId != -1) {
    let {
      node: current,
      distance,
    } = nodes[currentId];
    var adjacent = current.getAdjacent();
    adjacent.filter(id => {
      return !nodes[id].visited;
    }).forEach(id => {
      if(nodes[id].distance == null || nodes[id].distance > distance + 1) {
        nodes[id].distance = distance + 1;
        nodes[id].from = currentId;
      }
    });
    nodes[currentId].visited = true;
    var unvisited = Object.keys(nodes).filter(id => {
      return !nodes[id].visited;
    }).sort((a, b) => {
      if(nodes[a].distance == null) {
        return 1;
      }
      if(nodes[b].distance == null) {
        return -1;
      }
      return nodes[a].distance - nodes[b].distance;
    });
    currentId = unvisited.length == 0 ? -1 : unvisited[0];
  }
  return nodes;
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
