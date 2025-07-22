import { EmotionAnalysis } from '../types';

const emotions = [
  'grateful', 'peaceful', 'excited', 'content', 'hopeful', 'inspired',
  'anxious', 'overwhelmed', 'sad', 'frustrated', 'lonely', 'confused',
  'proud', 'confident', 'loved', 'energetic', 'calm', 'reflective'
];

const moodKeywords = {
  positive: ['amazing', 'great', 'wonderful', 'happy', 'joy', 'love', 'success', 'accomplished', 'grateful', 'blessed'],
  negative: ['difficult', 'hard', 'struggle', 'sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed'],
  neutral: ['okay', 'normal', 'regular', 'routine', 'usual']
};

export function analyzeEmotion(thought: string): EmotionAnalysis {
  const words = thought.toLowerCase().split(/\s+/);
  
  // Start with different base values for more realistic variation
  let moodScore = 6; // Slightly optimistic base
  let energyLevel = 4; // Lower energy base (most people start tired)
  let stressLevel = 6; // Higher stress base (modern life reality)
  let emotionMatches: string[] = [];
  
  // Analyze mood based on keywords
  const positiveCount = words.filter(word => 
    moodKeywords.positive.some(keyword => word.includes(keyword))
  ).length;
  
  const negativeCount = words.filter(word => 
    moodKeywords.negative.some(keyword => word.includes(keyword))
  ).length;
  
  // Energy level keywords
  const energyKeywords = {
    high: ['energetic', 'motivated', 'excited', 'pumped', 'active', 'dynamic', 'vibrant', 'charged', 'powerful', 'strong', 'fresh', 'alert', 'awake', 'alive', 'invigorated', 'enthusiastic', 'spirited'],
    low: ['tired', 'exhausted', 'drained', 'sluggish', 'lethargic', 'weary', 'sleepy', 'fatigued', 'worn', 'depleted', 'drowsy', 'spent', 'burned', 'wiped']
  };
  
  const highEnergyCount = words.filter(word => 
    energyKeywords.high.some(keyword => word.includes(keyword))
  ).length;
  
  const lowEnergyCount = words.filter(word => 
    energyKeywords.low.some(keyword => word.includes(keyword))
  ).length;
  
  // Stress level keywords
  const stressKeywords = {
    high: ['stressed', 'overwhelmed', 'pressure', 'deadline', 'urgent', 'panic', 'anxious', 'worried', 'tense', 'frantic', 'rushed', 'chaos', 'crisis', 'emergency', 'hectic', 'demanding', 'intense'],
    low: ['calm', 'relaxed', 'peaceful', 'serene', 'balanced', 'zen', 'tranquil', 'composed', 'centered', 'steady']
  };
  
  const highStressCount = words.filter(word => 
    stressKeywords.high.some(keyword => word.includes(keyword))
  ).length;
  
  const lowStressCount = words.filter(word => 
    stressKeywords.low.some(keyword => word.includes(keyword))
  ).length;
  
  // Productivity keywords
  const productivityKeywords = {
    high: ['productive', 'accomplished', 'completed', 'finished', 'achieved', 'successful', 'efficient', 'focused', 'organized', 'progress', 'delivered', 'executed', 'implemented', 'solved', 'created'],
    low: ['unproductive', 'distracted', 'procrastinated', 'delayed', 'stuck', 'blocked', 'unfocused', 'scattered']
  };
  
  const highProductivityCount = words.filter(word => 
    productivityKeywords.high.some(keyword => word.includes(keyword))
  ).length;
  
  const lowProductivityCount = words.filter(word => 
    productivityKeywords.low.some(keyword => word.includes(keyword))
  ).length;
  
  // Calculate mood with stronger impact
  moodScore += (positiveCount * 2.2) - (negativeCount * 2.5);
  // Add randomness for realism
  moodScore += (Math.random() - 0.5) * 2;
  moodScore = Math.max(1, Math.min(10, moodScore));
  
  // Energy calculation with time and activity factors
  energyLevel += (highEnergyCount * 3.2) - (lowEnergyCount * 3.8);
  if (words.some(w => ['morning', 'coffee', 'exercise', 'workout', 'run', 'gym'].includes(w))) energyLevel += 2.5;
  if (words.some(w => ['evening', 'late', 'night', 'bed', 'sleep'].includes(w))) energyLevel -= 2.2;
  if (words.some(w => ['lunch', 'break', 'rest', 'vacation'].includes(w))) energyLevel += 1.5;
  // Add time-based variation
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 10) energyLevel += 1; // Morning boost
  if (hour >= 14 && hour <= 16) energyLevel -= 0.5; // Afternoon dip
  if (hour >= 20) energyLevel -= 1.5; // Evening decline
  energyLevel += (Math.random() - 0.5) * 3;
  energyLevel = Math.max(1, Math.min(10, energyLevel));
  
  // Stress calculation with work/life factors
  stressLevel += (highStressCount * 2.8) - (lowStressCount * 3.5);
  if (words.some(w => ['meeting', 'deadline', 'presentation', 'interview', 'boss', 'client'].includes(w))) stressLevel += 2;
  if (words.some(w => ['vacation', 'weekend', 'break', 'holiday', 'spa', 'massage'].includes(w))) stressLevel -= 2.5;
  if (words.some(w => ['traffic', 'commute', 'bills', 'money', 'problem'].includes(w))) stressLevel += 1.5;
  stressLevel += (Math.random() - 0.5) * 2.5;
  stressLevel = Math.max(1, Math.min(10, stressLevel));
  
  // Productivity calculation with achievement focus
  let productivityScore = 4; // Lower base for realism
  productivityScore += (highProductivityCount * 3.5) - (lowProductivityCount * 4);
  if (words.some(w => ['goals', 'completed', 'finished', 'done'].includes(w))) productivityScore += 1;
  if (words.some(w => ['distracted', 'procrastinated', 'delayed'].includes(w))) productivityScore -= 1;
  productivityScore = Math.max(1, Math.min(10, productivityScore));
  
  // Select emotions based on content
  if (moodScore >= 7) {
    emotionMatches = ['grateful', 'content', 'hopeful', 'inspired'].slice(0, 2);
  } else if (moodScore >= 4) {
    emotionMatches = ['reflective', 'calm', 'peaceful'].slice(0, 2);
  } else {
    emotionMatches = ['anxious', 'overwhelmed', 'frustrated'].slice(0, 2);
  }
  
  // Add random variation
  const additionalEmotions = emotions.filter(e => !emotionMatches.includes(e));
  if (Math.random() > 0.5 && additionalEmotions.length > 0) {
    emotionMatches.push(additionalEmotions[Math.floor(Math.random() * additionalEmotions.length)]);
  }
  
  return {
    primary: emotionMatches[0] || 'reflective',
    secondary: emotionMatches.slice(1),
    confidence: 0.7 + Math.random() * 0.3,
    moodScore: Math.round(moodScore * 10) / 10,
    energyLevel: Math.round(energyLevel * 10) / 10,
    stressLevel: Math.round(stressLevel * 10) / 10,
    productivityScore: Math.round(productivityScore * 10) / 10
  };
}

