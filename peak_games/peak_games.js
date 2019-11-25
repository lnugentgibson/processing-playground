<<<<<<< HEAD
var grid, path, showSolution = false;

var blockedFrames = 48;

var startId, endId, dragged, blocked, solved = false;

function setup() {
  createCanvas(512, 512);
  grid = new Grid();
  //grid.drawLinks = true;
  var r, c;
  for(var i = 0; i < 16; i++) {
    r = floor(random(8));
    c = floor(random(8));
    while(grid.isBlocked(r, c)) {
      r = floor(random(8));
      c = floor(random(8));
    }
    grid.setBlocked(r, c, false);
  }
  r = floor(random(8));
  c = floor(random(8));
  while(grid.isBlocked(r, c)) {
    r = floor(random(8));
    c = floor(random(8));
  }
  var startRow = r, startCol = c;
  grid.setStart(r, c);
  r = floor(random(8));
  c = floor(random(8));
  while(grid.isBlocked(r, c)) {
    r = floor(random(8));
    c = floor(random(8));
  }
  var endRow = r, endCol = c;
  grid.setEnd(r, c);
  startId = grid.nodeId(startRow, startCol);
  var paths = dijkstra(grid.graph, startId);
  endId = grid.nodeId(endRow, endCol);
  var endNode = paths[endId];
  if(endNode.distance != null) {
    path = [endId,];
    var currentId = endNode.from;
    while(currentId != startId) {
      path.push(currentId);
      currentId = paths[currentId].from;
    }
    path.push(currentId);
    path = path.reverse();
  }
}

function draw() {
  background(0);
  if(frameCount > blockedFrames) {
    grid.showBlocked = false;
  }
  grid.draw();
  if(path && showSolution) {
    stroke(255, 255, 0);
    strokeWeight(8);
    noFill();
    beginShape();
    path.forEach(id => {
      let {
        x,
        y,
      } = grid.graph.getNode(id).getAttr(['x', 'y',]);
      vertex(x, y);
    });
    endShape();
  }
  if(dragged) {
    if(blocked) {
      blocked.forEach(id => {
        grid.drawCellById(id, 0, 0, 0);
      });
    }
    stroke(0, 0, 255);
    strokeWeight(8);
    noFill();
    beginShape();
    dragged.forEach(id => {
      let {
        x,
        y,
      } = grid.graph.getNode(id).getAttr(['x', 'y',]);
      vertex(x, y);
    });
    endShape();
  }
}

function mouseDragged() {
  if(!dragged) {
    dragged = [];
  }
  var node = grid.cellAt(mouseX, mouseY);
  if(node == -1) {
    return;
  }
  if(dragged.length && dragged[dragged.length - 1].x == node.x && dragged[dragged.length - 1].y == node.y) {
    return;
  }
  if(!dragged.length && node != startId) {
    return;
  }
  dragged.push(node);
}

function mouseReleased() {
  if(dragged.length && dragged[dragged.length - 1] == endId) {
    blocked = dragged.filter(id => {
      return !grid.graph.getNode(id);
    });
    if(!blocked.length) {
      solved = true;
    }
  }
  dragged = null;
}
=======
var grid, path, showSolution = false;

var blockedFrames = 48;

var startId, endId, dragged, blocked, solved = false;

function setup() {
  createCanvas(512, 512);
  grid = new Grid();
  //grid.drawLinks = true;
  var r, c;
  for(var i = 0; i < 16; i++) {
    r = floor(random(8));
    c = floor(random(8));
    while(grid.isBlocked(r, c)) {
      r = floor(random(8));
      c = floor(random(8));
    }
    grid.setBlocked(r, c, false);
  }
  r = floor(random(8));
  c = floor(random(8));
  while(grid.isBlocked(r, c)) {
    r = floor(random(8));
    c = floor(random(8));
  }
  var startRow = r, startCol = c;
  grid.setStart(r, c);
  r = floor(random(8));
  c = floor(random(8));
  while(grid.isBlocked(r, c)) {
    r = floor(random(8));
    c = floor(random(8));
  }
  var endRow = r, endCol = c;
  grid.setEnd(r, c);
  startId = grid.nodeId(startRow, startCol);
  var paths = dijkstra(grid.graph, startId);
  endId = grid.nodeId(endRow, endCol);
  var endNode = paths[endId];
  if(endNode.distance != null) {
    path = [endId,];
    var currentId = endNode.from;
    while(currentId != startId) {
      path.push(currentId);
      currentId = paths[currentId].from;
    }
    path.push(currentId);
    path = path.reverse();
  }
}

function draw() {
  background(0);
  if(frameCount > blockedFrames) {
    grid.showBlocked = false;
  }
  grid.draw();
  if(path && showSolution) {
    stroke(255, 255, 0);
    strokeWeight(8);
    noFill();
    beginShape();
    path.forEach(id => {
      let {
        x,
        y,
      } = grid.graph.getNode(id).getAttr(['x', 'y',]);
      vertex(x, y);
    });
    endShape();
  }
  if(dragged) {
    if(blocked) {
      blocked.forEach(id => {
        grid.drawCellById(id, 0, 0, 0);
      });
    }
    stroke(0, 0, 255);
    strokeWeight(8);
    noFill();
    beginShape();
    dragged.forEach(id => {
      let {
        x,
        y,
      } = grid.graph.getNode(id).getAttr(['x', 'y',]);
      vertex(x, y);
    });
    endShape();
  }
}

function mouseDragged() {
  if(!dragged) {
    dragged = [];
  }
  var node = grid.cellAt(mouseX, mouseY);
  if(node == -1) {
    return;
  }
  if(dragged.length && dragged[dragged.length - 1].x == node.x && dragged[dragged.length - 1].y == node.y) {
    return;
  }
  if(!dragged.length && node != startId) {
    return;
  }
  dragged.push(node);
}

function mouseReleased() {
  if(dragged.length && dragged[dragged.length - 1] == endId) {
    blocked = dragged.filter(id => {
      return !grid.graph.getNode(id);
    });
    if(!blocked.length) {
      solved = true;
    }
  }
  dragged = null;
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
