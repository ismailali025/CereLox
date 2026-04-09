import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, FileText, Terminal, Activity, ShieldAlert, 
  HelpCircle, Search, Clock, ChevronDown, ChevronRight, Menu, X, 
  Database, CheckCircle, AlertTriangle, PieChart as PieChartIcon, 
  List, Sun, Moon, Bot, Send, Minimize2, ChevronUp, Cpu, Server,
  Wifi, Lock, Eye, Download, RefreshCw, Zap, Disc, Code, Globe,
  Maximize2, Play, Pause
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * CONFIGURATION & CONSTANTS
 * ------------------------------------------------------------------
 */
const BACKEND_URL = "http://localhost:5000/api";
const REFRESH_RATE = 2000; // 2 seconds

// --- UTILITY FUNCTIONS ---
const formatTimestamp = (isoString) => {
  if (!isoString) return new Date().toLocaleTimeString();
  return isoString; 
};

/**
 * ------------------------------------------------------------------
 * VISUAL COMPONENTS (RADAR, SPEEDOMETER, CHARTS)
 * ------------------------------------------------------------------
 */

const Radar = ({ isDarkMode, active }) => {
  const gridColor = isDarkMode ? 'border-emerald-900/30' : 'border-emerald-200';
  const lineColor = isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-200';
  
  return (
    <div className={`relative w-40 h-40 flex items-center justify-center rounded-full border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden transition-all duration-500`}>
      {/* Grid Rings */}
      <div className={`absolute inset-0 border ${gridColor} rounded-full w-full h-full`}></div>
      <div className={`absolute inset-8 border ${gridColor} rounded-full`}></div>
      <div className={`absolute inset-16 border ${gridColor} rounded-full`}></div>
      
      {/* Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className={`w-full h-[1px] ${lineColor}`}></div>
        <div className={`h-full w-[1px] ${lineColor} absolute`}></div>
      </div>

      {/* Scanning Animation */}
      <div className={`absolute w-full h-full ${active ? 'animate-[spin_3s_linear_infinite]' : 'opacity-0'}`}>
        <div className="w-1/2 h-full absolute right-0 bg-gradient-to-l from-emerald-500/20 to-transparent" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}></div>
        <div className="absolute top-0 right-1/2 w-1/2 h-[2px] bg-emerald-500/80 shadow-[0_0_15px_#10b981] origin-right"></div>
      </div>

      {/* Blips (Decorative) */}
      {active && (
        <>
          <div className="absolute top-8 left-10 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
          <div className="absolute bottom-10 right-12 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-75 shadow-[0_0_8px_yellow]"></div>
        </>
      )}
    </div>
  );
};

