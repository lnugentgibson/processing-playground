<<<<<<< HEAD
final int N = 256;
final int scale = 4;
final int iterations = 4;

Fluid2d fluid2;
Fluid3d fluid3;

final int dim = 2;

void settings() {
  size(N * scale, N * scale);
}

void setup() {
  if (dim == 2) {
    fluid2 = new Fluid2d(N, .000, 0., .1);
    fluid2.max = 1000000;
  }
  else fluid3 = new Fluid3d(N, .000, 0., .1);
}

Float lastX = null, lastY = null;
void mouseDragged() {
  if (true) {
    float r = noise(mouseX / scale, mouseY / scale, millis() / 100.);
    float g = noise(mouseX / scale + N, mouseY / scale, millis() / 100.);
    float b = noise(mouseX / scale + 2 * N, mouseY / scale, millis() / 100.);
    //System.out.println("("+r+","+g+","+b+")");
    if (dim == 2) fluid2.AddDensity(mouseX / scale, mouseY / scale, 1000 * r, 1000 * g, 1000 * b);
    else fluid3.AddDensity(mouseX / scale, mouseY / scale, N / 2, 1000 * r, 1000 * g, 1000 * b);
  }
  if (lastX != null) {
    float dx = (mouseX - lastX) / scale;
    float dy = (mouseY - lastY) / scale;
    //System.out.println("Offset (" + dx + "," + dy + ")");
    if (dim == 2) fluid2.AddVelocity(mouseX / scale, mouseY / scale, dx, dy);
    else fluid3.AddVelocity(mouseX / scale, mouseY / scale, N / 2, dx, dy, 0);
  }
  lastX = new Float(mouseX);
  lastY = new Float(mouseY);
}

final float r = 4;
final int R = 16;
final float S = .125;
void draw() {
  if (mousePressed) {
    float r = noise(mouseX / scale, mouseY / scale, millis() / 100.);
    float g = noise(mouseX / scale + N, mouseY / scale, millis() / 100.);
    float b = noise(mouseX / scale + 2 * N, mouseY / scale, millis() / 100.);
    //System.out.println("("+r+","+g+","+b+")");
    if (dim == 2) fluid2.AddDensity(mouseX / scale, mouseY / scale, 1000 * r, 1000 * g, 1000 * b);
    else fluid3.AddDensity(mouseX / scale, mouseY / scale, N / 2, 1000 * r, 1000 * g, 1000 * b);
  }
  for (int i = N / 2 - R; i <= N / 2 + R; i++)
    for (int j = N / 2 - R; j <= N / 2 + R; j++) {
      int x = i - N / 2;
      int y = j - N / 2;
      int m2 = x * x + y * y;
      if(m2 > R * R) continue;
      float m = sqrt(m2);
      float s = m2 == 0 ? 0 : S / max(r, m);
      if (dim == 2) {
        float r = noise(i, j, millis() / 100.);
        float g = noise(i + N, j, millis() / 100.);
        float b = noise(i + 2 * N, j, millis() / 100.);
        float d = 1024 * (s - S / R);
        fluid2.AddDensity(i, j, d * r, d * g, d * b);
        float dx = noise(i - 2 * N, j, millis() / 100.) - .46875;
        float dy = noise(i - N, j, millis() / 100.) - .46875;
        float D = 8;
        //s = 0;
        fluid2.AddVelocity(i, j, dx * D + s * x, dy * D + s * y);
      }
      else {
        //for (int k = N / 2 - R; k <= N / + R; k++) {
          float r = noise(i, j, millis() / 100.);
          float g = noise(i + N, j, millis() / 100.);
          float b = noise(i + 2 * N, j, millis() / 100.);
          fluid3.AddDensity(i, j, N / 2, 1000 * r, 1000 * g, 1000 * b);
        //}
      }
    }
  background(0);
  if (dim == 2) {
    fluid2.render(scale);
    fluid2.Step();
  } else {
    fluid3.render(scale);
    fluid3.Step();
  }
}
=======
final int N = 256;
final int scale = 4;
final int iterations = 4;

