import React from 'react';
import { DailyChallenge, Lesson, UserStats } from '../types';
import { LESSONS } from '../data/curriculum';
import { Trophy, CheckCircle, Clock, Zap, Sparkles, Award } from 'lucide-react';
import { playSound } from '../services/storage';

interface ChallengesTabProps {
  stats: UserStats;
  challenges: DailyChallenge[];
  onStartLesson: (lesson: Lesson) => void;
  onClaimDailyBonus: () => void;
  claimedDailyBonus: boolean;
}

export const ChallengesTab: React.FC<ChallengesTabProps> = ({
  stats,
  challenges,
  onStartLesson,
  onClaimDailyBonus,
  claimedDailyBonus
}) => {
  const completedCount = challenges.filter(c => stats.completedChallengeIds.includes(c.id)).length;
  const allCompleted = completedCount === challenges.length && challenges.length > 0;

  return (
    <div className="space-y-5 pb-6">
      {/* Title & Subheading */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Daily Skill Sprints
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Conquer short targeted sprints before midnight to lock in your daily streak and earn XP.
        </p>
      </div>

      {/* Countdown & Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900 border border-violet-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-slate-300 font-medium">Sprint Cycle Resets In</span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">Midnight (Local Time)</span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Daily Progress</span>
            <span className="font-mono font-bold text-violet-300">{completedCount} of {challenges.length} Done</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / (challenges.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grand Daily Sprint Bonus Box */}
      {allCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-violet-900/30 to-slate-900 border border-amber-500/40 shadow-xl shadow-amber-950/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-xs font-bold text-white">Daily Trio Champion!</h3>
                <p className="text-[11px] text-slate-300">All daily challenges completed.</p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
              +50 BONUS XP
            </span>
          </div>

          <button
            onClick={() => {
              if (!claimedDailyBonus) {
                onClaimDailyBonus();
                if (stats.soundEnabled) playSound('complete');
              }
            }}
            disabled={claimedDailyBonus}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              claimedDailyBonus
                ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-900/40 hover:opacity-95 active:scale-95'
            }`}
          >
            {claimedDailyBonus ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Daily Bonus Claimed!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" /> Claim +50 Daily Bonus XP
              </>
            )}
          </button>
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-3">
        {challenges.map((ch, index) => {
          const isDone = stats.completedChallengeIds.includes(ch.id);
          const linkedLesson = LESSONS.find(l => l.id === ch.lessonRefId);

          return (
            <div
              key={ch.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : 'bg-slate-900/90 border-slate-800 hover:border-violet-500/40 shadow-lg shadow-black/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-violet-600/20 text-violet-400 text-[10px] font-bold flex items-center justify-center border border-violet-500/30">
                      #{index + 1}
                    </span>
                    <h3 className="text-xs font-bold text-white">{ch.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">{ch.description}</p>
                </div>

                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">
                  +{ch.targetXp} XP
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center pl-7">
                <span className="text-[11px] text-slate-400 capitalize">
                  Skill Sprint • {ch.categoryId}
                </span>

                {isDone ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (linkedLesson) onStartLesson(linkedLesson);
                      if (stats.soundEnabled) playSound('tap');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-900/30 active:scale-95 transition-all"
                  >
                    <Zap className="w-3 h-3 fill-current" /> Begin Sprint
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation Quote Box */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center">
        <p className="text-xs text-slate-400 italic">
          "Consistency beats intensity. 3 minutes of daily deliberate practice compounds into world-class mastery."
        </p>
      </div>
    </div>
  );
};
