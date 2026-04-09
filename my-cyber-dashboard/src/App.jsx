import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Server,
  LayoutDashboard, 
  FileText, 
  Terminal, 
  Activity, 
  ShieldAlert, 
  HelpCircle, 
  Search, 
  Clock, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X,
  Database,
  CheckCircle,
  AlertTriangle,
  PieChart as PieChartIcon,
  List,
  Sun,
  Moon,
  Book,
  MessageSquare,
  Github,
  Globe,
  ExternalLink,
  Code,
  Settings,
  Send,      
  Bot,       
  Zap,       
  Minimize2,
  User,
  Trash2,
  Lock,
  Cpu,
  Key,       
  Network,   
  FileCode,  
  Eye        
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key for the Chatbot
const apiKey = ""; 

// --- Cyber Chatbot Component ---

const CyberChatbot = () => {
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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-slate-900 border-2 border-cyan-500 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 bg-cyan-500/10 animate-pulse rounded-xl" />
          <Bot className="w-8 h-8 text-cyan-400 group-hover:text-cyan-200 transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </button>
      )}

      {isOpen && (
        <div className="flex flex-col w-[350px] h-[500px] bg-slate-900 border-2 border-cyan-500/50 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded border ${
                  msg.role === 'user' 
                    ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300' 
                    : msg.role === 'error'
                    ? 'bg-red-900/50 border-red-500/50 text-red-400'
                    : 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400'
                }`}>
                  {msg.role === 'user' ? <div className="text-xs">USR</div> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`flex-1 max-w-[85%] text-sm p-3 border ${
                  msg.role === 'user'
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-100 rounded-l-lg rounded-br-lg'
                    : msg.role === 'error'
                    ? 'bg-red-950/40 border-red-500/30 text-red-200 rounded-r-lg rounded-bl-lg'
                    : 'bg-slate-800/80 border-cyan-500/20 text-cyan-100 rounded-r-lg rounded-bl-lg'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
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

// --- Custom Chart Components ---

// 1. RADAR COMPONENT
const Radar = ({ isDarkMode }) => {
  const blips = useMemo(() => [
    { top: '24%', left: '38%', color: 'bg-red-500', delay: '0s', shadow: '#ef4444' },
    { top: '60%', left: '70%', color: 'bg-emerald-500', delay: '1.2s', shadow: '#10b981' },
    { top: '75%', left: '30%', color: 'bg-yellow-400', delay: '2.5s', shadow: '#facc15' },
    { top: '35%', left: '65%', color: 'bg-red-500', delay: '0.5s', shadow: '#ef4444' },
    { top: '55%', left: '25%', color: 'bg-emerald-500', delay: '1.8s', shadow: '#10b981' },
    { top: '15%', left: '55%', color: 'bg-yellow-400', delay: '0.8s', shadow: '#facc15' },
    { top: '85%', left: '55%', color: 'bg-red-500', delay: '3.0s', shadow: '#ef4444' },
    { top: '45%', left: '45%', color: 'bg-emerald-500', delay: '0.2s', shadow: '#10b981' },
    { top: '65%', left: '55%', color: 'bg-emerald-500', delay: '1.5s', shadow: '#10b981' },
  ], []);

  const gridColor = isDarkMode ? 'border-emerald-900/30' : 'border-emerald-200';
  const lineColor = isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-200';

  return (
    <div className={`relative w-48 h-48 flex items-center justify-center rounded-full border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden`}>
      <div className={`absolute inset-0 border ${gridColor} rounded-full w-full h-full`}></div>
      <div className={`absolute inset-8 border ${gridColor} rounded-full`}></div>
      <div className={`absolute inset-14 border ${gridColor} rounded-full`}></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-full h-[1px] ${lineColor} absolute`}></div>
        <div className={`h-full w-[1px] ${lineColor} absolute`}></div>
        <div className={`w-full h-[1px] ${lineColor} absolute rotate-45`}></div>
        <div className={`h-full w-[1px] ${lineColor} absolute rotate-45`}></div>
      </div>
      {blips.map((blip, i) => (
        <div 
          key={i}
          className={`absolute w-1.5 h-1.5 rounded-full animate-pulse ${blip.color}`}
          style={{ 
            top: blip.top, 
            left: blip.left, 
            animationDelay: blip.delay,
            boxShadow: `0 0 6px ${blip.shadow}`
          }}
        ></div>
      ))}
      <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
        <div className="w-1/2 h-full absolute right-0 bg-gradient-to-l from-emerald-500/10 to-transparent clip-path-polygon"></div>
        <div className="absolute top-0 right-1/2 w-1/2 h-[1px] bg-emerald-500/50 shadow-[0_0_10px_#10b981] origin-right"></div>
      </div>
    </div>
  );
};

// 2. SPEEDOMETER COMPONENT
const Speedometer = ({ value, isDarkMode }) => {
  const rotation = (value / 100) * 180 - 90; 
  const trackColor = isDarkMode ? 'border-emerald-900/30' : 'border-emerald-100';

  return (
    <div className="relative w-56 h-28 overflow-hidden flex justify-center items-end">
      <div className={`absolute w-48 h-48 rounded-full border-[24px] ${trackColor} top-0 box-border`}></div>
      <div 
        className="absolute w-48 h-48 rounded-full border-[24px] border-emerald-500 top-0 box-border"
        style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)' }}
      ></div>
      <div 
        className="absolute bottom-0 w-0 h-0 origin-bottom transition-transform duration-700 ease-out z-10"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '100px solid #ef4444', 
          left: 'calc(50% - 5px)' 
        }}
      >
        <div className="absolute top-[100px] -left-1.5 w-3 h-3 rounded-full shadow-lg bg-red-500/50 blur-sm"></div>
      </div>
      <div className={`absolute bottom-[-10px] w-10 h-10 rounded-full z-20 border-4 shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}></div>
      <div className="absolute bottom-[-4px] w-3 h-3 bg-red-600 rounded-full z-30 left-[calc(50%-6px)]"></div>
    </div>
  );
};

// 3. PIE CHART COMPONENT
const CustomPieChart = ({ data, isDarkMode, sizeClass = "w-64 h-64", showLabel = true, strokeWidth = 20 }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;
  
  const total = data.reduce((acc, item) => acc + item.currentValue, 0);
  const centerTextColor = isDarkMode ? 'text-white' : 'text-slate-800';

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className={`relative ${sizeClass}`}>
        <svg viewBox="0 0 140 140" className="transform -rotate-90 w-full h-full drop-shadow-xl">
          {data.map((item, index) => {
            const percentage = (item.currentValue / total) || 0;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += percentage * circumference;
            
            return (
              <circle
                key={item.id || index}
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-in-out hover:opacity-80 cursor-pointer"
              />
            );
          })}
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className={`text-3xl font-bold ${centerTextColor} font-mono tracking-tighter`}>LIVE</span>
            <span className="text-xs text-slate-400 tracking-widest uppercase">MONITOR</span>
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
          {data.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }}></div>
              <span className={`text-sm font-medium tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.name}</span>
              <span className="text-xs text-slate-500 font-mono">{(item.currentValue / total * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. LINE CHART COMPONENT
const CustomLineChart = ({ data, isDarkMode }) => {
  const [hoveredLine, setHoveredLine] = useState(null);

  const width = 100;
  const height = 40; 
  const maxVal = 100;

  const getPolylinePoints = (points) => {
    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (p / maxVal) * height;
      return `${x},${y}`;
    }).join(' ');
  };

  const getAreaPath = (points) => {
    const line = getPolylinePoints(points);
    return `${line} ${width},${height} 0,${height}`;
  };

  const gridColor = isDarkMode ? 'bg-slate-400' : 'bg-slate-300';

  return (
    <div className="w-full h-full flex flex-col justify-center relative group">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
          <div className={`w-full h-[1px] ${gridColor}`}></div>
          <div className={`w-full h-[1px] ${gridColor}`}></div>
          <div className={`w-full h-[1px] ${gridColor}`}></div>
          <div className={`w-full h-[1px] ${gridColor}`}></div>
          <div className={`w-full h-[1px] ${gridColor}`}></div>
        </div>
        
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {data.map((ds) => {
            const isHovered = hoveredLine === ds.id;
            const isDimmed = hoveredLine && hoveredLine !== ds.id;
            
            return (
              <g key={ds.id} className="transition-all duration-500 ease-in-out">
                <defs>
                  <linearGradient id={`grad-${ds.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ds.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon 
                  points={getAreaPath(ds.history)} 
                  fill={`url(#grad-${ds.id})`}
                  className={`transition-opacity duration-300 ${isDimmed ? 'opacity-0' : 'opacity-100'}`}
                />
                <polyline 
                  points={getPolylinePoints(ds.history)} 
                  fill="none" 
                  stroke={ds.color} 
                  strokeWidth={isHovered ? "1.5" : "0.8"} 
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-all duration-300 ${
                    isDimmed ? 'opacity-20 blur-[1px]' : 'opacity-100 drop-shadow-[0_0_4px_rgba(0,0,0,1)]'
                  }`}
                />
                <polyline 
                  points={getPolylinePoints(ds.history)} 
                  fill="none" 
                  stroke="transparent" 
                  strokeWidth="8" 
                  vectorEffect="non-scaling-stroke"
                  onMouseEnter={() => setHoveredLine(ds.id)}
                  onMouseLeave={() => setHoveredLine(null)}
                  className="cursor-pointer"
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute top-0 right-0 p-2 flex flex-col gap-1 pointer-events-none">
           {data.map(ds => (
             <div 
               key={ds.id} 
               className={`flex items-center justify-end gap-2 transition-opacity duration-300 ${hoveredLine && hoveredLine !== ds.id ? 'opacity-20' : 'opacity-100'}`}
             >
                <span className="text-[10px] font-mono text-slate-300">{ds.history[ds.history.length-1]}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ds.color }}>{ds.name}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [networkSpeed, setNetworkSpeed] = useState(45);
  const [logs, setLogs] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme Colors
  const bgMain = isDarkMode ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black' : 'bg-gray-50';
  const bgSidebar = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textMain = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const headerBg = isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200';

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkSpeed(prev => Math.min(100, Math.max(0, prev + (Math.random() * 20 - 10))));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const types = ['INFO', 'WARN', 'ERROR', 'AUDIT'];
    const sources = ['Security', 'System', 'Application', 'Service'];
    const initialLogs = Array.from({ length: 15 }).map((_, i) => ({
      id: 1000 + i,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      level: types[Math.floor(Math.random() * types.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      eventID: 4624 + Math.floor(Math.random() * 100),
      message: `Detailed event description for log entry #${1000+i}. System status check initiated.`
    }));
    setLogs(initialLogs);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardSection networkSpeed={networkSpeed} isDarkMode={isDarkMode} />;
      case 'logs': return <LogsSection logs={logs} isDarkMode={isDarkMode} />;
      case 'cheatsheet': return <CheatSheetSection isDarkMode={isDarkMode} />;
      case 'report': return <ReportSection isDarkMode={isDarkMode} />;
      case 'statistics': return <StatsSection isDarkMode={isDarkMode} />;
      case 'about': return <AboutSection isDarkMode={isDarkMode} />;
      default: return <DashboardSection networkSpeed={networkSpeed} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`flex h-screen ${textMain} font-sans overflow-hidden transition-colors duration-300`}>
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} ${bgSidebar} border-r transition-all duration-300 flex flex-col z-20 shadow-xl`}
      >
        <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} h-16`}>
          {isSidebarOpen ? (
            <div className="flex flex-col">
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider animate-pulse">
                CereloX
              </div>
              <div className="text-[9px] text-cyan-500/80 font-mono tracking-tighter leading-3 mt-0.5">
                AI powered Central Intelligence for logs
              </div>
            </div>
          ) : (
            <ShieldAlert size={24} className="text-blue-500 mx-auto" />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-1 rounded ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isOpen={isSidebarOpen} isDarkMode={isDarkMode} />
          <SidebarItem icon={<Activity size={20} />} label="Statistics" active={activeTab === 'statistics'} onClick={() => setActiveTab('statistics')} isOpen={isSidebarOpen} isDarkMode={isDarkMode} />
          <SidebarItem icon={<Terminal size={20} />} label="Cheat Sheet" active={activeTab === 'cheatsheet'} onClick={() => setActiveTab('cheatsheet')} isOpen={isSidebarOpen} isDarkMode={isDarkMode} />
          <SidebarItem icon={<Database size={20} />} label="Logs Explorer" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} isOpen={isSidebarOpen} isDarkMode={isDarkMode} />
          <SidebarItem icon={<FileText size={20} />} label="Report" active={activeTab === 'report'} onClick={() => setActiveTab('report')} isOpen={isSidebarOpen} isDarkMode={isDarkMode} />
          <div className={`my-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} mx-4`}></div>
          <SidebarItem icon={<HelpCircle size={20} />} label="About & Help" active={activeTab === 'about'} onClick={() => setActiveTab('about')} isOpen={isSidebarOpen} isDarkMode={isDarkMode} />
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} text-xs text-slate-500`}>
          {isSidebarOpen && <p>v2.4.0-stable<br/>Connected to WinEvent</p>}
        </div>
      </aside>

      <main className={`flex-1 flex flex-col h-full relative overflow-hidden ${bgMain}`}>
        <header className={`h-16 ${headerBg} backdrop-blur-md border-b flex items-center justify-between px-6 z-10 transition-colors duration-300`}>
          <h2 className={`text-3xl font-bold uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {activeTab.replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-mono animate-pulse">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              SYSTEM ONLINE
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {renderContent()}
        </div>
      </main>
      
      <CyberChatbot />
    </div>
  );
};

