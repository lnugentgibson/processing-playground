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
    while(f > 1) {
      smooth(1);
      f -= 1;
    }
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
        v.normalize();
        smoothed[r][c] = v;
      }
    grid = smoothed;
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
        if(minor > 0) {
          int n = minor + 1;
          int p = n / 2;
          for(int i = 0; i < n; i++)
            for(int j = 0; j < n; j++) {
              if(i == p && j == p) {
                continue;
              }
              float _x = x + spacing * (j - p) / n;
              if(_x > width) {
                _x -= width;
              }
              float _y = y + spacing * (i - p) / n;
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
          _i = _i % H + H;
        }
        if(_i >= H) {
          _i = _i % H;
        }
        int _j = c + j;
        if(_j < 0) {
          _j = _j % W + W;
        }
        if(_j >= W) {
          _j = _j % W;
        }
        v.add(PVector.mult(grid[_i][_j], (i == 0 ? 1 - f.y : f.y) * (j == 0 ? 1 - f.x : f.x)));
      }
    //v.normalize();
    return v;
  }
}
