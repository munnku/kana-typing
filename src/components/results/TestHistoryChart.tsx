'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TestResult } from '@/types';

interface TestHistoryChartProps {
  history: TestResult[];
}

export function TestHistoryChart({ history }: TestHistoryChartProps) {
  if (history.length < 2) return null;

  const data = [...history].reverse().map((h, i) => ({
    attempt: `${i + 1}回目`,
    CPS: h.kpm,
    正確率: Math.round(h.accuracy),
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
          <XAxis dataKey="attempt" tick={{ fontSize: 10, fill: '#918fa1' }} />
          <YAxis tick={{ fontSize: 10, fill: '#918fa1' }} />
          <Tooltip
            contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '12px' }}
            labelStyle={{ color: '#c7c4d8' }}
          />
          <Line type="monotone" dataKey="CPS" stroke="#c0c1ff" strokeWidth={2} dot={{ r: 3, fill: '#c0c1ff' }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="正確率" stroke="#4edea3" strokeWidth={2} dot={{ r: 3, fill: '#4edea3' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
