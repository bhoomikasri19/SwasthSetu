import type { ClinicalQuestion } from '@/types';

export const COMPLAINT_OPTIONS = [
  'Fever', 'Cough', 'Headache', 'Chest pain',
  'Stomach pain', 'Joint pain', 'Breathlessness',
  'Dizziness', 'Eye problem', 'Skin problem', 'Weakness', 'Other',
];

const RED_FLAG_KEYWORDS = [
  'severe chest pain', 'difficulty breathing', 'cannot breathe',
  'unconscious', 'fainting', 'fainted', 'severe bleeding',
  'stroke', 'paralysis', 'facial droop', 'slurred speech',
  'crushing chest pain', 'crushing pain', 'sudden severe headache',
  'worst headache', 'coughing blood', 'vomiting blood',
  'blood in stool', 'suicidal', 'severe abdominal pain',
  'असह्य छाती में दर्द', 'सांस नहीं ले पा रहा', 'बेहोश',
  'चक्कर', 'गंभीर', 'तेज दर्द',
];

export function checkRedFlag(transcript: string): boolean {
  const lower = transcript.toLowerCase();
  return RED_FLAG_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

export function getQuestionsForComplaint(complaint: string): ClinicalQuestion[] {
  const key = complaint.toLowerCase();

  if (key.includes('chest') || key.includes('heart') || key.includes('दर्द') || key.includes('सीने')) {
    return CHEST_PAIN_QUESTIONS;
  }
  if (key.includes('fever') || key.includes('बुखार') || key.includes('temperature')) {
    return FEVER_QUESTIONS;
  }
  if (key.includes('head') || key.includes('सिर') || key.includes('सिरदर्द')) {
    return HEADACHE_QUESTIONS;
  }
  if (key.includes('cough') || key.includes('खांसी')) {
    return COUGH_QUESTIONS;
  }
  if (key.includes('stomach') || key.includes('abdom') || key.includes('पेट') || key.includes('पेट में दर्द')) {
    return ABDOMINAL_PAIN_QUESTIONS;
  }
  if (key.includes('breath') || key.includes('सांस') || key.includes('shortness')) {
    return BREATHLESSNESS_QUESTIONS;
  }
  if (key.includes('joint') || key.includes('जोड़') || key.includes('arthritis')) {
    return JOINT_PAIN_QUESTIONS;
  }
  if (key.includes('dizz') || key.includes('चक्कर')) {
    return DIZZINESS_QUESTIONS;
  }
  return GENERAL_QUESTIONS;
}

const CHEST_PAIN_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'cp_onset', module: 'HPI', prompt: 'When did the chest pain start?',
    promptHindi: 'छाती में दर्द कब से है?',
    allowVoice: true, allowFreeText: true,
    redFlagTriggers: ['sudden', 'just now', 'minutes ago'],
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 month', value: '>1 month' },
    ],
  },
  {
    id: 'cp_location', module: 'HPI', prompt: 'Where exactly is the pain in your chest?',
    promptHindi: 'दर्द छाती के किस हिस्से में है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Center of chest', value: 'central' },
      { label: 'Left side', value: 'left' },
      { label: 'Right side', value: 'right' },
      { label: 'All over', value: 'diffuse' },
    ],
  },
  {
    id: 'cp_character', module: 'HPI', prompt: 'What does the pain feel like?',
    promptHindi: 'दर्द कैसा लगता है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Sharp / stabbing', value: 'sharp' },
      { label: 'Pressing / squeezing', value: 'pressing' },
      { label: 'Burning', value: 'burning' },
      { label: 'Dull ache', value: 'dull' },
    ],
  },
  {
    id: 'cp_radiation', module: 'HPI', prompt: 'Does the pain spread anywhere else?',
    promptHindi: 'क्या दर्द कहीं और फैलता है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Left arm', value: 'left arm' },
      { label: 'Jaw / neck', value: 'jaw/neck' },
      { label: 'Back', value: 'back' },
      { label: 'No, only chest', value: 'none' },
    ],
  },
  {
    id: 'cp_severity', module: 'HPI', prompt: 'How severe is your pain right now?',
    promptHindi: 'अभी दर्द कितना तेज़ है?',
    allowVoice: true, allowFreeText: false,
    options: [
      { label: 'Mild (1–3)', value: 'mild' },
      { label: 'Moderate (4–6)', value: 'moderate' },
      { label: 'Severe (7–10)', value: 'severe' },
    ],
  },
  {
    id: 'cp_breath', module: 'ROS', prompt: 'Do you have breathlessness along with the chest pain?',
    promptHindi: 'क्या छाती में दर्द के साथ सांस फूलती है?',
    allowVoice: true, allowFreeText: true,
    redFlagTriggers: ['yes', 'severe', 'cannot breathe'],
    options: [
      { label: 'Yes, severe', value: 'severe' },
      { label: 'Yes, mild', value: 'mild' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 'cp_sweating', module: 'ROS', prompt: 'Are you experiencing sweating?',
    promptHindi: 'क्या आपको पसीना आ रहा है?',
    allowVoice: true, allowFreeText: true,
    redFlagTriggers: ['yes', 'profuse'],
    options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
  },
  {
    id: 'cp_previous', module: 'HPI', prompt: 'Have you had similar chest pain before?',
    promptHindi: 'क्या पहले भी ऐसा दर्द हुआ है?',
    allowVoice: true, allowFreeText: true,
    options: [{ label: 'Yes, previously', value: 'yes' }, { label: 'No, first time', value: 'no' }],
  },
];

const FEVER_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'fever_onset', module: 'HPI', prompt: 'When did the fever start?',
    promptHindi: 'बुखार कब से है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 week', value: '>1 week' },
    ],
  },
  {
    id: 'fever_temp', module: 'HPI', prompt: 'What is your temperature roughly?',
    promptHindi: 'आपका तापमान लगभग कितना है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Low (99–100°F)', value: 'low' },
      { label: 'Moderate (100–102°F)', value: 'moderate' },
      { label: 'High (102–104°F)', value: 'high' },
      { label: 'Very high (>104°F)', value: 'very high' },
    ],
  },
  {
    id: 'fever_pattern', module: 'HPI', prompt: 'Is the fever continuous or does it come and go?',
    promptHindi: 'क्या बुखार लगातार है या आता-जाता रहता है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Continuous', value: 'continuous' },
      { label: 'Comes and goes', value: 'intermittent' },
      { label: 'Only at night', value: 'night' },
    ],
  },
  {
    id: 'fever_chills', module: 'ROS', prompt: 'Do you have chills or shivering?',
    promptHindi: 'क्या आपको ठंड लगती है या कंपकंपी होती है?',
    allowVoice: true, allowFreeText: true,
    options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
  },
  {
    id: 'fever_assoc', module: 'ROS', prompt: 'Do you have any other symptoms with the fever?',
    promptHindi: 'क्या बुखार के साथ कोई और लक्षण हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Cough', value: 'cough' },
      { label: 'Body ache', value: 'body ache' },
      { label: 'Headache', value: 'headache' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    id: 'fever_severity', module: 'HPI', prompt: 'How severe is the fever?',
    promptHindi: 'बुखार कितना तेज़ है?',
    allowVoice: true, allowFreeText: false,
    options: [
      { label: 'Mild', value: 'mild' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'Severe', value: 'severe' },
    ],
  },
];

