import { useState, useEffect, useRef } from 'react';
import { Share2, Download, Sparkles } from 'lucide-react';

// Calculate hex vertex positions for radar chart
function hexVertex(cx, cy, radius, angle) {
  const rad = (Math.PI / 180) * (angle - 90);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function buildHexPoints(cx, cy, radius) {
  return [0, 60, 120, 180, 240, 300].map(a => hexVertex(cx, cy, radius, a));
}

function buildDataPoints(cx, cy, maxRadius, values) {
  const axes = Object.values(values);
  return axes.map((v, i) => {
    const angle = i * 60;
    const r = (v / 100) * maxRadius;
    return hexVertex(cx, cy, r, angle);
  });
}

function pointsToString(points) {
  return points.map(p => `${p.x},${p.y}`).join(' ');
}

const AXES = [
  { key: 'speed', label: 'Speed', emoji: '⚡' },
  { key: 'accuracy', label: 'Accuracy', emoji: '🎯' },
  { key: 'confidence', label: 'Confidence', emoji: '💪' },
  { key: 'creativity', label: 'Creativity', emoji: '🎨' },
  { key: 'consistency', label: 'Consistency', emoji: '📊' },
  { key: 'resilience', label: 'Resilience', emoji: '🛡️' },
];

export default function SkillDNACard({ name, dnaData, emotions, topicCount, onClose }) {
  const [drawn, setDrawn] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const cx = 150, cy = 140, maxR = 100;
  const outerHex = buildHexPoints(cx, cy, maxR);
  const midHex = buildHexPoints(cx, cy, maxR * 0.66);
  const innerHex = buildHexPoints(cx, cy, maxR * 0.33);
  const dataPoints = buildDataPoints(cx, cy, maxR, dnaData);

  // Badge ID
  const badgeId = `HNT-${Date.now().toString(36).toUpperCase().slice(-6)}-${name.slice(0, 3).toUpperCase()}`;

  // Dominant emotion color
  const dominantEmotion = emotions?.length
    ? (() => {
        const counts = {};
        emotions.forEach(e => { counts[e] = (counts[e] || 0) + 1; });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      })()
    : 'CONFIDENT';

  const gradientColors = {
    CONFIDENT: ['#22c55e', '#16a34a'],
    CONFUSED: ['#f59e0b', '#d97706'],
    STRESSED: ['#ef4444', '#dc2626'],
    BORED: ['#6366f1', '#4f46e5'],
  };
  const [gStart, gEnd] = gradientColors[dominantEmotion] || gradientColors.CONFIDENT;

  useEffect(() => { setTimeout(() => setDrawn(true), 100); }, []);

  const handleShare = async () => {
    const shareText = `🧬 My Skill DNA | HUNTER AI Tutor\n👤 ${name}\n⚡ Speed: ${dnaData.speed}%\n🎯 Accuracy: ${dnaData.accuracy}%\n💪 Confidence: ${dnaData.confidence}%\n🎨 Creativity: ${dnaData.creativity}%\n📊 Consistency: ${dnaData.consistency}%\n🛡️ Resilience: ${dnaData.resilience}%\n\n🏆 Badge: ${badgeId}\nPowered by HUNTER AI`;

    if (navigator.share) {
      try { await navigator.share({ title: 'My Skill DNA', text: shareText }); }
      catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="dna-card p-5">
        {/* Holographic overlay */}
        <div className="absolute inset-0 animate-holographic rounded-[20px]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="animate-bounce-in mb-2">
              <Sparkles size={32} className="mx-auto text-hunter-accent-light" />
            </div>
            <h2 className="text-xl font-bold">🧬 Skill DNA</h2>
            <p className="text-xs text-hunter-text-muted">Unique Learning Fingerprint</p>
          </div>

          {/* Hexagonal Chart */}
          <div className="flex justify-center mb-4">
            <svg width="300" height="280" viewBox="0 0 300 280" className="dna-hex-svg">
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gStart} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={gEnd} stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gStart} />
                  <stop offset="100%" stopColor={gEnd} />
                </linearGradient>
              </defs>

              {/* Grid hexagons */}
              <polygon points={pointsToString(outerHex)} fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="1" />
              <polygon points={pointsToString(midHex)} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="1" />
              <polygon points={pointsToString(innerHex)} fill="none" stroke="rgba(124,58,237,0.05)" strokeWidth="1" />

              {/* Axis lines */}
              {outerHex.map((p, i) => (
                <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(124,58,237,0.1)" strokeWidth="1" />
              ))}

              {/* Data shape */}
              {drawn && (
                <>
                  <polygon points={pointsToString(dataPoints)} className="dna-hex-fill" fill="url(#hexGradient)" />
                  <polygon points={pointsToString(dataPoints)} className="dna-hex-outline" stroke="url(#hexStroke)" />
                </>
              )}

              {/* Vertex dots + labels */}
              {dataPoints.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={drawn ? 4 : 0} className="dna-vertex"
                    style={{ transition: `all 0.5s ease-out ${0.5 + i * 0.15}s` }} />
                  <text
                    x={outerHex[i].x + (outerHex[i].x > cx ? 8 : outerHex[i].x < cx ? -8 : 0)}
                    y={outerHex[i].y + (outerHex[i].y > cy ? 16 : outerHex[i].y < cy ? -8 : 0)}
                    textAnchor={outerHex[i].x > cx ? 'start' : outerHex[i].x < cx ? 'end' : 'middle'}
                    className="dna-label"
                  >
                    {AXES[i].emoji} {AXES[i].label}
                  </text>
                  <text
                    x={outerHex[i].x + (outerHex[i].x > cx ? 8 : outerHex[i].x < cx ? -8 : 0)}
                    y={outerHex[i].y + (outerHex[i].y > cy ? 28 : outerHex[i].y < cy ? 4 : 12)}
                    textAnchor={outerHex[i].x > cx ? 'start' : outerHex[i].x < cx ? 'end' : 'middle'}
                    className="dna-score"
                  >
                    {Math.round(Object.values(dnaData)[i])}%
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Student Info */}
          <div className="glass-card p-4 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-hunter-text-muted">Student</p>
                <p className="font-bold text-hunter-accent-light">{name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-hunter-text-muted">Topics</p>
                <p className="font-bold">{topicCount || 5} Mastered</p>
              </div>
            </div>
          </div>

          {/* Badge ID */}
          <div className="text-center mb-4">
            <p className="text-[10px] text-hunter-text-muted mb-1">Verified Badge ID</p>
            <p className="dna-badge-id">{badgeId}</p>
            <p className="text-[9px] text-hunter-text-muted mt-1">Powered by HUNTER AI • {new Date().toLocaleDateString()}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleShare} className="hunter-btn hunter-btn-primary flex items-center justify-center gap-2">
              <Share2 size={16} /> {copied ? 'Copied! ✓' : 'Share DNA Card'}
            </button>
          </div>
          {onClose && (
            <button onClick={onClose} className="hunter-btn hunter-btn-secondary mt-2 text-sm">
              Back to Results
            </button>
          )}
        </div>
      </div>
      {copied && <div className="copy-toast">DNA Card copied to clipboard!</div>}
    </div>
  );
}
