import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, Zap, Activity, Minimize2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Paste your Gemini API Key here
const apiKey = ""; 

export default function CyberChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "SYSTEM ONLINE. I am CereloX Assistant. Ready for directives."
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateResponse = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      });

      const response = result.response.text();
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      console.error("System Error:", err);
      setMessages(prev => [...prev, { 
        role: 'error', 
        text: "ERR: CONNECTION_LOST. Please verify API key credentials." 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {/* Minimized State (Floating Button) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-slate-900 border-2 border-cyan-500 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 bg-cyan-500/10 animate-pulse rounded-xl" />
          <Bot className="w-8 h-8 text-cyan-400 group-hover:text-cyan-200 transition-colors" />
          
          {/* Status Dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Expanded State (Chat Interface) */}
      {isOpen && (
        <div className="flex flex-col w-[350px] h-[500px] bg-slate-900 border-2 border-cyan-500/50 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-cyan-500/30">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-cyan-400 font-bold text-sm tracking-wider">CERELOX AI</h3>
                <div className="flex items-center gap-1 text-[10px] text-green-400">
                  <Activity className="w-3 h-3" />
                  <span>SYSTEM ONLINE</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded text-cyan-500/70 hover:text-cyan-400 transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded border ${
                  msg.role === 'user' 
                    ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300' 
                    : msg.role === 'error'
                    ? 'bg-red-900/50 border-red-500/50 text-red-400'
                    : 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400'
                }`}>
                  {msg.role === 'user' ? <div className="text-xs">USR</div> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[85%] text-sm p-3 border ${
                  msg.role === 'user'
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-100 rounded-l-lg rounded-br-lg'
                    : msg.role === 'error'
                    ? 'bg-red-950/40 border-red-500/30 text-red-200 rounded-r-lg rounded-bl-lg'
                    : 'bg-slate-800/80 border-cyan-500/20 text-cyan-100 rounded-r-lg rounded-bl-lg'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <span className="text-[10px] opacity-50 mt-1 block uppercase">
                    {msg.role === 'user' ? '<< TRANSMITTED' : '>> RECEIVED'}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded border bg-cyan-900/30 border-cyan-500/50 text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 p-3 bg-slate-800/50 border border-cyan-500/20 rounded-r-lg rounded-bl-lg">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-800 border-t border-cyan-500/30">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isProcessing}
                placeholder="Enter command..."
                className="flex-1 bg-slate-900 border border-cyan-500/30 text-cyan-100 placeholder:text-cyan-700/50 text-sm rounded px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
              />
              <button
                onClick={generateResponse}
                disabled={isProcessing || !input.trim()}
                className="bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 text-cyan-400 p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Zap className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}