import React, { useState, useEffect } from 'react';
import { UserStats, Lesson, DailyChallenge, Badge, CategoryId } from './types';
import {
  loadUserStats,
  saveUserStats,
  loadBadges,
  checkAndUnlockBadges,
  calculateLevel,
  getTodayKey,
  playSound,
  triggerConfetti,
  triggerLevelUpConfetti
} from './services/storage';
import { LESSONS, INITIAL_DAILY_CHALLENGES } from './data/curriculum';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';

import { Header } from './components/Header';
import { BottomNav, TabId } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { LearnTab } from './components/LearnTab';
import { ChallengesTab } from './components/ChallengesTab';
import { ProfileTab } from './components/ProfileTab';
import { QuizModal } from './components/QuizModal';
import { AssistantModal } from './components/AssistantModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AndroidGuideModal } from './components/AndroidGuideModal';
import { QuickDrillModal } from './components/QuickDrillModal';
import { InstallAppModal } from './components/InstallAppModal';
import { Award, Sparkles, WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [badges, setBadges] = useState<Badge[]>(loadBadges);
  const [challenges, setChallenges] = useState<DailyChallenge[]>(INITIAL_DAILY_CHALLENGES);
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [learnCategory, setLearnCategory] = useState<CategoryId | 'all'>('all');
  const [claimedDailyBonus, setClaimedDailyBonus] = useState(false);

  // PWA & Connectivity hooks
  const { isInstalled } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Modals
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [showQuickDrill, setShowQuickDrill] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  // Check badges & level on stats change
  useEffect(() => {
    const calculatedLevel = calculateLevel(stats.xp);
    if (calculatedLevel !== stats.level) {
      const updated = { ...stats, level: calculatedLevel };
      setStats(updated);
      saveUserStats(updated);
    }

    const { updatedBadges, newlyUnlocked } = checkAndUnlockBadges(stats, badges);
    setBadges(updatedBadges);

    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedBadge(newlyUnlocked[0]);
      if (stats.soundEnabled) {
        playSound('levelup');
      }
      triggerConfetti();
    }
  }, [stats.xp, stats.completedLessonIds.length, stats.currentStreak]);

  const handleCompleteSprint = (earnedXp: number, lessonId: string) => {
    const todayKey = getTodayKey();
    const isFirstTime = !stats.completedLessonIds.includes(lessonId);

    const updatedLessonIds = isFirstTime
      ? [...stats.completedLessonIds, lessonId]
      : stats.completedLessonIds;

    // Check if this lesson completes any daily challenges
    const updatedChallenges = challenges.map(ch => {
      if (ch.lessonRefId === lessonId) {
        return { ...ch, completed: true };
      }
      return ch;
    });
    setChallenges(updatedChallenges);

    const completedChallengeIds = Array.from(
      new Set([
        ...stats.completedChallengeIds,
        ...updatedChallenges.filter(c => c.completed).map(c => c.id)
      ])
    );

    const newXp = stats.xp + earnedXp;
    const oldLevel = stats.level;
    const newLevel = calculateLevel(newXp);

    if (newLevel > oldLevel) {
      triggerLevelUpConfetti();
    }

    const newStats: UserStats = {
      ...stats,
      xp: newXp,
      level: newLevel,
      completedLessonIds: updatedLessonIds,
      completedChallengeIds,
      weeklyActivity: {
        ...stats.weeklyActivity,
        [todayKey]: (stats.weeklyActivity[todayKey] || 0) + earnedXp
      }
    };

    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleClaimDailyBonus = () => {
    if (claimedDailyBonus) return;
    const todayKey = getTodayKey();
    const bonusXp = 50;
    const newXp = stats.xp + bonusXp;

    const newStats: UserStats = {
      ...stats,
      xp: newXp,
      level: calculateLevel(newXp),
      weeklyActivity: {
        ...stats.weeklyActivity,
        [todayKey]: (stats.weeklyActivity[todayKey] || 0) + bonusXp
      }
    };

    setClaimedDailyBonus(true);
    setStats(newStats);
    saveUserStats(newStats);
    triggerLevelUpConfetti();
  };

  const handleQuickDrillComplete = (earnedXp: number) => {
    const todayKey = getTodayKey();
    const newXp = stats.xp + earnedXp;

    const newStats: UserStats = {
      ...stats,
      xp: newXp,
      level: calculateLevel(newXp),
      weeklyActivity: {
        ...stats.weeklyActivity,
        [todayKey]: (stats.weeklyActivity[todayKey] || 0) + earnedXp
      }
    };

    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleToggleFavorite = (lessonId: string) => {
    const isFav = stats.favorites.includes(lessonId);
    const updatedFavorites = isFav
      ? stats.favorites.filter(id => id !== lessonId)
      : [...stats.favorites, lessonId];

    const newStats = { ...stats, favorites: updatedFavorites };
    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleToggleSound = () => {
    const newStats = { ...stats, soundEnabled: !stats.soundEnabled };
    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all XP, streak, lessons, and badges? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const unclaimedChallenges = challenges.filter(c => !stats.completedChallengeIds.includes(c.id)).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      {/* Mobile constraint frame with sleek obsidian border */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#090d16] border-x border-slate-900/80 relative pb-20 shadow-2xl">
        {/* Offline notification banner if network drops */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 px-3 py-1.5 text-xs font-bold flex items-center justify-center gap-1.5 sticky top-0 z-50">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode Active — Running on device cache</span>
          </div>
        )}

        {/* Sticky Mobile Header */}
        <Header
          stats={stats}
          isInstalled={isInstalled}
          onOpenInstallModal={() => setShowInstallModal(true)}
          onOpenPrivacy={() => setShowPrivacy(true)}
          onOpenAssistant={() => setShowAssistant(true)}
          onOpenAndroidGuide={() => setShowAndroidGuide(true)}
          onToggleSound={handleToggleSound}
        />

        {/* Tab View Container */}
        <main className="flex-1 px-4 pt-4">
          {currentTab === 'home' && (
            <HomeTab
              stats={stats}
              challenges={challenges}
              featuredLesson={LESSONS[0]}
              isInstalled={isInstalled}
              onOpenInstallModal={() => setShowInstallModal(true)}
              onStartLesson={setActiveLesson}
              onNavigateTab={setCurrentTab}
              onSelectCategoryFilter={(catId) => setLearnCategory(catId)}
              onStartQuickDrill={() => setShowQuickDrill(true)}
            />
          )}

          {currentTab === 'learn' && (
            <LearnTab
              stats={stats}
              selectedCategory={learnCategory}
              onSelectCategory={setLearnCategory}
              onSelectLesson={setActiveLesson}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === 'challenges' && (
            <ChallengesTab
              stats={stats}
              challenges={challenges}
              onStartLesson={setActiveLesson}
              onClaimDailyBonus={handleClaimDailyBonus}
              claimedDailyBonus={claimedDailyBonus}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileTab
              stats={stats}
              badges={badges}
              isInstalled={isInstalled}
              onOpenInstallModal={() => setShowInstallModal(true)}
              onUpdateStats={(newStats) => {
                setStats(newStats);
                saveUserStats(newStats);
              }}
              onResetProgress={handleResetProgress}
              onOpenPrivacy={() => setShowPrivacy(true)}
              onOpenAndroidGuide={() => setShowAndroidGuide(true)}
            />
          )}
        </main>

        {/* Fixed Ergonomic Bottom Tab Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          soundEnabled={stats.soundEnabled}
          unclaimedChallengesCount={unclaimedChallenges}
        />

        {/* Interactive Modals */}
        {showInstallModal && (
          <InstallAppModal
            onClose={() => setShowInstallModal(false)}
            onInstallSuccess={() => triggerLevelUpConfetti()}
          />
        )}

        {activeLesson && (
          <QuizModal
            lesson={activeLesson}
            stats={stats}
            onClose={() => setActiveLesson(null)}
            onComplete={handleCompleteSprint}
          />
        )}

        {showAssistant && (
          <AssistantModal
            apiKey={stats.apiKey}
            soundEnabled={stats.soundEnabled}
            onClose={() => setShowAssistant(false)}
          />
        )}

        {showPrivacy && (
          <PrivacyModal onClose={() => setShowPrivacy(false)} />
        )}

        {showAndroidGuide && (
          <AndroidGuideModal onClose={() => setShowAndroidGuide(false)} />
        )}

        {showQuickDrill && (
          <QuickDrillModal
            stats={stats}
            onClose={() => setShowQuickDrill(false)}
            onComplete={handleQuickDrillComplete}
          />
        )}

        {/* Newly Unlocked Badge Celebration Popup */}
        {newlyUnlockedBadge && (
          <div className="fixed inset-0 z-50 bg-[#090d16]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-violet-500/50 w-full max-w-xs rounded-3xl p-5 text-center space-y-3 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl -z-10" />

              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-violet-500 to-cyan-400 p-[2px] shadow-lg shadow-violet-900/40">
                <div className="w-full h-full bg-[#090d16] rounded-[22px] flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-400 animate-bounce" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Badge Unlocked!
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {newlyUnlockedBadge.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {newlyUnlockedBadge.description}
                </p>
              </div>

              <button
                onClick={() => setNewlyUnlockedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-900/40"
              >
                Awesome!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
