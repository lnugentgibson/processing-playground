class Link {
  float m;
  PVector p, p_staging;
  PVector v, v_staging;
  ArrayList<Segment> a;
  ArrayList<Segment> b;
  final float r = 2;
  Link(PVector _p, PVector _v) {
    p = _p;
    v = _v;
    m = 1;
    a = new ArrayList<Segment>();
    b = new ArrayList<Segment>();
  }
  ArrayList<Link> getNeighbors() {
    ArrayList<Link> neighbors = new ArrayList<Link>();
    for(Segment segment : a) {
      neighbors.add(segment.b);
    }
    for(Segment segment : b) {
      neighbors.add(segment.a);
    }
    return neighbors;
  }
  Link(PVector _p) {
    this(_p, new PVector(0, 0));
  }
  void draw() {
    draw(new PVector(0, 0));
  }
  void draw(PVector offset) {
    ellipseMode(RADIUS);
    fill(255);
    stroke(0);
    strokeWeight(2);
    float x = p.x + offset.x;
    float y = p.y + offset.y;
    if(x < 0) {
      x = x % width + width;
    }
    if(x >= width) {
      x = x % width;
    }
    if(y < 0) {
      y = y % height + height;
    }
    if(y >= height) {
      y = y % height;
    }
    ellipse(x, y, r, r);
    /*
    stroke(0, 255, 0);
    line(x, y, x + 8 * v.x, y + 8 * v.y);
    for(Segment segment : a) {
      PVector u = PVector.sub(segment.b.p, p);
      u.normalize();
      PVector _v = PVector.mult(u, u.dot(v));
      stroke(0, 255, 255);
      line(x, y, x + 8 * _v.x, y + 8 * _v.y);
    }
    for(Segment segment : b) {
      PVector u = PVector.sub(p, segment.a.p);
      u.normalize();
      PVector _v = PVector.mult(u, u.dot(v));
      stroke(0, 255, 255);
      line(x, y, x + 8 * _v.x, y + 8 * _v.y);
    }
    //*/
  }
  PVector react(PVector f) {
    return f.copy();
  }
  void updatePosition(float delta) {
    boolean debug = false;
    if(debug) { System.out.println("updatePosition"); }
    if(debug) { System.out.println(delta); }
    if(debug) { System.out.println(v); }
    if(debug) { System.out.println(p); }
    p_staging = PVector.add(p, PVector.mult(v, delta));
    if(debug) { System.out.println(p_staging); }
  }
  void updateVelocity(PVector exf, float delta) {
    boolean debug = false;
    if(debug) { System.out.println("updateVelocity"); }
    if(debug) { System.out.println(exf); }
    if(debug) { System.out.println(delta); }
    PVector f = react(exf);
    if(debug) { System.out.println(f); }
    PVector a = PVector.mult(f, 1 / m);
    if(debug) { System.out.println(a); }
    if(debug) { System.out.println(v); }
    PVector _v = PVector.sub(p_staging, p);
    _v.mult(1 / delta);
    _v = v;
    if(debug) { System.out.println(_v); }
    v_staging = PVector.add(PVector.mult(_v, 0.9), PVector.mult(a, delta));
    if(debug) { System.out.println(v_staging); }
  }
  void update() {
    p = p_staging;
    v = v_staging;
  }
  Rectangle bounds() {
    return bounds(r);
  }
  Rectangle bounds(float r) {
    return new Rectangle(p.x - r, p.y - r, 2 * r, 2 * r);
  }
}
