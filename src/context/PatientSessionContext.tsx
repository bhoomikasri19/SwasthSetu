import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PatientSession, VoiceResponse, InputMode } from '@/types/session';
import { createEmptySession } from '@/types/session';
import type { ScannedDocument, TimelineEvent, Medication, LabValue, ChiefComplaint, RedFlag } from '@/types';

type SessionContextValue = {
  session: PatientSession;
  setLanguage: (lang: string) => void;
  setPatientName: (name: string) => void;
  setPatientAge: (age: string) => void;
  setPatientSex: (sex: 'male' | 'female' | 'other') => void;
  setAbhaId: (id: string) => void;
  setHospitalId: (id: string) => void;
  setInputMode: (mode: InputMode) => void;
  setConsent: (granted: boolean) => void;
  addVoiceResponse: (response: VoiceResponse) => void;
  setChiefComplaint: (complaint: ChiefComplaint) => void;
  setClinicalAnswer: (questionId: string, answer: string) => void;
  addDocument: (doc: ScannedDocument) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  addMedications: (meds: Medication[]) => void;
  addLabValues: (labs: LabValue[]) => void;
  addRedFlag: (flag: RedFlag) => void;
  markCompleted: () => void;
  resetSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function PatientSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PatientSession>(createEmptySession);

  const update = (partial: Partial<PatientSession>) =>
    setSession((prev) => ({ ...prev, ...partial }));

  const value: SessionContextValue = {
    session,
    setLanguage: (lang) => update({ selectedLanguage: lang }),
    setPatientName: (name) => update({ patientName: name }),
    setPatientAge: (age) => update({ patientAge: age }),
    setPatientSex: (sex) => update({ patientSex: sex }),
    setAbhaId: (id) => update({ abhaId: id }),
    setHospitalId: (id) => update({ hospitalId: id }),
    setInputMode: (mode) => update({ inputMode: mode }),
    setConsent: (granted) => update({ consentGranted: granted }),
    addVoiceResponse: (response) =>
      setSession((prev) => ({
        ...prev,
        voiceResponses: [...prev.voiceResponses, response],
      })),
    setChiefComplaint: (complaint) => update({ chiefComplaint: complaint }),
    setClinicalAnswer: (questionId, answer) =>
      setSession((prev) => ({
        ...prev,
        clinicalAnswers: { ...prev.clinicalAnswers, [questionId]: answer },
      })),
    addDocument: (doc) =>
      setSession((prev) => ({
        ...prev,
        uploadedDocuments: [...prev.uploadedDocuments, doc],
      })),
    addTimelineEvent: (event) =>
      setSession((prev) => ({
        ...prev,
        medicalTimeline: [...prev.medicalTimeline, event],
      })),
    addMedications: (meds) =>
      setSession((prev) => ({
        ...prev,
        medications: [...prev.medications, ...meds],
      })),
    addLabValues: (labs) =>
      setSession((prev) => ({
        ...prev,
        labValues: [...prev.labValues, ...labs],
      })),
    addRedFlag: (flag) =>
      setSession((prev) => ({
        ...prev,
        redFlags: [...prev.redFlags, flag],
      })),
    markCompleted: () => update({ completedAt: new Date().toISOString() }),
    resetSession: () => setSession(createEmptySession()),
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function usePatientSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('usePatientSession must be used within PatientSessionProvider');
  return ctx;
}
