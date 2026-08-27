import { cn } from '@/utils/cn';

export function BarChart({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-lg bg-primary-500 group-hover:bg-primary-600 transition-all duration-300 relative"
              style={{ height: `${(d.value / max) * 100}%` }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {d.value}
              </span>
            </div>
          </div>
          <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function HorizontalBarChart({ data }: { data: { label: string; value: number; percentage: number }[] }) {
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-sm text-neutral-600 w-32 truncate">{d.label}</span>
          <div className="flex-1 h-7 bg-neutral-100 rounded-lg overflow-hidden">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${d.percentage}%` }}
            >
              <span className="text-xs font-semibold text-white">{d.value.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-xs text-neutral-400 w-10 text-right">{d.percentage}%</span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="20" />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circumference;
          const el = (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return el;
        })}
        <text x="80" y="80" className="rotate-90" transform="rotate(90 80 80)" textAnchor="middle" dominantBaseline="middle" fill="#0f172a" fontSize="22" fontWeight="700">
          {total.toLocaleString()}
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full')} style={{ background: seg.color }} />
            <span className="text-sm text-neutral-600">{seg.label}</span>
            <span className="text-sm font-semibold text-neutral-900">{seg.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
