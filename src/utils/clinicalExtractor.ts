import type { ExtractedDocData, LabValue, Medication } from '@/types';

export function extractClinicalEntities(text: string): ExtractedDocData {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const result: ExtractedDocData = {
    diagnoses: [],
    medications: [],
    investigations: [],
    procedures: [],
    dates: [],
    rawText: text,
  };

  const diagnosisKeywords = /diagnos|diabetes|hypertension|asthma|tb|tuberculosis|pneumonia|cardiac|nephropathy|retinopathy|hypothyroid|hyperthyroid|arthritis|migraine|anemia|gastritis|copd|chf|cad|nstemi|stroke|sepsis/i;
  const medKeywords = /mg|ml|tablet|capsule|syrup|injection|tab|cap|suspension|drops|inhaler|cream|oint/i;
  const labKeywords = /hb|hba1c|glucose|cholesterol|ldl|hdl|triglyceride|creatinine|urea|hemoglobin|platelet|rbc|wbc|esr|crp|tsh|t3|t4|bilirubin|sgpt|sgot|alkaline|sodium|potassium|calcium|vitamin/i;
  const procedureKeywords = /angiography|angioplasty|surgery|biopsy|endoscopy|colonoscopy|ecg|echo|mri|ct scan|ultrasound|x-ray|dialysis|transfusion|appendectomy|cesarean|cataract/i;
  const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})/i;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      result.dates!.push(dateMatch[0]);
    }

    if (diagnosisKeywords.test(lowerLine) && !medKeywords.test(lowerLine)) {
      const cleaned = line.replace(/^dx[:\s]*/i, '').replace(/^diagnosis[:\s]*/i, '').trim();
      if (cleaned.length > 2) {
        result.diagnoses!.push(cleaned);
      }
    }

    if (medKeywords.test(lowerLine) && !labKeywords.test(lowerLine)) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const name = parts.slice(0, -2).join(' ') || parts[0];
        const dosage = parts.find((p) => /\d+\s*(mg|ml|mcg|gm)/i.test(p)) || '';
        const freq = parts.find((p) => /od|bd|tds|hs|prn|once|twice|thrice|daily/i.test(p)) || '';
        if (name) {
          result.medications!.push({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            dosage: dosage || 'Not specified',
            frequency: freq || 'As directed',
          });
        }
      }
    }

    const labMatch = line.match(/([a-z][a-z0-9\s\(\)]*?)\s*[:\-]?\s*(\d+\.?\d*)\s*(mg\/dl|g\/dl|g%|%|mmol\/l|iu\/l|ng\/ml|pg\/ml|mg\/g|u\/l|million|lakhs|\/cumm)?/i);
    if (labKeywords.test(lowerLine) && labMatch) {
      const test = labMatch[1].trim();
      const value = labMatch[2];
      const unit = labMatch[3] || '';
      const status = determineLabStatus(test, parseFloat(value));
      result.investigations!.push({
        test: test.charAt(0).toUpperCase() + test.slice(1),
        value,
        unit: unit || 'N/A',
        referenceRange: getReferenceRange(test) || 'N/A',
        status,
        date: result.dates!.slice(-1)[0] || 'Unknown',
        source: 'ocr',
      });
    }

    if (procedureKeywords.test(lowerLine)) {
      result.procedures!.push({
        name: line.replace(/^procedure[:\s]*/i, '').trim(),
        date: result.dates!.slice(-1)[0] || 'Unknown',
      });
    }
  }

  if (result.diagnoses!.length === 0) delete result.diagnoses;
  if (result.medications!.length === 0) delete result.medications;
  if (result.investigations!.length === 0) delete result.investigations;
  if (result.procedures!.length === 0) delete result.procedures;
  if (result.dates!.length === 0) delete result.dates;

  return result;
}

function determineLabStatus(test: string, value: number): 'normal' | 'high' | 'low' {
  const t = test.toLowerCase();
  if (t.includes('glucose') || t.includes('sugar') || t.includes('hba1c')) {
    if (t.includes('hba1c')) return value > 6.4 ? 'high' : 'normal';
    return value > 140 ? 'high' : value < 70 ? 'low' : 'normal';
  }
  if (t.includes('cholesterol') || t.includes('ldl')) return value > 200 ? 'high' : 'normal';
  if (t.includes('hdl')) return value < 40 ? 'low' : 'normal';
  if (t.includes('triglyceride')) return value > 150 ? 'high' : 'normal';
  if (t.includes('creatinine')) return value > 1.3 ? 'high' : 'normal';
  if (t.includes('hemoglobin') || t.includes('hb ') || t === 'hb') return value < 13 ? 'low' : 'normal';
  if (t.includes('platelet')) return value < 150 ? 'low' : 'normal';
  if (t.includes('tsh')) return value > 4.5 ? 'high' : value < 0.4 ? 'low' : 'normal';
  return 'normal';
}

function getReferenceRange(test: string): string | null {
  const t = test.toLowerCase();
  if (t.includes('hba1c')) return '< 6.5%';
  if (t.includes('fasting') && t.includes('glucose')) return '70-100 mg/dL';
  if (t.includes('glucose')) return '70-140 mg/dL';
  if (t.includes('cholesterol')) return '< 200 mg/dL';
  if (t.includes('ldl')) return '< 100 mg/dL';
  if (t.includes('hdl')) return '> 40 mg/dL';
  if (t.includes('triglyceride')) return '< 150 mg/dL';
  if (t.includes('creatinine')) return '0.6-1.3 mg/dL';
  if (t.includes('hemoglobin') || t === 'hb') return '13-17 g/dL';
  if (t.includes('platelet')) return '150-400 /cumm';
  if (t.includes('tsh')) return '0.4-4.5 mIU/L';
  return null;
}
