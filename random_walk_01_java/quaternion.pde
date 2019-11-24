public Quaternion FromAxisAngle(float angle, PVector axis) {
  return new Quaternion(cos(angle / 2), PVector.mult(axis.normalize(), sin(angle / 2)));
}
class Quaternion {
  float r_;
  PVector v_;
  float x_;
  float y_;
  float z_;
  public Quaternion(float r, PVector v) {
    r_ = r;
    v_ = v;
    x_ = v.x;
    y_ = v.y;
    z_ = v.z;
  }
  public Quaternion conjugate() {
    //return new Quaternion(r_, new PVector(-x_, -y_, -z_));
    return new Quaternion(r_, PVector.mult(v_, -1));
  }
  public Quaternion product(Quaternion q) {
    float r1 = r_, r2 = q.r_;
    PVector v1 = v_, v2 = q.v_;
    return new Quaternion(r1 * r2 - v1.dot(v2), PVector.add(PVector.mult(v2, r1), PVector.add(PVector.mult(v1, r2), v1.cross(v2))));
  }
  public Quaternion product(PVector v) {
    float r1 = r_;
    PVector v1 = v_;
    return new Quaternion(-v1.dot(v), PVector.add(PVector.mult(v, r1), v1.cross(v)));
  }
  public PVector rotate(PVector v) {
    Quaternion qvq = product(v).product(conjugate());
    return qvq.v_;
  }
}
