export type TranslationKey =
  | 'welcome'
  | 'chooseLanguage'
  | 'selectLanguageDesc'
  | 'listen'
  | 'continue'
  | 'back'
  | 'identifyYourself'
  | 'chooseMethod'
  | 'abhaId'
  | 'qrCode'
  | 'hospitalRegNo'
  | 'newRegistration'
  | 'consentTitle'
  | 'consentDesc'
  | 'whatWeCollect'
  | 'whatWeCollectDesc'
  | 'whyWeCollect'
  | 'whyWeCollectDesc'
  | 'whoCanAccess'
  | 'whoCanAccessDesc'
  | 'withdrawAnytime'
  | 'withdrawAnytimeDesc'
  | 'listenToConsent'
  | 'iUnderstand'
  | 'iNeedHelp'
  | 'chiefComplaint'
  | 'chiefComplaintDesc'
  | 'speak'
  | 'tapToSelect'
  | 'tapAndSpeak'
  | 'listening'
  | 'youSaid'
  | 'thisIsCorrect'
  | 'speakInstead'
  | 'useTouchOptions'
  | 'useThisAnswer'
  | 'skipRemaining'
  | 'questionOf'
  | 'medikioskAI'
  | 'documentsTitle'
  | 'documentsDesc'
  | 'placeDocument'
  | 'scanDocument'
  | 'scanning'
  | 'uploadFromDevice'
  | 'retake'
  | 'useThisDocument'
  | 'analyzing'
  | 'processingDocs'
  | 'processingDesc'
  | 'extractedInfo'
  | 'extractedInfoDesc'
  | 'viewTimeline'
  | 'timeline'
  | 'timelineDesc'
  | 'reviewTitle'
  | 'reviewDesc'
  | 'submitToDoctor'
  | 'completeTitle'
  | 'completeDesc'
  | 'startNewSession'
  | 'changeLanguage'
  | 'noDocuments'
  | 'tryAgain'
  | 'useTouchInstead'
  | 'uploadInstead'
  | 'scanAgain'
  | 'uploadAnother'
  | 'inputMethodTitle'
  | 'inputMethodDesc'
  | 'voiceMode'
  | 'voiceModeDesc'
  | 'touchMode'
  | 'touchModeDesc'
  | 'couldNotUnderstand'
  | 'tryAgainVoice'
  | 'switchToTouch'
  | 'whatIsMainProblem'
  | 'micUnavailable'
  | 'cameraUnavailable'
  | 'ocrFailed'
  | 'originalDocument'
  | 'extractedInformation'
  | 'diagnoses'
  | 'medications'
  | 'labValues'
  | 'procedures'
  | 'noTextExtracted'
  | 'confirmExtracted'
  | 'addMoreDocuments'
  | 'documentsScanned'
  | 'tokenNumber'
  | 'department'
  | 'timeToComplete'
  | 'sessionCleared';

type Translations = Record<TranslationKey, string>;

