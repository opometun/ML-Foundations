import { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { houseData } from '../lib/data';
import { mse, descentStep } from '../lib/math';

const INITIAL = { theta0: 50, theta1: 30 };
const INTERVAL_MS = 100;
const INITIAL_J = mse(INITIAL.theta0, INITIAL.theta1, houseData);

// Log-spaced α: 0.001 * 300^(s/100) maps [0,100] → [0.001, 0.3]
const sliderToAlpha = (s) => 0.001 * Math.pow(300, s / 100);
const ALPHA_DEFAULT_SLIDER = 68; // ≈ 0.048

function Step9LossCurve() {
  const [params, setParams] = useState(INITIAL);
  const [alphaSlider, setAlphaSlider] = useState(ALPHA_DEFAULT_SLIDER);
  const [isTraining, setIsTraining] = useState(false);
  const [lossHistory, setLossHistory] = useState([{ iter: 0, J: INITIAL_J }]);
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
        return;
      }
      const J = mse(next.theta0, next.theta1, houseData);
      setParams(next);
      setLossHistory((h) => [...h, { iter: h.length, J }]);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [isTraining, alphaSlider]);

  const reset = () => {
    setIsTraining(false);
    setParams(INITIAL);
    setLossHistory([{ iter: 0, J: INITIAL_J }]);
    setDiverged(false);
  };

  const { theta0, theta1 } = params;
  const alpha = sliderToAlpha(alphaSlider);
  const stepCount = lossHistory.length - 1;
  const currentJ = lossHistory[lossHistory.length - 1].J;

  return (
    <div className="step-card">
      <h2>How do we know it&apos;s done?</h2>

      <div className="mse-display">
        J(θ) = <span className="mse-value">{currentJ.toFixed(2)}</span>
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
        <LineChart
          data={lossHistory}
          margin={{ top: 16, right: 32, bottom: 48, left: 72 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="iter"
            type="number"
            domain={[0, 'auto']}
            label={{
              value: 'Iteration',
              position: 'insideBottom',
              offset: -30,
              style: { fontSize: 14, fill: '#374151', fontWeight: 600 },
            }}
            tick={{ fontSize: 13 }}
          />
          <YAxis
            domain={[0, 'auto']}
            tickFormatter={(v) => v.toFixed(0)}
            label={{
              value: 'Cost  J(θ)',
              angle: -90,
              position: 'insideLeft',
              offset: 15,
              style: { fontSize: 14, fill: '#374151', fontWeight: 600 },
            }}
            tick={{ fontSize: 13 }}
          />
          <Tooltip
            formatter={(v) => [v.toFixed(2), 'J(θ)']}
            labelFormatter={(l) => `Step ${l}`}
          />
          <Line
            dataKey="J"
            dot={false}
            stroke="#7c3aed"
            strokeWidth={2.5}
            isAnimationActive={false}
          />
        </LineChart>
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

export default Step9LossCurve;
