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
  usePlotArea,
} from 'recharts';
import { houseData } from '../lib/data';
import { mse, sampleCostCurve, gradients, descentStep } from '../lib/math';
import { THETA0, T1_RANGE } from './Step5CostCurve';

const CURVE_DATA = sampleCostCurve(THETA0, houseData, T1_RANGE);

// α slider: log-spaced [0,100] → [0.001, 0.3]
// 0.001 * 300^(s/100) — slider 68 ≈ α 0.048
const sliderToAlpha = (s) => 0.001 * Math.pow(300, s / 100);
const ALPHA_DEFAULT_SLIDER = 68;

// Tangent line rendered as custom SVG to avoid expanding the Y-axis domain.
// A ±10-unit tangent at θ1=30 (d1≈−200) would otherwise push the axis to ~5800.
function TangentLine({ theta1 }) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const plotArea = usePlotArea();
  if (!xScale || !yScale || !plotArea?.width) return null;

  const currentJ = mse(THETA0, theta1, houseData);
  const { d1 } = gradients(THETA0, theta1, houseData);
  const { x: px, y: py, width: pw, height: ph } = plotArea;

  // Tangent endpoints: ±10 θ1-units around current position
  const t1Lo = theta1 - 10;
  const t1Hi = theta1 + 10;
  const x1 = xScale(t1Lo);
  const y1 = yScale(currentJ + d1 * (t1Lo - theta1));
  const x2 = xScale(t1Hi);
  const y2 = yScale(currentJ + d1 * (t1Hi - theta1));

  // Current point marker
  const cx = xScale(theta1);
  const cy = yScale(currentJ);

  return (
    <g>
      <defs>
        <clipPath id="step7-clip">
          <rect x={px} y={py} width={pw} height={ph} />
        </clipPath>
      </defs>
      <g clipPath="url(#step7-clip)">
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#f97316"
          strokeWidth={2.5}
          strokeDasharray="7 4"
        />
      </g>
      <circle cx={cx} cy={cy} r={8} fill="#7c3aed" stroke="#fff" strokeWidth={2.5} />
    </g>
  );
}

function Step7GradientMechanics() {
  const [theta1, setTheta1] = useState(30);
  const [alphaSlider, setAlphaSlider] = useState(ALPHA_DEFAULT_SLIDER);

  const alpha = sliderToAlpha(alphaSlider);
  const currentJ = mse(THETA0, theta1, houseData);
  const { d1 } = gradients(THETA0, theta1, houseData);

  const takeStep = () => {
    const next = descentStep(THETA0, theta1, houseData, alpha);
    setTheta1(
      Math.max(T1_RANGE[0], Math.min(T1_RANGE[1], next.theta1))
    );
  };

  return (
    <div className="step-card">
      <h2>The gradient tells us how much to move</h2>

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
          <TangentLine theta1={theta1} />
        </LineChart>
      </ResponsiveContainer>

      <div className="controls">
        <div className="gradient-info">
          ∂J/∂θ₁ = <strong>{d1.toFixed(2)}</strong>
          &nbsp;→ move{' '}
          <strong>{d1 < 0 ? 'right  (+θ₁)' : 'left  (−θ₁)'}</strong>
          &nbsp;by <strong>{(alpha * Math.abs(d1)).toFixed(2)}</strong>
        </div>

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

        <div className="button-row">
          <button className="demo-btn demo-btn--accent" onClick={takeStep}>
            Take one step
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step7GradientMechanics;
