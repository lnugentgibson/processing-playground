var resolution = 1024;

var ice;

var camera, zoom;

$(() => {
  $("#button").click(() => {
    console.log("#button.click()");
    ice = new Ice(6, 16);
  });
});

function setup() {
  createCanvas(resolution, resolution);
  //frameRate(24);
  ice = new Ice(6, /* numBases */ 16);
  camera = createVector(width / 2, height / 2);
  zoom = 1;
}

var clicks = [];

function draw() {
  push();
  scale(zoom);
  translate(-camera.x, -camera.y);
  translate(width / 2 / zoom, height / 2 / zoom);
  background(0);
  ice.draw();
  ice.update();
  /*
  stroke('red');
  strokeWeight(3);
  line(camera.x - 5, camera.y, camera.x + 5, camera.y);
  line(camera.x, camera.y - 5, camera.x, camera.y + 5);
  //*/
  pop();
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
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(NORMAL);
  text(`camera: ${camera.x}, ${camera.y}`, 5, 5);
  text(`zoom: ${zoom}`, 5, 20);
  //*/
  clicks.forEach(click => {
    noFill();
    stroke(255, 255, 255, map(click.frames, 60, 0, 255, 0));
    strokeWeight(2);
    ellipseMode();
    var r = map(click.frames, 60, 0, click.minRadius, click.maxRadius);
    ellipse(click.position.x, click.position.y, r, r);
    click.frames = click.frames - 1;
  });
  clicks = clicks.filter(click => click.frames);
}

function mouseWheel(event) {
  if(false) {
    zoom = max(zoom - event.delta / 1000, 0.1);
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
}

var lastX = null, lastY = null;

function mousePressed() {
  lastX = mouseX;
  lastY = mouseY;
  return false;
}

function mouseClicked() {
  clicks.push({
    position: createVector(mouseX, mouseY),
    maxFrames: 60,
    frames: 60,
    minRadius: 16,
    maxRadius: 256,
  });
  if(mouseButton == LEFT) {
    var target = createVector(camera.x + (mouseX - width / 2) / zoom, camera.y + (mouseY - height / 2) / zoom);
    ice.setTarget(target);
  }
  return false;
}

function mouseDragged() {
  if(mouseButton == CENTER) {
    camera.x -= (mouseX - lastX) / zoom;
    camera.y -= (mouseY - lastY) / zoom;
    lastX = mouseX;
    lastY = mouseY;
  }
  return false;
}
