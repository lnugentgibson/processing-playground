class Ship {
  constructor(lib, grid, id) {
    Object.defineProperties(this, {
      lib: {
        get: () => lib,
      },
      grid: {
        get: () => grid,
      },
      //bird: {
      //  get: () => grid.getValue(id),
      //  set: v => grid.updateValue(id, v),
      //},
      position: {
        get: () => grid.getPosition(id),
        set: v => grid.updatePosition(id, v),
      },
      player: {
        get: () => grid.getValue(id).player,
      },
      velocity: {
        get: () => grid.getValue(id).velocity,
        set: v => {
          var value = grid.getValue(id);
          value.velocity = v;
          grid.updateValue(id, value);
        },
      },
      cell: {
        get: () => {
          var val = grid.getEntity(id);
          return {
            row: val.row,
            col: val.col,
          };
        },
      },
    });
  }
  draw() {
    let {lib, position, player, velocity} = this;
    var r1 = 1.5, r2 = 2 * r1, r4 = 4 * r1, r8 = 6 * r1;
    velocity = velocity.copy();
    velocity.normalize();
    lib.push();
    lib.translate(position.x, position.y);
    var perpendicular = lib.createVector(velocity.y, -velocity.x);
    lib.noStroke();
    if(false) {
    let {grid, cell} = this;
    let {row, col} = cell;
    var v = lib.map(row, 0, grid.rows, 0, 255), s = lib.map(col, 0, grid.cols, 0, v), g = lib.map(col, 0, grid.cols, 0, 255);
    lib.fill(s, g, v);
    lib.quad(
      r8 * velocity.x, r8 * velocity.y,
      r4 * perpendicular.x, r4 * perpendicular.y,
      -r2 * velocity.x, -r2 * velocity.y,
      -r4 * perpendicular.x, -r4 * perpendicular.y
    );
    }
    lib.fill(player.color);
    if(true) {
    lib.quad(
      r4 * velocity.x, r4 * velocity.y,
      r2 * perpendicular.x, r2 * perpendicular.y,
      -r1 * velocity.x, -r1 * velocity.y,
      -r2 * perpendicular.x, -r2 * perpendicular.y
    );
    if(true) {
      var threshold = r4;
      if(position.x < threshold) {
        lib.quad(
          lib.width + r4 * velocity.x, r4 * velocity.y,
          lib.width + r2 * perpendicular.x, r2 * perpendicular.y,
          lib.width - r1 * velocity.x, -r1 * velocity.y,
          lib.width - r2 * perpendicular.x, -r2 * perpendicular.y
        );
        if(position.y < threshold) {
          lib.quad(
            lib.width + r4 * velocity.x, lib.height + r4 * velocity.y,
            lib.width + r2 * perpendicular.x, lib.height + r2 * perpendicular.y,
            lib.width - r1 * velocity.x, lib.height - r1 * velocity.y,
            lib.width - r2 * perpendicular.x, lib.height - r2 * perpendicular.y
          );
        }
        else if(position.y > lib.height - threshold) {
          lib.quad(
            lib.width + r4 * velocity.x, -lib.height + r4 * velocity.y,
            lib.width + r2 * perpendicular.x, -lib.height + r2 * perpendicular.y,
            lib.width - r1 * velocity.x, -lib.height - r1 * velocity.y,
            lib.width - r2 * perpendicular.x, -lib.height - r2 * perpendicular.y
          );
        }
      }
      else if(position.x > lib.width - threshold) {
        lib.quad(
          -lib.width + r4 * velocity.x, r4 * velocity.y,
          -lib.width + r2 * perpendicular.x, r2 * perpendicular.y,
          -lib.width - r1 * velocity.x, -r1 * velocity.y,
          -lib.width - r2 * perpendicular.x, -r2 * perpendicular.y
        );
        if(position.y < threshold) {
          lib.quad(
            -lib.width + r4 * velocity.x, lib.height + r4 * velocity.y,
            -lib.width + r2 * perpendicular.x, lib.height + r2 * perpendicular.y,
            -lib.width - r1 * velocity.x, lib.height - r1 * velocity.y,
            -lib.width - r2 * perpendicular.x, lib.height - r2 * perpendicular.y
          );
        }
        else if(position.y > lib.height - threshold) {
          lib.quad(
            -lib.width + r4 * velocity.x, -lib.height + r4 * velocity.y,
            -lib.width + r2 * perpendicular.x, -lib.height + r2 * perpendicular.y,
            -lib.width - r1 * velocity.x, -lib.height - r1 * velocity.y,
            -lib.width - r2 * perpendicular.x, -lib.height - r2 * perpendicular.y
          );
        }
      }
      else {
        if(position.y < threshold) {
          lib.quad(
            r4 * velocity.x, lib.height + r4 * velocity.y,
            r2 * perpendicular.x, lib.height + r2 * perpendicular.y,
            -r1 * velocity.x, lib.height - r1 * velocity.y,
            -r2 * perpendicular.x, lib.height - r2 * perpendicular.y
          );
        }
        else if(position.y > lib.height - threshold) {
          lib.quad(
            r4 * velocity.x, -lib.height + r4 * velocity.y,
            r2 * perpendicular.x, -lib.height + r2 * perpendicular.y,
            -r1 * velocity.x, -lib.height - r1 * velocity.y,
            -r2 * perpendicular.x, -lib.height - r2 * perpendicular.y
          );
        }
      }
    }
    }
    lib.pop();
  }
  update(bases) {
    let {lib, grid, id, player, position, velocity: oVelocity} = this;
    var velocity = oVelocity.copy();
    
    // Drag
    var dragForce = 0.02;
    var drag = oVelocity.copy();
    drag.mult(-dragForce);
    velocity.add(drag);
    
    // Thrust
    var thrustTarget = 8;
    var thrustForce = 1;
    var thrustMax = 10;
    var thrust = oVelocity.copy();
    if(thrust.mag() < thrustTarget) {
      thrust.setMag(thrustForce * (thrustTarget - thrust.mag()));
      if(thrust.mag() > thrustMax) {
        thrust.setMag(thrustMax);
      }
      velocity.add(thrust);
    }
    
    // Separation
    var separationRadius = 32;
    var separationForce = 0.2;
    var separationMax = 5;
    var separation = grid.reduceDistance(position, separationRadius, (force, sValue, sPosition, row, col, i, sId) => {
      if(sId == id) {
        return force;
      }
      var difference = p5.Vector.sub(sPosition, position);
      var distance = difference.mag();
      if(distance < 0.0001) {
        return force;
      }
      difference.setMag(-separationForce / (distance * distance));
      force.add(difference);
      return force;
    }, lib.createVector(0, 0));
    if(separation.mag() > separationMax) {
      separation.setMag(separationMax);
    }
    velocity.add(separation);
    
    // Avoidance
    if(bases) {
      var avoidanceRadius = 128;
      var avoidanceForce = 0.2;
      var avoidanceMax = 2;
      var avoidance = bases.reduceDistance(position, avoidanceRadius, (force, vValue, vPosition, row, col, i, vId) => {
        var difference = p5.Vector.sub(vPosition, position);
        var distance = difference.mag() - 24;
        difference.setMag(-lib.map(distance, 0, avoidanceRadius, avoidanceForce, 0));
        force.add(difference);
        return force;
      }, lib.createVector(0, 0));
      if(avoidance.mag() > avoidanceMax) {
        avoidance.setMag(avoidanceMax);
      }
      velocity.add(avoidance);
    }
    
    // Alignment
    var alignmentRadius = 64;
    var alignmentForce = 0.02;
    var alignmentMax = 1;
    var alignmentTarget = grid.reduceDistance(position, alignmentRadius, (accum, aValue, aPosition, row, col, i, aId) => {
      if(aId == id) {
        return accum;
      }
      if(aValue.player.id != player.id) {
        return accum;
      }
      let {vector, weight} = accum;
      var difference = p5.Vector.sub(aPosition, position);
      var distance = difference.mag();
      let {velocity: aVelocity} = aValue;
      var dWeight = lib.map(distance, 0, alignmentRadius, 1, 0);
      //dWeight = 1;
      vector.add(p5.Vector.mult(aVelocity, dWeight));
      weight += dWeight;
      return {vector, weight};
    }, {vector: lib.createVector(0, 0), weight: 0});
    alignmentTarget = alignmentTarget.vector.div(alignmentTarget.weight);
    var alignment = p5.Vector.sub(alignmentTarget, oVelocity);
    alignment.mult(alignmentForce);
    if(alignment.mag() > alignmentMax) {
      alignment.setMag(alignmentMax);
    }
    velocity.add(alignment);
    
    // Cohesion
    var cohesionRadius = 128;
    var cohesionForce = 0.1;
    var cohesionMax = 5;
    var cohesionTarget = grid.reduceDistance(position, cohesionRadius, (accum, cValue, cPosition, row, col, i, cId) => {
      if(cId == id) {
        return accum;
      }
      if(cValue.player.id != player.id) {
        return accum;
      }
      let {mean, weight} = accum;
      var difference = p5.Vector.sub(cPosition, position);
      var distance = difference.mag();
      var dWeight = lib.map(distance, 0, cohesionRadius, 1, 0);
      dWeight = 1;
      mean.add(p5.Vector.mult(cPosition, dWeight));
      weight += dWeight;
      return {mean, weight};
    }, {mean: lib.createVector(0, 0), weight: 0});
    cohesionTarget = cohesionTarget.mean.div(cohesionTarget.weight);
    var cohesion = p5.Vector.sub(cohesionTarget, position);
    if(cohesion.mag() > cohesionMax) {
      cohesion.setMag(cohesionMax);
    }
    velocity.add(separation);
    
    this.velocity = velocity;
    var traversed = velocity.copy();
    traversed.mult(0.1);
    var npos = p5.Vector.add(position, traversed);
    if(true) {
      while(npos.x < 0) {
        npos.x += lib.width;
      }
      while(npos.x > lib.width) {
        npos.x -= lib.width;
      }
      while(npos.y < 0) {
        npos.y += lib.height;
      }
      while(npos.y > lib.height) {
        npos.y -= lib.height;
      }
    }
    this.position = npos;
  }
}
