class Grid {
  constructor(cells_) {
    var cells = cells_ || 8;
    var padding = 64;
    var cellPadding = 2;
    var graph = new Graph();
    var vector = [];
    var previousRow;
    for(var i = 0; i < cells; i++) {
      var row = [];
      var previous;
      for(var j = 0; j < cells; j++) {
        var node = graph.addNode();
        if(i > 0) {
          graph.addEdge(previousRow[j], node);
        }
        if(j > 0) {
          graph.addEdge(previous, node);
        }
        row.push(node);
        previous = node;
        vector.push(node);
      }
      previousRow = row;
    }
    var drawLinks = false;
    var showBlocked = true;
    Object.defineProperties(this, {
      cells: {
        get: () => cells,
        set: v => {
          cells = parseInt(v);
        },
      },
      padding: {
        get: () => padding,
        set: v => {
          padding = parseInt(v);
        },
      },
      cellPadding: {
        get: () => cellPadding,
        set: v => {
          cellPadding = parseInt(v);
        },
      },
      graph: {
        get: () => graph,
      },
      vector: {
        get: () => vector,
      },
      drawLinks: {
        get: () => drawLinks,
        set: v => {
          drawLinks = !!v;
        },
      },
      showBlocked: {
        get: () => showBlocked,
        set: v => {
          showBlocked = !!v;
        },
      },
    });
  }
  nodeId(row, col) {
    return row * this.cells + col;
  }
  setBlocked(row, col, blocked) {
    let {
      cells,
      graph,
      vector,
    } = this;
    if(!blocked) {
      var i = row * cells + col;
      var id = vector[i];
      graph.removeNode(id);
    }
  }
  isBlocked(row, col) {
    let {
      cells,
      graph,
      vector,
    } = this;
    var i = row * cells + col;
    var id = vector[i];
    return !graph.getNode(id);
  }
  setStart(row, col, blocked) {
    let {
      cells,
      graph,
      vector,
    } = this;
    var i = row * cells + col;
    var id = vector[i];
    var node = graph.getNode(id);
    if(node) {
      node.attr({
        start: true,
      });
    }
  }
  setEnd(row, col, blocked) {
    let {
      cells,
      graph,
      vector,
    } = this;
    var i = row * cells + col;
    var id = vector[i];
    var node = graph.getNode(id);
    if(node) {
      node.attr({
        end: true,
      });
    }
  }
  nodeAt(x, y) {
    let {
      cells,
      padding,
      cellPadding,
      graph,
      vector,
      drawLinks,
      showBlocked,
    } = this;
    var size = min(width - 2 * padding, height - 2 * padding);
    var cellSpacing = size / cells;
    var left = (width - size) / 2;
    var top = (height - size) / 2;
    var right = left + size;
    var bottom = top + size;
    if(x < left || x > right) {
      return -1;
    }
    if(y < top || y > bottom) {
      return -1;
    }
    x -= left;
    y -= top;
    x /= cellSpacing;
    y /= cellSpacing;
    return this.nodeId(floor(x), floor(y));
  }
  drawCellById(id, r, g, b) {
    let {
      cells,
      padding,
      cellPadding,
      graph,
      vector,
      drawLinks,
      showBlocked,
    } = this;
    var size = min(width - 2 * padding, height - 2 * padding);
    var cellSpacing = size / cells;
    var cellSize = cellSpacing - cellPadding;
    var left = (width - size) / 2;
    var top = (height - size) / 2;
    var i = vector.indexOf(id);
    var row = floor(i / cells), col = i % cells;
    noStroke();
    fill(r, g, b);
    rect(left + (col + 0.5) * cellSpacing, top + (row + 0.5) * cellSpacing, cellSize, cellSize);
  }
  draw() {
    let {
      cells,
      padding,
      cellPadding,
      graph,
      vector,
      drawLinks,
      showBlocked,
    } = this;
    var size = min(width - 2 * padding, height - 2 * padding);
    var cellSpacing = size / cells;
    var cellSize = cellSpacing - cellPadding;
    var left = (width - size) / 2;
    var top = (height - size) / 2;
    rectMode(CENTER);
    //*
    vector.forEach((nodeId, i) => {
      var row = floor(i / cells), col = i % cells;
      var node = graph.getNode(nodeId);
      if(node) {
        node.attr({
          x: left + (col + 0.5) * cellSpacing,
          y: top + (row + 0.5) * cellSpacing,
        });
      }
    });
    //*/
    noStroke();
    vector.forEach((nodeId, i) => {
      var row = floor(i / cells), col = i % cells;
      var node = graph.getNode(nodeId);
      if(node) {
        let {
          start,
          end,
        } = node.getAttr(['start', 'end',]);
        if(start) {
          fill(0, 255, 0);
        } else if(end) {
          fill(255, 0, 0);
        } else {
          fill(255);
        }
      } else if(!showBlocked) {
        fill(255);
      } else {
        fill(0);
      }
      rect(left + (col + 0.5) * cellSpacing, top + (row + 0.5) * cellSpacing, cellSize, cellSize);
    });
    if(drawLinks) {
      var edges = graph.getEdges();
      Object.keys(edges).forEach((id) => {
        var edge = edges[id];
        let [
          a,
          b,
        ] = graph.getNodes([edge.a, edge.b,]);
        if(!a || !b) {
          console.log({
            edge,
            edges,
          });
        }
        let {
          x: ax,
          y: ay,
        } = a.getAttr(['x', 'y',]);
        let {
          x: bx,
          y: by,
        } = b.getAttr(['x', 'y',]);
        stroke(255, 0, 0);
        strokeWeight(4);
        line(ax, ay, bx, by);
      });
    }
  }
}
