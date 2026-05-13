// ─── Global Voice Control ───
// Platform-wide voice navigation and command system

const COMMANDS = [
  { phrases: ['go to learn', 'open learn', 'learning', 'start learning'], action: 'nav:learn' },
  { phrases: ['go to duel', 'open duel', 'duel mode', 'peer duel'], action: 'nav:duel' },
  { phrases: ['go to dashboard', 'open dashboard', 'show eq', 'emotion dashboard'], action: 'nav:dashboard' },
  { phrases: ['go to discover', 'open discover', 'job radar', 'dream project'], action: 'nav:discover' },
  { phrases: ['go to profile', 'open profile', 'my profile', 'skill dna', 'dna card'], action: 'nav:profile' },
  { phrases: ['next topic', 'next', 'continue', 'move on'], action: 'lesson:next' },
  { phrases: ['submit', 'submit answer', 'send answer', 'done'], action: 'lesson:submit' },
  { phrases: ['retry', 'try again', 'redo'], action: 'lesson:retry' },
  { phrases: ['tanglish', 'tanglish mode', 'tamil mode', 'switch tanglish'], action: 'toggle:tanglish' },
  { phrases: ['whatsapp', 'chat mode', 'whatsapp mode', 'chat view'], action: 'toggle:whatsapp' },
  { phrases: ['card mode', 'card view', 'normal view'], action: 'toggle:card' },
  { phrases: ['voice mode', 'start voice', 'microphone', 'mic on'], action: 'toggle:voice' },
  { phrases: ['text mode', 'type mode', 'keyboard'], action: 'toggle:text' },
  { phrases: ['help', 'what can i say', 'commands', 'voice help'], action: 'help' },
  { phrases: ['logout', 'sign out', 'log out'], action: 'auth:logout' },
];

export class VoiceControlEngine {
  constructor(onCommand, lang = 'en-IN') {
    this.onCommand = onCommand;
    this.recognition = null;
    this.isActive = false;
    this.lang = lang;
    this.supported = false;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      this.recognition = new SR();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = lang;
      this.supported = true;
      this._setup();
    }
  }

  _setup() {
    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          this._matchCommand(transcript);
        }
      }
    };
    this.recognition.onend = () => {
      if (this.isActive) {
        try { this.recognition.start(); } catch {}
      }
    };
    this.recognition.onerror = () => {};
  }

  _matchCommand(transcript) {
    for (const cmd of COMMANDS) {
      for (const phrase of cmd.phrases) {
        if (transcript.includes(phrase)) {
          this.onCommand(cmd.action, transcript);
          return;
        }
      }
    }
    // No match — pass as freeform voice input
    this.onCommand('freeform', transcript);
  }

  start() {
    if (!this.supported) return false;
    this.isActive = true;
    try { this.recognition.start(); return true; }
    catch { return false; }
  }

  stop() {
    this.isActive = false;
    try { this.recognition.stop(); } catch {}
  }

  setLanguage(lang) {
    this.lang = lang;
    if (this.recognition) this.recognition.lang = lang;
    if (this.isActive) { this.stop(); this.start(); }
  }

  isSupported() { return this.supported; }
}

export function getCommandHelp() {
  return [
    { category: 'Navigation', cmds: ['Go to Learn', 'Go to Duel', 'Go to Dashboard', 'Go to Discover', 'Go to Profile'] },
    { category: 'Lesson', cmds: ['Submit', 'Next Topic', 'Retry'] },
    { category: 'Modes', cmds: ['Tanglish Mode', 'WhatsApp Mode', 'Card Mode', 'Voice Mode', 'Text Mode'] },
    { category: 'System', cmds: ['Help', 'Logout'] },
  ];
}
