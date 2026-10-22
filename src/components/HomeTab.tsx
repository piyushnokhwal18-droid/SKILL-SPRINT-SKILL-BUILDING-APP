import React from 'react';
import { UserStats, DailyChallenge, Lesson, CategoryId } from '../types';
import { CATEGORIES, LESSONS } from '../data/curriculum';
import { getLevelTitle, getTodayKey, playSound } from '../services/storage';
import { Zap, Play, ArrowRight, CheckCircle2, TrendingUp, Sparkles, Flame, HelpCircle, Download } from 'lucide-react';

interface HomeTabProps {
  stats: UserStats;
  challenges: DailyChallenge[];
  featuredLesson: Lesson;
  isInstalled: boolean;
  onOpenInstallModal: () => void;
  onStartLesson: (lesson: Lesson) => void;
  onNavigateTab: (tab: 'home' | 'learn' | 'challenges' | 'profile') => void;
  onSelectCategoryFilter: (categoryId: CategoryId) => void;
  onStartQuickDrill: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  stats,
  challenges,
  featuredLesson,
  isInstalled,
  onOpenInstallModal,
  onStartLesson,
  onNavigateTab,
  onSelectCategoryFilter,
  onStartQuickDrill
}) => {
  const currentLevelBase = (stats.level - 1) * 100;
  const currentLevelProgress = Math.max(0, stats.xp - currentLevelBase);
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / 100) * 100));
  const levelTitle = getLevelTitle(stats.level);

  // Generate last 7 days keys and labels for weekly momentum
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = key === getTodayKey();
    const xp = stats.weeklyActivity[key] || 0;
    return { key, dayLabel, isToday, xp };
  });

  const maxWeeklyXp = Math.max(50, ...last7Days.map(d => d.xp));

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome & XP Progression Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1.5px] shadow-md shadow-violet-900/40">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center text-xl">
                {stats.avatar}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Welcome back</span>
              </div>
              <h1 className="text-lg font-bold text-white leading-tight">{stats.username}</h1>
              <span className="text-xs text-violet-300 font-medium">{levelTitle}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-medium text-slate-400 block">Total Experience</span>
            <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 font-mono">
              {stats.xp} <span className="text-xs text-slate-400 font-normal">XP</span>
            </div>
          </div>
        </div>

        {/* Level Progression Meter */}
        <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1 font-bold text-violet-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Level {stats.level}
            </span>
            <span className="font-mono text-slate-400">
              {currentLevelProgress} / 100 XP
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-violet-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-0.5">
            <span>{100 - currentLevelProgress} XP to Level {stats.level + 1}</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-400" /> {stats.currentStreak} Day Streak
            </span>
          </div>
        </div>
      </section>

      {/* In-App Install App / APK Banner */}
      {!isInstalled && (
        <section className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/70 via-indigo-950/50 to-slate-900 border border-violet-500/40 flex items-center justify-between shadow-lg shadow-violet-950/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1.5px] shadow-md shadow-violet-900/40 shrink-0">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center text-cyan-300">
                <Download className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                Install SkillSprint App
                <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30">
                  Android APK
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Install to home screen for full offline micro-sprints
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onOpenInstallModal();
              if (stats.soundEnabled) playSound('tap');
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-violet-900/40 active:scale-95 transition-all whitespace-nowrap ml-2"
          >
            Install
          </button>
        </section>
      )}

      {/* Quick Rapid-Fire Drill Banner */}
      <section className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">60-Second Skill Drill</h3>
            <p className="text-[11px] text-slate-400">3 rapid questions to test memory & earn +20 XP</p>
          </div>
        </div>
        <button
          onClick={() => {
            onStartQuickDrill();
            if (stats.soundEnabled) playSound('tap');
          }}
          className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-900/40 active:scale-95 transition-all"
        >
          Drill
        </button>
      </section>

      {/* Featured Today's Sprint */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-violet-400 fill-violet-400" />
            Featured Daily Sprint
          </h2>
          <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20 font-mono">
            +{featuredLesson.xpReward} XP
          </span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-900 border border-violet-500/30 p-4.5 relative group hover:border-violet-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
              {featuredLesson.readTime} Read • AI Basics
            </span>
            {stats.completedLessonIds.includes(featuredLesson.id) && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-white mt-2.5 leading-snug">
            {featuredLesson.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {featuredLesson.summary}
          </p>

          <button
            onClick={() => {
              onStartLesson(featuredLesson);
              if (stats.soundEnabled) playSound('tap');
            }}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 transition-all active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {stats.completedLessonIds.includes(featuredLesson.id) ? 'Review Lesson & Retake Quiz' : 'Start 3-Minute Sprint'}
          </button>
        </div>
      </section>

      {/* Today's Daily Challenges Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Today's Challenges ({challenges.filter(c => stats.completedChallengeIds.includes(c.id)).length}/{challenges.length})
          </h2>
          <button
            onClick={() => onNavigateTab('challenges')}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-0.5 font-semibold"
          >
            All Challenges <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {challenges.map((ch) => {
            const isDone = stats.completedChallengeIds.includes(ch.id);
            const linkedLesson = LESSONS.find(l => l.id === ch.lessonRefId);

            return (
              <div
                key={ch.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all"
              >
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{ch.title}</span>
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                      +{ch.targetXp} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{ch.description}</p>
                </div>

                <div>
                  {isDone ? (
                    <div className="flex items-center text-emerald-400 gap-1 text-xs font-semibold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (linkedLesson) onStartLesson(linkedLesson);
                        else onNavigateTab('challenges');
                        if (stats.soundEnabled) playSound('tap');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-[11px] font-semibold text-slate-200 border border-slate-700 hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all"
                    >
                      Sprint
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Momentum 7-Day Bar Chart */}
      <section className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Weekly Momentum</h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {stats.currentStreak} Day Active Streak 🔥
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {last7Days.map((d) => {
            const heightPercent = d.xp > 0 ? Math.max(20, Math.min(100, (d.xp / maxWeeklyXp) * 100)) : 8;
            return (
              <div key={d.key} className="flex flex-col items-center space-y-1.5">
                <span className="text-[9px] font-mono text-slate-400">{d.xp > 0 ? `${d.xp}xp` : '0'}</span>
                <div className="w-full h-14 rounded-lg bg-slate-950 border border-slate-800/80 flex items-end justify-center p-0.5 overflow-hidden">
                  <div
                    className={`w-full rounded-md transition-all duration-500 ${
                      d.isToday
                        ? 'bg-gradient-to-t from-violet-600 via-indigo-500 to-cyan-400 shadow-sm shadow-cyan-400/30'
                        : d.xp > 0
                        ? 'bg-gradient-to-t from-violet-900 to-violet-600'
                        : 'bg-slate-800/20'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[10px] ${d.isToday ? 'text-cyan-400 font-bold' : 'text-slate-500 font-medium'}`}>
                  {d.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Explore Track Categories */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Skill Tracks
          </h2>
          <span className="text-xs text-slate-400">{LESSONS.length} Micro-Lessons</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat) => {
            const catLessons = LESSONS.filter(l => l.categoryId === cat.id);
            const doneCount = catLessons.filter(l => stats.completedLessonIds.includes(l.id)).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategoryFilter(cat.id);
                  onNavigateTab('learn');
                  if (stats.soundEnabled) playSound('tap');
                }}
                className="text-left p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 transition-all active:scale-95 space-y-1.5 group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {doneCount}/{catLessons.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{cat.tagline}</p>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${(doneCount / (catLessons.length || 1)) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