const HEADACHE_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'ha_onset', module: 'HPI', prompt: 'When did the headache start?',
    promptHindi: 'सिरदर्द कब से है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 month', value: '>1 month' },
    ],
  },
  {
    id: 'ha_location', module: 'HPI', prompt: 'Where is the headache located?',
    promptHindi: 'सिरदर्द कहाँ है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'One side', value: 'unilateral' },
      { label: 'Forehead', value: 'forehead' },
      { label: 'Back of head', value: 'occipital' },
      { label: 'All over', value: 'generalized' },
    ],
  },
  {
    id: 'ha_character', module: 'HPI', prompt: 'What type of headache is it?',
    promptHindi: 'सिरदर्द कैसा है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Throbbing / pulsating', value: 'throbbing' },
      { label: 'Pressing / tight band', value: 'pressing' },
      { label: 'Sharp / stabbing', value: 'sharp' },
      { label: 'Dull ache', value: 'dull' },
    ],
  },
  {
    id: 'ha_severity', module: 'HPI', prompt: 'How severe is the headache?',
    promptHindi: 'सिरदर्द कितना तेज़ है?',
    allowVoice: true, allowFreeText: false,
    options: [
      { label: 'Mild', value: 'mild' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'Severe', value: 'severe' },
    ],
  },
  {
    id: 'ha_assoc', module: 'ROS', prompt: 'Do you have nausea or sensitivity to light?',
    promptHindi: 'क्या आपको जी मिचलाता है या रोशनी से परेशानी है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Nausea', value: 'nausea' },
      { label: 'Light sensitivity', value: 'photophobia' },
      { label: 'Both', value: 'both' },
      { label: 'Neither', value: 'none' },
    ],
  },
  {
    id: 'ha_vision', module: 'ROS', prompt: 'Have you noticed any vision changes?',
    promptHindi: 'क्या आपको दृष्टि में कोई बदलाव दिखता है?',
    allowVoice: true, allowFreeText: true,
    redFlagTriggers: ['blurred', 'double vision', 'sudden'],
    options: [
      { label: 'Blurred vision', value: 'blurred' },
      { label: 'Double vision', value: 'double' },
      { label: 'No vision changes', value: 'no' },
    ],
  },
];

