import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Plus, Trash2, Video, 
  Check, X, Zap, Share2, Music, Crown, 
  ArrowUp, ArrowDown, Clock, Edit3, 
  Move, Palette, Type, 
  MousePointer2, RefreshCcw,
  GripHorizontal, CircleDashed, Layers,
  Layout, Type as TypeIcon, Image as ImageIcon, Film,
  Sparkles, Settings // Added Settings icon
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

const DECORATIONS = [
  { id: 'none', name: 'None', type: 'none' },
  
  // Mascots (GIFs)
  { 
    id: 'cat-walk', 
    name: 'Walking Cat', 
    type: 'image', 
    src: './cat.gif', 
    animation: 'animate-walk', 
    duration: '6s', // Default for scene, overridden for global
    width: '80px' 
  },
  { 
    id: 'duck-run', 
    name: 'Running Duck', 
    type: 'image', 
    src: './duct.gif', 
    animation: 'animate-walk', 
    duration: '4s',
    width: '60px'
  },
  { 
    id: 'robot-dance', 
    name: 'Dancing Robot', 
    type: 'image', 
    src: './dancingrobot.gif', 
    animation: 'animate-bounce', 
    duration: '2s', 
    width: '70px'
  },

  // UI & Backgrounds
  { id: 'progress-top', name: 'Top Bar', type: 'ui' },
  { id: 'particles', name: 'Floating Dust', type: 'bg' },
  { id: 'spotlight', name: 'Spotlight', type: 'bg' },
];

const PRESET_COLORS = [
    '#FFFFFF', '#000000', '#FACC15', '#EF4444', 
    '#22C55E', '#3B82F6', '#A855F7', '#EC4899'
];

const FONTS = [
  { name: 'Default', family: 'inherit' },
  { name: 'Impact', family: '"Anton", sans-serif' },
  { name: 'Hand', family: '"Pacifico", cursive' },
  { name: 'Serif', family: '"Playfair Display", serif' },
  { name: 'Mono', family: '"Courier Prime", monospace' },
  { name: 'Comic', family: '"Bangers", system-ui' },
];

const DEFAULT_SHADOW = { x: 0, y: 0, blur: 0, color: '#000000' };

// --- DEFAULT DATA ---
const INITIAL_FRAMES = [
  { 
    id: 101, 
    text: "POV: You found the ULTIMATE tool.", 
    duration: 3, 
    theme: THEMES[0], // Midnight
    animation: 'animate-blur-in', 
    align: 'center', 
    layout: { x: 0, y: 0, scale: 1, rotation: 0, fontSize: 55, shadow: { ...DEFAULT_SHADOW, y: 4, blur: 15 } }, 
    wordLayouts: {
      5: { color: '#FACC15', scale: 1.2, font: '"Anton", sans-serif', rotation: -5 } // Highlights "ULTIMATE"
    },
    decoration: 'none' 
  },
  { 
    id: 102, 
    text: "Make your content go VIRAL", 
    duration: 1.5, 
    theme: THEMES[6], // Neon
    animation: 'animate-stomp', 
    align: 'center', 
    layout: { x: 0, y: 0, scale: 1.1, rotation: -2, fontSize: 65, shadow: DEFAULT_SHADOW }, 
    wordLayouts: {
        4: { color: '#9333ea', font: '"Bangers", system-ui', scale: 1.4 } // Highlights "VIRAL"
    },
    decoration: 'none' 
  },
  { 
    id: 103, 
    text: "Even the robot is dancing!", 
    duration: 2.5, 
    theme: THEMES[1], // Lemonade
    animation: 'animate-slide-up', 
    align: 'center', 
    layout: { x: 0, y: -40, scale: 1, rotation: 0, fontSize: 45, shadow: DEFAULT_SHADOW }, 
    wordLayouts: {},
    decoration: 'none'
  },
  { 
    id: 104, 
    text: "START CREATING NOW", 
    duration: 3, 
    theme: THEMES[2], // Crimson
    animation: 'animate-pop-in', 
    align: 'center', 
    layout: { x: 0, y: 0, scale: 1.2, rotation: 0, fontSize: 60, shadow: DEFAULT_SHADOW }, 
    wordLayouts: { 
        0: { curve: -20, font: '"Anton", sans-serif' }, 
        1: { curve: -10, font: '"Anton", sans-serif' }, 
        2: { curve: 20, font: '"Anton", sans-serif' } 
    },
    decoration: 'spotlight'
  }
];

// --- 2. HELPER FUNCTIONS ---

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

