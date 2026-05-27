import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { houseData } from '../lib/data';

const X_DOMAIN = [0.7, 3.7];
const Y_DOMAIN = [120, 360];

function Step1HouseData() {
  return (
    <div className="step-card">
      <h2>We have data</h2>
      <ResponsiveContainer width="100%" height={440}>
        <ScatterChart margin={{ top: 16, right: 32, bottom: 48, left: 56 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            type="number"
            domain={X_DOMAIN}
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
            dataKey="y"
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
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [value, name === 'y' ? 'Price ($k)' : 'Size']}
          />
          <Scatter data={houseData} fill="#374151" r={6} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Step1HouseData;
