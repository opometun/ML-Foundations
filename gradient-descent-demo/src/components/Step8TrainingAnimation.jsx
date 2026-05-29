import { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { houseData } from '../lib/data';
import { hypothesis, mse, descentStep } from '../lib/math';

const X_MIN = 0.7;
const X_MAX = 3.7;
const Y_DOMAIN = [120, 360];
const INITIAL = { theta0: 50, theta1: 30 };
const INTERVAL_MS = 100;

// Log-spaced α: 0.001 * 300^(s/100) maps [0,100] → [0.001, 0.3]
const sliderToAlpha = (s) => 0.001 * Math.pow(300, s / 100);
const ALPHA_DEFAULT_SLIDER = 68; // ≈ 0.048

function Step8TrainingAnimation() {
  const [params, setParams] = useState(INITIAL);
  const [alphaSlider, setAlphaSlider] = useState(ALPHA_DEFAULT_SLIDER);
  const [isTraining, setIsTraining] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [diverged, setDiverged] = useState(false);
  const paramsRef = useRef(INITIAL);

  // Keep ref in sync so the interval callback always reads current params.
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    if (!isTraining) return;
    const alpha = sliderToAlpha(alphaSlider);
    const id = setInterval(() => {
      const prev = paramsRef.current;
      const next = descentStep(prev.theta0, prev.theta1, houseData, alpha);
      if (!isFinite(next.theta0) || !isFinite(next.theta1)) {
        setIsTraining(false);
        setDiverged(true);
        return; // don't update params or increment step count
      }
      setParams(next);
      setStepCount((c) => c + 1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [isTraining, alphaSlider]);

  const reset = () => {
    setIsTraining(false);
    setParams(INITIAL);
    setStepCount(0);
    setDiverged(false);
  };

  const { theta0, theta1 } = params;
  const alpha = sliderToAlpha(alphaSlider);
  const currentMSE = mse(theta0, theta1, houseData);
  const lineData = [
    { x: X_MIN, y: hypothesis(theta0, theta1, X_MIN) },
    { x: X_MAX, y: hypothesis(theta0, theta1, X_MAX) },
  ];

  return (
    <div className="step-card">
      <h2>Training is repeated correction</h2>

      <div className="mse-display">
        J(θ) = <span className="mse-value">{currentMSE.toFixed(2)}</span>
      </div>

      <div className="training-stats">
        Steps: <strong>{stepCount}</strong>
        &nbsp;&nbsp;θ₀: <strong>{theta0.toFixed(1)}</strong>
        &nbsp;&nbsp;θ₁: <strong>{theta1.toFixed(1)}</strong>
        &nbsp;&nbsp;α: <strong>{alpha.toFixed(3)}</strong>
      </div>

      {diverged && (
        <div className="diverged-warning">
          Training diverged — α is too large. Reset and try a smaller learning rate.
        </div>
      )}

      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart margin={{ top: 16, right: 32, bottom: 48, left: 56 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[X_MIN, X_MAX]}
            tickCount={7}
            label={{
              value: 'Size (100s of sq ft)',
              position: 'insideBottom',
              offset: -30,
              style: { fontSize: 14, fill: '#374151', fontWeight: 600 },
            }}
            tick={{ fontSize: 13 }}
          />
          <YAxis
            type="number"
            domain={Y_DOMAIN}
            label={{
              value: 'Price ($1000s)',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fontSize: 14, fill: '#374151', fontWeight: 600 },
            }}
            tick={{ fontSize: 13 }}
          />
          <Tooltip />
          <Scatter data={houseData} dataKey="y" fill="#374151" r={6} isAnimationActive={false} />
          {/* isAnimationActive=false prevents Recharts replaying the enter
              animation on every tick, which would cause visible flicker. */}
          <Line
            data={lineData}
            dataKey="y"
            dot={false}
            stroke="#2563eb"
            strokeWidth={2.5}
            type="linear"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="controls">
        <div className="button-row">
          <button
            className={`demo-btn ${isTraining ? 'demo-btn--secondary' : 'demo-btn--accent'}`}
            onClick={() => setIsTraining((t) => !t)}
            disabled={diverged}
          >
            {isTraining ? 'Pause' : 'Train'}
          </button>
          <button
            className="demo-btn demo-btn--secondary"
            onClick={reset}
            disabled={stepCount === 0 && !isTraining}
          >
            Reset
          </button>
        </div>

        <div className="slider-row">
          <label>α (learning rate)</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={alphaSlider}
            onChange={(e) => setAlphaSlider(Number(e.target.value))}
          />
          <span className="slider-value">{alpha.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

export default Step8TrainingAnimation;
