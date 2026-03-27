'use client';
import {
  ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

interface KpmChartProps {
  history: Array<{ kpm: number; accuracy: number; date: string }>;
}

export function KpmChart({ history }: KpmChartProps) {
  if (history.length < 2) return null;

  const data = [...history].reverse().map((h, i) => ({
    回: `${i + 1}`,
    タイプ速度: Math.round(h.kpm * 10) / 10,
    正確率: Math.round(h.accuracy),
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
          <XAxis dataKey="回" tick={{ fontSize: 20, fill: '#918fa1' }} />
          {/* 左軸: タイプ速度 */}
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 20, fill: '#c0c1ff' }}
            label={{ value: 'キー/秒', angle: -90, position: 'insideLeft', offset: 16, style: { fontSize: 18, fill: '#c0c1ff' } }}
            width={50}
          />
          {/* 右軸: 正確率 */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 20, fill: '#4edea3' }}
            label={{ value: '正確率%', angle: 90, position: 'insideRight', offset: 16, style: { fontSize: 18, fill: '#4edea3' } }}
            width={55}
          />
          <Tooltip
            contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '14px' }}
            labelStyle={{ color: '#c7c4d8' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', color: '#918fa1' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="タイプ速度"
            stroke="#c0c1ff"
            strokeWidth={2}
            dot={{ r: 3, fill: '#c0c1ff' }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="正確率"
            stroke="#4edea3"
            strokeWidth={2}
            dot={{ r: 3, fill: '#4edea3' }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
