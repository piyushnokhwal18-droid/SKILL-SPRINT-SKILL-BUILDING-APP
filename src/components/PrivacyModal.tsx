import React from 'react';
import { ShieldCheck, X, Lock, Database, Sparkles, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Privacy & Integrity</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Zero Mandatory Logins:</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">
                We never ask for your email, phone number, password, or cloud identity. You can start sprinting instantly as a guest.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">100% On-Device Storage:</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">
                All XP, daily streaks, quiz answers, and badges are saved strictly inside your device's browser `localStorage`. You can backup or clear it anytime from Profile.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Truthful AI Architecture:</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">
                We never fake AI responses. When offline or without an API key, questions are answered by our verified heuristic knowledge base with clear source labeling.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">No Synthetic Paywalls:</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Every sprint, quiz, and trophy is 100% unlocked through genuine deliberate practice.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-900/40 transition-all"
        >
          Understood & Verified
        </button>
      </div>
    </div>
  );
};
