<<<<<<< HEAD
final int N = 256;
final int scale = 4;

PGraphics buffer1;
PGraphics buffer2;

void swap() {
  PGraphics t = buffer1;
  buffer1 = buffer2;
  buffer2 = t;
}

void settings() {
  size(N * scale, N * scale);
}

void setup() {
  buffer1 = createGraphics(N, N);
  buffer2 = createGraphics(N, N);
}

void mousePressed() {
  buffer1.beginDraw();
  buffer1.noStroke();
  buffer1.fill(255);
  buffer1.circle(mouseX / scale, mouseY / scale, 16);
  buffer1.endDraw();
}

void mouseDragged() {
  buffer1.beginDraw();
  buffer1.noStroke();
  buffer1.fill(255);
  buffer1.circle(mouseX / scale, mouseY / scale, 16);
  buffer1.endDraw();
}

int shift = 0;
void draw() {
  buffer1.beginDraw();
  buffer1.loadPixels();
  buffer2.beginDraw();
  buffer2.loadPixels();
  for(int i = 0; i < N; i++)
    for(int j = 0; j < N - 1; j++) {
      float b = brightness(buffer1.pixels[j*N+i]);
      b = 0;
      float f = 4;
      if(j < N - 2)
        b += brightness(buffer1.pixels[(j+2)*N+i]);
      else
        f = 3;
      b += brightness(buffer1.pixels[j*N+i]);
      b += brightness(buffer1.pixels[(j+1)*N+((i + 1) % N)]);
      b += brightness(buffer1.pixels[(j+1)*N+((i + N - 1) % N)]);
      b /= f;
      float fn = 0;
      f = 1;
      for(int k = 0; k < 3; k++) {
        noiseDetail(k + 1);
        fn += noise(i * .125, (j+shift*(1 + k * .4)) * .125, millis() / 1000. + k * .3) * f;
        f /= 2;
      }
      fn = constrain((fn - 3./8)*32, 0, 1024);
      buffer2.pixels[j*N+i] = color(b - fn);
    }
  buffer2.updatePixels();
  buffer2.endDraw();
  buffer1.endDraw();
  swap();
  buffer1.beginDraw();
  buffer1.stroke(255);
  buffer1.line(0, N - 1, N - 1, N - 1);
  buffer1.noStroke();
  buffer1.fill(255);
  buffer1.circle(N / 2, N / 2, 64);
  buffer1.endDraw();
  background(0);
  image(buffer1, 0, 0, N * scale, N * scale);
  shift++;
}
=======
final int N = 256;
final int scale = 4;

PGraphics buffer1;
PGraphics buffer2;

void swap() {
  PGraphics t = buffer1;
  buffer1 = buffer2;
  buffer2 = t;
}

void settings() {
  size(N * scale, N * scale);
}

void setup() {
  buffer1 = createGraphics(N, N);
  buffer2 = createGraphics(N, N);
}

void mousePressed() {
  buffer1.beginDraw();
  buffer1.noStroke();
  buffer1.fill(255);
  buffer1.circle(mouseX / scale, mouseY / scale, 16);
  buffer1.endDraw();
}

void mouseDragged() {
  buffer1.beginDraw();
  buffer1.noStroke();
  buffer1.fill(255);
  buffer1.circle(mouseX / scale, mouseY / scale, 16);
  buffer1.endDraw();
}

int shift = 0;
void draw() {
  buffer1.beginDraw();
  buffer1.loadPixels();
  buffer2.beginDraw();
  buffer2.loadPixels();
  for(int i = 0; i < N; i++)
    for(int j = 0; j < N - 1; j++) {
      float b = brightness(buffer1.pixels[j*N+i]);
      b = 0;
      float f = 4;
      if(j < N - 2)
        b += brightness(buffer1.pixels[(j+2)*N+i]);
      else
        f = 3;
      b += brightness(buffer1.pixels[j*N+i]);
      b += brightness(buffer1.pixels[(j+1)*N+((i + 1) % N)]);
      b += brightness(buffer1.pixels[(j+1)*N+((i + N - 1) % N)]);
      b /= f;
      float fn = 0;
      f = 1;
      for(int k = 0; k < 3; k++) {
        noiseDetail(k + 1);
        fn += noise(i * .125, (j+shift*(1 + k * .4)) * .125, millis() / 1000. + k * .3) * f;
        f /= 2;
      }
      fn = constrain((fn - 3./8)*32, 0, 1024);
      buffer2.pixels[j*N+i] = color(b - fn);
    }
  buffer2.updatePixels();
  buffer2.endDraw();
  buffer1.endDraw();
  swap();
  buffer1.beginDraw();
  buffer1.stroke(255);
  buffer1.line(0, N - 1, N - 1, N - 1);
  buffer1.noStroke();
  buffer1.fill(255);
  buffer1.circle(N / 2, N / 2, 64);
  buffer1.endDraw();
  background(0);
  image(buffer1, 0, 0, N * scale, N * scale);
  shift++;
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
