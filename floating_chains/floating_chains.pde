class Link {
  PVector p;
}

class Segment {
  Link a;
  Link b;
  float l;
  Segment(Link _a, Link _b) {
    a = _a;
    b = _b;
    PVector d = PVector.sub(b.p, a.p);
    l = d.mag();
  }
  void draw() {
    ellipseMode(RADIUS);
    fill(255);
    stroke(0);
    strokeWeight(1);
    ellipse(a.p.x, a.p.y, 4, 4);
    ellipse(b.p.x, b.p.y, 4, 4);
    noStroke();
    ellipse(a.p.x, a.p.y, 4, 4);
    ellipse(b.p.x, b.p.y, 4, 4);
    strokeWeight(8);
    line(a.p.x, a.p.y, b.p.x, b.p.y);
  }
}

class Structure {
  ArrayList<Link> links;
  ArrayList<Segment> segments;
}

class Field {
  float spacing;
  PVector[][] grid;
  int W, H;
  Field(float _spacing) {
    spacing = _spacing;
    W = (int) (width / spacing);
    H = (int) (height / spacing);
    grid = new PVector[H][W];
    for(int r = 0; r < H; r++)
      for(int c = 0; c < W; c++) {
        float a = random(2 * PI);
        grid[r][c] = new PVector(cos(a), sin(a));
      }
  }
  void smooth(float f) {
    PVector[][] smoothed = new PVector[H][W];
    for(int r = 0; r < H; r++)
      for(int c = 0; c < W; c++) {
        PVector v = new PVector(0, 0);
        for(int i = -1; i < 2; i++)
          for(int j = -1; j < 2; j++) {
            int _r = r + i < 0 ? r + i + H : (r + i > H - 1 ? r + i - H : r + i);
            int _c = c + j < 0 ? c + j + W : (c + j > W - 1 ? c + j - W : c + j);
            v.add(grid[_r][_c]);
          }
        v.mult(1. / 9);
        v.mult(f).add(PVector.mult(grid[r][c], 1 - f));
        smoothed[r][c] = v;
      }
  }
  void draw(int minor) {
    for(int r = 0; r < H; r++)
      for(int c = 0; c < W; c++) {
        float x = spacing * (c + 0.5);
        float y = spacing * (r + 0.5);
        PVector v = grid[r][c];
        stroke(255, 0, 0);
        strokeWeight(1);
        line(x, y, x + 8 * v.x, y + 8 * v.y);
        fill(255, 0, 0);
        noStroke();
        ellipseMode(RADIUS);
        ellipse(x, y, 2, 2);
        for(int i = 0; i <= minor; i++)
          for(int j = i == 0 ? 1 : 0; j <= minor; j++) {
            float _x = x + spacing * j / (minor + 1.);
            if(_x > width) {
              _x -= width;
            }
            float _y = y + spacing * i / (minor + 1.);
            if(_y > height) {
              _y -= height;
            }
            PVector _v = force(new PVector(_x, _y));
            stroke(255, 128, 0);
            strokeWeight(1);
            line(_x, _y, _x + 8 * _v.x, _y + 8 * _v.y);
            fill(255, 128, 0);
            noStroke();
            ellipseMode(RADIUS);
            ellipse(_x, _y, 1, 1);
          }
      }
  }
  PVector force(PVector p) {
    int r = (int) floor(p.y / spacing);
    int c = (int) floor(p.x / spacing);
    PVector b = new PVector(c * spacing, r * spacing);
    PVector f = PVector.sub(p, b).mult(1 / spacing);
    f.sub(new PVector(0.5, 0.5));
    if(f.x < 0) {
      c--;
      b = new PVector(c * spacing, r * spacing);
      f.x = f.x + 1;
    }
    if(f.y < 0) {
      r--;
      b = new PVector(c * spacing, r * spacing);
      f.y = f.y + 1;
    }
    PVector v = new PVector(0, 0);
    for(int i = 0; i < 2; i++)
      for(int j = 0; j < 2; j++) {
        int _i = r + i;
        if(_i < 0) {
          _i += H;
        }
        if(_i >= H) {
          _i -= H;
        }
        int _j = c + j;
        if(_j < 0) {
          _j += W;
        }
        if(_j >= W) {
          _j -= W;
        }
        v.add(PVector.mult(grid[_i][_j], (i == 0 ? 1 - f.y : f.y) * (j == 0 ? 1 - f.x : f.x)));
      }
    return v;
  }
}

Field field;

void setup() {
  size(512, 512);
  field = new Field(80);
  field.smooth(0);
}

void draw() {
  background(0);
  /*
  fill(255);
  noStroke();
  ellipseMode(RADIUS);
  ellipse(width / 2, height / 2, 25, 25);
  //*/
  field.draw(7);
}
