var players, ships;

function setupGame(numBases) {
  var points = PoissonDiscSampling(128, 10, 2);
  var d = points
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
  if (points.length > numBases) {
    d.slice(0, points.length - numBases).forEach((p) => {
      points.remove(p.id);
    });
  }
  var bases = new Bases(points);
  players = _.times(6, (i) => {
    var b = bases.unownedBase();
    var player = {
      id: i
    };
    b.owner = player;
    return player;
  });
  ["red", "green", "blue", "orange", "yellow", "purple"].forEach((c, i) => {
    players[i].color = c;
  });

  return bases;
}
