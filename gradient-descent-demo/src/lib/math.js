export const hypothesis = (t0, t1, x) => t0 + t1 * x;

export const mse = (t0, t1, data) => {
  const m = data.length;
  const sum = data.reduce((acc, { x, y }) => {
    const e = hypothesis(t0, t1, x) - y;
    return acc + e * e;
  }, 0);
  return sum / (2 * m);
};

export const gradients = (t0, t1, data) => {
  const m = data.length;
  let d0 = 0, d1 = 0;
  for (const { x, y } of data) {
    const e = hypothesis(t0, t1, x) - y;
    d0 += e;
    d1 += e * x;
  }
  return { d0: d0 / m, d1: d1 / m };
};

export const descentStep = (t0, t1, data, alpha) => {
  const { d0, d1 } = gradients(t0, t1, data);
  return { theta0: t0 - alpha * d0, theta1: t1 - alpha * d1 };
};

export const round = (n, places = 2) =>
  Math.round(n * 10 ** places) / 10 ** places;

export const sampleCostCurve = (theta0, data, t1Range, samples = 100) => {
  const [lo, hi] = t1Range;
  const points = [];
  for (let i = 0; i <= samples; i++) {
    const t1 = lo + (i / samples) * (hi - lo);
    points.push({ t1, J: mse(theta0, t1, data) });
  }
  return points;
};
