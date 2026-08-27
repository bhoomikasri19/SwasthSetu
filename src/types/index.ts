// ===== Core Types =====

export type Role = 'patient' | 'physician' | 'admin';

export type Language = {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
};

export type PatientStep =
  | 'welcome'
  | 'language'
  | 'identify'
  | 'consent'
  | 'inputmethod'
  | 'complaint'
  | 'history'
  | 'redflag'
  | 'documents'
  | 'ocr'
  | 'extracted'
  | 'timeline'
  | 'review'
  | 'complete';

export type HistoryMode = 'allopathic' | 'ayush';

// ===== Clinical History =====

export type Priority = 'critical' | 'important' | 'routine';

export type ChiefComplaint = {
  complaint: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
};

export type PresentIllness = {
  onset: string;
  location: string;
  character: string;
  radiation: string;
  aggravatingFactors: string[];
  relievingFactors: string[];
  associatedSymptoms: string[];
  progression: string;
  socratesNotes: Record<string, string>;
};

export type PastCondition = {
  name: string;
  diagnosedYear?: string;
  status: 'active' | 'controlled' | 'resolved';
  notes?: string;
};

export type Surgery = {
  name: string;
  approximateDate?: string;
  reason?: string;
};

export type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  source: 'patient' | 'ocr' | 'physician';
  verified: boolean;
};

export type Allergy = {
  substance: string;
  reaction?: string;
  severity: 'mild' | 'moderate' | 'severe' | 'unknown';
};

export type FamilyHistoryItem = {
  condition: string;
  relation: string;
};

export type PersonalHistory = {
  diet: string;
  sleep: string;
  physicalActivity: string;
  smoking: string;
  alcohol: string;
  tobacco: string;
  occupation: string;
};

export type ReviewOfSystems = {
  system: string;
  finding: string;
  positive: boolean;
};

export type LabValue = {
  test: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low';
  date: string;
  source: 'ocr' | 'patient' | 'physician';
};

export type ScannedDocument = {
  id: string;
  type: 'prescription' | 'lab-report' | 'discharge-summary' | 'imaging' | 'referral' | 'other';
  title: string;
  date: string;
  thumbnailText: string;
  ocrConfidence: number;
  extractedData: ExtractedDocData;
  verified: boolean;
};

export type ExtractedDocData = {
  diagnoses?: string[];
  medications?: { name: string; dosage: string; frequency: string }[];
  investigations?: LabValue[];
  procedures?: { name: string; date: string }[];
  dates?: string[];
  rawText?: string;
};

export type TimelineEvent = {
  date: string;
  label: string;
  type: 'diagnosis' | 'medication' | 'lab' | 'surgery' | 'admission' | 'visit' | 'procedure';
  documentId?: string;
};

// ===== AYUSH =====

export type AyushAssessment = {
  prakriti: string;
  vikriti: string;
  sara: string;
  samhanana: string;
  pramana: string;
  satmya: string;
  sattva: string;
  aharaShakti: string;
  vyayamaShakti: string;
  vaya: string;
  ahara: string;
  vihara: string;
  nidana: string;
  samprapti: string;
};

// ===== Patient =====

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  abhaId?: string;
  hospitalId?: string;
  tokenNumber: string;
  department: string;
  language: string;
  mode: HistoryMode;
  chiefComplaint: ChiefComplaint;
  presentIllness: PresentIllness;
  pastMedical: PastCondition[];
  pastSurgical: Surgery[];
  medications: Medication[];
  allergies: Allergy[];
  familyHistory: FamilyHistoryItem[];
  personalHistory: PersonalHistory;
  reviewOfSystems: ReviewOfSystems[];
  labValues: LabValue[];
  documents: ScannedDocument[];
  timeline: TimelineEvent[];
  ayush?: AyushAssessment;
  redFlags: RedFlag[];
  priority: Priority;
  status: 'waiting' | 'in-progress' | 'completed' | 'verified';
  startTime: string;
  completionTime?: string;
  consentGranted: boolean;
};

export type RedFlag = {
  id: string;
  symptom: string;
  severity: 'critical' | 'urgent';
  message: string;
  triggeredAt: string;
  acknowledged: boolean;
};

// ===== Physician / Admin =====

export type QueueEntry = {
  patient: Patient;
  waitTime: number;
  priority: Priority;
};

export type Kiosk = {
  id: string;
  location: string;
  status: 'available' | 'in-use' | 'offline' | 'maintenance';
  currentPatient?: string;
  sessionProgress?: number;
  lastUsed: string;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  ip: string;
};

// ===== Conversation Engine =====

export type QuestionOption = {
  label: string;
  value: string;
  followUp?: string;
};

export type ClinicalQuestion = {
  id: string;
  module: string;
  prompt: string;
  promptHindi?: string;
  options?: QuestionOption[];
  allowVoice: boolean;
  allowFreeText: boolean;
  socratesKey?: string;
  redFlagTriggers?: string[];
  followUpQuestionId?: string;
};
