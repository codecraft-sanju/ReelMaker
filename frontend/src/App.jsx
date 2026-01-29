import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Plus, Trash2, Video, Smartphone, Monitor, Square, 
  Type, Layers, Image as ImageIcon, Clock, ArrowUp, ArrowDown, 
  Music, Crown, Check, X, Zap, LayoutTemplate, 
  ChevronLeft, Copy, AlignLeft, AlignCenter, AlignRight, Share2, Mic,
  Library, Sparkles, Eye, Move, RotateCw, Maximize
} from 'lucide-react';

// --- 1. ASSETS & CONSTANTS ---

const THEMES = [
  { id: 'midnight', name: 'Midnight', bg: 'bg-slate-900', text: 'text-white', accent: 'text-yellow-400', border: 'border-slate-700' },
  { id: 'lemonade', name: 'Lemon', bg: 'bg-yellow-400', text: 'text-black', accent: 'text-indigo-900', border: 'border-yellow-600' },
  { id: 'crimson', name: 'Crimson', bg: 'bg-red-600', text: 'text-white', accent: 'text-black', border: 'border-red-800' },
  { id: 'pitch', name: 'Pitch Black', bg: 'bg-black', text: 'text-white', accent: 'text-green-400', border: 'border-gray-800' },
  { id: 'clean', name: 'Clean White', bg: 'bg-white', text: 'text-black', accent: 'text-red-600', border: 'border-gray-300' },
  { id: 'royal', name: 'Royal', bg: 'bg-indigo-600', text: 'text-white', accent: 'text-pink-300', border: 'border-indigo-800' },
  { id: 'neon', name: 'Cyber Neon', bg: 'bg-cyan-400', text: 'text-black', accent: 'text-purple-800', border: 'border-cyan-600' },
];

const ANIMATIONS = [
  { id: 'animate-stomp', label: 'Stomp (Heavy)' },
  { id: 'animate-slide-up', label: 'Slide Up' },
  { id: 'animate-pop-in', label: 'Pop In' },
  { id: 'animate-rotate-in', label: 'Rotate In' },
  { id: 'animate-blur-in', label: 'Cinematic Blur' },
  { id: 'animate-fade', label: 'Slow Fade' }
];

const ASPECT_RATIOS = {
  '9:16': { label: 'Reel (9:16)', icon: <Smartphone size={14} />, containerClass: 'aspect-[9/16] h-[85vh] max-h-[700px] w-auto' },
  '16:9': { label: 'YouTube (16:9)', icon: <Monitor size={14} />, containerClass: 'aspect-video w-full max-w-[800px]' },
  '1:1': { label: 'Post (1:1)', icon: <Square size={14} />, containerClass: 'aspect-square h-[60vh] max-h-[600px] w-auto' }
};

// --- PRE-BUILT TEMPLATES ---
const PRO_TEMPLATES = [
  {
    id: 't1',
    name: 'Viral Motivation',
    description: 'Dark theme with heavy stomp animation. Perfect for aggressive quotes.',
    previewColor: 'bg-slate-900',
    frames: [
      { id: 101, text: "Stop Waiting.", image: "", duration: 1.5, theme: THEMES[0], animation: ANIMATIONS[0].id, align: 'center', aiVoice: false, layout: { x: 0, y: 0, scale: 1, rotation: 0 } },
      { id: 102, text: "No one is coming to save you.", image: "", duration: 3, theme: THEMES[0], animation: ANIMATIONS[0].id, align: 'center', aiVoice: true, layout: { x: 0, y: 0, scale: 1, rotation: 0 } },
      { id: 103, text: "BUILD IT YOURSELF.", image: "", duration: 2, theme: THEMES[2], animation: ANIMATIONS[0].id, align: 'center', aiVoice: true, layout: { x: 0, y: 0, scale: 1.5, rotation: 0 } }
    ]
  },
  {
    id: 't2',
    name: 'Clean Storytime',
    description: 'Minimalist white theme with smooth slides. Great for educational content.',
    previewColor: 'bg-white',
    frames: [
      { id: 201, text: "Here is a secret...", image: "", duration: 2, theme: THEMES[4], animation: ANIMATIONS[1].id, align: 'center', aiVoice: false, layout: { x: 0, y: 0, scale: 1, rotation: 0 } },
      { id: 202, text: "Most people fail because they quit too early.", image: "", duration: 3.5, theme: THEMES[4], animation: ANIMATIONS[5].id, align: 'center', aiVoice: true, layout: { x: 0, y: 0, scale: 1, rotation: 0 } },
      { id: 203, text: "Don't be most people.", image: "", duration: 2.5, theme: THEMES[4], animation: ANIMATIONS[1].id, align: 'center', aiVoice: true, layout: { x: 0, y: 0, scale: 1, rotation: 0 } }
    ]
  }
];

