// ─── Multilingual Engine ───
// Language config, TTS, and translation support

export const LANGUAGES = [
  { code: 'en-IN', label: 'English', flag: '🇬🇧', speechCode: 'en-IN', ttsVoice: 'en-IN' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', flag: '🇮🇳', speechCode: 'ta-IN', ttsVoice: 'ta-IN' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', flag: '🇮🇳', speechCode: 'hi-IN', ttsVoice: 'hi-IN' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', flag: '🇮🇳', speechCode: 'te-IN', ttsVoice: 'te-IN' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', speechCode: 'kn-IN', ttsVoice: 'kn-IN' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', flag: '🇮🇳', speechCode: 'ml-IN', ttsVoice: 'ml-IN' },
];

// UI strings for each language
export const UI_STRINGS = {
  'en-IN': {
    welcome: 'Your Emotion-Aware AI Tutor',
    startLearning: 'Start Learning',
    enterName: "What's your name?",
    submitAnswer: 'Submit Answer',
    nextTopic: 'Next Topic',
    retry: 'Retry',
    viewResults: 'View Results',
    skillsMastered: 'Skills Mastered',
    yourAnswer: 'Your answer:',
    typeAnswer: 'Type your answer here...',
    tapToSpeak: 'Tap to speak your answer',
    analyzing: 'Analyzing...',
    hunterFeedback: "Hunter's Feedback",
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    voiceHelp: 'Say "Help" for voice commands',
    logout: 'Logout',
    language: 'Language',
  },
  'ta-IN': {
    welcome: 'உணர்ச்சி-உணரும் AI ஆசிரியர்',
    startLearning: 'கற்கத் தொடங்கு',
    enterName: 'உங்கள் பெயர் என்ன?',
    submitAnswer: 'பதிலை சமர்ப்பி',
    nextTopic: 'அடுத்த தலைப்பு',
    retry: 'மீண்டும் முயற்சி',
    viewResults: 'முடிவுகளைப் பார்',
    skillsMastered: 'கற்ற திறன்கள்',
    yourAnswer: 'உங்கள் பதில்:',
    typeAnswer: 'இங்கே உங்கள் பதிலை எழுதுங்கள்...',
    tapToSpeak: 'பேச தட்டவும்',
    analyzing: 'பகுப்பாய்வு...',
    hunterFeedback: 'Hunter-ன் கருத்து',
    login: 'உள்நுழை',
    register: 'பதிவு செய்',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    voiceHelp: '"Help" என்று சொல்லுங்கள்',
    logout: 'வெளியேறு',
    language: 'மொழி',
  },
  'hi-IN': {
    welcome: 'आपका भावना-जागरूक AI शिक्षक',
    startLearning: 'सीखना शुरू करें',
    enterName: 'आपका नाम क्या है?',
    submitAnswer: 'उत्तर जमा करें',
    nextTopic: 'अगला विषय',
    retry: 'पुनः प्रयास',
    viewResults: 'परिणाम देखें',
    skillsMastered: 'सीखे गए कौशल',
    yourAnswer: 'आपका उत्तर:',
    typeAnswer: 'यहाँ अपना उत्तर लिखें...',
    tapToSpeak: 'बोलने के लिए टैप करें',
    analyzing: 'विश्लेषण...',
    hunterFeedback: 'Hunter की प्रतिक्रिया',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    email: 'ईमेल',
    password: 'पासवर्ड',
    voiceHelp: 'वॉयस कमांड के लिए "Help" बोलें',
    logout: 'लॉगआउट',
    language: 'भाषा',
  },
  'te-IN': {
    welcome: 'మీ ఎమోషన్-అవేర్ AI ట్యూటర్',
    startLearning: 'నేర్చుకోడం ప్రారంభించండి',
    enterName: 'మీ పేరు ఏమిటి?',
    submitAnswer: 'సమాధానం సమర్పించండి',
    nextTopic: 'తదుపరి అంశం',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    viewResults: 'ఫలితాలు చూడండి',
    skillsMastered: 'నేర్చుకున్న నైపుణ్యాలు',
    yourAnswer: 'మీ సమాధానం:',
    typeAnswer: 'మీ సమాధానాన్ని ఇక్కడ టైప్ చేయండి...',
    tapToSpeak: 'మాట్లాడటానికి ట్యాప్ చేయండి',
    analyzing: 'విశ్లేషిస్తోంది...',
    hunterFeedback: 'Hunter యొక్క ఫీడ్‌బ్యాక్',
    login: 'లాగిన్', register: 'రిజిస్టర్', email: 'ఈమెయిల్', password: 'పాస్‌వర్డ్',
    voiceHelp: 'వాయిస్ కమాండ్‌ల కోసం "Help" చెప్పండి', logout: 'లాగౌట్', language: 'భాష',
  },
  'kn-IN': {
    welcome: 'ನಿಮ್ಮ ಎಮೋಶನ್-ಅವೇರ್ AI ಟ್ಯೂಟರ್',
    startLearning: 'ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ',
    enterName: 'ನಿಮ್ಮ ಹೆಸರೇನು?',
    submitAnswer: 'ಉತ್ತರ ಸಲ್ಲಿಸಿ',
    nextTopic: 'ಮುಂದಿನ ವಿಷಯ', retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', viewResults: 'ಫಲಿತಾಂಶ ನೋಡಿ',
    skillsMastered: 'ಕಲಿತ ಕೌಶಲ್ಯಗಳು', yourAnswer: 'ನಿಮ್ಮ ಉತ್ತರ:',
    typeAnswer: 'ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...', tapToSpeak: 'ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    analyzing: 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...', hunterFeedback: 'Hunter ಪ್ರತಿಕ್ರಿಯೆ',
    login: 'ಲಾಗಿನ್', register: 'ನೋಂದಣಿ', email: 'ಇಮೇಲ್', password: 'ಪಾಸ್‌ವರ್ಡ್',
    voiceHelp: 'ವಾಯ್ಸ್ ಕಮಾಂಡ್‌ಗಳಿಗಾಗಿ "Help" ಹೇಳಿ', logout: 'ಲಾಗೌಟ್', language: 'ಭಾಷೆ',
  },
  'ml-IN': {
    welcome: 'നിങ്ങളുടെ ഇമോഷൻ-അവേർ AI ട്യൂട്ടർ',
    startLearning: 'പഠിക്കാൻ തുടങ്ങുക',
    enterName: 'നിങ്ങളുടെ പേര് എന്താണ്?',
    submitAnswer: 'ഉത്തരം സമർപ്പിക്കുക',
    nextTopic: 'അടുത്ത വിഷയം', retry: 'വീണ്ടും ശ്രമിക്കുക', viewResults: 'ഫലങ്ങൾ കാണുക',
    skillsMastered: 'പഠിച്ച കഴിവുകൾ', yourAnswer: 'നിങ്ങളുടെ ഉത്തരം:',
    typeAnswer: 'ഇവിടെ നിങ്ങളുടെ ഉത്തരം ടൈപ്പ് ചെയ്യുക...', tapToSpeak: 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    analyzing: 'വിശകലനം...', hunterFeedback: 'Hunter-ന്റെ ഫീഡ്‌ബാക്ക്',
    login: 'ലോഗിൻ', register: 'രജിസ്റ്റർ', email: 'ഇമെയിൽ', password: 'പാസ്‌വേഡ്',
    voiceHelp: 'വോയ്‌സ് കമാൻഡുകൾക്ക് "Help" പറയുക', logout: 'ലോഗൗട്ട്', language: 'ഭാഷ',
  },
};

// Get UI string with fallback to English
export function t(key, langCode = 'en-IN') {
  return UI_STRINGS[langCode]?.[key] || UI_STRINGS['en-IN']?.[key] || key;
}

// Text-to-Speech engine
export class TTSEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.supported = !!this.synth;
    this.currentLang = 'en-IN';
  }

  speak(text, lang) {
    if (!this.supported || !text) return;
    this.synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang || this.currentLang;
    utter.rate = 0.95;
    utter.pitch = 1;

    // Try to find matching voice
    const voices = this.synth.getVoices();
    const match = voices.find(v => v.lang === utter.lang) || voices.find(v => v.lang.startsWith(utter.lang.split('-')[0]));
    if (match) utter.voice = match;

    this.synth.speak(utter);
  }

  stop() {
    if (this.supported) this.synth.cancel();
  }

  setLanguage(lang) {
    this.currentLang = lang;
  }

  isSupported() { return this.supported; }
}

// Build Claude prompt with language preference
export function buildLangPrompt(langCode) {
  const langNames = { 'en-IN': 'English', 'ta-IN': 'Tamil', 'hi-IN': 'Hindi', 'te-IN': 'Telugu', 'kn-IN': 'Kannada', 'ml-IN': 'Malayalam' };
  const name = langNames[langCode] || 'English';
  if (langCode === 'en-IN') return '';
  return `IMPORTANT: Respond in ${name} language. Use ${name} script. If mixing with English technical terms is natural, that's fine. Keep the tone warm and friendly.`;
}
