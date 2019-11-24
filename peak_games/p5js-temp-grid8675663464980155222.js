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
    });
  }
  setBlocked(row, col, blocked) {
    let {
      cells,
      graph,
      vector,
    } = this;
    if(blocked) {
    }
  }
  draw() {
    let {
      cells,
      padding,
      cellPadding,
      graph,
      vector,
      drawLinks,
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
      node.attr({
        x: left + (col + 0.5) * cellSpacing,
        y: top + (row + 0.5) * cellSpacing,
      });
    });
    //*/
    vector.forEach((nodeId, i) => {
      var row = floor(i / cells), col = i % cells;
      var node = graph.getNode(nodeId);
      if(node) {
        fill(255);
      } else {
        fill(0);
      }
      let {
        x,
        y,
      } = node.getAttr(['x', 'y',]);
      rect(x, y, cellSize, cellSize);
    });
    if(drawLinks) {
      graph.getEdges().forEach((edge) => {
        let [
          a,
          b,
        ] = graph.getNodes([edge.a, edge.b,]);
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
