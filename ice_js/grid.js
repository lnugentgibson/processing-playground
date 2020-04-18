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
            createVector(maxX, minY),
            createVector(minX, maxY),
            createVector(maxX, maxY),
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
    function iterate(f, init, ctx) {
      var arr = [];
      var accum = init;
      index.every((entity, i) => {
        let { val, cont } = f.call(ctx, accum, entity.value, entity.position, entity.row, entity.col, i, entity.id);
        arr[i] = accum = val;
        return cont;
      });
      return {
        arr,
        accum,
      };
    }
    function iterateGrid(f, init, ctx) {
      var rows = [];
      var accum = init;
      grid.every((row, i) => {
        rows[i] = [];
        return row.cells.every((cell, j) => {
          rows[i][j] = [];
          return cell.entities.every((entity, k) => {
            let { val, cont } = f.call(ctx, accum, entity.value, entity.position, i - 1, j - 1, k, entity.id);
            rows[i][j] = accum = val;
            return cont;
          });
        });
      });
      return {
        rows,
        accum,
      };
    }
    function iterateNeighborhood(position, range, f, init, ctx) {
      let { col, row } = indexOf(position);
      var rows = [];
      var accum = init;
      var cont = true;
      var rowIndex = 0;
      for (
        var i = max(-1, row - range);
        i <= min(yCells, row + range) && cont;
        i++
      ) {
        rows[rowIndex] = [];
        var colIndex = 0;
        for (
          var j = max(-1, col - range);
          j <= min(xCells, col + range) && cont;
          j++
        ) {
          rows[rowIndex][colIndex] = [];
          grid[i + 1].cells[j + 1].entities.every((entity, k) => {
            var ret = f.call(ctx, accum, entity.value, entity.position, i, j, k, entity.id);
            rows[i][j] = accum = ret.val;
            return cont = ret.cont;
          });
          colIndex++;
        }
        rowIndex++;
      }
      return {
        rows,
        accum,
      };
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
            if(!entity) {
              return false;
            }
            delete index[id];
            var cell = grid[entity.row + 1].cells[entity.col + 1];
            cell.entities = cell.entities.filter((e) => e.id != id);
            len--;
            return true;
          };
        }
      },
      forEach: {
        get: () => {
          return (f, ctx) => {
            iterate((accum, value, position, row, col, i, id) => {
              f.call(ctx, value, position, row, col, i, id);
              return {cont: true};
            });
          };
        }
      },
      forEachGrid: {
        get: () => {
          return (f, ctx) => {
            iterateGrid((accum, value, position, row, col, i, id) => {
              f.call(ctx, value, position, row, col, i, id);
              return {cont: true};
            });
          };
        }
      },
      forEachNeighborhood: {
        get: () => {
          return (position, range, f, ctx) => {
            iterateNeighborhood(position, range, (accum, value, position, row, col, i, id) => {
              f.call(ctx, value, position, row, col, i, id);
              return {cont: true};
            });
          };
        }
      },
      map: {
        get: () => {
          return (f, ctx) => {
            return iterate((accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val, cont: true};
            }).arr;
          };
        }
      },
      mapGrid: {
        get: () => {
          return (f, ctx) => {
            return iterateGrid((accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val, cont: true};
            }).rows;
          };
        }
      },
      mapNeighborhood: {
        get: () => {
          return (position, range, f, ctx) => {
            iterateNeighborhood(position, range, (accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val, cont: true};
            }).rows;
          };
        }
      },
      reduce: {
        get: () => {
          return (f, init, ctx) => {
            return iterate((accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, accum, value, position, row, col, i, id);
              return {val, cont: true};
            }, init).accum;
          };
        }
      },
      reduceGrid: {
        get: () => {
          return (f, init, ctx) => {
            return iterate((accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, accum, value, position, row, col, i, id);
              return {val, cont: true};
            }, init).accum;
          };
        }
      },
      reduceNeighborhood: {
        get: () => {
          return (position, range, f, init, ctx) => {
            iterateNeighborhood(position, range, (accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val, cont: true};
            }, init).accum;
          };
        }
      },
      some: {
        get: () => {
          return (f, ctx) => {
            return iterate((accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val: accum || val, cont: !val};
            }, false).accum;
          };
        }
      },
      someGrid: {
        get: () => {
          return (f, ctx) => {
            return iterate((accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val: accum || val, cont: !val};
            }, false).accum;
          };
        }
      },
      someNeighborhood: {
        get: () => {
          return (position, range, f, ctx) => {
            iterateNeighborhood(position, range, (accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val: accum || val, cont: !val};
            }, false).accum;
          };
        }
      },
      kNearest: {
        get: () => {
          return (id, k, print) => {
            var center = index[id];
            var centerCell = grid[center.row + 1].cells[center.col + 1];
            var nearest = [];
            function checkCell(cell) {
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
                  var cell = grid[row + 1].cells[col + 1];
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
                      let { corners } = cell;
                      var cornerI = 0;
                      if (i < 0) {
                        cornerI++;
                      }
                      if (j < 0) {
                        cornerI += 2;
                      }
                      if (
                        nearest[k - 1].dist <
                        p5.Vector.sub(corners[cornerI], center.position).mag()
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
