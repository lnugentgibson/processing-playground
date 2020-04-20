/*global p5*/
/*global Grid*/

function PoissonDiscSampling(lib, r, k, n) {
  if(!lib) {
    lib = {
      /*global PI*/
      PI,
      /*global floor*/
      floor,
      /*global ceil*/
      ceil,
      /*global min*/
      min,
      /*global max*/
      max,
      /*global sqrt*/
      sqrt,
      /*global cos*/
      cos,
      /*global sin*/
      sin,
      /*global random*/
      random,
      /*global createVector*/
      createVector,
    };
    Object.defineProperties(lib, {
      /*global width*/
      width: {
        get: () => width,
      },
      /*global height*/
      height: {
        get: () => height,
      },
    });
  }
  
  var grid = new Grid(lib, lib.width, lib.height, lib.floor(r / lib.sqrt(n)));
  var initial = grid.push({active: true}, lib.createVector(lib.random(lib.width), lib.random(lib.height)));
  var active = [initial];
  while (active.length) {
    for (var iteration = 0; iteration < 20 && active.length; iteration++) {
      var activeIndex = lib.floor(lib.random(active.length));
      var currentIndex = active[activeIndex];
      var current = grid.getValue(currentIndex);
      var currentPosition = grid.getPosition(currentIndex);
      var added = 0;
      for (var i = 0; i < k; i++) {
        var a = lib.random(2 * lib.PI);
        var m = lib.random(r, 2 * r);
        var c = lib.createVector(m * lib.cos(a), m * lib.sin(a));
        c.add(currentPosition);
        if (c.x < 0 || c.x >= lib.width) {
          continue;
        }
        if (c.y < 0 || c.y >= lib.height) {
          continue;
        }
        if (
          grid.someNeighborhood(
            c,
            1,
            (v, p) => p5.Vector.sub(c, p).mag() < r
          )
        ) {
          continue;
        }
        active.push(grid.push({active: true}, c));
        added++;
      }
      if (!added) {
        current.active = false;
        active.splice(activeIndex, 1);
      }
    }
  }
  return grid;
}
