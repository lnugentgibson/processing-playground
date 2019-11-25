var segs;
//var velocity;
function setup() {
  createCanvas(1024, 1024);
  segs = new DriftingSegmentChain();
  for (var i = 0; i < 5; i++) {
    segs.pushHead(32, 0, random(width), random(height));
  }
  //velocity = createVector(0, 0);
}


function draw() {
  background(0);
  /*
  var hs = segs.head.start.copy();
  hs.add(velocity);
  segs.followFore(hs, segs.tail.end.copy());
  segs.followBack(createVector(mouseX, mouseY));
  var he = segs.head.start.copy();
  velocity.add(p5.Vector.sub(he, hs));
  velocity.mult(0.9);
  */
  segs.update(createVector(mouseX, mouseY), 0.5);
  segs.drawBack((s, e, i, c) => {
    stroke(
      255,
      map(i, 0, c, 0, 255),
      map(i, 0, c, 0, 255)
    );
    noFill();
    ellipseMode(RADIUS);
    if(i + 1 < c) {
      ellipse(s.x, s.y, 4, 4);
    }
    line(s.x, s.y, e.x, e.y);
  });
}