const COUGH_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'co_onset', module: 'HPI', prompt: 'When did the cough start?',
    promptHindi: 'खांसी कब से है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 2 weeks', value: '>2 weeks' },
    ],
  },
  {
    id: 'co_type', module: 'HPI', prompt: 'Is the cough dry or productive?',
    promptHindi: 'खांसी सूखी है या बलगम के साथ?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Dry', value: 'dry' },
      { label: 'With phlegm/sputum', value: 'productive' },
      { label: 'With blood', value: 'blood' },
    ],
  },
  {
    id: 'co_timing', module: 'HPI', prompt: 'When is the cough worse?',
    promptHindi: 'खांसी कब ज्यादा होती है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Morning', value: 'morning' },
      { label: 'Night', value: 'night' },
      { label: 'Throughout day', value: 'all day' },
    ],
  },
  {
    id: 'co_assoc', module: 'ROS', prompt: 'Do you have other symptoms with the cough?',
    promptHindi: 'खांसी के साथ कोई और लक्षण हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Fever', value: 'fever' },
      { label: 'Breathlessness', value: 'breathlessness' },
      { label: 'Chest pain', value: 'chest pain' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    id: 'co_severity', module: 'HPI', prompt: 'How severe is the cough?',
    promptHindi: 'खांसी कितनी तेज़ है?',
    allowVoice: true, allowFreeText: false,
    options: [
      { label: 'Mild', value: 'mild' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'Severe', value: 'severe' },
    ],
  },
];

const ABDOMINAL_PAIN_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'ap_onset', module: 'HPI', prompt: 'When did the stomach pain start?',
    promptHindi: 'पेट में दर्द कब से है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 month', value: '>1 month' },
    ],
  },
  {
    id: 'ap_location', module: 'HPI', prompt: 'Where exactly is the pain in your abdomen?',
    promptHindi: 'पेट में दर्द कहाँ है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Upper abdomen', value: 'upper' },
      { label: 'Lower abdomen', value: 'lower' },
      { label: 'Right side', value: 'right' },
      { label: 'Left side', value: 'left' },
      { label: 'All over', value: 'diffuse' },
    ],
  },
  {
    id: 'ap_character', module: 'HPI', prompt: 'What does the pain feel like?',
    promptHindi: 'दर्द कैसा लगता है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Sharp / stabbing', value: 'sharp' },
      { label: 'Cramping', value: 'cramping' },
      { label: 'Burning', value: 'burning' },
      { label: 'Dull ache', value: 'dull' },
    ],
  },
  {
    id: 'ap_assoc', module: 'ROS', prompt: 'Do you have any associated symptoms?',
    promptHindi: 'क्या कोई और लक्षण हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Nausea / vomiting', value: 'nausea' },
      { label: 'Diarrhea', value: 'diarrhea' },
      { label: 'Constipation', value: 'constipation' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    id: 'ap_severity', module: 'HPI', prompt: 'How severe is the pain?',
    promptHindi: 'दर्द कितना तेज़ है?',
    allowVoice: true, allowFreeText: false,
    options: [
      { label: 'Mild', value: 'mild' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'Severe', value: 'severe' },
    ],
  },
];

const BREATHLESSNESS_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'br_onset', module: 'HPI', prompt: 'When did the breathlessness start?',
    promptHindi: 'सांस फूलना कब से है?',
    allowVoice: true, allowFreeText: true,
    redFlagTriggers: ['sudden', 'just now', 'minutes ago'],
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 month', value: '>1 month' },
    ],
  },
  {
    id: 'br_trigger', module: 'HPI', prompt: 'What triggers the breathlessness?',
    promptHindi: 'सांस फूलना किससे बढ़ता है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Walking / activity', value: 'activity' },
      { label: 'Lying down', value: 'lying' },
      { label: 'At rest', value: 'rest' },
      { label: 'All the time', value: 'always' },
    ],
  },
  {
    id: 'br_severity', module: 'HPI', prompt: 'How severe is the breathlessness?',
    promptHindi: 'सांस फूलना कितना तेज़ है?',
    allowVoice: true, allowFreeText: false,
    redFlagTriggers: ['severe', 'cannot breathe'],
    options: [
      { label: 'Mild — on exertion', value: 'mild' },
      { label: 'Moderate — on mild activity', value: 'moderate' },
      { label: 'Severe — at rest', value: 'severe' },
    ],
  },
  {
    id: 'br_assoc', module: 'ROS', prompt: 'Do you have any associated symptoms?',
    promptHindi: 'क्या कोई और लक्षण हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Chest pain', value: 'chest pain' },
      { label: 'Cough', value: 'cough' },
      { label: 'Wheezing', value: 'wheezing' },
      { label: 'None', value: 'none' },
    ],
  },
];

