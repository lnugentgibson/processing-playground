class Ships {
  constructor(lib, players) {
    var grid = new Grid(lib, lib.width, lib.height, 32, 32);
    var ships = [];
    players.forEach(player => {
      var center = lib.createVector(lib.random(lib.width), lib.random(lib.height));
      var range = lib.random(256) + 256;
      _.times(64, () => {
        var r = lib.random(1);
        r *= r * range;
        var angle = lib.random(lib.TWO_PI);
        var velocity = lib.createVector(lib.random(2) - 1, lib.random(2) - 1);
        velocity.setMag(4);
        var id = grid.push({
          player,
          velocity,
        }, p5.Vector.add(center, lib.createVector(r * lib.cos(angle), r * lib.sin(angle))));
        ships[id] = new Ship(lib, grid, id);
      });
    });
    Object.defineProperties(this, {
      lib: {
        get: () => lib,
      },
      draw: {
        get: () => {
          return () => {
            ships.forEach(ship => {
              ship.draw();
            });
          };
        },
      },
      update: {
        get: () => {
          return (bases) => {
            ships.forEach(ship => {
              ship.update(bases);
            });
          };
        },
      },
    });
  }
}
