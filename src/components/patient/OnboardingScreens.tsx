import { useState, useCallback } from 'react';
import {
  Volume2, UserPlus, UserCheck, HelpCircle, Shield, Activity,
  Check, Globe, ArrowRight, ArrowLeft, QrCode, CreditCard, FileText,
  ScanLine, ShieldCheck, Lock, Eye, XCircle, Mic, Touchpad,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { LANGUAGES } from '@/data/demoData';
import { getTranslation, type TranslationKey } from '@/data/translations';
import { usePatientSession } from '@/context/PatientSessionContext';
import type { PatientStep } from '@/types';
import { cn } from '@/utils/cn';

function useTTS() {
  return useCallback((text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const bcp47: Record<string, string> = {
      hi: 'hi-IN', en: 'en-IN', mr: 'mr-IN', gu: 'gu-IN',
      bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN',
      pa: 'pa-IN', or: 'or-IN',
    };
    utterance.lang = bcp47[lang] || 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);
}

function useT() {
  const { session } = usePatientSession();
  return (key: TranslationKey) => getTranslation(session.selectedLanguage, key);
}

export function WelcomeScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Secure & Private</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className="text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-6">
            <Activity className="w-4 h-4" />
            AI-Assisted Medical History Intake
          </div>
          <h1 className="text-5xl font-bold text-neutral-900 mb-4 text-balance">
            Welcome to MediKiosk
          </h1>
          <p className="text-xl text-neutral-500 mb-10 text-balance">
            Tell us about your health before seeing the doctor. We'll prepare your complete medical history — so your doctor can spend more time treating you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <button
              onClick={() => onNext('language')}
              className="group card-elevated p-8 text-left hover:border-primary-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
                <UserCheck className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-1">Existing Patient</h3>
              <p className="text-sm text-neutral-500">I have visited before and have an ID</p>
            </button>

            <button
              onClick={() => onNext('language')}
              className="group card-elevated p-8 text-left hover:border-primary-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-accent-50 group-hover:bg-accent-100 flex items-center justify-center mb-4 transition-colors">
                <UserPlus className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-1">New Patient</h3>
              <p className="text-sm text-neutral-500">This is my first visit to this hospital</p>
            </button>

            <button
              onClick={() => setShowHelp(true)}
              className="group card-elevated p-8 text-left hover:border-secondary-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary-50 group-hover:bg-secondary-100 flex items-center justify-center mb-4 transition-colors">
                <HelpCircle className="w-7 h-7 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-1">Help</h3>
              <p className="text-sm text-neutral-500">I need assistance getting started</p>
            </button>
          </div>

          <button className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-neutral-700 font-semibold">
            <Volume2 className="w-5 h-5 text-primary-600" />
            Listen to instructions
          </button>
        </div>

        <p className="mt-12 text-sm text-neutral-400 max-w-xl text-center">
          MediKiosk assists in collecting your medical history. It does not diagnose or replace your doctor's judgment.
        </p>
      </main>

      {showHelp && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in" onClick={() => setShowHelp(false)}>
          <div className="card-elevated max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-secondary-50 flex items-center justify-center mb-4">
              <HelpCircle className="w-7 h-7 text-secondary-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">How to use MediKiosk</h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex gap-3"><span className="font-bold text-primary-600">1.</span> Choose your language</li>
              <li className="flex gap-3"><span className="font-bold text-primary-600">2.</span> Identify yourself with your hospital ID or ABHA</li>
              <li className="flex gap-3"><span className="font-bold text-primary-600">3.</span> Answer health questions by speaking or tapping</li>
              <li className="flex gap-3"><span className="font-bold text-primary-600">4.</span> Scan any old medical documents</li>
              <li className="flex gap-3"><span className="font-bold text-primary-600">5.</span> Review and submit — your doctor gets a ready summary</li>
            </ul>
            <p className="mt-4 text-sm text-neutral-400">If you need help, please ask the hospital staff near the kiosk.</p>
            <button onClick={() => onNext('language')} className="btn-primary w-full mt-6 py-3.5">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Language Selection =====

export function LanguageScreen({ onNext, onSelect }: { onNext: (step: PatientStep) => void; onSelect: (lang: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const speak = useTTS();

  const listenPhrases: Record<string, string> = {
    hi: 'हिंदी चुनें', en: 'Choose English', mr: 'मराठी निवडा',
    gu: 'ગુજરાતી પસંદ કરો', bn: 'বাংলা নির্বাচন করুন',
    ta: 'தமிழ் தேர்ந்தெடுக்கவும்', te: 'తెలుగు ఎంచుకోండి',
    kn: 'ಕನ್ನಡ ಆಯ್ಕೆಮಾಡಿ', pa: 'ਪੰਜਾਬੀ ਚੁਣੋ', or: 'ଓଡ଼ିଆ ବାଛନ୍ତୁ',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between">
        <Logo size="md" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-4">
            <Globe className="w-4 h-4" />
            Choose Your Language
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">अपनी भाषा चुनें</h1>
          <p className="text-lg text-neutral-500">Select your preferred language for the entire session</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
          {LANGUAGES.map((lang, i) => (
            <div
              key={lang.code}
              className={`card p-5 text-center transition-all duration-300 animate-fade-in-up hover:shadow-md ${
                selected === lang.code ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50' : 'hover:border-primary-300'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button
                onClick={() => setSelected(lang.code)}
                className="w-full"
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <p className="font-bold text-neutral-900 text-lg">{lang.nativeLabel}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{lang.label}</p>
                {selected === lang.code && (
                  <div className="mt-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
              <button
                onClick={() => speak(listenPhrases[lang.code] || lang.nativeLabel, lang.code)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 hover:bg-primary-50 transition text-xs font-semibold text-neutral-600"
              >
                <Volume2 className="w-3.5 h-3.5 text-primary-500" />
                {lang.code === 'en' ? 'Listen' : lang.code === 'hi' ? 'सुनें' : lang.code === 'mr' ? 'ऐका' : 'Listen'}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => { if (selected) { speak(listenPhrases[selected] || selected, selected); } }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-neutral-700 font-semibold"
          >
            <Volume2 className="w-5 h-5 text-primary-600" />
            Listen
          </button>
          <button
            onClick={() => { if (selected) { onSelect(selected); onNext('identify'); } }}
            disabled={!selected}
            className="btn-primary px-8 py-3.5 text-lg"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

// ===== Patient Identification =====

export function IdentifyScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const [method, setMethod] = useState<string | null>(null);
  const [abhaId, setAbhaId] = useState('');
  const [hospitalIdValue, setHospitalIdValue] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'other' | ''>('');
  const t = useT();
  const { setPatientName, setPatientAge, setPatientSex, setAbhaId: setSessionAbha, setHospitalId } = usePatientSession();

  const saveAndContinue = () => {
    setPatientName(name);
    setPatientAge(age);
    setPatientSex(sex || 'other');
    if (abhaId) setSessionAbha(abhaId);
    if (hospitalIdValue) setHospitalId(hospitalIdValue);
    onNext('consent');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between">
        <Logo size="md" />
        <button onClick={() => onNext('language')} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('identifyYourself')}</h1>
          <p className="text-lg text-neutral-500">{t('chooseMethod')}</p>
        </div>

        {!method && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
            {[
              { id: 'abha', label: t('abhaId'), desc: 'Use your Ayushman Bharat Health Account', icon: CreditCard, color: 'primary' },
              { id: 'qr', label: t('qrCode'), desc: 'Scan the QR on your health card', icon: QrCode, color: 'secondary' },
              { id: 'hospital', label: t('hospitalRegNo'), desc: 'Use your existing hospital patient ID', icon: FileText, color: 'accent' },
              { id: 'new', label: t('newRegistration'), desc: 'First time at this hospital', icon: UserPlus, color: 'neutral' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMethod(opt.id)}
                className="card p-6 text-left hover:shadow-md hover:border-primary-300 transition-all duration-300 flex items-center gap-4 animate-fade-in-up"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${opt.color}-50`}>
                  <opt.icon className={`w-6 h-6 text-${opt.color}-600`} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{opt.label}</h3>
                  <p className="text-sm text-neutral-500">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {method === 'abha' && (
          <div className="card-elevated max-w-md w-full p-8 animate-scale-in">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">{t('abhaId')}</h3>
            <p className="text-sm text-neutral-500 mb-4">Your 17-digit Ayushman Bharat Health Account number</p>
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="input"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  className="input"
                />
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as 'male' | 'female' | 'other')}
                  className="input"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input
                type="text"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder="e.g. 88-2941-7720-4563"
                className="input text-lg tracking-wider"
              />
            </div>
            <button onClick={saveAndContinue} disabled={!abhaId || !name} className="btn-primary w-full mt-5 py-3.5">
              {t('continue')}
            </button>
            <button onClick={() => setMethod(null)} className="btn-ghost w-full mt-2 py-2 text-sm">
              Choose different method
            </button>
          </div>
        )}

        {method === 'qr' && (
          <div className="card-elevated max-w-md w-full p-8 animate-scale-in text-center">
            <div className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 flex items-center justify-center mb-4 relative overflow-hidden">
              <ScanLine className="w-16 h-16 text-primary-400 absolute" />
              <div className="absolute inset-x-0 h-0.5 bg-primary-500 animate-pulse" style={{ top: '50%' }} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">{t('qrCode')}</h3>
            <p className="text-sm text-neutral-500 mb-4">Hold your health card QR in front of the scanner</p>
            <button onClick={() => onNext('consent')} className="btn-primary w-full py-3.5">
              {t('continue')}
            </button>
            <button onClick={() => setMethod(null)} className="btn-ghost w-full mt-2 py-2 text-sm">
              Choose different method
            </button>
          </div>
        )}

        {method === 'hospital' && (
          <div className="card-elevated max-w-md w-full p-8 animate-scale-in">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">{t('hospitalRegNo')}</h3>
            <p className="text-sm text-neutral-500 mb-4">Enter your hospital patient ID</p>
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="input"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  className="input"
                />
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as 'male' | 'female' | 'other')}
                  className="input"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input
                type="text"
                value={hospitalIdValue}
                onChange={(e) => setHospitalIdValue(e.target.value)}
                placeholder="e.g. AIIMS-OPD-2026-04823"
                className="input text-lg"
              />
            </div>
            <button onClick={saveAndContinue} disabled={!name || !hospitalIdValue} className="btn-primary w-full mt-5 py-3.5">
              {t('continue')}
            </button>
            <button onClick={() => setMethod(null)} className="btn-ghost w-full mt-2 py-2 text-sm">
              Choose different method
            </button>
          </div>
        )}

        {method === 'new' && (
          <div className="card-elevated max-w-md w-full p-8 animate-scale-in">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">{t('newRegistration')}</h3>
            <p className="text-sm text-neutral-500 mb-4">Just your name and phone number — we'll fill the rest during your visit</p>
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="input"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  className="input"
                />
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as 'male' | 'female' | 'other')}
                  className="input"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input type="tel" placeholder="Phone number" className="input" />
            </div>
            <button onClick={saveAndContinue} disabled={!name} className="btn-primary w-full mt-5 py-3.5">
              {t('continue')}
            </button>
            <button onClick={() => setMethod(null)} className="btn-ghost w-full mt-2 py-2 text-sm">
              Choose different method
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ===== Consent Screen =====

export function ConsentScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const [checked, setChecked] = useState(false);
  const t = useT();
  const speak = useTTS();
  const { session, setConsent } = usePatientSession();

  const consentText = `${t('consentTitle')}. ${t('consentDesc')} ${t('whatWeCollect')}: ${t('whatWeCollectDesc')}. ${t('whyWeCollect')}: ${t('whyWeCollectDesc')}. ${t('whoCanAccess')}: ${t('whoCanAccessDesc')}. ${t('withdrawAnytime')}: ${t('withdrawAnytimeDesc')}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
      <header className="px-8 py-6">
        <Logo size="md" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className="max-w-2xl w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary-50 items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">{t('consentTitle')}</h1>
            <p className="text-lg text-neutral-500 text-balance">
              {t('consentDesc')}
            </p>
          </div>

          <div className="card p-6 space-y-4">
            {[
              { icon: FileText, title: t('whatWeCollect'), desc: t('whatWeCollectDesc') },
              { icon: Eye, title: t('whyWeCollect'), desc: t('whyWeCollectDesc') },
              { icon: Lock, title: t('whoCanAccess'), desc: t('whoCanAccessDesc') },
              { icon: XCircle, title: t('withdrawAnytime'), desc: t('withdrawAnytimeDesc') },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{item.title}</p>
                  <p className="text-sm text-neutral-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => speak(consentText, session.selectedLanguage)}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-neutral-700 font-semibold"
          >
            <Volume2 className="w-5 h-5 text-primary-600" />
            {t('listenToConsent')}
          </button>

          <label className="mt-4 flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-primary-300 transition">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">
              I have read and understood how my health information will be used. I give my consent to proceed.
            </span>
          </label>

          <div className="flex gap-3 mt-6">
            <button className="btn-secondary flex-1 py-3.5 text-lg">
              <HelpCircle className="w-5 h-5" /> {t('iNeedHelp')}
            </button>
            <button
              onClick={() => { setConsent(true); onNext('inputmethod'); }}
              disabled={!checked}
              className="btn-primary flex-1 py-3.5 text-lg"
            >
              {t('iUnderstand')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== Input Method Selection =====

export function InputMethodScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const { session, setInputMode } = usePatientSession();
  const t = useT();
  const speak = useTTS();

  const handleSelect = (mode: 'voice' | 'touch') => {
    setInputMode(mode);
    speak(mode === 'voice' ? t('voiceModeDesc') : t('touchModeDesc'), session.selectedLanguage);
    onNext('complaint');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between">
        <Logo size="md" />
        <button onClick={() => onNext('consent')} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('inputMethodTitle')}</h1>
          <p className="text-lg text-neutral-500">{t('inputMethodDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl w-full">
          <button
            onClick={() => handleSelect('voice')}
            className="group card-elevated p-8 text-center hover:border-primary-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center mx-auto mb-4 transition-colors">
              <Mic className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{t('voiceMode')}</h3>
            <p className="text-sm text-neutral-500">{t('voiceModeDesc')}</p>
          </button>

          <button
            onClick={() => handleSelect('touch')}
            className="group card-elevated p-8 text-center hover:border-primary-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-50 group-hover:bg-accent-100 flex items-center justify-center mx-auto mb-4 transition-colors">
              <Touchpad className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{t('touchMode')}</h3>
            <p className="text-sm text-neutral-500">{t('touchModeDesc')}</p>
          </button>
        </div>
      </main>
    </div>
  );
}
