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
  useXAxisScale,
  useYAxisScale,
} from 'recharts';
import { houseData } from '../lib/data';
import { mse, sampleCostCurve, gradients } from '../lib/math';
import { THETA0, T1_RANGE } from './Step5CostCurve';

const CURVE_DATA = sampleCostCurve(THETA0, houseData, T1_RANGE);

// Fixed point left of the minimum (~70) so the arrow clearly points rightward (downhill).
const ARROW_T1 = 40;

// Rendered directly inside LineChart to access Recharts 3 scale hooks.
function GradientArrow() {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  if (!xScale || !yScale) return null;

  const J = mse(THETA0, ARROW_T1, houseData);
  const { d1 } = gradients(THETA0, ARROW_T1, houseData);
  const cx = xScale(ARROW_T1);
  const cy = yScale(J);

  // d1 < 0 at θ1=40 → downhill means increasing θ1 → arrow points right (+1)
  const dir = d1 < 0 ? 1 : -1;
  const arrowStart = cx + dir * 10;
  const arrowEnd = cx + dir * 52;
  const labelX = cx + dir * 60;

  return (
    <g>
      <defs>
        <marker
          id="step6-arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#16a34a" />
        </marker>
      </defs>
      <circle cx={cx} cy={cy} r={7} fill="#16a34a" stroke="#fff" strokeWidth={2} />
      <line
        x1={arrowStart}
        y1={cy}
        x2={arrowEnd}
        y2={cy}
        stroke="#16a34a"
        strokeWidth={2.5}
        markerEnd="url(#step6-arrowhead)"
      />
      <text
        x={labelX}
        y={cy - 10}
        fontSize={12}
        fontWeight="700"
        fill="#16a34a"
        textAnchor={dir > 0 ? 'start' : 'end'}
      >
        downhill
      </text>
    </g>
  );
}

function Step6WhyNotGuess() {
  const [guesses, setGuesses] = useState([]);
  const [showGradient, setShowGradient] = useState(false);

  const addGuess = () => {
    const t1 = Math.random() * (T1_RANGE[1] - T1_RANGE[0]) + T1_RANGE[0];
    setGuesses((prev) => [...prev, t1]);
  };

  const reset = () => {
    setGuesses([]);
    setShowGradient(false);
  };

  return (
    <div className="step-card">
      <h2>Why not just guess?</h2>

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
          {guesses.map((t1, i) => (
            <ReferenceDot
              key={i}
              x={t1}
              y={mse(THETA0, t1, houseData)}
              r={7}
              fill="#f59e0b"
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
          {showGradient && <GradientArrow />}
        </LineChart>
      </ResponsiveContainer>

      <div className="controls">
        <div className="button-row">
          <button className="demo-btn" onClick={addGuess}>
            Random guess
          </button>
          <button
            className="demo-btn demo-btn--secondary"
            onClick={reset}
            disabled={guesses.length === 0 && !showGradient}
          >
            Reset
          </button>
          <button
            className="demo-btn demo-btn--accent"
            onClick={() => setShowGradient(true)}
            disabled={showGradient}
          >
            Reveal gradient
          </button>
        </div>
        {guesses.length > 0 && (
          <p className="guess-count">
            {guesses.length} random guess{guesses.length !== 1 ? 'es' : ''} — still blind.
          </p>
        )}
      </div>
    </div>
  );
}

export default Step6WhyNotGuess;
