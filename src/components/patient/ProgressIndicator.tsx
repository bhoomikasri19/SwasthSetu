import { cn } from '@/utils/cn';
import type { PatientStep } from '@/types';
import { Check } from 'lucide-react';

const STEPS: { key: PatientStep; label: string }[] = [
  { key: 'welcome', label: 'Identify' },
  { key: 'consent', label: 'Consent' },
  { key: 'history', label: 'Health History' },
  { key: 'documents', label: 'Documents' },
  { key: 'review', label: 'Review' },
  { key: 'complete', label: 'Complete' },
];

const STEP_ORDER: PatientStep[] = [
  'welcome', 'language', 'identify', 'consent', 'complaint', 'history',
  'redflag', 'documents', 'ocr', 'extracted', 'timeline', 'review', 'complete',
];

export function ProgressIndicator({ current }: { current: PatientStep }) {
  const currentIdx = STEP_ORDER.indexOf(current);
  const stepIndices = STEPS.map((s) => STEP_ORDER.indexOf(s.key));

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {STEPS.map((step, i) => {
          const stepIdx = stepIndices[i];
          const isComplete = currentIdx > stepIdx;
          const isCurrent = currentIdx === stepIdx;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    isComplete && 'bg-primary-600 text-white',
                    isCurrent && 'bg-primary-100 text-primary-700 ring-4 ring-primary-100',
                    !isComplete && !isCurrent && 'bg-neutral-100 text-neutral-400'
                  )}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold whitespace-nowrap',
                    isCurrent ? 'text-primary-700' : isComplete ? 'text-neutral-700' : 'text-neutral-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      isComplete ? 'bg-primary-600 w-full' : 'bg-transparent w-0'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
