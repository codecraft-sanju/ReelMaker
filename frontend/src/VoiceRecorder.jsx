import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Check, Volume2, AlertCircle } from 'lucide-react';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VoiceRecorder = ({ onStartPlayback, onStopPlayback, onSave }) => {
  const [step, setStep] = useState('idle'); // idle, countdown, recording, review
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // ... (Existing useEffect cleanup remains same)
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  // ... (startProcess, beginRecording, stopRecording, handleRetake, handleSave remain same)
  const startProcess = () => {
    setError(null);
    setStep('countdown');
    setCountdown(3);
    
    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countInterval);
          beginRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStep('review');
        if (onStopPlayback) onStopPlayback(); // Stop video
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setStep('recording');
      setRecordingTime(0);

      if (onStartPlayback) onStartPlayback(); // Play video (ensure it restarts)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Mic Error:", err);
      setError("Microphone access denied. Please allow permissions.");
      setStep('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
  };

  const handleRetake = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setStep('idle');
    setError(null);
  };

  const handleSave = () => {
    if (audioUrl && onSave) {
      onSave({
        url: audioUrl,
        blob: audioBlob,
        duration: recordingTime,
        title: `Voiceover ${new Date().toLocaleTimeString()}`,
        type: 'voice'
      });
    }
  };

  // --- RENDER LOGIC ---

  return (
    // UPDATED: Added justify-end for recording state to push UI to bottom
    <div className={`flex-1 flex flex-col items-center w-full h-full relative transition-all ${step === 'recording' ? 'justify-end pb-10' : 'justify-center p-6'}`}>
      
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-xs flex items-center gap-2 z-50">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* --- STEP 1: IDLE (Standard Centered UI) --- */}
      {step === 'idle' && (
        <div className="flex flex-col items-center gap-6 animate-fade">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border-4 border-white/5 flex items-center justify-center shadow-2xl relative group">
            <div className="absolute inset-0 rounded-full bg-red-500/20 scale-0 group-hover:scale-110 transition-transform duration-500"></div>
            <Mic size={48} className="text-gray-400 group-hover:text-white transition-colors relative z-10" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-white font-bold text-xl">Record Voiceover</h3>
            <p className="text-gray-500 text-xs">Video will play automatically for dubbing.</p>
          </div>
          <button 
            onClick={startProcess} 
            className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-full font-bold text-white flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95"
          >
            Start Recording
          </button>
        </div>
      )}

      {/* --- STEP 2: COUNTDOWN (Transparent Overlay) --- */}
      {step === 'countdown' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-[120px] font-black text-white animate-ping drop-shadow-2xl">
            {countdown}
          </div>
          <div className="absolute bottom-20 text-white font-bold tracking-widest uppercase animate-pulse">Get Ready</div>
        </div>
      )}

      {/* --- STEP 3: RECORDING (Bottom HUD Style) --- */}
      {step === 'recording' && (
        <div className="w-full max-w-lg mx-auto bg-black/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex items-center justify-between shadow-2xl animate-slide-up">
           {/* Left: Indicator */}
           <div className="flex items-center gap-4">
              <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                  <div className="w-3 h-3 bg-red-500 rounded-full relative z-10"></div>
              </div>
              <div>
                  <div className="text-red-500 font-mono text-2xl font-bold tabular-nums leading-none">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Recording...</div>
              </div>
           </div>

           {/* Center: Mini Waveform */}
           <div className="flex items-center gap-1 h-8 mx-4 opacity-50">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 bg-white rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: '0.5s' }}></div>
             ))}
           </div>

           {/* Right: Stop Button */}
           <button 
            onClick={stopRecording} 
            className="w-12 h-12 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90"
           >
            <Square fill="black" size={16} />
           </button>
        </div>
      )}

      {/* --- STEP 4: REVIEW (Standard Modal UI) --- */}
      {step === 'review' && (
        // Same as before...
        <div className="w-full max-w-sm bg-neutral-900 p-6 rounded-3xl border border-white/10 flex flex-col gap-6 animate-fade shadow-2xl z-20">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Volume2 className="text-purple-500" size={18}/> Review Audio
            </h3>
            <span className="text-xs font-mono text-gray-400">{formatTime(recordingTime)}</span>
          </div>
          
           {/* Static Waveform */}
           <div className="h-20 bg-black/50 rounded-xl border border-white/5 flex items-center justify-center gap-1 px-4 overflow-hidden">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="flex-1 bg-purple-500/40 rounded-full" style={{ height: `${20 + Math.random() * 60}%` }}></div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => { const audio = new Audio(audioUrl); audio.play(); }}
                className="col-span-2 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/5"
            >
                <Play size={16} className="fill-white"/> Listen Preview
            </button>
            <button onClick={handleRetake} className="py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-red-500/20"><Trash2 size={14} /> Retake</button>
            <button onClick={handleSave} className="py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"><Check size={14} strokeWidth={3} /> Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;