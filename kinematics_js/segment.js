class SegmentChain {
  constructor() {
    this.length = 0;
  }
  pushHead(l_, a_, x_, y_) {
    if (!this.length) {
      this.head = this.tail = new Segment(x_, y_, undefined, undefined, l_, a_);
      this.length = 1;
    } else {
      this.head = new Segment(x_, y_, undefined, this.head, l_, a_);
      this.length = this.length + 1;
    }
  }
  pushTail(l_, a_, x_, y_) {
    if (!this.length) {
      this.head = this.tail = new Segment(x_, y_, undefined, undefined, l_, a_);
      this.length = 1;
    } else {
      this.tail = new Segment(x_, y_, this.tail, undefined, l_, a_);
      this.length = this.length + 1;
    }
  }
  followBack(v, anchor) {
    if (this.length) {
      this.tail.followBack(v, anchor);
    }
  }
  followFore(v, anchor) {
    if (this.length) {
      this.head.followFore(v, anchor);
    }
  }
  drawBack(f) {
    if (this.length) {
      this.tail.drawBack(f, 0, this.length);
    }
  }
  drawFore(f) {
    this.draw();
    if (this.child != undefined) {
      this.child.drawFore();
    }
  }
}

class Segment {
  constructor(x_, y_, p_, c_, l_, a_) {
    if (p_ != undefined) {
      this.start = p.end;
    } else {
      this.start = createVector(x_, y_);
    }
    if (p_ != undefined) {
      this.parent = p_;
      p_.child = this;
    }
    if (c_ != undefined) {
      this.child = c_;
      c_.parent = this;
    }
    this.length = l_;
    this.angle = a_ || 0;
    Object.defineProperties(this, {
    end: 
      {
      get: 
        () => {
          return p5.Vector.add(this.start, p5.Vector.mult(createVector(cos(this.angle), sin(this.angle)), this.length));
        },
      },
    }
    );
  }
  translateStart(v) {
    this.start = v;
    if (this.child != undefined) {
      this.child.translateStart(this.end);
    }
  }
  translateEnd(v) {
    this.start = p5.Vector.sub(v, createVector(this.length * cos(this.angle), this.length * sin(this.angle)));
    if (this.parent != undefined) {
      this.parent.translateEnd(this.start);
    }
  }
  followBack(v, anchor) {
    var d = p5.Vector.sub(v, this.start);
    this.angle = d.heading();
    d.setMag(-this.length);
    this.start = p5.Vector.add(v, d);
    if (this.parent != undefined) {
      this.parent.followBack(this.start, anchor);
    } else if (anchor != undefined) {
      this.translateStart(anchor);
    }
  }
  followFore(v, anchor) {
    var d = p5.Vector.sub(v, this.end);
    this.angle = d.heading() + PI;
    this.start = v.copy();
    if (this.child != undefined) {
      this.child.followFore(this.end, anchor);
    } else if (anchor != undefined) {
      this.translateEnd(anchor);
    }
  }
  draw(f, i, c) {
    var start = this.start;
    var end = this.end;
    if (f) {
      f(start.copy(), end.copy(), i, c);
    } else {
      stroke(255);
      line(start.x, start.y, end.x, end.y);
    }
  }
  drawBack(f, i, c) {
    this.draw(f, i, c);
    if (this.parent != undefined) {
      this.parent.drawBack(f, i + 1, c);
    }
  }
  drawFore(f, i, c) {
    this.draw(f, i, c);
    if (this.child != undefined) {
      this.child.drawFore(f, i + 1, c);
    }
  }
  drawBoth() {
    this.draw();
    if (this.parent != undefined) {
      this.parent.drawBack();
    }
    if (this.child != undefined) {
      this.child.drawFore();
    }
  }
}
