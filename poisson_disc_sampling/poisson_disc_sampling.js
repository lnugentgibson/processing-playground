var r = 30;
var k = 10;
var n = 2;
var R = 1;

var grid;
var cellSize;
var xCells;
var yCells;

var active = [];

var USE_GRID = true;

function Grid(width, height, cellSize) {
  var grid = [];
  var xCells = ceil(width / cellSize);
  var yCells = ceil(height / cellSize);
  grid = _.times(yCells, () => _.times(xCells, () => []));
  this.push = function(e, p) {
    if(p.x < 0 || p.x > width) {
      return;
    }
    if(p.y < 0 || p.y > height) {
      return;
    }
    let {x, y,} = this.indexOf(p);
    grid[x][y].push(e);
  };
  this.indexOf = function(p) {
    if(p.x < 0 || p.x > width) {
      return;
    }
    if(p.y < 0 || p.y > height) {
      return;
    }
    var x = floor(p.x / cellSize);
    var y = floor(p.y / cellSize);
    return {x, y,};
  };
  this.forEach = function(f, ctx, p) {
    if(p != undefined) {
      if(p.x < 0 || p.x > width) {
        return;
      }
      if(p.y < 0 || p.y > height) {
        return;
      }
      let {I, J,} = this.indexOf(p);
      for(var i = max(0, I - R); i <= min(xCells - 1, I + R) && valid; i++) {
        for(var j = max(0, J - R); j <= min(yCells - 1, J + R) && valid; j++) {
          grid[i][j].forEach((p, k) => f.call(ctx, p, i, j, k));
        }
      }
      return;
    }
    grid.forEach((row, i) => row.forEach((cell, j) => cell.forEach((p, k) => f.call(ctx, p, i, j, k))));
  };
  this.some = function(f, ctx, p) {
    if(p != undefined) {
      if(p.x < 0 || p.x > width) {
        return;
      }
      if(p.y < 0 || p.y > height) {
        return;
      }
      let {I, J,} = this.indexOf(p);
      for(var i = max(0, I - 1); i <= min(xCells - 1, I + 1) && valid; i++) {
        for(var j = max(0, J - 1); j <= min(yCells - 1, J + 1) && valid; j++) {
          if(grid[i][j].some((P, k) => f.call(ctx, P, i, j, k))) {
            return true;
          }
        }
      }
      return false;
    }
    return grid.some((row, i) => row.some((cell, j) => cell.some((p, k) => f.call(ctx, p, i, j, k))));
  };
}

function setup() {
  createCanvas(400, 400);
  cellSize = floor(r / sqrt(n));
  if(!USE_GRID) {
    xCells = ceil(width / cellSize);
    yCells = ceil(height / cellSize);
    grid = _.times(yCells, () => _.times(xCells, () => []));
  } else {
    grid = new Grid(width, height, cellSize);
  }
  var initial = createVector(random(width), random(height));
  initial = {
    position: initial,
    active: true,
  };
  if(!USE_GRID) {
    var i = floor(initial.position.x / cellSize);
    var j = floor(initial.position.y / cellSize);
    grid[i][j].push(initial);
  } else {
    grid.push(initial, initial.position);
  }
  active.push(initial);
}

function draw() {
  if(active.length) {
    var ai = floor(random(active.length));
    var current = active[ai];
    var added = 0;
    for(var n = 0; n < k; n++) {
      var a = random(2 * PI);
      var m = random(r, 2 * r);
      var c = createVector(m * cos(a), m * sin(a));
      c.add(current.position);
      if(c.x < 0 || c.x >= width) {
        continue;
      }
      if(c.y < 0 || c.y >= height) {
        continue;
      }
      if(!USE_GRID) {
        var I = floor(c.x / cellSize);
        var J = floor(c.y / cellSize);
        var valid = true;
        for(var i = max(0, I - R); i <= min(xCells - 1, I + R) && valid; i++) {
          for(var j = max(0, J - R); j <= min(yCells - 1, J + R) && valid; j++) {
            if(grid[i][j].some(p => dist(c.x, c.y, p.position.x, p.position.y) < r)) {
              valid = false;
            }
          }
        }
        if(!valid) {
          continue;
        }
        c = {
          position: c,
          active: true,
        };
        grid[I][J].push(c);
        active.push(c);
      } else {
        if(grid.some(p => dist(c.x, c.y, p.position.x, p.position.y) < r, null, c)) {
          continue;
        }
        c = {
          position: c,
          active: true,
        };
        grid.push(c, c.position);
        active.push(c);
      }
      added++;
    }
    if(!added) {
      current.active = false;
      active.splice(ai, 1);
    }
  }
  background(0);
  strokeWeight(4);
  if(!USE_GRID) {
    grid.forEach(row => {
      row.forEach(cell => {
        cell.forEach(p => {
          if(p.active) {
            stroke(255, 0, 0);
          } else {
            stroke(255);
          }
          point(p.position.x, p.position.y);
        });
      });
    });
  } else {
    grid.forEach(p => {
      if(p.active) {
        stroke(255, 0, 0);
      } else {
        stroke(255);
      }
      point(p.position.x, p.position.y);
    });
  }
}
