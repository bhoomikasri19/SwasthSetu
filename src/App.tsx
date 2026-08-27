import { useState } from 'react';
import { Stethoscope, Monitor, Shield, Heart, Globe } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { ProgressIndicator } from '@/components/patient/ProgressIndicator';
import { PatientSessionProvider, usePatientSession } from '@/context/PatientSessionContext';
import {
  WelcomeScreen, LanguageScreen, IdentifyScreen, ConsentScreen, InputMethodScreen,
} from '@/components/patient/OnboardingScreens';
import {
  ChiefComplaintScreen, HistoryScreen, RedFlagScreen,
} from '@/components/patient/HistoryScreens';
import {
  DocumentScannerScreen, OCRProcessingScreen, ExtractedInfoScreen,
  TimelineScreen, ReviewScreen, CompleteScreen,
} from '@/components/patient/DocumentScreens';
import {
  PhysicianQueue, PhysicianOverview, PhysicianSummary, PhysicianDocumentViewer,
} from '@/components/physician/PhysicianScreens';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LANGUAGES } from '@/data/demoData';
import type { Role, PatientStep, Patient } from '@/types';
import { cn } from '@/utils/cn';

type PhysicianView = 'queue' | 'overview' | 'summary' | 'docs';

function AppContent() {
  const [role, setRole] = useState<Role | null>(null);
  const [patientStep, setPatientStep] = useState<PatientStep>('welcome');
  const [physicianView, setPhysicianView] = useState<PhysicianView>('queue');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { session, setLanguage, resetSession } = usePatientSession();

  const buildPatientFromSession = (): Patient => {
    const s = session;
    return {
      id: 'current-session',
      name: s.patientName || 'Current Patient',
      age: s.patientAge ? parseInt(s.patientAge, 10) || 0 : 0,
      sex: (s.patientSex || 'other') as 'male' | 'female' | 'other',
      abhaId: s.abhaId || undefined,
      hospitalId: s.hospitalId || undefined,
      tokenNumber: '—',
      department: 'OPD',
      language: s.selectedLanguage,
      mode: 'allopathic',
      chiefComplaint: s.chiefComplaint || { complaint: 'Not provided', duration: 'Not provided', severity: 'mild' },
      presentIllness: { onset: 'Not provided', location: 'Not provided', character: 'Not provided', radiation: 'Not provided', aggravatingFactors: [], relievingFactors: [], associatedSymptoms: [], progression: 'Not provided', socratesNotes: {} },
      pastMedical: [],
      pastSurgical: [],
      medications: s.medications,
      allergies: [],
      familyHistory: [],
      personalHistory: { diet: 'Not provided', sleep: 'Not provided', physicalActivity: 'Not provided', smoking: 'Not provided', alcohol: 'Not provided', tobacco: 'Not provided', occupation: 'Not provided' },
      reviewOfSystems: [],
      labValues: s.labValues,
      documents: s.uploadedDocuments,
      timeline: s.medicalTimeline,
      redFlags: s.redFlags,
      priority: s.redFlags.length > 0 ? 'critical' : 'routine',
      status: s.completedAt ? 'completed' : 'waiting',
      startTime: new Date().toISOString(),
      completionTime: s.completedAt || undefined,
      consentGranted: s.consentGranted,
    };
  };

  const handlePatientStep = (step: PatientStep) => setPatientStep(step);
  const handleRedFlag = () => setPatientStep('redflag');

  const restartPatient = () => {
    resetSession();
    setPatientStep('welcome');
    setRole('patient');
  };

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setPhysicianView('overview');
  };

  // ===== Role Landing Page =====
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
        <header className="px-8 py-6 flex items-center justify-between">
          <Logo size="md" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
          <div className="text-center max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-6">
              <Heart className="w-4 h-4" />
              AI Clinical History Intake Platform
            </div>
            <h1 className="text-5xl font-bold text-neutral-900 mb-4 text-balance">
              Capture the patient's complete story before the doctor enters the room.
            </h1>
            <p className="text-xl text-neutral-500 mb-12 text-balance">
              MediKiosk helps patients provide their medical history through voice or touch, scans their documents, and prepares a structured summary for the doctor — saving precious consultation time in high-volume Indian hospitals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              <button
                onClick={() => setRole('patient')}
                className="group card-elevated p-8 text-left hover:border-primary-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
                  <Heart className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-1">Patient Kiosk</h3>
                <p className="text-sm text-neutral-500">Start the patient self-service history intake flow</p>
              </button>

              <button
                onClick={() => setRole('physician')}
                className="group card-elevated p-8 text-left hover:border-secondary-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary-50 group-hover:bg-secondary-100 flex items-center justify-center mb-4 transition-colors">
                  <Stethoscope className="w-7 h-7 text-secondary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-1">Physician Dashboard</h3>
                <p className="text-sm text-neutral-500">View AI-prepared patient histories and verify them</p>
              </button>

              <button
                onClick={() => setRole('admin')}
                className="group card-elevated p-8 text-left hover:border-accent-400 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-50 group-hover:bg-accent-100 flex items-center justify-center mb-4 transition-colors">
                  <Monitor className="w-7 h-7 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-1">Admin Dashboard</h3>
                <p className="text-sm text-neutral-500">Monitor kiosks, analytics, red flags, and audit logs</p>
              </button>
            </div>
          </div>

          <p className="mt-12 text-sm text-neutral-400 max-w-xl text-center">
            MediKiosk assists in collecting medical history. It does not diagnose or replace a doctor's judgment.
          </p>
        </main>

        <footer className="px-8 py-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-400">
          <span>MediKiosk — AI Clinical History Intake for Indian Hospitals</span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Consent-first · Encrypted · ABDM-ready
          </span>
        </footer>
      </div>
    );
  }

  // ===== Patient Flow =====
  if (role === 'patient') {
    const showProgress = !['welcome', 'language', 'complete'].includes(patientStep);
    const currentLang = LANGUAGES.find((l) => l.code === session.selectedLanguage);

    return (
      <div className="min-h-screen flex flex-col">
        {showProgress && <ProgressIndicator current={patientStep} />}
        <div className="flex-1 flex flex-col">
          {patientStep === 'welcome' && <WelcomeScreen onNext={handlePatientStep} />}
          {patientStep === 'language' && (
            <LanguageScreen onNext={handlePatientStep} onSelect={setLanguage} />
          )}
          {patientStep === 'identify' && <IdentifyScreen onNext={handlePatientStep} />}
          {patientStep === 'consent' && <ConsentScreen onNext={handlePatientStep} />}
          {patientStep === 'inputmethod' && <InputMethodScreen onNext={handlePatientStep} />}
          {patientStep === 'complaint' && (
            <ChiefComplaintScreen onNext={handlePatientStep} onRedFlag={handleRedFlag} />
          )}
          {patientStep === 'history' && (
            <HistoryScreen onNext={handlePatientStep} onRedFlag={handleRedFlag} />
          )}
          {patientStep === 'redflag' && <RedFlagScreen onContinue={handlePatientStep} />}
          {patientStep === 'documents' && <DocumentScannerScreen onNext={handlePatientStep} />}
          {patientStep === 'ocr' && <OCRProcessingScreen onNext={handlePatientStep} />}
          {patientStep === 'extracted' && <ExtractedInfoScreen onNext={handlePatientStep} />}
          {patientStep === 'timeline' && <TimelineScreen onNext={handlePatientStep} />}
          {patientStep === 'review' && <ReviewScreen onNext={handlePatientStep} />}
          {patientStep === 'complete' && <CompleteScreen onRestart={restartPatient} />}
        </div>
        {/* Change Language button — visible during patient flow after language selection */}
        {!['welcome', 'language', 'complete'].includes(patientStep) && currentLang && (
          <button
            onClick={() => setPatientStep('language')}
            className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-neutral-200 shadow-md hover:border-primary-300 hover:bg-primary-50 transition text-sm font-semibold text-neutral-700"
          >
            <Globe className="w-4 h-4 text-primary-500" />
            {currentLang.nativeLabel}
          </button>
        )}
        <RoleSwitcher role={role} setRole={setRole} />
      </div>
    );
  }

  // ===== Physician Flow =====
  if (role === 'physician') {
    const patient = selectedPatient || buildPatientFromSession();
    return (
      <div className="min-h-screen flex flex-col">
        {physicianView === 'queue' && <PhysicianQueue onSelectPatient={handleSelectPatient} />}
        {physicianView === 'overview' && (
          <PhysicianOverview
            patient={patient}
            onOpenSummary={() => setPhysicianView('summary')}
            onBack={() => setPhysicianView('queue')}
          />
        )}
        {physicianView === 'summary' && (
          <PhysicianSummary
            patient={patient}
            onBack={() => setPhysicianView('overview')}
            onViewDocs={() => setPhysicianView('docs')}
          />
        )}
        {physicianView === 'docs' && (
          <PhysicianDocumentViewer
            patient={patient}
            onBack={() => setPhysicianView('summary')}
          />
        )}
        <RoleSwitcher role={role} setRole={setRole} />
      </div>
    );
  }

  // ===== Admin Flow =====
  return (
    <div className="min-h-screen flex flex-col">
      <AdminDashboard />
      <RoleSwitcher role={role} setRole={setRole} />
    </div>
  );
}

