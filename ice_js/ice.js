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
    
    var ships = new Ships(lib, players);
    
    Object.defineProperties(this, {
      draw: {
        get: () => {
          return () => {
            bases.draw();
            ships.draw();
          };
        },
      },
      update: {
        get: () => {
          return () => {
            bases.update();
            ships.update(bases);
            players.forEach(player => {
              if(player.control == 'random') {
                player.target = lib.createVector(lib.random(lib.width), lib.random(lib.height));
              }
            });
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
              player.target = target;
            });
          };
        },
      },
    });
  }
}
