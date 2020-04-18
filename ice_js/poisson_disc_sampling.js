function PoissonDiscSampling(r, k, n) {
  var grid = new Grid(width, height, floor(r / sqrt(n)));
  var initial = grid.push({active: true}, createVector(random(width), random(height)));
  var active = [initial];
  while (active.length) {
    for (var iteration = 0; iteration < 20 && active.length; iteration++) {
      var activeIndex = floor(random(active.length));
      var currentIndex = active[activeIndex];
      var current = grid.getValue(currentIndex);
      var currentPosition = grid.getPosition(currentIndex);
      var added = 0;
      for (var i = 0; i < k; i++) {
        var a = random(2 * PI);
        var m = random(r, 2 * r);
        var c = createVector(m * cos(a), m * sin(a));
        c.add(currentPosition);
        if (c.x < 0 || c.x >= width) {
          continue;
        }
        if (c.y < 0 || c.y >= height) {
          continue;
        }
        if (
          grid.someNeighborhood(
            c,
            1,
            (v, p) => dist(c.x, c.y, p.x, p.y) < r
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
