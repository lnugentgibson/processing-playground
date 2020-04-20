class Base {
  constructor(lib, id, position) {
    if(!lib) {
      lib = {
        /*global TWO_PI*/
        TWO_PI,
        /*global RADIUS*/
        RADIUS,
        /*global SQUARE*/
        SQUARE,
        /*global CENTER*/
        CENTER,
        /*global NORMAL*/
        NORMAL,
        /*global floor*/
        floor,
        /*global min*/
        min,
        /*global random*/
        random,
        /*global map*/
        map,
        /*global noStroke*/
        noStroke,
        /*global stroke*/
        stroke,
        /*global strokeWeight*/
        strokeWeight,
        /*global strokeCap*/
        strokeCap,
        /*global noFill*/
        noFill,
        /*global fill*/
        fill,
        /*global rectMode*/
        rectMode,
        /*global ellipseMode*/
        ellipseMode,
        /*global square*/
        square,
        /*global ellipse*/
        ellipse,
        /*global arc*/
        arc,
        /*global textAlign*/
        textAlign,
        /*global textStyle*/
        textStyle,
        /*global textSize*/
        textSize,
        /*global text*/
        text,
        /*global translate*/
        translate,
        /*global rotate*/
        rotate,
        /*global push*/
        push,
        /*global pop*/
        pop,
      };
    }
    
    var owner;
    var health = 100;
    var angle = lib.random(lib.TWO_PI);
    var direction = lib.random(1) < 0.5;
    Object.defineProperties(this, {
      lib: {
        get: () => lib
      },
      id: {
        get: () => id
      },
      position: {
        get: () => position.copy()
      },
      owner: {
        get: () => owner,
        set: (v) => {
          owner = v;
        }
      },
      health: {
        get: () => health
      },
      angle: {
        get: () => angle
      },
      direction: {
        get: () => direction
      },
      update: {
        get: () => {
          return (n) => {
            if (n == undefined) {
              n = 1;
            }
            health = lib.min(100, health + n * 0.01);
            angle = angle + n * 0.01 * (direction ? 1 : -1);
          };
        }
      }
    });
  }
  draw() {
    let { lib, position, owner, health, angle } = this;
    if (owner == undefined) {
      lib.stroke(255);
    } else {
      lib.stroke(owner.color);
    }
    lib.push();
    lib.translate(position.x, position.y);
    lib.strokeWeight(5);
    lib.noFill();
    lib.ellipseMode(lib.RADIUS);
    lib.strokeCap(lib.SQUARE);
    if (health > 99.5) {
      lib.ellipse(0, 0, 32, 32);
    } else {
      lib.arc(0, 0, 32, 32, 0, lib.map(health, 0, 100, 0, TWO_PI));
    }
    lib.rotate(angle);
    lib.strokeWeight(2);
    lib.rectMode(lib.CENTER);
    lib.square(0, 0, 25);
    lib.noStroke();
    if (owner == undefined) {
      lib.fill(255);
    } else {
      lib.fill(owner.color);
    }
    lib.textAlign(lib.CENTER, lib.CENTER);
    lib.textSize(12);
    lib.textStyle(lib.NORMAL);
    lib.text(lib.floor(health), 0, 0);
    lib.pop();
  }
}
