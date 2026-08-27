import { useState, useMemo } from 'react';
import { Mic, MicOff, Volume2, ArrowRight, ArrowLeft, AlertTriangle, Heart, Brain, Bone, Wind, Eye, Stethoscope, Activity, AlertCircle } from 'lucide-react';
import { VoiceWaveform } from '@/components/shared/VoiceWaveform';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { usePatientSession } from '@/context/PatientSessionContext';
import { COMPLAINT_OPTIONS, getQuestionsForComplaint, checkRedFlag } from '@/data/clinicalQuestions';
import { getTranslation, type TranslationKey } from '@/data/translations';
import type { PatientStep } from '@/types';
import { cn } from '@/utils/cn';

const COMPLAINT_ICONS: Record<string, typeof Heart> = {
  'Chest pain': Heart,
  'Breathlessness': Wind,
  'Headache': Brain,
  'Joint pain': Bone,
  'Eye problem': Eye,
  'Fever': Activity,
  'General': Stethoscope,
};

function useT() {
  const { session } = usePatientSession();
  return (key: TranslationKey) => getTranslation(session.selectedLanguage, key);
}

// ===== Chief Complaint Screen =====

export function ChiefComplaintScreen({ onNext, onRedFlag }: { onNext: (step: PatientStep) => void; onRedFlag: () => void }) {
  const { session, setChiefComplaint, addVoiceResponse } = usePatientSession();
  const { isListening, transcript, interimTranscript, error, isSupported, start, stop, reset } = useSpeechRecognition(session.selectedLanguage);
  const [complaint, setComplaint] = useState<string | null>(null);
  const [showMicError, setShowMicError] = useState(false);
  const [voiceFailed, setVoiceFailed] = useState(false);
  const t = useT();
  const isVoiceMode = session.inputMode === 'voice';

  const handleStart = () => {
    setShowMicError(false);
    start();
    if (!isSupported) setShowMicError(true);
  };

  const handleConfirmComplaint = (value: string) => {
    setChiefComplaint({ complaint: value, duration: 'Not specified', severity: 'moderate' });
    addVoiceResponse({
      questionId: 'chief_complaint',
      question: t('chiefComplaint'),
      transcript: value,
      timestamp: new Date().toISOString(),
    });

    if (checkRedFlag(value)) {
      onRedFlag();
      return;
    }
    onNext('history');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-8 py-4 flex items-center justify-between bg-white border-b border-neutral-200">
        <span className="text-sm font-semibold text-neutral-500">Step 1 of History</span>
        <button onClick={() => onNext('inputmethod')} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-8">
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{isVoiceMode ? t('chiefComplaint') : t('whatIsMainProblem')}</h1>
          <p className="text-lg text-neutral-500">{t('chiefComplaintDesc')}</p>
        </div>

        {isVoiceMode && !voiceFailed && (
          <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
            <button
              onClick={isListening ? stop : handleStart}
              className={cn(
                'relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300',
                isListening ? 'bg-danger-500 shadow-lg shadow-danger-500/30' : 'bg-primary-600 shadow-lg shadow-primary-600/30 hover:scale-105'
              )}
            >
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-full bg-danger-500 animate-pulse-ring" />
                  <span className="absolute inset-0 rounded-full bg-danger-500 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              {isListening ? <MicOff className="w-12 h-12 text-white relative z-10" /> : <Mic className="w-12 h-12 text-white relative z-10" />}
            </button>
            <p className="text-lg font-semibold text-neutral-700">
              {isListening ? t('listening') : t('tapAndSpeak')}
            </p>

            <div className="w-full max-w-md">
              <VoiceWaveform active={isListening} size="md" />
            </div>

            {isListening && interimTranscript && (
              <div className="card p-4 w-full max-w-lg animate-fade-in">
                <p className="text-sm text-neutral-400 italic">"{interimTranscript}"</p>
              </div>
            )}

            {(error || showMicError) && !isListening && (
              <div className="card p-5 w-full max-w-lg border-danger-200 bg-danger-50 animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-danger-800">{t('micUnavailable')}</p>
                    <p className="text-sm text-danger-600 mt-1">{error}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleStart} className="btn-secondary py-2 px-4 text-sm">
                        {t('tryAgain')}
                      </button>
                      <button onClick={() => setVoiceFailed(true)} className="btn-ghost py-2 px-4 text-sm">
                        {t('switchToTouch')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {transcript && !isListening && (
              <div className="card p-5 w-full max-w-lg animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 mb-1">{t('youSaid')}</p>
                    <p className="text-lg text-neutral-900">"{transcript}"</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={reset} className="btn-secondary flex-1 py-3 text-sm">
                    <Mic className="w-4 h-4" /> {t('tryAgainVoice')}
                  </button>
                  <button onClick={() => handleConfirmComplaint(transcript)} className="btn-primary flex-1 py-3 text-sm">
                    {t('thisIsCorrect')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {!transcript && !isListening && !error && !showMicError && (
              <p className="text-sm text-neutral-400 text-center max-w-sm">
                {t('tapAndSpeak')}
              </p>
            )}
          </div>
        )}

        {(!isVoiceMode || voiceFailed) && (
          <div className="max-w-3xl w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COMPLAINT_OPTIONS.map((c) => {
                const Icon = COMPLAINT_ICONS[c] || Stethoscope;
                return (
                  <button
                    key={c}
                    onClick={() => setComplaint(c)}
                    className={cn(
                      'card p-5 text-center transition-all duration-200 hover:shadow-md',
                      complaint === c ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50' : 'hover:border-primary-300'
                    )}
                  >
                    <div className={cn('w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center', complaint === c ? 'bg-primary-100' : 'bg-neutral-50')}>
                      <Icon className={cn('w-6 h-6', complaint === c ? 'text-primary-600' : 'text-neutral-400')} />
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">{c}</p>
                  </button>
                );
              })}
            </div>
            {complaint && (
              <div className="mt-6 flex items-center justify-center gap-3 animate-fade-in-up">
                <button onClick={() => handleConfirmComplaint(complaint)} className="btn-primary py-3 px-8 text-lg">
                  {t('continue')}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ===== Adaptive History Taking Screen =====

export function HistoryScreen({ onNext, onRedFlag }: { onNext: (step: PatientStep) => void; onRedFlag: () => void }) {
  const { session, setClinicalAnswer, addVoiceResponse } = usePatientSession();
  const { isListening, transcript, interimTranscript, error, isSupported, start, stop, reset } = useSpeechRecognition(session.selectedLanguage);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showMicError, setShowMicError] = useState(false);
  const t = useT();

  const questions = useMemo(() => {
    const complaint = session.chiefComplaint?.complaint || '';
    return getQuestionsForComplaint(complaint);
  }, [session.chiefComplaint]);

  const question = questions[currentIdx];
  const total = questions.length;
  const progress = ((currentIdx + 1) / total) * 100;
  const isVoiceMode = session.inputMode === 'voice';

  const handleAnswer = (value: string) => {
    setClinicalAnswer(question.id, value);
    addVoiceResponse({
      questionId: question.id,
      question: question.prompt,
      transcript: value,
      timestamp: new Date().toISOString(),
    });

    if (checkRedFlag(value)) {
      onRedFlag();
      return;
    }

    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowVoiceInput(false);
      reset();
    } else {
      onNext('documents');
    }
  };

  const handleStart = () => {
    setShowMicError(false);
    start();
    if (!isSupported) setShowMicError(true);
  };

  const isHindi = session.selectedLanguage === 'hi';
  const questionText = isHindi && question.promptHindi ? question.promptHindi : question.prompt;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-8 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">{question.module}</span>
            <p className="text-sm text-neutral-500">{t('questionOf')} {currentIdx + 1} / {total}</p>
          </div>
          <button onClick={() => onNext('documents')} className="text-sm text-neutral-400 hover:text-neutral-600 font-medium">
            {t('skipRemaining')} →
          </button>
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-8">
        <div className="max-w-2xl w-full">
          <div className="flex items-start gap-4 mb-8 animate-fade-in-up">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-sm">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-neutral-400 mb-1">{t('medikioskAI')}</p>
              <h2 className="text-2xl font-bold text-neutral-900 text-balance">{questionText}</h2>
              {isHindi && question.prompt && (
                <p className="text-sm text-neutral-400 mt-1">{question.prompt}</p>
              )}
            </div>
          </div>

          {question.options && (!isVoiceMode || !showVoiceInput) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={cn(
                    'card p-5 text-left text-lg font-semibold text-neutral-800 hover:border-primary-400 hover:bg-primary-50 hover:shadow-md transition-all duration-200 active:scale-[0.98]',
                    session.clinicalAnswers[question.id] === opt.value && 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {isVoiceMode && showVoiceInput && (
            <div className="flex flex-col items-center gap-4 mb-4 animate-fade-in">
              <button
                onClick={isListening ? stop : handleStart}
                className={cn(
                  'relative w-24 h-24 rounded-full flex items-center justify-center transition-all',
                  isListening ? 'bg-danger-500 shadow-lg shadow-danger-500/30' : 'bg-primary-600 shadow-lg shadow-primary-600/30'
                )}
              >
                {isListening && <span className="absolute inset-0 rounded-full bg-danger-500 animate-pulse-ring" />}
                {isListening ? <MicOff className="w-8 h-8 text-white relative z-10" /> : <Mic className="w-8 h-8 text-white relative z-10" />}
              </button>
              <VoiceWaveform active={isListening} size="sm" />

              {isListening && interimTranscript && (
                <p className="text-sm text-neutral-400 italic">"{interimTranscript}"</p>
              )}

              {(error || showMicError) && !isListening && (
                <div className="card p-4 w-full max-w-md border-danger-200 bg-danger-50 animate-fade-in-up">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-danger-800 text-sm">{t('couldNotUnderstand')}</p>
                      <p className="text-xs text-danger-600 mt-1">{error}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleStart} className="btn-secondary py-1.5 px-3 text-xs">
                          {t('tryAgainVoice')}
                        </button>
                        <button onClick={() => setShowVoiceInput(false)} className="btn-ghost py-1.5 px-3 text-xs">
                          {t('useTouchOptions')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {transcript && !isListening && (
                <div className="card p-4 w-full max-w-md animate-fade-in-up">
                  <p className="text-xs font-semibold text-neutral-400 mb-1">{t('youSaid')}</p>
                  <p className="text-lg text-neutral-900">"{transcript}"</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={reset} className="btn-secondary flex-1 py-2.5 text-sm">
                      <Mic className="w-4 h-4" /> {t('tryAgainVoice')}
                    </button>
                    <button onClick={() => handleAnswer(transcript)} className="btn-primary flex-1 py-2.5 text-sm">
                      {t('useThisAnswer')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mt-4">
            {isVoiceMode && !showVoiceInput && question.allowVoice && (
              <button onClick={() => { setShowVoiceInput(true); reset(); }} className="btn-secondary py-3 px-5">
                <Mic className="w-4 h-4" /> {t('speakInstead')}
              </button>
            )}
            {isVoiceMode && showVoiceInput && question.options && (
              <button onClick={() => setShowVoiceInput(false)} className="btn-secondary py-3 px-5">
                {t('useTouchOptions')}
              </button>
            )}
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const u = new SpeechSynthesisUtterance(questionText);
                  const bcp47: Record<string, string> = { hi: 'hi-IN', en: 'en-IN', mr: 'mr-IN' };
                  u.lang = bcp47[session.selectedLanguage] || 'en-IN';
                  u.rate = 0.9;
                  window.speechSynthesis.speak(u);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-neutral-500 hover:bg-neutral-100 transition font-semibold text-sm"
            >
              <Volume2 className="w-4 h-4" /> {t('listen')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== Red Flag Alert Screen =====

export function RedFlagScreen({ onContinue }: { onContinue: (step: PatientStep) => void }) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="min-h-screen bg-danger-50 flex flex-col items-center justify-center px-8 animate-fade-in">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="inline-flex w-24 h-24 rounded-full bg-danger-100 items-center justify-center mb-4 animate-scale-in">
            <AlertTriangle className="w-12 h-12 text-danger-600" />
          </div>
        </div>

        <div className="card-elevated p-8 border-danger-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-danger-100 text-danger-700 text-sm font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
              URGENT — PLEASE WAIT
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-3">
              Your answers indicate symptoms that may require immediate medical attention.
            </h1>
            <p className="text-lg text-neutral-600">
              Please alert the nearest hospital staff immediately.
            </p>
          </div>

          <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-danger-900">Priority notification sent to triage staff</p>
                <p className="text-sm text-danger-700 mt-1">
                  A nurse or attendant has been notified and will assist you shortly. Please remain at the kiosk.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-neutral-600">
              <strong>Note:</strong> MediKiosk is not a diagnostic tool. This alert is based on your reported symptoms and is meant to help hospital staff prioritize your care.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer mb-4 p-3 rounded-xl bg-white border border-neutral-200">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">
              I understand this is urgent and I will alert the hospital staff
            </span>
          </label>

          <button
            onClick={() => onContinue('history')}
            disabled={!acknowledged}
            className="btn-primary w-full py-3.5 text-lg"
          >
            Continue with history after staff assistance
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
