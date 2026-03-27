'use client';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
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
    <div className="space-y-4">
      {/* タイプ速度グラフ */}
      <div className="glass-card rounded-lg border border-[#464555]/10 p-5">
        <div className="flex gap-4 items-center">
          <div className="flex-1 min-w-0">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">タイプ速度 推移</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
                <XAxis dataKey="session" tick={{ fontSize: 20, fill: '#918fa1' }} />
                <YAxis
                  tick={{ fontSize: 20, fill: '#c0c1ff' }}
                  width={55}
                />
                <Tooltip
                  contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '14px' }}
                  labelStyle={{ color: '#c7c4d8' }}
                  wrapperStyle={{ zIndex: 50 }}
                />
                <Line
                  type="monotone"
                  dataKey="CPS"
                  name="タイプ速度"
                  stroke="#c0c1ff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#c0c1ff' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="shrink-0 text-right w-28">
            <p className="font-label text-[10px] uppercase tracking-widest text-[#c0c1ff]/70 mb-1">平均タイプ速度</p>
            <p className="font-headline font-bold text-2xl text-[#c0c1ff]">{avgCps}</p>
            <p className="font-label text-[10px] text-on-surface-variant">キー/秒</p>
          </div>
        </div>
      </div>

      {/* 正確率グラフ */}
      <div className="glass-card rounded-lg border border-[#464555]/10 p-5">
        <div className="flex gap-4 items-center">
          <div className="flex-1 min-w-0">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">正確率 推移</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
                <XAxis dataKey="session" tick={{ fontSize: 20, fill: '#918fa1' }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 20, fill: '#4edea3' }}
                  width={55}
                />
                <Tooltip
                  contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '14px' }}
                  labelStyle={{ color: '#c7c4d8' }}
                  wrapperStyle={{ zIndex: 50 }}
                />
                <Line
                  type="monotone"
                  dataKey="正確率"
                  name="正確率"
                  stroke="#4edea3"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#4edea3' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="shrink-0 text-right w-28">
            <p className="font-label text-[10px] uppercase tracking-widest text-[#4edea3]/70 mb-1">平均正確率</p>
            <p className="font-headline font-bold text-2xl text-[#4edea3]">{avgAccuracy}</p>
            <p className="font-label text-[10px] text-on-surface-variant">%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
