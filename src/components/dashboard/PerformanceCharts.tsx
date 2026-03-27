'use client';
import {
  ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

interface ChartEntry {
  session: string;
  CPS: number;
  正確率: number;
}

interface PerformanceChartsProps {
  chartData: ChartEntry[];
  avgCps: string;
  avgAccuracy: string;
}

export function PerformanceCharts({ chartData, avgCps, avgAccuracy }: PerformanceChartsProps) {
  return (
    <div className="glass-card rounded-lg border border-[#464555]/10 p-6">
      <div className="mb-3">
        <h3 className="font-headline font-bold text-base text-on-surface">タイプ速度 推移</h3>
        <p className="font-body text-xs text-on-surface-variant">1秒あたりのキー数と正確率の成長</p>
      </div>
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
              <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#918fa1' }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#c0c1ff' }}
                label={{ value: 'キー/秒', angle: -90, position: 'insideLeft', offset: 16, style: { fontSize: 9, fill: '#c0c1ff' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#4edea3' }}
                label={{ value: '正確率%', angle: 90, position: 'insideRight', offset: 16, style: { fontSize: 9, fill: '#4edea3' } }}
              />
              <Tooltip
                contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#c7c4d8' }}
                wrapperStyle={{ zIndex: 50 }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#918fa1' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="CPS"
                name="タイプ速度"
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
        <div className="flex flex-col justify-center gap-4 text-right shrink-0">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-[#c0c1ff]/70">平均 タイプ速度</p>
            <p className="font-headline font-bold text-xl text-[#c0c1ff]">{avgCps} <span className="text-xs text-on-surface-variant">キー/秒</span></p>
          </div>
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-[#4edea3]/70">平均 正確率</p>
            <p className="font-headline font-bold text-xl text-[#4edea3]">{avgAccuracy}<span className="text-xs text-on-surface-variant"> %</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