Fluid2d fluid2;
Fluid3d fluid3;

final int dim = 2;

void settings() {
  size(N * scale, N * scale);
}

void setup() {
  if (dim == 2) {
    fluid2 = new Fluid2d(N, .000, 0., .1);
    fluid2.max = 1000000;
  }
  else fluid3 = new Fluid3d(N, .000, 0., .1);
}

Float lastX = null, lastY = null;
void mouseDragged() {
  if (true) {
    float r = noise(mouseX / scale, mouseY / scale, millis() / 100.);
    float g = noise(mouseX / scale + N, mouseY / scale, millis() / 100.);
    float b = noise(mouseX / scale + 2 * N, mouseY / scale, millis() / 100.);
    //System.out.println("("+r+","+g+","+b+")");
    if (dim == 2) fluid2.AddDensity(mouseX / scale, mouseY / scale, 1000 * r, 1000 * g, 1000 * b);
    else fluid3.AddDensity(mouseX / scale, mouseY / scale, N / 2, 1000 * r, 1000 * g, 1000 * b);
  }
  if (lastX != null) {
    float dx = (mouseX - lastX) / scale;
    float dy = (mouseY - lastY) / scale;
    //System.out.println("Offset (" + dx + "," + dy + ")");
    if (dim == 2) fluid2.AddVelocity(mouseX / scale, mouseY / scale, dx, dy);
    else fluid3.AddVelocity(mouseX / scale, mouseY / scale, N / 2, dx, dy, 0);
  }
  lastX = new Float(mouseX);
  lastY = new Float(mouseY);
}

final float r = 4;
final int R = 16;
final float S = .125;
void draw() {
  if (mousePressed) {
    float r = noise(mouseX / scale, mouseY / scale, millis() / 100.);
    float g = noise(mouseX / scale + N, mouseY / scale, millis() / 100.);
    float b = noise(mouseX / scale + 2 * N, mouseY / scale, millis() / 100.);
    //System.out.println("("+r+","+g+","+b+")");
    if (dim == 2) fluid2.AddDensity(mouseX / scale, mouseY / scale, 1000 * r, 1000 * g, 1000 * b);
    else fluid3.AddDensity(mouseX / scale, mouseY / scale, N / 2, 1000 * r, 1000 * g, 1000 * b);
  }
  for (int i = N / 2 - R; i <= N / 2 + R; i++)
    for (int j = N / 2 - R; j <= N / 2 + R; j++) {
      int x = i - N / 2;
      int y = j - N / 2;
      int m2 = x * x + y * y;
      if(m2 > R * R) continue;
      float m = sqrt(m2);
      float s = m2 == 0 ? 0 : S / max(r, m);
      if (dim == 2) {
        float r = noise(i, j, millis() / 100.);
        float g = noise(i + N, j, millis() / 100.);
        float b = noise(i + 2 * N, j, millis() / 100.);
        float d = 1024 * (s - S / R);
        fluid2.AddDensity(i, j, d * r, d * g, d * b);
        float dx = noise(i - 2 * N, j, millis() / 100.) - .46875;
        float dy = noise(i - N, j, millis() / 100.) - .46875;
        float D = 8;
        //s = 0;
        fluid2.AddVelocity(i, j, dx * D + s * x, dy * D + s * y);
      }
      else {
        //for (int k = N / 2 - R; k <= N / + R; k++) {
          float r = noise(i, j, millis() / 100.);
          float g = noise(i + N, j, millis() / 100.);
          float b = noise(i + 2 * N, j, millis() / 100.);
          fluid3.AddDensity(i, j, N / 2, 1000 * r, 1000 * g, 1000 * b);
        //}
      }
    }
  background(0);
  if (dim == 2) {
    fluid2.render(scale);
    fluid2.Step();
  } else {
    fluid3.render(scale);
    fluid3.Step();
  }
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