const JOINT_PAIN_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'jp_onset', module: 'HPI', prompt: 'When did the joint pain start?',
    promptHindi: 'जोड़ों में दर्द कब से है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 month', value: '>1 month' },
    ],
  },
  {
    id: 'jp_location', module: 'HPI', prompt: 'Which joints are affected?',
    promptHindi: 'कौन से जोड़ प्रभावित हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Knees', value: 'knees' },
      { label: 'Hands / fingers', value: 'hands' },
      { label: 'Shoulders', value: 'shoulders' },
      { label: 'Multiple joints', value: 'multiple' },
    ],
  },
  {
    id: 'jp_stiffness', module: 'HPI', prompt: 'Do you have stiffness in the morning?',
    promptHindi: 'क्या सुबह अकड़न होती है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Yes, morning stiffness', value: 'yes' },
      { label: 'No stiffness', value: 'no' },
    ],
  },
  {
    id: 'jp_severity', module: 'HPI', prompt: 'How severe is the joint pain?',
    promptHindi: 'जोड़ों का दर्द कितना तेज़ है?',
    allowVoice: true, allowFreeText: false,
    options: [
      { label: 'Mild', value: 'mild' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'Severe', value: 'severe' },
    ],
  },
];

const DIZZINESS_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'dz_onset', module: 'HPI', prompt: 'When did the dizziness start?',
    promptHindi: 'चक्कर कब से आ रहे हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 month', value: '>1 month' },
    ],
  },
  {
    id: 'dz_type', module: 'HPI', prompt: 'How would you describe the dizziness?',
    promptHindi: 'चक्कर कैसे लगते हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Spinning sensation', value: 'vertigo' },
      { label: 'Lightheadedness', value: 'lightheaded' },
      { label: 'Feeling of fainting', value: 'presyncope' },
      { label: 'Unsteady', value: 'unsteady' },
    ],
  },
  {
    id: 'dz_trigger', module: 'HPI', prompt: 'What triggers the dizziness?',
    promptHindi: 'चक्कर किससे आते हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Changing position', value: 'position' },
      { label: 'Standing up quickly', value: 'standing' },
      { label: 'All the time', value: 'always' },
      { label: 'No specific trigger', value: 'none' },
    ],
  },
  {
    id: 'dz_assoc', module: 'ROS', prompt: 'Do you have any associated symptoms?',
    promptHindi: 'क्या कोई और लक्षण हैं?',
    allowVoice: true, allowFreeText: true,
    redFlagTriggers: ['fainted', 'fainting', 'loss of consciousness'],
    options: [
      { label: 'Headache', value: 'headache' },
      { label: 'Nausea', value: 'nausea' },
      { label: 'Fainting', value: 'fainting' },
      { label: 'None', value: 'none' },
    ],
  },
];

const GENERAL_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'gen_onset', module: 'HPI', prompt: 'When did your symptoms start?',
    promptHindi: 'आपके लक्षण कब से शुरू हुए?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: '2–3 days ago', value: '2-3 days' },
      { label: '1 week ago', value: '1 week' },
      { label: 'More than 1 month', value: '>1 month' },
    ],
  },
  {
    id: 'gen_severity', module: 'HPI', prompt: 'How severe are your symptoms?',
    promptHindi: 'आपके लक्षण कितने गंभीर हैं?',
    allowVoice: true, allowFreeText: false,
    options: [
      { label: 'Mild', value: 'mild' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'Severe', value: 'severe' },
    ],
  },
  {
    id: 'gen_assoc', module: 'ROS', prompt: 'Do you have any other symptoms?',
    promptHindi: 'क्या कोई और लक्षण हैं?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Fever', value: 'fever' },
      { label: 'Weakness', value: 'weakness' },
      { label: 'Weight loss', value: 'weight loss' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    id: 'gen_previous', module: 'HPI', prompt: 'Have you had this problem before?',
    promptHindi: 'क्या पहले भी यह समस्या हुई है?',
    allowVoice: true, allowFreeText: true,
    options: [
      { label: 'Yes, previously', value: 'yes' },
      { label: 'No, first time', value: 'no' },
    ],
  },
];
