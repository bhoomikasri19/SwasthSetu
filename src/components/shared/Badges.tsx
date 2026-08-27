import { cn } from '@/utils/cn';

export function PriorityBadge({ priority, size = 'md' }: { priority: 'critical' | 'important' | 'routine'; size?: 'sm' | 'md' }) {
  const config = {
    critical: { label: 'Critical', classes: 'bg-danger-50 text-danger-700 border-danger-200', dot: 'bg-danger-500' },
    important: { label: 'Important', classes: 'bg-warning-50 text-warning-700 border-warning-200', dot: 'bg-warning-500' },
    routine: { label: 'Routine', classes: 'bg-success-50 text-success-700 border-success-200', dot: 'bg-success-500' },
  }[priority];

  return (
    <span className={cn('badge border', config.classes, size === 'sm' && 'text-2xs px-2 py-0.5')}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

export function LabStatusBadge({ status }: { status: 'normal' | 'high' | 'low' }) {
  const config = {
    normal: { label: 'Normal', classes: 'bg-success-50 text-success-700' },
    high: { label: 'Above range', classes: 'bg-danger-50 text-danger-700' },
    low: { label: 'Below range', classes: 'bg-warning-50 text-warning-700' },
  }[status];

  return <span className={cn('badge', config.classes)}>{config.label}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    available: 'bg-success-50 text-success-700',
    'in-use': 'bg-secondary-50 text-secondary-700',
    offline: 'bg-neutral-100 text-neutral-500',
    maintenance: 'bg-warning-50 text-warning-700',
    waiting: 'bg-warning-50 text-warning-700',
    'in-progress': 'bg-secondary-50 text-secondary-700',
    completed: 'bg-success-50 text-success-700',
    verified: 'bg-primary-50 text-primary-700',
    pending: 'bg-danger-50 text-danger-700',
    resolved: 'bg-neutral-100 text-neutral-600',
  };
  const label = status.replace('-', ' ');
  return (
    <span className={cn('badge capitalize', config[status] || 'bg-neutral-100 text-neutral-600')}>
      {label}
    </span>
  );
}
