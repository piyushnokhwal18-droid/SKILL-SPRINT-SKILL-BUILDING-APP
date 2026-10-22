import React from 'react';
import { Home, Compass, Trophy, User } from 'lucide-react';
import { playSound } from '../services/storage';

export type TabId = 'home' | 'learn' | 'challenges' | 'profile';

interface BottomNavProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  soundEnabled: boolean;
  unclaimedChallengesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  soundEnabled,
  unclaimedChallengesCount = 0
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: Compass },
    { id: 'challenges', label: 'Challenges', icon: Trophy, badgeCount: unclaimedChallengesCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800/90 max-w-md mx-auto pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 h-16 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id as TabId);
                if (soundEnabled) playSound('tap');
              }}
              className={`flex flex-col items-center justify-center space-y-1 relative h-full transition-colors active:scale-95 ${
                isActive ? 'text-violet-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-violet-400' : 'text-slate-400'
                  }`}
                />
                {isActive && (
                  <div className="absolute -inset-1.5 bg-violet-500/25 rounded-full blur-[3px] -z-10" />
                )}
                {/* Badge for unclaimed challenges */}
                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-bounce">
                    {tab.badgeCount}
                  </span>
                ) : null}
              </div>
              <span className={`text-[11px] tracking-wide ${isActive ? 'text-violet-300 font-semibold' : 'text-slate-400 font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-sm shadow-violet-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
