import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from 'recharts';
import { houseData } from '../lib/data';
import { mse, sampleCostCurve } from '../lib/math';

export const THETA0 = 90;
export const T1_RANGE = [20, 120];

// Curve data is constant — all inputs are module-level constants.
const CURVE_DATA = sampleCostCurve(THETA0, houseData, T1_RANGE);

function Step5CostCurve() {
  const [theta1, setTheta1] = useState(30);
  const currentJ = mse(THETA0, theta1, houseData);

  return (
    <div className="step-card">
      <h2>Find the bottom of this curve</h2>

      <div className="mse-display">
        J(θ₁) = <span className="mse-value">{currentJ.toFixed(2)}</span>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={CURVE_DATA} margin={{ top: 16, right: 32, bottom: 48, left: 72 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="t1"
            type="number"
            domain={T1_RANGE}
            label={{
              value: 'θ₁ (slope)',
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
              value: 'Cost  J(θ₁)',
              angle: -90,
              position: 'insideLeft',
              offset: 15,
              style: { fontSize: 14, fill: '#374151', fontWeight: 600 },
            }}
            tick={{ fontSize: 13 }}
          />
          <Tooltip
            formatter={(v) => [v.toFixed(2), 'J']}
            labelFormatter={(l) => `θ₁ = ${Number(l).toFixed(1)}`}
          />
          <Line
            dataKey="J"
            dot={false}
            stroke="#7c3aed"
            strokeWidth={2.5}
            isAnimationActive={false}
          />
          <ReferenceDot
            x={theta1}
            y={currentJ}
            r={8}
            fill="#7c3aed"
            stroke="#fff"
            strokeWidth={2.5}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="controls">
        <div className="slider-row">
          <label>θ₁ (slope)</label>
          <input
            type="range"
            min={T1_RANGE[0]}
            max={T1_RANGE[1]}
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

export default Step5CostCurve;