// --- MODIFIED DECORATION LAYER TO HANDLE GLOBAL DURATION ---
const DecorationLayer = ({ type, duration, isPlaying, isGlobal = false }) => {
  const decor = DECORATIONS.find(d => d.id === type);
  if (!decor || decor.id === 'none') return null;

  // 1. IMAGE MASCOTS (GIFs) - Now syncs with total duration if global
  if (decor.type === 'image') {
    return (
      <div 
        className={`absolute bottom-0 z-20 ${decor.animation}`} 
        style={{ 
           // If global, duration is the full video length. If scene, it's scene length or default.
           animationDuration: isGlobal ? `${duration}s` : (decor.duration || `${duration}s`),
           // For global elements, we must control play state manually effectively
           animationPlayState: isPlaying ? 'running' : 'paused',
           animationTimingFunction: isGlobal ? 'linear' : 'ease-in-out',
           opacity: 1 
        }}
      >
        <img 
            src={decor.src} 
            alt="mascot" 
            style={{ width: decor.width || '60px', height: 'auto' }}
            className="pointer-events-none select-none"
        />
      </div>
    );
  }

  // 2. PROGRESS BAR
  if (decor.id === 'progress-top') {
    return (
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10 z-40">
        <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{ 
                width: isPlaying ? '100%' : '0%',
                // If global, bar fills over total duration.
                transition: isPlaying ? `width ${duration}s linear` : 'none'
            }}
        ></div>
      </div>
    );
  }

  // 3. PARTICLES
  if (decor.id === 'particles') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => {
             const size = Math.random() * 4 + 2; 
             const animDuration = Math.random() * 10 + 10;
             const delay = -(Math.random() * 20); 

             return (
               <div key={i} className="particle" style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   width: `${size}px`,
                   height: `${size}px`,
                   opacity: Math.random() * 0.5 + 0.3, 
                   animationDelay: `${delay}s`,
                   animationDuration: `${animDuration}s`,
                   filter: Math.random() > 0.6 ? 'blur(1px)' : 'none'
               }} />
             );
          })}
      </div>
    );
  }

  // 4. SPOTLIGHT
  if (decor.id === 'spotlight') {
      return (
          <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.9)_80%)]"></div>
      );
  }

  return null;
};

