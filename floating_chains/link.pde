class Link {
  float m;
  PVector p, p_staging;
  PVector v, v_staging;
  ArrayList<Segment> a;
  ArrayList<Segment> b;
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
    ellipseMode(RADIUS);
    fill(255);
    stroke(0);
    strokeWeight(2);
    ellipse(p.x, p.y, 2, 2);
    stroke(0, 255, 0);
    line(p.x, p.y, p.x + 8 * v.x, p.y + 8 * v.y);
    for(Segment segment : a) {
      PVector u = PVector.sub(segment.b.p, p);
      u.normalize();
      PVector _v = PVector.mult(u, u.dot(v));
      stroke(0, 255, 255);
      line(p.x, p.y, p.x + 8 * _v.x, p.y + 8 * _v.y);
    }
    for(Segment segment : b) {
      PVector u = PVector.sub(p, segment.a.p);
      u.normalize();
      PVector _v = PVector.mult(u, u.dot(v));
      stroke(0, 255, 255);
      line(p.x, p.y, p.x + 8 * _v.x, p.y + 8 * _v.y);
    }
  }
  PVector react(PVector f) {
    return f.copy();
  }
  void update(PVector exf, float delta) {
    boolean debug = false;
    if(debug) { System.out.println("update"); }
    if(debug) { System.out.println(exf); }
    if(debug) { System.out.println(delta); }
    PVector f = react(exf);
    if(debug) { System.out.println(f); }
    PVector a = PVector.mult(f, 1 / m);
    if(debug) { System.out.println(a); }
    if(debug) { System.out.println(v); }
    if(debug) { System.out.println(p); }
    v_staging = PVector.add(PVector.mult(v, 0.9), PVector.mult(a, delta));
    if(debug) { System.out.println(v_staging); }
    p_staging = PVector.add(p, PVector.mult(v, delta));
    if(debug) { System.out.println(p_staging); }
    if(p_staging.x >= width) {
      p_staging.x = p_staging.x % width;
    }
    if(p_staging.x < 0) {
      p_staging.x = p_staging.x % width + width;
    }
    if(p_staging.y >= height) {
      p_staging.y = p_staging.y % height;
    }
    if(p_staging.y < 0) {
      p_staging.y = p_staging.y % height + height;
    }
    if(debug) { System.out.println(p_staging); }
  }
  void update() {
    p = p_staging;
    v = v_staging;
  }
}
