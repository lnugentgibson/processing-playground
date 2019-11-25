<<<<<<< HEAD
import java.util.Deque;
import java.util.Iterator;
import java.util.LinkedList;

class RandomStepHint {
  private int d_;
  private Float[] bias_;
  private Float[] shift_;
  private Float[] force_;
  public RandomStepHint(int d) {
    d_ = d;
    bias_ = new Float[d_];
    shift_ = new Float[d_];
    force_ = new Float[d_];
  }
  public int D() {
    return d_;
  }
  public RandomStepHint Bias(int i, float bias) {
    bias_[i] = bias;
    return this;
  }
  public RandomStepHint Bias(int i, Float bias) {
    bias_[i] = bias;
    return this;
  }
  public RandomStepHint Bias(Float[] bias) {
    for (int i = 0; i < d_; i++)
      bias_[i] = bias[i];
    return this;
  }
  public RandomStepHint Shift(int i, float shift) {
    shift_[i] = shift;
    return this;
  }
  public RandomStepHint Shift(int i, Float shift) {
    shift_[i] = shift;
    return this;
  }
  public RandomStepHint Shift(Float[] shift) {
    for (int i = 0; i < d_; i++)
      shift_[i] = shift[i];
    return this;
  }
  public RandomStepHint Force(int i, float force) {
    force_[i] = force;
    return this;
  }
  public RandomStepHint Force(int i, Float force) {
    force_[i] = force;
    return this;
  }
  public RandomStepHint Force(Float[] force) {
    for (int i = 0; i < d_; i++)
      force_[i] = force[i];
    return this;
  }
}

abstract class RandomStepGenerator {
  int d_;
  public RandomStepGenerator(int d) {
    d_ = d;
  }
  public int D() {
    return d_;
  }
  public abstract Float[] step(Float[] current, RandomStepHint hint);
}

class CardinalStepGenerator extends RandomStepGenerator {
  public CardinalStepGenerator(int d) {
    super(d);
  }
  public Float[] step(Float[] current, RandomStepHint hint) {
    int i = (int) floor(random(D()));
    int s = random(1) > .5 ? 1 : -1;
    Float[] step = new Float[D()];
    for (int j = 0; j < D(); j++)
      step[j] = new Float(i == j ? s : 0);
    return step;
  }
}

class IndependentStepGenerator extends RandomStepGenerator {
  public IndependentStepGenerator(int d) {
    super(d);
  }
  public Float[] step(Float[] current, RandomStepHint hint) {
    Float[] step = new Float[D()];
    for (int i = 0; i < D(); i++)
      step[i] = new Float(random(1) > .5 ? 1 : -1);
    return step;
  }
}

class RandomWalker {
  private int d_;
  private int smoothing_ = 1;
  private Deque<Float[]> previous_;
  private Float[] position_;
  private RandomStepGenerator step_generator_;
  public RandomWalker(int d, float x, float y, RandomStepGenerator step_generator, int smoothing) {
    d_ = d;
    smoothing_ = smoothing;
    if (step_generator.D() != d) throw new IllegalArgumentException();
    step_generator_ = step_generator;
    previous_ = new LinkedList<Float[]>();
    position_ = new Float[d_];
    position_[0] = x;
    position_[1] = y;
    for (int i = 2; i < d; i++) position_[i] = new Float(0);
  }
  public int D() {
    return d_;
  }
  public float Position(int i) {
    return position_[i];
  }
  public Float[] SmoothedPosition() {
    Float[] smooth = new Float[d_];
    for (int i = 0; i < d_; i++)
      smooth[i] = position_[i];
    int j = 0;
    for (Iterator<Float[]> pit = previous_.iterator(); pit.hasNext(); ) {
      Float[] previous = pit.next();
      if (j < smoothing_ - 1)
        for (int i = 0; i < d_; i++)
          smooth[i] += previous[i];
      j++;
    }
    int smoothing = smoothing_;
    if (previous_.size() + 1 < smoothing) smoothing = previous_.size() + 1;
    for (int i = 0; i < d_; i++)
      smooth[i] /= smoothing;
    return smooth;
  }
  public void step() {
    step(null);
  }
  public void step(RandomStepHint hint) {
    Float[] step = step_generator_.step(position_, hint);
    Float[] next = new Float[d_];
    for (int i = 0; i < d_; i++) next[i] = position_[i] + step[i];

    previous_.addFirst(position_);
    if (previous_.size() > smoothing_) previous_.pollLast();
    position_ = next;
  }
  public void drawPoint() {
    stroke(255);
    strokeWeight(2);
    point(position_[0], position_[1]);
  }
  public void drawSmoothedPoint() {
    Float[] smooth = new Float[d_];
    for (int i = 0; i < d_; i++)
      smooth[i] = position_[i];
    int j = 0;
    for (Iterator<Float[]> pit = previous_.iterator(); pit.hasNext(); ) {
      Float[] previous = pit.next();
      if (j < smoothing_ - 1)
        for (int i = 0; i < d_; i++)
          smooth[i] += previous[i];
      j++;
    }
    int smoothing = smoothing_;
    if (previous_.size() + 1 < smoothing) smoothing = previous_.size() + 1;
    for (int i = 0; i < d_; i++)
      smooth[i] /= smoothing;
    stroke(255);
    strokeWeight(2);
    point(smooth[0], smooth[1]);
  }
  public void drawLine() {
    if (previous_.isEmpty()) return;
    stroke(255);
    strokeWeight(1);
    Float[] previous = previous_.peekFirst();
    line(previous[0], previous[1], position_[0], position_[1]);
  }
}
=======
import java.util.Deque;
import java.util.Iterator;
import java.util.LinkedList;

