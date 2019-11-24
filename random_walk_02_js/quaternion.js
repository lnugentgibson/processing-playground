function FromAxisAngle(angle, axis) {
  return new Quaternion(cos(angle / 2), p5.Vector.mult(axis.normalize(), sin(angle / 2)));
}
class Quaternion {
  constructor(r, v) {
    this.r = r;
    this.v = v;
  }
  conjugate() {
    return new Quaternion(this.r, p5.Vector.mult(this.v, -1));
  }
  productQ(q) {
    var r1 = this.r || 0, r2 = q.r || 0;
    var v1 = this.v, v2 = q.v;
    return new Quaternion(r1 * r2 - v1.dot(v2), p5.Vector.add(p5.Vector.mult(v2, r1), p5.Vector.add(p5.Vector.mult(v1, r2), v1.cross(v2))));
  }
  productV(v) {
    var r1 = this.r || 0;
    var v1 = this.v;
    return new Quaternion(-v1.dot(v), p5.Vector.add(p5.Vector.mult(v, r1), v1.cross(v)));
  }
  rotate(v) {
    var qvq = this.productV(v).productQ(this.conjugate());
    return qvq.v;
  }
}
