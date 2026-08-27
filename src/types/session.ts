import type { ScannedDocument, TimelineEvent, ChiefComplaint, Medication, LabValue, RedFlag } from '@/types';

export type VoiceResponse = {
  questionId: string;
  question: string;
  transcript: string;
  timestamp: string;
};

export type InputMode = 'voice' | 'touch';

export type PatientSession = {
  patientName: string;
  patientAge: string;
  patientSex: 'male' | 'female' | 'other' | '';
  abhaId: string;
  hospitalId: string;
  selectedLanguage: string;
  inputMode: InputMode | null;
  consentGranted: boolean;
  voiceResponses: VoiceResponse[];
  chiefComplaint: ChiefComplaint | null;
  clinicalAnswers: Record<string, string>;
  uploadedDocuments: ScannedDocument[];
  medicalTimeline: TimelineEvent[];
  medications: Medication[];
  labValues: LabValue[];
  redFlags: RedFlag[];
  completedAt: string | null;
};

export function createEmptySession(): PatientSession {
  return {
    patientName: '',
    patientAge: '',
    patientSex: '',
    abhaId: '',
    hospitalId: '',
    selectedLanguage: 'en',
    inputMode: null,
    consentGranted: false,
    voiceResponses: [],
    chiefComplaint: null,
    clinicalAnswers: {},
    uploadedDocuments: [],
    medicalTimeline: [],
    medications: [],
    labValues: [],
    redFlags: [],
    completedAt: null,
  };
}
