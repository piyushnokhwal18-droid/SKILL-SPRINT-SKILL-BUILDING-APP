import React, { useState } from 'react';
import { UserStats, Badge } from '../types';
import { AVATAR_OPTIONS, getLevelTitle, playSound } from '../services/storage';
import { Award, Key, Download, Upload, RefreshCw, Check, Flame, Shield, Smartphone, Sparkles, UserCheck } from 'lucide-react';

interface ProfileTabProps {
  stats: UserStats;
  badges: Badge[];
  isInstalled: boolean;
  onOpenInstallModal: () => void;
  onUpdateStats: (newStats: UserStats) => void;
  onResetProgress: () => void;
  onOpenPrivacy: () => void;
  onOpenAndroidGuide: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  stats,
  badges,
  isInstalled,
  onOpenInstallModal,
  onUpdateStats,
  onResetProgress,
  onOpenPrivacy,
  onOpenAndroidGuide
}) => {
  const [editingName, setEditingName] = useState(false);
  const [usernameInput, setUsernameInput] = useState(stats.username);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(stats.apiKey || '');
  const [savedKeyFeedback, setSavedKeyFeedback] = useState(false);

  const levelTitle = getLevelTitle(stats.level);
  const unlockedBadgesCount = badges.filter(b => Boolean(b.unlockedAt)).length;

  const handleSaveName = () => {
    if (usernameInput.trim()) {
      onUpdateStats({ ...stats, username: usernameInput.trim() });
      setEditingName(false);
      if (stats.soundEnabled) playSound('tap');
    }
  };

  const handleSaveApiKey = () => {
    onUpdateStats({ ...stats, apiKey: apiKeyInput.trim() });
    setSavedKeyFeedback(true);
    if (stats.soundEnabled) playSound('correct');
    setTimeout(() => setSavedKeyFeedback(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      version: 2,
      exportDate: new Date().toISOString(),
      stats,
      badges
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `skillsprint_backup_${stats.username.toLowerCase()}.json`;
    a.click();
    if (stats.soundEnabled) playSound('complete');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.stats) {
          onUpdateStats(parsed.stats);
          alert('Progress restored successfully from file!');
          if (stats.soundEnabled) playSound('complete');
        }
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Identity Card */}
      <section className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-violet-600/10 rounded-full blur-2xl -z-10 pointer-events-none" />

        {/* Avatar with editor trigger */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            title="Change Avatar"
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-[2px] shadow-lg shadow-violet-900/40 hover:scale-105 transition-all"
          >
            <div className="w-full h-full bg-[#090d16] rounded-full flex items-center justify-center text-2xl">
              {stats.avatar}
            </div>
          </button>
          <span className="absolute bottom-0 right-0 bg-violet-600 text-[10px] text-white px-1.5 py-0.5 rounded-full border border-slate-950">
            edit
          </span>
        </div>

        {/* Avatar Picker Tray */}
        {showAvatarPicker && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap justify-center gap-2 max-w-xs mx-auto animate-in fade-in">
            {AVATAR_OPTIONS.map(a => (
              <button
                key={a}
                onClick={() => {
                  onUpdateStats({ ...stats, avatar: a });
                  setShowAvatarPicker(false);
                  if (stats.soundEnabled) playSound('tap');
                }}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                  stats.avatar === a ? 'bg-violet-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        )}

        {/* Name and Level */}
        <div>
          {editingName ? (
            <div className="flex items-center justify-center gap-2 max-w-[220px] mx-auto">
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                maxLength={20}
                className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white text-center focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleSaveName}
                className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-base font-bold text-white">{stats.username}</h1>
              <button
                onClick={() => setEditingName(true)}
                className="text-[10px] text-violet-400 hover:text-violet-300 underline"
              >
                edit
              </button>
            </div>
          )}
          <span className="text-xs text-violet-300 font-medium block mt-0.5">
            Level {stats.level} • {levelTitle}
          </span>
        </div>

        {/* Fast Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80">
          <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-medium block">Total XP</span>
            <span className="text-sm font-bold text-violet-300 font-mono">{stats.xp}</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-medium block">Streak</span>
            <span className="text-sm font-bold text-amber-300 font-mono flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 fill-amber-300" /> {stats.currentStreak}d
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-medium block">Mastered</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">
              {stats.completedLessonIds.length}
            </span>
          </div>
        </div>
      </section>

      {/* Trophy Cabinet & Badges */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-violet-400" />
            Trophy Cabinet ({unlockedBadgesCount}/{badges.length})
          </h2>
          <span className="text-[11px] text-slate-400">Unlock via drills & streaks</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map(b => {
            const isUnlocked = Boolean(b.unlockedAt);
            const tierColors = {
              bronze: 'border-amber-700/40 text-amber-400',
              silver: 'border-slate-500/40 text-slate-200',
              gold: 'border-yellow-500/40 text-yellow-300',
              diamond: 'border-cyan-400/50 text-cyan-300'
            };

            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                  isUnlocked
                    ? `bg-slate-900/90 ${tierColors[b.tier]} shadow-md`
                    : 'bg-slate-950/40 border-slate-800/50 opacity-40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      isUnlocked ? 'bg-violet-600/20 text-violet-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                    {b.tier}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white mt-2 leading-tight">{b.title}</h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {b.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[9px] text-slate-400 font-mono">
                  {isUnlocked ? `Unlocked: ${b.unlockedAt}` : `Req: ${b.requirement}`}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Install App & APK Center Card */}
      <section className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/60 via-indigo-950/40 to-cyan-950/40 border border-violet-500/40 space-y-2.5 shadow-lg shadow-violet-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Install App & Native APK
            </h2>
          </div>
          <button
            onClick={() => {
              onOpenInstallModal();
              if (stats.soundEnabled) playSound('tap');
            }}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-violet-900/40 active:scale-95 transition-all"
          >
            {isInstalled ? 'APK Details' : 'Install App'}
          </button>
        </div>
        <p className="text-xs text-slate-300">
          {isInstalled
            ? 'SkillSprint is running as an installed standalone app. Tap to view Capacitor & Bubblewrap APK builds.'
            : 'Install 1-tap directly to your Android/desktop home screen, or package as a standalone Android .apk with Capacitor.'}
        </p>
      </section>

      {/* Android Chrome Testing & APK Modal Trigger */}
      <section className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Android Chrome & APK Conversion
            </h2>
          </div>
          <button
            onClick={() => {
              onOpenAndroidGuide();
              if (stats.soundEnabled) playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30"
          >
            View Guide
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Step-by-step instructions for testing on Android Chrome, remote USB DevTools debugging, and converting to a native APK with Capacitor.
        </p>
      </section>

      {/* Optional Live AI API Key */}
      <section className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-violet-400" />
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Optional Live AI API Key
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The built-in assistant runs a curated smart knowledge vault 100% offline. If you wish to route questions to live Google Gemini or OpenAI, paste your API key below. Keys stay strictly in your device's browser memory.
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            placeholder="AIza... or sk-..."
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 font-mono"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-900/40 active:scale-95 transition-all"
          >
            {savedKeyFeedback ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>

      {/* Device Storage & Privacy Controls */}
      <section className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Privacy & Local Data
            </h2>
          </div>
          <button
            onClick={onOpenPrivacy}
            className="text-xs text-emerald-400 hover:underline"
          >
            Policy
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Zero tracking cookies, telemetry, or mandatory registration. All progress is cached in your browser.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportData}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> Backup Data
          </button>

          <label className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-violet-400" /> Restore Backup
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>

        <button
          onClick={onResetProgress}
          className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 border border-red-800/40 hover:bg-red-950/50 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-1"
        >
          <RefreshCw className="w-3.5 h-3.5 text-red-400" /> Reset All Progress
        </button>
      </section>
    </div>
  );
};
