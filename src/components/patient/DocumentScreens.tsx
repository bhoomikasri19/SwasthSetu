import { useState, useEffect, useRef } from 'react';
import {
  Camera, FileText, ScanLine, Check, ArrowRight, ArrowLeft,
  Upload, Clock, FilePlus, Pill, FlaskConical, Activity, Calendar,
  AlertCircle, RefreshCw, CheckCircle2, ChevronRight, Sparkles,
  Lock as LockIcon, X,
} from 'lucide-react';
import { usePatientSession } from '@/context/PatientSessionContext';
import { useCamera } from '@/hooks/useCamera';
import { useOCR } from '@/hooks/useOCR';
import type { PatientStep, ScannedDocument } from '@/types';
import { cn } from '@/utils/cn';

// ===== Document Scanner Screen =====

export function DocumentScannerScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const { session, addDocument } = usePatientSession();
  const { videoRef, canvasRef, isStreaming, error: cameraError, startCamera, stopCamera, capture } = useCamera();
  const { isProcessing, extractedText, error: ocrError, confidence, processImage, reset: resetOCR } = useOCR();
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartCamera = async () => {
    setShowError(false);
    setShowCamera(true);
    await startCamera();
  };

  const handleCapture = () => {
    const dataUrl = capture();
    if (dataUrl) {
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleProcessCapture = async () => {
    if (!capturedImage) return;
    await processImage(capturedImage);
  };

  useEffect(() => {
    if (extractedText && !isProcessing && capturedImage) {
      const doc: ScannedDocument = {
        id: `doc-${Date.now()}`,
        type: 'other',
        title: `Document ${scannedDocs.length + 1}`,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        thumbnailText: extractedText.slice(0, 500),
        ocrConfidence: confidence,
        verified: false,
        extractedData: {},
      };
      addDocument(doc);
      setScannedDocs([...scannedDocs, doc]);
      setCapturedImage(null);
      resetOCR();
    }
  }, [extractedText, isProcessing, capturedImage]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      await processImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const docTypeIcons: Record<string, typeof FileText> = {
    prescription: Pill,
    'lab-report': FlaskConical,
    'discharge-summary': FileText,
    imaging: Activity,
    referral: FilePlus,
    other: FileText,
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-8 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Step 4</span>
          <p className="text-sm text-neutral-500">Document Scanning</p>
        </div>
        <button onClick={() => onNext('history')} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Now let's add your previous medical documents</h1>
            <p className="text-lg text-neutral-500">Place your document inside the frame and tap scan</p>
          </div>

          {!showCamera && !capturedImage && (
            <div className="flex flex-col items-center gap-4">
              <div className="aspect-[4/3] max-w-lg w-full rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50/50 overflow-hidden flex flex-col items-center justify-center gap-3 p-8">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <ScanLine className="w-8 h-8 text-primary-500" />
                </div>
                <p className="text-lg font-semibold text-neutral-700">Place document inside the frame</p>
                <p className="text-sm text-neutral-400 text-center max-w-xs">Prescriptions, lab reports, discharge summaries, or any medical record</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button onClick={handleStartCamera} className="btn-primary py-3.5 px-8 text-lg">
                  <Camera className="w-5 h-5" /> Scan Document
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="btn-secondary py-3.5 px-5 text-sm">
                  <Upload className="w-4 h-4" /> Upload from Device
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>
          )}

          {showCamera && !capturedImage && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative aspect-[4/3] max-w-lg w-full rounded-2xl border-2 border-primary-300 overflow-hidden bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
              </div>

              {cameraError && (
                <div className="card p-4 border-danger-200 bg-danger-50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-danger-800 text-sm">Camera unavailable</p>
                      <p className="text-xs text-danger-600 mt-1">{cameraError}</p>
                      <button onClick={() => fileInputRef.current?.click()} className="btn-secondary py-1.5 px-3 text-xs mt-2">
                        <Upload className="w-3 h-3" /> Upload Instead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button onClick={handleCapture} disabled={!isStreaming} className="btn-primary py-3.5 px-8 text-lg">
                  <Camera className="w-5 h-5" /> Capture
                </button>
                <button onClick={() => { stopCamera(); setShowCamera(false); }} className="btn-ghost py-3.5 px-5 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="flex flex-col items-center gap-4">
              <div className="aspect-[4/3] max-w-lg w-full rounded-2xl border-2 border-primary-300 overflow-hidden bg-white">
                <img src={capturedImage} alt="Captured document" className="w-full h-full object-contain" />
              </div>

              {isProcessing && (
                <div className="flex items-center gap-3 text-primary-700">
                  <div className="w-6 h-6 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
                  <p className="font-semibold">Analyzing document...</p>
                </div>
              )}

              {ocrError && !isProcessing && (
                <div className="card p-4 border-warning-200 bg-warning-50 w-full max-w-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-warning-800 text-sm">Couldn't read document</p>
                      <p className="text-xs text-warning-600 mt-1">{ocrError}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleProcessCapture} className="btn-secondary py-1.5 px-3 text-xs">
                          <RefreshCw className="w-3 h-3" /> Try Again
                        </button>
                        <button onClick={() => { setCapturedImage(null); setShowCamera(false); }} className="btn-ghost py-1.5 px-3 text-xs">
                          Retake
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isProcessing && !ocrError && (
                <div className="flex items-center gap-3">
                  <button onClick={() => { setCapturedImage(null); setShowCamera(false); }} className="btn-secondary py-3.5 px-5">
                    <RefreshCw className="w-4 h-4" /> Retake
                  </button>
                  <button onClick={() => { setCapturedImage(null); setShowCamera(false); }} className="btn-primary py-3.5 px-5">
                    <Check className="w-4 h-4" /> Use This Document
                  </button>
                </div>
              )}
            </div>
          )}

          {scannedDocs.length > 0 && (
            <div className="mt-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-neutral-900">Scanned documents ({scannedDocs.length})</h3>
                <button onClick={() => onNext('review')} className="btn-primary py-2.5 px-5 text-sm">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {scannedDocs.map((doc) => {
                  const Icon = docTypeIcons[doc.type] || FileText;
                  return (
                    <div key={doc.id} className="card p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">{doc.title}</p>
                        <p className="text-xs text-neutral-400">{doc.date} · OCR confidence: {doc.ocrConfidence}%</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-success-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <button onClick={() => onNext('review')} className="text-sm text-neutral-400 hover:text-neutral-600 font-medium">
              I don't have any documents to scan — Skip
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== OCR Processing Screen =====

export function OCRProcessingScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    'Detecting text from scanned image...',
    'Recognizing medical terminology...',
    'Extracting diagnoses and medications...',
    'Matching lab values to reference ranges...',
    'Organizing extracted information...',
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => setStep(step + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      onNext('extracted');
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-8">
      <div className="max-w-md w-full text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Processing your documents</h1>
        <p className="text-neutral-500 mb-8">Our AI is reading and extracting information from your medical records</p>

        <div className="space-y-3 text-left">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {i < step ? (
                <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
              ) : i === step ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-neutral-200 shrink-0" />
              )}
              <span className={cn('text-sm', i < step ? 'text-neutral-400' : i === step ? 'text-neutral-900 font-semibold' : 'text-neutral-300')}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Extracted Information Screen =====

export function ExtractedInfoScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const { session } = usePatientSession();
  const docs = session.uploadedDocuments;

  if (docs.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-8">
        <div className="max-w-md text-center">
          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">No documents scanned</h1>
          <p className="text-neutral-500 mb-6">You can add documents later or continue to review.</p>
          <button onClick={() => onNext('review')} className="btn-primary py-3.5 px-8">
            Continue to Review <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-8 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">OCR Results</span>
          <p className="text-sm text-neutral-500">Extracted information from your documents</p>
        </div>
        <button onClick={() => onNext('review')} className="btn-primary py-2.5 px-5 text-sm">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {docs.map((doc) => (
            <div key={doc.id} className="card-elevated overflow-hidden">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{doc.title}</p>
                    <p className="text-xs text-neutral-400">{doc.date} · OCR confidence: {doc.ocrConfidence}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-primary-50 text-primary-700">AI Extracted</span>
                  {doc.ocrConfidence < 90 && (
                    <span className="badge bg-warning-50 text-warning-700">
                      <AlertCircle className="w-3 h-3" /> Verify
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <p className="section-label mb-3">Extracted Text</p>
                <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                  <pre className="text-xs text-neutral-600 whitespace-pre-wrap font-mono leading-relaxed">{doc.thumbnailText}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ===== Medical Timeline Screen =====

const TIMELINE_ICONS = {
  diagnosis: Activity,
  medication: Pill,
  lab: FlaskConical,
  surgery: FilePlus,
  admission: FileText,
  visit: Calendar,
  procedure: Activity,
};

const TIMELINE_COLORS = {
  diagnosis: 'bg-secondary-100 text-secondary-600',
  medication: 'bg-primary-100 text-primary-600',
  lab: 'bg-accent-100 text-accent-600',
  surgery: 'bg-danger-100 text-danger-600',
  admission: 'bg-warning-100 text-warning-600',
  visit: 'bg-neutral-100 text-neutral-600',
  procedure: 'bg-secondary-100 text-secondary-600',
};

export function TimelineScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const { session } = usePatientSession();
  const timeline = session.medicalTimeline;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-8 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Medical Timeline</span>
          <p className="text-sm text-neutral-500">Your medical history in chronological order</p>
        </div>
        <button onClick={() => onNext('review')} className="btn-primary py-2.5 px-5 text-sm">
          Review Summary <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your Medical Timeline</h1>
          <p className="text-neutral-500 mb-8">Events from your documents and interview, organized chronologically</p>

          {timeline.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No timeline events yet. Events will appear here after scanning documents.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-neutral-200" />
              <div className="space-y-6">
                {timeline.map((event, i) => {
                  const Icon = TIMELINE_ICONS[event.type] || Activity;
                  const colorClass = TIMELINE_COLORS[event.type] || 'bg-neutral-100 text-neutral-600';
                  return (
                    <div key={i} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-neutral-50', colorClass)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-neutral-900">{event.date}</span>
                          {event.documentId && (
                            <span className="badge bg-primary-50 text-primary-700 text-2xs">
                              <FileText className="w-3 h-3" /> Document
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-700">{event.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button onClick={() => onNext('review')} className="btn-primary py-3.5 px-8 text-lg">
              Review Summary <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== Review Screen =====

export function ReviewScreen({ onNext }: { onNext: (step: PatientStep) => void }) {
  const { session, markCompleted } = usePatientSession();

  const handleSubmit = () => {
    markCompleted();
    onNext('complete');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="px-8 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Step 5</span>
          <p className="text-sm text-neutral-500">Review your information</p>
        </div>
        <button onClick={() => onNext('documents')} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Please review your information</h1>
            <p className="text-neutral-500">Make sure everything is correct before we send it to your doctor</p>
          </div>

          <div className="space-y-4">
            {/* Chief complaint */}
            <div className="card p-5">
              <h3 className="font-bold text-neutral-900 mb-3">Chief Complaint</h3>
              {session.chiefComplaint ? (
                <p className="text-neutral-700">{session.chiefComplaint.complaint} — {session.chiefComplaint.duration} — Severity: {session.chiefComplaint.severity}</p>
              ) : (
                <p className="text-neutral-400 italic">Not provided</p>
              )}
            </div>

            {/* Clinical answers */}
            {Object.keys(session.clinicalAnswers).length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold text-neutral-900 mb-3">History Responses</h3>
                <div className="space-y-2">
                  {Object.entries(session.clinicalAnswers).map(([qId, answer]) => (
                    <div key={qId} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-700"><strong>{qId}:</strong> {answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medications */}
            <div className="card p-5">
              <h3 className="font-bold text-neutral-900 mb-3">Current Medications</h3>
              {session.medications.length > 0 ? (
                <div className="space-y-2">
                  {session.medications.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Pill className="w-4 h-4 text-primary-500" />
                      <span className="text-neutral-800">{m.name} {m.dosage} — {m.frequency}</span>
                      <span className="badge bg-neutral-100 text-neutral-500 text-2xs">{m.source === 'ocr' ? 'From document' : 'You told us'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400 italic">No medications reported</p>
              )}
            </div>

            {/* Lab values */}
            {session.labValues.length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold text-neutral-900 mb-3">Lab Results</h3>
                <div className="space-y-1.5">
                  {session.labValues.map((lab, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700">{lab.test}</span>
                      <span className="font-semibold text-neutral-900">{lab.value} {lab.unit}</span>
                      <span className={cn(
                        'badge text-2xs',
                        lab.status === 'normal' && 'bg-success-50 text-success-700',
                        lab.status === 'high' && 'bg-danger-50 text-danger-700',
                        lab.status === 'low' && 'bg-warning-50 text-warning-700'
                      )}>
                        {lab.status === 'high' ? 'Above range' : lab.status === 'low' ? 'Below range' : 'Normal'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="card p-5">
              <h3 className="font-bold text-neutral-900 mb-3">Documents Scanned ({session.uploadedDocuments.length})</h3>
              {session.uploadedDocuments.length > 0 ? (
                <div className="space-y-2">
                  {session.uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 text-sm">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-700 flex-1">{doc.title}</span>
                      <span className="text-xs text-neutral-400">{doc.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400 italic">No documents scanned</p>
              )}
            </div>

            {/* Red flags */}
            {session.redFlags.length > 0 && (
              <div className="card p-5 border-danger-200">
                <h3 className="font-bold text-danger-800 mb-3">Important Alerts</h3>
                <div className="space-y-2">
                  {session.redFlags.map((rf, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-danger-500" />
                      <span className="text-neutral-800 font-semibold">{rf.symptom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={handleSubmit} className="btn-primary w-full py-4 text-lg mt-6">
            <CheckCircle2 className="w-5 h-5" /> Submit to Doctor
          </button>
        </div>
      </main>
    </div>
  );
}

// ===== Complete Screen =====

export function CompleteScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col items-center justify-center px-8">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <div className="inline-flex w-24 h-24 rounded-full bg-success-100 items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-success-600" />
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-3">Your history is ready!</h1>
        <p className="text-lg text-neutral-500 mb-6 text-balance">
          Your complete medical history has been prepared and sent to your doctor. Please proceed to the consultation room.
        </p>

        <div className="bg-neutral-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-neutral-600">
            <LockIcon className="w-4 h-4 inline mr-1.5 text-neutral-400" />
            Your temporary kiosk session has ended. Your sensitive data has been securely cleared from this kiosk.
          </p>
        </div>

        <button onClick={onRestart} className="btn-secondary py-3.5 px-8">
          Start New Session
        </button>
      </div>
    </div>
  );
}
