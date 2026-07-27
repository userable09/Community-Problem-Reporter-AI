import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, HelpCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessageToAI } from '../services/ai';

interface AIChatbotProps {
  userGroqKey?: string;
  onNavigateToReport?: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ userGroqKey, onNavigateToReport }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content:
        'Hello! I am **CivicBot**, your AI Citizen Assistant. I can guide you on reporting community problems, finding responsible municipal departments, drafting formal complaints, or offering emergency advice. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!userText) setInput('');
    setIsSending(true);

    const aiRes = await sendChatMessageToAI(newMessages, userGroqKey);

    const botMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      content: aiRes.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsSending(false);
  };

  const QUICK_PROMPTS = [
    'How do I report a severe pothole?',
    'Who is responsible for water leakage on my street?',
    'How does the AI draft a formal complaint letter?',
    'What should I do in an active power outage emergency?',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">CivicBot AI Citizen Assistant</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-300">Ask any questions regarding municipal reporting, jurisdictions, and complaint writing.</p>
          </div>
        </div>

        {onNavigateToReport && (
          <button
            onClick={onNavigateToReport}
            className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-all"
          >
            <span>Report Issue Now</span>
          </button>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isSending}
            className="text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-full px-4 py-2 transition-all text-left backdrop-blur-md"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-[500px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-white/10 text-emerald-300 border border-white/10'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-black font-semibold rounded-tr-none shadow-md'
                    : 'bg-slate-900/80 border border-white/10 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-black/70' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-emerald-300 border border-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                <span>CivicBot is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-4 border-t border-white/10 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your civic question or complaint help..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
