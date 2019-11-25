<<<<<<< HEAD
class Triangle {
  constructor(a_, b_, c_) {
    Object.assign(this, {
      a: a_.copy(),
      b: b_.copy(),
      c: c_.copy(),
    });
  }
  bounds(n) {
    let {
      a,
      b,
      c,
    } = this;
    var an = a.dot(n);
    var bn = b.dot(n);
    var cn = c.dot(n);
    return [
      min(min(an, bn), cn),
      (an + bn + cn) / 3,
      max(max(an, bn), cn),
    ];
  }
  draw(o, x, y, z, l) {
    let {
      a,
      b,
      c,
    } = this;
    var ab = p5.Vector.sub(b, a);
    var ac = p5.Vector.sub(c, a);
    var n = ab.cross(ac);
    n.normalize();
    var al = p5.Vector.sub(l, a);
    al.normalize();
    var s = abs(n.dot(al));
    var center = createVector(width / 2, height / 2, 0);
    var ap = Flatten(a, o, x, y, z);
    var bp = Flatten(b, o, x, y, z);
    var cp = Flatten(c, o, x, y, z);
    ap.add(center);
    bp.add(center);
    cp.add(center);
    fill(s * 255);
    triangle(ap.x, ap.y, bp.x, bp.y, cp.x, cp.y);
  }
}
=======
class Triangle {
  constructor(a_, b_, c_) {
    Object.assign(this, {
      a: a_.copy(),
      b: b_.copy(),
      c: c_.copy(),
    });
  }
  bounds(n) {
    let {
      a,
      b,
      c,
    } = this;
    var an = a.dot(n);
    var bn = b.dot(n);
    var cn = c.dot(n);
    return [
      min(min(an, bn), cn),
      (an + bn + cn) / 3,
      max(max(an, bn), cn),
    ];
  }
  draw(o, x, y, z, l) {
    let {
      a,
      b,
      c,
    } = this;
    var ab = p5.Vector.sub(b, a);
    var ac = p5.Vector.sub(c, a);
    var n = ab.cross(ac);
    n.normalize();
    var al = p5.Vector.sub(l, a);
    al.normalize();
    var s = abs(n.dot(al));
    var center = createVector(width / 2, height / 2, 0);
    var ap = Flatten(a, o, x, y, z);
    var bp = Flatten(b, o, x, y, z);
    var cp = Flatten(c, o, x, y, z);
    ap.add(center);
    bp.add(center);
    cp.add(center);
    fill(s * 255);
    triangle(ap.x, ap.y, bp.x, bp.y, cp.x, cp.y);
  }
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
