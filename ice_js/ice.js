var players, ships;

class Ice {
  constructor(numPlayers, numBases) {
    var ships;
    var players = _.times(numPlayers, (i) => {
      var player = {
        id: i
      };
      return player;
    });
    ["red", "green", "blue", "orange", "yellow", "purple"].forEach((c, i) => {
      players[i].color = c;
    });
    
    var baseGrid = PoissonDiscSampling(128, 10, 2);
    var d = baseGrid
      .map((v, p, row, col, i, id) => {
        let { x, y } = p;
        x *= 2;
        y *= 2;
        var d = x < width ? x : 2 * width - x;
        d = min(d, y < height ? y : 2 * height - y);
        return {
          d,
          id
        };
      })
      .sort((a, b) => a.d - b.d);
    if (baseGrid.length > numBases) {
      d.slice(0, baseGrid.length - numBases).forEach((p) => {
        baseGrid.remove(p.id);
      });
    }
    var bases = new Bases(baseGrid);
    players.forEach(player => {
      var base = bases.unownedBase();
      base.owner = player;
    });
    
    var shipGrid = new Grid(width, height, 16, 16);
    bases.forEachBase(base => {
      var owner = base.owner;
      _.times(8, () => {
        shipGrid.push({
          owner,
          angle: random(360),
        }, createVector(random(width), random(height)));
      });
    });
    
    Object.defineProperties(this, {
      draw: {
        get: () => {
          return () => {
            bases.draw();
            shipGrid.forEach((ship, position) => {
              let {
                angle,
                owner,
              } = ship;
              noStroke();
              if (owner == undefined) {
                fill(255);
              } else {
                fill(owner.color);
              }
              push();
              translate(position.x, position.y);
              rotate(angle);
              quad(4, 0, 0, 2, -2, 0, 0, -2);
              pop();
            });
          };
        },
      },
      update: {
        get: () => {
          return () => {
            bases.update();
            shipGrid.ids().forEach(id => {
              var ship = shipGrid.getValue(id);
            });
          };
        },
      },
    });
  }
}