class Fluid2d extends Square {
  int size;
  float dt;
  float diff;
  float visc;

  float[] s;
  float[] densityR;
  float[] densityG;
  float[] densityB;

  float[] Vx;
  float[] Vy;

  float[] Vx0;
  float[] Vy0;

  public float max;

  Fluid2d(int N, float diffusion, float viscosity, float _dt) {
    super(N);

    size = N;
    dt = _dt;
    diff = diffusion;
    visc = viscosity;

    s = new float[N * N/* * N*/];
    densityR = new float[N * N/* * N*/];
    densityG = new float[N * N/* * N*/];
    densityB = new float[N * N/* * N*/];

    Vx = new float[N * N/* * N*/];
    Vy = new float[N * N/* * N*/];

    Vx0 = new float[N * N/* * N*/];
    Vy0 = new float[N * N/* * N*/];

    max = 0;
  }

  void AddDensity(int x, int y, float amountR, float amountG, float amountB)
  {
    if (x >= N || y >= N) {
      System.out.println("AddDensity out of bounds");
      return;
    }
    int i = index(x, y);

    densityR[i] += amountR;
    densityG[i] += amountG;
    densityB[i] += amountB;
  }

  void AddDensity(int x, int y, float amount)
  {
    if (x >= N || y >= N) {
      System.out.println("AddDensity out of bounds");
      return;
    }
    int i = index(x, y);

    densityR[i] += amount;
    densityG[i] += amount;
    densityB[i] += amount;
  }

  void AddVelocity(int x, int y, float amountX, float amountY)
  {
    if (x >= N || y >= N) {
      System.out.println("AddVelocity out of bounds");
      return;
    }
    int i = index(x, y);

    Vx[i] += amountX;
    Vy[i] += amountY;
  }

  void lin_solve(int b, float[] x, float[] x0, float a, float c)
  {
    float cRecip = 1.0 / c;
    for (int k = 0; k < iterations; k++) {
      for (int j = 1; j < N - 1; j++) {
        for (int i = 1; i < N - 1; i++) {
          x[index(i, j/*, m*/)] =
            (x0[index(i, j/*, m*/)]
            + a*(    x[index(i+1, j  /*, m  */)]
            +x[index(i-1, j  /*, m  */)]
            +x[index(i, j+1/*, m  */)]
            +x[index(i, j-1/*, m  */)]
            +x[index(i, j  /*, m+1*/)]
            +x[index(i, j  /*, m-1*/)]
            )) * cRecip;
        }
      }
      set_bnd(b, x);
    }
  }

  float total(float[] x)
  {
    float total = 0;
    for (int j = 1; j < N - 1; j++)
      for (int i = 1; i < N - 1; i++)
        total += x[index(i, j)];
    return total;
  }

  void set_bnd(int b, float[] x)
  {
    for (int i = 1; i < N - 1; i++) {
      x[index(i, 0  /*, k*/)] = b == 2 ? -x[index(i, 1  /*, k*/)] : x[index(i, 1  /*, k*/)];
      x[index(i, N-1/*, k*/)] = b == 2 ? -x[index(i, N-2/*, k*/)] : x[index(i, N-2/*, k*/)];
    }
    for (int j = 1; j < N - 1; j++) {
      x[index(0, j/*, k*/)] = b == 1 ? -x[index(1, j/*, k*/)] : x[index(1, j/*, k*/)];
      x[index(N-1, j/*, k*/)] = b == 1 ? -x[index(N-2, j/*, k*/)] : x[index(N-2, j/*, k*/)];
    }

    x[index(0, 0/*, 0*/)]       = 0.33f * (x[index(1, 0/*, 0*/)]
      + x[index(0, 1/*, 0*/)]
      + x[index(0, 0/*, 1*/)]);
    x[index(0, N-1/*, 0*/)]     = 0.33f * (x[index(1, N-1/*, 0*/)]
      + x[index(0, N-2/*, 0*/)]
      + x[index(0, N-1/*, 1*/)]);
    x[index(N-1, 0/*, 0*/)]     = 0.33f * (x[index(N-2, 0/*, 0*/)]
      + x[index(N-1, 1/*, 0*/)]
      + x[index(N-1, 0/*, 1*/)]);
    x[index(N-1, N-1/*, 0*/)]   = 0.33f * (x[index(N-2, N-1/*, 0*/)]
      + x[index(N-1, N-2/*, 0*/)]
      + x[index(N-1, N-1/*, 1*/)]);
  }

  void diffuse (int b, float[] x, float[] x0, float diff)
  {
    float a = dt * diff * (N - 2) * (N - 2);
    lin_solve(b, x, x0, a, 1 + 6 * a);
  }

  void project(float[] velocX, float[] velocY/*, float[] velocZ*/, float[] p, float[] div)
  {
    //for (int k = 1; k < N - 1; k++) {
    for (int j = 1; j < N - 1; j++) {
      for (int i = 1; i < N - 1; i++) {
        div[index(i, j/*, k*/)] = -0.5f*(
          velocX[index(i+1, j  /*, k  */)]
          -velocX[index(i-1, j  /*, k  */)]
          +velocY[index(i, j+1/*, k  */)]
          -velocY[index(i, j-1/*, k  */)]
          )/N;
        p[index(i, j/*, k*/)] = 0;
      }
    }
    //}
    set_bnd(0, div); 
    set_bnd(0, p);
    lin_solve(0, p, div, 1, 6);

    for (int j = 1; j < N - 1; j++) {
      for (int i = 1; i < N - 1; i++) {
        velocX[index(i, j/*, k*/)] -= 0.5f * (  p[index(i+1, j/*, k*/)]
          -p[index(i-1, j/*, k*/)]) * N;
        velocY[index(i, j/*, k*/)] -= 0.5f * (  p[index(i, j+1/*, k*/)]
          -p[index(i, j-1/*, k*/)]) * N;
        //velocZ[index(i, j/*, k*/)] -= 0.5f * (  p[index(i, j/*, k+1*/)]
        //                                -p[index(i, j/*, k-1*/)]) * N;
      }
    }
    set_bnd(1, velocX);
    set_bnd(2, velocY);
    //set_bnd(3, velocZ);
  }

