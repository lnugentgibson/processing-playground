class Grid {
  constructor(width, height, cellWidth, cellHeight) {
    if (cellHeight == undefined) {
      cellHeight = cellWidth;
    }

    var xCells = ceil(width / cellWidth);
    var yCells = ceil(height / cellHeight);

    var grid = _.times(yCells + 2, (row) => {
      var minY = row > 0 ? (row - 1) * cellHeight : undefined;
      var maxY = row == yCells + 1 ? row * cellHeight : undefined;
      var cells = _.times(xCells + 2, (col) => {
        var minX = row > 0 ? (col - 1) * cellWidth : undefined;
        var maxX = row == xCells + 1 ? col * cellWidth : undefined;
        var entities = [];
        return {
          row: row - 1,
          col: col - 1,
          minX,
          maxX,
          minY,
          maxY,
          corners: [
            createVector(minX, minY),
            createVector(minX, minY),
            createVector(minX, maxY),
            createVector(minX, maxY),
          ],
          entities
        };
      });
      return {
        row: row - 1,
        minY,
        maxY,
        cells
      };
    });
    var index = [];
    var len = 0;

    function indexOf(position) {
      var col = min(max(floor(position.x / cellWidth), -1), xCells);
      var row = min(max(floor(position.y / cellHeight), -1), yCells);
      return { col, row };
    }
    Object.defineProperties(this, {
      length: {
        get: () => len
      },
      ids: {
        get: () => index.filter(entity => entity).map(entity => entity.id),
      },
      push: {
        get: () => {
          return (value, position) => {
            let { col, row } = indexOf(position);
            var id = len;
            var cell = grid[row + 1].cells[col + 1];
            var entity = {
              col,
              row,
              value,
              position,
              offset: p5.Vector.sub(position, cell.position),
              id
            };
            cell.entities.push(entity);
            index[id] = entity;
            len++;
            return id;
          };
        }
      },
      getValue: {
        get: () => {
          return (id) => index[id].value;
        }
      },
      getPosition: {
        get: () => {
          return (id) => index[id].position.copy();
        }
      },
      updateValue: {
        get: () => {
          return (id, value) => {
            var entity = index[id];
            entity.value = value;
          };
        },
      },
      updatePosition: {
        get: () => {
          return (id, position) => {
            var entity = index[id];
            let { col: oldCol, row: oldRow } = entity;
            var oldCell = grid[oldRow + 1].cells[oldCol + 1];
            var pindex = indexOf(position);
            if(!pindex) {
              return;
            }
            let { col, row } = pindex;
            entity.position = position;
            if(oldRow != row || oldCol != col) {
              oldCell.entities = oldCell.entities.filter(entity => entity.id != id);
              var cell = grid[row + 1].cells[col + 1];
              cell.entities.push(entity);
              Object.apply(entity, {
                row,
                col,
              });
            }
          };
        },
      },
      remove: {
        get: () => {
          return (id) => {
            var entity = index[id];
            delete index[id];
            var cell = grid[entity.row + 1].cells[entity.col + 1];
            cell.entities = cell.entities.filter((e) => e.id != id);
            len--;
          };
        }
      },
      forEach: {
        get: () => {
          return (f, ctx) => {
            grid.forEach((row, i) =>
              row.cells.forEach((cell, j) =>
                cell.entities.forEach((entity, k) =>
                  f.call(ctx, entity.value, entity.position, i, j, k, entity.id)
                )
              )
            );
          };
        }
      },
      forEachNeighborhood: {
        get: () => {
          return (f, ctx, position, range) => {
            let { col, row } = indexOf(position);
            for (
              var i = max(-1, row - range);
              i <= min(yCells, row + range) && valid;
              i++
            ) {
              for (
                var j = max(-1, col - range);
                j <= min(xCells, col + range) && valid;
                j++
              ) {
                grid[i + 1].cells[j + 1].entities.forEach((entity, k) =>
                  f.call(ctx, entity.value, entity.position, i, j, k, entity.id)
                );
              }
            }
            return;
          };
        }
      },
      map: {
        get: () => {
          return (f, ctx) => {
            return grid.reduce(
              (m1, row, i) =>
                m1.concat(
                  row.cells.reduce(
                    (m2, cell, j) =>
                      m2.concat(
                        cell.entities.map((entity, k) =>
                          f.call(
                            ctx,
                            entity.value,
                            entity.position,
                            i,
                            j,
                            k,
                            entity.id
                          )
                        )
                      ),
                    []
                  )
                ),
              []
            );
          };
        }
      },
      reduce: {
        get: () => {
          return (f, start, ctx) => {
            return grid.reduce(
              (m1, row, i) =>
                m1.concat(
                  row.cells.reduce(
                    (m2, cell, j) =>
                      m2.concat(
                        cell.entities.reduce(
                          (accum, entity, k) =>
                            f.call(
                              ctx,
                              accum,
                              entity.value,
                              i,
                              j,
                              k,
                              entity.id
                            ),
                          start
                        )
                      ),
                    []
                  )
                ),
              []
            );
          };
        }
      },
      some: {
        get: () => {
          return (f, ctx) => {
            return grid.some((row, i) =>
              row.cells.some((cell, j) =>
                cell.entities.some((entity, k) =>
                  f.call(ctx, entity.value, entity.position, i, j, k, entity.id)
                )
              )
            );
          };
        }
      },
      someNeighborhood: {
        get: () => {
          return (f, ctx, position, range) => {
            if (position.x < 0 || position.x > width) {
              return;
            }
            if (position.y < 0 || position.y > height) {
              return;
            }
            let { col, row } = indexOf(position);
            for (
              var i = max(0, row - range);
              i <= min(yCells - range, row + range);
              i++
            ) {
              for (
                var j = max(0, col - range);
                j <= min(xCells - range, col + range);
                j++
              ) {
                if (
                  grid[i].cells[j].entities.some((entity, k) =>
                    f.call(
                      ctx,
                      entity.value,
                      entity.position,
                      i,
                      j,
                      k,
                      entity.id
                    )
                  )
                ) {
                  return true;
                }
              }
            }
            return false;
          };
        }
      },
      kNearest: {
        get: () => {
          return (id, k, print) => {
            if (print)
              console.log({
                msg: "calling kNearest",
                id,
                k
              });
            var center = index[id];
            var centerCell = grid[center.row].cells[center.col];
            var nearest = [];
            if (print)
              console.log({
                msg: "initial state",
                center,
                centerCell,
                nearest,
                level
              });
            function checkCell(cell) {
              if (print)
                console.log({
                  msg: "calling checkCell",
                  cell
                });
              var dists = cell.entities
                .filter((o) => o.id != center.id)
                .map((entity) => {
                  return {
                    id: entity.id,
                    dist: p5.Vector.sub(entity.position, center.position).mag()
                  };
                });
              nearest = nearest
                .concat(dists)
                .sort((a, b) => a.dist - b.dist)
                .slice(0, k);
            }
            checkCell(centerCell);
            if (print)
              console.log({
                msg: "centerCell checked",
                center,
                centerCell,
                nearest,
                level
              });
            for (var level = 0; level < 10; level++) {
              var shiftX = cellWidth * (level - 1);
              var shiftY = cellHeight * (level - 1);
              var levelDistXN = shiftX + center.offset.x;
              var levelDistXP = shiftX + cellWidth - center.offset.x;
              var levelDistYN = shiftY + center.offset.y;
              var levelDistYP = shiftY + cellHeight - center.offset.y;
              var levelDist = min(
                min(levelDistXN, levelDistXP),
                min(levelDistYN, levelDistYP)
              );
              if (print)
                console.log({
                  msg: "level loop start",
                  center,
                  centerCell,
                  nearest,
                  level,
                  shiftX,
                  shiftY,
                  levelDist
                });
              if (
                nearest.length < k ||
                (nearest.length > 0 &&
                  levelDist < nearest[nearest.length - 1].dist)
              ) {
                var neighberCell = (i, j) => {
                  var col = center.col + i;
                  if (col < 0 || col >= xCells) {
                    return;
                  }
                  var row = center.row + j;
                  if (row < 0 || row >= yCells) {
                    return;
                  }
                  var cell = grid[row].cells[col];
                  if (cell.entities.length == 0) {
                    return;
                  }
                  if (nearest.length == k) {
                    if (i == 0) {
                      if (j > 0) {
                        if (nearest[k - 1].dist < levelDistYP) return;
                      } else if (j < 0) {
                        if (nearest[k - 1].dist < levelDistYN) return;
                      }
                    } else if (j == 0) {
                      if (i > 0) {
                        if (nearest[k - 1].dist < levelDistXP) return;
                      } else if (i < 0) {
                        if (nearest[k - 1].dist < levelDistXN) return;
                      }
                    } else {
                      let { corner } = cell;
                      if (i < 0) {
                        corner = p5.Vector.add(
                          corner,
                          createVector(cellWidth, 0)
                        );
                      }
                      if (j < 0) {
                        corner = p5.Vector.add(
                          corner,
                          createVector(0, cellHeight)
                        );
                      }
                      if (
                        nearest[k - 1].dist <
                        p5.Vector.sub(corner, center.position).mag()
                      )
                        return;
                    }
                  }
                  checkCell(cell);
                };
                var i,
                  j = -level;
                for (i = -level; i < level; i++) {
                  neighberCell(i, j);
                }
                i = level;
                for (j = -level; j < level; j++) {
                  neighberCell(i, j);
                }
                j = level;
                for (i = level; i > -level; i--) {
                  neighberCell(i, j);
                }
                i = -level;
                for (j = level; j > -level; j--) {
                  neighberCell(i, j);
                }
              }
              if (nearest.length == k && levelDist >= nearest[k - 1].dist) {
                //break;
              }
            }
            return nearest;
          };
        }
      }
    });
  }
}
