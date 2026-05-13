import { useState } from 'react';
import { Brain, LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, ChevronRight, AlertCircle } from 'lucide-react';

export default function LoginScreen({ onAuth, strings }) {
  const [mode, setMode] = useState('login'); // login | register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await onAuth(mode, { name, email, password });
    if (!result.success) { setError(result.error); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-hunter-accent to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Brain size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-hunter-accent-light to-purple-400 bg-clip-text text-transparent">HUNTER</h1>
        <p className="text-hunter-text-muted text-sm">{strings.welcome}</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex w-full mb-4 glass-card p-1 gap-1">
        <button onClick={() => { setMode('login'); setError(''); }}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'login' ? 'bg-hunter-accent text-white' : 'text-hunter-text-muted'}`}>
          <LogIn size={14} className="inline mr-1" /> {strings.login}
        </button>
        <button onClick={() => { setMode('register'); setError(''); }}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'register' ? 'bg-hunter-accent text-white' : 'text-hunter-text-muted'}`}>
          <UserPlus size={14} className="inline mr-1" /> {strings.register}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 w-full space-y-3">
        {mode === 'register' && (
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hunter-text-muted" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={strings.enterName}
              className="auth-input pl-10" required />
          </div>
        )}
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hunter-text-muted" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={strings.email}
            className="auth-input pl-10" required />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hunter-text-muted" />
          <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            placeholder={strings.password} className="auth-input pl-10 pr-10" required minLength={6} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-hunter-text-muted">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 rounded-lg p-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="hunter-btn hunter-btn-primary flex items-center justify-center gap-2">
          {loading ? 'Please wait...' : (mode === 'login' ? strings.login : strings.register)}
          <ChevronRight size={16} />
        </button>
      </form>

      <p className="text-[10px] text-hunter-text-muted mt-6 text-center max-w-xs">
        🔒 Passwords are SHA-256 hashed • Data stored locally on your device
      </p>
    </div>
  );
}
