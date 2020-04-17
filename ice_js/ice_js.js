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
  ice = new Ice(6, /* numBases */ 16);
  camera = createVector(width / 2, height / 2);
  zoom = 1;
}

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
}

function mouseWheel(event) {
  zoom -= event.delta / 500;
  return false;
}

var lastX = null, lastY = null;

function mousePressed() {
  lastX = mouseX;
  lastY = mouseY;
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
