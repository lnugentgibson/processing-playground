/*global $*/
/*global p5*/
/*global Ice*/

const ice_p5_def = ( p ) => {

  var resolution = 1024;
  
  var ice;
  
  var camera, zoom;

  $(() => {
    $("#button").click(() => {
      console.log("#button.click()");
      ice = new Ice(6, 16);
    });
  });

  p.setup = function() {
    p.createCanvas(resolution, resolution);
    //frameRate(24);
    ice = new Ice(p, 6, /* numBases */ 16);
    camera = p.createVector(p.width / 2, p.height / 2);
    zoom = 1;
  };

  var clicks = [];

  p.draw = function() {
    p.push();
    p.scale(zoom);
    p.translate(-camera.x, -camera.y);
    p.translate(p.width / 2 / zoom, p.height / 2 / zoom);
    p.background(0);
    ice.draw();
    ice.update();
    /*
    stroke('red');
    strokeWeight(3);
    line(camera.x - 5, camera.y, camera.x + 5, camera.y);
    line(camera.x, camera.y - 5, camera.x, camera.y + 5);
    //*/
    p.pop();
    /*
    stroke('gray');
    line(0,height/4,width,height/4);
    line(0,height/2,width,height/2);
    line(0,3*height/4,width,3*height/4);
    line(width/4,0,width/4,height);
    line(width/2,0,width/2,height);
    line(3*width/4,0,3*width/4,height);
    //*/
    //*
    p.noStroke();
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);
    p.textStyle(p.NORMAL);
    p.text(`camera: ${camera.x}, ${camera.y}`, 5, 5);
    p.text(`zoom: ${zoom}`, 5, 20);
    //*/
    clicks.forEach(click => {
      p.noFill();
      p.stroke(255, 255, 255, p.map(click.frames, 60, 0, 255, 0));
      p.strokeWeight(2);
      p.ellipseMode();
      var r = p.map(click.frames, 60, 0, click.minRadius, click.maxRadius);
      p.ellipse(click.position.x, click.position.y, r, r);
      click.frames = click.frames - 1;
    });
    clicks = clicks.filter(click => click.frames);
  };

  p.mouseWheel = function(event) {
    if(false) {
      zoom = p.max(zoom - event.delta / 1000, 0.1);
    }
    else {
      if(event.delta < 0) {
        zoom *= 0.875;
      }
      else {
        zoom *= 8.0 / 7;
      }
    }
    return false;
  };
  
  var lastX = null, lastY = null;
  
  p.mousePressed = function() {
    lastX = p.mouseX;
    lastY = p.mouseY;
    return false;
  };
  
  p.mouseClicked = function() {
    clicks.push({
      position: p.createVector(p.mouseX, p.mouseY),
      maxFrames: 60,
      frames: 60,
      minRadius: 16,
      maxRadius: 256,
    });
    if(p.mouseButton == p.LEFT) {
      var target = p.createVector(camera.x + (p.mouseX - p.width / 2) / zoom, camera.y + (p.mouseY - p.height / 2) / zoom);
      ice.setTarget(target);
    }
    return false;
  };
  
  p.mouseDragged = function() {
    if(p.mouseButton == p.CENTER) {
      camera.x -= (p.mouseX - lastX) / zoom;
      camera.y -= (p.mouseY - lastY) / zoom;
      lastX = p.mouseX;
      lastY = p.mouseY;
    }
    return false;
  };
};

const flock_p5_def = ( p ) => {
  var resolution = 1024;
  var grid;
  var flocks = [
  {
    color: 'red',
  },
  {
    color: 'green',
  },
  {
    color: 'yellow',
  },
  ];
  p.setup = function() {
    p.createCanvas(resolution, resolution);
    birds = new Grid(p, p.width, p.height, 32, 32);
    flocks.forEach(flock => {
      var center = p.createVector(p.random(p.width), p.random(p.height));
      var range = p.random(256) + 128;
      _.times(64, () => {
        var r = p.random(1);
        r *= r * range;
        var angle = p.random(p.TWO_PI);
        var velocity = p.createVector(p.random(2) - 1, p.random(2) - 1);
        velocity.setMag(4);
        birds.push({
          flock,
          velocity,
        }, p5.Vector.add(center, p.createVector(r * p.cos(angle), r * p.sin(angle))));
      });
    });
  };
  var i = 0;
  p.draw = function() {
    p.background(0);
    var r1 = 1, r2 = 2 * r1, r4 = 4 * r1;
    birds.forEach((bird, position) => {
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
    });
    i++;
    p.noStroke();
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);
    p.textStyle(p.NORMAL);
    p.text(`# birds: ${birds.length}`, 5, 5);
    birds.forEach((bird, position, i, j, k, id) => {
      let {velocity} = bird;
      var traversed = velocity.copy();
      traversed.mult(0.1);
      var npos = p5.Vector.add(position, traversed);
      if(true) {
        while(npos.x < 0) {
          npos.x += p.width;
        }
        while(npos.x > p.width) {
          npos.x -= p.width;
        }
        while(npos.y < 0) {
          npos.y += p.height;
        }
        while(npos.y > p.height) {
          npos.y -= p.height;
        }
      }
      birds.updatePosition(id, npos);
    });
  };
};

//* let ice_p5 = */ new p5(ice_p5_def);
/* let flock_p5 = */ new p5(flock_p5_def);
