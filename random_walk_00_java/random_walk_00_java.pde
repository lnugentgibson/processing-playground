ArrayList<Jelly> jellies;
int num = 512;

class JellyStepGenerator extends RandomStepGenerator {
  private int w_, h_, position_buffer_;
  private float size_min_, size_max_, size_buffer_;
  public JellyStepGenerator(int w, int h, int position_buffer, float size_min, float size_max, float size_buffer) {
    super(4);
    w_ = w;
    h_ = h;
    position_buffer_ = position_buffer;
    size_min_ = size_min;
    size_max_ = size_max;
    size_buffer_ = size_buffer;
  }
  public Float[] step(Float[] current, RandomStepHint hint) {
    Float[] step = new Float[4];
    float position_range = 16;
    float size_range = 4;
    float angle_range = .5;
    float x_offset = 0;
    float y_offset = 0;
    float size_offset = 0;
    if (current[0] < position_buffer_)
      x_offset = map(current[0], 0, position_buffer_, position_range, 0);
    else if (w_ - current[0] < position_buffer_)
      x_offset = map(current[0], w_ -  position_buffer_, w_, 0, -position_range);
    if (current[1] < position_buffer_)
      y_offset = map(current[1], 0, position_buffer_, position_range, 0);
    else if (h_ - current[1] < position_buffer_)
      y_offset = map(current[1], h_ -  position_buffer_, h_, 0, -position_range);
    if (current[2] - size_min_ < size_buffer_)
      size_offset = map(current[2], size_min_, size_min_ + size_buffer_, size_range, 0);
    else if (size_max_ - current[2] < size_buffer_)
      size_offset = map(current[2], size_max_ -  size_buffer_, size_max_, 0, -size_range);
    step[0] = (random(2) - 1) * position_range + x_offset;
    step[1] = (random(2) - 1) * position_range + y_offset;
    step[2] = (random(2) - 1) * size_range + size_offset;
    step[3] = (random(2) - 1) * angle_range;
    return step;
  }
}

class Jelly {
  RandomWalker walker_;
  float r_, g_, b_, a_;
  public Jelly(float r, float g, float b, float a, int w, int h, int position_buffer, float size_min, float size_max, float size_buffer, int smoothing) {
    r_ = r;
    g_ = g;
    b_ = b;
    a_ = a;
    walker_ = new RandomWalker(4, w / 2, h / 2, new JellyStepGenerator(w, h, position_buffer, size_min, size_max, size_buffer), smoothing);
  }
  public void draw() {
    Float[] smooth = walker_.SmoothedPosition();
    ellipseMode(RADIUS);
    noFill();
    stroke(r_, g_, b_, a_);
    ellipse(smooth[0], smooth[1], smooth[2], smooth[2]);
    int n = 12;
    for(float t = 0; t < n; t++)
      line(
        smooth[0] + .9 * smooth[2] * cos(smooth[3] + 2 * PI * (t / n)),
        smooth[1] + .9 * smooth[2] * sin(smooth[3] + 2 * PI * (t / n)),
        smooth[0] + 1.1 * smooth[2] * cos(smooth[3] + 2 * PI * (t / n)),
        smooth[1] + 1.1 * smooth[2] * sin(smooth[3] + 2 * PI * (t / n))
      );
  }
  public void update() {
    walker_.step();
  }
}

void setup() {
  size(1024, 1024);
  //RandomStepGenerator steps = new CardinalStepGenerator(2);
  //RandomStepGenerator steps = new IndependentStepGenerator(2);
  //RandomStepGenerator steps = new JellyStepGenerator(width, height, 50, 10, 20, 5);
  //walker = new RandomWalker(4, width / 2, height / 2, steps , 32);
  colorMode(HSB, 360, 100, 100, 100);
  //num = 1;
  jellies = new ArrayList<Jelly>(num);
  for (int i = 0; i < num; i++)
    jellies.add(new Jelly((2 * (random(2) - 1) + 216.92), (20 * (random(2) - 1) + 94.55), (10 * (random(2) - 1) + 43.14), 100, width, height, width / 16, 10, 20, 2.5, 8));
  //jellies.add(new Jelly((2 * (random(2) - 1) + 216.92), (20 * (random(2) - 1) + 94.55), (10 * (random(2) - 1) + 43.14), 100, width, height, width / 16, 100, 100, 2.5, 8));
  background(216.92, 94.55, 43.14);
  background(286.67, 98.18, 43.14);
  background(19.35, 60.78, 100);
}

void draw() {
  //blendMode(BLEND);
  fill(216.92, 94.55, 43.14, 10);
  fill(286.67, 98.18, 43.14, 10);
  fill(19.35, 60.78, 100, 50);
  noStroke();
  rect(0, 0, width, height);
  //walker.drawLine();
  //walker.drawSmoothedPoint();
  //walker.step();
  //blendMode(SCREEN);
  //blendMode(MULTIPLY );
  for (Jelly jelly : jellies) {
    jelly.draw();
    jelly.update();
  }
}
