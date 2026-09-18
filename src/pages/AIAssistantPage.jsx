// src/pages/AIAssistantPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { Bot, Send, Trash2, Sparkles, User, RefreshCw } from 'lucide-react';

const AIAssistantPage = () => {
  const { chatMessages, isChatLoading, handleSendChatMessage, handleClearChat } = useApp();
  const [inputText, setInputText] = useState('');

  const promptPills = [
    "What should I improve first?",
    "Which roles match my current skills?",
    "Help me improve my summary.",
    "What skills should I learn for this role?",
    "Explain my ATS compatibility score."
  ];

  const onSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    handleSendChatMessage(inputText);
    setInputText('');
  };

  const handlePillClick = (prompt) => {
    handleSendChatMessage(prompt);
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col space-y-4 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">AI Career Assistant</h1>
              <p className="text-[11px] text-slate-500 font-medium">Interactive Resume & Career Guidance Coach</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" /> Clear Chat
          </button>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-soft p-4 sm:p-6 overflow-y-auto space-y-4">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Bot className="w-12 h-12 text-slate-300" />
              <p className="text-xs font-medium">No messages yet. Select a prompt below or type your question!</p>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gradient-to-tr from-purple-600 to-violet-600 text-white'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white text-stone-800 rounded-tl-none border border-purple-200/70 shadow-xs'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[9px] block text-right ${msg.sender === 'user' ? 'text-purple-200' : 'text-stone-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}

          {isChatLoading && (
            <div className="flex gap-3 max-w-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-violet-600 text-white flex items-center justify-center text-xs shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-purple-50/70 rounded-2xl text-xs text-stone-600 animate-pulse flex items-center gap-2 border border-purple-200/60">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" /> AI Coach is generating response...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {promptPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handlePillClick(pill)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 font-semibold text-[11px] shrink-0 transition-colors"
            >
              ✨ {pill}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={onSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about ATS scores, missing skills, or bullet point improvements..."
            className="flex-1 p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default AIAssistantPage;
