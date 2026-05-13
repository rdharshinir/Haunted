import { Globe } from 'lucide-react';
import { LANGUAGES } from '../utils/multilingual';

export default function LanguageSelector({ currentLang, onChangeLang, label }) {
  return (
    <div className="flex items-center gap-2">
      <Globe size={14} className="text-hunter-text-muted" />
      {label && <span className="text-xs text-hunter-text-muted">{label}</span>}
      <select value={currentLang} onChange={e => onChangeLang(e.target.value)}
        className="lang-select">
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
        ))}
      </select>
    </div>
  );
}
