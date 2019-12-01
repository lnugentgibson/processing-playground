class Segment {
  Link a;
  Link b;
  float l;
  private float w = 8;
  Segment(Link _a, Link _b) {
    a = _a;
    b = _b;
    PVector d = PVector.sub(b.p, a.p);
    l = d.mag();
    _a.a.add(this);
    _b.b.add(this);
  }
  void constrainPosition() {
    PVector _a = a.p_staging;
    PVector _b = b.p_staging;
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
    _a = PVector.sub(c, h);
    _b = PVector.add(c, h);
    a.p_staging = _a;
    b.p_staging = _b;
  }
  void constrainVelocity() {
    PVector _a = a.p_staging;
    PVector _b = b.p_staging;
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
    PVector u = PVector.sub(_b, _a);
    u.normalize();
    float v1 = a.v_staging.dot(u);
    float v2 = b.v_staging.dot(u);
    PVector dv = PVector.mult(u, (v2 - v1) / 2);
    a.v_staging.add(dv);
    b.v_staging.sub(dv);
  }
  void draw() {
    draw(new PVector(0, 0));
  }
  void draw(PVector offset) {
    ellipseMode(RADIUS);
    stroke(255);
    strokeCap(ROUND);
    strokeWeight(w);
    /*
    if(a.p.x < 0 || b.p.x < 0) {
      if(a.p.y < 0 || b.p.y < 0) {
        line(a.p.x, a.p.y + height, b.p.x, b.p.y + height);
        line(a.p.x + width, a.p.y + height, b.p.x + width, b.p.y + height);
      } else if((height - a.p.y) < 0 || (height - b.p.y) < 0) {
        line(a.p.x, a.p.y - height, b.p.x, b.p.y - height);
        line(a.p.x + width, a.p.y - height, b.p.x + width, b.p.y - height);
      }
      line(a.p.x, a.p.y, b.p.x, b.p.y);
      line(a.p.x + width, a.p.y, b.p.x + width, b.p.y);
    } else if((width - a.p.x) < 0 || (width - b.p.x) < 0) {
      if(a.p.y < 0 || b.p.y < 0) {
        line(a.p.x, a.p.y + height, b.p.x, b.p.y + height);
        line(a.p.x - width, a.p.y + height, b.p.x - width, b.p.y + height);
      } else if((height - a.p.y) < 0 || (height - b.p.y) < 0) {
        line(a.p.x, a.p.y - height, b.p.x, b.p.y - height);
        line(a.p.x - width, a.p.y - height, b.p.x - width, b.p.y - height);
      }
      line(a.p.x, a.p.y, b.p.x, b.p.y);
      line(a.p.x - width, a.p.y, b.p.x - width, b.p.y);
    } else {
      if(a.p.y < 0 || b.p.y < 0) {
        line(a.p.x, a.p.y + height, b.p.x, b.p.y + height);
      } else if((height - a.p.y) < 0 || (height - b.p.y) < 0) {
        line(a.p.x, a.p.y - height, b.p.x, b.p.y - height);
      }
      line(a.p.x, a.p.y, b.p.x, b.p.y);
    }
    //*/
    line(a.p.x + offset.x, a.p.y + offset.y, b.p.x + offset.x, b.p.y + offset.y);
  }
  Rectangle bounds() {
    return a.bounds(w / 2).container(b.bounds(w / 2));
  }
}
