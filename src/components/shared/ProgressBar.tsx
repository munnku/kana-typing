interface ProgressBarProps {
  value: number;   // 0-100
  color?: string;  // tailwind color class e.g. 'bg-blue-500'
  height?: string; // e.g. 'h-2'
  showLabel?: boolean;
}

export function ProgressBar({ value, color = 'bg-blue-500', height = 'h-2', showLabel = false }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>進捗</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