const INITIAL_FRAMES = PRO_TEMPLATES[0].frames;

// --- 2. HELPER FUNCTIONS ---

const getSmartFontSize = (textLength) => {
  if (textLength < 20) return 'text-5xl lg:text-7xl leading-tight font-black'; 
  if (textLength < 60) return 'text-3xl lg:text-5xl leading-snug font-bold';  
  if (textLength < 120) return 'text-xl lg:text-3xl leading-normal font-bold'; 
  return 'text-lg lg:text-2xl leading-relaxed font-medium'; 
};

const getAlignmentClass = (align) => {
  if (align === 'left') return 'text-left justify-start';
  if (align === 'right') return 'text-right justify-end';
  return 'text-center justify-center';
};

// --- 3. SUB-COMPONENTS ---

const PricingCard = ({ title, price, period, features, recommended, onSelect }) => (
  <div className={`relative p-6 rounded-2xl border flex flex-col h-full ${recommended ? 'bg-gradient-to-b from-purple-900/40 to-black border-purple-500/50 shadow-2xl shadow-purple-900/20' : 'bg-neutral-900/50 border-white/10'}`}>
    {recommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-lg">Best Value</div>}
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
          <Check className={`w-3.5 h-3.5 mt-0.5 ${recommended ? 'text-purple-400' : 'text-gray-500'}`} />
          <span className="text-sm text-gray-300 leading-snug">{feat}</span>
        </div>
      ))}
    </div>
    <button onClick={onSelect} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${recommended ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
      Choose {title}
    </button>
  </div>
);

