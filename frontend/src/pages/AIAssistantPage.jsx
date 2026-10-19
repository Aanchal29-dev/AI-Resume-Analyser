// src/pages/AIAssistantPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { Bot, Send, Trash2, Sparkles, User, RefreshCw, Copy, Check } from 'lucide-react';

// Formats Markdown-like text into styled JSX
const FormattedMessage = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process paragraphs and block elements
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty lines
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Horizontal rule
        if (trimmed === '***' || trimmed === '---') {
          return <hr key={idx} className="my-2 border-slate-200/80" />;
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-slate-900 text-base mt-2 mb-1">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-indigo-500 bg-indigo-50/50 p-2.5 rounded-r-xl italic text-indigo-950 font-medium my-1.5"
            >
              {renderInlineStyles(trimmed.replace('> ', ''))}
            </blockquote>
          );
        }

        // Bullet points
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-0.5">
              <span className="text-indigo-600 font-bold text-sm leading-none">•</span>
              <span className="flex-1">{renderInlineStyles(trimmed.substring(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-0.5">
              <span className="font-bold text-indigo-600 text-xs shrink-0">{numberedMatch[1]}.</span>
              <span className="flex-1">{renderInlineStyles(numberedMatch[2])}</span>
            </div>
          );
        }

        // Standard paragraph
        return <p key={idx}>{renderInlineStyles(line)}</p>;
      })}
    </div>
  );
};

// Helper for bold, italics, code inline tags
const renderInlineStyles = (text) => {
  if (!text) return '';
  // Split by bold (**text**)
  const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-slate-100 text-indigo-700 font-mono px-1.5 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const AIAssistantPage = () => {
  const { chatMessages, isChatLoading, handleSendChatMessage, handleClearChat } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const promptPills = [
    "Explain how cloud computing works",
    "What is an API and how does it function?",
    "Give me 2 strong bullet examples for my role",
    "How to structure winning interview answers (STAR method)",
    "Explain how neural networks learn"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatLoading]);

  const onSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    handleSendChatMessage(inputText);
    setInputText('');
  };

  const handlePillClick = (prompt) => {
    if (isChatLoading) return;
    handleSendChatMessage(prompt);
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col space-y-4 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-purple-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-stone-900">SkillSync Gemini AI Assistant</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Gemini 3.1 Live
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Unrestricted AI Assistant • In-depth general answers first with tailored role perspective</p>
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
              <p className="text-xs font-medium">No messages yet. Select a prompt below or type any career question!</p>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gradient-to-tr from-purple-600 to-violet-600 text-white shadow-xs'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 sm:p-5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-[#faf7fd] text-stone-800 rounded-tl-none border border-purple-200/80'
                }`}>
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  ) : (
                    <FormattedMessage content={msg.text} />
                  )}
                  <span className={`text-[9px] block text-right pt-1 ${msg.sender === 'user' ? 'text-purple-200' : 'text-stone-400'}`}>
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
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" /> Gemini AI is formulating response...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {promptPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handlePillClick(pill)}
              disabled={isChatLoading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 font-semibold text-[11px] shrink-0 transition-colors disabled:opacity-50"
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
            disabled={isChatLoading}
            placeholder="Ask any question: general knowledge, science, coding, career strategy, or resume tips..."
            className="flex-1 p-3 rounded-xl border border-purple-200 bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:bg-purple-50 placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isChatLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default AIAssistantPage;
