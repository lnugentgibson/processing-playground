Field field;
LinkedList<Structure> structures;

void setup() {
  size(512, 512);
  field = new Field(128);
  field.smooth(0.5);
  structures = new LinkedList<Structure>();
  for(int i = 0; i < 1; i++) {
    Structure structure = new Structure(field);
    /*
    float m = random(16, 64);
    Link a = structure.addLink(new PVector(
      random(2 * m, width - 2 * m), random(2 * m, height - 2 * m)));
    float t = random(2 * PI);
    PVector v = new PVector(m * cos(t), m * sin(t));
    v.add(a.p);
    Link b = structure.addLink(v);
    structure.addSegment();
    t = random(2 * PI);
    v = new PVector(m * cos(t), m * sin(t));
    v.add(b.p);
    Link c = structure.addLink(v);
    structure.addSegment(1, 2);
    t = random(2 * PI);
    v = new PVector(m * cos(t), m * sin(t));
    v.add(c.p);
    structure.addLink(v);
    structure.addSegment(2, 3);
    structure.addSegment(3, 0);
    */
    float m = random(16, 32);
    PVector c = new PVector(random(m, width - m), random(m, height - m));
    Link[] links = new Link[8];
    for(int j = 0; j < 8; j++) {
      float t = PI / 4 * j;
      PVector v = new PVector(m * cos(t), m * sin(t));
      v.add(c);
      links[j] = structure.addLink(v);
    }
    for(int j = 0; j < 8; j++) {
      structure.addSegment(j, (j + 1) % 8);
      structure.addSegment(j, (j + 2) % 8);
      structure.addSegment(j, (j + 3) % 8);
    }
    /*
    structure.addSegment(0, 4);
    structure.addSegment(3, 0);
    structure.addSegment(4, 7);
    structure.addSegment(1, 3);
    structure.addSegment(7, 5);
    //*/
    for(int l = 0; l < 5; l++) {
      for(int j = 0; j < 8; j++) {
        float t = PI / 4 * j;
        float M = (1 * (l + 1) + 1) * m;
        PVector v = new PVector(M * cos(t), M * sin(t));
        v.add(c);
        structure.addLink(v);
        structure.addSegment(j + l * 8, j + (l + 1) * 8);
      }
    }
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
