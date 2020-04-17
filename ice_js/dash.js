function dashedLine(p1, p2, dash, offset) {
  var len = dash.reduce(function(l, d) { return l + d; }, 0);
  var diff = p5.Vector.sub(p2, p1);
  var dist = diff.mag();
  var dir = diff.copy();
  dir.normalize();
  var i = -1;
  for(var p = offset - len; p < dist; p += dash[i]) {
    i = (i + 1) % dash.length;
    var q = min(p + dash[i], dist);
    var pt = max(p, 0);
    if(q < 0) { continue; }
    if(p > dist) { continue; }
    if(i % 2) { continue; }
    var P = dir.copy();
    P.setMag(pt);
    P.add(p1);
    var Q = dir.copy();
    Q.setMag(q);
    Q.add(p1);
    line(P.x, P.y, Q.x, Q.y);
  }
}
