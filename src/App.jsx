import { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Send, ChevronRight, Award, Clock, Sparkles, Heart, RefreshCw, Zap, Mic, Type, MessageCircle, LayoutGrid, LogOut } from 'lucide-react';
import { TOPICS, BOSS_CHALLENGES, MOOD_CONFIG } from './data/topics';
import { detectEmotion, calculateSkillDNA } from './utils/emotionDetector';
import { voiceToEmotion } from './utils/voiceScanner';
import { register, login, logout, getCurrentSession, getCurrentUser, updateUserProgress, updateUserLanguage } from './utils/auth';
import { VoiceControlEngine } from './utils/voiceControl';
import { t, TTSEngine, buildLangPrompt } from './utils/multilingual';
import VoiceScanner from './components/VoiceScanner';
import SkillDNACard from './components/SkillDNACard';
import TanglishMentor from './components/TanglishMentor';
import EQLiveDashboard from './components/EQLiveDashboard';
import BossChallenge from './components/BossChallenge';
import PeerDuel from './components/PeerDuel';
import NavigationBar from './components/NavigationBar';
import WhatsAppLesson from './components/WhatsAppLesson';
import JobRadar from './components/JobRadar';
import DreamProjectGenerator from './components/DreamProjectGenerator';
import ConfusionHeatmap from './components/ConfusionHeatmap';
import LoginScreen from './components/LoginScreen';
import VoiceControlBar from './components/VoiceControlBar';
import LanguageSelector from './components/LanguageSelector';

// ─── Claude API ───
async function askHunter(studentAnswer, emotion, topicTitle, tanglish = false, langPrompt = '') {
  const style = tanglish
    ? `Always respond in Tanglish (Tamil+English mix). Use village-life metaphors. Be warm and relatable.`
    : '';
  const sysPrompt = `You are Hunter, a friendly AI mentor. Respond based on the student's emotional state.
If CONFUSED: explain using a relatable metaphor in simple language. Be warm. ${style}
If STRESSED: be encouraging, keep it light. Tell them it's okay. ${style}
If CONFIDENT: praise them, add one deeper insight.
If BORED: give a fun mini-challenge or fact. Be energetic.
${langPrompt}
Keep responses under 3 sentences. Never use markdown. Topic: "${topicTitle}".`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': window.__CLAUDE_API_KEY || '', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 200, system: sysPrompt, messages: [{ role: 'user', content: `Student's answer: "${studentAnswer}"\nDetected emotion: ${emotion}\nRespond as Hunter.` }] }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.content?.[0]?.text || getFallback(emotion, topicTitle);
  } catch { return getFallback(emotion, topicTitle); }
}

function getFallback(emotion, topic) {
  const fb = {
    CONFIDENT: `Great job! You clearly understand ${topic}. Try thinking about edge cases and real-world uses.`,
    CONFUSED: `Paravala, easy-ah solvalam! Think of ${topic} like a local tea shop — simple inputs, reliable outputs.`,
    STRESSED: `Hey, take a breath! ${topic} is tricky for everyone. Nee romba nallah try pannura — that's what matters.`,
    BORED: `Quick challenge: Can you explain ${topic} to a 5-year-old in one sentence? 🚀`,
  };
  return fb[emotion] || fb.CONFUSED;
}

