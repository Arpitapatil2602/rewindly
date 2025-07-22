export interface Entry {
  id: string;
  date: string;
  photo: string;
  thought: string;
  voiceNote?: string; // Base64 audio data
  emotions: string[];
  tags: string[];
  aiSummary: string;
  moodScore: number; // 1-10 scale
  energyLevel: number; // 1-10 scale
  productivityScore: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
  gratitudeItems: string[];
  goals: string[];
  achievements: string[];
  challenges: string[];
  learnings: string[];
  actionItems: string[];
  createdAt: Date;
  isShared: boolean;
  sharedWith: string[];
  category: 'personal' | 'work' | 'health' | 'relationships' | 'learning' | 'goals';
  priority: 'low' | 'medium' | 'high';
}

export interface EmotionAnalysis {
  primary: string;
  secondary: string[];
  confidence: number;
  moodScore: number;
  energyLevel: number;
  stressLevel: number;
  productivityScore: number;
}

export interface WeeklyReflection {
  weekStart: string;
  weekEnd: string;
  averageMood: number;
  averageEnergy: number;
  averageProductivity: number;
  averageStress: number;
  topEmotions: string[];
  entryCount: number;
  highlights: string[];
  growthNote: string;
  goalsProgress: { goal: string; progress: number }[];
  keyLearnings: string[];
  upcomingActions: string[];
}

export interface MonthlyReflection {
  month: string;
  year: number;
  averageMood: number;
  averageEnergy: number;
  averageProductivity: number;
  averageStress: number;
  topEmotions: string[];
  entryCount: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  energyTrend: 'improving' | 'stable' | 'declining';
  productivityTrend: 'improving' | 'stable' | 'declining';
  stressTrend: 'improving' | 'stable' | 'declining';
  keyInsights: string[];
  monthlyGoal?: string;
  completedGoals: string[];
  topLearnings: string[];
  businessImpact: string[];
}

export interface GoalTracking {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'work' | 'health' | 'relationships' | 'learning';
  targetDate: string;
  progress: number; // 0-100
  milestones: { title: string; completed: boolean; date?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessMetrics {
  totalReflections: number;
  averageWellbeing: number;
  productivityTrend: number;
  stressReduction: number;
  goalsCompleted: number;
  learningsTracked: number;
  engagementScore: number;
}
export interface ShareableMemory {
  entryId: string;
  shareId: string;
  sharedAt: Date;
  expiresAt?: Date;
  viewCount: number;
}