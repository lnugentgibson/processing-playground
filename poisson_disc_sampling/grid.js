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
    grid[y][x].push(e);
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
      let {x, y,} = this.indexOf(p);
      for(var i = max(0, y - 1); i <= min(yCells - 1, y + 1) && valid; i++) {
        for(var j = max(0, x - 1); j <= min(xCells - 1, x + 1) && valid; j++) {
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
      let {x, y,} = this.indexOf(p);
      for(var i = max(0, y - 1); i <= min(yCells - 1, y + 1); i++) {
        for(var j = max(0, x - 1); j <= min(xCells - 1, x + 1); j++) {
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
