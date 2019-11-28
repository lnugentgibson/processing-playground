Field field;
LinkedList<Structure> structures;

void setup() {
  size(512, 512);
  field = new Field(128);
  field.smooth(0.5);
  structures = new LinkedList<Structure>();
  for(int i = 0; i < 1; i++) {
    Structure structure = new Structure(field);
    Link a = structure.addLink();
    float t = random(2 * PI);
    float m = random(8, 64);
    PVector v = new PVector(m * cos(t), m * sin(t));
    v.add(a.p);
    structure.addLink(v);
    structure.addSegment();
    structures.add(structure);
  }
}

boolean playing = true;

void draw() {
  background(0);
  /*
  fill(255);
  noStroke();
  ellipseMode(RADIUS);
  ellipse(width / 2, height / 2, 25, 25);
  //*/
  field.draw(7);
  for(Structure structure : structures) {
    structure.draw();
    if(playing) {
      structure.update();
    }
  }
}

void mouseClicked() {
  if (mouseButton == LEFT) {
    playing = !playing;
  } else if (mouseButton == RIGHT) {
    field = new Field(128);
    field.smooth(0.5);
    for(Structure structure : structures) {
      structure.field = field;
    }
  }
}
