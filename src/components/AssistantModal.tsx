import React, { useState } from 'react';
import { askLearningAssistant } from '../services/assistantEngine';
import { X, Send, Bot, Sparkles, Copy, Check } from 'lucide-react';
import { playSound } from '../services/storage';

interface AssistantModalProps {
  apiKey?: string;
  soundEnabled: boolean;
  onClose: () => void;
}

const QUICK_CHIPS = [
  'Prompt Formula (RTC)',
  'BLUF Writing',
  '60-30-10 Design',
  'Beat Procrastination',
  'First Principles'
];

export const AssistantModal: React.FC<AssistantModalProps> = ({
  apiKey,
  soundEnabled,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'assistant';
    text: string;
    source?: string;
    category?: string;
  }>>([
    {
      sender: 'assistant',
      text: `Hello! I am your **SkillSprint Learning Tutor**. Ask me anything about practical skills:
• Prompt engineering & avoiding hallucinations
• Concise writing & the BLUF method
• 60-30-10 UI design rules & thumb ergonomics
• Overcoming procrastination & focus habits
• Mental models & first principles`,
      source: 'Curated Knowledge Base',
      category: 'Welcome'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || query).trim();
    if (!textToSend || loading) return;

    setQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);
    if (soundEnabled) playSound('tap');

    try {
      const response = await askLearningAssistant(textToSend, apiKey);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `${response.answer}\n\n💡 **Next Step**: ${response.suggestedAction || 'Practice this drill now.'}`,
          source: response.source,
          category: response.categoryTag
        }
      ]);
      if (soundEnabled) playSound('correct');
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Encountered an issue processing query. Please try asking about "Prompt Formula", "BLUF Writing", or "60-30-10 Design".',
          source: 'Error Handler'
        }
      ]);
      if (soundEnabled) playSound('wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    if (soundEnabled) playSound('tap');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md h-[86vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1.5px] flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#090d16] rounded-[9px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                SkillSprint Learning Tutor
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <span className="text-[10px] text-slate-400 block font-mono">
                {apiKey ? 'Mode: Live LLM API' : 'Mode: Curated Heuristics (100% Offline)'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              if (soundEnabled) playSound('tap');
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar scrollbar-none">
          {QUICK_CHIPS.map(chip => (
            <button
              key={chip}
              disabled={loading}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-violet-950/60 border border-slate-800 hover:border-violet-500/50 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all active:scale-95 shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm relative group ${
                  m.sender === 'user'
                    ? 'bg-violet-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.sender === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(m.text, i)}
                    title="Copy response"
                    className="absolute top-2 right-2 text-slate-500 hover:text-white p-1 rounded transition-colors"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {m.source && (
                <div className="flex items-center gap-1.5 mt-1 px-1">
                  <span className="text-[9px] font-mono text-slate-400">
                    Source: {m.source}
                  </span>
                  {m.category && (
                    <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1 rounded">
                      {m.category}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              Consulting intelligence vault...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask about prompts, BLUF, design or focus..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white shadow-md shadow-violet-900/40 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
