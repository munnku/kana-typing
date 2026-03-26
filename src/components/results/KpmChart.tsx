'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface KpmChartProps {
  history: Array<{ kpm: number; accuracy: number; date: string }>;
}

export function KpmChart({ history }: KpmChartProps) {
  if (history.length < 2) return null;

  const data = [...history].reverse().map((h, i) => ({
    attempt: `${i + 1}回目`,
    CPS: h.kpm,
    正確率: Math.round(h.accuracy),
  }));

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">過去の成績</h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="attempt" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="CPS" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="正確率" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
