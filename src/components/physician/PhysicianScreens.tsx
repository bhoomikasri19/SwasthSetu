import { useState } from 'react';
import {
  Search, Filter, Clock, ChevronRight, AlertTriangle, AlertCircle,
  Pill, FlaskConical, FileText, Activity, Heart, Brain, User,
  Check, Edit3, RotateCcw, X, ShieldAlert, Stethoscope,
  Eye, FileImage, Download, ChevronLeft, Save, CheckCircle2,
  ClipboardList, Lock,
} from 'lucide-react';
import { usePatientSession } from '@/context/PatientSessionContext';
import { PriorityBadge, LabStatusBadge, StatusBadge } from '@/components/shared/Badges';
import { Logo } from '@/components/shared/Logo';
import type { Patient, Medication } from '@/types';
import { cn } from '@/utils/cn';

// ===== Physician Queue =====

export function PhysicianQueue({ onSelectPatient }: { onSelectPatient: (p: Patient) => void }) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'important' | 'routine'>('all');
  const { session } = usePatientSession();

  const buildCurrentPatient = (): Patient => {
    return {
      id: 'current-session',
      name: session.patientName || 'Current Patient',
      age: 0,
      sex: 'other',
      tokenNumber: '—',
      department: 'OPD',
      language: session.selectedLanguage,
      mode: 'allopathic',
      chiefComplaint: session.chiefComplaint || { complaint: 'Not provided', duration: 'Not provided', severity: 'mild' },
      presentIllness: { onset: 'Not provided', location: 'Not provided', character: 'Not provided', radiation: 'Not provided', aggravatingFactors: [], relievingFactors: [], associatedSymptoms: [], progression: 'Not provided', socratesNotes: {} },
      pastMedical: [],
      pastSurgical: [],
      medications: session.medications,
      allergies: [],
      familyHistory: [],
      personalHistory: { diet: 'Not provided', sleep: 'Not provided', physicalActivity: 'Not provided', smoking: 'Not provided', alcohol: 'Not provided', tobacco: 'Not provided', occupation: 'Not provided' },
      reviewOfSystems: [],
      labValues: session.labValues,
      documents: session.uploadedDocuments,
      timeline: session.medicalTimeline,
      redFlags: session.redFlags,
      priority: session.redFlags.length > 0 ? 'critical' : 'routine',
      status: 'waiting',
      startTime: new Date().toISOString(),
      consentGranted: session.consentGranted,
    };
  };

  const currentPatient = buildCurrentPatient();
  const queue = [{ patient: currentPatient, waitTime: 0, priority: currentPatient.priority }];
  const filtered = queue.filter((q) => filter === 'all' || q.priority === filter);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" showText={false} />
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Patient Queue</h1>
            <p className="text-xs text-neutral-500">Dr. Priya Nair · Cardiology OPD</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search patient..." className="pl-9 pr-4 py-2 text-sm rounded-lg border border-neutral-200 bg-neutral-50 w-48 focus:bg-white focus:border-primary-400 outline-none transition" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-neutral-500 font-medium">On duty</span>
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="px-6 py-3 bg-white border-b border-neutral-200 flex items-center gap-6">
        <div className="flex gap-2">
          {(['all', 'critical', 'important', 'routine'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition',
                filter === f ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'text-neutral-500 hover:bg-neutral-100'
              )}
            >
              {f === 'all' ? 'All Patients' : f}
              <span className="ml-1.5 text-xs opacity-60">
                ({f === 'all' ? queue.length : queue.filter(q => q.priority === f).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Queue */}
      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <Stethoscope className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-semibold">No patient consultation data available</p>
              <p className="text-sm text-neutral-400 mt-1">Patients will appear here once they complete the intake process.</p>
            </div>
          ) : (
            filtered.map((entry) => (
              <button
                key={entry.patient.id}
                onClick={() => onSelectPatient(entry.patient)}
                className="card w-full p-4 flex items-center gap-4 hover:shadow-md hover:border-primary-300 transition-all duration-200 text-left animate-fade-in-up"
              >
                {/* Avatar */}
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-white',
                  entry.priority === 'critical' ? 'bg-danger-500' : entry.priority === 'important' ? 'bg-warning-500' : 'bg-neutral-400'
                )}>
                  {entry.patient.name.charAt(0)}
                </div>

                {/* Patient info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-neutral-900 truncate">{entry.patient.name}</p>
                    <span className="text-sm text-neutral-400">· {entry.patient.age} {entry.patient.sex}</span>
                    <PriorityBadge priority={entry.priority} size="sm" />
                  </div>
                  <p className="text-sm text-neutral-500 truncate">
                    {entry.patient.chiefComplaint.complaint} · {entry.patient.chiefComplaint.duration}
                  </p>
                </div>

                {/* Red flags */}
                {entry.patient.redFlags.length > 0 && (
                  <div className="flex items-center gap-1.5 text-danger-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold">{entry.patient.redFlags.length} red flag{entry.patient.redFlags.length > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Token */}
                <div className="text-center">
                  <p className="text-xs text-neutral-400">Token</p>
                  <p className="font-bold text-neutral-900">{entry.patient.tokenNumber}</p>
                </div>

                {/* Wait time */}
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{entry.waitTime} min</span>
                </div>

                <ChevronRight className="w-5 h-5 text-neutral-300" />
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// ===== Physician Patient Overview =====

export function PhysicianOverview({ patient, onOpenSummary, onBack }: { patient: Patient; onOpenSummary: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900">
          <ChevronLeft className="w-4 h-4" /> Back to queue
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onOpenSummary} className="btn-primary py-2 px-4 text-sm">
            <Stethoscope className="w-4 h-4" /> Open Clinical Summary
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Patient header */}
          <div className="card p-6 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-neutral-900">{patient.name}</h1>
                  <PriorityBadge priority={patient.priority} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-neutral-400">Age / Sex</p>
                    <p className="font-semibold text-neutral-900">{patient.age} / {patient.sex}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">Token</p>
                    <p className="font-semibold text-neutral-900">{patient.tokenNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">Department</p>
                    <p className="font-semibold text-neutral-900">{patient.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">ABHA Status</p>
                    <p className="font-semibold text-neutral-700">
                      {patient.abhaId ? 'Connected' : 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
                  <span>Hospital ID: {patient.hospitalId || 'Not provided'}</span>
                  <span>·</span>
                  <span>ABHA: {patient.abhaId || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Priority flags */}
          {patient.redFlags.length > 0 && (
            <div className="card p-5 mb-4 border-danger-200 bg-danger-50/50">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-danger-600" />
                <h3 className="font-bold text-danger-800">Priority Alerts</h3>
              </div>
              <div className="space-y-2">
                {patient.redFlags.map((rf) => (
                  <div key={rf.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-danger-100">
                    <AlertTriangle className={cn('w-5 h-5 shrink-0 mt-0.5', rf.severity === 'critical' ? 'text-danger-600' : 'text-warning-600')} />
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{rf.symptom}</p>
                      <p className="text-sm text-neutral-500">{rf.message}</p>
                    </div>
                    <span className="text-xs text-neutral-400">{rf.triggeredAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Documents', value: patient.documents.length, icon: FileText, color: 'primary' },
              { label: 'Medications', value: patient.medications.length, icon: Pill, color: 'secondary' },
              { label: 'Allergies', value: patient.allergies.length, icon: AlertCircle, color: 'warning' },
              { label: 'Lab Values', value: patient.labValues.length, icon: FlaskConical, color: 'accent' },
            ].map((stat, i) => (
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', `bg-${stat.color}-50`)}>
                  <stat.icon className={cn('w-5 h-5', `text-${stat.color}-600`)} />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">{stat.label}</p>
                  <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chief complaint */}
          <div className="card p-5 mb-4">
            <h3 className="section-label mb-2">Chief Complaint</h3>
            <p className="text-lg text-neutral-900">{patient.chiefComplaint.complaint}</p>
            <p className="text-sm text-neutral-500 mt-1">Duration: {patient.chiefComplaint.duration} · Severity: {patient.chiefComplaint.severity}</p>
          </div>

          {/* Open summary CTA */}
          <button onClick={onOpenSummary} className="card-elevated w-full p-6 flex items-center justify-between hover:border-primary-400 transition group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition">
                <ClipboardList className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-neutral-900">AI-Generated Clinical Summary</p>
                <p className="text-sm text-neutral-500">Complete structured history ready for review</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-neutral-300 group-hover:text-primary-500 transition" />
          </button>
        </div>
      </main>
    </div>
  );
}

// ===== Physician Clinical Summary =====

export function PhysicianSummary({ patient, onBack, onViewDocs }: { patient: Patient; onBack: () => void; onViewDocs: () => void }) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [medications, setMedications] = useState<Medication[]>(patient.medications);
  const [confirmed, setConfirmed] = useState(false);
  const [rejected, setRejected] = useState(false);

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = (idx: number, field: 'dosage' | 'frequency') => {
    setMedications(meds => meds.map((m, i) => i === idx ? { ...m, [field]: editValue, verified: true } : m));
    setEditingField(null);
  };

  const sections = [
    {
      label: 'History of Present Illness',
      content: (
        <div className="space-y-1.5 text-sm">
          <p><span className="text-neutral-400">Onset:</span> <span className="font-medium">{patient.presentIllness.onset}</span></p>
          <p><span className="text-neutral-400">Location:</span> <span className="font-medium">{patient.presentIllness.location}</span></p>
          <p><span className="text-neutral-400">Character:</span> <span className="font-medium">{patient.presentIllness.character}</span></p>
          <p><span className="text-neutral-400">Radiation:</span> <span className="font-medium">{patient.presentIllness.radiation}</span></p>
          <p><span className="text-neutral-400">Aggravating:</span> <span className="font-medium">{patient.presentIllness.aggravatingFactors.join(', ')}</span></p>
          <p><span className="text-neutral-400">Relieving:</span> <span className="font-medium">{patient.presentIllness.relievingFactors.join(', ')}</span></p>
          <p><span className="text-neutral-400">Associated:</span> <span className="font-medium">{patient.presentIllness.associatedSymptoms.join(', ')}</span></p>
          <p><span className="text-neutral-400">Progression:</span> <span className="font-medium">{patient.presentIllness.progression}</span></p>
        </div>
      ),
    },
    {
      label: 'Past Medical History',
      content: (
        <div className="space-y-1.5 text-sm">
          {patient.pastMedical.map((pm, i) => (
            <div key={i} className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-neutral-400" />
              <span className="font-medium">{pm.name}</span>
              {pm.diagnosedYear && <span className="text-neutral-400">({pm.diagnosedYear})</span>}
              <span className={cn('badge text-2xs', pm.status === 'active' ? 'bg-danger-50 text-danger-700' : 'bg-success-50 text-success-700')}>{pm.status}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Past Surgical History',
      content: (
        <div className="space-y-1.5 text-sm">
          {patient.pastSurgical.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-400" />
              <span className="font-medium">{s.name}</span>
              {s.approximateDate && <span className="text-neutral-400">({s.approximateDate})</span>}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Allergy History',
      content: (
        <div className="space-y-1.5">
          {patient.allergies.map((a, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-warning-50 rounded-lg border border-warning-200">
              <AlertCircle className="w-4 h-4 text-warning-600" />
              <span className="font-semibold text-warning-800">{a.substance}</span>
              <span className="text-sm text-warning-600">— {a.reaction}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Family History',
      content: (
        <div className="space-y-1.5 text-sm">
          {patient.familyHistory.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-neutral-400" />
              <span className="font-medium">{f.condition}</span>
              <span className="text-neutral-400">— {f.relation}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Personal History',
      content: (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="text-neutral-400">Diet:</span> <span className="font-medium">{patient.personalHistory.diet}</span></p>
          <p><span className="text-neutral-400">Sleep:</span> <span className="font-medium">{patient.personalHistory.sleep}</span></p>
          <p><span className="text-neutral-400">Activity:</span> <span className="font-medium">{patient.personalHistory.physicalActivity}</span></p>
          <p><span className="text-neutral-400">Smoking:</span> <span className="font-medium">{patient.personalHistory.smoking}</span></p>
          <p><span className="text-neutral-400">Alcohol:</span> <span className="font-medium">{patient.personalHistory.alcohol}</span></p>
          <p><span className="text-neutral-400">Occupation:</span> <span className="font-medium">{patient.personalHistory.occupation}</span></p>
        </div>
      ),
    },
    {
      label: 'Review of Systems',
      content: (
        <div className="space-y-1.5 text-sm">
          {patient.reviewOfSystems.map((ros, i) => (
            <div key={i} className="flex items-center gap-2">
              {ros.positive ? <AlertCircle className="w-4 h-4 text-warning-500" /> : <Check className="w-4 h-4 text-success-500" />}
              <span className="font-medium">{ros.system}:</span>
              <span className="text-neutral-600">{ros.finding}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Previous Investigations',
      content: (
        <div className="space-y-1.5">
          {patient.labValues.map((lab, i) => (
            <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-neutral-50">
              <span className="font-medium text-neutral-700">{lab.test}</span>
              <span className="font-bold text-neutral-900">{lab.value} {lab.unit}</span>
              <span className="text-xs text-neutral-400">Ref: {lab.referenceRange}</span>
              <LabStatusBadge status={lab.status} />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-neutral-700">{patient.name} · {patient.tokenNumber}</span>
            <PriorityBadge priority={patient.priority} size="sm" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* AI-generated warning */}
          <div className="card p-4 mb-4 border-accent-200 bg-accent-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="font-bold text-accent-800">AI-generated draft — Physician verification required</p>
              <p className="text-sm text-accent-700">Please review, edit, and confirm before using this history for clinical decisions.</p>
            </div>
          </div>

          {/* Priority flags */}
          {patient.redFlags.length > 0 && (
            <div className="card p-5 mb-4">
              <h3 className="section-label mb-3">Priority Flags</h3>
              <div className="space-y-2">
                {patient.redFlags.map((rf) => (
                  <div key={rf.id} className={cn('flex items-start gap-3 p-3 rounded-lg border',
                    rf.severity === 'critical' ? 'bg-danger-50 border-danger-200' : 'bg-warning-50 border-warning-200'
                  )}>
                    <span className={cn('text-lg', rf.severity === 'critical' ? 'text-danger-600' : 'text-warning-600')}>●</span>
                    <div>
                      <p className={cn('font-semibold', rf.severity === 'critical' ? 'text-danger-800' : 'text-warning-800')}>{rf.symptom}</p>
                      <p className={cn('text-sm', rf.severity === 'critical' ? 'text-danger-600' : 'text-warning-600')}>{rf.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical sections */}
          <div className="space-y-3 mb-4">
            {sections.map((section, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-neutral-900">{section.label}</h3>
                  <button className="text-sm text-primary-600 font-semibold hover:underline flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                {section.content}
              </div>
            ))}
          </div>

          {/* Current Medications (editable) */}
          <div className="card p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-neutral-900">Current Medications</h3>
              <span className="text-xs text-neutral-400">Click to edit any field</span>
            </div>
            <div className="space-y-2">
              {medications.map((med, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                  <Pill className="w-4 h-4 text-primary-500 shrink-0" />
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-neutral-400">Medicine</p>
                      <p className="font-semibold text-neutral-900">{med.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Dosage</p>
                      {editingField === `dosage-${i}` ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="text-sm px-2 py-0.5 rounded border border-primary-300 outline-none w-full"
                          />
                          <button onClick={() => saveEdit(i, 'dosage')} className="text-success-600"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingField(null)} className="text-neutral-400"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(`dosage-${i}`, med.dosage)} className="font-semibold text-neutral-900 hover:text-primary-600 text-left">
                          {med.dosage} <Edit3 className="w-3 h-3 inline opacity-40" />
                        </button>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Frequency</p>
                      {editingField === `freq-${i}` ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="text-sm px-2 py-0.5 rounded border border-primary-300 outline-none w-full"
                          />
                          <button onClick={() => saveEdit(i, 'frequency')} className="text-success-600"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingField(null)} className="text-neutral-400"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(`freq-${i}`, med.frequency)} className="font-semibold text-neutral-900 hover:text-primary-600 text-left">
                          {med.frequency} <Edit3 className="w-3 h-3 inline opacity-40" />
                        </button>
                      )}
                    </div>
                  </div>
                  <span className={cn('badge text-2xs', med.verified ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500')}>
                    {med.verified ? 'Verified' : med.source === 'ocr' ? 'From OCR' : 'From patient'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Medical Timeline */}
          <div className="card p-5 mb-4">
            <h3 className="font-bold text-neutral-900 mb-3">Previous Medical Timeline</h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-neutral-200" />
              {patient.timeline.map((event, i) => (
                <div key={i} className="relative mb-3 last:mb-0">
                  <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-white" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{event.date}</span>
                    <span className="text-sm text-neutral-600">{event.label}</span>
                    {event.documentId && (
                      <button onClick={onViewDocs} className="badge bg-primary-50 text-primary-700 text-2xs hover:bg-primary-100">
                        <FileText className="w-3 h-3" /> View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ABDM Integration status */}
          <div className="card p-5 mb-6">
            <h3 className="font-bold text-neutral-900 mb-3">Integration Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'ABHA Connected', status: !!patient.abhaId },
                { label: 'Consent Granted', status: patient.consentGranted },
                { label: 'History Uploaded', status: patient.chiefComplaint.complaint !== 'Not provided' },
                { label: 'HIS Synced', status: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50">
                  {item.status ? (
                    <CheckCircle2 className="w-5 h-5 text-success-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{item.label}</p>
                    <p className={cn('text-xs', item.status ? 'text-success-600' : 'text-neutral-400')}>
                      {item.status ? '✓ Complete' : 'Integration Ready / API Placeholder'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setConfirmed(true)}
              className="btn-primary flex-1 py-3.5 text-lg"
            >
              <Check className="w-5 h-5" /> Confirm Summary
            </button>
            <button className="btn-secondary py-3.5 px-5">
              <RotateCcw className="w-4 h-4" /> Ask Patient
            </button>
            <button
              onClick={() => setRejected(true)}
              className="btn-ghost py-3.5 px-5 text-danger-600 hover:bg-danger-50"
            >
              <X className="w-4 h-4" /> Reject
            </button>
          </div>

          {/* View documents */}
          <button onClick={onViewDocs} className="w-full mt-3 text-sm text-primary-600 font-semibold hover:underline flex items-center justify-center gap-1.5 py-2">
            <Eye className="w-4 h-4" /> View Original Documents
          </button>

          {/* Confirmation overlay */}
          {confirmed && (
            <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in" onClick={() => setConfirmed(false)}>
              <div className="card-elevated max-w-md w-full p-8 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="inline-flex w-16 h-16 rounded-full bg-success-100 items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">History confirmed</h3>
                <p className="text-neutral-500 mb-4">The clinical history has been verified and added to the patient's EMR record.</p>
                <div className="bg-neutral-50 rounded-xl p-4 mb-4 text-left">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Lock className="w-4 h-4 text-neutral-400" />
                    Audit logged: Physician verified AI-generated history at {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <button onClick={onBack} className="btn-primary w-full py-3">Back to Queue</button>
              </div>
            </div>
          )}

          {rejected && (
            <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in" onClick={() => setRejected(false)}>
              <div className="card-elevated max-w-md w-full p-8 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="inline-flex w-16 h-16 rounded-full bg-danger-100 items-center justify-center mb-4">
                  <X className="w-8 h-8 text-danger-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">History rejected</h3>
                <p className="text-neutral-500 mb-4">The AI-generated history has been rejected. The patient will be called for direct history-taking.</p>
                <button onClick={onBack} className="btn-secondary w-full py-3">Back to Queue</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ===== Physician Document Viewer =====

export function PhysicianDocumentViewer({ patient, onBack }: { patient: Patient; onBack: () => void }) {
  const [selectedDoc, setSelectedDoc] = useState(patient.documents[0] || null);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900">
          <ChevronLeft className="w-4 h-4" /> Back to summary
        </button>
        <span className="text-sm font-semibold text-neutral-700">{patient.name} — Original Documents</span>
      </header>

      <main className="flex-1 overflow-hidden flex">
        {/* Document list */}
        <div className="w-64 border-r border-neutral-200 bg-white overflow-y-auto scrollbar-thin p-3 space-y-2">
          {patient.documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={cn(
                'w-full p-3 rounded-xl text-left transition border',
                selectedDoc?.id === doc.id ? 'border-primary-400 bg-primary-50' : 'border-transparent hover:bg-neutral-50'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-semibold text-neutral-900 truncate">{doc.title}</span>
              </div>
              <p className="text-xs text-neutral-400">{doc.date} · {doc.type}</p>
            </button>
          ))}
        </div>

        {/* Side-by-side view */}
        {selectedDoc && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
            {/* Original document */}
            <div className="overflow-y-auto scrollbar-thin p-6 bg-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <p className="section-label">Original Document</p>
                <button className="text-sm text-primary-600 font-semibold hover:underline flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 aspect-[3/4] max-w-md mx-auto">
                <pre className="text-xs text-neutral-700 whitespace-pre-wrap font-mono leading-relaxed">{selectedDoc.thumbnailText}</pre>
              </div>
            </div>

            {/* Extracted data */}
            <div className="overflow-y-auto scrollbar-thin p-6 bg-white border-l border-neutral-200">
              <p className="section-label mb-3">AI-Extracted Information</p>
              <div className="space-y-4">
                {selectedDoc.extractedData.diagnoses && (
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Diagnoses</p>
                    {selectedDoc.extractedData.diagnoses.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm py-1.5 px-3 bg-neutral-50 rounded-lg mb-1">
                        <Activity className="w-4 h-4 text-secondary-500" />
                        <span className="text-neutral-800">{d}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedDoc.extractedData.medications && (
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Medications</p>
                    {selectedDoc.extractedData.medications.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm py-1.5 px-3 bg-neutral-50 rounded-lg mb-1">
                        <Pill className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-800">{m.name} — {m.dosage} — {m.frequency}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedDoc.extractedData.investigations && (
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Investigations</p>
                    {selectedDoc.extractedData.investigations.map((lab, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1.5 px-3 bg-neutral-50 rounded-lg mb-1">
                        <span className="text-neutral-700">{lab.test}</span>
                        <span className="font-bold text-neutral-900">{lab.value} {lab.unit}</span>
                        <LabStatusBadge status={lab.status} />
                      </div>
                    ))}
                  </div>
                )}
                {selectedDoc.extractedData.procedures && (
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Procedures</p>
                    {selectedDoc.extractedData.procedures.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm py-1.5 px-3 bg-neutral-50 rounded-lg mb-1">
                        <Activity className="w-4 h-4 text-accent-500" />
                        <span className="text-neutral-800">{p.name} — {p.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 p-3 bg-primary-50 rounded-lg flex items-center gap-2">
                <span className="badge bg-primary-100 text-primary-700">AI Extracted</span>
                <span className="text-xs text-primary-600">OCR confidence: {selectedDoc.ocrConfidence}%</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
