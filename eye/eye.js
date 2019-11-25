class Particle {
  constructor(p, v, a, ss, se, cs, ce, l) {
    Object.assign(this, {
      p, v, a, ss, se, cs, ce, l,
    });
    this.age = 0;
  }
  update() {
    let {
      p, v, a, l
    } = this;
    p.add(v);
    v.add(a);
    this.l = l - 1;
  }
  draw() {
    let {
      p, ss, se, cs, ce, l, age
    } = this;
    ellipseMode(RADIUS);
    var s = map(age, 0, l, ss, se);
    var r = map(age, 0, l, cs.x, ce.x);
    var g = map(age, 0, l, cs.y, ce.y);
    var b = map(age, 0, l, cs.z, ce.z);
    noStroke();
    fill(r, g, b);
    ellipse(p.x, p.y, s, s);
  }
  alive() {
    return this.age < this.l;
  }
}

var particles = [];
var num = 2048;
var c;

function generate() {
  var p = createVector(random(width), random(height));
  
  var r = p5.Vector.sub(p, c);
  var u = r.copy();
  u.normalize();
  var i = createVector(1, 0);
  var I = createVector(-1, 0);
  var j = createVector(0, 1);
  var J = createVector(0, -1);
  
  var pupilCenter = 900;
  var pupilRadius = sqrt(10) * 300;
  var pc1 = createVector(c.x - pupilCenter, c.y);
  var pc2 = createVector(c.x + pupilCenter, c.y);
  var pr1 = p5.Vector.sub(p, pc1);
  var pu1 = pr1.copy(); pu1.normalize();
  var pr2 = p5.Vector.sub(p, pc2);
  var pu2 = pr2.copy(); pu2.normalize();
  var pa1 = acos(pu1.dot(i));
  var pa2 = acos(pu2.dot(I));
  var pn1 = pupilRadius * map(pa1, 0, PI / 4, 0.99, 0.95);
  var px1 = pupilRadius * map(pa1, 0, PI / 4, 1.01, 1.05);
  var pn2 = pupilRadius * map(pa2, 0, PI / 4, 0.99, 0.95);
  var px2 = pupilRadius * map(pa2, 0, PI / 4, 1.01, 1.05);
  var pupilWeight1 = map(
    constrain(pr1.mag(), pn1, px1),
    pn1,
    px1,
    1,
    0
  );
  var pupilWeight2 = map(
    constrain(pr2.mag(), pn2, px2),
    pn2,
    px2,
    1,
    0
  );
  var pupilWeight = min(pupilWeight1, pupilWeight2);
  
  var irisSize = 300;
  var irisWeight = map(
    constrain(r.mag(), irisSize * 0.8, irisSize * 1.2),
    irisSize * 0.8,
    irisSize * 1.2,
    1,
    0
  );
  
  var lidCenter = 400;
  var lidOpen = 250;
  var lidRadius = lidCenter + lidOpen;
  var hc1 = createVector(c.x, c.y - lidCenter);
  var hc2 = createVector(c.x, c.y + lidCenter);
  var hr1 = p5.Vector.sub(p, hc1);
  var hu1 = hr1.copy(); hu1.normalize();
  var hr2 = p5.Vector.sub(p, hc2);
  var hu2 = hr2.copy(); hu2.normalize();
  var ha1 = acos(hu1.dot(j));
  var ha2 = acos(hu2.dot(J));
  var hn1 = lidRadius * map(ha1, 0, PI / 4, 0.95, 0.9);
  var hx1 = lidRadius * map(ha1, 0, PI / 4, 1.05, 1.1);
  var hn2 = lidRadius * map(ha2, 0, PI / 4, 0.95, 0.9);
  var hx2 = lidRadius * map(ha2, 0, PI / 4, 1.05, 1.1);
  var schleraWeight1 = map(
    constrain(hr1.mag(), hn1, hx1),
    hn1,
    hx1,
    1,
    0
  );
  var schleraWeight2 = map(
    constrain(hr2.mag(), hn2, hx2),
    hn2,
    hx2,
    1,
    0
  );
  var schleraWeight = min(schleraWeight1, schleraWeight2);
  
  var otherWeight = 1 - schleraWeight;
  irisWeight *= schleraWeight;
  schleraWeight = map(irisWeight, 0, 1, schleraWeight, 0);
  pupilWeight *= irisWeight;
  //pupilWeight = 0;
  irisWeight = map(pupilWeight, 0, 1, irisWeight, 0);
  
  var weight = pupilWeight + irisWeight + schleraWeight + otherWeight;
  pupilWeight /= weight;
  irisWeight /= weight;
  schleraWeight /= weight;
  otherWeight /= weight;
    
  var pt = createVector(random(-15, 15), random(-15, 15));
  pt.normalize();
  pt.add(c);
  var pv = p5.Vector.sub(pt, p);
  pv.mult(0.05);
  pv.add(createVector(random(-0.5, 0.5), random(-0.5, 0.5)));
  var pa = p5.Vector.add(p5.Vector.sub(c, pt), createVector(random(-0.05, 0.05), random(-0.05, 0.05)));
  var pc = createVector(
    random(255),
    0,
    0
  );
  
  var iv = p5.Vector.mult(u, random(1, 2));
  iv.add(createVector(random(-0.5, 0.5), random(-0.5, 0.5)));
  var ia = createVector(random(-0.05, 0.05), random(-0.05, 0.05));
  var igs = random(
    map(r.mag(), 0, irisSize, 200, 0),
    map(r.mag(), 0, irisSize, 255, 0)
  );
  var ige = igs - random(50, 100);
  var ics = createVector(igs, igs, igs);
  var ice = createVector(ige, ige, ige);
    
  var st = createVector(c.x + (r.x > 0 ? 1 : -1) * (sqrt(5) * 200 + 100), c.y);
  var sv = p5.Vector.sub(st, p);
  sv.mult(0.02);
  sv.add(createVector(random(-0.5, 0.5), random(-0.5, 0.5)));
  var sa = p5.Vector.add(r.y > 0 ? J : j, createVector(random(-0.05, 0.05), random(-0.05, 0.05)));
  var sc = createVector(
    random(240, 255),
    map(min(ha1, ha2), 0, PI / 6, 255, 150) + random(-30, 30),
    0
  );
  
  var ov = createVector(random(-2, 2), random(-2, 2));
  var oa = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
  var ocs = createVector(
    random(50, 100),
    random(50),
    random(50)
  );
  ocs.mult(map(max(300, Math.hypot(r.x / 2, r.y)), 500, 1000, 1, 0));
  var oce = p5.Vector.mult(ocs, 0.25);
  
  var v = p5.Vector.add(p5.Vector.add(p5.Vector.mult(pv, pupilWeight), p5.Vector.mult(iv, irisWeight)), p5.Vector.add(p5.Vector.mult(sv, schleraWeight), p5.Vector.mult(ov, otherWeight)));
  var a = p5.Vector.add(p5.Vector.add(p5.Vector.mult(pa, pupilWeight), p5.Vector.mult(ia, irisWeight)), p5.Vector.add(p5.Vector.mult(sa, schleraWeight), p5.Vector.mult(oa, otherWeight)));
  var cs = p5.Vector.add(p5.Vector.add(p5.Vector.mult(pc, pupilWeight), p5.Vector.mult(ics, irisWeight)), p5.Vector.add(p5.Vector.mult(sc, schleraWeight), p5.Vector.mult(ocs, otherWeight)));
  var ce = p5.Vector.add(p5.Vector.add(p5.Vector.mult(pc, pupilWeight), p5.Vector.mult(ice, irisWeight)), p5.Vector.add(p5.Vector.mult(sc, schleraWeight), p5.Vector.mult(oce, otherWeight)));
  
  return new Particle(
    p,
    v,
    a,
    1,
    0.1,
    cs,
    ce,
    random(5, 20)
  );
}

function setup() {
  createCanvas(2048, 2048);
  colorMode(255, 255, 255, 100);
  c = createVector(width / 2, height / 2);
  for(var i = 0; i < num; i++) {
    particles.push(generate());
  }
  background(0);
}


function draw() {
  //background(0, 1);
  particles = particles.map((particle) => {
    particle.draw();
    particle.update();
    return particle.alive() ? particle : generate();
  });
}
