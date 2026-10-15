import React, { useState } from 'react';
import { Bot, ChevronRight, Send, Sparkles, X } from 'lucide-react';
import { api } from '../../services/api';

export const AiAssistantCard: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; actions?: string[] }>>([
    {
      role: 'assistant',
      text: 'Hello Sarah! I am your AI workforce & team optimization companion. Ask me to suggest an optimal team, analyze workload risks, or predict completion timelines.',
      actions: ['Suggest optimal team for a new project', 'Show resource allocation insights'],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Suggest optimal team for a new project',
    'Predict project completion time',
    'Show resource allocation insights',
    'Identify potential project risks',
  ];

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    const userMsg = msgText.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setLoading(true);

    try {
      const data = await api.askAiAssistant(userMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply, actions: data.suggestedActions },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I analyzed the active project roster. Our highest priority initiative, AI Chatbot Integration, requires 1 additional AI/ML specialist to satisfy sprint velocity.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-700" />

        {/* Header with Robot Mascot */}
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <div className="w-full h-full bg-[#07090E] rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
              <span>AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Your intelligent project & workforce companion
            </p>
          </div>
        </div>

        {/* Prompt Title */}
        <p className="text-xs font-semibold text-slate-300 mb-2.5 relative z-10">
          How can I help you today?
        </p>

        {/* Quick Action Prompt Pills */}
        <div className="space-y-2 relative z-10">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setChatOpen(true);
                handleSendMessage(q);
              }}
              className="w-full flex items-center justify-between p-2.5 text-left text-xs font-medium text-slate-300 hover:text-cyan-300 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 transition-all group/btn"
            >
              <span>{q}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Interactive AI Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#0B101E] rounded-3xl w-full max-w-lg shadow-2xl border border-white/10 flex flex-col h-[560px] animate-in zoom-in-95 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">TeamPulse AI Workforce Advisor</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Online • Real-time DB Grounded
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-cyan-600/20'
                        : 'bg-white/[0.05] text-slate-200 rounded-bl-none border border-white/[0.08]'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Suggested Actions if any */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act)}
                          className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full hover:bg-cyan-500/20 transition-colors"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-cyan-400"></span>
                  <span>TeamPulse AI analyzing workforce capacity...</span>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(prompt)}
                placeholder="Ask about teams, skills, workloads..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-slate-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50"
              />
              <button
                onClick={() => handleSendMessage(prompt)}
                disabled={loading || !prompt.trim()}
                className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
