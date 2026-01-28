import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Video, 
  Smartphone, 
  Monitor, 
  Square, 
  Type, 
  Layers, 
  Sparkles, 
  Settings2,
  Image as ImageIcon,
  Clock,
  ArrowUp,
  ArrowDown,
  Music,
  Crown,
  Check,
  X,
  Zap,
  Star,
  CreditCard
} from 'lucide-react';

// --- Assets & Constants ---

const THEMES = [
  { name: 'Midnight', bg: 'bg-slate-900', text: 'text-white', accent: 'text-yellow-400' },
  { name: 'Lemonade', bg: 'bg-yellow-400', text: 'text-black', accent: 'text-indigo-900' },
  { name: 'Crimson', bg: 'bg-red-600', text: 'text-white', accent: 'text-black' },
  { name: 'Pitch', bg: 'bg-black', text: 'text-white', accent: 'text-green-400' },
  { name: 'Clean', bg: 'bg-white', text: 'text-black', accent: 'text-red-600' },
  { name: 'Royal', bg: 'bg-indigo-600', text: 'text-white', accent: 'text-pink-300' },
  { name: 'Neon', bg: 'bg-cyan-400', text: 'text-black', accent: 'text-purple-800' },
];

const ANIMATIONS = [
  'animate-stomp',
  'animate-slide-up',
  'animate-pop-in',
  'animate-rotate-in',
  'animate-blur-in'
];

const ASPECT_RATIOS = {
  '9:16': { 
    label: 'Reel / Story', 
    icon: <Smartphone className="w-4 h-4" />,
    containerClass: 'aspect-[9/16] max-w-[340px]',
    textClass: 'text-5xl'
  },
  '16:9': { 
    label: 'Landscape / YT', 
    icon: <Monitor className="w-4 h-4" />,
    containerClass: 'aspect-video max-w-[640px]',
    textClass: 'text-6xl lg:text-7xl'
  },
  '1:1': { 
    label: 'Square / Post', 
    icon: <Square className="w-4 h-4" />,
    containerClass: 'aspect-square max-w-[450px]',
    textClass: 'text-5xl lg:text-6xl'
  }
};

