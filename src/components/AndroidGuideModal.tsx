import React, { useState } from 'react';
import { Smartphone, X, Terminal, CheckCircle2, Copy, Check, ChevronRight } from 'lucide-react';

interface AndroidGuideModalProps {
  onClose: () => void;
}

export const AndroidGuideModal: React.FC<AndroidGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'chrome' | 'apk' | 'pwa'>('chrome');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Android Chrome & APK Conversion</h2>
              <span className="text-[10px] text-slate-400 block">Mobile-First Testing Guide</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
          <button
            onClick={() => setActiveTab('chrome')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'chrome'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Chrome Testing
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'pwa'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. PWA Install
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'apk'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Native APK
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300 leading-relaxed">
          {activeTab === 'chrome' && (
            <div className="space-y-3.5">
              <h3 className="font-bold text-white text-sm">Testing on Android Chrome</h3>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-200">Local Network Access</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Ensure your phone and dev computer share the same Wi-Fi. Run:
                    </p>
                    <div className="mt-1.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 flex justify-between items-center">
                      <code>npm run dev -- --host</code>
                      <button
                        onClick={() => copyCode('npm run dev -- --host', 'cmd1')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedSnippet === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-200">Remote Chrome USB DevTools</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Enable <em>USB Debugging</em> under Android Settings &gt; Developer Options. Connect via USB cable, open Desktop Chrome, and navigate to:
                    </p>
                    <div className="mt-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-violet-300">
                      chrome://inspect/#devices
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Click "Inspect" to audit viewport sizing, touch gestures, console errors, and LocalStorage in real time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-200">Android Chrome Viewport & Gestures</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      The app includes viewport meta tags `viewport-fit=cover` and safe area styling so navigation bars clear the Android 3-button or pill gesture bar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-3.5">
              <h3 className="font-bold text-white text-sm">PWA "Add to Home Screen"</h3>
              <p className="text-slate-400 text-[11px]">
                SkillSprint ships with a complete `manifest.json`, vector SVG icons, and a `#090d16` theme color.
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">
                    Installation Flow
                  </span>
                  <p className="text-xs text-slate-300">
                    1. In Android Chrome, tap the <strong>three vertical dots (⋮)</strong> menu.
                    <br />
                    2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    <br />
                    3. Launch SkillSprint directly from your app drawer. It opens in full standalone mode with no browser address bar!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-300">
                  ✓ Themed status bar matches deep obsidian UI
                  <br />
                  ✓ All XP & lessons persist offline in browser LocalStorage
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm">Convert to Native Android APK</h3>
              <p className="text-slate-400 text-[11px]">
                To package SkillSprint into a distributable Android `.apk` or `.aab` using Capacitor:
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Step 1: Install Capacitor CLI
                </span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-300 flex justify-between items-center">
                  <code>npm install @capacitor/core @capacitor/cli @capacitor/android</code>
                  <button
                    onClick={() => copyCode('npm install @capacitor/core @capacitor/cli @capacitor/android', 'cap1')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === 'cap1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-1">
                  Step 2: Initialize & Build
                </span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-violet-300 flex justify-between items-center">
                  <code>npx cap init SkillSprint com.skillsprint.app --web-dir dist</code>
                  <button
                    onClick={() => copyCode('npx cap init SkillSprint com.skillsprint.app --web-dir dist', 'cap2')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === 'cap2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-1">
                  Step 3: Generate Android Studio Project
                </span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-amber-300 flex justify-between items-center">
                  <code>npm run build && npx cap add android && npx cap open android</code>
                  <button
                    onClick={() => copyCode('npm run build && npx cap add android && npx cap open android', 'cap3')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === 'cap3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  In Android Studio, click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> to generate the installable APK file.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
