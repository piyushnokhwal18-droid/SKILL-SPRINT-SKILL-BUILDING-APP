import confetti from 'canvas-confetti';
import { UserStats, Badge } from '../types';
import { BADGES } from '../data/curriculum';

const STORAGE_KEY = 'skillsprint_user_data_v2';
const BADGES_KEY = 'skillsprint_badges_v2';

export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const AVATAR_OPTIONS = [
  '⚡', '🚀', '🧠', '🔮', '🎯', '💡', '🔥', '💎', '🦉', '🦊'
];

export const LEVEL_TITLES: { [level: number]: string } = {
  1: 'Novice Sprinter',
  2: 'Curious Learner',
  3: 'Skill Practitioner',
  4: 'Knowledge Adept',
  5: 'Sprint Master',
  6: 'Polymath Elite',
  7: 'Grandmaster'
};

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[level] || `Level ${level} Legend`;
}

const DEFAULT_STATS: UserStats = {
  username: 'SprintLearner',
  avatar: '⚡',
  xp: 0,
  level: 1,
  currentStreak: 1,
  bestStreak: 1,
  lastActiveDate: getTodayKey(),
  completedLessonIds: [],
  completedChallengeIds: [],
  weeklyActivity: {
    [getTodayKey()]: 0
  },
  soundEnabled: true,
  favorites: []
};

// Web Audio API Synthesizer for lightweight, offline sound effects
export function playSound(type: 'correct' | 'wrong' | 'complete' | 'levelup' | 'tap') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'tap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'levelup' || type === 'complete') {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
      });
    }
  } catch (e) {
    // Ignore audio errors if browser blocks autoplay
  }
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#a855f7', '#38bdf8', '#818cf8', '#f59e0b', '#34d399']
    });
  } catch (e) {
    // Graceful fallback
  }
}

export function triggerLevelUpConfetti() {
  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    // Graceful fallback
  }
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserStats(DEFAULT_STATS);
      return DEFAULT_STATS;
    }
    const parsed: UserStats = JSON.parse(raw);
    return syncStreak({
      ...DEFAULT_STATS,
      ...parsed
    });
  } catch (err) {
    console.error('Failed to load user stats from localStorage:', err);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to write user stats to localStorage:', err);
  }
}

export function loadBadges(): Badge[] {
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    if (!raw) {
      saveBadges(BADGES);
      return BADGES;
    }
    const storedBadges: Badge[] = JSON.parse(raw);
    // Merge in any new badges defined in curriculum
    return BADGES.map(b => {
      const existing = storedBadges.find(s => s.id === b.id);
      return existing ? { ...b, unlockedAt: existing.unlockedAt } : b;
    });
  } catch {
    return BADGES;
  }
}

export function saveBadges(badges: Badge[]): void {
  try {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  } catch (err) {
    console.error('Failed to save badges:', err);
  }
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function syncStreak(stats: UserStats): UserStats {
  const today = getTodayKey();
  if (stats.lastActiveDate === today) {
    return stats;
  }

  const lastDate = new Date(stats.lastActiveDate);
  const curDate = new Date(today);
  const diffTime = curDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Yesterday was the last activity: maintain streak
    stats.lastActiveDate = today;
  } else if (diffDays > 1) {
    // Streak broken, reset to 1 day for today's session
    stats.currentStreak = 1;
    stats.lastActiveDate = today;
  } else if (diffDays === 0) {
    stats.lastActiveDate = today;
  }

  saveUserStats(stats);
  return stats;
}

export function checkAndUnlockBadges(
  stats: UserStats,
  currentBadges: Badge[]
): { updatedBadges: Badge[]; newlyUnlocked: Badge[] } {
  const newlyUnlocked: Badge[] = [];
  const updatedBadges = currentBadges.map((badge) => {
    if (badge.unlockedAt) return badge;

    let shouldUnlock = false;
    if (badge.id === 'badge-first-step' && stats.completedLessonIds.length >= 1) {
      shouldUnlock = true;
    } else if (badge.id === 'badge-centurion' && stats.xp >= 100) {
      shouldUnlock = true;
    } else if (badge.id === 'badge-streak-fire' && stats.currentStreak >= 2) {
      shouldUnlock = true;
    } else if (badge.id === 'badge-polymath' && stats.completedLessonIds.length >= 3) {
      shouldUnlock = true;
    } else if (badge.id === 'badge-quiz-ace' && stats.completedLessonIds.length >= 3) {
      shouldUnlock = true;
    } else if (badge.id === 'badge-master-mind' && (stats.level >= 5 || stats.xp >= 400)) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      const unlocked = { ...badge, unlockedAt: new Date().toLocaleDateString() };
      newlyUnlocked.push(unlocked);
      return unlocked;
    }
    return badge;
  });

  if (newlyUnlocked.length > 0) {
    saveBadges(updatedBadges);
  }

  return { updatedBadges, newlyUnlocked };
}
