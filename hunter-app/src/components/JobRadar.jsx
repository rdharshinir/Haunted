import { useState, useMemo } from 'react';
import { MapPin, Briefcase, Flame, ChevronDown, Search, ExternalLink, Star } from 'lucide-react';
import { DISTRICTS, JOBS_DATABASE, SKILL_MAP } from '../data/jobsData';

export default function JobRadar({ masteredTopics }) {
  const [selectedDistrict, setSelectedDistrict] = useState('coimbatore');
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');

  const district = DISTRICTS.find(d => d.id === selectedDistrict);
  const allJobs = JOBS_DATABASE[selectedDistrict] || [];

  // Map mastered topics to skill tags
  const mySkills = useMemo(() => {
    const skills = new Set();
    (masteredTopics || []).forEach(topicTitle => {
      Object.entries(SKILL_MAP).forEach(([skill, [, title]]) => {
        if (title === topicTitle) skills.add(skill);
      });
    });
    return skills;
  }, [masteredTopics]);

  // Score and sort jobs
  const scoredJobs = useMemo(() => {
    return allJobs.map(job => {
      const matchedSkills = job.skills.filter(s => mySkills.has(s));
      const matchPct = job.skills.length > 0 ? Math.round((matchedSkills.length / job.skills.length) * 100) : 0;
      return { ...job, matchedSkills, matchPct };
    }).sort((a, b) => {
      if (b.matchPct !== a.matchPct) return b.matchPct - a.matchPct;
      if (b.hot && !a.hot) return 1;
      if (a.hot && !b.hot) return -1;
      return 0;
    });
  }, [allJobs, mySkills]);

  const filtered = search
    ? scoredJobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
    : scoredJobs;

  const displayed = showAll ? filtered : filtered.slice(0, 4);
  const matchedJobCount = scoredJobs.filter(j => j.matchPct > 0).length;

  const typeColors = { MSME: '#f59e0b', MNC: '#3b82f6', Startup: '#8b5cf6', Govt: '#22c55e', PSU: '#06b6d4' };

  return (
    <div className="animate-fade-in-up space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={18} className="text-hunter-accent-light" />
        <h2 className="text-base font-bold">Job Radar</h2>
        {matchedJobCount > 0 && (
          <span className="text-[10px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-medium">
            {matchedJobCount} skill matches
          </span>
        )}
      </div>

      {/* District Selector */}
      <div className="relative">
        <select
          value={selectedDistrict}
          onChange={e => { setSelectedDistrict(e.target.value); setShowAll(false); }}
          className="job-district-select"
        >
          {DISTRICTS.map(d => (
            <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-hunter-text-muted pointer-events-none" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hunter-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..."
          className="job-search-input"
        />
      </div>

      {/* My Skills */}
      {mySkills.size > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[10px] text-hunter-text-muted">Your skills:</span>
          {[...mySkills].map(s => (
            <span key={s} className="job-skill-tag job-skill-mine">{s}</span>
          ))}
        </div>
      )}

      {/* Job Cards */}
      <div className="space-y-2">
        {displayed.map((job, i) => (
          <div key={i} className={`job-card ${job.matchPct >= 50 ? 'job-card-match' : ''}`}>
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-hunter-text">{job.title}</h3>
                  {job.hot && <Flame size={12} className="text-orange-400" />}
                </div>
                <p className="text-xs text-hunter-text-muted">{job.company}</p>
              </div>
              <span className="job-type-badge" style={{ color: typeColors[job.type], borderColor: typeColors[job.type] + '44', background: typeColors[job.type] + '11' }}>
                {job.type}
              </span>
            </div>

            <p className="text-xs text-hunter-text-muted mb-2">{job.desc}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {job.skills.map(s => (
                  <span key={s} className={`job-skill-tag ${job.matchedSkills.includes(s) ? 'job-skill-match' : ''}`}>
                    {job.matchedSkills.includes(s) && '✓ '}{s}
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: '#22c55e' }}>{job.salary}</span>
            </div>

            {job.matchPct > 0 && (
              <div className="job-match-bar mt-2">
                <div className="job-match-fill" style={{ width: `${job.matchPct}%` }} />
                <span className="job-match-label">{job.matchPct}% skill match</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length > 4 && !showAll && (
        <button onClick={() => setShowAll(true)} className="hunter-btn hunter-btn-secondary text-sm">
          Show all {filtered.length} jobs
        </button>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-6 text-hunter-text-muted text-sm">
          No jobs found. Try another district or search term.
        </div>
      )}
    </div>
  );
}
