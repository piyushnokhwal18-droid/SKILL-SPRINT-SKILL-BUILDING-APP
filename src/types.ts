export type CategoryId = 'ai' | 'writing' | 'design' | 'productivity' | 'general';

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  iconName: string;
  gradient: string;
  accentColor: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type LessonSectionType = 'text' | 'rule' | 'example' | 'bullet';

export interface LessonSection {
  type: LessonSectionType;
  title?: string;
  text: string;
}

export interface Lesson {
  id: string;
  categoryId: CategoryId;
  title: string;
  readTime: string;
  summary: string;
  sections: LessonSection[];
  keyTakeaway: string;
  xpReward: number;
  quiz: QuizQuestion[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  categoryId: CategoryId;
  description: string;
  targetXp: number;
  completed: boolean;
  type: 'quiz' | 'lesson' | 'drill';
  lessonRefId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface UserStats {
  username: string;
  avatar: string;
  xp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  weeklyActivity: { [dayKey: string]: number }; // e.g. "2026-10-22": 45 (XP earned)
  apiKey?: string;
  soundEnabled: boolean;
  favorites: string[];
}