class RandomStepHint {
  private int d_;
  private Float[] bias_;
  private Float[] shift_;
  private Float[] force_;
  public RandomStepHint(int d) {
    d_ = d;
    bias_ = new Float[d_];
    shift_ = new Float[d_];
    force_ = new Float[d_];
  }
  public int D() {
    return d_;
  }
  public RandomStepHint Bias(int i, float bias) {
    bias_[i] = bias;
    return this;
  }
  public RandomStepHint Bias(int i, Float bias) {
    bias_[i] = bias;
    return this;
  }
  public RandomStepHint Bias(Float[] bias) {
    for (int i = 0; i < d_; i++)
      bias_[i] = bias[i];
    return this;
  }
  public RandomStepHint Shift(int i, float shift) {
    shift_[i] = shift;
    return this;
  }
  public RandomStepHint Shift(int i, Float shift) {
    shift_[i] = shift;
    return this;
  }
  public RandomStepHint Shift(Float[] shift) {
    for (int i = 0; i < d_; i++)
      shift_[i] = shift[i];
    return this;
  }
  public RandomStepHint Force(int i, float force) {
    force_[i] = force;
    return this;
  }
  public RandomStepHint Force(int i, Float force) {
    force_[i] = force;
    return this;
  }
  public RandomStepHint Force(Float[] force) {
    for (int i = 0; i < d_; i++)
      force_[i] = force[i];
    return this;
  }
}

abstract class RandomStepGenerator {
  int d_;
  public RandomStepGenerator(int d) {
    d_ = d;
  }
  public int D() {
    return d_;
  }
  public abstract Float[] step(Float[] current, RandomStepHint hint);
}

class CardinalStepGenerator extends RandomStepGenerator {
  public CardinalStepGenerator(int d) {
    super(d);
  }
  public Float[] step(Float[] current, RandomStepHint hint) {
    int i = (int) floor(random(D()));
    int s = random(1) > .5 ? 1 : -1;
    Float[] step = new Float[D()];
    for (int j = 0; j < D(); j++)
      step[j] = new Float(i == j ? s : 0);
    return step;
  }
}

class IndependentStepGenerator extends RandomStepGenerator {
  public IndependentStepGenerator(int d) {
    super(d);
  }
  public Float[] step(Float[] current, RandomStepHint hint) {
    Float[] step = new Float[D()];
    for (int i = 0; i < D(); i++)
      step[i] = new Float(random(1) > .5 ? 1 : -1);
    return step;
  }
}

class RandomWalker {
  private int d_;
  private int smoothing_ = 1;
  private Deque<Float[]> previous_;
  private Float[] position_;
  private RandomStepGenerator step_generator_;
  public RandomWalker(int d, float x, float y, RandomStepGenerator step_generator, int smoothing) {
    d_ = d;
    smoothing_ = smoothing;
    if (step_generator.D() != d) throw new IllegalArgumentException();
    step_generator_ = step_generator;
    previous_ = new LinkedList<Float[]>();
    position_ = new Float[d_];
    position_[0] = x;
    position_[1] = y;
    for (int i = 2; i < d; i++) position_[i] = new Float(0);
  }
  public int D() {
    return d_;
  }
  public float Position(int i) {
    return position_[i];
  }
  public Float[] SmoothedPosition() {
    Float[] smooth = new Float[d_];
    for (int i = 0; i < d_; i++)
      smooth[i] = position_[i];
    int j = 0;
    for (Iterator<Float[]> pit = previous_.iterator(); pit.hasNext(); ) {
      Float[] previous = pit.next();
      if (j < smoothing_ - 1)
        for (int i = 0; i < d_; i++)
          smooth[i] += previous[i];
      j++;
    }
    int smoothing = smoothing_;
    if (previous_.size() + 1 < smoothing) smoothing = previous_.size() + 1;
    for (int i = 0; i < d_; i++)
      smooth[i] /= smoothing;
    return smooth;
  }
  public void step() {
    step(null);
  }
  public void step(RandomStepHint hint) {
    Float[] step = step_generator_.step(position_, hint);
    Float[] next = new Float[d_];
    for (int i = 0; i < d_; i++) next[i] = position_[i] + step[i];

    previous_.addFirst(position_);
    if (previous_.size() > smoothing_) previous_.pollLast();
    position_ = next;
  }
  public void drawPoint() {
    stroke(255);
    strokeWeight(2);
    point(position_[0], position_[1]);
  }
  public void drawSmoothedPoint() {
    Float[] smooth = new Float[d_];
    for (int i = 0; i < d_; i++)
      smooth[i] = position_[i];
    int j = 0;
    for (Iterator<Float[]> pit = previous_.iterator(); pit.hasNext(); ) {
      Float[] previous = pit.next();
      if (j < smoothing_ - 1)
        for (int i = 0; i < d_; i++)
          smooth[i] += previous[i];
      j++;
    }
    int smoothing = smoothing_;
    if (previous_.size() + 1 < smoothing) smoothing = previous_.size() + 1;
    for (int i = 0; i < d_; i++)
      smooth[i] /= smoothing;
    stroke(255);
    strokeWeight(2);
    point(smooth[0], smooth[1]);
  }
  public void drawLine() {
    if (previous_.isEmpty()) return;
    stroke(255);
    strokeWeight(1);
    Float[] previous = previous_.peekFirst();
    line(previous[0], previous[1], position_[0], position_[1]);
  }
}
>>>>>>> 78bbf39762a6d2802ed9e24ef50cd13fb4f9fdf8
