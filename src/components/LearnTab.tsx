import React, { useState } from 'react';
import { CategoryId, Lesson, UserStats } from '../types';
import { CATEGORIES, LESSONS } from '../data/curriculum';
import { BookOpen, CheckCircle, ArrowRight, Search, Heart, Sparkles } from 'lucide-react';
import { playSound } from '../services/storage';

interface LearnTabProps {
  stats: UserStats;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  onSelectLesson: (lesson: Lesson) => void;
  onToggleFavorite: (lessonId: string) => void;
}

export const LearnTab: React.FC<LearnTabProps> = ({
  stats,
  selectedCategory,
  onSelectCategory,
  onSelectLesson,
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'uncompleted' | 'favorites'>('all');

  const filteredLessons = LESSONS.filter(lesson => {
    // Category check
    if (selectedCategory !== 'all' && lesson.categoryId !== selectedCategory) {
      return false;
    }
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = lesson.title.toLowerCase().includes(q);
      const matchSummary = lesson.summary.toLowerCase().includes(q);
      const matchTakeaway = lesson.keyTakeaway.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchTakeaway) return false;
    }
    // Status check
    if (filterMode === 'uncompleted' && stats.completedLessonIds.includes(lesson.id)) {
      return false;
    }
    if (filterMode === 'favorites' && !stats.favorites.includes(lesson.id)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <BookOpen className="w-5 h-5 text-violet-400" />
          SkillSprint Tracks
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          High-leverage practical skills broken down into 3-minute actionable sprints.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search formulas, prompts, rules, mental models..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/70 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Pills (Horizontal Scrollable) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-4 px-4">
        <button
          onClick={() => {
            onSelectCategory('all');
            if (stats.soundEnabled) playSound('tap');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          All ({LESSONS.length})
        </button>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                if (stats.soundEnabled) playSound('tap');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Filter Mode Bar: Uncompleted / Favorites */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
              filterMode === 'all' ? 'text-violet-300 bg-violet-950/60 border border-violet-800/40' : 'text-slate-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('uncompleted')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
              filterMode === 'uncompleted' ? 'text-violet-300 bg-violet-950/60 border border-violet-800/40' : 'text-slate-400'
            }`}
          >
            To-Do Only
          </button>
          <button
            onClick={() => setFilterMode('favorites')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
              filterMode === 'favorites' ? 'text-pink-300 bg-pink-950/60 border border-pink-800/40' : 'text-slate-400'
            }`}
          >
            <Heart className="w-3 h-3" /> Saved ({stats.favorites.length})
          </button>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {filteredLessons.length} available
        </span>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">No lessons match your filter</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search query or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterMode('all');
                onSelectCategory('all');
              }}
              className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredLessons.map(lesson => {
            const isDone = stats.completedLessonIds.includes(lesson.id);
            const isFavorite = stats.favorites.includes(lesson.id);
            const category = CATEGORIES.find(c => c.id === lesson.categoryId);

            return (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition-all relative overflow-hidden group shadow-lg shadow-black/20"
              >
                {/* Header row */}
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category?.accentColor || '#8b5cf6' }}
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {category?.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(lesson.id);
                        if (stats.soundEnabled) playSound('tap');
                      }}
                      className="text-slate-400 hover:text-pink-400 p-1"
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFavorite ? 'fill-pink-500 text-pink-500' : ''
                        }`}
                      />
                    </button>
                    <span className="text-[10px] font-bold text-violet-400 bg-violet-950/60 border border-violet-800/40 px-2 py-0.5 rounded-full font-mono">
                      +{lesson.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Lesson Title & Summary */}
                <h2 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
                  {lesson.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lesson.summary}
                </p>

                {/* Footer action bar */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {lesson.readTime}
                  </span>

                  <button
                    onClick={() => {
                      onSelectLesson(lesson);
                      if (stats.soundEnabled) playSound('tap');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                      isDone
                        ? 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                        : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-900/30'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Review Sprint
                      </>
                    ) : (
                      <>
                        Start Sprint <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
