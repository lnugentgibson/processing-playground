/*global _*/
/*global p5*/

class Grid {
  constructor(lib, width, height, cellWidth, cellHeight) {
    if(!lib) {
      lib = {
        /*global floor*/
        floor,
        /*global ceil*/
        ceil,
        /*global min*/
        min,
        /*global max*/
        max,
        /*global createVector*/
        createVector,
      };
    }
    
    if (cellHeight == undefined) {
      cellHeight = cellWidth;
    }

    var xCells = lib.ceil(width / cellWidth);
    var yCells = lib.ceil(height / cellHeight);

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
            lib.createVector(minX, minY),
            lib.createVector(maxX, minY),
            lib.createVector(minX, maxY),
            lib.createVector(maxX, maxY),
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
      var col = lib.min(lib.max(lib.floor(position.x / cellWidth), -1), xCells);
      var row = lib.min(lib.max(lib.floor(position.y / cellHeight), -1), yCells);
      var offset = p5.Vector.sub(position, grid[row + 1].cells[col + 1].corners[0]);
      return { col, row, offset };
    }
    function minCellDist(cell, position) {
      let { row, col, offset } = indexOf(position);
      if (cell.col == col) {
        if (cell.row == row) {
          return 0;
        } else if (cell.row > row) {
          return cellHeight * (cell.row - row - 1) + cellHeight - offset.y;
        } else if (cell.row < row) {
          return cellHeight * (row - cell.row - 1) + offset.y;
        }
      } else if (cell.row == row) {
        if (cell.col > col) {
          return cellWidth * (cell.col - col - 1) + cellWidth - offset.x;
        } else if (cell.col < col) {
          return cellWidth * (col - cell.col - 1) + offset.x;
        }
      } else {
        let { corners } = cell;
        var cornerI = 0;
        if (cell.col < col) {
          cornerI++;
        }
        if (cell.row < row) {
          cornerI += 2;
        }
        return p5.Vector.sub(corners[cornerI], position).mag();
      }
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
            rows[i][j][k] = accum = val;
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
        var i = lib.max(-1, row - range);
        i <= lib.min(yCells, row + range) && cont;
        i++
      ) {
        rows[rowIndex] = [];
        var colIndex = 0;
        for (
          var j = lib.max(-1, col - range);
          j <= lib.min(xCells, col + range) && cont;
          j++
        ) {
          rows[rowIndex][colIndex] = [];
          grid[i + 1].cells[j + 1].entities.every((entity, k) => {
            var ret = f.call(ctx, accum, entity.value, entity.position, i, j, k, entity.id);
            rows[rowIndex][colIndex][k] = accum = ret.val;
            cont = ret.cont;
            return cont;
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
    function iterateDistance(position, radius, f, init, ctx) {
      var range = lib.ceil(radius / lib.min(cellWidth, cellHeight));
      let { col, row } = indexOf(position);
      var rows = [];
      var accum = init;
      var cont = true;
      var rowIndex = 0;
      for (
        var i = lib.max(-1, row - range);
        i <= lib.min(yCells, row + range) && cont;
        i++
      ) {
        rows[rowIndex] = [];
        var colIndex = 0;
        for (
          var j = lib.max(-1, col - range);
          j <= lib.min(xCells, col + range) && cont;
          j++
        ) {
          rows[rowIndex][colIndex] = [];
          grid[i + 1].cells[j + 1].entities.every((entity, k) => {
            var ret = f.call(ctx, accum, entity.value, entity.position, i, j, k, entity.id);
            rows[rowIndex][colIndex][k] = accum = ret.val;
            cont = ret.cont;
            return cont;
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
      rows: {
        get: () => yCells,
      },
      cols: {
        get: () => xCells,
      },
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
      getEntity: {
        get: () => {
          return (id) => {
            let {value, position, row, col, offset, id: eid} = index[id];
            return {
              value,
              position: position.copy(),
              row,
              col,
              offset,
              id: eid,
            };
          };
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
            let { col, row } = indexOf(position);
            Object.assign(entity, {
              row,
              col,
              position,
            });
            if(oldRow != row || oldCol != col) {
              oldCell.entities = oldCell.entities.filter(entity => entity.id != id);
              var cell = grid[row + 1].cells[col + 1];
              cell.entities.push(entity);
            }
            /*
            var pindex = indexOf(position);
            if(!pindex) {
              return;
            }
            let { col, row } = indexOf(position);
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
            //*/
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
      forEachDistance: {
        get: () => {
          return (center, radius, f, ctx) => {
            return iterateDistance(center, radius, (accum, value, position, row, col, i, id) => {
              //var difference = p5.Vector.sub(position, center);
              f.call(ctx, value, position/*, difference*/, row, col, i, id);
              return {cont: true};
            }, init).accum;
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
            return iterateNeighborhood(position, range, (accum, value, position, row, col, i, id) => {
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
            return iterateNeighborhood(position, range, (accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, accum, value, position, row, col, i, id);
              return {val, cont: true};
            }, init).accum;
          };
        }
      },
      reduceDistance: {
        get: () => {
          return (center, radius, f, init, ctx) => {
            return iterateDistance(center, radius, (accum, value, position, row, col, i, id) => {
              //var difference = p5.Vector.sub(position, center);
              var val = f.call(ctx, accum, value, position/*, difference*/, row, col, i, id);
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
            return iterateNeighborhood(position, range, (accum, value, position, row, col, i, id) => {
              var val = f.call(ctx, value, position, row, col, i, id);
              return {val: accum || val, cont: !val};
            }, false).accum;
          };
        }
      },
      kNearest: {
        get: () => {
          return (id, k, options) => {
            var center = index[id];
            var centerCell = grid[center.row + 1].cells[center.col + 1];
            var nearest = [];
            function checkCell(cell, options) {
              var dists = cell.entities
                .filter(entity => entity.id != center.id && (!options || !options.filter || options.filter(entity)))
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
            checkCell(centerCell, options);
            for (var level = 0; level < 10; level++) {
              var shiftX = cellWidth * (level - 1);
              var shiftY = cellHeight * (level - 1);
              var levelDistXN = shiftX + center.offset.x;
              var levelDistXP = shiftX + cellWidth - center.offset.x;
              var levelDistYN = shiftY + center.offset.y;
              var levelDistYP = shiftY + cellHeight - center.offset.y;
              var levelDist = lib.min(
                lib.min(levelDistXN, levelDistXP),
                lib.min(levelDistYN, levelDistYP)
              );
              if (
                nearest.length < k ||
                (nearest.length > 0 &&
                  levelDist < nearest[nearest.length - 1].dist)
              ) {
                var neighberCell = (i, j) => {
                  var col = lib.min(lib.max(center.col + i, -1), xCells);
                  var row = lib.min(lib.max(center.row + j, -1), yCells);
                  var cell = grid[row + 1].cells[col + 1];
                  if (cell.entities.length == 0) {
                    return;
                  }
                  if (nearest.length == k && nearest[k - 1].dist < minCellDist(cell, center.position)) {
                    return;
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
