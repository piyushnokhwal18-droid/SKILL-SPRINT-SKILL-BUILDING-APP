import React, { useState } from 'react';
import { Download, Smartphone, Check, Copy, ArrowDownCircle, Sparkles, X, ShieldCheck, Layers, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  onClose: () => void;
  onInstallSuccess?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose, onInstallSuccess }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'apk' | 'twa'>('instant');
  const [installing, setInstalling] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleInstantInstall = async () => {
    if (isInstallable) {
      setInstalling(true);
      const success = await install();
      setInstalling(false);
      if (success) {
        onInstallSuccess?.();
        onClose();
      }
    }
  };

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#090d16] rounded-[9px] flex items-center justify-center">
                <Download className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                Install SkillSprint App
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/40">
                  Android / APK
                </span>
              </h2>
              <span className="text-[10px] text-slate-400 block">
                {isInstalled ? 'Status: Running as Installed App' : 'Zero-app-store direct installation'}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
          <button
            onClick={() => setActiveTab('instant')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'instant'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Tap Install (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'apk'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Native APK (Capacitor)
          </button>
          <button
            onClick={() => setActiveTab('twa')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'twa'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Play Store (TWA)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300 leading-relaxed">
          {/* TAB 1: 1-Tap Direct Install */}
          {activeTab === 'instant' && (
            <div className="space-y-4">
              {isInstalled ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Already Installed!</h3>
                  <p className="text-xs text-emerald-300">
                    SkillSprint is actively running in standalone native mode with offline caching enabled.
                  </p>
                </div>
              ) : isInstallable ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/60 to-slate-900 border border-violet-500/40 text-center space-y-3 shadow-xl">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-cyan-400">
                    <Smartphone className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Ready for 1-Tap Installation</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Installs SkillSprint directly onto your Android home screen and app launcher as a standalone app.
                    </p>
                  </div>
                  <button
                    onClick={handleInstantInstall}
                    disabled={installing}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-900/50 active:scale-95 transition-all"
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    {installing ? 'Installing App...' : 'Install SkillSprint App Now'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Smartphone className="w-4 h-4" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        {isAndroid ? 'Android Chrome Installation' : isIOS ? 'iOS Safari Installation' : 'Browser App Installation'}
                      </h3>
                    </div>

                    {isIOS ? (
                      <ol className="space-y-2 text-slate-300 pl-4 list-decimal text-xs">
                        <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                        <li>Tap <strong>Add</strong> in the top-right corner.</li>
                      </ol>
                    ) : (
                      <ol className="space-y-2 text-slate-300 pl-4 list-decimal text-xs">
                        <li>In Android Chrome, tap the <strong>three vertical dots (⋮)</strong> menu.</li>
                        <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        <li>Confirm the prompt. Android creates a WebAPK in your app drawer!</li>
                      </ol>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-300 space-y-1">
                    <p className="font-semibold">Why this works without Google Play:</p>
                    <p className="text-slate-400">
                      Modern Android devices automatically compile compliant Progressive Web Apps into a native <strong>WebAPK</strong> with hardware acceleration, offline caching, and isolated app sandbox.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Native Android APK with Capacitor */}
          {activeTab === 'apk' && (
            <div className="space-y-3.5">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Build Standalone Android APK (.apk)
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  This repository is already pre-configured with <strong>Capacitor</strong> and App ID <code>com.skillsprint.app</code>.
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Step 1: Build & Sync Assets
                  </span>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 flex justify-between items-center">
                    <code>npm run build:android</code>
                    <button
                      onClick={() => copySnippet('npm run build:android', 'apk1')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedId === 'apk1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Step 2: Open in Android Studio
                  </span>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-violet-300 flex justify-between items-center">
                    <code>npx cap open android</code>
                    <button
                      onClick={() => copySnippet('npx cap open android', 'apk2')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedId === 'apk2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Step 3: Generate APK File
                  </span>
                  <p className="text-slate-400 text-[11px] mt-1">
                    In Android Studio's menu bar, select:
                    <br />
                    <code className="text-amber-300">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</code>
                    <br />
                    Android Studio will produce the installable <strong>app-debug.apk</strong> file that you can transfer and install on any Android phone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Trusted Web Activity (TWA) */}
          {activeTab === 'twa' && (
            <div className="space-y-3.5">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Google Play Store Release via Bubblewrap (TWA)
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Trusted Web Activity allows packaging the verified web app into a signed Google Play `.aab` or `.apk` in 2 CLI commands:
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    1. Initialize from Manifest
                  </span>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-300 flex justify-between items-center">
                    <code>npx @bubblewrap/cli init --manifest=./public/manifest.json</code>
                    <button
                      onClick={() => copySnippet('npx @bubblewrap/cli init --manifest=./public/manifest.json', 'twa1')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedId === 'twa1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    2. Build Signed APK
                  </span>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-violet-300 flex justify-between items-center">
                    <code>npx @bubblewrap/cli build</code>
                    <button
                      onClick={() => copySnippet('npx @bubblewrap/cli build', 'twa2')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedId === 'twa2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Offline & No account required</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
