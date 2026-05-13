// ─── Emotion Detector ───
// Combines text analysis + voice signals for emotion classification

export function detectEmotion(answer, responseTimeMs, topic, voiceData = null) {
  const words = answer.trim().split(/\s+/).length;
  const timeSec = responseTimeMs / 1000;
  const lower = answer.toLowerCase();
  const matched = topic.keywords.filter(k => lower.includes(k)).length;
  const score = matched / topic.keywords.length;

  // If we have voice data, blend it with text analysis
  if (voiceData && voiceData.stressScore !== undefined) {
    const voiceStress = voiceData.stressScore;
    const fillers = voiceData.fillerCount || 0;
    const pauses = voiceData.pauseCount || 0;

    // High voice stress overrides text confidence
    if (voiceStress >= 60) return 'STRESSED';
    if (voiceStress >= 40 && score < 0.2) return 'STRESSED';

    // Many fillers = confusion
    if (fillers >= 4 && score < 0.3) return 'CONFUSED';

    // Long pauses with few words = bored or disengaged
    if (pauses >= 3 && words < 5) return 'BORED';

    // Good voice + good text = confident
    if (voiceStress < 25 && score >= 0.25 && words >= 5) return 'CONFIDENT';
  }

  // Original text-only detection
  if (timeSec > 120 && words < 8) return 'STRESSED';
  if (timeSec > 90 && score < 0.15) return 'STRESSED';
  if (words < 5 && score < 0.1) return 'BORED';
  if (words > 80 && score < 0.2) return 'CONFUSED';
  if (timeSec < 10 && words < 6 && score < 0.1) return 'BORED';
  if (score >= 0.25 && words >= 8 && timeSec < 90) return 'CONFIDENT';
  if (score < 0.15) return 'CONFUSED';
  if (timeSec > 60) return 'STRESSED';
  if (words < 10 && score < 0.2) return 'CONFUSED';
  return 'CONFIDENT';
}

// Calculate skill dimensions for DNA card from session data
export function calculateSkillDNA(emotions, responseTimes, retryCount, topicCount) {
  const totalTopics = topicCount || emotions.length;
  const confidentCount = emotions.filter(e => e === 'CONFIDENT').length;
  const stressedCount = emotions.filter(e => e === 'STRESSED').length;
  const avgTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 60000;

  // 6 axes: 0-100 each
  return {
    speed: Math.min(100, Math.max(10, 100 - (avgTime / 1000))), // Faster = higher
    accuracy: Math.min(100, Math.max(10, (confidentCount / Math.max(1, totalTopics)) * 100)),
    confidence: Math.min(100, Math.max(10, ((totalTopics - stressedCount) / Math.max(1, totalTopics)) * 100)),
    creativity: Math.min(100, Math.max(10, 40 + Math.random() * 40)), // Slight randomness for uniqueness
    consistency: Math.min(100, Math.max(10, retryCount > 3 ? 30 : 80 - retryCount * 10)),
    resilience: Math.min(100, Math.max(10, stressedCount > 0 ? 50 + (confidentCount * 10) : 85)),
  };
}
