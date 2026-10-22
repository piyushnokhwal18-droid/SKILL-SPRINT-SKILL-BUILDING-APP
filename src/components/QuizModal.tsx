import React, { useState } from 'react';
import { Lesson, UserStats } from '../types';
import { X, CheckCircle, AlertCircle, ArrowRight, Award, Sparkles, BookOpen } from 'lucide-react';
import { playSound, triggerConfetti, triggerLevelUpConfetti, calculateLevel } from '../services/storage';

interface QuizModalProps {
  lesson: Lesson;
  stats: UserStats;
  onClose: () => void;
  onComplete: (earnedXp: number, lessonId: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  lesson,
  stats,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<'reading' | 'quiz' | 'result'>('reading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const questions = lesson.quiz;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      if (stats.soundEnabled) playSound('correct');
    } else {
      if (stats.soundEnabled) playSound('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      if (stats.soundEnabled) playSound('tap');
    } else {
      // Completed quiz!
      setStep('result');
      const oldLevel = stats.level;
      const newLevel = calculateLevel(stats.xp + lesson.xpReward);

      if (stats.soundEnabled) {
        if (newLevel > oldLevel) {
          playSound('levelup');
          triggerLevelUpConfetti();
        } else {
          playSound('complete');
          triggerConfetti();
        }
      } else {
        triggerConfetti();
      }

      onComplete(lesson.xpReward, lesson.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-violet-400 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-800/40 font-mono">
              {step === 'reading'
                ? '3-Min Micro-Lesson'
                : step === 'quiz'
                ? `Knowledge Check (${currentQuestionIndex + 1}/${questions.length})`
                : 'Sprint Complete!'}
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              if (stats.soundEnabled) playSound('tap');
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: READING */}
          {step === 'reading' && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  {lesson.readTime} Read • +{lesson.xpReward} XP
                </span>
                <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                  {lesson.title}
                </h2>
              </div>

              {/* Lesson sections */}
              <div className="space-y-3 pt-1">
                {lesson.sections.map((section, idx) => {
                  if (section.type === 'rule') {
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-950/50 via-slate-900 to-indigo-950/30 border border-violet-500/40 space-y-1 shadow-sm"
                      >
                        {section.title && (
                          <span className="text-xs font-bold text-violet-300 block flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            {section.title}
                          </span>
                        )}
                        <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                          {section.text}
                        </p>
                      </div>
                    );
                  }

                  if (section.type === 'example') {
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 font-mono"
                      >
                        {section.title && (
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-sans">
                            {section.title}
                          </span>
                        )}
                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                          {section.text}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                      {section.text}
                    </p>
                  );
                })}
              </div>

              {/* Key Takeaway Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Key Takeaway
                </span>
                <p className="text-xs font-semibold text-slate-100 mt-1">
                  {lesson.keyTakeaway}
                </p>
              </div>

              {/* Launch Quiz Button */}
              <button
                onClick={() => {
                  setStep('quiz');
                  if (stats.soundEnabled) playSound('tap');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 active:scale-95 transition-all mt-4"
              >
                Proceed to Knowledge Check (+{lesson.xpReward} XP)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: QUIZ */}
          {step === 'quiz' && currentQ && (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                  }}
                />
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentQ.options.map((opt, i) => {
                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (hasAnswered) {
                    if (i === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold shadow-md shadow-emerald-950/50';
                    } else if (i === selectedOption) {
                      btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-semibold';
                    } else {
                      btnStyle = 'bg-slate-950/50 border-slate-800/50 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all active:scale-98 ${btnStyle}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-bold flex items-center justify-center border border-slate-800 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation Card */}
              {hasAnswered && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-1.5">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">Spot on!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-bold text-red-300">Review Insight</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>

                  <button
                    onClick={handleNextQuestion}
                    className="mt-3 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-violet-900/40 active:scale-95 transition-all"
                  >
                    {currentQuestionIndex + 1 < questions.length ? (
                      <>
                        Next Question <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Finish Sprint & Claim XP <Sparkles className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: RESULT */}
          {step === 'result' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[2px] shadow-xl shadow-violet-900/50">
                <div className="w-full h-full bg-[#090d16] rounded-[22px] flex items-center justify-center">
                  <Award className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Sprint Completed</span>
                <h3 className="text-lg font-extrabold text-white mt-1">Knowledge Locked In!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  You scored <span className="font-bold text-white">{correctAnswersCount} / {questions.length}</span> correct and earned:
                </p>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 mt-1 font-mono">
                  +{lesson.xpReward} XP
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sprint Recall Rule</span>
                <p className="text-slate-200 font-medium">{lesson.keyTakeaway}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setStep('reading');
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setHasAnswered(false);
                    setCorrectAnswersCount(0);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  Review Lesson
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-900/40"
                >
                  Continue Sprinting
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
