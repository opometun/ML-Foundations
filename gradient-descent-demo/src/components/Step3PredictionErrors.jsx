import { useState } from 'react';
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
import { hypothesis } from '../lib/math';

const X_MIN = 0.7;
const X_MAX = 3.7;
const Y_DOMAIN = [120, 360];

function getPredictionLineData(t0, t1) {
  return [
    { x: X_MIN, y: hypothesis(t0, t1, X_MIN) },
    { x: X_MAX, y: hypothesis(t0, t1, X_MAX) },
  ];
}

function Step3PredictionErrors() {
  const [theta0, setTheta0] = useState(100);
  const [theta1, setTheta1] = useState(50);

  const lineData = getPredictionLineData(theta0, theta1);

  return (
    <div className="step-card">
      <h2>The model is wrong</h2>
      <ResponsiveContainer width="100%" height={440}>
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

          {/* Residuals rendered first so they sit behind data points */}
          {houseData.map(({ x, y }) => (
            <Line
              key={`residual-${x}`}
              data={[{ x, y }, { x, y: hypothesis(theta0, theta1, x) }]}
              dataKey="y"
              dot={false}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 3"
              type="linear"
              isAnimationActive={false}
              legendType="none"
            />
          ))}

          {/* Prediction line on top of residuals */}
          <Line
            data={lineData}
            dataKey="y"
            dot={false}
            stroke="#2563eb"
            strokeWidth={2.5}
            type="linear"
            isAnimationActive={false}
          />

          {/* Data points rendered last so they sit on top */}
          <Scatter data={houseData} dataKey="y" fill="#374151" r={6} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="controls">
        <div className="slider-row">
          <label>θ₀ (intercept)</label>
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            value={theta0}
            onChange={(e) => setTheta0(Number(e.target.value))}
          />
          <span className="slider-value">{theta0.toFixed(2)}</span>
        </div>
        <div className="slider-row">
          <label>θ₁ (slope)</label>
          <input
            type="range"
            min={-20}
            max={150}
            step={1}
            value={theta1}
            onChange={(e) => setTheta1(Number(e.target.value))}
          />
          <span className="slider-value">{theta1.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default Step3PredictionErrors;
