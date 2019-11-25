function GranSchmidt(x, y, z) {
  var X = x.copy();
  X.normalize();
  var Y = p5.Vector.sub(y, y.dot(X));
  Y.normalize();
  var Z = p5.Vector.sub(p5.Vector.sub(z, z.dot(X)), z.dot(Y));
  Z.normalize();
  return {
    x: X,
    y: Y,
    z: Z,
  };
}

function Flatten(v, o, x, y, z) {
  var p = p5.Vector.sub(v, o);
  return createVector(p.dot(x), p.dot(y), p.dot(z));
}