// --- TRANSFORMABLE TEXT COMPONENT ---
const TransformableText = ({ 
  text, theme, animation, align, layout, isSelected, onSelect, onUpdateLayout, isPlaying 
}) => {
  const boxRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const isDragging = useRef(false);
  const isRotating = useRef(false);
  const isScaling = useRef(false);

  const handleStart = (clientX, clientY, type) => {
    if (isPlaying) return;
    onSelect();
    
    if (type === 'drag') {
        isDragging.current = true;
        dragStart.current = { x: clientX, y: clientY, startX: layout.x, startY: layout.y };
    } else if (type === 'rotate') {
        isRotating.current = true;
        dragStart.current = { x: clientX, y: clientY, startRotation: layout.rotation };
    } else if (type === 'scale') {
        isScaling.current = true;
        dragStart.current = { x: clientX, y: clientY, startScale: layout.scale };
    }
  };

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging.current && !isRotating.current && !isScaling.current) return;

      if (isDragging.current) {
        const dx = clientX - dragStart.current.x;
        const dy = clientY - dragStart.current.y;
        onUpdateLayout({ x: dragStart.current.startX + dx, y: dragStart.current.startY + dy });
      }

      if (isRotating.current) {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
        onUpdateLayout({ rotation: angle + 90 }); 
      }

      if (isScaling.current) {
         const dy = clientY - dragStart.current.y;
         const newScale = Math.max(0.2, dragStart.current.startScale + (dy * 0.01));
         onUpdateLayout({ scale: newScale });
      }
    };

    const handleEnd = () => {
      isDragging.current = false;
      isRotating.current = false;
      isScaling.current = false;
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
        if (isDragging.current || isRotating.current || isScaling.current) {
            // Handled by style touch-action: none
        }
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    if (isSelected) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isSelected, layout, onUpdateLayout]);

  const smartSize = getSmartFontSize(text.length);

  return (
    <div 
      ref={boxRef}
      className={`absolute z-20 cursor-move select-none flex items-center justify-center w-full px-8 touch-none`}
      style={{ 
        transform: `translate(${layout.x}px, ${layout.y}px) rotate(${layout.rotation}deg) scale(${layout.scale})`,
        transformOrigin: 'center center'
      }}
      onMouseDown={(e) => { e.stopPropagation(); handleStart(e.clientX, e.clientY, 'drag'); }}
      onTouchStart={(e) => { e.stopPropagation(); handleStart(e.touches[0].clientX, e.touches[0].clientY, 'drag'); }}
    >
      <div className={`relative group transition-all duration-200 ${isSelected && !isPlaying ? 'ring-2 ring-purple-500/80 bg-black/30 rounded-lg p-4' : 'p-2'}`}>
        
        {/* TEXT CONTENT */}
        <div className={`${theme.text} drop-shadow-xl ${smartSize} text-center ${getAlignmentClass(align)} pointer-events-none`}>
           {text.split(' ').map((word, i) => (
             <span key={i} className={`inline-block ${isPlaying ? 'word-hidden' : ''} ${i % 2 !== 0 ? theme.accent : ''} ${animation}`} style={{ animationDelay: isPlaying ? `${i * 0.25}s` : '0s' }}>{word}&nbsp;</span>
           ))}
        </div>

        {/* CONTROLS (Only visible when selected & not playing) */}
        {isSelected && !isPlaying && (
          <>
            <div 
              onMouseDown={(e) => { e.stopPropagation(); handleStart(e.clientX, e.clientY, 'rotate'); }}
              onTouchStart={(e) => { e.stopPropagation(); handleStart(e.touches[0].clientX, e.touches[0].clientY, 'rotate'); }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center cursor-ew-resize shadow-lg hover:bg-purple-100 active:scale-95 transition-transform z-30"
            >
              <RotateCw size={14} strokeWidth={3} />
            </div>

            <div 
              onMouseDown={(e) => { e.stopPropagation(); handleStart(e.clientX, e.clientY, 'scale'); }}
              onTouchStart={(e) => { e.stopPropagation(); handleStart(e.touches[0].clientX, e.touches[0].clientY, 'scale'); }}
              className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center cursor-nwse-resize shadow-lg hover:bg-purple-500 active:scale-95 transition-transform z-30"
            >
               <Maximize size={14} strokeWidth={3} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- 4. PREVIEW MODAL COMPONENT ---

const TemplatePreviewModal = ({ template, onClose, onUse }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!template) return;
    const duration = template.frames[idx].duration * 1000;
    const timer = setTimeout(() => {
      setIdx((prev) => (prev + 1) % template.frames.length); 
    }, duration);
    return () => clearTimeout(timer);
  }, [idx, template]);

  if (!template) return null;

  const frame = template.frames[idx];
  const smartSize = getSmartFontSize(frame.text.length);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div>
            <h3 className="font-bold text-white">{template.name}</h3>
            <p className="text-xs text-gray-400">Previewing..</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={16} /></button>
        </div>

        <div className="flex-1 relative aspect-[9/16] w-full bg-black overflow-hidden">
             <div className={`w-full h-full flex flex-col justify-center p-6 relative transition-colors duration-300 ${frame.theme.bg} ${getAlignmentClass(frame.align)}`}>
                  {frame.image && <><img src={frame.image} className="absolute inset-0 w-full h-full object-cover z-0" alt="bg"/><div className="absolute inset-0 bg-black/60 z-0"></div></>}
                  {!frame.image && <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>}

                  <div 
                    className={`relative z-10 w-full break-words px-2 flex flex-wrap gap-x-2 gap-y-1 justify-center`}
                    style={{ transform: `scale(${frame.layout?.scale || 1}) rotate(${frame.layout?.rotation || 0}deg)`}}
                  >
                    <div className={`${frame.theme.text} drop-shadow-xl ${smartSize} text-center`}>
                      {frame.text.split(' ').map((word, i) => (
                        <span key={i} className={`inline-block word-hidden ${i % 2 !== 0 ? frame.theme.accent : ''} ${frame.animation}`} style={{ animationDelay: `${i * 0.25}s` }}>{word}&nbsp;</span>
                      ))}
                    </div>
                  </div>
             </div>
             {/* Simple CSS animation for preview modal (Modal doesn't need complex engine) */}
             <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${((idx + 1) / template.frames.length) * 100}%` }}></div>
             </div>
        </div>

        <div className="p-4 bg-neutral-900 border-t border-white/10 grid grid-cols-2 gap-3">
           <button onClick={onClose} className="py-3 rounded-xl border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/5">Close</button>
           <button onClick={() => onUse(template)} className="py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-900/20">Use Template</button>
        </div>
      </div>
    </div>
  );
};

// --- 5. MAIN APP ---

export default function App() {
  const [frames, setFrames] = useState(INITIAL_FRAMES);
  const [mode, setMode] = useState('simple'); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0); 
  const [selectedRatio, setSelectedRatio] = useState('9:16');
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('theme'); 
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [selectedElementId, setSelectedElementId] = useState(null); 

  // REFS FOR SMOOTH PLAYBACK
  const requestRef = useRef();
  const startTimeRef = useRef(0);
  const progressBarRef = useRef(null);
  const scrollRef = useRef(null);
  const previewRef = useRef(null);

  // --- PLAYBACK ENGINE (TIME BASED) ---
  const getTotalDuration = () => frames.reduce((total, frame) => total + (frame.duration * 1000), 0);

  const animate = (time) => {
    // Calculate how much time has passed since play started
    const elapsed = Date.now() - startTimeRef.current;
    const totalDuration = getTotalDuration();

    // 1. Update Progress Bar Directly (Super Smooth)
    const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
    if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progressPercent}%`;
    }

    // 2. Determine Which Frame Should Be Active
    let accumulatedTime = 0;
    let foundIndex = -1;

    for (let i = 0; i < frames.length; i++) {
        const frameDuration = frames[i].duration * 1000;
        if (elapsed >= accumulatedTime && elapsed < accumulatedTime + frameDuration) {
            foundIndex = i;
            break;
        }
        accumulatedTime += frameDuration;
    }

    // 3. Handle End of Video
    if (elapsed >= totalDuration) {
        handleStop();
        setCurrentFrameIndex(frames.length - 1); // Stay on last frame
        if (progressBarRef.current) progressBarRef.current.style.width = `100%`;
        return; 
    }

    // 4. Update State only if Frame Changed (Performance Optimization)
    if (foundIndex !== -1 && foundIndex !== currentFrameIndex) {
        setCurrentFrameIndex(foundIndex);
    }

    // Loop
    requestRef.current = requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    if (frames.length === 0) return;
    setIsPlaying(true);
    setSelectedElementId(null);
    
    // Start from beginning or calculate resume (simplifying to start from 0 for smoothness)
    setCurrentFrameIndex(0); 
    startTimeRef.current = Date.now();
    
    if (mode === 'simple' && window.innerWidth < 1024 && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleStop = () => {
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
    // Reset bar width visually but keep current frame
    if (progressBarRef.current) progressBarRef.current.style.width = `0%`; 
  };
  
  const togglePlay = () => isPlaying ? handleStop() : handlePlay();

  // --- EXISTING HANDLERS ---
  const handleAddFrame = () => {
    const newId = Date.now();
    const lastFrame = frames[frames.length - 1];
    setFrames([...frames, { 
      id: newId, text: "", image: "", duration: 2.5,
      theme: lastFrame ? lastFrame.theme : THEMES[0],
      animation: lastFrame ? lastFrame.animation : ANIMATIONS[0].id,
      align: lastFrame ? lastFrame.align : 'center',
      aiVoice: false, layout: { x: 0, y: 0, scale: 1, rotation: 0 }
    }]);
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 100);
  };

  const handleUpdateFrame = (id, field, value) => {
    setFrames(frames.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  const handleUpdateLayout = (id, newLayoutProps) => {
      setFrames(frames.map(f => f.id === id ? { ...f, layout: { ...f.layout, ...newLayoutProps } } : f));
  };
  const handleRemoveFrame = (id) => {
    if (frames.length <= 1) return;
    setFrames(frames.filter(f => f.id !== id));
    if (currentFrameIndex >= frames.length - 1) setCurrentFrameIndex(Math.max(0, frames.length - 2));
  };
  const handleDuplicateFrame = (id) => {
    const frameToCopy = frames.find(f => f.id === id);
    if (!frameToCopy) return;
    const newFrame = { ...frameToCopy, id: Date.now() };
    const index = frames.findIndex(f => f.id === id);
    const newFrames = [...frames];
    newFrames.splice(index + 1, 0, newFrame);
    setFrames(newFrames);
  };
  const handleMoveFrame = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === frames.length - 1)) return;
    const newFrames = [...frames];
    const temp = newFrames[index];
    newFrames[index] = newFrames[index + direction];
    newFrames[index + direction] = temp;
    setFrames(newFrames);
  };
  const handleApplyTemplate = (template) => {
    const newFrames = template.frames.map(f => ({...f, id: Date.now() + Math.random()}));
    setFrames(newFrames);
    setMode('simple'); 
    setPreviewTemplate(null);
    showToast(`Applied ${template.name} Template!`);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setIsExporting(false); showToast("Video Saved to Gallery! 📸"); }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 100);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  useEffect(() => { return () => cancelAnimationFrame(requestRef.current); }, []);

  const activeFrame = frames[currentFrameIndex] || frames[0];
  const activeTheme = activeFrame?.theme || THEMES[0];
  const activeAnim = activeFrame?.animation || ANIMATIONS[0].id;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col relative" onClick={() => setSelectedElementId(null)}>
      
      <style>{`
        @keyframes stomp { 0% { transform: scale(3); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slide-up { 0% { transform: translateY(40px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes pop-in { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes rotate-in { 0% { transform: rotate(-180deg) scale(0); opacity: 0; } 100% { transform: rotate(0) scale(1); opacity: 1; } }
        @keyframes blur-in { 0% { filter: blur(20px); opacity: 0; transform: scale(1.2); } 100% { filter: blur(0); opacity: 1; transform: scale(1); } }
        
        .animate-stomp { animation: stomp 0.5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-rotate-in { animation: rotate-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-blur-in { animation: blur-in 0.7s ease-out forwards; }
        
        .word-hidden { opacity: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
          onUse={handleApplyTemplate} 
        />
      )}

      {/* Export Progress Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
           <div className="w-64 space-y-4 text-center">
              <div className="relative w-20 h-20 mx-auto">
                 <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">{exportProgress}%</div>
              </div>
              <div>
                 <h3 className="text-xl font-bold">Rendering Video...</h3>
                 <p className="text-gray-400 text-sm">Optimizing {frames.length} scenes</p>
              </div>
           </div>
        </div>
      )}

      {/* Pricing Modal */}
      {isPricingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPricingOpen(false)}></div>
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-3xl rounded-3xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500" /> Upgrade to Pro</h2>
              <button onClick={() => setIsPricingOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar">
              <PricingCard title="Creator" price="400" period="mo" recommended={false} features={["No Watermark", "HD Export"]} onSelect={() => {setIsPricingOpen(false); showToast("Plan Selected")}} />
              <PricingCard title="Empire" price="700" period="yr" recommended={true} features={["4K Export", "AI Tools"]} onSelect={() => {setIsPricingOpen(false); showToast("Plan Selected")}} />
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
           <Zap className="w-4 h-4 text-purple-600" /> {toast.message}
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {mode !== 'simple' ? (
             <button onClick={() => { setMode('simple'); setIsPlaying(false); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
             </button>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Video className="w-4 h-4 text-white" />
            </div>
          )}
          <h1 className="text-lg font-bold tracking-wide">
            {mode === 'simple' ? <span>Reel<span className="text-purple-500">Maker</span></span> : mode === 'custom' ? 'Custom Studio' : 'Templates'}
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setMode('templates')} className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === 'templates' ? 'bg-white text-black' : 'hover:bg-white/10 text-gray-300'}`}>
                <Library className="w-3.5 h-3.5" /> Templates
            </button>
            <button onClick={() => setIsPricingOpen(true)} className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5">
               <Crown className="w-3.5 h-3.5 fill-white/20" /> Pro
            </button>
           <button onClick={handleExport} className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-lg shadow-purple-900/40 flex items-center gap-2">
             Export <Share2 size={12}/>
           </button>
        </div>
      </header>

      {/* --- CONTENT AREA: SWITCHES BASED ON MODE --- */}
      
      {/* 1. SIMPLE MODE */}
      {mode === 'simple' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 overflow-hidden lg:h-[calc(100vh-64px)] h-auto">
          
          <div className="lg:col-span-5 flex flex-col h-[600px] lg:h-full gap-4 order-2 lg:order-1">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Layers className="w-4 h-4 text-purple-400" /> Script Timeline
              </h2>
              <div className="flex items-center gap-2">
                 <button onClick={() => setMode('templates')} className="md:hidden text-xs bg-white/5 px-2 py-1 rounded hover:bg-white/10">Templates</button>
                 <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">{frames.length} Scenes</span>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-24">
              {frames.map((frame, index) => (
                <div key={frame.id} 
                  onClick={() => setCurrentFrameIndex(index)}
                  className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${currentFrameIndex === index ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20' : 'bg-neutral-900 border-white/10 hover:border-white/20'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 items-center justify-center pt-1">
                      <button onClick={(e) => { e.stopPropagation(); handleMoveFrame(index, -1); }} disabled={index === 0} className="text-gray-600 hover:text-white disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-gray-500">{index + 1}</div>
                      <button onClick={(e) => { e.stopPropagation(); handleMoveFrame(index, 1); }} disabled={index === frames.length - 1} className="text-gray-600 hover:text-white disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
                    </div>
                    <textarea value={frame.text} onChange={(e) => handleUpdateFrame(frame.id, 'text', e.target.value)} placeholder="Enter scene text..." rows={2} className="flex-1 bg-black/20 rounded-lg border border-white/5 p-2 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 outline-none resize-none" disabled={isPlaying} />
                    <div className="flex flex-col gap-1">
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveFrame(frame.id); }} className="p-2 text-gray-600 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDuplicateFrame(frame.id); }} className="p-2 text-gray-600 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-all" title="Duplicate"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-9">
                    <div className="flex-1 flex items-center gap-2 bg-black/20 rounded-md px-2 py-1.5 border border-white/5 focus-within:border-gray-500">
                      <ImageIcon className="w-3 h-3 text-gray-500" />
                      <input type="text" placeholder="Image URL (Optional)" value={frame.image} onChange={(e) => handleUpdateFrame(frame.id, 'image', e.target.value)} className="bg-transparent border-none outline-none text-xs w-full text-gray-300" />
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 rounded-md px-2 py-1.5 border border-white/5">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <input type="range" min="0.5" max="10" step="0.5" value={frame.duration} onChange={(e) => handleUpdateFrame(frame.id, 'duration', parseFloat(e.target.value))} className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                      <span className="text-xs font-mono text-gray-400 w-6">{frame.duration}s</span>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={handleAddFrame} className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> Add Scene
              </button>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 flex gap-3 items-center shadow-2xl z-10 sticky bottom-0 lg:static">
              <button onClick={togglePlay} className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${isPlaying ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-black hover:bg-gray-200'}`}>
                {isPlaying ? <><Pause className="w-5 h-5" /> Stop</> : <><Play className="w-5 h-5 fill-current" /> Play Preview</>}
              </button>
              <button onClick={() => setIsMusicEnabled(!isMusicEnabled)} className={`h-12 w-12 flex items-center justify-center rounded-xl transition-colors border ${isMusicEnabled ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'}`}>
                <Music className="w-5 h-5" />
              </button>
              <button onClick={() => { handleStop(); setMode('custom'); setCurrentFrameIndex(0); }} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all border border-white/10 transform active:scale-95">
                 <LayoutTemplate className="w-4 h-4" /> Customize Reel
              </button>
            </div>
          </div>

          <div ref={previewRef} className="lg:col-span-7 h-auto min-h-[500px] lg:h-full flex flex-col bg-neutral-900/50 rounded-3xl border border-white/5 p-4 lg:p-8 relative order-1 lg:order-2 scroll-mt-20">
              <div className="flex justify-center mb-6">
                <div className="bg-black/40 backdrop-blur-sm p-1 rounded-full border border-white/10 flex gap-1">
                  {Object.keys(ASPECT_RATIOS).map((ratio) => (
                    <button key={ratio} onClick={() => !isPlaying && setSelectedRatio(ratio)} disabled={isPlaying} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedRatio === ratio ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'} ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {ASPECT_RATIOS[ratio].icon} {ASPECT_RATIOS[ratio].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div className={`relative transition-all duration-500 ease-in-out bg-black rounded-[2rem] border-4 border-gray-800 shadow-2xl overflow-hidden flex flex-col ${ASPECT_RATIOS[selectedRatio].containerClass} ${isPlaying ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}`}>
                  <div className={`flex-1 w-full h-full flex flex-col items-center justify-center relative transition-colors duration-300 ${activeFrame.image ? 'bg-black' : activeTheme.bg} ${getAlignmentClass(activeFrame.align)}`}>
                    
                    {activeFrame.image && <><img src={activeFrame.image} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" /><div className="absolute inset-0 bg-black/60 z-0"></div></>}
                    
                    {!activeFrame.image && <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>}
                    
                    {currentFrameIndex >= 0 ? (
                      <TransformableText 
                        text={activeFrame.text}
                        theme={activeTheme}
                        animation={activeAnim}
                        align={activeFrame.align}
                        layout={activeFrame.layout || { x: 0, y: 0, scale: 1, rotation: 0 }}
                        isSelected={selectedElementId === activeFrame.id}
                        onSelect={() => setSelectedElementId(activeFrame.id)}
                        onUpdateLayout={(newLayout) => handleUpdateLayout(activeFrame.id, newLayout)}
                        isPlaying={isPlaying}
                      />
                    ) : (
                      <div className="space-y-6 opacity-40 w-full text-center">
                          <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-600 flex items-center justify-center mx-auto animate-pulse"><Type className="w-10 h-10 text-gray-500" /></div>
                          <p className="text-gray-500 font-medium">Tap here or Play below</p>
                      </div>
                    )}
                  </div>
                  {/* SMOOTH PROGRESS BAR (Ref based) */}
                  <div className="h-1 bg-white/20 w-full mt-auto absolute bottom-0 left-0 z-20">
                      <div ref={progressBarRef} className="h-full bg-red-600 shadow-[0_0_10px_red] w-0"></div>
                  </div>
                </div>
              </div>
          </div>
        </main>
      )}

      {/* 2. CUSTOM STUDIO MODE (FIXED) */}
      {mode === 'custom' && (
        <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
           
           {/* Top Section: Preview Area */}
           <div className="flex-1 bg-[#121212] relative flex flex-col items-center justify-center p-4 min-h-0">
             
              <div className="absolute top-4 z-40 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/10 flex gap-2">
                  <button onClick={togglePlay} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isPlaying ? 'bg-red-500 text-white' : 'bg-white text-black'}`}>
                     {isPlaying ? <Pause size={12}/> : <Play size={12}/>} {isPlaying ? 'Stop' : 'Play'}
                  </button>
                  <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>
                   {Object.keys(ASPECT_RATIOS).map((ratio) => (
                    <button key={ratio} onClick={() => !isPlaying && setSelectedRatio(ratio)} className={`p-2 rounded-full transition-all ${selectedRatio === ratio ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}>
                      {ASPECT_RATIOS[ratio].icon}
                    </button>
                  ))}
              </div>

             <div className={`relative shadow-2xl transition-all duration-300 bg-black rounded-lg overflow-hidden border border-white/10 ${ASPECT_RATIOS[selectedRatio].containerClass} ring-1 ring-white/10 shrink-0`}>
                 <div className={`w-full h-full flex flex-col justify-center relative ${activeFrame.image ? 'bg-black' : activeTheme.bg} ${getAlignmentClass(activeFrame.align)}`}>
                    
                    {activeFrame.image && <><img src={activeFrame.image} className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50" /></>}
                    {!activeFrame.image && <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>}
                    
                    <TransformableText 
                        text={activeFrame.text}
                        theme={activeTheme}
                        animation={activeAnim}
                        align={activeFrame.align}
                        layout={activeFrame.layout || { x: 0, y: 0, scale: 1, rotation: 0 }}
                        isSelected={selectedElementId === activeFrame.id}
                        onSelect={() => setSelectedElementId(activeFrame.id)}
                        onUpdateLayout={(newLayout) => handleUpdateLayout(activeFrame.id, newLayout)}
                        isPlaying={isPlaying}
                      />
                 </div>
                 
                 {/* SMOOTH PROGRESS BAR (Ref based) */}
                 <div className="h-1 bg-white/20 w-full mt-auto absolute bottom-0 left-0 z-20">
                    <div ref={progressBarRef} className="h-full bg-red-600 shadow-[0_0_10px_red] w-0"></div>
                 </div>

                 {!isPlaying && <div className="absolute inset-x-4 inset-y-12 border border-dashed border-white/10 rounded-lg pointer-events-none"></div>}
             </div>
             
             {!isPlaying && (
                <div className="mt-4 bg-black/80 backdrop-blur px-4 py-2 rounded-full text-xs text-gray-400 border border-white/10 flex items-center gap-2">
                   <Move size={12}/> Drag to Move <Maximize size={12} className="ml-2"/> Corner to Scale <RotateCw size={12} className="ml-2"/> Top to Rotate
                </div>
             )}
           </div>

           {/* Bottom Section: Editor Controls */}
           <div className="h-[45vh] bg-[#0f0f0f] border-t border-white/10 flex flex-col z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="h-20 border-b border-white/5 flex items-center px-4 gap-3 overflow-x-auto custom-scrollbar bg-[#050505] shrink-0">
                 {frames.map((frame, idx) => (
                   <button key={frame.id} onClick={() => { setIsPlaying(false); setCurrentFrameIndex(idx); }} className={`relative h-14 min-w-[90px] rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden shrink-0 group ${currentFrameIndex === idx ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'}`}>
                     <div className={`absolute inset-0 opacity-50 ${frame.theme.bg}`}></div>
                     {frame.image && <img src={frame.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                     <span className="relative z-10 text-[10px] font-bold truncate max-w-[90%] px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm text-white">{idx + 1}. {frame.text.substring(0,6)}..</span>
                   </button>
                 ))}
                 <button onClick={handleAddFrame} className="h-12 w-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-gray-500 hover:text-white shrink-0 hover:bg-white/5 transition-all"><Plus size={20} /></button>
              </div>

              <div className="flex-1 flex flex-col p-2 lg:p-4 overflow-hidden">
                 <div className="flex justify-center mb-4 shrink-0">
                   <div className="flex bg-neutral-900 rounded-full p-1 border border-white/10 shadow-lg">
                      {['theme', 'text', 'image', 'anim'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-full text-xs font-bold transition-all capitalize ${activeTab === t ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}>
                          {t === 'anim' ? 'Animation' : t}
                        </button>
                      ))}
                   </div>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                    <div className="max-w-4xl mx-auto">
                      {activeTab === 'theme' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {THEMES.map(t => (
                              <button key={t.id} onClick={() => handleUpdateFrame(activeFrame.id, 'theme', t)} className={`p-3 h-24 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-end ${activeFrame.theme.id === t.id ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105' : 'border-white/10 hover:border-white/30'}`}>
                                <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity ${t.bg}`}></div>
                                <span className="relative z-10 text-xs font-bold shadow-black drop-shadow-md">{t.name}</span>
                                {activeFrame.theme.id === t.id && <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-0.5"><Check className="w-2.5 h-2.5 text-white" /></div>}
                              </button>
                            ))}
                        </div>
                      )}

                      {activeTab === 'text' && (
                          <div className="space-y-4 max-w-2xl mx-auto">
                            <textarea 
                               value={activeFrame.text} 
                               onChange={(e) => handleUpdateFrame(activeFrame.id, 'text', e.target.value)}
                               className="w-full bg-neutral-900 rounded-xl p-4 text-base border border-white/10 focus:border-purple-500 outline-none resize-none shadow-inner"
                               rows={2}
                               placeholder="Type your script here..."
                             />
                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-neutral-900 p-3 rounded-xl border border-white/10 flex items-center justify-center">
                                   <div className="text-xs text-gray-400 text-center">Font Size: <span className="text-white font-bold ml-1">Auto Scale</span></div>
                                </div>
                                <div className="bg-neutral-900 p-3 rounded-xl border border-white/10">
                                   <label className="text-[10px] text-gray-500 font-bold mb-2 block uppercase tracking-wider">Alignment</label>
                                   <div className="flex gap-1">
                                      {['left', 'center', 'right'].map(align => (
                                          <button key={align} onClick={() => handleUpdateFrame(activeFrame.id, 'align', align)} className={`flex-1 py-1.5 rounded border flex items-center justify-center transition-colors ${activeFrame.align === align ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/10 text-gray-400 hover:text-white'}`}>
                                              {align === 'left' && <AlignLeft size={14}/>}
                                              {align === 'center' && <AlignCenter size={14}/>}
                                              {align === 'right' && <AlignRight size={14}/>}
                                          </button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                             <div className="flex gap-4">
                               <button onClick={() => handleUpdateFrame(activeFrame.id, 'layout', { x: 0, y: 0, scale: 1, rotation: 0 })} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 border border-white/5">Reset Position</button>
                               <button 
                                 onClick={() => handleUpdateFrame(activeFrame.id, 'aiVoice', !activeFrame.aiVoice)}
                                 className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${activeFrame.aiVoice ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                               >
                                  <Mic size={12} /> {activeFrame.aiVoice ? 'Voiceover Active' : 'Add Voiceover'}
                               </button>
                             </div>
                          </div>
                      )}

                      {activeTab === 'anim' && (
                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {ANIMATIONS.map(a => (
                              <button key={a.id} onClick={() => handleUpdateFrame(activeFrame.id, 'animation', a.id)} className={`p-4 rounded-xl border text-sm flex flex-col items-center justify-center gap-2 transition-all ${activeFrame.animation === a.id ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-neutral-900 border-white/10 text-gray-400 hover:bg-neutral-800'}`}>
                                <Zap size={18} className={activeFrame.animation === a.id ? 'text-purple-400' : 'text-gray-600'} /> 
                                <span className="text-xs font-medium text-center">{a.label}</span>
                              </button>
                            ))}
                         </div>
                      )}

                      {activeTab === 'image' && (
                        <div className="space-y-4 max-w-lg mx-auto">
                            <div className="bg-neutral-900 p-4 rounded-xl border border-white/10">
                               <label className="text-xs text-gray-500 font-bold mb-3 block uppercase">Background Image URL</label>
                               <div className="flex gap-2">
                                 <input type="text" value={activeFrame.image} onChange={(e) => handleUpdateFrame(activeFrame.id, 'image', e.target.value)} placeholder="https://..." className="flex-1 bg-black rounded px-3 py-2 text-sm border border-white/10 focus:border-purple-500 outline-none" />
                                 {activeFrame.image && <button onClick={() => handleUpdateFrame(activeFrame.id, 'image', '')} className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>}
                               </div>
                               <p className="text-[10px] text-gray-600 mt-2">Paste a direct link to an image (Unsplash, etc.)</p>
                            </div>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 3. TEMPLATES PAGE */}
      {mode === 'templates' && (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                 <h2 className="text-3xl lg:text-4xl font-black mb-3">Reel Templates</h2>
                 <p className="text-gray-400">Jumpstart your viral journey with our pro-designed sets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                 {PRO_TEMPLATES.map(template => (
                   <div key={template.id} onClick={() => setPreviewTemplate(template)} className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:scale-[1.02] cursor-pointer group shadow-xl">
                      <div className={`h-40 ${template.previewColor} relative flex items-center justify-center`}>
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm gap-2">
                            <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform scale-90 group-hover:scale-100 transition-transform flex items-center gap-2">
                               <Eye className="w-4 h-4"/> Preview
                            </span>
                         </div>
                         <div className="text-4xl font-black text-white/20 uppercase tracking-widest">{template.name.split(' ')[0]}</div>
                      </div>
                      <div className="p-5">
                         <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                         <p className="text-xs text-gray-400 mb-4 h-8 leading-relaxed line-clamp-2">{template.description}</p>
                         <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                            <span className="bg-white/5 px-2 py-1 rounded">{template.frames.length} Scenes</span>
                            <span className="bg-white/5 px-2 py-1 rounded text-purple-400 flex items-center gap-1"><Sparkles size={10}/> Pro Style</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}