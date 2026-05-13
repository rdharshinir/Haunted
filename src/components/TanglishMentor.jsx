import { useState } from 'react';
import TANGLISH_METAPHORS from '../data/tanglishMetaphors';

export default function TanglishMentor({ topicKey, isActive, onToggle }) {
  const [showCode, setShowCode] = useState(false);
  const metaphor = TANGLISH_METAPHORS[topicKey];

  if (!metaphor) return null;

  return (
    <div className="animate-fade-in-up">
      {/* Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">🌶️ Tanglish Mode</span>
          <span className="text-[10px] text-hunter-text-muted">Tamil+English</span>
        </div>
        <button
          onClick={onToggle}
          className={`tanglish-toggle ${isActive ? 'active' : ''}`}
        >
          <div className="tanglish-toggle-knob" />
        </button>
      </div>

      {/* Tanglish Explanation Card */}
      {isActive && (
        <div className="tanglish-card p-4 space-y-3 animate-slide-in">
          {/* Title */}
          <div>
            <h3 className="text-base font-bold mb-1" style={{ color: '#f59e0b' }}>
              {metaphor.title}
            </h3>
            <p className="text-lg animate-tanglish-bounce inline-block">{metaphor.emoji}</p>
          </div>

          {/* Metaphor */}
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#fbbf24' }}>
              {metaphor.metaphor}
            </p>
            <p className="text-sm text-hunter-text leading-relaxed whitespace-pre-line">
              {metaphor.explanation}
            </p>
          </div>

          {/* Real World Connection */}
          <div className="glass-card p-3">
            <p className="text-xs text-hunter-text-muted mb-1">🌍 Real World Example</p>
            <p className="text-sm text-hunter-text">{metaphor.realWorld}</p>
          </div>

          {/* Code Example Toggle */}
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-xs text-hunter-accent-light underline"
          >
            {showCode ? 'Hide Code Example ▴' : 'Show Code Example ▾'}
          </button>

          {showCode && (
            <pre className="tanglish-code animate-fade-in">
              {metaphor.codeSnippet}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
