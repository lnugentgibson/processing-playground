<<<<<<< HEAD
let {
  PI
} 
= Math;

var jellies = [];
var num = 32;

function setup() {
  createCanvas(3 * 512, 1024);
  colorMode(HSB, 360, 100, 100, 100);
  for (var i = 0; i < num; i++) {
    jellies.push(new Jelly((2 * (random(2) - 1) + 216.92), (20 * (random(2) - 1) + 94.55), (10 * (random(2) - 1) + 43.14), 100, width, height, width / 8, 50, 100, 2.5, 32));
  }
  background(19.35, 60.78, 100);
}

function draw() {
  fill(19.35, 60.78, 100, 25);
  noStroke();
  rect(0, 0, width, height);
  jellies.forEach(jelly => {
    jelly.draw();
    jelly.update();
  }
  );
}
=======
let {
  PI
} 
= Math;

var jellies = [];
var num = 32;

function setup() {
  createCanvas(3 * 512, 1024);
  colorMode(HSB, 360, 100, 100, 100);
  for (var i = 0; i < num; i++) {
    jellies.push(new Jelly((2 * (random(2) - 1) + 216.92), (20 * (random(2) - 1) + 94.55), (10 * (random(2) - 1) + 43.14), 100, width, height, width / 8, 50, 100, 2.5, 32));
  }
  background(19.35, 60.78, 100);
}

function draw() {
  fill(19.35, 60.78, 100, 25);
  noStroke();
  rect(0, 0, width, height);
  jellies.forEach(jelly => {
    jelly.draw();
    jelly.update();
  }
  );
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
