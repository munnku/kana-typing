'use client';
import { formatKpm, formatAccuracy, formatDuration } from '@/lib/metrics';

interface MetricsBarProps {
  kpm: number;
  accuracy: number;
  elapsed: number;
  correctChars: number;
  totalChars: number;
}

export function MetricsBar({ kpm, accuracy, elapsed, correctChars, totalChars }: MetricsBarProps) {
  const progress = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

  return (
    <div className="flex items-center gap-6 px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
      <MetricItem label="KPM" value={formatKpm(kpm)} color="text-blue-600" />
      <MetricItem label="正確率" value={formatAccuracy(accuracy)} color="text-green-600" />
      <MetricItem label="時間" value={formatDuration(elapsed)} color="text-purple-600" />
      <div className="flex-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>進捗</span>
          <span>{correctChars} / {totalChars} 文字</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