// ===== Floating Role Switcher =====
function RoleSwitcher({ role, setRole }: { role: Role; setRole: (r: Role | null) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 card-elevated p-2 w-52 animate-fade-in-up">
          <button
            onClick={() => { setRole(null); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-neutral-100 transition text-sm font-semibold text-neutral-700"
          >
            <Heart className="w-4 h-4 text-primary-500" /> Patient Kiosk
          </button>
          <button
            onClick={() => { setRole('physician'); setOpen(false); }}
            className={cn('w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-neutral-100 transition text-sm font-semibold', role === 'physician' ? 'text-secondary-600 bg-secondary-50' : 'text-neutral-700')}
          >
            <Stethoscope className="w-4 h-4 text-secondary-500" /> Physician Dashboard
          </button>
          <button
            onClick={() => { setRole('admin'); setOpen(false); }}
            className={cn('w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-neutral-100 transition text-sm font-semibold', role === 'admin' ? 'text-accent-600 bg-accent-50' : 'text-neutral-700')}
          >
            <Monitor className="w-4 h-4 text-accent-500" /> Admin Dashboard
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-neutral-900 text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
        aria-label="Switch role"
      >
        <Shield className="w-5 h-5" />
      </button>
    </div>
  );
}

function App() {
  return (
    <PatientSessionProvider>
      <AppContent />
    </PatientSessionProvider>
  );
}

export default App;
