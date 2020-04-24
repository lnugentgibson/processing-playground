/*global PoissonDiscSampling*/
/*global Grid*/
/*global Bases*/

class Ice {
  constructor(lib, numPlayers, numBases) {
    var players = _.times(numPlayers, (i) => {
      var player = {
        id: i,
        control: 'random',
      };
      return player;
    });
    ["red", "green", "blue", "orange", "yellow", "purple"].forEach((c, i) => {
      players[i].color = c;
    });
    players[0].control = 'user';
    
    var baseGrid = PoissonDiscSampling(lib, 128, 10, 2);
    var d = baseGrid
      .map((v, p, row, col, i, id) => {
        let { x, y } = p;
        x *= 2;
        y *= 2;
        var d = x < lib.width ? x : 2 * lib.width - x;
        d = lib.min(d, y < lib.height ? y : 2 * lib.height - y);
        return {
          d,
          id
        };
      })
      .sort((a, b) => a.d - b.d);
    if (baseGrid.length > numBases) {
      d.slice(0, baseGrid.length - numBases).forEach((p) => {
        if(!baseGrid.remove(p.id)) {
          console.error(`unable to remove base with id ${p.id}`);
          console.error(d);
        }
      });
    }
    var bases = new Bases(lib, baseGrid);
    players.forEach(player => {
      var base = bases.unownedBase();
      base.owner = player;
    });
    
    /*
    var shipGrid = new Grid(lib, lib.width, lib.height, 16, 16);
    bases.forEachBase(base => {
      var owner = base.owner;
      _.times(8, i => {
        var angle = i * lib.TWO_PI / 8;
        shipGrid.push({
          base,
          owner,
          angle,
          state: 'orbit',
        }, lib.createVector(base.position.x + 24 * lib.cos(angle), base.position.y + 24 * lib.sin(angle)));
      });
    });
    //*/
    var ships = new Ships(lib, players);
    
    Object.defineProperties(this, {
      draw: {
        get: () => {
          return () => {
            bases.draw();
            ships.draw();
            /*
            shipGrid.forEach((ship, position) => {
              let {
                owner,
                angle,
              } = ship;
              lib.noStroke();
              if (owner == undefined) {
                lib.fill(255);
              } else {
                lib.fill(owner.color);
              }
              lib.push();
              lib.translate(position.x, position.y);
              lib.rotate(angle);
              lib.quad(4, 0, 0, 2, -2, 0, 0, -2);
              lib.pop();
            });
            //*/
          };
        },
      },
      update: {
        get: () => {
          return () => {
            bases.update();
            ships.update();
            /*
            var ids = shipGrid.ids;
            var updateShip = id => {
              var ship = shipGrid.getValue(id);
              let {
                base,
                angle,
                state,
                target,
                direction,
                end,
              } = ship;
              var v = 0.5;
              var position = shipGrid.getPosition(id);
              if(state == 'orbit') {
                ship.angle = angle = angle + v / 24;
                position = p5.Vector.add(base.position, lib.createVector(24 * lib.cos(angle), 24 * lib.sin(angle)));
                shipGrid.updatePosition(id, position);
              }
              else if(state == 'flyby') {
                ship.angle = angle = angle + direction * v / 24;
                position = p5.Vector.add(base.position, lib.createVector(24 * lib.cos(angle), 24 * lib.sin(angle)));
                shipGrid.updatePosition(id, position);
                if((end - angle) * direction < 0) {
                  ship.state = 'move';
                }
              }
              else if(state == 'move') {
                var diff = p5.Vector.sub(target, position);
                ship.angle = angle = diff.heading();
                var shift = lib.createVector(v * lib.cos(angle), v * lib.sin(angle));
                position.add(shift);
                shipGrid.updatePosition(id, position);
              }
            };
            ids.forEach(id => {
              updateShip(id);
            });
            //*/
          };
        },
      },
      setTarget: {
        get: () => {
          return target => {
            players.forEach(player => {
              if(player.control != 'user') {
                return;
              }
              shipGrid.forEach((ship, position) => {
                let {
                  base,
                  owner,
                  angle,
                  state,
                } = ship;
                if(owner != player) {
                  return;
                }
                if(state == 'orbit') {
                  var diff = p5.Vector.sub(target, position);
                  var dir = diff.copy();
                  dir.normalize();
                  var head = lib.createVector(lib.cos(angle), lib.sin(angle));
                  if(dir.dot(head) > 0) {
                    ship.state = 'move';
                    ship.target = target;
                  }
                  else {
                    ship.state = 'flyby';
                    var radius = p5.Vector.sub(position, base.position);
                    var d = dir.dot(radius);
                    radius.x -= d * dir.x;
                    radius.y -= d * dir.y;
                    ship.target = target;
                    ship.end = radius.heading();
                    var ad = (lib.TWO_PI - ship.end - angle) % lib.TWO_PI;
                    if(ad > lib.PI) {
                      ad -= lib.TWO_PI;
                    }
                    ship.direction = ad > 0 ? 1 : -1;
                  }
                }
                else if(state == 'move' || state == 'idle') {
                  ship.state = 'move';
                  ship.target = target;
                }
              });
            });
          };
        },
      },
    });
  }
}
