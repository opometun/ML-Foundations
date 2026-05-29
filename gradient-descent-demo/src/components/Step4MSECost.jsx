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
  useXAxisScale,
  useYAxisScale,
  usePlotArea,
} from 'recharts';
import { houseData } from '../lib/data';
import { hypothesis, mse } from '../lib/math';

const X_MIN = 0.7;
const X_MAX = 3.7;
const Y_DOMAIN = [120, 360];

function getPredictionLineData(t0, t1) {
  return [
    { x: X_MIN, y: hypothesis(t0, t1, X_MIN) },
    { x: X_MAX, y: hypothesis(t0, t1, X_MAX) },
  ];
}

// Rendered directly inside ComposedChart so Recharts 3 hooks work.
// theta0/theta1 passed as regular props.
function ResidualSquares({ theta0, theta1 }) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const plotArea = usePlotArea();

  if (!xScale || !yScale || !plotArea?.width) return null;

  const { x: plotX, y: plotY, width: plotWidth, height: plotHeight } = plotArea;

  // Normalize so the largest square always covers ~5% of the plot area.
  const maxResidual = Math.max(
    ...houseData.map(({ x, y }) => Math.abs(y - hypothesis(theta0, theta1, x)))
  );
  if (maxResidual === 0) return null;
  const targetMaxSide = Math.sqrt(0.05 * plotWidth * plotHeight);
  const scaleFactor = targetMaxSide / maxResidual;

  return (
    <g>
      {/* Clip to plot area so squares never overflow chart boundaries */}
      <defs>
        <clipPath id="step4-squares-clip">
          <rect x={plotX} y={plotY} width={plotWidth} height={plotHeight} />
        </clipPath>
      </defs>
      <g clipPath="url(#step4-squares-clip)">
        {houseData.map(({ x, y }) => {
          const predicted = hypothesis(theta0, theta1, x);
          const side = Math.abs(y - predicted) * scaleFactor;
          if (side < 2) return null;
          const xPx = xScale(x);
          const yActualPx = yScale(y);
          const yPredPx = yScale(predicted);
          return (
            <rect
              key={x}
              x={xPx + 4}
              y={Math.min(yActualPx, yPredPx)}
              width={side}
              height={side}
              fill="rgba(239, 68, 68, 0.13)"
              stroke="#ef4444"
              strokeWidth={1.5}
              style={{ transition: 'all 0.08s ease' }}
            />
          );
        })}
      </g>
    </g>
  );
}

function Step4MSECost() {
  const [theta0, setTheta0] = useState(100);
  const [theta1, setTheta1] = useState(50);

  const lineData = getPredictionLineData(theta0, theta1);
  const currentMSE = mse(theta0, theta1, houseData);

  return (
    <div className="step-card">
      <h2>We need a number for wrongness</h2>

      <div className="mse-display">
        J(θ) = <span className="mse-value">{currentMSE.toFixed(2)}</span>
      </div>

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

          {/* Residual segments — behind everything else */}
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

          {/* Squared-error rectangles: area ∝ residual², rendered via Recharts 3 hooks */}
          <ResidualSquares theta0={theta0} theta1={theta1} />

          {/* Prediction line */}
          <Line
            data={lineData}
            dataKey="y"
            dot={false}
            stroke="#2563eb"
            strokeWidth={2.5}
            type="linear"
            isAnimationActive={false}
          />

          {/* Data points last — always on top */}
          <Scatter data={houseData} fill="#374151" r={6} />
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

export default Step4MSECost;
