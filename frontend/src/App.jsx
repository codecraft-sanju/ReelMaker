import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Plus, Trash2, Video, 
  Check, X, Zap, Share2, Music, Crown, 
  ArrowUp, ArrowDown, ImageIcon, Clock, Edit3, 
  Move, Maximize, RotateCw, Palette, Layout, Type, 
  MousePointer2, RefreshCcw, Type as TypeIcon,
  ZoomIn, GripHorizontal
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

// --- DEFAULT DATA ---
const INITIAL_FRAMES = [
  { id: 101, text: "Stop Waiting.", image: "", duration: 1.5, theme: THEMES[0], animation: ANIMATIONS[0].id, align: 'center', layout: { x: 0, y: 0, scale: 1, rotation: 0, fontSize: 60 }, wordLayouts: {} },
  { id: 102, text: "No one is coming to save you.", image: "", duration: 3, theme: THEMES[0], animation: ANIMATIONS[0].id, align: 'center', layout: { x: 0, y: 0, scale: 1, rotation: 0, fontSize: 48 }, wordLayouts: {} },
  { id: 103, text: "BUILD IT YOURSELF.", image: "", duration: 2, theme: THEMES[2], animation: ANIMATIONS[0].id, align: 'center', layout: { x: 0, y: 0, scale: 1.2, rotation: 0, fontSize: 72 }, wordLayouts: {} }
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

// --- TRANSFORMABLE TEXT COMPONENT (Universal Preview) ---
const TransformableText = ({ 
  text, theme, animation, align, layout, wordLayouts = {},
  isPlaying, activeTool, selectedWordIndex
}) => {
  const fontSize = layout.fontSize || 40;
  const words = text.split(' ').filter(w => w.trim());

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
      <div 
        className={`relative p-2 w-full max-w-[90%] transition-transform duration-75 ease-out`}
        style={{ 
            transform: `translate(${layout.x}px, ${layout.y}px) rotate(${layout.rotation}deg) scale(${layout.scale})`,
            transformOrigin: 'center center',
        }}
      >
        <div 
            className={`${theme.text} drop-shadow-2xl font-black ${getAlignmentClass(align)} select-none`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}
        >
          <div className={`flex flex-wrap gap-x-[0.3em] gap-y-1 w-full ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'}`}>
            {words.map((word, i) => {
                // Get individual word layout or default
                const wl = wordLayouts[i] || { x: 0, y: 0, scale: 1, rotation: 0 };
                
                return (
                    // OUTER SPAN: Handles Position (Translate)
                    <span 
                      key={i}
                      className="inline-block relative break-words"
                      style={{ 
                        transform: `translate(${wl.x}px, ${wl.y}px)`,
                        display: 'inline-block' 
                      }}
                    >
                      {/* INNER SPAN: Handles Scale, Rotation, Animation & Color */}
                      <span className={`
                        inline-block
                        ${isPlaying ? 'word-hidden' : ''} 
                        ${i % 2 !== 0 ? theme.accent : ''} 
                        ${isPlaying ? animation : ''}
                      `}
                      style={{
                        transform: `scale(${wl.scale || 1}) rotate(${wl.rotation || 0}deg)`,
                        animationDelay: isPlaying ? `${i * 0.15}s` : '0s',
                        animationFillMode: 'forwards'
                      }}>
                        {word}
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

// --- SCENE EDITOR COMPONENT ---
const SceneEditor = ({ frame, onUpdate, onClose }) => {
  const [activeTool, setActiveTool] = useState('move'); // 'move' (Group) or 'word' (Individual)
  const [isDragging, setIsDragging] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null); // Which word is currently selected
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingWordIndex, setDraggingWordIndex] = useState(null);
  
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const containerRef = useRef(null);
  
  // --- POINTER EVENTS ---
  const handlePointerDown = (e, type, index = null) => {
    e.stopPropagation(); 
    
    if (type === 'word' && activeTool === 'word') {
       // SELECT THE WORD FIRST
       setSelectedWordIndex(index);
       
       setDraggingWordIndex(index);
       const currentWordLayout = frame.wordLayouts[index] || { x: 0, y: 0 };
       setDragStart({
         x: e.clientX - currentWordLayout.x,
         y: e.clientY - currentWordLayout.y
       });
       setIsDragging(true);
       e.target.setPointerCapture(e.pointerId); 
    } 
    else if (type === 'group' && activeTool === 'move') {
       setSelectedWordIndex(null); // Deselect word when moving group
       setDragStart({ 
         x: e.clientX - frame.layout.x, 
         y: e.clientY - frame.layout.y 
       });
       setIsDragging(true);
       e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    if (activeTool === 'word' && draggingWordIndex !== null) {
        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;
        // Keep existing scale/rotation, update x/y
        const existing = frame.wordLayouts[draggingWordIndex] || { scale: 1, rotation: 0 };
        const newWordLayouts = { 
            ...frame.wordLayouts, 
            [draggingWordIndex]: { ...existing, x: newX, y: newY } 
        };
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

  // --- SPECIFIC WORD UPDATE HELPER ---
  const updateSelectedWord = (prop, value) => {
    if (selectedWordIndex === null) return;
    const existing = frame.wordLayouts[selectedWordIndex] || { x: 0, y: 0, scale: 1, rotation: 0 };
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

  // Ensure default fontSize exists
  if (!frame.layout.fontSize) frame.layout.fontSize = 40;

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col md:flex-row overflow-hidden animate-fade">
      
      {/* LEFT SIDEBAR: CONTROLS */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900/50 flex flex-col h-[50vh] md:h-full overflow-hidden order-2 md:order-1 relative z-20">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
           <h3 className="font-bold flex items-center gap-2 text-sm md:text-base"><Edit3 size={16} className="text-purple-500"/> Scene Editor</h3>
           <div className="flex items-center gap-2">
               <button 
                onClick={togglePreview}
                className={`p-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${isPreviewPlaying ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
               >
                   {isPreviewPlaying ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor"/>} 
                   {isPreviewPlaying ? 'Stop' : 'Play'}
               </button>
               <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={16}/></button>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 pb-20">
           
           {/* TEXT INPUT */}
           <div className="space-y-2">
             <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2"><Type size={12}/> Text Content</label>
             <textarea 
               value={frame.text} 
               onChange={(e) => onUpdate(frame.id, 'text', e.target.value)}
               className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none resize-none"
               rows={2}
             />
           </div>

           {/* MODE SWITCHER */}
           <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-3 space-y-3">
              <label className="text-xs text-purple-300 font-bold uppercase flex items-center gap-2"><Move size={12}/> Editing Mode</label>
              <div className="flex gap-2">
                 <button 
                   onClick={() => { setActiveTool('move'); setSelectedWordIndex(null); }}
                   className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-1.5 transition-all ${activeTool === 'move' ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40' : 'bg-black/40 text-gray-400 border-transparent hover:bg-white/5'}`}
                 >
                    <GripHorizontal size={18}/> Scene
                 </button>
                 <button 
                   onClick={() => setActiveTool('word')}
                   className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-1.5 transition-all ${activeTool === 'word' ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40' : 'bg-black/40 text-gray-400 border-transparent hover:bg-white/5'}`}
                 >
                    <MousePointer2 size={18}/> Word
                 </button>
              </div>
           </div>

           {/* --- DYNAMIC CONTROLS BASED ON MODE --- */}

           {/* SCENE/GROUP CONTROLS */}
           {activeTool === 'move' && (
               <div className="space-y-4 animate-slide-up">
                  <div className="flex items-center justify-between">
                     <label className="text-xs text-gray-400 font-bold uppercase">Scene Controls</label>
                     <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Affects All Text</span>
                  </div>

                  {/* ALIGNMENT */}
                  <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                    {['left', 'center', 'right'].map(align => (
                        <button key={align} onClick={() => onUpdate(frame.id, 'align', align)} className={`flex-1 py-1 text-xs rounded capitalize ${frame.align === align ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            {align}
                        </button>
                    ))}
                  </div>

                  {/* FONT SIZE */}
                  <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400"><span>Font Size</span> <span>{frame.layout.fontSize}px</span></div>
                      <input type="range" min="20" max="200" step="2" value={frame.layout.fontSize} onChange={(e) => onUpdate(frame.id, 'layout', {...frame.layout, fontSize: parseInt(e.target.value)})} className="w-full h-1 bg-gray-700 rounded-lg appearance-none accent-purple-500"/>
                  </div>
                  {/* SCALE */}
                  <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400"><span>Scale</span> <span>{frame.layout.scale}x</span></div>
                      <input type="range" min="0.1" max="3" step="0.1" value={frame.layout.scale} onChange={(e) => onUpdate(frame.id, 'layout', {...frame.layout, scale: parseFloat(e.target.value)})} className="w-full h-1 bg-gray-700 rounded-lg appearance-none accent-purple-500"/>
                  </div>
                  {/* ROTATION */}
                  <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400"><span>Rotation</span> <span>{frame.layout.rotation}°</span></div>
                      <input type="range" min="-180" max="180" step="5" value={frame.layout.rotation} onChange={(e) => onUpdate(frame.id, 'layout', {...frame.layout, rotation: parseInt(e.target.value)})} className="w-full h-1 bg-gray-700 rounded-lg appearance-none accent-purple-500"/>
                  </div>
               </div>
           )}

           {/* INDIVIDUAL WORD CONTROLS */}
           {activeTool === 'word' && (
               <div className="space-y-4 animate-slide-up">
                  <div className="flex items-center justify-between">
                     <label className="text-xs text-gray-400 font-bold uppercase">Word Controls</label>
                     <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Affects Selected Word</span>
                  </div>

                  {selectedWordIndex === null ? (
                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs text-center">
                          👆 Tap a word on the preview to select and resize it.
                      </div>
                  ) : (
                      <div className="bg-gray-900/50 p-3 rounded-xl border border-white/10 space-y-4">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                             <span className="text-xs font-bold text-white">Selected: "{frame.text.split(' ').filter(w=>w.trim())[selectedWordIndex]}"</span>
                             <button onClick={resetWord} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"><RefreshCcw size={10}/> Reset</button>
                          </div>
                          
                          {/* WORD SCALE */}
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-400"><span>Size (Scale)</span> <span>{(frame.wordLayouts[selectedWordIndex]?.scale || 1).toFixed(1)}x</span></div>
                              <input 
                                type="range" min="0.5" max="4" step="0.1" 
                                value={frame.wordLayouts[selectedWordIndex]?.scale || 1} 
                                onChange={(e) => updateSelectedWord('scale', parseFloat(e.target.value))} 
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none accent-green-500"
                              />
                          </div>
                          {/* WORD ROTATION */}
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-400"><span>Rotation</span> <span>{frame.wordLayouts[selectedWordIndex]?.rotation || 0}°</span></div>
                              <input 
                                type="range" min="-180" max="180" step="5" 
                                value={frame.wordLayouts[selectedWordIndex]?.rotation || 0} 
                                onChange={(e) => updateSelectedWord('rotation', parseInt(e.target.value))} 
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none accent-green-500"
                              />
                          </div>
                      </div>
                  )}
               </div>
           )}

           <div className="space-y-2 pt-2 border-t border-white/5">
             <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2"><Palette size={12}/> Theme</label>
             <div className="grid grid-cols-4 gap-2">
               {THEMES.map(t => (
                 <button 
                   key={t.id}
                   onClick={() => onUpdate(frame.id, 'theme', t)}
                   className={`h-8 rounded-md border transition-all ${t.bg} ${frame.theme.id === t.id ? 'ring-2 ring-white scale-110 z-10' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                 />
               ))}
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2"><Zap size={12}/> Animation</label>
             <select 
                value={frame.animation} 
                onChange={(e) => onUpdate(frame.id, 'animation', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-gray-300 outline-none"
             >
               {ANIMATIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
             </select>
           </div>
        </div>
      </div>

      {/* CENTER: CANVAS */}
      <div 
        className="flex-1 bg-neutral-950 flex flex-col relative order-1 md:order-2 h-[50vh] md:h-full" 
        onPointerMove={handlePointerMove} 
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur border border-white/10 rounded-full px-4 py-2 flex items-center gap-4 z-50 pointer-events-none">
           <span className="text-xs text-white font-medium flex items-center gap-2">
             {activeTool === 'move' ? <><Move size={14} className="text-purple-400"/> Drag to move Scene</> : <><MousePointer2 size={14} className="text-green-400"/> Tap word to Resize</>}
           </span>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
          {/* ENFORCED ASPECT RATIO CONTAINER */}
          <div ref={containerRef} className="aspect-video w-full max-w-[1000px] border border-white/10 bg-black relative shadow-2xl overflow-hidden group touch-none">
              
              {/* Background */}
              <div className={`absolute inset-0 transition-colors duration-300 ${frame.image ? 'bg-black' : frame.theme.bg}`}>
                  {frame.image && <><img src={frame.image} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" /><div className="absolute inset-0 bg-black/60 z-0"></div></>}
                  {!frame.image && <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>}
              </div>

              {/* Safe Zone Grid */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                 <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/10"></div><div className="border-r border-b border-white/10"></div><div className="border-b border-white/10"></div>
                    <div className="border-r border-b border-white/10"></div><div className="border-r border-b border-white/10"></div><div className="border-b border-white/10"></div>
                    <div className="border-r border-white/10"></div><div className="border-r border-white/10"></div><div></div>
                 </div>
              </div>

              {/* Interactive Layer */}
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div 
                   onPointerDown={(e) => handlePointerDown(e, 'group')}
                   style={{ 
                       transform: `translate(${frame.layout.x}px, ${frame.layout.y}px) rotate(${frame.layout.rotation}deg) scale(${frame.layout.scale})`,
                       transformOrigin: 'center center',
                   }}
                   className={`
                       relative p-2 transition-colors w-full max-w-[90%]
                       ${activeTool === 'move' && !isPreviewPlaying ? 'cursor-move border-2 border-purple-500 bg-purple-500/10 rounded-lg' : 'border-2 border-dashed border-transparent'}
                   `}
                >
                  <div 
                    className={`${frame.theme.text} drop-shadow-xl font-black ${getAlignmentClass(frame.align)} select-none`}
                    style={{ fontSize: `${frame.layout.fontSize || 40}px`, lineHeight: 1.2 }}
                  >
                    <div className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${frame.align === 'left' ? 'justify-start' : frame.align === 'right' ? 'justify-end' : 'justify-center'}`}>
                      
                      {frame.text.split(' ').filter(w => w.trim()).map((word, i) => {
                          const wl = frame.wordLayouts[i] || { x: 0, y: 0, scale: 1, rotation: 0 };
                          const isSelected = activeTool === 'word' && selectedWordIndex === i;
                          
                          return (
                              // OUTER SPAN: Handles Position & Drag Events
                              <span 
                                  key={i} 
                                  onPointerDown={(e) => handlePointerDown(e, 'word', i)}
                                  className={`
                                      inline-block relative transition-all
                                      ${activeTool === 'word' && !isPreviewPlaying ? 'cursor-pointer hover:scale-105' : ''}
                                      ${isSelected ? 'z-50' : 'z-auto'}
                                  `}
                                  style={{ 
                                      transform: `translate(${wl.x}px, ${wl.y}px)`,
                                      touchAction: 'none'
                                  }}
                              >
                                  {/* SELECTION BOX (Visible only when selecting words) */}
                                  {isSelected && (
                                      <span className="absolute -inset-2 border-2 border-green-400 bg-green-400/20 rounded animate-pulse pointer-events-none z-0"></span>
                                  )}

                                  {/* INNER SPAN: Handles Animation, Scale, Rotation */}
                                  <span className={`
                                      inline-block relative z-10
                                      ${i % 2 !== 0 ? frame.theme.accent : ''}
                                      ${isPreviewPlaying ? 'word-hidden' : ''} 
                                      ${isPreviewPlaying ? frame.animation : ''}
                                  `}
                                  style={{
                                      transform: `scale(${wl.scale || 1}) rotate(${wl.rotation || 0}deg)`,
                                      animationDelay: isPreviewPlaying ? `${i * 0.15}s` : '0s',
                                      animationFillMode: 'forwards'
                                  }}>
                                      {word}
                                  </span>
                              </span>
                          );
                      })}
                    </div>
                  </div>
                </div>
              </div>

          </div>
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

  const requestRef = useRef();
  const startTimeRef = useRef(0);
  const progressBarRef = useRef(null);
  const scrollRef = useRef(null);
  const previewRef = useRef(null);

  // --- PLAYBACK ENGINE ---
  const getTotalDuration = () => frames.reduce((total, frame) => total + (frame.duration * 1000), 0);

  const animate = (time) => {
    const elapsed = Date.now() - startTimeRef.current;
    const totalDuration = getTotalDuration();

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

    if (elapsed >= totalDuration) {
        handleStop();
        setCurrentFrameIndex(frames.length - 1); 
        if (progressBarRef.current) progressBarRef.current.style.width = `100%`;
        return; 
    }

    if (foundIndex !== -1 && foundIndex !== currentFrameIndex) {
        setCurrentFrameIndex(foundIndex);
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    if (frames.length === 0) return;
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

  // --- CRUD HANDLERS ---
  const handleAddFrame = () => {
    const newId = Date.now();
    const lastFrame = frames[frames.length - 1];
    setFrames([...frames, { 
      id: newId, text: "", image: "", duration: 2.5,
      theme: lastFrame ? lastFrame.theme : THEMES[0],
      animation: lastFrame ? lastFrame.animation : ANIMATIONS[0].id,
      align: lastFrame ? lastFrame.align : 'center',
      layout: { x: 0, y: 0, scale: 1, rotation: 0, fontSize: 40 },
      wordLayouts: {}
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col relative">
      
      {/* --- RENDER EDITOR IF ACTIVE --- */}
      {editingFrame && (
        <SceneEditor 
          frame={editingFrame} 
          onUpdate={handleUpdateFrame} 
          onClose={() => setEditingFrameId(null)} 
        />
      )}

      <style>{`
        @keyframes stomp { 0% { transform: scale(3); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slide-up { 0% { transform: translateY(40px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes pop-in { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes rotate-in { 0% { transform: rotate(-180deg) scale(0); opacity: 0; } 100% { transform: rotate(0) scale(1); opacity: 1; } }
        @keyframes blur-in { 0% { filter: blur(20px); opacity: 0; transform: scale(1.2); } 100% { filter: blur(0); opacity: 1; transform: scale(1); } }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }

        .animate-stomp { animation: stomp 0.5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-rotate-in { animation: rotate-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-blur-in { animation: blur-in 0.7s ease-out forwards; }
        .animate-fade { animation: fade-in 0.3s ease-out forwards; }
        
        .word-hidden { opacity: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
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

      {/* ... [TOAST] ... */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
           <Zap className="w-4 h-4 text-purple-600" /> {toast.message}
        </div>
      </div>

      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Video className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-wide">
              Reel<span className="text-purple-500">Maker</span>
            </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setIsPricingOpen(true)} className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5">
               <Crown className="w-3.5 h-3.5 fill-white/20" /> Pro
            </button>
           <button onClick={handleExport} className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-lg shadow-purple-900/40 flex items-center gap-2">
             Export <Share2 size={12}/>
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 overflow-hidden lg:h-[calc(100vh-64px)] h-auto">
          
          {/* --- LEFT COLUMN: TIMELINE & EDITING --- */}
          <div className="lg:col-span-5 flex flex-col h-[600px] lg:h-full gap-4 order-2 lg:order-1">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Video className="w-4 h-4 text-purple-400" /> Script Timeline
              </h2>
              <div className="flex items-center gap-2">
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
                        <button onClick={(e) => { e.stopPropagation(); setEditingFrameId(frame.id); setCurrentFrameIndex(index); }} className="p-2 text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-all shadow-lg shadow-purple-900/20" title="Edit Scene"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveFrame(frame.id); }} className="p-2 text-gray-600 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
            </div>
          </div>

          {/* --- RIGHT COLUMN: PREVIEW --- */}
          <div ref={previewRef} className="lg:col-span-7 h-auto min-h-[500px] lg:h-full flex flex-col bg-neutral-900/50 rounded-3xl border border-white/5 p-4 lg:p-8 relative order-1 lg:order-2">
              <div className="flex justify-center mb-6">
                 <span className="text-gray-400 text-xs font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">Aspect Ratio: 16:9 (YouTube)</span>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div className={`relative transition-all duration-500 ease-in-out bg-black rounded-[1rem] border-4 border-gray-800 shadow-2xl overflow-hidden flex flex-col aspect-video w-full max-w-[800px] ${isPlaying ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}`}>
                  <div className={`flex-1 w-full h-full flex flex-col items-center justify-center relative transition-colors duration-300 ${activeFrame.image ? 'bg-black' : activeTheme.bg} ${getAlignmentClass(activeFrame.align)}`}>
                    
                    {activeFrame.image && <><img src={activeFrame.image} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" /><div className="absolute inset-0 bg-black/60 z-0"></div></>}
                    
                    {!activeFrame.image && <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>}
                    
                    <TransformableText 
                      text={activeFrame.text}
                      theme={activeTheme}
                      animation={activeAnim}
                      align={activeFrame.align}
                      layout={activeFrame.layout}
                      wordLayouts={activeFrame.wordLayouts}
                      isPlaying={isPlaying}
                      // Pass dummy props for preview only (non-editable)
                      activeTool={null} 
                      selectedWordIndex={null}
                    />
                  </div>
                  <div className="h-1 bg-white/20 w-full mt-auto absolute bottom-0 left-0 z-20">
                      <div ref={progressBarRef} className="h-full bg-red-600 shadow-[0_0_10px_red] w-0"></div>
                  </div>
                </div>
              </div>
          </div>
      </main>

    </div>
  );
}