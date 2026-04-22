interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export default function ProgressBar({ value, max, className = "" }: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={`w-full bg-slate-200 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
