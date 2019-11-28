class Segment {
  Link a;
  Link b;
  float l;
  Segment(Link _a, Link _b) {
    a = _a;
    b = _b;
    PVector d = PVector.sub(b.p, a.p);
    l = d.mag();
    _a.a.add(this);
    _b.b.add(this);
  }
  void constrain() {
    PVector _a = a.p;
    PVector _b = b.p;
    if(_a.x < 2 * l && width - _b.x < 2 * l) {
      _b.x = _b.x - width;
    }
    if(width - _a.x < 2 * l && _b.x < 2 * l) {
      _a.x = _a.x - width;
    }
    if(_a.y < 2 * l && height - _b.y < 2 * l) {
      _b.y = _b.y - height;
    }
    if(height - _a.y < 2 * l && _b.y < 2 * l) {
      _a.y = _a.y - height;
    }
    PVector h = PVector.sub(_b, _a);
    h.setMag(0.5 * l);
    PVector c = PVector.add(_b, _a);
    c.mult(0.5);
    a.p = PVector.sub(c, h);
    b.p = PVector.add(c, h);
    if(a.p.x < 0) {
      a.p.x = a.p.x + width;
    }
    if(a.p.y < 0) {
      a.p.y = a.p.y + height;
    }
    if(b.p.x < 0) {
      b.p.x = b.p.x + width;
    }
    if(b.p.y < 0) {
      b.p.y = b.p.y + height;
    }
    PVector u = PVector.sub(_b, _a);
    u.normalize();
    float v1 = a.v.dot(u);
    float v2 = b.v.dot(u);
    PVector dv = PVector.mult(u, (v2 - v1) / 2);
    a.v.add(dv);
    b.v.sub(dv);
  }
  void draw() {
    ellipseMode(RADIUS);
    stroke(255);
    strokeCap(ROUND);
    strokeWeight(8);
    if(a.p.x < 2 * l && width - b.p.x < 2 * l) {
      if(a.p.y < 2 * l && height - b.p.y < 2 * l) {
        line(a.p.x, a.p.y, b.p.x - width, b.p.y - height);
        line(a.p.x + width, a.p.y, b.p.x, b.p.y - height);
        line(a.p.x, a.p.y + height, b.p.x - width, b.p.y);
        line(a.p.x + width, a.p.y + height, b.p.x, b.p.y);
      } else if(height - a.p.y < 2 * l && b.p.y < 2 * l) {
        line(a.p.x, a.p.y - height, b.p.x - width, b.p.y);
        line(a.p.x + width, a.p.y - height, b.p.x, b.p.y);
        line(a.p.x, a.p.y, b.p.x - width, b.p.y + height);
        line(a.p.x + width, a.p.y, b.p.x, b.p.y + height);
      } else {
        line(a.p.x, a.p.y, b.p.x - width, b.p.y);
        line(a.p.x + width, a.p.y, b.p.x, b.p.y);
      }
    } else if(width - a.p.x < 2 * l && b.p.x < 2 * l) {
      if(a.p.y < 2 * l && height - b.p.y < 2 * l) {
        line(a.p.x - width, a.p.y, b.p.x, b.p.y - height);
        line(a.p.x, a.p.y, b.p.x + width, b.p.y - height);
        line(a.p.x - width, a.p.y + height, b.p.x, b.p.y);
        line(a.p.x, a.p.y + height, b.p.x + width, b.p.y);
      } else if(height - a.p.y < 2 * l && b.p.y < 2 * l) {
        line(a.p.x - width, a.p.y - height, b.p.x, b.p.y);
        line(a.p.x, a.p.y - height, b.p.x + width, b.p.y);
        line(a.p.x - width, a.p.y, b.p.x, b.p.y + height);
        line(a.p.x, a.p.y, b.p.x + width, b.p.y + height);
      } else {
        line(a.p.x - width, a.p.y, b.p.x, b.p.y);
        line(a.p.x, a.p.y, b.p.x + width, b.p.y);
      }
    } else {
      if(a.p.y < 2 * l && height - b.p.y < 2 * l) {
        line(a.p.x, a.p.y, b.p.x, b.p.y - height);
        line(a.p.x, a.p.y + height, b.p.x, b.p.y);
      } else if(height - a.p.y < 2 * l && b.p.y < 2 * l) {
        line(a.p.x, a.p.y - height, b.p.x, b.p.y);
        line(a.p.x, a.p.y, b.p.x, b.p.y + height);
      } else {
        line(a.p.x, a.p.y, b.p.x, b.p.y);
      }
    }
  }
}
