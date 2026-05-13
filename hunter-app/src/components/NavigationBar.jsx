import { BookOpen, Swords, Activity, User, Compass } from 'lucide-react';

const TABS = [
  { id: 'learn', label: 'Learn', Icon: BookOpen },
  { id: 'duel', label: 'Duel', Icon: Swords },
  { id: 'dashboard', label: 'EQ', Icon: Activity },
  { id: 'discover', label: 'Discover', Icon: Compass },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function NavigationBar({ activeTab, onTabChange, hasBossUnlock }) {
  return (
    <nav className="nav-bar">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`nav-item ${activeTab === id ? 'active' : ''}`}
        >
          <Icon size={18} />
          <span>{label}</span>
          {id === 'learn' && hasBossUnlock && <span className="nav-badge" />}
        </button>
      ))}
    </nav>
  );
}
