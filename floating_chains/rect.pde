class Rectangle {
  float x, y, w, h;
  Rectangle(float _x, float _y, float _w, float _h) {
    x = _x;
    y = _y;
    w = _w;
    h = _h;
  }
  Rectangle container(Rectangle r) {
    float nx = min(x, r.x);
    float ny = min(y, r.y);
    float xx = max(x + w, r.x + r.w);
    float xy = max(y + h, r.y + r.h);
    return new Rectangle(nx, ny, xx - nx, xy - ny);
  }
  boolean intersects(Rectangle r) {
    if(r.x >= x + w) {
      return false;
    }
    if(r.x + r.w <= x) {
      return false;
    }
    if(r.y >= y + h) {
      return false;
    }
    if(r.y + r.h <= y) {
      return false;
    }
    return true;
  }
}
