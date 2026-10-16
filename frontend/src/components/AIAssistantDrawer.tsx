import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';
import { ChatMessage } from '../types';

export const AIAssistantDrawer: React.FC = () => {
  const { isAssistantOpen, toggleAssistant, user, targetOccupation, assessmentResult } = useSkillGap();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! I am your SkillGap AI Assistant. I use your structured gap evaluation to recommend high-impact study plans and explain role competencies. What would you like guidance on?`,
      suggested_actions: [
        'What should I study this week?',
        'Why is my score low?',
        'What projects should I build?',
        'What should I learn first?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAssistantOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await api.chatWithAssistant({
        user_id: user?.id,
        occupation_id: targetOccupation?.id,
        query: query,
        history: newMessages.slice(-4),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
          suggested_actions: response.suggested_actions,
          source: response.source
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I analyzed your profile: strengthen your highest priority skills first and review the prerequisites in the Dependency Graph.',
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>SkillGap AI Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">Context-grounded guidance for {targetOccupation?.title || 'Data Scientist'}</p>
          </div>
        </div>
        <button
          onClick={toggleAssistant}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-md'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1.5 opacity-70 text-[10px] uppercase font-semibold">
                {m.role === 'user' ? (
                  <>
                    <UserIcon className="w-3 h-3" />
                    <span>You</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-blue-400" />
                    <span>SkillGap Advisor ({m.source || 'Local Engine'})</span>
                  </>
                )}
              </div>
              <div className="whitespace-pre-line">{m.content}</div>
            </div>

            {/* Prompt Chips if provided by assistant */}
            {m.suggested_actions && m.suggested_actions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                {m.suggested_actions.map((chip, chipIdx) => (
                  <button
                    key={chipIdx}
                    onClick={() => handleSend(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-900/60 hover:border-blue-500/50 transition-all text-left"
                  >
                    💬 {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-2 bg-slate-800/50 rounded-xl max-w-[200px]">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Analyzing skill context...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Starters */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/60 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend("What should I study this week?")}
          className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/50"
        >
          Study this week
        </button>
        <button
          onClick={() => handleSend("Why is my score low?")}
          className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/50"
        >
          Why score is low
        </button>
        <button
          onClick={() => handleSend("What projects should I build?")}
          className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/50"
        >
          Recommended projects
        </button>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about skills, projects, study roadmap..."
            className="flex-1 bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
