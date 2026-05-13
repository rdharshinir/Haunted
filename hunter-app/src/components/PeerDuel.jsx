import { useState, useEffect, useCallback, useRef } from 'react';
import { Swords, Clock, Zap, Trophy, Users, Copy, Bot } from 'lucide-react';
import { DUEL_QUESTIONS } from '../data/topics';
import { SimulatedOpponent, generateRoomCode } from '../utils/peerConnection';

const ROUND_TIME = 30; // seconds per question

export default function PeerDuel({ playerName, onExit }) {
  const [phase, setPhase] = useState('lobby'); // lobby | waiting | battle | result
  const [mode, setMode] = useState(null); // 'bot' | 'pvp'
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [myAnswer, setMyAnswer] = useState(null);
  const [opAnswer, setOpAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const opponentRef = useRef(null);
  const timerRef = useRef(null);

  // Shuffle & pick 5 questions
  useEffect(() => {
    const shuffled = [...DUEL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
  }, []);

  const currentQ = questions[questionIdx];
  const totalRounds = questions.length;

  // Timer
  useEffect(() => {
    if (phase !== 'battle' || showResult) return;
    if (timeLeft <= 0) {
      handleRoundEnd();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [phase, timeLeft, showResult]);

  // Cooperative hint at 15s if both haven't answered
  useEffect(() => {
    if (phase === 'battle' && timeLeft <= 15 && !myAnswer && !opAnswer && !hintShown) {
      setHintShown(true);
    }
  }, [phase, timeLeft, myAnswer, opAnswer, hintShown]);

  const startBotMatch = () => {
    setMode('bot');
    const bot = new SimulatedOpponent((msg) => {
      if (msg.type === 'answer') {
        setOpAnswer(msg.data.answerIdx);
        if (msg.data.isCorrect) setOpScore(s => s + 1);
      }
    });
    opponentRef.current = bot;
    setPhase('battle');
    setTimeLeft(ROUND_TIME);
    // Bot starts "thinking"
    if (questions[0]) {
      bot.simulateAnswer(questions[0].id, questions[0].correct, questions[0].difficulty);
    }
  };

  const startPvpLobby = () => {
    setMode('pvp');
    const code = generateRoomCode();
    setRoomCode(code);
    setPhase('waiting');
  };

  const handleMyAnswer = (idx) => {
    if (myAnswer !== null) return;
    setMyAnswer(idx);
    if (currentQ && idx === currentQ.correct) {
      setMyScore(s => s + 1);
    }
    // If opponent already answered, end round
    if (opAnswer !== null) {
      setTimeout(() => handleRoundEnd(), 800);
    }
  };

  // When opponent answers and I've answered, end round
  useEffect(() => {
    if (myAnswer !== null && opAnswer !== null && !showResult) {
      setTimeout(() => handleRoundEnd(), 800);
    }
  }, [myAnswer, opAnswer]);

  const handleRoundEnd = useCallback(() => {
    clearTimeout(timerRef.current);
    setShowResult(true);

    setTimeout(() => {
      if (questionIdx + 1 >= totalRounds) {
        // Match over
        const won = myScore + (myAnswer === currentQ?.correct ? 0 : 0) > opScore + (opAnswer === currentQ?.correct ? 0 : 0);
        setMatchResult(myScore > opScore ? 'win' : myScore < opScore ? 'lose' : 'draw');
        setPhase('result');
        if (opponentRef.current) opponentRef.current.cleanup();
      } else {
        // Next round
        setQuestionIdx(i => i + 1);
        setMyAnswer(null);
        setOpAnswer(null);
        setShowResult(false);
        setHintShown(false);
        setTimeLeft(ROUND_TIME);

        // Bot answers next question
        const nextQ = questions[questionIdx + 1];
        if (opponentRef.current && nextQ) {
          opponentRef.current.simulateAnswer(nextQ.id, nextQ.correct, nextQ.difficulty);
        }
      }
    }, 1500);
  }, [questionIdx, totalRounds, myScore, opScore, myAnswer, opAnswer, currentQ, questions]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── LOBBY ───
  if (phase === 'lobby') {
    return (
      <div className="animate-fade-in-up space-y-4">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">⚔️</div>
          <h2 className="text-xl font-bold">Peer Duel Mode</h2>
          <p className="text-xs text-hunter-text-muted">Race to answer — fastest brain wins!</p>
        </div>

        <button onClick={startBotMatch} className="glass-card p-4 w-full text-left flex items-center gap-3 hover:border-hunter-accent transition-all cursor-pointer border border-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">vs Hunter Bot</p>
            <p className="text-xs text-hunter-text-muted">Practice mode — solo challenge</p>
          </div>
        </button>

        <button onClick={startPvpLobby} className="glass-card p-4 w-full text-left flex items-center gap-3 hover:border-hunter-accent transition-all cursor-pointer border border-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">vs Friend</p>
            <p className="text-xs text-hunter-text-muted">Share room code — same device tabs</p>
          </div>
        </button>

        <button onClick={onExit} className="hunter-btn hunter-btn-secondary text-sm mt-2">← Back</button>
      </div>
    );
  }

  // ─── WAITING ───
  if (phase === 'waiting') {
    return (
      <div className="text-center animate-fade-in space-y-4">
        <div className="animate-float">
          <Users size={48} className="mx-auto text-hunter-accent-light opacity-60" />
        </div>
        <h3 className="text-lg font-bold">Waiting for opponent...</h3>
        <div className="glass-card p-4">
          <p className="text-xs text-hunter-text-muted mb-2">Share this room code:</p>
          <p className="duel-room-code">{roomCode}</p>
          <button onClick={copyRoomCode} className="mt-3 flex items-center gap-1 mx-auto text-xs text-hunter-accent-light">
            <Copy size={12} /> {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <p className="text-xs text-hunter-text-muted">Open another tab and join with this code</p>
        <button onClick={() => { setPhase('battle'); setTimeLeft(ROUND_TIME); }} className="hunter-btn hunter-btn-primary text-sm">
          Start Anyway (vs Bot)
        </button>
        <button onClick={() => setPhase('lobby')} className="hunter-btn hunter-btn-secondary text-sm">Cancel</button>
      </div>
    );
  }

  // ─── RESULT ───
  if (phase === 'result') {
    return (
      <div className="text-center animate-fade-in-up space-y-4">
        <div className="text-5xl mb-2 animate-bounce-in">
          {matchResult === 'win' ? '🏆' : matchResult === 'draw' ? '🤝' : '😤'}
        </div>
        <h2 className="text-xl font-bold">
          {matchResult === 'win' ? 'You Won!' : matchResult === 'draw' ? 'It\'s a Draw!' : 'Bot Wins!'}
        </h2>

        <div className="duel-container">
          <div className={`duel-player-card ${matchResult === 'win' ? 'winner' : matchResult === 'lose' ? 'loser' : ''}`}>
            <p className="text-xs text-hunter-text-muted">You</p>
            <p className="text-sm font-bold">{playerName}</p>
            <p className="text-3xl font-bold mt-2 animate-score-pop" style={{ color: '#22c55e' }}>{myScore}</p>
          </div>
          <div className={`duel-player-card ${matchResult === 'lose' ? 'winner' : matchResult === 'win' ? 'loser' : ''}`}>
            <p className="text-xs text-hunter-text-muted">Opponent</p>
            <p className="text-sm font-bold">{mode === 'bot' ? '🤖 Bot' : 'Opponent'}</p>
            <p className="text-3xl font-bold mt-2 animate-score-pop" style={{ color: '#a78bfa', animationDelay: '0.2s' }}>{opScore}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPhase('lobby'); setQuestionIdx(0); setMyScore(0); setOpScore(0); setMyAnswer(null); setOpAnswer(null); }}
            className="hunter-btn hunter-btn-primary flex-1 text-sm">
            <Swords size={14} className="inline mr-1" /> Rematch
          </button>
          <button onClick={onExit} className="hunter-btn hunter-btn-secondary flex-1 text-sm">Exit</button>
        </div>
      </div>
    );
  }

  // ─── BATTLE ───
  if (!currentQ) return null;

  return (
    <div className="animate-fade-in space-y-3">
      {/* Scoreboard */}
      <div className="relative">
        <div className="duel-container">
          <div className="duel-player-card">
            <p className="text-[10px] text-hunter-text-muted">You</p>
            <p className="text-lg font-bold" style={{ color: '#22c55e' }}>{myScore}</p>
            {myAnswer !== null && <span className="text-xs">✓ Answered</span>}
          </div>
          <div className="duel-player-card">
            <p className="text-[10px] text-hunter-text-muted">{mode === 'bot' ? '🤖 Bot' : 'Opponent'}</p>
            <p className="text-lg font-bold" style={{ color: '#a78bfa' }}>{opScore}</p>
            {opAnswer !== null && <span className="text-xs">✓ Answered</span>}
          </div>
        </div>
        <div className="duel-vs">VS</div>
      </div>

      {/* Timer */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-hunter-text-muted flex items-center gap-1">
            <Clock size={10} /> Round {questionIdx + 1}/{totalRounds}
          </span>
          <span className={`text-xs font-bold ${timeLeft <= 10 ? 'animate-countdown-pulse text-red-400' : 'text-hunter-accent-light'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="duel-countdown-bar">
          <div className="duel-countdown-fill" style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="glass-card p-4">
        <p className="text-sm font-bold mb-3">{currentQ.question}</p>

        <div className="space-y-2">
          {currentQ.options.map((opt, i) => {
            let cls = 'duel-option-btn';
            if (showResult) {
              if (i === currentQ.correct) cls += ' correct';
              else if (i === myAnswer && i !== currentQ.correct) cls += ' wrong';
            } else if (i === myAnswer) {
              cls += ' correct';
            }

            return (
              <button key={i} onClick={() => handleMyAnswer(i)} disabled={myAnswer !== null}
                className={cls}>
                <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cooperative Hint */}
      {hintShown && myAnswer === null && (
        <div className="glass-card p-3 border-hunter-accent/30 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-hunter-accent-light" />
            <span className="text-xs font-bold text-hunter-accent-light">Hunter's Hint</span>
          </div>
          <p className="text-xs text-hunter-text-muted">
            Both struggling? Think about what "{currentQ.question.split(' ').slice(-2).join(' ')}" really means in everyday life.
          </p>
        </div>
      )}
    </div>
  );
}