// --- Sub-Sections ---

const DashboardSection = ({ networkSpeed, isDarkMode }) => {
  const [chartData, setChartData] = useState([
    { id: 'sys', name: 'System', color: '#3b82f6', currentValue: 30, history: [20, 25, 30, 28, 35, 30, 40, 30] },
    { id: 'sec', name: 'Security', color: '#ef4444', currentValue: 45, history: [10, 20, 15, 30, 45, 50, 45, 45] },
    { id: 'app', name: 'Application', color: '#10b981', currentValue: 20, history: [40, 35, 30, 25, 20, 22, 18, 20] },
    { id: 'ser', name: 'Service', color: '#f59e0b', currentValue: 5, history: [15, 12, 10, 8, 5, 8, 6, 5] },
  ]);
  
  const [recentLogs, setRecentLogs] = useState([]);
  const [serverStats, setServerStats] = useState({ total: 0, threats: 0, warnings: 0, success: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/data');
        if (!res.ok) return;
        const data = await res.json();
        
        // Update recent logs
        setRecentLogs(data.logs.slice(0, 15).map(log => ({
          ...log,
          time: log.timestamp
        })));
        
        if (data.stats) {
          setServerStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 2000); 

    // Animate chart purely for visual effect while logs update
    const chartInterval = setInterval(() => {
      setChartData(prevData => {
        return prevData.map(item => {
          const change = Math.floor(Math.random() * 20) - 10;
          const newValue = Math.max(5, Math.min(90, item.currentValue + change));
          const newHistory = [...item.history.slice(1), newValue];
          return { ...item, currentValue: newValue, history: newHistory };
        });
      });
    }, 2000);

    return () => { clearInterval(interval); clearInterval(chartInterval); };
  }, []);

  const cardBg = isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={serverStats.total.toLocaleString()} change="Active" icon={<Database />} color="blue" isDarkMode={isDarkMode} />
        <StatCard title="Critical Threats" value={serverStats.threats.toLocaleString()} change="Logged" icon={<ShieldAlert />} color="red" isDarkMode={isDarkMode} />
        <StatCard title="Warning Alerts" value={serverStats.warnings.toLocaleString()} change="Logged" icon={<AlertTriangle />} color="orange" isDarkMode={isDarkMode} />
        <StatCard title="Successful Logs" value={serverStats.success.toLocaleString()} change="Logged" icon={<CheckCircle />} color="emerald" isDarkMode={isDarkMode} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={`col-span-12 lg:col-span-4 ${cardBg} border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]`}>
           {isDarkMode && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>}
           <h3 className={`absolute top-4 left-4 ${textColor} font-bold text-sm flex items-center gap-2 uppercase tracking-wide`}>
             <PieChartIcon size={16} /> EVENT DISTRIBUTION
           </h3>
           <div className="flex-1 w-full flex items-center justify-center pt-6">
             <CustomPieChart data={chartData} isDarkMode={isDarkMode} />
           </div>
        </div>

        <div className={`col-span-12 lg:col-span-5 ${cardBg} border rounded-xl p-4 flex flex-col relative overflow-hidden min-h-[300px]`}>
          {isDarkMode && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>}
          <div className="flex justify-between items-start mb-2 z-10">
            <h3 className={`${textColor} font-bold text-sm flex items-center gap-2 uppercase tracking-wide`}>
               <Activity size={16} /> LIVE LOG TRENDS
            </h3>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] text-red-400 font-mono">LIVE INGEST</span>
            </div>
          </div>
           <div className="flex-1 w-full mt-2">
             <CustomLineChart data={chartData} isDarkMode={isDarkMode} />
           </div>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className={`flex-1 ${cardBg} border rounded-xl p-2 flex flex-col items-center justify-center relative shadow-lg min-h-[140px]`}>
            <h3 className={`absolute top-2 left-3 ${textColor} font-bold text-sm uppercase tracking-wide`}>THROUGHPUT</h3>
            <div className="mt-4 scale-90 origin-bottom">
               <Speedometer value={networkSpeed} isDarkMode={isDarkMode} />
            </div>
            <p className="text-emerald-400 font-mono font-bold text-lg -mt-2">{Math.floor(networkSpeed)} <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Mbps</span></p>
          </div>

          <div className={`flex-1 ${cardBg} border rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden shadow-lg min-h-[140px]`}>
            <h3 className={`absolute top-2 left-3 ${textColor} font-bold text-sm uppercase tracking-wide`}>ACTIVE SCAN</h3>
            <div className="scale-75 mt-2">
              <Radar isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardBg} border rounded-xl p-5 flex flex-col flex-1 min-h-[300px] mb-6`}>
        <div className="flex items-center justify-between mb-4">
           <h3 className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-bold text-lg flex items-center gap-2 tracking-wide uppercase`}>
             <List size={20} className="text-emerald-500" /> RECENT LOGS STREAM
           </h3>
           <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono animate-pulse">Real-time</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <table className="w-full text-left border-collapse">
              <thead className={`sticky top-0 ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-sm z-10`}>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-700">
                  <th className="pb-3 pl-2 w-32">Time</th>
                  <th className="pb-3 w-32">Source</th>
                  <th className="pb-3 w-24">Event ID</th>
                  <th className="pb-3">Message</th>
                </tr>
              </thead>
              <tbody className={`text-xs font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {recentLogs.map((log) => (
                  <tr key={log.id} className={`border-b ${isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'} transition-colors group`}>
                    <td className="py-2.5 pl-2 text-emerald-500 group-hover:text-emerald-400">{log.time}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.source === 'Security' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        log.source === 'System' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        log.source === 'Application' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>{log.source}</span>
                    </td>
                    <td className="py-2.5 text-slate-400">{log.eventID}</td>
                    <td className={`py-2.5 ${isDarkMode ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'} truncate max-w-xl transition-colors`}>{log.message}</td>
                  </tr>
                ))}
                {recentLogs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-600 italic">Initializing Log Stream...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogsSection = ({ logs, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("index=main source='WinEventLog:Security' EventCode=4625");
  const [selectedLogId, setSelectedLogId] = useState(null);

  const fields = [
    { name: 'source', count: 4, values: ['Security', 'System', 'Application', 'Setup'] },
    { name: 'EventCode', count: 12, values: ['4624', '4625', '4104', '1102'] },
    { name: 'TaskCategory', count: 8, values: ['Logon', 'Special Logon', 'Process Creation'] },
    { name: 'Level', count: 3, values: ['Information', 'Warning', 'Error'] }
  ];

  return (
    <div className={`flex flex-col h-[calc(100vh-8rem)] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
      
      {/* 1. Search Bar Area */}
      <div className={`shrink-0 p-4 rounded-xl border mb-4 shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4 mb-2">
           <div className="flex items-center gap-2 text-emerald-500 font-bold font-mono">
             <Terminal size={18} />
             <span>SPL</span>
           </div>
           <div className="flex-1 relative group">
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className={`w-full bg-transparent border-b ${isDarkMode ? 'border-slate-700 focus:border-emerald-500' : 'border-slate-300 focus:border-emerald-500'} outline-none py-1 font-mono text-sm transition-colors`}
             />
             <button className="absolute right-0 top-0 text-slate-400 hover:text-emerald-500">
               <Search size={18} />
             </button>
           </div>
           <div className={`flex items-center gap-2 px-3 py-1 rounded border text-xs cursor-pointer hover:bg-slate-800 transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
             <Clock size={14} />
             <span>Last 24 Hours</span>
             <ChevronDown size={12} />
           </div>
        </div>
        
        <div className="flex items-end gap-1 h-8 mt-2 opacity-50">
           {[...Array(60)].map((_, i) => (
             <div 
               key={i} 
               className={`flex-1 rounded-t-sm transition-all hover:opacity-100 cursor-pointer ${Math.random() > 0.9 ? 'bg-red-500' : Math.random() > 0.7 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
               style={{ height: `${Math.random() * 100}%` }}
             ></div>
           ))}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        
        {/* Sidebar */}
        <div className={`w-64 shrink-0 overflow-y-auto rounded-xl border p-4 hidden md:block ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
           <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-500">Interesting Fields</h3>
           <div className="space-y-6">
             {fields.map((field) => (
               <div key={field.name}>
                 <div className="flex justify-between items-center mb-2 group cursor-pointer">
                   <span className={`text-sm font-mono font-bold ${isDarkMode ? 'text-slate-200 group-hover:text-emerald-400' : 'text-slate-700 group-hover:text-emerald-600'}`}>{field.name}</span>
                   <span className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{field.count}</span>
                 </div>
                 <div className="pl-2 space-y-1">
                   {field.values.map(val => (
                     <div key={val} className="text-xs text-slate-500 hover:text-emerald-500 cursor-pointer truncate">
                       {val}
                     </div>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Results Table */}
        <div className={`flex-1 overflow-hidden rounded-xl border flex flex-col ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
           <div className={`flex items-center px-4 py-3 border-b text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
             <div className="w-12 text-center">#</div>
             <div className="w-32">Time</div>
             <div className="w-24">Level</div>
             <div className="w-32">Event Code</div>
             <div className="flex-1">Raw Event Message</div>
           </div>

           <div className="flex-1 overflow-y-auto">
             {logs.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                 <Database size={48} className="mb-2" />
                 <p>No events found matching query</p>
               </div>
             ) : (
               logs.map((log) => (
                 <div 
                   key={log.id} 
                   onClick={() => setSelectedLogId(selectedLogId === log.id ? null : log.id)}
                   className={`flex flex-col border-b text-sm font-mono cursor-pointer transition-colors ${
                     selectedLogId === log.id 
                       ? (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200') 
                       : (isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50')
                   }`}
                 >
                   <div className="flex items-center px-4 py-2">
                     <div className="w-12 text-center text-slate-500">
                       <ChevronRight size={14} className={`transition-transform ${selectedLogId === log.id ? 'rotate-90' : ''} inline-block`} />
                     </div>
                     <div className="w-32 text-emerald-500 whitespace-nowrap">{log.timestamp.split('T')[1].slice(0,8)}</div>
                     <div className="w-24">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          log.level === 'ERROR' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                          log.level === 'WARN' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                          'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {log.level}
                        </span>
                     </div>
                     <div className="w-32 text-slate-400">{log.eventID}</div>
                     <div className={`flex-1 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                       {log.message}
                     </div>
                   </div>
                   
                   {selectedLogId === log.id && (
                     <div className={`px-16 py-4 text-xs font-mono border-t ${isDarkMode ? 'bg-black/20 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                       <div className="grid grid-cols-2 gap-4">
                         <div><span className="font-bold text-emerald-500">Source:</span> {log.source}</div>
                         <div><span className="font-bold text-emerald-500">EventID:</span> {log.eventID}</div>
                         <div><span className="font-bold text-emerald-500">User:</span> SYSTEM</div>
                         <div><span className="font-bold text-emerald-500">Computer:</span> WORKSTATION-01</div>
                         <div className="col-span-2 mt-2 pt-2 border-t border-slate-700/50">
                           <span className="font-bold text-emerald-500 block mb-1">Full Message:</span>
                           {log.message}
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

const StatsSection = ({ isDarkMode }) => {
  const cardBg = isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const headingColor = isDarkMode ? 'text-white' : 'text-slate-900';

  const metrics = [
    { 
      label: 'System Status', 
      value: '99.99%', 
      sub: 'Uptime',
      trend: 'Healthy', 
      good: true, 
      icon: <Database size={20} />,
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10'
    },
    { 
      label: 'Security Posture', 
      value: 'ELEVATED', 
      sub: 'Threat Level',
      trend: '3 Active', 
      good: false, 
      icon: <ShieldAlert size={20} />,
      colorClass: 'text-red-500',
      bgClass: 'bg-red-500/10'
    },
    { 
      label: 'Application Health', 
      value: '98.5%', 
      sub: 'Success Rate',
      trend: '+0.4%', 
      good: true, 
      icon: <LayoutDashboard size={20} />,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10'
    },
    { 
      label: 'Service Latency', 
      value: '42ms', 
      sub: 'Avg Response',
      trend: '-12ms', 
      good: true, 
      icon: <Zap size={20} />,
      colorClass: 'text-orange-500',
      bgClass: 'bg-orange-500/10'
    },
  ];

  const weeklyStats = [
    { day: 'Mon', val: 45 }, { day: 'Tue', val: 52 }, { day: 'Wed', val: 38 },
    { day: 'Thu', val: 65 }, { day: 'Fri', val: 48 }, { day: 'Sat', val: 25 }, { day: 'Sun', val: 20 }
  ];
  const maxVal = Math.max(...weeklyStats.map(d => d.val));

  const categoryData = {
    system: [
      { name: 'CPU Load', currentValue: 45, color: '#3b82f6' },
      { name: 'Memory', currentValue: 30, color: '#60a5fa' },
      { name: 'Disk I/O', currentValue: 15, color: '#93c5fd' },
      { name: 'Network', currentValue: 10, color: '#bfdbfe' },
    ],
    security: [
      { name: 'Malware', currentValue: 25, color: '#ef4444' },
      { name: 'Phishing', currentValue: 35, color: '#f87171' },
      { name: 'Auth Fail', currentValue: 30, color: '#fca5a5' },
      { name: 'DDoS', currentValue: 10, color: '#fecaca' },
    ],
    application: [
      { name: '500 Errors', currentValue: 20, color: '#10b981' },
      { name: 'Latency', currentValue: 40, color: '#34d399' },
      { name: '404s', currentValue: 30, color: '#6ee7b7' },
      { name: 'Crashes', currentValue: 10, color: '#a7f3d0' },
    ],
    service: [
      { name: 'Timeout', currentValue: 15, color: '#f59e0b' },
      { name: 'Unreachable', currentValue: 10, color: '#fbbf24' },
      { name: 'Degraded', currentValue: 25, color: '#fcd34d' },
      { name: 'Operational', currentValue: 50, color: '#fde68a' },
    ]
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`${cardBg} border rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group`}>
             <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${m.bgClass.replace('/10', '/20')}`}></div>
             <div className="flex justify-between items-start z-10">
               <div className={`p-2 rounded-lg ${m.bgClass} ${m.colorClass}`}>
                 {m.icon}
               </div>
               <span className={`text-xs font-bold px-2 py-1 rounded-full border ${m.good ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                 {m.trend}
               </span>
             </div>
             <div className="z-10 mt-2">
               <div className={`text-2xl font-bold font-mono ${headingColor}`}>{m.value}</div>
               <div className="flex justify-between items-end">
                 <div className={`text-xs font-bold uppercase tracking-wider ${m.colorClass}`}>{m.label}</div>
                 <div className={`text-[10px] ${textColor}`}>{m.sub}</div>
               </div>
             </div>
          </div>
        ))}
      </div>

      <div className={`${cardBg} border rounded-xl p-6`}>
         <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className={`font-bold ${headingColor} flex items-center gap-2`}>
                <Activity size={18} className="text-blue-500"/> Weekly Incident Volume
              </h3>
              <p className={`text-xs ${textColor} mt-1`}> aggregated across all log sources</p>
            </div>
            <div className={`text-sm font-mono ${headingColor} bg-slate-500/10 px-2 py-1 rounded`}>
               Total: 293
            </div>
         </div>
         <div className="h-64 flex items-end gap-4 justify-between px-4">
            {weeklyStats.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                 <div className="w-full bg-slate-500/10 rounded-t-sm relative h-full flex items-end overflow-hidden hover:bg-slate-500/20 transition-colors">
                    <div 
                      style={{ height: `${(d.val / maxVal) * 100}%` }} 
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 opacity-80 group-hover:opacity-100 transition-all duration-300 relative"
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {d.val} Incidents
                       </div>
                    </div>
                 </div>
                 <span className={`text-xs font-mono ${textColor}`}>{d.day}</span>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className={`${cardBg} border rounded-xl p-4 flex flex-col items-center`}>
            <h4 className={`text-sm font-bold uppercase mb-4 tracking-wide text-blue-500`}>System Distribution</h4>
            <div className="h-40 w-40">
               <CustomPieChart data={categoryData.system} isDarkMode={isDarkMode} sizeClass="w-40 h-40" showLabel={false} strokeWidth={15} />
            </div>
            <div className="w-full mt-4 space-y-2">
               {categoryData.system.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                     <span className={textColor}>{item.name}</span>
                     <span className="font-mono" style={{ color: item.color }}>{item.currentValue}%</span>
                  </div>
               ))}
            </div>
         </div>

         <div className={`${cardBg} border rounded-xl p-4 flex flex-col items-center`}>
            <h4 className={`text-sm font-bold uppercase mb-4 tracking-wide text-red-500`}>Threat Analysis</h4>
            <div className="h-40 w-40">
               <CustomPieChart data={categoryData.security} isDarkMode={isDarkMode} sizeClass="w-40 h-40" showLabel={false} strokeWidth={15} />
            </div>
            <div className="w-full mt-4 space-y-2">
               {categoryData.security.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                     <span className={textColor}>{item.name}</span>
                     <span className="font-mono" style={{ color: item.color }}>{item.currentValue}%</span>
                  </div>
               ))}
            </div>
         </div>

         <div className={`${cardBg} border rounded-xl p-4 flex flex-col items-center`}>
            <h4 className={`text-sm font-bold uppercase mb-4 tracking-wide text-emerald-500`}>App Performance</h4>
            <div className="h-40 w-40">
               <CustomPieChart data={categoryData.application} isDarkMode={isDarkMode} sizeClass="w-40 h-40" showLabel={false} strokeWidth={15} />
            </div>
            <div className="w-full mt-4 space-y-2">
               {categoryData.application.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                     <span className={textColor}>{item.name}</span>
                     <span className="font-mono" style={{ color: item.color }}>{item.currentValue}%</span>
                  </div>
               ))}
            </div>
         </div>

         <div className={`${cardBg} border rounded-xl p-4 flex flex-col items-center`}>
            <h4 className={`text-sm font-bold uppercase mb-4 tracking-wide text-orange-500`}>Service Health</h4>
            <div className="h-40 w-40">
               <CustomPieChart data={categoryData.service} isDarkMode={isDarkMode} sizeClass="w-40 h-40" showLabel={false} strokeWidth={15} />
            </div>
            <div className="w-full mt-4 space-y-2">
               {categoryData.service.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                     <span className={textColor}>{item.name}</span>
                     <span className="font-mono" style={{ color: item.color }}>{item.currentValue}%</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const CheatSheetSection = ({ isDarkMode }) => {
  const cardBase = isDarkMode
    ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
    : 'bg-white border-slate-200 text-slate-800 hover:shadow-lg hover:border-blue-400';

  const headingColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const accentColor = 'text-cyan-400';

  return (
    <div className="flex flex-col gap-6 h-full pb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className={`text-2xl font-bold uppercase tracking-widest ${headingColor}`}>Windows Event Reference</h2>
          <p className="text-sm text-slate-500 font-mono mt-1">SOC Analyst Field Guide v2.4</p>
        </div>
        <div className={`px-3 py-1 rounded text-xs border ${isDarkMode ? 'border-cyan-900 bg-cyan-950/30 text-cyan-400' : 'border-blue-100 bg-blue-50 text-blue-600'}`}>
          Event Viewer Focused
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        
        <div className={`p-6 rounded-xl border transition-all duration-300 ${cardBase} col-span-1 lg:col-span-2 flex flex-col justify-between`}>
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h3 className={`font-bold uppercase tracking-wide text-base ${headingColor}`}>Critical Security Events</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <CheatRow id="4624" title="Successful Logon" desc="User logged on successfully." color="text-emerald-500" isDarkMode={isDarkMode} />
            <CheatRow id="4625" title="Failed Logon" desc="Account failed to log on. Brute force indicator." color="text-red-500" isDarkMode={isDarkMode} />
            <CheatRow id="4720" title="User Created" desc="A user account was created." color="text-blue-400" isDarkMode={isDarkMode} />
            <CheatRow id="4726" title="User Deleted" desc="A user account was deleted." color="text-orange-400" isDarkMode={isDarkMode} />
            <CheatRow id="4672" title="Admin Logon" desc="Special privileges assigned to new logon." color="text-purple-400" isDarkMode={isDarkMode} />
            <CheatRow id="1102" title="Log Clear" desc="The audit log was cleared. Highly suspicious." color="text-yellow-400" isDarkMode={isDarkMode} />
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-300 ${cardBase} col-span-1 flex flex-col justify-between`}>
          <div className="flex items-center gap-3 mb-6">
            <Key className={`w-6 h-6 ${accentColor}`} />
            <h3 className={`font-bold uppercase tracking-wide text-base ${headingColor}`}>Logon Types (ID 4624)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className={`font-bold font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>Type 2</span>
              <span className="text-right">Interactive (Keyboard/Screen)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`font-bold font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>Type 3</span>
              <span className="text-right">Network (SMB, Shared Folder)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`font-bold font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>Type 4</span>
              <span className="text-right">Batch (Scheduled Task)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`font-bold font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>Type 5</span>
              <span className="text-right">Service (Background Service)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`font-bold font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>Type 10</span>
              <span className="text-right">Remote Interactive (RDP)</span>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-300 ${cardBase} col-span-1 flex flex-col justify-between`}>
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <h3 className={`font-bold uppercase tracking-wide text-base ${headingColor}`}>Process Tracking</h3>
          </div>
          <div className="space-y-5">
            <CheatRow id="4688" title="Process Created" desc="New process started. Check 'Creator Process ID'." color="text-emerald-400" isDarkMode={isDarkMode} />
            <CheatRow id="4689" title="Process Exited" desc="A process has ended." color="text-slate-400" isDarkMode={isDarkMode} />
            <div className={`mt-2 p-3 rounded text-xs border leading-relaxed ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <strong>Tip:</strong> Enable "Include Command Line" in Group Policy to see arguments in Event 4688.
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-300 ${cardBase} col-span-1 lg:col-span-2 flex flex-col justify-between`}>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h3 className={`font-bold uppercase tracking-wide text-base ${headingColor}`}>Suspicious Activity Patterns</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded border h-full ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-sm font-bold text-red-400 mb-2">Brute Force / Password Spray</h4>
              <p className="text-xs leading-relaxed">Multiple <span className="font-mono text-orange-400">4625</span> events from same IP or User within short timeframe, followed by single <span className="font-mono text-emerald-400">4624</span>.</p>
            </div>
            <div className={`p-4 rounded border h-full ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-sm font-bold text-purple-400 mb-2">PowerShell Abuse</h4>
              <p className="text-xs leading-relaxed">Look for <span className="font-mono text-purple-400">4104</span> (Script Block Logging) containing "EncodedCommand", "DownloadString", or "IEX".</p>
            </div>
            <div className={`p-4 rounded border h-full ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-sm font-bold text-blue-400 mb-2">Persistence via Scheduled Task</h4>
              <p className="text-xs leading-relaxed">Event <span className="font-mono text-blue-400">4698</span> (Task Created) or <span className="font-mono text-blue-400">4702</span> (Task Updated) running suspicious binaries.</p>
            </div>
            <div className={`p-4 rounded border h-full ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-sm font-bold text-yellow-400 mb-2">Account Manipulation</h4>
              <p className="text-xs leading-relaxed">Event <span className="font-mono text-yellow-400">4720</span> (Create) immediately followed by <span className="font-mono text-yellow-400">4732</span> (Add to Group - Administrators).</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-300 ${cardBase} col-span-1 flex flex-col justify-between`}>
          <div className="flex items-center gap-3 mb-6">
            <FileCode className="w-6 h-6 text-blue-400" />
            <h3 className={`font-bold uppercase tracking-wide text-base ${headingColor}`}>Key Log Channels</h3>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></span>
              <div>
                <span className="font-bold block">Security</span>
                <span className="text-xs text-slate-500">Auth, audit, privileges.</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></span>
              <div>
                <span className="font-bold block">System</span>
                <span className="text-xs text-slate-500">Service start/stop, OS errors.</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></span>
              <div>
                <span className="font-bold block">Application</span>
                <span className="text-xs text-slate-500">App crashes, SQL errors.</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></span>
              <div>
                <span className="font-bold block">Powershell/Operational</span>
                <span className="text-xs text-slate-500">Detailed script execution logs.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-300 ${cardBase} col-span-1 flex flex-col justify-between`}>
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-pink-500" />
            <h3 className={`font-bold uppercase tracking-wide text-base ${headingColor}`}>Sysmon (Optional)</h3>
          </div>
          <div className="space-y-4">
             <CheatRow id="1" title="Process Create" desc="Advanced process monitoring." color="text-pink-400" isDarkMode={isDarkMode} />
             <CheatRow id="3" title="Network Connect" desc="TCP/UDP connections." color="text-pink-400" isDarkMode={isDarkMode} />
             <CheatRow id="11" title="File Create" desc="File creation events." color="text-pink-400" isDarkMode={isDarkMode} />
             <CheatRow id="13" title="Registry Set" desc="Registry value modifications." color="text-pink-400" isDarkMode={isDarkMode} />
             <CheatRow id="22" title="DNS Query" desc="DNS lookup monitoring." color="text-pink-400" isDarkMode={isDarkMode} />
          </div>
        </div>

      </div>
    </div>
  );
};

const CheatRow = ({ id, title, desc, color, isDarkMode }) => (
  <div className="flex items-start gap-3">
    <span className={`font-mono font-bold text-sm px-2 py-1 rounded border min-w-[3rem] text-center ${color.replace('text-', 'border-').replace('500', '500/30').replace('400', '400/30')} ${color} ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      {id}
    </span>
    <div>
      <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{title}</div>
      <div className="text-xs text-slate-500 leading-tight mt-0.5">{desc}</div>
    </div>
  </div>
);

const ReportSection = ({ isDarkMode }) => (
  <div className={`rounded-xl overflow-hidden shadow-2xl max-w-5xl mx-auto min-h-[800px] flex flex-col ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-900'}`}>
    <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-slate-800'} text-white p-8 flex justify-between items-start`}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SECURITY INCIDENT REPORT</h1>
        <p className="text-emerald-400 mt-2 font-mono text-sm">CONFIDENTIAL // INTERNAL USE ONLY</p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-slate-500">#REP-2023-10-A</div>
        <p className="text-slate-400 text-sm mt-1">Generated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>

    <div className={`${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-100 border-slate-200'} p-4 border-b flex justify-between items-center no-print`}>
      <div className="flex gap-2">
        <span className={`px-3 py-1 border rounded text-sm font-medium shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-white border-slate-300 text-slate-600'}`}>Draft</span>
        <span className={`px-3 py-1 border rounded text-sm font-medium shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-white border-slate-300 text-slate-600'}`}>Automated</span>
      </div>
      <div className="flex gap-3">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>
          <Settings size={16} /> Configure
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium text-sm shadow-md transition-colors" onClick={() => alert("Printing Report...")}>
          <Download size={16} /> Export PDF
        </button>
      </div>
    </div>

    <div className={`p-10 flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} pb-6 mb-8`}>
        <h3 className={`text-xl font-bold uppercase border-l-4 border-emerald-500 pl-3 mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Executive Summary</h3>
        <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed text-justify`}>
          During the monitoring period (Last 24 Hours), the SIEM system ingested 1.2M log events. 
          The threat detection radar identified 0 active intrusions. Network throughput remains nominal with 
          occasional spikes correlating with scheduled backups. No critical vulnerabilities were exploited.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className={`font-bold mb-3 text-sm uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Top 5 Log Sources</h4>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><td className="py-2">Windows Security</td><td className="text-right font-mono">450,210</td></tr>
              <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><td className="py-2">Firewall Edge</td><td className="text-right font-mono">320,105</td></tr>
              <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><td className="py-2">Active Directory</td><td className="text-right font-mono">150,000</td></tr>
              <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><td className="py-2">IIS Web Server</td><td className="text-right font-mono">98,400</td></tr>
              <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><td className="py-2">Anti-Virus Agent</td><td className="text-right font-mono">54,200</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h4 className={`font-bold mb-3 text-sm uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Threat Severity Breakdown</h4>
          <div className="flex items-center gap-4 mt-6">
             <div className="w-1/3 text-center">
                <div className="text-4xl font-bold text-red-500">3</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Critical</div>
             </div>
             <div className="w-1/3 text-center">
                <div className="text-4xl font-bold text-orange-500">12</div>
                <div className="text-xs text-slate-500 uppercase font-bold">High</div>
             </div>
             <div className="w-1/3 text-center">
                <div className="text-4xl font-bold text-yellow-500">45</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Medium</div>
             </div>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
         <h3 className={`font-bold text-sm uppercase mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Analyst Remarks</h3>
         <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm italic`}>
           "Routine scan completed. The spike in EventID 4625 at 03:00 AM originated from the Backup Service account 
           and has been verified as a password expiration issue, not a brute force attack. Recommend password rotation."
         </p>
         <div className="mt-4 flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-slate-300"></div>
           <div className="text-xs">
             <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>John Doe</div>
             <div className="text-slate-500">Senior SOC Analyst</div>
           </div>
         </div>
      </div>
    </div>
    
    <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'} p-4 text-center text-slate-500 text-xs`}>
      Generated automatically by MajorProject SIEM Core v2.4
    </div>
  </div>
);

const AboutSection = ({ isDarkMode }) => {
  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>CereloX Documentation</h1>
        <p className={`${subText} text-lg`}>Your central hub for configuring and mastering the CereloX SIEM platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
          <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
            <Book size={24} className="text-blue-500" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${textColor}`}>User Guide</h3>
          <p className={`${subText} text-sm`}>Comprehensive guides for setting up agents, configuring rules, and managing alerts.</p>
        </div>

        <div className={`${cardBg} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
          <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
            <Code size={24} className="text-emerald-500" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${textColor}`}>API Reference</h3>
          <p className={`${subText} text-sm`}>Detailed API documentation for integrating CereloX with your existing stack.</p>
        </div>

        <div className={`${cardBg} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
          <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
            <MessageSquare size={24} className="text-purple-500" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${textColor}`}>Community</h3>
          <p className={`${subText} text-sm`}>Join the discussion, request features, and get help from fellow security analysts.</p>
        </div>
      </div>

      <div className={`${cardBg} border rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6`}>
        <div>
          <h3 className={`text-xl font-bold mb-1 ${textColor}`}>CereloX Core v2.4.0</h3>
          <p className={`${subText} text-sm`}>Latest stable build • Released Dec 2023</p>
        </div>
        <div className="flex gap-4">
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
            <Github size={18} /> GitHub
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
            <Globe size={18} /> Website
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            <ExternalLink size={18} /> Support Portal
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const SidebarItem = ({ icon, label, active, onClick, isOpen, isDarkMode }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center p-3 transition-colors relative
      ${active 
        ? 'text-emerald-400 bg-slate-800/50 border-r-2 border-emerald-500' 
        : isDarkMode 
          ? 'text-slate-400 hover:text-white hover:bg-slate-800/30' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
      }
      ${!isOpen && 'justify-center'}
    `}
  >
    <div className={`${active ? 'text-emerald-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
      {icon}
    </div>
    {isOpen && <span className="ml-3 font-medium text-sm">{label}</span>}
    {active && isOpen && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/0"></div>}
  </button>
);

const StatCard = ({ title, value, change, icon, color, isDarkMode }) => {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500",
    red: "bg-red-500/10 text-red-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
    orange: "bg-orange-500/10 text-orange-500",
  };

  return (
    <div className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} border p-4 rounded-xl flex items-center justify-between`}>
      <div>
        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-medium uppercase tracking-wider`}>{title}</p>
        <h4 className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h4>
        <span className={`text-xs ${change.includes('+') ? 'text-emerald-400' : change.includes('-') ? 'text-red-400' : 'text-slate-500'}`}>
          {change} Since last hour
        </span>
      </div>
      <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
        {icon}
      </div>
    </div>
  );
};

const FilterItem = ({ label, count, isDarkMode }) => (
  <div className={`flex items-center justify-between text-xs py-1.5 cursor-pointer transition-colors ${isDarkMode ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'}`}>
    <span className="font-mono">{label}</span>
    <span className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} px-1.5 py-0.5 rounded text-[10px]`}>{count}</span>
  </div>
);

const CheatItem = ({ cmd, desc, isDarkMode }) => (
  <div className="mb-3 last:mb-0">
    <code className={`block px-2 py-1 rounded text-xs font-mono mb-1 border ${isDarkMode ? 'bg-slate-950 text-emerald-400 border-slate-800/50' : 'bg-slate-50 text-emerald-600 border-slate-200'}`}>
      {cmd}
    </code>
    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-xs pl-1`}>{desc}</p>
  </div>
);

const CheatCard = ({ title, children, color, isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm'} border-t-2 ${color} p-4 rounded-lg shadow-lg`}>
    <h4 className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
      {title}
    </h4>
    <div>{children}</div>
  </div>
);

export default App;