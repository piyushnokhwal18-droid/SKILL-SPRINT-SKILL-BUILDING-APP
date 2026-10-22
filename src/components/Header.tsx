import React from 'react';
import { Sparkles, Flame, Volume2, VolumeX, Smartphone, Download } from 'lucide-react';
import { UserStats } from '../types';
import { playSound } from '../services/storage';

interface HeaderProps {
  stats: UserStats;
  isInstalled: boolean;
  onOpenInstallModal: () => void;
  onOpenPrivacy: () => void;
  onOpenAssistant: () => void;
  onOpenAndroidGuide: () => void;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  isInstalled,
  onOpenInstallModal,
  onOpenAssistant,
  onOpenAndroidGuide,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between transition-all">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-900/30 flex items-center justify-center">
          <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
            <span className="text-base select-none">{stats.avatar}</span>
          </div>
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
            Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Sprint</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wide block -mt-0.5">
            Micro-Learning Engine
          </span>
        </div>
      </div>

      {/* Action Badges & Buttons */}
      <div className="flex items-center space-x-1.5">
        {/* Install App button if not in standalone */}
        {!isInstalled && (
          <button
            onClick={() => {
              onOpenInstallModal();
              if (stats.soundEnabled) playSound('tap');
            }}
            title="Install SkillSprint App / APK"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-600/30 to-cyan-500/30 border border-violet-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all text-[11px] font-bold shadow-sm shadow-violet-950/40 active:scale-95 animate-pulse"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>Install</span>
          </button>
        )}

        {/* Streak indicator */}
        <div
          title={`${stats.currentStreak} day learning streak!`}
          className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/25 px-2 py-1 rounded-full shadow-sm shadow-amber-500/10"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-300 font-mono">{stats.currentStreak}d</span>
        </div>

        {/* Level badge */}
        <div
          title={`Level ${stats.level}`}
          className="flex items-center space-x-1 bg-violet-500/10 border border-violet-500/25 px-2 py-1 rounded-full shadow-sm shadow-violet-500/10"
        >
          <span className="text-xs font-bold text-violet-300 font-mono">Lv.{stats.level}</span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => {
            onToggleSound();
            playSound('tap');
          }}
          title={stats.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          aria-label="Toggle sound effects"
          className="p-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {stats.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-violet-400" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Android Guide Button */}
        <button
          onClick={() => {
            onOpenAndroidGuide();
            if (stats.soundEnabled) playSound('tap');
          }}
          title="Android Chrome Testing & APK Guide"
          aria-label="Android Chrome Testing & APK Guide"
          className="p-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
        </button>

        {/* AI Assistant button */}
        <button
          onClick={() => {
            onOpenAssistant();
            if (stats.soundEnabled) playSound('tap');
          }}
          title="Open AI Learning Assistant"
          aria-label="Open AI Learning Assistant"
          className="p-1.5 rounded-full bg-gradient-to-tr from-violet-600/30 to-cyan-500/30 border border-violet-500/60 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shadow-sm shadow-violet-900/40 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </button>
      </div>
    </header>
  );
};
