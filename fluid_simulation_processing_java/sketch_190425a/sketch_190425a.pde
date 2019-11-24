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
      fn = constrain((fn - 3./8)*128, 0, 1024);
      buffer2.pixels[j*N+i] = color(b - fn);
    }
  buffer2.updatePixels();
  buffer2.endDraw();
  swap();
  for(int i = 0; i < N; i++)
    buffer1.pixels[(N-1)*N+i] = color(255);
  buffer1.updatePixels();
  buffer1.endDraw();
  buffer1.beginDraw();
  buffer1.noStroke();
  buffer1.fill(255);
  buffer1.circle(N / 2, N / 2, 64);
  buffer1.endDraw();
  background(0);
  image(buffer1, 0, 0, N * scale, N * scale);
  shift++;
}
