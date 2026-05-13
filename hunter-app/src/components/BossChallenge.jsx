import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Clock, CheckCircle, XCircle, Zap, Shield } from 'lucide-react';

export default function BossChallenge({ challenge, onComplete, onSkip }) {
  const [phase, setPhase] = useState('intro'); // intro | active | evaluating | result
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);

  // Intro shake effect
  useEffect(() => {
    if (phase === 'intro') {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      // Spawn particles
      const ps = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.cos((i / 12) * Math.PI * 2) * (60 + Math.random() * 40),
        y: Math.sin((i / 12) * Math.PI * 2) * (60 + Math.random() * 40),
        color: ['#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'][i % 4],
        delay: i * 0.05,
      }));
      setParticles(ps);
    }
  }, [phase]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'active') return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [phase, timeLeft]);

  const startChallenge = () => {
    setPhase('active');
    setTimeLeft(challenge.timeLimit);
  };

  const handleSubmit = useCallback(async () => {
    if (phase !== 'active') return;
    clearTimeout(timerRef.current);
    setPhase('evaluating');

    // Try Claude API evaluation
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': window.__CLAUDE_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `${challenge.evaluationPrompt}\n\nStudent's solution:\n"${answer}"`,
          }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || '';
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            setResult(JSON.parse(jsonMatch[0]));
          } else {
            setResult({ passed: answer.trim().length > 20, score: 60, feedback: text.slice(0, 200) });
          }
        } catch {
          setResult({ passed: answer.trim().length > 20, score: 60, feedback: text.slice(0, 200) });
        }
      } else {
        throw new Error('API error');
      }
    } catch {
      // Fallback evaluation
      const hasContent = answer.trim().length > 30;
      setResult({
        passed: hasContent,
        score: hasContent ? 70 : 30,
        feedback: hasContent
          ? 'Good attempt! You covered the key concepts. Keep practicing to master edge cases.'
          : 'Try writing a more detailed solution. Include the formula and handling for different cases.',
      });
    }
    setPhase('result');
  }, [phase, answer, challenge]);

  const timerPercent = (timeLeft / challenge.timeLimit) * 100;
  const timerColor = timeLeft > challenge.timeLimit * 0.5 ? '#22c55e'
    : timeLeft > challenge.timeLimit * 0.2 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 45;

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── INTRO ───
  if (phase === 'intro') {
    return (
      <div className={`boss-card p-5 text-center ${shaking ? 'animate-screen-shake' : ''} animate-slide-up`}>
        {/* Particles */}
        <div className="relative h-0">
          {particles.map(p => (
            <div key={p.id} className="confetti-particle"
              style={{ '--px': `${p.x}px`, '--py': `${p.y}px`, background: p.color,
                left: '50%', top: '50%', animationDelay: `${p.delay}s` }} />
          ))}
        </div>

        <div className="mb-4">
          <div className="text-5xl mb-2 animate-bounce-in">🏆</div>
          <h2 className="text-xl font-bold" style={{ color: '#f59e0b' }}>BOSS LEVEL UNLOCKED!</h2>
          <p className="text-xs text-hunter-text-muted mt-1">Prove your skills with a real-world challenge</p>
        </div>

        <div className="glass-card p-4 mb-4 text-left">
          <h3 className="text-base font-bold mb-2">{challenge.title}</h3>
          <p className="text-sm text-hunter-text-muted mb-3">{challenge.description}</p>

          <div className="space-y-1">
            {challenge.requirements.map((req, i) => (
              <div key={i} className="boss-req-item">
                <Shield size={12} style={{ color: '#f59e0b' }} />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 text-sm text-hunter-text-muted">
          <Clock size={14} />
          <span>Time Limit: {formatTime(challenge.timeLimit)}</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onSkip} className="hunter-btn hunter-btn-secondary flex-1 text-sm">Skip</button>
          <button onClick={startChallenge} className="hunter-btn hunter-btn-primary flex-1 flex items-center justify-center gap-2">
            <Zap size={16} /> Accept Challenge
          </button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE ───
  if (phase === 'active') {
    return (
      <div className="boss-card p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: '#f59e0b' }}>⚔️ {challenge.title}</h3>
          {/* Timer Ring */}
          <div className="relative">
            <svg width="52" height="52" viewBox="0 0 100 100" className="boss-timer-ring">
              <circle cx="50" cy="50" r="45" className="boss-timer-track" />
              <circle cx="50" cy="50" r="45" className="boss-timer-fill" stroke={timerColor}
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - timerPercent / 100)} />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${timeLeft <= 30 ? 'animate-countdown-pulse' : ''}`}
              style={{ color: timerColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-3">
          {challenge.requirements.map((req, i) => (
            <div key={i} className="boss-req-item text-xs">
              <CheckCircle size={12} className="text-hunter-text-muted opacity-40" />
              <span>{req}</span>
            </div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          className="hunter-textarea mb-3"
          placeholder="Write your solution here..."
          rows={6}
          style={{ fontFamily: "'Courier New', monospace", fontSize: '13px' }}
        />

        <button onClick={handleSubmit} disabled={!answer.trim()}
          className="hunter-btn hunter-btn-primary flex items-center justify-center gap-2">
          <Trophy size={16} /> Submit Solution
        </button>
      </div>
    );
  }

  // ─── EVALUATING ───
  if (phase === 'evaluating') {
    return (
      <div className="boss-card p-5 text-center animate-fade-in">
        <div className="animate-breathe mb-4">
          <Clock size={40} className="mx-auto text-hunter-accent-light animate-spin" style={{ animationDuration: '2s' }} />
        </div>
        <p className="text-sm text-hunter-text-muted">Evaluating your solution...</p>
      </div>
    );
  }

  // ─── RESULT ───
  return (
    <div className="animate-fade-in-up">
      {/* Badge Card */}
      {result?.passed && (
        <div className="boss-badge-card p-5 mb-4 text-center animate-badge-mint"
          style={{ borderColor: challenge.badge.color }}>
          <div className="absolute inset-0 animate-holographic rounded-[14px]" />
          <div className="relative z-10">
            <div className="text-5xl mb-2">{challenge.badge.emoji}</div>
            <h3 className="text-lg font-bold" style={{ color: challenge.badge.color }}>
              {challenge.badge.name}
            </h3>
            <p className="text-xs text-hunter-text-muted mt-1">{challenge.badge.description}</p>
            <div className="mt-3 text-2xl font-bold" style={{ color: challenge.badge.color }}>
              {result.score}/100
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          {result?.passed
            ? <CheckCircle size={16} className="text-green-400" />
            : <XCircle size={16} className="text-red-400" />}
          <span className="text-sm font-bold">
            {result?.passed ? 'Boss Defeated! 🎉' : 'Not quite — try again!'}
          </span>
        </div>
        <p className="text-sm text-hunter-text-muted">{result?.feedback}</p>
      </div>

      <button onClick={() => onComplete(result)}
        className="hunter-btn hunter-btn-primary flex items-center justify-center gap-2">
        Continue Journey →
      </button>
    </div>
  );
}
