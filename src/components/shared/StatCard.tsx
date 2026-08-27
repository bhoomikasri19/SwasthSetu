import { cn } from '@/utils/cn';

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendDirection,
  accent,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  accent?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}) {
  const accentClasses = {
    primary: 'text-primary-600 bg-primary-50',
    secondary: 'text-secondary-600 bg-secondary-50',
    success: 'text-success-600 bg-success-50',
    warning: 'text-warning-600 bg-warning-50',
    danger: 'text-danger-600 bg-danger-50',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', accentClasses[accent || 'primary'])}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-semibold',
              trendDirection === 'up' && 'text-success-600',
              trendDirection === 'down' && 'text-danger-600',
              trendDirection === 'neutral' && 'text-neutral-500'
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
