import { useState } from 'react';
import { Mic, MicOff, HelpCircle, X, Volume2 } from 'lucide-react';
import { getCommandHelp } from '../utils/voiceControl';

export default function VoiceControlBar({ isActive, onToggle, lastCommand, ttsEnabled, onTtsToggle }) {
  const [showHelp, setShowHelp] = useState(false);
  const commands = getCommandHelp();

  return (
    <>
      {/* Floating Voice Control Button */}
      <div className="vc-float-container">
        {lastCommand && (
          <div className="vc-last-cmd animate-fade-in">
            <span>🎙️ "{lastCommand}"</span>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={onTtsToggle} className={`vc-tts-btn ${ttsEnabled ? 'active' : ''}`} title="Text-to-Speech">
            <Volume2 size={14} />
          </button>
          <button onClick={() => setShowHelp(true)} className="vc-help-btn" title="Voice Commands">
            <HelpCircle size={14} />
          </button>
          <button onClick={onToggle} className={`vc-mic-btn ${isActive ? 'vc-mic-active' : ''}`}
            title={isActive ? 'Stop voice control' : 'Start voice control'}>
            {isActive ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="vc-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="vc-modal animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Mic size={16} className="text-hunter-accent-light" /> Voice Commands
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-hunter-text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {commands.map(cat => (
                <div key={cat.category}>
                  <p className="text-[10px] text-hunter-text-muted uppercase tracking-wider mb-1">{cat.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.cmds.map(cmd => (
                      <span key={cmd} className="vc-cmd-tag">"{cmd}"</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-hunter-text-muted mt-3">Voice commands work in your selected language</p>
          </div>
        </div>
      )}
    </>
  );
}