// ─── Small Components ───
function MoodBadge({ mood }) {
  if (!mood) return null;
  const m = MOOD_CONFIG[mood];
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium animate-bounce-in ${m.cls}`}>
      <span className="text-lg">{m.emoji}</span> {m.label}
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-hunter-text-muted flex items-center gap-1"><Award size={12}/> Skills Mastered</span>
        <span className="text-xs font-bold text-hunter-accent-light">{current}/{total}</span>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} /></div>
    </div>
  );
}

function BreatherCard({ onDone }) {
  const [sec, setSec] = useState(30);
  useEffect(() => {
    if (sec <= 0) { onDone(); return; }
    const t = setTimeout(() => setSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec, onDone]);
  return (
    <div className="glass-card p-6 text-center animate-slide-in">
      <div className="flex justify-center mb-4"><div className="breather-ring"><Heart size={40} className="text-hunter-accent-light" /></div></div>
      <h3 className="text-lg font-bold mb-2 text-hunter-accent-light">Take a Breather 💜</h3>
      <p className="text-sm text-hunter-text-muted mb-4">It's okay to pause. Close your eyes, take 3 deep breaths.</p>
      <div className="text-3xl font-bold text-hunter-accent mb-4">{sec}s</div>
      <button onClick={onDone} className="hunter-btn hunter-btn-secondary text-sm">Skip & Continue →</button>
    </div>
  );
}

// ─── Main App ───
export default function App() {
  // Auth state
  const [authed, setAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  // Language & voice control
  const [lang, setLang] = useState('en-IN');
  const [vcActive, setVcActive] = useState(false);
  const [lastVcCmd, setLastVcCmd] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const vcRef = useRef(null);
  const ttsRef = useRef(null);
  // App state
  const [activeTab, setActiveTab] = useState('learn');
  const [phase, setPhase] = useState('welcome');
  const [name, setName] = useState('');
  const [topicIdx, setTopicIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [mood, setMood] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [mastered, setMastered] = useState([]);
  const [showBreather, setShowBreather] = useState(false);
  const [cardAnim, setCardAnim] = useState('animate-slide-in');
  const [inputMode, setInputMode] = useState('text');
  const [tanglishActive, setTanglishActive] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [responseTimes, setResponseTimes] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [badges, setBadges] = useState([]);
  const [showBoss, setShowBoss] = useState(false);
  const [pendingBoss, setPendingBoss] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [showDNA, setShowDNA] = useState(false);
  const [lessonView, setLessonView] = useState('card');

  const strings = {
    welcome: t('welcome', lang), startLearning: t('startLearning', lang),
    enterName: t('enterName', lang), submitAnswer: t('submitAnswer', lang),
    nextTopic: t('nextTopic', lang), retry: t('retry', lang),
    viewResults: t('viewResults', lang), skillsMastered: t('skillsMastered', lang),
    yourAnswer: t('yourAnswer', lang), typeAnswer: t('typeAnswer', lang),
    tapToSpeak: t('tapToSpeak', lang), analyzing: t('analyzing', lang),
    hunterFeedback: t('hunterFeedback', lang), login: t('login', lang),
    register: t('register', lang), email: t('email', lang),
    password: t('password', lang), logout: t('logout', lang), language: t('language', lang),
  };

  // Init auth check
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setAuthed(true);
      setUserEmail(session.email);
      setName(session.name);
      const user = getCurrentUser();
      if (user?.language) setLang(user.language);
    }
  }, []);

  // Init TTS engine
  useEffect(() => {
    ttsRef.current = new TTSEngine();
    return () => ttsRef.current?.stop();
  }, []);

  // Voice control handler
  const handleVoiceCommand = useCallback((action, transcript) => {
    setLastVcCmd(transcript);
    setTimeout(() => setLastVcCmd(''), 3000);
    if (action.startsWith('nav:')) setActiveTab(action.split(':')[1]);
    else if (action === 'lesson:submit') handleSubmitRef.current?.();
    else if (action === 'lesson:next') handleNextRef.current?.();
    else if (action === 'lesson:retry') handleRetryRef.current?.();
    else if (action === 'toggle:tanglish') setTanglishActive(v => !v);
    else if (action === 'toggle:whatsapp') setLessonView('whatsapp');
    else if (action === 'toggle:card') setLessonView('card');
    else if (action === 'toggle:voice') setInputMode('voice');
    else if (action === 'toggle:text') setInputMode('text');
    else if (action === 'auth:logout') handleLogout();
  }, []);
  const handleSubmitRef = useRef(null);
  const handleNextRef = useRef(null);
  const handleRetryRef = useRef(null);

  const toggleVoiceControl = () => {
    if (vcActive) { vcRef.current?.stop(); setVcActive(false); }
    else {
      vcRef.current = new VoiceControlEngine(handleVoiceCommand, lang);
      vcRef.current.start();
      setVcActive(true);
    }
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    ttsRef.current?.setLanguage(newLang);
    if (vcRef.current) vcRef.current.setLanguage(newLang);
    if (userEmail) updateUserLanguage(userEmail, newLang);
  };

  // TTS for AI responses
  useEffect(() => {
    if (ttsEnabled && aiResponse) ttsRef.current?.speak(aiResponse, lang);
  }, [aiResponse, ttsEnabled, lang]);

  // Auth handlers
  const handleAuth = async (mode, { name: n, email, password }) => {
    const result = mode === 'register' ? await register(n, email, password) : await login(email, password);
    if (result.success) {
      setAuthed(true); setUserEmail(result.session.email); setName(result.session.name);
      if (result.user?.language) setLang(result.user.language);
    }
    return result;
  };

  const handleLogout = () => {
    logout(); setAuthed(false); setUserEmail(null); setName('');
    setPhase('welcome'); setTopicIdx(0); setEmotions([]); setMastered([]);
    setEmotionHistory([]); setBadges([]); vcRef.current?.stop(); setVcActive(false);
  };

  // Auth gate
  if (!authed) {
    return (
      <>
        <div className="fixed top-3 right-3 z-50">
          <LanguageSelector currentLang={lang} onChangeLang={handleLangChange} />
        </div>
        <LoginScreen onAuth={handleAuth} strings={strings} />
      </>
    );
  }

  const topic = TOPICS[topicIdx] || TOPICS[0];

  useEffect(() => {
    if (phase === 'lesson') {
      setStartTime(Date.now());
      setAnswer('');
      setAiResponse('');
      setMood(null);
      setVoiceResult(null);
      setCardAnim('animate-slide-in');
    }
  }, [phase, topicIdx]);

  useEffect(() => {
    if (phase === 'lesson' && !sessionStart) setSessionStart(Date.now());
  }, [phase]);

  const handleStart = () => {
    if (!name.trim()) return;
    setPhase('lesson');
    setSessionStart(Date.now());
  };

  const handleSubmit = async () => {
    if ((!answer.trim() && !voiceResult) || loading) return;
    setLoading(true);
    const elapsed = Date.now() - startTime;
    const textToAnalyze = voiceResult?.transcript || answer;
    const emotion = detectEmotion(textToAnalyze, elapsed, topic, voiceResult);
    setMood(emotion);
    setResponseTimes(prev => [...prev, elapsed]);
    setEmotionHistory(prev => [...prev, { emotion, topic: topic.title, time: elapsed }]);

    if (emotion === 'STRESSED') {
      setShowBreather(true);
      setLoading(false);
      setEmotions(prev => [...prev, emotion]);
      if (emotion !== 'CONFIDENT') setTanglishActive(true);
      return;
    }
    if (emotion === 'CONFUSED') setTanglishActive(true);

    const langP = buildLangPrompt(lang);
    const resp = await askHunter(textToAnalyze, emotion, topic.title, tanglishActive, langP);
    setAiResponse(resp);
    setEmotions(prev => [...prev, emotion]);
    if (emotion === 'CONFIDENT') setMastered(prev => [...prev, topic.title]);
    setLoading(false);
    setPhase('feedback');
  };
  handleSubmitRef.current = handleSubmit;

  const handleBreatherDone = useCallback(async () => {
    setShowBreather(false);
    const langP = buildLangPrompt(lang);
    const resp = await askHunter(answer || voiceResult?.transcript || '', 'STRESSED', topic.title, tanglishActive, langP);
    setAiResponse(resp);
    setPhase('feedback');
  }, [answer, voiceResult, topic.title, tanglishActive, lang]);

  const handleNext = () => {
    setCardAnim('animate-slide-out');
    setTimeout(() => {
      const nextIdx = topicIdx + 1;
      // Check boss challenge
      const boss = BOSS_CHALLENGES.find(b => b.unlocksAfterTopic === nextIdx);
      if (boss && !badges.find(bd => bd.id === boss.id)) {
        setPendingBoss(boss);
        setShowBoss(true);
        return;
      }
      if (nextIdx >= TOPICS.length) { setPhase('complete'); }
      else { setTopicIdx(nextIdx); setPhase('lesson'); }
    }, 300);
  };

  const handleRetry = () => {
    setRetryCount(r => r + 1);
    setCardAnim('animate-slide-out');
    setTimeout(() => setPhase('lesson'), 300);
  };
  handleNextRef.current = handleNext;
  handleRetryRef.current = handleRetry;

  const handleBossComplete = (result) => {
    if (result?.passed && pendingBoss) {
      setBadges(prev => [...prev, { ...pendingBoss.badge, id: pendingBoss.id }]);
    }
    setShowBoss(false);
    const nextIdx = topicIdx + 1;
    if (nextIdx >= TOPICS.length) setPhase('complete');
    else { setTopicIdx(nextIdx); setPhase('lesson'); }
  };

  const handleVoiceResult = (result) => {
    setVoiceResult(result);
    if (result.transcript) setAnswer(result.transcript);
  };

  const sessionTimeSec = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
  const dnaData = calculateSkillDNA(emotions, responseTimes, retryCount, TOPICS.length);
  const hasBossUnlock = BOSS_CHALLENGES.some(b => b.unlocksAfterTopic <= topicIdx + 1 && !badges.find(bd => bd.id === b.id));

  // ─── Boss Challenge Overlay ───
  if (showBoss && pendingBoss) {
    return (
      <div className="min-h-screen p-4 pt-6 pb-20">
        <BossChallenge challenge={pendingBoss} onComplete={handleBossComplete} onSkip={() => { setShowBoss(false); const n = topicIdx + 1; if (n >= TOPICS.length) setPhase('complete'); else { setTopicIdx(n); setPhase('lesson'); } }} />
      </div>
    );
  }

  // ─── Welcome ───
  if (phase === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
        <VoiceControlBar isActive={vcActive} onToggle={toggleVoiceControl} lastCommand={lastVcCmd} ttsEnabled={ttsEnabled} onTtsToggle={() => setTtsEnabled(v => !v)} />
        <div className="mb-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-hunter-accent to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-hunter-accent-light to-purple-400 bg-clip-text text-transparent">HUNTER</h1>
          <p className="text-hunter-text-muted text-sm">{strings.welcome}</p>
        </div>
        <div className="glass-card p-6 w-full">
          <div className="flex items-center justify-between mb-3">
            <LanguageSelector currentLang={lang} onChangeLang={handleLangChange} label={strings.language} />
            <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-hunter-text-muted hover:text-red-400 transition-colors">
              <LogOut size={12} /> {strings.logout}
            </button>
          </div>
          <p className="text-sm text-hunter-text-muted mb-2">👋 {name}</p>
          <button onClick={handleStart} className="hunter-btn hunter-btn-primary flex items-center justify-center gap-2">
            {strings.startLearning} <ChevronRight size={18} />
          </button>
        </div>
        <p className="text-xs text-hunter-text-muted mt-6 text-center max-w-xs">
          🎤 Voice • 🧬 DNA • 🌶️ Tanglish • 📊 EQ • 🏆 Boss • ⚔️ Duel • 💬 WhatsApp • 📍 Jobs • 🚀 Dream • 🌐 Multilingual
        </p>
      </div>
    );
  }

  // ─── Tab: Duel ───
  if (activeTab === 'duel') {
    return (
      <div className="min-h-screen p-4 pt-3 pb-20">
        <VoiceControlBar isActive={vcActive} onToggle={toggleVoiceControl} lastCommand={lastVcCmd} ttsEnabled={ttsEnabled} onTtsToggle={() => setTtsEnabled(v => !v)} />
        <PeerDuel playerName={name} onExit={() => setActiveTab('learn')} />
        <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} hasBossUnlock={hasBossUnlock} />
      </div>
    );
  }

  // ─── Tab: Dashboard ───
  if (activeTab === 'dashboard') {
    return (
      <div className="min-h-screen p-4 pt-3 pb-20">
        <VoiceControlBar isActive={vcActive} onToggle={toggleVoiceControl} lastCommand={lastVcCmd} ttsEnabled={ttsEnabled} onTtsToggle={() => setTtsEnabled(v => !v)} />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hunter-accent to-purple-600 flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm bg-gradient-to-r from-hunter-accent-light to-purple-400 bg-clip-text text-transparent">Guardian EQ Dashboard</span>
        </div>
        <EQLiveDashboard emotionHistory={emotionHistory} sessionTime={sessionTimeSec} />
        {/* Confusion Heatmap */}
        <div className="mt-4">
          <ConfusionHeatmap emotionHistory={emotionHistory} />
        </div>
        {badges.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-hunter-text-muted mb-2">🏆 Earned Badges</p>
            <div className="flex gap-2 flex-wrap">
              {badges.map((b, i) => (
                <div key={i} className="glass-card px-3 py-2 flex items-center gap-2 text-sm">
                  <span>{b.emoji}</span><span className="font-medium" style={{ color: b.color }}>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} hasBossUnlock={hasBossUnlock} />
      </div>
    );
  }

  // ─── Tab: Discover (Job Radar + Dream Project) ───
  if (activeTab === 'discover') {
    return (
      <div className="min-h-screen p-4 pt-3 pb-20 space-y-6">
        <VoiceControlBar isActive={vcActive} onToggle={toggleVoiceControl} lastCommand={lastVcCmd} ttsEnabled={ttsEnabled} onTtsToggle={() => setTtsEnabled(v => !v)} />
        <DreamProjectGenerator studentName={name} />
        <div className="border-t border-hunter-border pt-4">
          <JobRadar masteredTopics={mastered} />
        </div>
        <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} hasBossUnlock={hasBossUnlock} />
      </div>
    );
  }

  // ─── Tab: Profile (DNA Card) ───
  if (activeTab === 'profile') {
    return (
      <div className="min-h-screen p-4 pt-3 pb-20">
        <VoiceControlBar isActive={vcActive} onToggle={toggleVoiceControl} lastCommand={lastVcCmd} ttsEnabled={ttsEnabled} onTtsToggle={() => setTtsEnabled(v => !v)} />
        <SkillDNACard name={name} dnaData={dnaData} emotions={emotions} topicCount={mastered.length} onClose={() => setActiveTab('learn')} />
        <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} hasBossUnlock={hasBossUnlock} />
      </div>
    );
  }

  // ─── Complete Screen ───
  if (phase === 'complete') {
    return (
      <div className="min-h-screen p-4 pt-6 pb-20">
        <VoiceControlBar isActive={vcActive} onToggle={toggleVoiceControl} lastCommand={lastVcCmd} ttsEnabled={ttsEnabled} onTtsToggle={() => setTtsEnabled(v => !v)} />
        {showDNA ? (
          <SkillDNACard name={name} dnaData={dnaData} emotions={emotions} topicCount={mastered.length} onClose={() => setShowDNA(false)} />
        ) : (
          <div className="animate-fade-in-up">
            <div className="skill-card-bg rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer" />
              <div className="relative z-10">
                <div className="animate-bounce-in mb-3"><Sparkles size={40} className="mx-auto text-hunter-accent-light" /></div>
                <h2 className="text-xl font-bold mb-1">🏆 Journey Complete!</h2>
                <p className="text-hunter-text-muted text-sm mb-4">All topics mastered</p>
                <div className="glass-card p-4 mb-4 text-left">
                  <p className="text-sm text-hunter-text-muted mb-2">Topics Covered</p>
                  {TOPICS.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <span className="text-green-400 text-sm">✓</span>
                      <span className="text-sm">{t.title}</span>
                      <span className="ml-auto text-xs">{MOOD_CONFIG[emotions[i]]?.emoji}</span>
                    </div>
                  ))}
                </div>
                {badges.length > 0 && (
                  <div className="glass-card p-3 mb-4">
                    <p className="text-xs text-hunter-text-muted mb-2">Badges Earned</p>
                    <div className="flex gap-2 justify-center">
                      {badges.map((b, i) => (
                        <span key={i} className="text-2xl" title={b.name}>{b.emoji}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => setShowDNA(true)} className="hunter-btn hunter-btn-primary flex items-center justify-center gap-2 mb-2">
                  <Sparkles size={16} /> View Skill DNA Card
                </button>
                <button onClick={() => { setPhase('welcome'); setTopicIdx(0); setEmotions([]); setMastered([]); setName(''); setEmotionHistory([]); setResponseTimes([]); setBadges([]); setRetryCount(0); setSessionStart(null); }}
                  className="hunter-btn hunter-btn-secondary flex items-center justify-center gap-2 text-sm">
                  <RefreshCw size={14} /> Start Over
                </button>
              </div>
            </div>
          </div>
        )}
        <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} hasBossUnlock={false} />
      </div>
    );
  }

  // ─── Learn Tab (Lesson / Feedback) ───
  return (
    <div className="min-h-screen flex flex-col p-4 pt-3 pb-20">
      <VoiceControlBar isActive={vcActive} onToggle={toggleVoiceControl} lastCommand={lastVcCmd} ttsEnabled={ttsEnabled} onTtsToggle={() => setTtsEnabled(v => !v)} />
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hunter-accent to-purple-600 flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm bg-gradient-to-r from-hunter-accent-light to-purple-400 bg-clip-text text-transparent">HUNTER</span>
        </div>
        {mood && <MoodBadge mood={mood} />}
      </div>
      <ProgressBar current={mastered.length} total={TOPICS.length} />

      {/* Card Area */}
      <div className="flex-1 mt-4">
        {showBreather ? (
          <BreatherCard onDone={handleBreatherDone} />
        ) : phase === 'lesson' && lessonView === 'whatsapp' ? (
          <WhatsAppLesson
            topic={topic} topicIdx={topicIdx} totalTopics={TOPICS.length}
            onAnswer={(text) => { setAnswer(text); setTimeout(handleSubmit, 100); }}
            mood={mood} aiResponse={aiResponse} loading={loading}
          />
        ) : phase === 'lesson' ? (
          <div className={cardAnim} key={`lesson-${topicIdx}`}>
            <div className="glass-card p-5 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-hunter-accent-light bg-hunter-accent/10 px-2 py-0.5 rounded-full">Topic {topicIdx + 1}/{TOPICS.length}</span>
                {/* Lesson View Toggle */}
                <div className="flex gap-1">
                  <button onClick={() => setLessonView('card')} title="Card View"
                    className={`p-1 rounded-md transition-all ${lessonView === 'card' ? 'bg-hunter-accent/20 text-hunter-accent-light' : 'text-hunter-text-muted'}`}>
                    <LayoutGrid size={14} />
                  </button>
                  <button onClick={() => setLessonView('whatsapp')} title="WhatsApp View"
                    className={`p-1 rounded-md transition-all ${lessonView === 'whatsapp' ? 'bg-green-500/20 text-green-400' : 'text-hunter-text-muted'}`}>
                    <MessageCircle size={14} />
                  </button>
                </div>
              </div>
              <h2 className="text-lg font-bold mb-2">{topic.title}</h2>
              <p className="text-sm text-hunter-text-muted">{topic.hint}</p>
            </div>

            {/* Tanglish Mentor */}
            <div className="mb-4">
              <TanglishMentor topicKey={topic.tanglishKey} isActive={tanglishActive} onToggle={() => setTanglishActive(!tanglishActive)} />
            </div>

            <div className="glass-card p-5">
              {/* Input Mode Toggle */}
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-hunter-text-muted">Your answer:</label>
                <div className="flex gap-1">
                  <button onClick={() => setInputMode('text')}
                    className={`p-1.5 rounded-lg transition-all ${inputMode === 'text' ? 'bg-hunter-accent/20 text-hunter-accent-light' : 'text-hunter-text-muted'}`}>
                    <Type size={16} />
                  </button>
                  <button onClick={() => setInputMode('voice')}
                    className={`p-1.5 rounded-lg transition-all ${inputMode === 'voice' ? 'bg-hunter-accent/20 text-hunter-accent-light' : 'text-hunter-text-muted'}`}>
                    <Mic size={16} />
                  </button>
                </div>
              </div>

              {inputMode === 'text' ? (
                <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                  className="hunter-textarea mb-3" placeholder="Type your answer here..." rows={4} />
              ) : (
                <div className="mb-3">
                  <VoiceScanner onResult={handleVoiceResult} onTranscript={t => setAnswer(t)} />
                </div>
              )}

              <button onClick={handleSubmit} disabled={(!answer.trim() && !voiceResult) || loading}
                className="hunter-btn hunter-btn-primary flex items-center justify-center gap-2">
                {loading ? <><Clock size={16} className="animate-spin" /> Analyzing...</> : <><Send size={16} /> Submit Answer</>}
              </button>
            </div>
          </div>
        ) : phase === 'feedback' ? (
          <div className="animate-slide-in" key={`feedback-${topicIdx}`}>
            <div className="glass-card p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-hunter-accent-light" />
                <span className="text-sm font-bold">Hunter's Feedback</span>
              </div>
              <p className="text-sm leading-relaxed text-hunter-text-muted">{aiResponse}</p>
            </div>
            {mood === 'BORED' && (
              <div className="glass-card p-4 mb-4 border-hunter-bored/30 animate-fade-in-up">
                <p className="text-sm text-center text-hunter-bored font-medium">⚡ Mini-Challenge Mode Activated!</p>
              </div>
            )}

            {/* Tanglish hint on confusion */}
            {(mood === 'CONFUSED' || mood === 'STRESSED') && tanglishActive && (
              <div className="mb-4">
                <TanglishMentor topicKey={topic.tanglishKey} isActive={true} onToggle={() => setTanglishActive(!tanglishActive)} />
              </div>
            )}

            <div className="flex gap-3">
              {mood !== 'CONFIDENT' && (
                <button onClick={handleRetry} className="hunter-btn hunter-btn-secondary flex-1 flex items-center justify-center gap-1 text-sm">
                  <RefreshCw size={14} /> Retry
                </button>
              )}
              <button onClick={handleNext} className="hunter-btn hunter-btn-primary flex-1 flex items-center justify-center gap-1 text-sm">
                {topicIdx + 1 >= TOPICS.length ? 'View Results' : 'Next Topic'} <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} hasBossUnlock={hasBossUnlock} />
    </div>
  );
}
