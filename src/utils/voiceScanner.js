// ─── Voice Emotion Scanner ───
// Uses Web Speech API to detect stress signals from speech patterns

const FILLER_WORDS = ['umm', 'uh', 'uhh', 'um', 'hmm', 'hm', 'like', 'you know', 'actually', 'basically', 'err', 'ah', 'aah'];

export class VoiceScannerEngine {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.wordTimestamps = [];
    this.pauseStart = null;
    this.pauses = [];
    this.fillerCount = 0;
    this.startTime = null;
    this.lastWordTime = null;
    this.supported = false;
    this.silenceTimer = null;

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN';
      this.supported = true;
      this._setupHandlers();
    }
  }

  _setupHandlers() {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      const now = Date.now();

      // Track pause between words
      if (this.lastWordTime) {
        const gap = now - this.lastWordTime;
        if (gap > 2000) {
          this.pauses.push(gap);
        }
      }
      this.lastWordTime = now;

      // Clear silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
      }

      // Build transcript
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      if (final) {
        this.transcript += final + ' ';
        // Count fillers in final text
        const lower = final.toLowerCase();
        FILLER_WORDS.forEach(filler => {
          const regex = new RegExp(`\\b${filler}\\b`, 'gi');
          const matches = lower.match(regex);
          if (matches) this.fillerCount += matches.length;
        });
      }

      // Set up silence detection
      this.silenceTimer = setTimeout(() => {
        this.pauses.push(3500);
        this._emitUpdate(interim);
      }, 3000);

      this._emitUpdate(interim);
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Silence detected — stress signal
        this.pauses.push(4000);
        this._emitUpdate('');
      }
      if (event.error === 'not-allowed') {
        this.supported = false;
        this.onUpdate({ error: 'Microphone permission denied' });
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch (e) {
          // Already started
        }
      }
    };
  }

  _emitUpdate(interimText) {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const wordCount = this.transcript.trim().split(/\s+/).filter(w => w).length;
    const wpm = elapsed > 0 ? Math.round((wordCount / elapsed) * 60) : 0;
    const longestPause = this.pauses.length > 0 ? Math.max(...this.pauses) : 0;

    this.onUpdate({
      transcript: this.transcript.trim(),
      interimText: interimText,
      wordCount,
      wpm,
      pauseCount: this.pauses.length,
      longestPause,
      fillerCount: this.fillerCount,
      elapsed,
      stressScore: this._calculateStress(),
      isListening: this.isListening,
    });
  }

  _calculateStress() {
    let score = 0;

    // Long pauses increase stress
    const longPauses = this.pauses.filter(p => p > 3000).length;
    score += longPauses * 20;

    // Many fillers increase stress
    score += this.fillerCount * 10;

    // Very slow or very fast speech
    const elapsed = (Date.now() - this.startTime) / 1000;
    const wordCount = this.transcript.trim().split(/\s+/).filter(w => w).length;
    const wpm = elapsed > 5 ? Math.round((wordCount / elapsed) * 60) : 0;

    if (wpm > 0 && wpm < 80) score += 15; // Too slow = uncertain
    if (wpm > 180) score += 20; // Too fast = anxious

    // Very few words after long time
    if (elapsed > 30 && wordCount < 5) score += 30;

    return Math.min(100, Math.max(0, score));
  }

  start() {
    if (!this.supported || !this.recognition) return false;

    this.transcript = '';
    this.wordTimestamps = [];
    this.pauses = [];
    this.fillerCount = 0;
    this.startTime = Date.now();
    this.lastWordTime = null;
    this.isListening = true;

    try {
      this.recognition.start();
      this._emitUpdate('');
      return true;
    } catch (e) {
      return false;
    }
  }

  stop() {
    this.isListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Already stopped
      }
    }

    const result = this.getResult();
    return result;
  }

  getResult() {
    const elapsed = (Date.now() - (this.startTime || Date.now())) / 1000;
    const wordCount = this.transcript.trim().split(/\s+/).filter(w => w).length;
    const wpm = elapsed > 0 ? Math.round((wordCount / elapsed) * 60) : 0;

    return {
      transcript: this.transcript.trim(),
      wordCount,
      wpm,
      pauseCount: this.pauses.length,
      longestPause: this.pauses.length > 0 ? Math.max(...this.pauses) : 0,
      fillerCount: this.fillerCount,
      elapsed,
      stressScore: this._calculateStress(),
    };
  }

  isSupported() {
    return this.supported;
  }
}

// Convert voice scan result into emotion signal
export function voiceToEmotion(voiceResult) {
  const { stressScore, wpm, pauseCount, fillerCount, wordCount, elapsed } = voiceResult;

  if (stressScore >= 60) return 'STRESSED';
  if (elapsed > 20 && wordCount < 3) return 'BORED';
  if (fillerCount >= 4 || pauseCount >= 3) return 'CONFUSED';
  if (wpm >= 100 && wpm <= 160 && stressScore < 30) return 'CONFIDENT';
  if (stressScore >= 35) return 'STRESSED';
  if (wpm < 80 && wordCount > 5) return 'CONFUSED';
  return 'CONFIDENT';
}
