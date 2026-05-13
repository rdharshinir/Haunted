import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, AlertCircle } from 'lucide-react';
import { VoiceScannerEngine } from '../utils/voiceScanner';

export default function VoiceScanner({ onResult, onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [voiceData, setVoiceData] = useState(null);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState(null);
  const engineRef = useRef(null);

  useEffect(() => {
    return () => {
      if (engineRef.current) engineRef.current.stop();
    };
  }, []);

  const handleUpdate = (data) => {
    if (data.error) { setError(data.error); setSupported(false); return; }
    setVoiceData(data);
    if (onTranscript && data.transcript) onTranscript(data.transcript);
  };

  const startListening = () => {
    setError(null);
    const engine = new VoiceScannerEngine(handleUpdate);
    if (!engine.isSupported()) { setSupported(false); return; }
    engineRef.current = engine;
    const started = engine.start();
    if (started) setIsListening(true);
    else setError('Could not start microphone');
  };

  const stopListening = () => {
    if (!engineRef.current) return;
    const result = engineRef.current.stop();
    setIsListening(false);
    if (onResult) onResult(result);
  };

  if (!supported) {
    return (
      <div className="glass-card p-4 text-center">
        <AlertCircle size={24} className="mx-auto mb-2 text-hunter-confused" />
        <p className="text-sm text-hunter-text-muted">
          {error || 'Voice input not supported on this browser. Use text input instead.'}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Mic Button */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {isListening && (
            <>
              <div className="voice-mic-ring" style={{ animationDelay: '0s' }} />
              <div className="voice-mic-ring" style={{ animationDelay: '0.5s' }} />
            </>
          )}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
          >
            {isListening ? <Square size={28} /> : <Mic size={28} />}
          </button>
        </div>
        <p className="text-xs text-hunter-text-muted">
          {isListening ? 'Tap to stop recording' : 'Tap to speak your answer'}
        </p>
      </div>

      {/* Waveform */}
      {isListening && (
        <div className="waveform-container mt-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                '--bar-height': `${8 + Math.random() * 24}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Live Stats */}
      {voiceData && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {/* Transcript */}
          {voiceData.transcript && (
            <div className="glass-card p-3">
              <p className="text-xs text-hunter-text-muted mb-1">What I heard:</p>
              <p className="text-sm text-hunter-text">{voiceData.transcript}
                {voiceData.interimText && (
                  <span className="text-hunter-text-muted opacity-60"> {voiceData.interimText}</span>
                )}
              </p>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card p-2 text-center">
              <p className="text-lg font-bold text-hunter-accent-light">{voiceData.wpm}</p>
              <p className="text-[10px] text-hunter-text-muted">WPM</p>
            </div>
            <div className="glass-card p-2 text-center">
              <p className="text-lg font-bold text-hunter-confused">{voiceData.fillerCount}</p>
              <p className="text-[10px] text-hunter-text-muted">Fillers</p>
            </div>
            <div className="glass-card p-2 text-center">
              <p className="text-lg font-bold text-hunter-stressed">{voiceData.pauseCount}</p>
              <p className="text-[10px] text-hunter-text-muted">Pauses</p>
            </div>
          </div>

          {/* Stress Meter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-hunter-text-muted">Stress Level</span>
              <span className="text-xs font-bold" style={{
                color: voiceData.stressScore > 60 ? '#ef4444' : voiceData.stressScore > 30 ? '#f59e0b' : '#22c55e'
              }}>
                {voiceData.stressScore}%
              </span>
            </div>
            <div className="stress-meter">
              <div className="stress-meter-fill" style={{ width: `${voiceData.stressScore}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
