import React, { useState, useRef, useEffect } from 'react';
import { JARVISMessage } from '../../types';
import { PERSONAL_INFO } from '../../data/profileData';
import { BRAND_ASSETS } from '../../data/brandAssets';
import { useLang } from '../../lib/language';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Terminal, 
  User, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface JARVISDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const JARVISDrawer: React.FC<JARVISDrawerProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  const { t } = useLang();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<JARVISMessage[]>([
    {
      id: 'welcome',
      sender: 'jarvis',
      text: t.jarvisWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    t.jarvisQuery1,
    t.jarvisQuery2,
    t.jarvisQuery3,
    t.jarvisQuery4
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: JARVISMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages
        })
      });

      const data = await res.json();
      const replyText = data.reply || "JARVIS experienced an anomaly retrieving the requested data.";

      const jarvisMsg: JARVISMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, jarvisMsg]);
    } catch (err) {
      const errorMsg: JARVISMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: t.jarvisNetworkError,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in font-mono">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 border border-cyan-500/40 overflow-hidden flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.3)] shrink-0">
              {BRAND_ASSETS.jarvisEye.drawerHeader ? (
                <img 
                  src={BRAND_ASSETS.jarvisEye.drawerHeader} 
                  alt="JARVIS Core Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
              )}
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>{t.jarvisTitle}</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  Gemini 3.6
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {t.jarvisGrounded}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => {
            const isJarvis = msg.sender === 'jarvis';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isJarvis ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border ${
                  isJarvis 
                    ? 'bg-slate-950 border-cyan-500/40 text-cyan-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-200'
                }`}>
                  {isJarvis ? (
                    BRAND_ASSETS.jarvisEye.jarvisAvatar ? (
                      <img src={BRAND_ASSETS.jarvisEye.jarvisAvatar} alt="JARVIS" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )
                  ) : (
                    PERSONAL_INFO.avatarUrl ? (
                      <img src={PERSONAL_INFO.avatarUrl} alt="User" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-4 h-4" />
                    )
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[82%] rounded-2xl p-3.5 space-y-1 font-sans ${
                  isJarvis 
                    ? 'bg-slate-950 border border-slate-800 text-slate-200' 
                    : 'bg-cyan-600 text-white font-medium shadow-md'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed text-xs">
                    {msg.text}
                  </div>
                  <div className={`text-[9px] font-mono ${isJarvis ? 'text-slate-500 text-right' : 'text-cyan-100 text-right'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>{t.jarvisProcessing}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>{t.jarvisSuggested}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {quickPrompts.map((p, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(p)}
                disabled={loading}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors text-left line-clamp-1"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.jarvisPlaceholder}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-xl transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