const INITIAL_FRAMES = [
  { id: 1, text: "Ruko...", image: "", duration: 1.5 },
  { id: 2, text: "Apna Empire kab banaoge?", image: "", duration: 3 },
  { id: 3, text: "Business start karne ke liye paisa nahi", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800", duration: 3.5 },
  { id: 4, text: "Idea aur Product chahiye.", image: "", duration: 2.5 },
  { id: 5, text: "Start Now!", image: "", duration: 3 }
];

// --- Sub-Components ---

const PricingCard = ({ title, price, period, features, recommended, onSelect }) => (
  <div className={`relative p-6 rounded-2xl border flex flex-col h-full ${recommended ? 'bg-gradient-to-b from-purple-900/40 to-black border-purple-500/50 shadow-2xl shadow-purple-900/20' : 'bg-neutral-900/50 border-white/10'}`}>
    {recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
        Best Value
      </div>
    )}
    <div className="mb-4">
      <h3 className="text-gray-400 font-medium text-sm tracking-wide uppercase">{title}</h3>
      <div className="flex items-baseline mt-2">
        <span className="text-3xl font-bold text-white">₹{price}</span>
        <span className="text-gray-500 text-sm ml-1">/{period}</span>
      </div>
    </div>
    
    <div className="flex-1 space-y-3 mb-6">
      {features.map((feat, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`mt-1 p-0.5 rounded-full ${recommended ? 'bg-purple-500' : 'bg-gray-700'}`}>
            <Check className="w-2 h-2 text-white" />
          </div>
          <span className="text-sm text-gray-300 leading-snug">{feat}</span>
        </div>
      ))}
    </div>

    <button 
      onClick={onSelect}
      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2
      ${recommended 
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25' 
        : 'bg-white text-black hover:bg-gray-200'}
      `}
    >
      <Zap className="w-4 h-4" />
      Choose {title}
    </button>
  </div>
);

// --- Main Component ---

export default function App() {
  const [frames, setFrames] = useState(INITIAL_FRAMES);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(-1);
  const [currentStyle, setCurrentStyle] = useState(THEMES[0]);
  const [currentAnim, setCurrentAnim] = useState(ANIMATIONS[0]);
  const [selectedRatio, setSelectedRatio] = useState('9:16');
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  
  // UI State
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Timer Refs
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  // --- Logic ---

  const handleAddFrame = () => {
    const newId = frames.length > 0 ? Math.max(...frames.map(f => f.id)) + 1 : 1;
    setFrames([...frames, { id: newId, text: "", image: "", duration: 2.5 }]);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleUpdateFrame = (id, field, value) => {
    setFrames(frames.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleRemoveFrame = (id) => {
    if (frames.length <= 1) return;
    setFrames(frames.filter(f => f.id !== id));
  };

  const handleMoveFrame = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === frames.length - 1)) return;
    const newFrames = [...frames];
    const temp = newFrames[index];
    newFrames[index] = newFrames[index + direction];
    newFrames[index + direction] = temp;
    setFrames(newFrames);
  };

  const handlePlay = () => {
    if (frames.length === 0) return;
    setIsPlaying(true);
    setCurrentFrameIndex(0);
    triggerFrame(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentFrameIndex(-1);
    clearTimeout(timerRef.current);
  };

  const triggerFrame = (index) => {
    if (index >= frames.length) {
      handleStop();
      return;
    }
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const randomAnim = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
    setCurrentStyle(randomTheme);
    setCurrentAnim(randomAnim);
    setCurrentFrameIndex(index);
    const duration = frames[index].duration * 1000;
    timerRef.current = setTimeout(() => {
      triggerFrame(index + 1);
    }, duration);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSubscribe = (planName) => {
    setIsPricingOpen(false);
    showToast(`Gateway for ${planName} Plan is Coming Soon! 🚀`);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col relative">
      
      {/* --- Injected Styles --- */}
      <style>{`
        @keyframes stomp { 0% { transform: scale(3); opacity: 0; } 40% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slide-up { 0% { transform: translateY(50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes pop-in { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes rotate-in { 0% { transform: rotate(-90deg) scale(0.5); opacity: 0; } 100% { transform: rotate(0) scale(1); opacity: 1; } }
        @keyframes blur-in { 0% { filter: blur(20px); opacity: 0; transform: scale(1.5); } 100% { filter: blur(0); opacity: 1; transform: scale(1); } }
        .animate-stomp { animation: stomp 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards; }
        .animate-rotate-in { animation: rotate-in 0.5s ease-out forwards; }
        .animate-blur-in { animation: blur-in 0.5s ease-out forwards; }
        .word-hidden { opacity: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* --- Toast Notification --- */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
           <CreditCard className="w-4 h-4 text-purple-600" />
           {toast.message}
        </div>
      </div>

      {/* --- Pricing Modal --- */}
      {isPricingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPricingOpen(false)}></div>
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-3xl rounded-3xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                 <div className="bg-yellow-500 p-1.5 rounded-lg">
                    <Crown className="w-5 h-5 text-black fill-black" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold">Upgrade to Pro</h2>
                   <p className="text-xs text-gray-400">Unlock full potential & remove limits</p>
                 </div>
              </div>
              <button onClick={() => setIsPricingOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar">
              
              {/* Plan 1: Monthly */}
              <PricingCard 
                title="Creator Monthly" 
                price="400" 
                period="mo" 
                recommended={false}
                features={[
                  "Remove Watermark",
                  "1080p HD Exports",
                  "Access to 50+ Premium Fonts",
                  "Unlock all 12 Animation Styles",
                  "Priority Email Support"
                ]}
                onSelect={() => handleSubscribe('Creator Monthly')}
              />

              {/* Plan 2: Yearly */}
              <PricingCard 
                title="Empire Yearly" 
                price="700" 
                period="yr" 
                recommended={true}
                features={[
                  "Everything in Creator Monthly",
                  "4K Ultra HD Exports",
                  "AI Voiceover Generation (Unlimited)",
                  "Custom Brand Kit (Logos & Colors)",
                  "Early Access to Beta Features",
                  "Save ₹4,100 per year!"
                ]}
                onSelect={() => handleSubscribe('Empire Yearly')}
              />

            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" /> Secure payment via Razorpay / Stripe
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Header --- */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Video className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-wide">Reel<span className="text-purple-500">Maker</span></h1>
        </div>
        <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPricingOpen(true)}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-amber-900/40 flex items-center gap-1.5"
            >
               <Crown className="w-3.5 h-3.5 fill-white/20" />
               Get Pro
            </button>
           <button className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-lg shadow-purple-900/40">
             Export
           </button>
        </div>
      </header>

      {/* --- Main Workspace --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* LEFT: Editor */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4 order-2 lg:order-1">
          
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Layers className="w-4 h-4 text-purple-400" />
              Timeline & Assets
            </h2>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
              {frames.length} Scenes
            </span>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-20"
          >
            {frames.map((frame, index) => (
              <div 
                key={frame.id} 
                className={`
                  flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200
                  ${isPlaying && currentFrameIndex === index 
                    ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                    : 'bg-neutral-900 border-white/10 hover:border-white/20'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 items-center justify-center pt-1">
                    <button onClick={() => handleMoveFrame(index, -1)} disabled={index === 0} className="text-gray-600 hover:text-white disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-gray-500">
                      {index + 1}
                    </div>
                    <button onClick={() => handleMoveFrame(index, 1)} disabled={index === frames.length - 1} className="text-gray-600 hover:text-white disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
                  </div>

                  <textarea
                    value={frame.text}
                    onChange={(e) => handleUpdateFrame(frame.id, 'text', e.target.value)}
                    placeholder="Enter scene text..."
                    rows={2}
                    className="flex-1 bg-black/20 rounded-lg border border-white/5 p-2 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 outline-none resize-none"
                    disabled={isPlaying}
                  />

                  <button 
                    onClick={() => handleRemoveFrame(frame.id)}
                    className="p-2 text-gray-600 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all self-start shrink-0"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 pl-9">
                  <div className="flex-1 flex items-center gap-2 bg-black/20 rounded-md px-2 py-1.5 border border-white/5 focus-within:border-gray-500">
                    <ImageIcon className="w-3 h-3 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Image URL (Optional)" 
                      value={frame.image}
                      onChange={(e) => handleUpdateFrame(frame.id, 'image', e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full text-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 bg-black/20 rounded-md px-2 py-1.5 border border-white/5" title="Duration in Seconds">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <input 
                      type="range" 
                      min="0.5" 
                      max="10" 
                      step="0.5"
                      value={frame.duration}
                      onChange={(e) => handleUpdateFrame(frame.id, 'duration', parseFloat(e.target.value))}
                      className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-xs font-mono text-gray-400 w-6">{frame.duration}s</span>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={handleAddFrame}
              className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Scene
            </button>
          </div>

          {/* Controls */}
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 flex gap-4 items-center shadow-2xl z-10">
              <button 
                onClick={isPlaying ? handleStop : handlePlay}
                className={`
                  flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg
                  ${isPlaying 
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
                    : 'bg-white text-black hover:bg-gray-200 shadow-white/10'}
                `}
              >
                {isPlaying ? <><Pause className="w-5 h-5" /> Stop</> : <><Play className="w-5 h-5 fill-current" /> Play Preview</>}
              </button>
              
              <button 
                onClick={() => setIsMusicEnabled(!isMusicEnabled)}
                className={`h-12 w-12 flex items-center justify-center rounded-xl transition-colors border ${isMusicEnabled ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'}`}
                title="Toggle Music"
              >
                <Music className="w-5 h-5" />
              </button>

              <button 
                onClick={() => {
                  setFrames(INITIAL_FRAMES);
                  handleStop();
                }}
                className="h-12 w-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5"
                title="Reset to Default"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
          </div>
        </div>

        {/* RIGHT: Preview Area */}
        <div className="lg:col-span-7 h-full flex flex-col bg-neutral-900/50 rounded-3xl border border-white/5 p-4 lg:p-8 relative order-1 lg:order-2">
          
          <div className="flex justify-center mb-6">
            <div className="bg-black/40 backdrop-blur-sm p-1 rounded-full border border-white/10 flex gap-1">
              {Object.keys(ASPECT_RATIOS).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => !isPlaying && setSelectedRatio(ratio)}
                  disabled={isPlaying}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all
                    ${selectedRatio === ratio 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                    ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}
                  `}>
                  {ASPECT_RATIOS[ratio].icon}
                  {ASPECT_RATIOS[ratio].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className={`
              relative w-full transition-all duration-500 ease-in-out bg-black rounded-[2rem] border-4 border-gray-800 shadow-2xl overflow-hidden flex flex-col
              ${ASPECT_RATIOS[selectedRatio].containerClass}
            `}>
              
              <div className={`
                  flex-1 w-full h-full flex items-center justify-center p-8 text-center transition-colors duration-300 relative
                  ${currentFrameIndex >= 0 && !frames[currentFrameIndex].image ? currentStyle.bg : 'bg-black'}
                `}
              >
                {currentFrameIndex >= 0 && frames[currentFrameIndex].image && (
                  <>
                    <img 
                      src={frames[currentFrameIndex].image} 
                      alt="Background" 
                      className="absolute inset-0 w-full h-full object-cover z-0" 
                    />
                    <div className="absolute inset-0 bg-black/60 z-0"></div>
                  </>
                )}

                {(!frames[currentFrameIndex]?.image) && (
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                )}

                {currentFrameIndex >= 0 ? (
                  <div key={currentFrameIndex} className="relative z-10 w-full break-words">
                    <h1 className={`font-black uppercase leading-tight tracking-tight ${currentStyle.text} drop-shadow-xl ${ASPECT_RATIOS[selectedRatio].textClass}`}>
                      {frames[currentFrameIndex].text.split(' ').map((word, idx) => (
                        <span 
                          key={idx} 
                          className={`
                            inline-block mr-2 lg:mr-3 word-hidden
                            ${idx % 2 !== 0 ? currentStyle.accent : ''} 
                            ${currentAnim}
                          `}
                          style={{ 
                            animationDelay: `${idx * 0.25}s` 
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </h1>
                  </div>
                ) : (
                  <div className="space-y-6 opacity-40">
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-600 flex items-center justify-center mx-auto animate-pulse">
                       <Type className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-500 font-medium">Ready to Render</p>
                  </div>
                )}
              </div>

              <div className="h-1 bg-white/20 w-full mt-auto absolute bottom-0 left-0 z-20">
                  {isPlaying && (
                    <div 
                      className="h-full bg-red-600 shadow-[0_0_10px_red] transition-all duration-300 ease-linear"
                      style={{ width: `${((currentFrameIndex + 1) / frames.length) * 100}%` }}
                    />
                  )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1"><Settings2 className="w-3 h-3" /> {selectedRatio} Mode</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Word-Sync</span>
            {isMusicEnabled && <span className="flex items-center gap-1 text-purple-400"><Music className="w-3 h-3" /> Audio On</span>}
          </div>

        </div>
      </main>
    </div>
  );
}