class Ship {
  constructor(lib, grid, id) {
    Object.defineProperties(this, {
    });
  }
  draw() {
    let {lib, grid, id} = this;
    let {bird, position} = grid.get(id);
    let {flock, velocity} = bird;
    velocity = velocity.copy();
    velocity.normalize();
    p.push();
    p.noStroke();
    p.fill(flock.color);
    p.translate(position.x, position.y);
    var perpendicular = p.createVector(velocity.y, -velocity.x);
    p.quad(
      r4 * velocity.x, r4 * velocity.y,
      r2 * perpendicular.x, r2 * perpendicular.y,
      -r1 * velocity.x, -r1 * velocity.y,
      -r2 * perpendicular.x, -r2 * perpendicular.y
    );
    if(true) {
      var threshold = r4;
      if(position.x < threshold) {
        p.quad(
          p.width + r4 * velocity.x, r4 * velocity.y,
          p.width + r2 * perpendicular.x, r2 * perpendicular.y,
          p.width - r1 * velocity.x, -r1 * velocity.y,
          p.width - r2 * perpendicular.x, -r2 * perpendicular.y
        );
        if(position.y < threshold) {
          p.quad(
            p.width + r4 * velocity.x, p.height + r4 * velocity.y,
            p.width + r2 * perpendicular.x, p.height + r2 * perpendicular.y,
            p.width - r1 * velocity.x, p.height - r1 * velocity.y,
            p.width - r2 * perpendicular.x, p.height - r2 * perpendicular.y
          );
        }
        else if(position.y > p.height - threshold) {
          p.quad(
            p.width + r4 * velocity.x, -p.height + r4 * velocity.y,
            p.width + r2 * perpendicular.x, -p.height + r2 * perpendicular.y,
            p.width - r1 * velocity.x, -p.height - r1 * velocity.y,
            p.width - r2 * perpendicular.x, -p.height - r2 * perpendicular.y
          );
        }
      }
      else if(position.x > p.width - threshold) {
        p.quad(
          -p.width + r4 * velocity.x, r4 * velocity.y,
          -p.width + r2 * perpendicular.x, r2 * perpendicular.y,
          -p.width - r1 * velocity.x, -r1 * velocity.y,
          -p.width - r2 * perpendicular.x, -r2 * perpendicular.y
        );
        if(position.y < threshold) {
          p.quad(
            -p.width + r4 * velocity.x, p.height + r4 * velocity.y,
            -p.width + r2 * perpendicular.x, p.height + r2 * perpendicular.y,
            -p.width - r1 * velocity.x, p.height - r1 * velocity.y,
            -p.width - r2 * perpendicular.x, p.height - r2 * perpendicular.y
          );
        }
        else if(position.y > p.height - threshold) {
          p.quad(
            -p.width + r4 * velocity.x, -p.height + r4 * velocity.y,
            -p.width + r2 * perpendicular.x, -p.height + r2 * perpendicular.y,
            -p.width - r1 * velocity.x, -p.height - r1 * velocity.y,
            -p.width - r2 * perpendicular.x, -p.height - r2 * perpendicular.y
          );
        }
      }
      else {
        if(position.y < threshold) {
          p.quad(
            r4 * velocity.x, p.height + r4 * velocity.y,
            r2 * perpendicular.x, p.height + r2 * perpendicular.y,
            -r1 * velocity.x, p.height - r1 * velocity.y,
            -r2 * perpendicular.x, p.height - r2 * perpendicular.y
          );
        }
        else if(position.y > p.height - threshold) {
          p.quad(
            r4 * velocity.x, -p.height + r4 * velocity.y,
            r2 * perpendicular.x, -p.height + r2 * perpendicular.y,
            -r1 * velocity.x, -p.height - r1 * velocity.y,
            -r2 * perpendicular.x, -p.height - r2 * perpendicular.y
          );
        }
      }
    }
    p.pop();
    //if(!i) {
    //  console.log({bird, position});
    //}
  }
}