export const TRANSLATIONS: Record<string, Translations> = {
  en: {
    welcome: 'Welcome to MediKiosk',
    chooseLanguage: 'Choose Your Language',
    selectLanguageDesc: 'Select your preferred language for the entire session',
    listen: 'Listen',
    continue: 'Continue',
    back: 'Back',
    identifyYourself: 'Identify yourself',
    chooseMethod: 'Choose any one method below',
    abhaId: 'ABHA ID',
    qrCode: 'Scan QR Code',
    hospitalRegNo: 'Hospital Registration No.',
    newRegistration: 'New Registration',
    consentTitle: 'Your consent matters',
    consentDesc: 'We will ask questions about your health and scan your medical documents to prepare your medical history for the doctor.',
    whatWeCollect: 'What we collect',
    whatWeCollectDesc: 'Your symptoms, medical history, medications, allergies, and scanned documents',
    whyWeCollect: 'Why we collect it',
    whyWeCollectDesc: 'To prepare a complete history so your doctor can focus on treating you',
    whoCanAccess: 'Who can access it',
    whoCanAccessDesc: 'Only your treating doctor and authorized hospital staff. Your data is encrypted.',
    withdrawAnytime: 'You can withdraw anytime',
    withdrawAnytimeDesc: 'You can stop and ask to delete your information at any point',
    listenToConsent: 'Listen to explanation',
    iUnderstand: 'I Understand & Give Consent',
    iNeedHelp: 'I Need Help',
    chiefComplaint: 'What brings you to the hospital today?',
    chiefComplaintDesc: 'Tell us your main problem — speak or tap below',
    speak: 'Speak',
    tapToSelect: 'Tap to select',
    tapAndSpeak: 'Tap and speak',
    listening: 'Listening... Tap to stop',
    youSaid: 'You said:',
    thisIsCorrect: 'This is correct — Continue',
    speakInstead: 'Speak instead',
    useTouchOptions: 'Use touch options',
    useThisAnswer: 'Use this answer',
    skipRemaining: 'Skip remaining',
    questionOf: 'Question',
    medikioskAI: 'MediKiosk AI',
    documentsTitle: "Now let's add your previous medical documents",
    documentsDesc: 'Place your document inside the frame and tap scan',
    placeDocument: 'Place document inside the frame',
    scanDocument: 'Scan Document',
    scanning: 'Scanning document...',
    uploadFromDevice: 'Upload from Device',
    retake: 'Retake',
    useThisDocument: 'Use This Document',
    analyzing: 'Analyzing your document...',
    processingDocs: 'Processing your documents',
    processingDesc: 'Our AI is reading and extracting information from your medical records',
    extractedInfo: 'OCR Results',
    extractedInfoDesc: 'Extracted information from your documents',
    viewTimeline: 'View Timeline',
    timeline: 'Medical Timeline',
    timelineDesc: 'Your complete medical history in chronological order',
    reviewTitle: 'Please review your information',
    reviewDesc: 'Make sure everything is correct before we send it to your doctor',
    submitToDoctor: 'Submit to Doctor',
    completeTitle: 'Your history is ready!',
    completeDesc: 'Your complete medical history has been prepared and sent to your doctor. Please proceed to the consultation room.',
    startNewSession: 'Start New Session',
    changeLanguage: 'Change Language',
    noDocuments: "I don't have any documents to scan — Skip",
    tryAgain: 'Try Again',
    useTouchInstead: 'Use Touch Instead',
    uploadInstead: 'Upload Document Instead',
    scanAgain: 'Scan Again',
    uploadAnother: 'Upload Another Document',
    inputMethodTitle: 'How would you like to provide your medical information?',
    inputMethodDesc: 'Choose one method that you prefer',
    voiceMode: 'Voice',
    voiceModeDesc: 'Answer the questions naturally by speaking',
    touchMode: 'Touch Screen',
    touchModeDesc: 'Answer the questions using the touchscreen',
    couldNotUnderstand: "We couldn't understand your response.",
    tryAgainVoice: 'Try Again',
    switchToTouch: 'Switch to Touch Screen',
    whatIsMainProblem: 'What is your main problem?',
    micUnavailable: 'Live voice recognition is currently unavailable.',
    cameraUnavailable: "We couldn't access your camera.",
    ocrFailed: "We couldn't read this document clearly.",
    originalDocument: 'Original Document',
    extractedInformation: 'AI-Extracted Information',
    diagnoses: 'Diagnoses',
    medications: 'Medications',
    labValues: 'Lab Values',
    procedures: 'Procedures',
    noTextExtracted: 'No text could be extracted from this document. Please try a clearer image.',
    confirmExtracted: 'Confirm & Add to Timeline',
    addMoreDocuments: 'Add more documents',
    documentsScanned: 'Documents Scanned',
    tokenNumber: 'Token Number',
    department: 'Department',
    timeToComplete: 'Time to complete',
    sessionCleared: 'Your temporary kiosk session has ended. Your sensitive data has been securely cleared from this kiosk.',
  },
  hi: {
    welcome: 'मेडिकियोस्क में आपका स्वागत है',
    chooseLanguage: 'अपनी भाषा चुनें',
    selectLanguageDesc: 'पूरे सत्र के लिए अपनी पसंदीदा भाषा चुनें',
    listen: 'सुनें',
    continue: 'आगे बढ़ें',
    back: 'वापस',
    identifyYourself: 'अपनी पहचान कराएं',
    chooseMethod: 'नीचे दी गई किसी एक विधि को चुनें',
    abhaId: 'एबीएचए आईडी',
    qrCode: 'क्यूआर कोड स्कैन करें',
    hospitalRegNo: 'अस्पताल पंजीकरण संख्या',
    newRegistration: 'नया पंजीकरण',
    consentTitle: 'आपकी सहमति महत्वपूर्ण है',
    consentDesc: 'हम आपके स्वास्थ्य के बारे में प्रश्न पूछेंगे और आपके चिकित्सा दस्तावेज़ स्कैन करेंगे ताकि डॉक्टर के लिए आपका चिकित्सा इतिहास तैयार किया जा सके।',
    whatWeCollect: 'हम क्या एकत्र करते हैं',
    whatWeCollectDesc: 'आपके लक्षण, चिकित्सा इतिहास, दवाएं, एलर्जी और स्कैन किए गए दस्तावेज़',
    whyWeCollect: 'हम इसे क्यों एकत्र करते हैं',
    whyWeCollectDesc: 'ताकि एक संपूर्ण इतिहास तैयार हो सके और आपका डॉक्टर आपके इलाज पर ध्यान दे सके',
    whoCanAccess: 'इसे कौन देख सकता है',
    whoCanAccessDesc: 'केवल आपके इलाज करने वाले डॉक्टर और अधिकृत अस्पताल स्टाफ। आपका डेटा एन्क्रिप्टेड है।',
    withdrawAnytime: 'आप कभी भी वापस ले सकते हैं',
    withdrawAnytimeDesc: 'आप किसी भी समय रुक सकते हैं और अपनी जानकारी हटाने के लिए कह सकते हैं',
    listenToConsent: 'सहमति सुनें',
    iUnderstand: 'मुझे समझ है और मुझे सहमति है',
    iNeedHelp: 'मुझे सहायता चाहिए',
    chiefComplaint: 'आप आज अस्पताल क्यों आए हैं?',
    chiefComplaintDesc: 'अपनी मुख्य समस्या बताएं — बोलें या नीचे टैप करें',
    speak: 'बोलें',
    tapToSelect: 'चुनने के लिए टैप करें',
    tapAndSpeak: 'टैप करें और बोलें',
    listening: 'सुन रहे हैं... रुकने के लिए टैप करें',
    youSaid: 'आपने कहा:',
    thisIsCorrect: 'यह सही है — आगे बढ़ें',
    speakInstead: 'इसके बजाय बोलें',
    useTouchOptions: 'टच विकल्प इस्तेमाल करें',
    useThisAnswer: 'इस उत्तर का उपयोग करें',
    skipRemaining: 'शेष छोड़ें',
    questionOf: 'प्रश्न',
    medikioskAI: 'मेडिकियोस्क एआई',
    documentsTitle: 'अब अपने पिछले चिकित्सा दस्तावेज़ जोड़ें',
    documentsDesc: 'अपना दस्तावेज़ फ्रेम के अंदर रखें और स्कैन टैप करें',
    placeDocument: 'दस्तावेज़ फ्रेम के अंदर रखें',
    scanDocument: 'दस्तावेज़ स्कैन करें',
    scanning: 'दस्तावेज़ स्कैन हो रहा है...',
    uploadFromDevice: 'डिवाइस से अपलोड करें',
    retake: 'फिर से लें',
    useThisDocument: 'इस दस्तावेज़ का उपयोग करें',
    analyzing: 'आपका दस्तावेज़ विश्लेषण हो रहा है...',
    processingDocs: 'आपके दस्तावेज़ प्रोसेस हो रहे हैं',
    processingDesc: 'हमारी एआई आपके चिकित्सा रिकॉर्ड से जानकारी पढ़ रही है',
    extractedInfo: 'ओसीआर परिणाम',
    extractedInfoDesc: 'आपके दस्तावेज़ों से निकाली गई जानकारी',
    viewTimeline: 'टाइमलाइन देखें',
    timeline: 'चिकित्सा टाइमलाइन',
    timelineDesc: 'कालानुक्रम में आपका संपूर्ण चिकित्सा इतिहास',
    reviewTitle: 'कृपया अपनी जानकारी जांचें',
    reviewDesc: 'डॉक्टर को भेजने से पहले सुनिश्चित करें कि सब कुछ सही है',
    submitToDoctor: 'डॉक्टर को भेजें',
    completeTitle: 'आपका इतिहास तैयार है!',
    completeDesc: 'आपका संपूर्ण चिकित्सा इतिहास तैयार कर दिया गया है और आपके डॉक्टर को भेज दिया गया है। कृपया परामर्श कक्ष में जाएं।',
    startNewSession: 'नया सत्र शुरू करें',
    changeLanguage: 'भाषा बदलें',
    noDocuments: 'मेरे पास स्कैन करने के लिए कोई दस्तावेज़ नहीं है — छोड़ें',
    tryAgain: 'फिर से कोशिश करें',
    useTouchInstead: 'इसके बजाय टच का उपयोग करें',
    uploadInstead: 'इसके बजाय दस्तावेज़ अपलोड करें',
    scanAgain: 'फिर से स्कैन करें',
    uploadAnother: 'दूसरा दस्तावेज़ अपलोड करें',
    inputMethodTitle: 'आप अपनी चिकित्सा जानकारी कैसे देना चाहेंगे?',
    inputMethodDesc: 'अपनी पसंद की एक विधि चुनें',
    voiceMode: 'आवाज़',
    voiceModeDesc: 'प्रश्नों के उत्तर बोलकर दें',
    touchMode: 'टच स्क्रीन',
    touchModeDesc: 'स्क्रीन पर टैप करके उत्तर दें',
    couldNotUnderstand: 'हम आपकी बात नहीं समझ पाए।',
    tryAgainVoice: 'फिर से बोलें',
    switchToTouch: 'टच स्क्रीन पर जाएं',
    whatIsMainProblem: 'आपको मुख्य रूप से क्या परेशानी है?',
    micUnavailable: 'लाइव वॉइस पहचान अभी उपलब्ध नहीं है।',
    cameraUnavailable: 'हम आपके कैमरे तक नहीं पहुंच सके।',
    ocrFailed: 'हम इस दस्तावेज़ को स्पष्ट रूप से नहीं पढ़ सके।',
    originalDocument: 'मूल दस्तावेज़',
    extractedInformation: 'एआई द्वारा निकाली गई जानकारी',
    diagnoses: 'निदान',
    medications: 'दवाएं',
    labValues: 'लैब मान',
    procedures: 'प्रक्रियाएं',
    noTextExtracted: 'इस दस्तावेज़ से कोई टेक्स्ट नहीं निकाला जा सका। कृपया एक स्पष्ट छवि आज़माएं।',
    confirmExtracted: 'पुष्टि करें और टाइमलाइन में जोड़ें',
    addMoreDocuments: 'और दस्तावेज़ जोड़ें',
    documentsScanned: 'स्कैन किए गए दस्तावेज़',
    tokenNumber: 'टोकन नंबर',
    department: 'विभाग',
    timeToComplete: 'पूरा करने का समय',
    sessionCleared: 'आपका अस्थायी कियोस्क सत्र समाप्त हो गया है। आपका संवेदनशील डेटा इस कियोस्क से सुरक्षित रूप से हटा दिया गया है।',
  },
  mr: {
    welcome: 'मेडिकियोस्कमध्ये आपले स्वागत आहे',
    chooseLanguage: 'तुमची भाषा निवडा',
    selectLanguageDesc: 'संपूर्ण सत्रासाठी तुमची पसंतीची भाषा निवडा',
    listen: 'ऐका',
    continue: 'पुढे जा',
    back: 'मागे',
    identifyYourself: 'स्वतःची ओळख करा',
    chooseMethod: 'खालील पैकी एक पद्धत निवडा',
    abhaId: 'एबीएचए आयडी',
    qrCode: 'क्यूआर कोड स्कॅन करा',
    hospitalRegNo: 'रुग्णालय नोंदणी क्रमांक',
    newRegistration: 'नवी नोंदणी',
    consentTitle: 'तुमची संमती महत्त्वाची आहे',
    consentDesc: 'आम्ही तुमच्या आरोग्याबद्दल प्रश्न विचारू आणि तुमचे वैद्यकीय दस्तावेज स्कॅन करू तुमचा वैद्यकीय इतिहास तयार करू.',
    whatWeCollect: 'आम्ही काय गोळा करतो',
    whatWeCollectDesc: 'तुमची लक्षणे, वैद्यकीय इतिहास, औषधे, ऍलर्जी आणि स्कॅन केलेले दस्तावेज',
    whyWeCollect: 'आम्ही ते का गोळा करतो',
    whyWeCollectDesc: 'संपूर्ण इतिहास तयार करण्यासाठी जेणेकरून तुमचे डॉक्टर तुमच्या उपचारावर लक्ष केंद्रित करू शकतील',
    whoCanAccess: 'ते कोण पाहू शकते',
    whoCanAccessDesc: 'फक्त तुमचे उपचार करणारे डॉक्टर आणि अधिकृत रुग्णालय कर्मचारी. तुमचा डेटा एन्क्रिप्टेड आहे.',
    withdrawAnytime: 'तुम्ही कधीही माघारी घेऊ शकता',
    withdrawAnytimeDesc: 'तुम्ही कधीही थांबू आणि तुमची माहिती डिलीट करण्यास सांगू शकता',
    listenToConsent: 'संमती ऐका',
    iUnderstand: 'मला समजते आणि मी संमती देतो',
    iNeedHelp: 'मला मदत हवी आहे',
    chiefComplaint: 'आज तुम्ही रुग्णालयात का आला आहात?',
    chiefComplaintDesc: 'तुमची मुख्य समस्या सांगा — बोला किंवा खाली टॅप करा',
    speak: 'बोला',
    tapToSelect: 'निवडण्यासाठी टॅप करा',
    tapAndSpeak: 'टॅप करा आणि बोला',
    listening: 'ऐकत आहे... थांबण्यासाठी टॅप करा',
    youSaid: 'तुम्ही म्हणालात:',
    thisIsCorrect: 'हे बरोबर आहे — पुढे जा',
    speakInstead: 'ऐवजी बोला',
    useTouchOptions: 'टच पर्याय वापरा',
    useThisAnswer: 'हे उत्तर वापरा',
    skipRemaining: 'उर्वरित वगळा',
    questionOf: 'प्रश्न',
    medikioskAI: 'मेडिकियोस्क एआय',
    documentsTitle: 'आता तुमचे जुने वैद्यकीय दस्तावेज जोडा',
    documentsDesc: 'तुमचा दस्तावेज फ्रेममध्ये ठेवा आणि स्कॅन टॅप करा',
    placeDocument: 'दस्तावेज फ्रेममध्ये ठेवा',
    scanDocument: 'दस्तावेज स्कॅन करा',
    scanning: 'दस्तावेज स्कॅन होत आहे...',
    uploadFromDevice: 'डिव्हाइसवरून अपलोड करा',
    retake: 'पुन्हा घ्या',
    useThisDocument: 'हा दस्तावेज वापरा',
    analyzing: 'तुमचा दस्तावेज विश्लेषण होत आहे...',
    processingDocs: 'तुमचे दस्तावेज प्रोसेस होत आहेत',
    processingDesc: 'आमची एआय तुमच्या वैद्यकीय रेकॉर्डमधून माहिती वाचत आहे',
    extractedInfo: 'ओसीआर निकाल',
    extractedInfoDesc: 'तुमच्या दस्तावेजांमधून काढलेली माहिती',
    viewTimeline: 'टाइमलाइन पहा',
    timeline: 'वैद्यकीय टाइमलाइन',
    timelineDesc: 'कालानुक्रमाने तुमचा संपूर्ण वैद्यकीय इतिहास',
    reviewTitle: 'कृपया तुमची माहिती तपासा',
    reviewDesc: 'डॉक्टरांना पाठवण्यापूर्वी सर्व काही बरोबर आहे याची खात्री करा',
    submitToDoctor: 'डॉक्टरांना पाठवा',
    completeTitle: 'तुमचा इतिहास तयार आहे!',
    completeDesc: 'तुमचा संपूर्ण वैद्यकीय इतिहास तयार करून तुमच्या डॉक्टरांना पाठवला आहे. कृपया सल्लामंडळात जा.',
    startNewSession: 'नवीन सत्र सुरू करा',
    changeLanguage: 'भाषा बदला',
    noDocuments: 'माझ्याकडे स्कॅन करण्यासाठी कोणतेही दस्तावेज नाहीत — वगळा',
    tryAgain: 'पुन्हा प्रयत्न करा',
    useTouchInstead: 'ऐवजी टच वापरा',
    uploadInstead: 'ऐवजी दस्तावेज अपलोड करा',
    scanAgain: 'पुन्हा स्कॅन करा',
    uploadAnother: 'दुसरा दस्तावेज अपलोड करा',
    inputMethodTitle: 'तुमची वैद्यकीय माहिती तुम्ही कशी द्यायची आहे?',
    inputMethodDesc: 'तुमची पसंतीची एक पद्धत निवडा',
    voiceMode: 'आवाज',
    voiceModeDesc: 'प्रश्नांची उत्तरे बोलून द्या',
    touchMode: 'टच स्क्रीन',
    touchModeDesc: 'स्क्रीनवर टॅप करून उत्तरे द्या',
    couldNotUnderstand: 'आम्हाला तुमचे बोलणे समजले नाही.',
    tryAgainVoice: 'पुन्हा बोला',
    switchToTouch: 'टच स्क्रीनवर जा',
    whatIsMainProblem: 'तुम्हाला मुख्यतः काय त्रास होत आहे?',
    micUnavailable: 'थेट आवाज ओळख आत्ता उपलब्ध नाही.',
    cameraUnavailable: 'आम्ही तुमच्या कॅमेऱ्यावर पोहोचू शकलो नाही.',
    ocrFailed: 'आम्ही हा दस्तावेज स्पष्टपणे वाचू शकलो नाही.',
    originalDocument: 'मूळ दस्तावेज',
    extractedInformation: 'एआयने काढलेली माहिती',
    diagnoses: 'निदान',
    medications: 'औषधे',
    labValues: 'लॅब मूल्ये',
    procedures: 'प्रक्रिया',
    noTextExtracted: 'या दस्तावेजातून कोणताही मजकूर काढता आला नाही. कृपया स्पष्ट प्रतिमा वापरा.',
    confirmExtracted: 'पुष्टी करा आणि टाइमलाइनमध्ये जोडा',
    addMoreDocuments: 'अधिक दस्तावेज जोडा',
    documentsScanned: 'स्कॅन केलेले दस्तावेज',
    tokenNumber: 'टोकन क्रमांक',
    department: 'विभाग',
    timeToComplete: 'पूर्ण करण्याची वेळ',
    sessionCleared: 'तुमचा तात्पुरता कियोस्क सत्र संपला आहे. तुमचा संवेदनशील डेटा या कियोस्कवरून सुरक्षितपणे काढला आहे.',
  },
};

export function getTranslation(lang: string, key: TranslationKey): string {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return t[key] || TRANSLATIONS.en[key];
}
