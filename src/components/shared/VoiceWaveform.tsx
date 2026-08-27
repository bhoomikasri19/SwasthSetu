import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

export function VoiceWaveform({ active, size = 'md' }: { active: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const [bars, setBars] = useState<number[]>(Array(24).fill(0.3));

  useEffect(() => {
    if (!active) {
      setBars(Array(24).fill(0.3));
      return;
    }
    const interval = setInterval(() => {
      setBars(Array.from({ length: 24 }, () => Math.random() * 0.9 + 0.1));
    }, 120);
    return () => clearInterval(interval);
  }, [active]);

  const heights = { sm: 'h-6', md: 'h-12', lg: 'h-20' };
  const barWidth = { sm: 'w-0.5', md: 'w-1', lg: 'w-1.5' };

  return (
    <div className={cn('flex items-center justify-center gap-0.5', heights[size])}>
      {bars.map((h, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-150',
            barWidth[size],
            active ? 'bg-primary-500' : 'bg-neutral-300'
          )}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}