const Speedometer = ({ value, isDarkMode }) => {
  // Map 0-100 Mbps to rotation (-90deg to 90deg)
  const rotation = Math.min(Math.max((value / 100) * 180 - 90, -90), 90); 
  
  return (
    <div className="relative w-48 h-24 overflow-hidden flex justify-center items-end group">
      {/* Background Arc */}
      <div className={`absolute w-40 h-40 rounded-full border-[20px] ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} top-0 box-border`}></div>
      
      {/* Active Arc (Gradient Mask Idea - Simplified for CSS) */}
      <div className="absolute w-40 h-40 rounded-full border-[20px] border-emerald-500/30 top-0 box-border opacity-50" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)' }}></div>

      {/* Needle */}
      <div 
        className="absolute bottom-0 w-1 h-24 bg-gradient-to-t from-red-600 to-transparent origin-bottom transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) z-10" 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
      </div>

      {/* Center Hub */}
      <div className={`absolute bottom-[-10px] w-12 h-12 rounded-full z-20 border-4 shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}></div>
      
      {/* Value Display */}
      <div className="absolute -bottom-8 text-center">
        <span className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</span>
        <span className="text-xs text-slate-500 block">Mbps</span>
      </div>
    </div>
  );
};

const CustomPieChart = ({ data, title, isDarkMode }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;
  const total = data.reduce((acc, item) => acc + item.val, 0) || 1;

  return (
    <div className={`flex flex-col items-center p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h4 className="text-xs font-bold mb-4 text-slate-500 uppercase tracking-wider">{title}</h4>
      <div className="relative w-32 h-32 group cursor-pointer">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full drop-shadow-lg">
          {data.map((item, i) => {
            const percentage = (item.val / total);
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += percentage * circumference;
            return (
              <circle 
                key={i} 
                cx="50" 
                cy="50" 
                r={radius} 
                fill="transparent" 
                stroke={item.color} 
                strokeWidth="12" 
                strokeDasharray={strokeDasharray} 
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:stroke-[16] hover:opacity-80"
              />
            );
          })}
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{total}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 w-full space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
              <span className="text-slate-400">{item.label}</span>
            </div>
            <span className="font-mono font-bold text-slate-500">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * SUB-COMPONENTS (CHATBOT, LOG ROW, SECTIONS)
 * ------------------------------------------------------------------
 */

const CyberChatbot = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: "CereloX AI Online. Connected to Local Security Event Bus. Ready for directives." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);

  const generateResponse = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', text: "CRITICAL FAILURE: Neural Link Severed (Check Backend Connection)." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="group relative flex items-center justify-center w-16 h-16 bg-slate-900 border-2 border-cyan-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-110 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-cyan-500/10 animate-pulse rounded-xl" />
          <Bot className="w-8 h-8 text-cyan-400 group-hover:text-cyan-200 transition-colors" />
          {/* Notification Dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </button>
      )}
      
      {isOpen && (
        <div className={`flex flex-col w-[380px] h-[600px] border-2 border-cyan-500/50 rounded-lg shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-slate-950/90' : 'bg-white/95'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-cyan-500/30">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-cyan-900/30 rounded border border-cyan-500/30"><Bot className="w-5 h-5 text-cyan-400" /></div>
              <div>
                <h3 className="text-cyan-400 font-bold text-sm tracking-wider">CERELOX AI</h3>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold tracking-widest">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ONLINE
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors"><Minimize2 className="w-5 h-5" /></button>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-transparent' : 'bg-slate-50'}`}>
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400'}`}>
                    {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                 </div>
                 <div className={`p-3 text-sm rounded-2xl max-w-[80%] leading-relaxed ${
                   msg.role === 'user' 
                     ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                     : isDarkMode ? 'bg-slate-800/80 text-cyan-50 border border-slate-700 rounded-bl-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                 }`}>
                   {msg.text}
                 </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 pl-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs text-cyan-500 animate-pulse">Analyzing vector database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && generateResponse()} 
                className={`flex-1 border text-sm rounded-lg px-4 py-2.5 outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-cyan-500' 
                    : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 shadow-sm'
                }`}
                placeholder="Ask about threats, logs, or IPs..." 
              />
              <button 
                onClick={generateResponse} 
                disabled={!input.trim() || loading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LogRow = ({ log, isDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleExpand = async () => {
    setExpanded(!expanded);
    if (!expanded && !summary) {
      setAnalyzing(true);
      try {
        const res = await fetch(`${BACKEND_URL}/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ log_data: JSON.stringify(log) })
        });
        const data = await res.json();
        setSummary(data.summary);
      } catch (e) {
        setSummary("Analysis Failed: Backend unresponsive.");
      }
      setAnalyzing(false);
    }
  };

  const getLevelBadge = (level) => {
    switch(level) {
      case 'ERROR': return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">CRITICAL</span>;
      case 'WARN': return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">WARN</span>;
      default: return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">INFO</span>;
    }
  };

  return (
    <>
      <tr onClick={handleExpand} className={`cursor-pointer transition-colors border-b ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-100 hover:bg-slate-50'}`}>
        <td className="p-4 font-mono text-xs text-slate-500">{log.timestamp}</td>
        <td className="p-4">{getLevelBadge(log.level)}</td>
        <td className={`p-4 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{log.source}</td>
        <td className="p-4 text-sm font-mono text-purple-400">{log.eventID}</td>
        <td className="p-4 text-sm text-slate-500 truncate max-w-xs">{log.message}</td>
        <td className="p-4 text-slate-500">{expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</td>
      </tr>
      {expanded && (
        <tr className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
          <td colSpan="6" className="p-0">
            <div className={`p-6 m-2 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-200 shadow-inner'}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500"><Bot size={24}/></div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold uppercase text-cyan-500 mb-2">AI Event Analysis</h4>
                  {analyzing ? (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <RefreshCw className="animate-spin w-4 h-4"/> Decoding event signature...
                    </div>
                  ) : (
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {summary || "No analysis available."}
                    </p>
                  )}
                  
                  {/* Raw Data Dump */}
                  <div className="mt-4 p-3 bg-black/20 rounded border border-slate-700/50">
                    <code className="text-xs font-mono text-slate-500 block break-all">
                      RAW_JSON: {JSON.stringify(log)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const CheatSheetSection = ({ isDarkMode }) => (
  <div className="space-y-6">
    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Terminal className="text-emerald-500"/> Windows Event ID Reference</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {id: '4624', desc: 'Successful Logon', type: 'info'},
          {id: '4625', desc: 'Failed Logon (Possible Brute Force)', type: 'crit'},
          {id: '4720', desc: 'User Account Created', type: 'warn'},
          {id: '4726', desc: 'User Account Deleted', type: 'warn'},
          {id: '1102', desc: 'Audit Log Cleared (Suspicious)', type: 'crit'},
          {id: '4688', desc: 'New Process Created', type: 'info'},
        ].map(item => (
          <div key={item.id} className={`flex items-center justify-between p-3 rounded border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-mono font-bold text-purple-400">{item.id}</span>
            <span className="text-sm text-slate-500">{item.desc}</span>
            <span className={`w-2 h-2 rounded-full ${item.type === 'crit' ? 'bg-red-500' : item.type === 'warn' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></span>
          </div>
        ))}
      </div>
    </div>
    
    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Wifi className="text-blue-500"/> Common Port Numbers</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {['21: FTP', '22: SSH', '23: Telnet', '25: SMTP', '53: DNS', '80: HTTP', '443: HTTPS', '3389: RDP'].map(p => (
          <div key={p} className={`p-2 text-center text-xs font-mono rounded ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>{p}</div>
        ))}
      </div>
    </div>
  </div>
);

const ReportSection = ({ stats, isDarkMode }) => {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);

  const handleGenerate = () => {
    setGenerating(true);
    setReport(null);
    // Simulate API delay for dramatic effect
    setTimeout(() => {
      setReport(`
SECURITY AUDIT REPORT - CERELOX
------------------------------------------------
TIMESTAMP : ${new Date().toLocaleString()}
STATUS    : ${stats.threats > 0 ? 'COMPROMISED' : 'SECURE'}
------------------------------------------------

[EXECUTIVE SUMMARY]
Total Events Scanned : ${stats.total}
Network Throughput   : ${stats.network_speed} Mbps
Threat Level         : ${stats.threats > 0 ? 'HIGH' : 'LOW'}

[DETAILED FINDINGS]
- ${stats.threats} Critical security incidents detected.
- ${stats.warnings} System warnings logged.
- ${stats.success} Normal operational events.

[RECOMMENDATIONS]
${stats.threats > 0 ? '1. IMMEDIATE ACTION REQUIRED: Investigate FAILED LOGINS.\n2. Rotate Admin credentials.\n3. Check Firewall rules for IP blocks.' : '1. System operating within normal parameters.\n2. Continue routine monitoring.'}

[GENERATED BY CERELOX AI ENGINE]
      `);
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className={`p-6 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className="text-xl font-bold">Generate Audit Report</h2>
          <p className="text-sm text-slate-500">Create a snapshot of current system health for stakeholders.</p>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={generating}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50"
        >
          {generating ? <RefreshCw className="animate-spin" /> : <Download />}
          {generating ? 'Compiling Data...' : 'Download PDF'}
        </button>
      </div>

      <div className={`flex-1 rounded-xl border p-6 font-mono text-sm overflow-auto relative ${isDarkMode ? 'bg-black border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-300 text-slate-800'}`}>
        {report ? (
          <pre className="whitespace-pre-wrap">{report}</pre>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 opacity-50">
            <FileText size={64} />
            <p className="mt-4">No report generated yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * MAIN APP COMPONENT
 * ------------------------------------------------------------------
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, threats: 0, warnings: 0, success: 0, network_speed: 0 });
  const [serverStatus, setServerStatus] = useState('connecting'); // connecting, online, offline
  const [searchTerm, setSearchTerm] = useState('');

  // --- DATA FETCHING LOOP ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/data`);
        if (!response.ok) throw new Error("Failed");
        const data = await response.json();
        setLogs(data.logs);
        setStats(data.stats);
        setServerStatus('online');
      } catch (error) {
        setServerStatus('offline');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, REFRESH_RATE);
    return () => clearInterval(interval);
  }, []);

  // Filtered Logs logic
  const filteredLogs = logs.filter(log => 
    log.source.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.eventID.toString().includes(searchTerm)
  );

  // Common Styles
  const bgMain = isDarkMode ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black' : 'bg-gray-50';
  const bgSidebar = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textMain = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const cardBg = isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`flex h-screen ${textMain} font-sans overflow-hidden transition-colors duration-300 ${bgMain}`}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} ${bgSidebar} border-r transition-all duration-300 flex flex-col z-20 shadow-2xl`}>
        {/* Logo Area */}
        <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} h-20`}>
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">C</div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">CERELOX</h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest">INTELLIGENCE</p>
              </div>
            </div>
          ) : (
            <ShieldAlert className="text-cyan-400 mx-auto w-8 h-8" />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'logs', icon: List, label: 'Logs Explorer' },
            { id: 'statistics', icon: Activity, label: 'Statistics' },
            { id: 'report', icon: FileText, label: 'Reports' },
            { id: 'cheatsheet', icon: Terminal, label: 'Cheat Sheet' },
            // { id: 'settings', icon:  Eye, label: 'Settings' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                activeTab === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <item.icon size={22} className={`${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`}/>
              {isSidebarOpen && <span className="ml-3 font-medium tracking-wide">{item.label}</span>}
              {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_10px_cyan]"></div>}
            </button>
          ))}
        </nav>

        {/* Footer Status */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
            <div className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            {isSidebarOpen && (
              <div className="flex-1">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {serverStatus === 'online' ? 'CONNECTED' : 'OFFLINE'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Server: localhost:5000</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Header */}
        <header className={`h-20 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} border-b border-slate-800 flex items-center justify-between px-8 z-10 backdrop-blur-md`}>
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
              {activeTab}
              {activeTab === 'dashboard' && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">LIVE</span>}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-2"><Globe size={14}/> 192.168.1.105</span>
              <span className="flex items-center gap-2"><Cpu size={14}/> CPU: 12%</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-700"></div> */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2.5 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
              JS
            </div> */}
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-8 space-y-8 scrollbar-thin">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Events', val: stats.total, color: 'blue', icon: Database },
                  { label: 'Threats Detected', val: stats.threats, color: 'red', icon: ShieldAlert },
                  { label: 'Warnings', val: stats.warnings, color: 'yellow', icon: AlertTriangle },
                  { label: 'System Health', val: stats.success, color: 'emerald', icon: CheckCircle },
                ].map((stat, i) => (
                  <div key={i} className={`${cardBg} p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.val}</h3>
                      </div>
                      <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:bg-${stat.color}-500 group-hover:text-white transition-colors`}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                    {/* <div className="mt-4 flex items-center gap-2 text-xs">
                      <span className={`text-${stat.color}-500 font-bold`}>+12%</span>
                      <span className="text-slate-500">from last hour</span>
                    </div> */}
                  </div>
                ))}
              </div>

              {/* Visualization Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart (Main) */}
                <div className={`lg:col-span-2 ${cardBg} border rounded-2xl p-6 relative overflow-hidden`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Activity size={16} /> Live Network Traffic
                    </h3>
                    <span className="text-xs font-mono text-emerald-500 animate-pulse">● RECIEVING DATA</span>
                  </div>
                  {/* CSS-only Bar Chart Visualization */}
                  <div className="h-64 flex items-end justify-between gap-2 px-2">
                    {[...Array(30)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-full bg-cyan-500/20 rounded-t-sm transition-all duration-700 ease-in-out hover:bg-cyan-500/60"
                        style={{ height: `${Math.max(10, Math.random() * 100)}%` }}
                      ></div>
                    ))}
                  </div>
                  {/* Decorative Grid Lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-10" style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                </div>

                {/* Radar & Speedometer */}
                <div className="flex flex-col gap-6">
                  <div className={`flex-1 ${cardBg} border rounded-2xl p-4 flex flex-col items-center justify-center relative`}>
                    <h3 className="absolute top-1 left-4 text-xs font-bold text-slate-500 uppercase">Threat Scanner</h3>
                    <Radar isDarkMode={isDarkMode} active={stats.threats < 0} />
                  </div>
                  <div className={`flex-1 ${cardBg} border rounded-2xl p-4 flex flex-col items-center justify-center relative`}>
                     <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase">Throughput</h3>
                     <Speedometer value={stats.network_speed} isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>

              {/* Recent Logs Table (Preview) */}
              <div className={`${cardBg} border rounded-2xl p-6 overflow-hidden`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><List size={16}/> Recent Events</h3>
                  <button onClick={() => setActiveTab('logs')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">View All <ChevronRight size={12}/></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className={`text-xs uppercase text-slate-500 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Level</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Event ID</th>
                        <th className="p-3">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.slice(0, 5).map((log, i) => (
                        <tr key={i} className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                          <td className="p-3 text-emerald-500 font-mono text-xs">{log.timestamp}</td>
                          <td className="p-3">{log.level === 'ERROR' ? <span className="text-red-500 font-bold text-xs">ERR</span> : <span className="text-slate-500 text-xs">INF</span>}</td>
                          <td className="p-3 text-slate-400 text-sm">{log.source}</td>
                          <td className="p-3 text-purple-400 font-mono text-sm">{log.eventID}</td>
                          <td className="p-3 text-slate-500 text-sm truncate max-w-xs">{log.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. LOGS EXPLORER VIEW */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Search Bar */}
              <div className={`p-4 rounded-xl border flex items-center gap-4 ${cardBg}`}>
                <Search className="text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search logs by ID, Source, or Message..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-400'}`} 
                />
                <span className="text-xs text-slate-500 font-mono border px-2 py-1 rounded border-slate-700">{filteredLogs.length} Records</span>
              </div>

              {/* Full Table */}
              <div className={`${cardBg} border rounded-xl overflow-hidden shadow-lg`}>
                <table className="w-full text-left">
                  <thead className={`bg-slate-950 text-xs text-slate-500 uppercase border-b border-slate-800 sticky top-0`}>
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">ID</th>
                      <th className="p-4">Message</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredLogs.map((log, i) => (
                      <LogRow key={i} log={log} isDarkMode={isDarkMode} />
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-10 text-center text-slate-500">
                          <Search size={48} className="mx-auto mb-4 opacity-20"/>
                          No logs found matching "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. STATISTICS VIEW */}
          {activeTab === 'statistics' && (
             <div className="space-y-6">
               <h2 className="text-2xl font-bold mb-4">System Analytics</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CustomPieChart title="Event Severity" isDarkMode={isDarkMode} data={[
                    { label: 'Info', val: stats.success, color: '#10b981' },
                    { label: 'Error', val: stats.threats, color: '#ef4444' },
                    { label: 'Warn', val: stats.warnings, color: '#eab308' },
                  ]} />
                  <CustomPieChart title="Source Type" isDarkMode={isDarkMode} data={[
                    { label: 'Security', val: Math.floor(stats.total * 0.6), color: '#3b82f6' },
                    { label: 'System', val: Math.floor(stats.total * 0.3), color: '#8b5cf6' },
                    { label: 'App', val: Math.floor(stats.total * 0.1), color: '#ec4899' },
                  ]} />
               </div>
             </div>
          )}

          {/* 4. REPORTS VIEW */}
          {activeTab === 'report' && <ReportSection stats={stats} isDarkMode={isDarkMode} />}

          {/* 5. CHEAT SHEET VIEW */}
          {activeTab === 'cheatsheet' && <CheatSheetSection isDarkMode={isDarkMode} />}

          {/* 6. SETTINGS VIEW (Placeholder)
          {activeTab === 'settings' && (
            <div className={`p-10 rounded-xl border text-center ${cardBg}`}>
              <Settings size={48} className="mx-auto mb-4 text-slate-600"/>
              <h3 className="text-xl font-bold mb-2">Configuration</h3>
              <p className="text-slate-500 mb-6">Manage API Keys, Polling Rates, and Notification Rules.</p>
              <div className="max-w-md mx-auto space-y-4 text-left">
                <div className="flex justify-between items-center p-3 border rounded border-slate-700">
                   <span>Dark Mode Force</span>
                   <div className="w-10 h-5 bg-cyan-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded border-slate-700">
                   <span>Desktop Notifications</span>
                   <div className="w-10 h-5 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
              </div>
            </div>
          )} */}

        </div>
      </main>

      {/* --- FLOATING CHATBOT --- */}
      <CyberChatbot isDarkMode={isDarkMode} />
    </div>
  );
};

export default App;