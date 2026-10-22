import React, { useState, useMemo } from 'react';
import { LESSONS } from '../data/curriculum';
import { QuizQuestion, UserStats } from '../types';
import { X, Zap, CheckCircle2, AlertCircle, ArrowRight, Award } from 'lucide-react';
import { playSound, triggerConfetti } from '../services/storage';

interface QuickDrillModalProps {
  stats: UserStats;
  onClose: () => void;
  onComplete: (earnedXp: number) => void;
}

export const QuickDrillModal: React.FC<QuickDrillModalProps> = ({
  stats,
  onClose,
  onComplete
}) => {
  // Select 3 random quiz questions across different lessons
  const drillQuestions = useMemo(() => {
    const allQuiz: Array<{ question: QuizQuestion; lessonTitle: string }> = [];
    LESSONS.forEach(l => {
      l.quiz.forEach(q => {
        allQuiz.push({ question: q, lessonTitle: l.title });
      });
    });
    // Shuffle and pick 3
    const shuffled = [...allQuiz].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = drillQuestions[currentIndex];

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === currentItem.question.correctIndex) {
      setScore(s => s + 1);
      if (stats.soundEnabled) playSound('correct');
    } else {
      if (stats.soundEnabled) playSound('wrong');
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < drillQuestions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      if (stats.soundEnabled) playSound('tap');
    } else {
      setIsFinished(true);
      const earnedXp = 25 + score * 5;
      if (stats.soundEnabled) playSound('complete');
      triggerConfetti();
      onComplete(earnedXp);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">60-Second Skill Drill</h2>
              <span className="text-[10px] text-slate-400 block font-mono">
                Question {currentIndex + 1} of {drillQuestions.length}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!isFinished ? (
            <>
              {/* Progress */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / drillQuestions.length) * 100}%` }}
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  From: {currentItem.lessonTitle}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                  {currentItem.question.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentItem.question.options.map((opt, i) => {
                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (hasAnswered) {
                    if (i === currentItem.question.correctIndex) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (i === selectedOption) {
                      btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-semibold';
                    } else {
                      btnStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={hasAnswered}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all active:scale-98 ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5">
                    {selectedOption === currentItem.question.correctIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {selectedOption === currentItem.question.correctIndex ? 'Correct!' : 'Key Takeaway'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentItem.question.explanation}
                  </p>

                  <button
                    onClick={handleNext}
                    className="mt-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                  >
                    {currentIndex + 1 < drillQuestions.length ? 'Next Question' : 'Complete Drill'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Drill Finished!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You scored <span className="font-bold text-white">{score} / {drillQuestions.length}</span> correct.
                </p>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300 mt-1 font-mono">
                  +{25 + score * 5} XP Earned
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
