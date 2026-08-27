import { cn } from '@/utils/cn';

export function Logo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean }) {
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-lg' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-xl' },
    lg: { box: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-2xl' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div className={cn('rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm', s.box)}>
        <svg viewBox="0 0 24 24" fill="none" className={s.icon} stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h3l2-7 4 14 2-7 3 0" />
          <circle cx="20" cy="12" r="1.5" fill="white" stroke="none" />
        </svg>
      </div>
      {showText && (
        <div className="leading-none">
          <span className={cn('font-bold text-neutral-900 tracking-tight', s.text)}>MediKiosk</span>
          <p className="text-2xs text-neutral-400 font-medium mt-0.5">AI Clinical History Intake</p>
        </div>
      )}
    </div>
  );
}
