class Segment {
  Link a;
  Link b;
  float l;
  Segment(Link _a, Link _b) {
    a = _a;
    b = _b;
    PVector d = PVector.sub(b.p, a.p);
    l = d.mag();
  }
  void draw() {
    ellipseMode(RADIUS);
    fill(255);
    stroke(0);
    strokeWeight(1);
    ellipse(a.p.x, a.p.y, 4, 4);
    ellipse(b.p.x, b.p.y, 4, 4);
    noStroke();
    ellipse(a.p.x, a.p.y, 4, 4);
    ellipse(b.p.x, b.p.y, 4, 4);
    strokeWeight(8);
    line(a.p.x, a.p.y, b.p.x, b.p.y);
  }
}

class Structure {
  ArrayList<Link> links;
  ArrayList<Segment> segments;
  Field field;
  float delta;
  Structure(Field _field) {
    field = _field;
    delta = 1;
    links = new ArrayList<Link>();
    segments = new ArrayList<Segment>();
  }
  void addLink() {
    addLink(new PVector(random(width), random(height)));
  }
  void addLink(PVector p) {
    links.add(new Link(p));
  }
  void draw() {
    for(Link link : links) {
      link.draw();
    }
  }
  void update() {
    for(Link link : links) {
      link.update(field.force(link.p), delta);
    }
    for(Link link : links) {
      link.update();
    }
  }
}

Field field;
Structure structure;

void setup() {
  size(1024, 1024);
  field = new Field(128);
  field.smooth(0.5);
  structure = new Structure(field);
  for(int i = 0; i < 8; i++) {
    structure.addLink();
  }
}

//int i = 0;
void draw() {
  background(0);
  /*
  fill(255);
  noStroke();
  ellipseMode(RADIUS);
  ellipse(width / 2, height / 2, 25, 25);
  //*/
  field.draw(15);
  structure.draw();
  //if(i == 0) {
    structure.update();
  //}
  //i++;
}