// --- TRANSFORMABLE TEXT COMPONENT ---
const TransformableText = ({ 
  text, theme, animation, align, layout, wordLayouts = {},
  isPlaying, activeTool, selectedWordIndex, onWordClick
}) => {
  const fontSize = layout.fontSize || 40;
  const words = text.split(' ').filter(w => w.trim());

  const sceneShadow = layout.shadow || DEFAULT_SHADOW;
  const sceneShadowStyle = sceneShadow.blur > 0 || sceneShadow.x !== 0 || sceneShadow.y !== 0 
    ? `${sceneShadow.x}px ${sceneShadow.y}px ${sceneShadow.blur}px ${sceneShadow.color}` 
    : 'none';

  return (
    <div className="flex items-center justify-center w-full h-full pointer-events-none">
      <div 
        className={`relative p-2 w-full transition-transform duration-75 ease-out`}
        style={{ 
            transform: `translate(${layout.x}px, ${layout.y}px) rotate(${layout.rotation}deg) scale(${layout.scale})`,
            transformOrigin: 'center center',
        }}
      >
        <div 
            className={`font-black ${getAlignmentClass(align)} select-none`}
            style={{ 
                fontSize: `${fontSize}px`, 
                lineHeight: 1.2,
                textShadow: sceneShadowStyle 
            }}
        >
          <div className={`flex flex-wrap gap-x-[0.3em] gap-y-1 w-full ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'}`}>
            {words.map((word, i) => {
                const wl = wordLayouts[i] || { x: 0, y: 0, scale: 1, rotation: 0, color: null, curve: 0, font: null, shadow: null };
                const isSelected = activeTool === 'word' && selectedWordIndex === i;
                const themeClass = i % 2 !== 0 ? theme.accent : theme.text;
                const wordCurve = wl.curve || 0;
                
                const fontFamily = wl.font || 'inherit';
                const wordShadow = wl.shadow; 
                const wordShadowStyle = wordShadow 
                    ? `${wordShadow.x}px ${wordShadow.y}px ${wordShadow.blur}px ${wordShadow.color}` 
                    : undefined;

                return (
                    <span 
                      key={i}
                      className={`inline-block relative break-words ${activeTool === 'word' ? 'pointer-events-auto cursor-pointer' : ''}`}
                      onPointerDown={(e) => onWordClick && onWordClick(e, i)}
                      style={{ 
                        transform: `translate(${wl.x}px, ${wl.y}px)`,
                        display: 'inline-block' 
                      }}
                    >
                      <span 
                        style={{
                            display: 'inline-block',
                            transform: `scale(${wl.scale || 1}) rotate(${wl.rotation || 0}deg)`
                        }}
                      >
                          {isSelected && (
                              <span className="absolute -inset-2 border-2 border-green-400 bg-green-400/20 rounded animate-pulse pointer-events-none z-0"></span>
                          )}
                          
                          <span className={`
                            inline-block relative z-10
                            ${!wl.color ? themeClass : ''} 
                            ${isPlaying ? 'word-hidden' : ''} 
                            ${isPlaying ? animation : ''}
                          `}
                          style={{
                            color: wl.color ? wl.color : undefined,
                            fontFamily: fontFamily, 
                            textShadow: wordShadowStyle,
                            animationDelay: isPlaying ? `${i * 0.15}s` : '0s',
                            animationFillMode: 'forwards'
                          }}>
                            {wordCurve !== 0 ? (
                                <span className="inline-block whitespace-nowrap">
                                    {word.split('').map((char, idx) => {
                                        const mid = (word.length - 1) / 2;
                                        const distFromCenter = Math.abs(idx - mid);
                                        const yOffset = distFromCenter * distFromCenter * (Math.abs(wordCurve) * 0.15); 
                                        const realY = wordCurve > 0 ? -yOffset : yOffset;
                                        const rotation = (idx - mid) * (wordCurve * 0.5);

                                        return (
                                            <span key={idx} style={{ 
                                                display: 'inline-block', 
                                                transform: `translateY(${realY}px) rotate(${rotation}deg)`,
                                                transformOrigin: 'bottom center'
                                            }}>
                                                {char}
                                            </span>
                                        );
                                    })}
                                </span>
                            ) : (
                                word
                            )}
                          </span>
                      </span>
                    </span>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SHADOW CONTROLS COMPONENT ---
const ShadowControls = ({ shadow, onChange, label = "Shadow" }) => {
    const s = shadow || DEFAULT_SHADOW;
    const update = (key, val) => onChange({ ...s, [key]: val });

    return (
        <div className="bg-white/5 rounded-lg p-3 space-y-3 border border-white/5">
            <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                    <Layers size={10} className="text-blue-400"/> {label}
                </label>
                <input 
                    type="color" 
                    value={s.color} 
                    onChange={(e) => update('color', e.target.value)} 
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-none p-0"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500"><span>X</span> <span>{s.x}</span></div>
                    <input type="range" min="-20" max="20" value={s.x} onChange={(e) => update('x', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none accent-blue-500"/>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500"><span>Y</span> <span>{s.y}</span></div>
                    <input type="range" min="-20" max="20" value={s.y} onChange={(e) => update('y', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none accent-blue-500"/>
                </div>
            </div>
             <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-500"><span>Blur</span> <span>{s.blur}px</span></div>
                <input type="range" min="0" max="30" value={s.blur} onChange={(e) => update('blur', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none accent-blue-500"/>
            </div>
        </div>
    );
};


// --- SCENE EDITOR COMPONENT (MOBILE OPTIMIZED) ---
const SceneEditor = ({ frame, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('text'); // text, style, layout, animate, decor
  const [activeTool, setActiveTool] = useState('move'); 
  const [isDragging, setIsDragging] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingWordIndex, setDraggingWordIndex] = useState(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const containerRef = useRef(null);
  
  const handlePointerDown = (e, type, index = null) => {
    e.stopPropagation(); 
    if (type === 'word' && activeTool === 'word') {
       setSelectedWordIndex(index);
       setDraggingWordIndex(index);
       const currentWordLayout = frame.wordLayouts[index] || { x: 0, y: 0 };
       setDragStart({ x: e.clientX - currentWordLayout.x, y: e.clientY - currentWordLayout.y });
       setIsDragging(true);
       if(e.target) e.target.setPointerCapture(e.pointerId); 
    } 
    else if (type === 'group' && activeTool === 'move') {
       setSelectedWordIndex(null);
       setDragStart({ x: e.clientX - frame.layout.x, y: e.clientY - frame.layout.y });
       setIsDragging(true);
       if(e.target) e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    if (activeTool === 'word' && draggingWordIndex !== null) {
        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;
        const existing = frame.wordLayouts[draggingWordIndex] || { scale: 1, rotation: 0 };
        const newWordLayouts = { ...frame.wordLayouts, [draggingWordIndex]: { ...existing, x: newX, y: newY } };
        onUpdate(frame.id, 'wordLayouts', newWordLayouts);
    } else if (activeTool === 'move') {
        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;
        const LIMIT = 1000; 
        newX = Math.max(-LIMIT, Math.min(newX, LIMIT));
        newY = Math.max(-LIMIT, Math.min(newY, LIMIT));
        onUpdate(frame.id, 'layout', { ...frame.layout, x: newX, y: newY });
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    setDraggingWordIndex(null);
    if (e.target) e.target.releasePointerCapture(e.pointerId);
  };

  const updateSelectedWord = (prop, value) => {
    if (selectedWordIndex === null) return;
    const existing = frame.wordLayouts[selectedWordIndex] || { x: 0, y: 0, scale: 1, rotation: 0, color: null, curve: 0, font: null, shadow: null };
    const newVal = { ...existing, [prop]: value };
    onUpdate(frame.id, 'wordLayouts', { ...frame.wordLayouts, [selectedWordIndex]: newVal });
  };

  const resetWord = () => {
      if (selectedWordIndex === null) return;
      const { [selectedWordIndex]: removed, ...rest } = frame.wordLayouts;
      onUpdate(frame.id, 'wordLayouts', rest);
  };

  const togglePreview = () => {
      if (isPreviewPlaying) {
          setIsPreviewPlaying(false);
      } else {
          setIsPreviewPlaying(true);
          setTimeout(() => setIsPreviewPlaying(false), (frame.duration * 1000) + 1000);
      }
  };

  if (!frame.layout.fontSize) frame.layout.fontSize = 40;

  // Helper to prevent double transform in editor
  const innerLayout = { 
      x: 0, y: 0, scale: 1, rotation: 0, 
      fontSize: frame.layout.fontSize,
      shadow: frame.layout.shadow 
  };

  // Tab definitions
  const TABS = [
      { id: 'text', icon: TypeIcon, label: 'Content' },
      { id: 'style', icon: Palette, label: 'Style' },
      { id: 'layout', icon: Layout, label: 'Layout' },
      { id: 'animate', icon: Film, label: 'Motion' },
      { id: 'decor', icon: Sparkles, label: 'Decor' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#000] flex flex-col md:flex-row h-[100dvh]">
      
      {/* 1. TOP SECTION: PREVIEW (Fixed height on mobile to ensure visibility) */}
      <div 
        className="relative h-[45vh] md:h-full md:flex-1 bg-[#111] flex items-center justify-center overflow-hidden order-1 md:order-2 border-b md:border-b-0 md:border-l border-white/10" 
        onPointerMove={handlePointerMove} 
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
         {/* Top Bar inside Preview */}
        <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-start pointer-events-none">
             <div className="bg-black/60 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-white flex items-center gap-2 pointer-events-auto">
                <button onClick={togglePreview} className="flex items-center gap-1.5 hover:text-purple-400">
                    {isPreviewPlaying ? <Pause size={12}/> : <Play size={12}/>} {isPreviewPlaying ? 'Stop' : 'Play Scene'}
                </button>
             </div>
             <button onClick={onClose} className="bg-red-500/90 text-white p-2 rounded-full pointer-events-auto hover:bg-red-600 shadow-lg">
                 <Check size={18} />
             </button>
        </div>

        {/* Drag Helper Label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur rounded-full px-3 py-1 text-[10px] text-gray-300 pointer-events-none z-50">
           {activeTool === 'move' ? 'Drag text to move' : 'Tap word to edit'}
        </div>

        {/* The Canvas */}
        <div ref={containerRef} className="aspect-video w-full max-w-[800px] bg-black relative shadow-2xl overflow-hidden touch-none group">
             <div className={`absolute inset-0 transition-colors duration-300 ${frame.theme.bg}`}>
                 <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
             </div>
             
             {/* DECORATION LAYER IN EDITOR PREVIEW (Local Scene Only) */}
             <DecorationLayer 
                type={frame.decoration} 
                duration={frame.duration} 
                isPlaying={isPreviewPlaying} 
             />

             <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div 
                   onPointerDown={(e) => handlePointerDown(e, 'group')}
                   style={{ 
                       transform: `translate(${frame.layout.x}px, ${frame.layout.y}px) rotate(${frame.layout.rotation}deg) scale(${frame.layout.scale})`,
                       transformOrigin: 'center center',
                   }}
                   className={`relative p-2 transition-colors w-full max-w-[90%] ${activeTool === 'move' && !isPreviewPlaying ? 'border-2 border-purple-500/50 bg-purple-500/10 rounded-lg cursor-move' : ''}`}
                >
                  <TransformableText 
                      text={frame.text} theme={frame.theme} animation={frame.animation} align={frame.align}
                      layout={innerLayout} wordLayouts={frame.wordLayouts} isPlaying={isPreviewPlaying}
                      activeTool={activeTool} selectedWordIndex={selectedWordIndex}
                      onWordClick={(e, i) => handlePointerDown(e, 'word', i)}
                    />
                </div>
             </div>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: CONTROLS (Scrollable area + Tabs) */}
      <div className="h-[55vh] md:h-full md:w-[400px] bg-[#0a0a0a] flex flex-col order-2 md:order-1 relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-neutral-900">
            {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 flex flex-col items-center justify-center gap-1.5 transition-colors relative ${activeTab === tab.id ? 'text-purple-400 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Icon size={18} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">{tab.label}</span>
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>}
                    </button>
                )
            })}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 bg-[#0a0a0a]">
            
            {/* --- TAB: TEXT CONTENT --- */}
            {activeTab === 'text' && (
                <div className="space-y-6 animate-fade">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 font-bold uppercase">Scene Text</label>
                        <textarea 
                            value={frame.text} 
                            onChange={(e) => onUpdate(frame.id, 'text', e.target.value)} 
                            className="w-full bg-neutral-800 border border-white/10 rounded-xl p-4 text-base focus:border-purple-500 outline-none resize-none shadow-inner" 
                            rows={3}
                            placeholder="Type here..."
                        />
                    </div>
                    
                    <div className="space-y-2">
                         <label className="text-xs text-gray-400 font-bold uppercase">Alignment</label>
                         <div className="flex bg-neutral-800 rounded-lg p-1 border border-white/10">
                            {['left', 'center', 'right'].map(align => (
                                <button key={align} onClick={() => onUpdate(frame.id, 'align', align)} className={`flex-1 py-2 text-xs font-bold rounded capitalize transition-all ${frame.align === align ? 'bg-neutral-600 text-white shadow' : 'text-gray-500'}`}>{align}</button>
                            ))}
                        </div>
                    </div>

                     <div className="space-y-2">
                         <div className="flex justify-between text-xs text-gray-400 font-bold uppercase"><span>Duration</span> <span className="text-purple-400">{frame.duration}s</span></div>
                         <input type="range" min="0.5" max="10" step="0.5" value={frame.duration} onChange={(e) => onUpdate(frame.id, 'duration', parseFloat(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none accent-purple-500"/>
                    </div>
                </div>
            )}

            {/* --- TAB: STYLE --- */}
            {activeTab === 'style' && (
                <div className="space-y-6 animate-fade">
                    {/* EDIT MODE TOGGLE */}
                      <div className="bg-neutral-800/50 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${activeTool === 'word' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                 <MousePointer2 size={18}/>
                             </div>
                             <div className="text-xs">
                                 <div className="font-bold text-white">Word Editor</div>
                                 <div className="text-gray-500">Select individual words</div>
                             </div>
                          </div>
                          <button 
                           onClick={() => { setActiveTool(activeTool === 'move' ? 'word' : 'move'); setSelectedWordIndex(null); }}
                           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTool === 'word' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'}`}
                          >
                             {activeTool === 'word' ? 'Active' : 'Enable'}
                          </button>
                      </div>
                    
                    {activeTool === 'word' && selectedWordIndex !== null && (
                         <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl space-y-4">
                             <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                 <span className="text-xs font-bold text-purple-300">Editing: "{frame.text.split(' ').filter(w=>w.trim())[selectedWordIndex]}"</span>
                                 <button onClick={resetWord} className="text-[10px] text-red-400 flex items-center gap-1"><RefreshCcw size={10}/> Reset</button>
                             </div>
                             
                             <div className="space-y-2">
                                <label className="text-[10px] text-gray-400 font-bold uppercase">Word Font</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FONTS.map(font => (
                                        <button 
                                            key={font.name}
                                            onClick={() => updateSelectedWord('font', font.family)}
                                            className={`px-2 py-2 text-xs rounded border transition-all ${frame.wordLayouts[selectedWordIndex]?.font === font.family ? 'bg-purple-600 border-purple-400 text-white' : 'bg-black/20 border-white/10 text-gray-400'}`}
                                            style={{ fontFamily: font.family }}
                                        >
                                            {font.name}
                                        </button>
                                    ))}
                                </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] text-gray-400 font-bold uppercase">Curve</label>
                                <input type="range" min="-60" max="60" step="5" value={frame.wordLayouts[selectedWordIndex]?.curve || 0} onChange={(e) => updateSelectedWord('curve', parseInt(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none accent-yellow-500"/>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] text-gray-400 font-bold uppercase">Color</label>
                                <div className="flex flex-wrap gap-2">
                                     <input type="color" value={frame.wordLayouts[selectedWordIndex]?.color || '#ffffff'} onChange={(e) => updateSelectedWord('color', e.target.value)} className="w-8 h-8 rounded-full border-none p-0 bg-transparent"/>
                                     {PRESET_COLORS.map(c => (
                                        <button key={c} onClick={() => updateSelectedWord('color', c)} className="w-8 h-8 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                                     ))}
                                </div>
                             </div>
                          </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 font-bold uppercase">Color Theme</label>
                      <div className="grid grid-cols-4 gap-3">
                        {THEMES.map(t => (
                          <button key={t.id} onClick={() => onUpdate(frame.id, 'theme', t)} className={`h-10 rounded-lg border-2 transition-all ${t.bg} ${frame.theme.id === t.id ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-60'}`}/>
                        ))}
                      </div>
                    </div>
                </div>
            )}

             {/* --- TAB: LAYOUT --- */}
             {activeTab === 'layout' && (
                 <div className="space-y-6 animate-fade">
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 font-bold uppercase"><span>Font Size</span> <span>{frame.layout.fontSize}px</span></div>
                            <input type="range" min="20" max="200" step="2" value={frame.layout.fontSize} onChange={(e) => onUpdate(frame.id, 'layout', {...frame.layout, fontSize: parseInt(e.target.value)})} className="w-full h-2 bg-gray-800 rounded-lg appearance-none accent-purple-500"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 font-bold uppercase"><span>Scale</span> <span>{frame.layout.scale}x</span></div>
                            <input type="range" min="0.1" max="3" step="0.1" value={frame.layout.scale} onChange={(e) => onUpdate(frame.id, 'layout', {...frame.layout, scale: parseFloat(e.target.value)})} className="w-full h-2 bg-gray-800 rounded-lg appearance-none accent-purple-500"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 font-bold uppercase"><span>Rotation</span> <span>{frame.layout.rotation}°</span></div>
                            <input type="range" min="-180" max="180" step="5" value={frame.layout.rotation} onChange={(e) => onUpdate(frame.id, 'layout', {...frame.layout, rotation: parseInt(e.target.value)})} className="w-full h-2 bg-gray-800 rounded-lg appearance-none accent-purple-500"/>
                        </div>
                    </div>
                    <ShadowControls 
                        label="Scene Shadow"
                        shadow={frame.layout.shadow} 
                        onChange={(newShadow) => onUpdate(frame.id, 'layout', { ...frame.layout, shadow: newShadow })}
                    />
                 </div>
             )}

             {/* --- TAB: MOTION --- */}
             {activeTab === 'animate' && (
                 <div className="space-y-4 animate-fade">
                    {/* ADDED PLAY BUTTON HERE FOR EDIT SECTION */}
                    <button 
                        onClick={togglePreview}
                        className={`w-full py-3 rounded-xl font-bold text-sm mb-4 flex items-center justify-center gap-2 transition-all border border-white/5 ${isPreviewPlaying ? 'bg-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                         {isPreviewPlaying ? <Pause size={16}/> : <Play size={16} fill="currentColor"/>}
                         {isPreviewPlaying ? 'Stop Preview' : 'Play Animation'}
                    </button>

                    <label className="text-xs text-gray-400 font-bold uppercase">Entrance Animation</label>
                    <div className="grid grid-cols-1 gap-2">
                        {ANIMATIONS.map(a => (
                            <button 
                                key={a.id} 
                                onClick={() => onUpdate(frame.id, 'animation', a.id)}
                                className={`p-4 rounded-xl text-left text-sm font-medium border transition-all ${frame.animation === a.id ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-neutral-800 border-white/5 text-gray-400 hover:bg-neutral-700'}`}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>
                 </div>
             )}

             {/* --- ADDED TAB: DECORATIONS --- */}
             {activeTab === 'decor' && (
                <div className="space-y-6 animate-fade">
                    <div className="space-y-3">
                        <label className="text-xs text-gray-400 font-bold uppercase">Scene Decoration (Local)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {DECORATIONS.map(d => (
                                <button 
                                    key={d.id} 
                                    onClick={() => onUpdate(frame.id, 'decoration', d.id)}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all h-24 ${frame.decoration === d.id ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-neutral-800 border-white/5 text-gray-400 hover:bg-neutral-700'}`}
                                >
                                    {d.type === 'image' ? (
                                        <img src={d.src} className="h-8 w-auto object-contain" alt="" />
                                    ) : (
                                        <div className="text-xl font-bold">{d.id === 'none' ? '🚫' : d.id === 'progress-top' ? 'Pb' : '✨'}</div>
                                    )}
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{d.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] text-blue-300">
                        <strong>Tip:</strong> This decoration only appears for this specific scene. To add a decoration for the <strong>entire video</strong>, use the Settings icon in the header.
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

// --- 4. MAIN APP ---

export default function App() {
  const [frames, setFrames] = useState(INITIAL_FRAMES);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0); 
  const [editingFrameId, setEditingFrameId] = useState(null); 
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [playbackSessionId, setPlaybackSessionId] = useState(0);

  // --- NEW: GLOBAL SETTINGS STATE ---
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [globalDecor, setGlobalDecor] = useState('none');

  const requestRef = useRef();
  const startTimeRef = useRef(0);
  const progressBarRef = useRef(null);
  const scrollRef = useRef(null);
  const previewRef = useRef(null);

  const getTotalDuration = () => frames.reduce((total, frame) => total + (frame.duration * 1000), 0);
  // Get Total Duration in Seconds for CSS animations
  const totalDurationSec = frames.reduce((total, frame) => total + frame.duration, 0);

  const animate = (time) => {
    const elapsed = Date.now() - startTimeRef.current;
    const totalDuration = getTotalDuration();
    
    // --- FIX START: Add padding to the end ---
    const END_BUFFER = 800; // 0.8 seconds buffer so last animation isn't cut off
    // --- FIX END ---

    const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
    if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progressPercent}%`;
    }

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

    // --- FIX START: Logic to keep last frame active during buffer ---
    if (elapsed >= totalDuration && elapsed < totalDuration + END_BUFFER) {
        foundIndex = frames.length - 1; // Keep last frame visible
    }
    
    if (elapsed >= totalDuration + END_BUFFER) { // Stop only after buffer
        handleStop();
        setCurrentFrameIndex(frames.length - 1); 
        if (progressBarRef.current) progressBarRef.current.style.width = `100%`;
        return; 
    }
    // --- FIX END ---

    if (foundIndex !== -1 && foundIndex !== currentFrameIndex) {
        setCurrentFrameIndex(foundIndex);
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    if (frames.length === 0) return;
    setPlaybackSessionId(prev => prev + 1); // <--- Force a new playback session key
    setIsPlaying(true);
    setCurrentFrameIndex(0); 
    startTimeRef.current = Date.now();
    if (window.innerWidth < 1024 && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleStop = () => {
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
    if (progressBarRef.current) progressBarRef.current.style.width = `0%`; 
  };
  
  const togglePlay = () => isPlaying ? handleStop() : handlePlay();

  const handleAddFrame = () => {
    const newId = Date.now();
    const lastFrame = frames[frames.length - 1];
    setFrames([...frames, { 
      id: newId, text: "", duration: 2.5,
      theme: lastFrame ? lastFrame.theme : THEMES[0],
      animation: lastFrame ? lastFrame.animation : ANIMATIONS[0].id,
      align: lastFrame ? lastFrame.align : 'center',
      layout: { x: 0, y: 0, scale: 1, rotation: 0, fontSize: 40, shadow: DEFAULT_SHADOW },
      wordLayouts: {},
      decoration: 'none'
    }]);
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 100);
  };

  const handleUpdateFrame = (id, field, value) => {
    setFrames(frames.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleRemoveFrame = (id) => {
    if (frames.length <= 1) return;
    setFrames(frames.filter(f => f.id !== id));
    if (currentFrameIndex >= frames.length - 1) setCurrentFrameIndex(Math.max(0, frames.length - 2));
  };

  const handleMoveFrame = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === frames.length - 1)) return;
    const newFrames = [...frames];
    const temp = newFrames[index];
    newFrames[index] = newFrames[index + direction];
    newFrames[index + direction] = temp;
    setFrames(newFrames);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setIsExporting(false); showToast("🎉 Video Exported Successfully!"); }, 500);
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
  const editingFrame = frames.find(f => f.id === editingFrameId);

  // Helper for preview double transform prevention
  const activeInnerLayout = {
      x: 0, y: 0, scale: 1, rotation: 0,
      fontSize: activeFrame.layout.fontSize,
      shadow: activeFrame.layout.shadow 
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col relative overflow-hidden">
      
      {/* --- RENDER EDITOR IF ACTIVE (FULL SCREEN OVERLAY) --- */}
      {editingFrame && (
        <SceneEditor 
          frame={editingFrame} 
          onUpdate={handleUpdateFrame} 
          onClose={() => setEditingFrameId(null)} 
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Courier+Prime:wght@400;700&family=Pacifico&family=Playfair+Display:wght@400;900&display=swap');

        @keyframes stomp { 0% { transform: scale(3); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slide-up { 0% { transform: translateY(40px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes pop-in { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes rotate-in { 0% { transform: rotate(-180deg) scale(0); opacity: 0; } 100% { transform: rotate(0) scale(1); opacity: 1; } }
        @keyframes blur-in { 0% { filter: blur(20px); opacity: 0; transform: scale(1.2); } 100% { filter: blur(0); opacity: 1; transform: scale(1); } }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        
        /* ADDED: Walk Animation */
        /* Changed to start slightly offscreen left and end slightly offscreen right */
        @keyframes walk-across { 0% { left: -100px; transform: scaleX(1); } 100% { left: 100%; transform: scaleX(1); } }
        .animate-walk { position: absolute; bottom: 0; animation: walk-across linear infinite; z-index: 20; }

        /* ADDED: Robot Bounce Animation */
        @keyframes bounce-decor { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce { position: absolute; bottom: 10px; right: 10%; animation: bounce-decor 2s ease-in-out infinite; z-index: 20; }

        /* --- UPDATED: Floating Particles Animation (Magical Style) --- */
        @keyframes float-dust {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            50% { transform: translateY(-80px) translateX(20px) rotate(180deg); opacity: 0.6; }
            80% { opacity: 1; }
            100% { transform: translateY(-160px) translateX(-10px) rotate(360deg); opacity: 0; }
        }

        .particle {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%); /* Glowing orb effect */
            border-radius: 50%;
            animation: float-dust linear infinite;
            pointer-events: none;
            mix-blend-mode: screen; /* Better blending with dark backgrounds */
        }

        .animate-stomp { animation: stomp 0.5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-rotate-in { animation: rotate-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-blur-in { animation: blur-in 0.7s ease-out forwards; }
        .animate-fade { animation: fade-in 0.3s ease-out forwards; }
        
        .word-hidden { opacity: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>

      {/* ... [EXPORT LOADER] ... */}
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

      {/* ... [PRICING MODAL] ... */}
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

       {/* ... [NEW: GLOBAL SETTINGS MODAL] ... */}
       {isGlobalSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsGlobalSettingsOpen(false)}></div>
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-md rounded-3xl relative z-10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-purple-500" /> Project Settings</h2>
              <button onClick={() => setIsGlobalSettingsOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-6">
                <div>
                   <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Global Decoration</h3>
                   <p className="text-xs text-gray-500 mb-4">This decoration will appear across the entire video duration ({totalDurationSec}s).</p>
                   <div className="grid grid-cols-2 gap-3">
                      {DECORATIONS.map(d => (
                           <button 
                                key={d.id} 
                                onClick={() => setGlobalDecor(d.id)}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all h-24 ${globalDecor === d.id ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-neutral-800 border-white/5 text-gray-400 hover:bg-neutral-700'}`}
                            >
                                {d.type === 'image' ? (
                                    <img src={d.src} className="h-8 w-auto object-contain" alt="" />
                                ) : (
                                    <div className="text-xl font-bold">{d.id === 'none' ? '🚫' : d.id === 'progress-top' ? 'Pb' : '✨'}</div>
                                )}
                                <span className="text-[10px] font-bold uppercase tracking-wider">{d.name}</span>
                            </button>
                      ))}
                   </div>
                </div>
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-300">
                    <strong>Note:</strong> You can still add specific decorations to individual scenes in the Scene Editor. The Global Decoration will play on top of them.
                </div>
            </div>
          </div>
        </div>
      )}

      {/* ... [TOAST] ... */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
           <Zap className="w-4 h-4 text-purple-600" /> {toast.message}
        </div>
      </div>

      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 lg:px-6 bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Video className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-wide hidden md:block">
              Reel<span className="text-purple-500">Maker</span>
            </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
            {/* Added Settings Button */}
            <button onClick={() => setIsGlobalSettingsOpen(true)} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <Settings size={20} />
            </button>
            <button onClick={() => setIsPricingOpen(true)} className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5">
               <Crown className="w-3.5 h-3.5 fill-white/20" /> <span className="hidden md:inline">Pro</span>
            </button>
           <button onClick={handleExport} className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-lg shadow-purple-900/40 flex items-center gap-2">
             Export <Share2 size={12}/>
           </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-56px)] overflow-hidden">
          
          {/* --- PREVIEW SECTION (TOP on mobile, RIGHT on desktop) --- */}
          <div ref={previewRef} className="lg:w-7/12 h-auto flex flex-col order-1 lg:order-2 shrink-0">
              <div className="flex-1 bg-neutral-900/50 rounded-2xl border border-white/5 p-4 flex flex-col relative overflow-hidden">
                 
                 <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preview</span>
                     </div>
                     <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">16:9 HD</span>
                 </div>

                 <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[250px] lg:min-h-0">
                    <div className={`relative transition-all duration-300 ease-in-out bg-black rounded-[1rem] border-[3px] border-gray-800 shadow-2xl overflow-hidden flex flex-col aspect-video w-full max-w-[800px] ${isPlaying ? 'scale-[1.01]' : ''}`}>
                      
                      <div className={`flex-1 w-full h-full flex flex-col items-center justify-center relative transition-colors duration-300 ${activeTheme.bg} ${getAlignmentClass(activeFrame.align)}`}>
                        
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                        
                        {/* --- DECORATION LAYER 1: LOCAL (Per Scene) --- */}
                        <DecorationLayer 
                            type={activeFrame.decoration} 
                            duration={activeFrame.duration} 
                            isPlaying={isPlaying} 
                        />

                        {/* --- DECORATION LAYER 2: GLOBAL (Entire Video) --- */}
                        {/* Key Logic: We pass totalDurationSec and isGlobal=true */}
                        <DecorationLayer 
                             key={`global-${playbackSessionId}`} // Reset animation on play
                             type={globalDecor}
                             duration={totalDurationSec}
                             isPlaying={isPlaying}
                             isGlobal={true}
                        />

                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                            <div style={{ transform: `translate(${activeFrame.layout.x}px, ${activeFrame.layout.y}px) rotate(${activeFrame.layout.rotation}deg) scale(${activeFrame.layout.scale})` }}>
                                <TransformableText 
                                  key={`${activeFrame.id}-${playbackSessionId}`} // <--- CRITICAL FIX: Ensures animation plays on EVERY frame change, especially the last one
                                  text={activeFrame.text} theme={activeTheme} animation={activeAnim} align={activeFrame.align}
                                  layout={activeInnerLayout} wordLayouts={activeFrame.wordLayouts} isPlaying={isPlaying}
                                  activeTool={null} selectedWordIndex={null}
                                />
                            </div>
                        </div>

                      </div>
                      <div className="h-1 bg-white/20 w-full mt-auto absolute bottom-0 left-0 z-20">
                          <div ref={progressBarRef} className="h-full bg-red-600 shadow-[0_0_10px_red] w-0"></div>
                      </div>
                    </div>
                 </div>

                 <div className="mt-4 flex gap-3 items-center">
                     <button onClick={togglePlay} className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-lg ${isPlaying ? 'bg-red-500 text-white' : 'bg-white text-black'}`}>
                        {isPlaying ? <><Pause size={16}/> Stop</> : <><Play size={16} fill="currentColor"/> Preview Reel</>}
                     </button>
                     <button onClick={() => setIsMusicEnabled(!isMusicEnabled)} className={`h-10 w-10 flex items-center justify-center rounded-lg transition-colors border ${isMusicEnabled ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-white/5 text-gray-400 border-white/5'}`}>
                       <Music size={16} />
                     </button>
                 </div>
              </div>
          </div>

          {/* --- TIMELINE SECTION (BOTTOM on mobile, LEFT on desktop) --- */}
          <div className="lg:w-5/12 flex flex-col h-full gap-4 order-2 lg:order-1 overflow-hidden">
            <div className="flex items-center justify-between px-1">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Film className="w-4 h-4 text-purple-400" /> Scenes ({frames.length})
              </h2>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pb-10">
              {frames.map((frame, index) => (
                <div key={frame.id} 
                  onClick={() => setCurrentFrameIndex(index)}
                  className={`flex flex-col gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${currentFrameIndex === index ? 'bg-purple-500/5 border-purple-500/50 ring-1 ring-purple-500/20' : 'bg-neutral-900 border-white/10 hover:border-white/20'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-0.5 items-center justify-center pt-1">
                      <button onClick={(e) => { e.stopPropagation(); handleMoveFrame(index, -1); }} disabled={index === 0} className="text-gray-600 hover:text-white disabled:opacity-20"><ArrowUp size={12} /></button>
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono text-gray-500">{index + 1}</div>
                      <button onClick={(e) => { e.stopPropagation(); handleMoveFrame(index, 1); }} disabled={index === frames.length - 1} className="text-gray-600 hover:text-white disabled:opacity-20"><ArrowDown size={12} /></button>
                    </div>
                    
                    <div className="flex-1 min-w-0" onClick={(e) => { e.stopPropagation(); setEditingFrameId(frame.id); setCurrentFrameIndex(index); }}>
                          <div className="bg-black/40 rounded-lg border border-white/5 p-2 mb-2 text-sm text-gray-300 truncate font-medium">
                              {frame.text || <span className="text-gray-600 italic">Empty scene...</span>}
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> {frame.duration}s</span>
                             <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded capitalize">{frame.theme.name}</span>
                          </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setEditingFrameId(frame.id); setCurrentFrameIndex(index); }} className="p-2 bg-white text-black rounded-lg shadow hover:bg-gray-200" title="Edit Scene"><Edit3 size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveFrame(frame.id); }} className="p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={handleAddFrame} className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium">
                <Plus size={20} /> Add New Scene
              </button>
            </div>
          </div>

      </main>

    </div>
  );
}