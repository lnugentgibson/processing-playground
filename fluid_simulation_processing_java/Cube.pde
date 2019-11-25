<<<<<<< HEAD
class Rect {
  
  public final int w, h;
  
  Rect(int N) {
    w = h = N;
  }
  
  Rect(int _w, int _h) {
    w = _w;
    h = _h;
  }
  
  int index(int x, int y) {
    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(x > w - 1) x = w - 1;
    if(y > h - 1) y = h - 1;
    return x + y * w;
  }
}

class Square extends Rect {
  
  public final int N;
  
  Square(int _N) {
    super(_N);
    N = _N;
  }
}

class Prism {
  
  public final int w, h, t;
  
  Prism(int N) {
    w = h = t = N;
  }
  
  Prism(int _w, int _h, int _t) {
    w = _w;
    h = _h;
    t = _t;
  }
  
  int index(int x, int y, int z) {
    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(z < 0) z = 0;
    if(x > w - 1) x = w - 1;
    if(y > h - 1) y = h - 1;
    if(z > t - 1) z = t - 1;
    return x + y * w + z * w * h;
  }
}

class Cube extends Prism {
  
  public final int N;
  
  Cube(int _N) {
    super(_N);
    N = _N;
  }
}
=======
class Rect {
  
  public final int w, h;
  
  Rect(int N) {
    w = h = N;
  }
  
  Rect(int _w, int _h) {
    w = _w;
    h = _h;
  }
  
  int index(int x, int y) {
    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(x > w - 1) x = w - 1;
    if(y > h - 1) y = h - 1;
    return x + y * w;
  }
}

class Square extends Rect {
  
  public final int N;
  
  Square(int _N) {
    super(_N);
    N = _N;
  }
}

class Prism {
  
  public final int w, h, t;
  
  Prism(int N) {
    w = h = t = N;
  }
  
  Prism(int _w, int _h, int _t) {
    w = _w;
    h = _h;
    t = _t;
  }
  
  int index(int x, int y, int z) {
    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(z < 0) z = 0;
    if(x > w - 1) x = w - 1;
    if(y > h - 1) y = h - 1;
    if(z > t - 1) z = t - 1;
    return x + y * w + z * w * h;
  }
}

class Cube extends Prism {
  
  public final int N;
  
  Cube(int _N) {
    super(_N);
    N = _N;
  }
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