export function generateTags(thought: string): string[] {
  const words = thought.toLowerCase().split(/\s+/);
  const commonTags = [
    'work', 'family', 'friends', 'health', 'exercise', 'nature', 'travel',
    'learning', 'creativity', 'goals', 'relationships', 'mindfulness',
    'growth', 'challenges', 'success', 'memories', 'dreams', 'productivity',
    'leadership', 'teamwork', 'innovation', 'strategy', 'networking',
    'skill-development', 'career', 'business', 'finance', 'wellness'
  ];
  
  const suggestedTags = commonTags.filter(tag => 
    words.some(word => word.includes(tag) || tag.includes(word))
  );
  
  // Add some contextual tags based on content
  if (words.some(w => ['morning', 'coffee', 'breakfast'].includes(w))) {
    suggestedTags.push('morning routine');
  }
  if (words.some(w => ['evening', 'sunset', 'dinner'].includes(w))) {
    suggestedTags.push('evening reflection');
  }
  if (words.some(w => ['book', 'read', 'story'].includes(w))) {
    suggestedTags.push('reading');
  }
  if (words.some(w => ['meeting', 'presentation', 'project'].includes(w))) {
    suggestedTags.push('professional');
  }
  if (words.some(w => ['goal', 'target', 'achievement'].includes(w))) {
    suggestedTags.push('goal-tracking');
  }
  
  return [...new Set(suggestedTags)].slice(0, 4);
}

export function generateAISummary(thought: string, emotions: string[]): string {
  const templates = [
    `Today's reflection shows a ${emotions[0]} mindset with themes of personal and professional growth.`,
    `This entry captures a moment of ${emotions[0]} introspection that could drive actionable insights.`,
    `The thoughts shared reveal ${emotions[0]} feelings with potential for strategic planning.`,
    `Today's entry demonstrates ${emotions[0]} emotional processing that supports decision-making.`,
    `This reflection indicates ${emotions[0]} energy that could be channeled into goal achievement.`,
    `The insights here show ${emotions[0]} awareness that supports leadership development.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

export function generateBusinessInsights(entries: Entry[]): string[] {
  const insights = [];
  
  if (entries.length === 0) return insights;
  
  const avgProductivity = entries.reduce((sum, e) => sum + (e.productivityScore || 5), 0) / entries.length;
  const avgStress = entries.reduce((sum, e) => sum + (e.stressLevel || 5), 0) / entries.length;
  const avgEnergy = entries.reduce((sum, e) => sum + (e.energyLevel || 5), 0) / entries.length;
  
  if (avgProductivity >= 7) {
    insights.push('High productivity patterns identified - consider documenting successful strategies');
  }
  
  if (avgStress >= 7) {
    insights.push('Elevated stress levels detected - recommend stress management techniques');
  }
  
  if (avgEnergy >= 7) {
    insights.push('Strong energy levels - optimal time for tackling challenging projects');
  }
  
  const workEntries = entries.filter(e => e.category === 'work').length;
  if (workEntries > entries.length * 0.6) {
    insights.push('Work-life balance may need attention - consider more personal reflection time');
  }
  
  return insights;
}