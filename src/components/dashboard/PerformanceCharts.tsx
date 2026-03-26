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
      {/* CPS progression */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">CPS 推移</h3>
            <p className="font-body text-xs text-on-surface-variant">1秒あたりのタイプ数の成長</p>
          </div>
          <div className="text-right">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">平均</p>
            <p className="font-headline font-bold text-xl text-primary">{avgCps} <span className="text-xs text-on-surface-variant">CPS</span></p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
            <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#918fa1' }} />
            <YAxis tick={{ fontSize: 10, fill: '#918fa1' }} />
            <Tooltip
              contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#c7c4d8' }}
            />
            <Line type="monotone" dataKey="CPS" stroke="#c0c1ff" strokeWidth={2} dot={{ r: 3, fill: '#c0c1ff' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-px bg-[#464555]/20" />

      {/* Accuracy progression */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">正確率 推移</h3>
            <p className="font-body text-xs text-on-surface-variant">正確率の成長トレンド</p>
          </div>
          <div className="text-right">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">平均</p>
            <p className="font-headline font-bold text-xl text-secondary">{avgAccuracy}<span className="text-xs text-on-surface-variant"> %</span></p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,69,85,0.3)" />
            <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#918fa1' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#918fa1' }} />
            <Tooltip
              contentStyle={{ background: '#171f33', border: '1px solid #464555', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#c7c4d8' }}
            />
            <Line type="monotone" dataKey="正確率" stroke="#4edea3" strokeWidth={2} dot={{ r: 3, fill: '#4edea3' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