  void advect(int b, float[] d, float[] d0, float[] velocX, float[] velocY/*, float[] velocZ*/)
  {
    float i0, i1, j0, j1;//, k0, k1;

    float dtx = dt * (N - 2);
    float dty = dt * (N - 2);
    //float dtz = dt * (N - 2);

    float s0, s1, t0, t1;//, u0, u1;
    float tmp1, tmp2/*, tmp3*/, x, y;//, z;

    float Nfloat = N;
    float ifloat, jfloat;//, kfloat;
    int i, j;//, k;

    //for(k = 1, kfloat = 1; k < N - 1; k++, kfloat++) {
    for (j = 1, jfloat = 1; j < N - 1; j++, jfloat++) { 
      for (i = 1, ifloat = 1; i < N - 1; i++, ifloat++) {
        tmp1 = dtx * velocX[index(i, j/*, k*/)];
        tmp2 = dty * velocY[index(i, j/*, k*/)];
        //tmp3 = dtz * velocZ[index(i, j/*, k*/)];
        x    = ifloat - tmp1; 
        y    = jfloat - tmp2;
        //z    = kfloat - tmp3;

        if (x < 0.5f) x = 0.5f; 
        if (x > Nfloat - 0.5f) x = Nfloat - 0.5f; 
        i0 = floor(x); 
        i1 = i0 + 1.0f;
        if (y < 0.5f) y = 0.5f; 
        if (y > Nfloat - 0.5f) y = Nfloat - 0.5f; 
        j0 = floor(y);
        j1 = j0 + 1.0f; 
        //if(z < 0.5f) z = 0.5f;
        //if(z > Nfloat + 0.5f) z = Nfloat + 0.5f;
        //k0 = floorf(z);
        //k1 = k0 + 1.0f;

        s1 = x - i0; 
        s0 = 1.0f - s1; 
        t1 = y - j0; 
        t0 = 1.0f - t1;
        //u1 = z - k0;
        //u0 = 1.0f - u1;

        int i0i = (int) i0;
        int i1i = (int) i1;
        int j0i = (int) j0;
        int j1i = (int) j1;
        //int k0i = (int) k0;
        //int k1i = (int) k1;

        d[index(i, j/*, k*/)] = 

        /*
                      s0 * ( t0 * (u0 * d0[index(i0i, j0i, k0i)]
         +u1 * d0[index(i0i, j0i, k1i)])
         +( t1 * (u0 * d0[index(i0i, j1i, k0i)]
         +u1 * d0[index(i0i, j1i, k1i)])))
         +s1 * ( t0 * (u0 * d0[index(i1i, j0i, k0i)]
         +u1 * d0[index(i1i, j0i, k1i)])
         +( t1 * (u0 * d0[index(i1i, j1i, k0i)]
         +u1 * d0[index(i1i, j1i, k1i)])));
         */

          s0 * ( t0 * d0[index(i0i, j0i)]
          +( t1 * d0[index(i0i, j1i)]))
          +s1 * ( t0 * d0[index(i1i, j0i)]
          +( t1 * d0[index(i1i, j1i)]));
      }
    }
    //}
    set_bnd(b, d);
  }

  void limit(float[] x, float t, float l) {
    if (max <= 0.01 || t < l)
      return;
    float rate = l / t;
    for (int i = 0; i < N - 1; i++)
      for (int j = 0; j < N - 1; j++) {
        int ind = index(i, j);
        x[ind] *= rate;
      }
  }

  void cool() {
    for (int i = 0; i < N - 1; i++)
      for (int j = 0; j < N - 1; j++) {
        int ind = index(i, j);
        densityR[ind] *= densityB[ind];
      }
  }

  void Step()
  {
    diffuse(1, Vx0, Vx, visc);
    diffuse(2, Vy0, Vy, visc);
    // diffuse(3, Vz0, Vz, visc, dt);

    project(Vx0, Vy0/*, Vz0*/, Vx, Vy);

    advect(1, Vx, Vx0, Vx0, Vy0/*, Vz0*/);
    advect(2, Vy, Vy0, Vx0, Vy0/*, Vz0*/);
    //advect(3, Vz, Vz0, Vx0, Vy0, Vz0);

    project(Vx, Vy/*, Vz*/, Vx0, Vy0);

    diffuse(0, s, densityR, diff);
    advect(0, densityR, s, Vx, Vy/*, Vz*/);
    diffuse(0, s, densityG, diff);
    advect(0, densityG, s, Vx, Vy/*, Vz*/);
    diffuse(0, s, densityB, diff);
    advect(0, densityB, s, Vx, Vy/*, Vz*/);

    float t = total(densityR);
    limit(densityR, t, max);
    limit(densityG, t, max);
    limit(densityB, t, max);
    //cool();
  }

  void render(int scale) {
    for (int i = 0; i < N; i++)
      for (int j = 0; j < N; j++) {
        float x = i * scale;
        float y = j * scale;
        int in = index(i, j);
        fill(densityR[in], densityG[in], densityB[in]);
        noStroke();
        square(x, y, scale);
      }
  }
}
