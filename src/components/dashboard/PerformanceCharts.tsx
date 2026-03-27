'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
    <div className="glass-card rounded-lg border border-[#464555]/10 p-6 space-y-6">
      {/* タイプ速度 progression */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <h3 className="font-headline font-bold text-base text-on-surface">タイプ速度 推移</h3>
            <p className="font-body text-xs text-on-surface-variant">1秒あたりのキー数の成長</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
              <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#918fa1' }} />
              <YAxis tick={{ fontSize: 10, fill: '#918fa1' }} />
              <Tooltip
                contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '12px', zIndex: 50 }}
                labelStyle={{ color: '#c7c4d8' }}
                wrapperStyle={{ zIndex: 50 }}
              />
              <Line type="monotone" dataKey="CPS" name="キー/秒" stroke="#c0c1ff" strokeWidth={2} dot={{ r: 3, fill: '#c0c1ff' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-4 text-right shrink-0">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">平均 タイプ速度</p>
            <p className="font-headline font-bold text-xl text-primary">{avgCps} <span className="text-xs text-on-surface-variant">キー/秒</span></p>
          </div>
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">平均 正確率</p>
            <p className="font-headline font-bold text-xl text-secondary">{avgAccuracy}<span className="text-xs text-on-surface-variant"> %</span></p>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#464555]/20" />

      {/* 正確率 progression */}
      <div>
        <div className="mb-1">
          <h3 className="font-headline font-bold text-base text-on-surface">正確率 推移</h3>
          <p className="font-body text-xs text-on-surface-variant">正確率の成長トレンド</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
            <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#918fa1' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#918fa1' }} />
            <Tooltip
              contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '12px', zIndex: 50 }}
              labelStyle={{ color: '#c7c4d8' }}
              wrapperStyle={{ zIndex: 50 }}
            />
            <Line type="monotone" dataKey="正確率" stroke="#4edea3" strokeWidth={2} dot={{ r: 3, fill: '#4edea3' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
