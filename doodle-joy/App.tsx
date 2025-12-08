import React, { useState, useEffect, useRef } from 'react';
import CanvasBoard, { CanvasBoardHandle } from './components/CanvasBoard';
import { generateBlobPath, generateGeometricPath, getRandomColor } from './utils/shapeUtils';
import { ShapeConfig, ToolType } from './types';
import { 
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  Square2StackIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  TrashIcon
} from '@heroicons/react/24/outline'; 

// --- Custom Icons for Tools ---

const PenToolIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l1.65-3.8a2 2 0 01.56-.75L14.7 6.95a2 2 0 012.83 0l2.35 2.35a2 2 0 010 2.83l-9.5 9.5a2 2 0 01-.75.56L3 21z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 8.5l2 2" />
  </svg>
);

const EraserToolIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25 19.5 12.75a2.25 2.25 0 0 0 0-3.182l-5.25-5.25a2.25 2.25 0 0 0-3.182 0L3.75 11.625a2.25 2.25 0 0 0 0 3.182l5.25 5.25a2.25 2.25 0 0 0 3.182 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 7.5 17.25 14.25" />
  </svg>
);

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 600;
const COLORS = ['#000000', '#dc2626', '#1e293b', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#9333ea', '#db2777'];

const App: React.FC = () => {
  // State
  const [shape, setShape] = useState<ShapeConfig>({
    id: 'init',
    path: '',
    color: '#FDE047',
    rotation: 0,
    scaleX: 1,
    scaleY: 1
  });
  const [tool, setTool] = useState<ToolType>(ToolType.PEN);
  const [brushColor, setBrushColor] = useState<string>('#1e293b');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Responsive scaling
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<CanvasBoardHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    generateNewShape();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/bubble.wav');
    audioRef.current.preload = 'auto';
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Initialize and play background music
  useEffect(() => {
    backgroundMusicRef.current = new Audio('/storybg.mp3');
    backgroundMusicRef.current.preload = 'auto';
    backgroundMusicRef.current.volume = 0.5;
    backgroundMusicRef.current.loop = true;
    
    // Play the background music
    backgroundMusicRef.current.play().catch((error) => {
      // Ignore errors (e.g., if user hasn't interacted with page yet)
      console.log('Background music play failed:', error);
    });
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Play sound effect
  const playFillSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(() => {
        // Ignore errors (e.g., if user hasn't interacted with page yet)
      });
    }
  };

  // Handle window resize to scale canvas
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const padding = 40;
        
        // Calculate scale to fit either width or height within container
        const scaleX = (clientWidth - padding) / CANVAS_WIDTH;
        const scaleY = (clientHeight - padding) / CANVAS_HEIGHT;
        
        // Use the smaller scale factor to ensure it fits entirely
        const newScale = Math.min(1, Math.min(scaleX, scaleY));
        setScale(newScale);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateNewShape = (type: 'organic' | 'geometric' = 'organic') => {
    canvasRef.current?.resetCanvas();
    const path = type === 'organic' 
      ? generateBlobPath(CANVAS_WIDTH, CANVAS_HEIGHT) 
      : generateGeometricPath(CANVAS_WIDTH, CANVAS_HEIGHT);
    
    setShape({
      id: Date.now().toString(),
      path,
      color: getRandomColor(),
      rotation: Math.random() * 360,
      scaleX: Math.random() > 0.5 ? 1 : -1,
      scaleY: Math.random() > 0.5 ? 1 : -1
    });
  };

  const handleRotation = () => setShape(prev => ({ ...prev, rotation: prev.rotation + 90 }));
  const handleFlip = () => setShape(prev => ({ ...prev, scaleX: prev.scaleX * -1 }));

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      const imageData = await canvasRef.current.getCompositeImage();
      const link = document.createElement('a');
      link.download = `doodle-joy-${Date.now()}.png`;
      link.href = imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f2f2f7] flex flex-col items-center relative overflow-hidden font-sans">
      
      {/* --- Top Floating Bar --- */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-end items-start z-20 pointer-events-none">
        
        {/* Action Group */}
        <div className="flex gap-3 pointer-events-auto">
           {/* Shape Controls */}
           <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-sm border border-white/40">
              <IconButton onClick={() => generateNewShape('organic')} icon={<SparklesIcon className="w-5 h-5" />} label="Blob" />
              <IconButton onClick={() => generateNewShape('geometric')} icon={<Square2StackIcon className="w-5 h-5" />} label="Geo" />
              <div className="w-px h-5 bg-slate-300 mx-1"></div>
              <IconButton onClick={handleRotation} icon={<ArrowPathIcon className="w-5 h-5" />} label="Rotate" />
              <IconButton onClick={handleFlip} icon={<ArrowsRightLeftIcon className="w-5 h-5" />} label="Flip" />
           </div>

           {/* History Controls */}
           <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-sm border border-white/40">
              <IconButton onClick={() => canvasRef.current?.undo()} icon={<ArrowUturnLeftIcon className="w-5 h-5" />} disabled={!canUndo} label="Undo" />
              <IconButton onClick={() => canvasRef.current?.redo()} icon={<ArrowUturnRightIcon className="w-5 h-5" />} disabled={!canRedo} label="Redo" />
              <div className="w-px h-5 bg-slate-300 mx-1"></div>
              <IconButton onClick={() => canvasRef.current?.clearCanvas()} icon={<TrashIcon className="w-5 h-5 text-red-500" />} label="Clear" />
           </div>
           
           {/* Download */}
           <button 
            onClick={handleDownload}
            className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
            title="Download"
           >
             <ArrowDownTrayIcon className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* --- Main Canvas Area --- */}
      <div ref={containerRef} className="flex-1 w-full flex items-center justify-center relative z-10">
        <div 
          style={{ 
            width: CANVAS_WIDTH, 
            height: CANVAS_HEIGHT, 
            transform: `scale(${scale})`,
            transformOrigin: 'center' 
          }}
          className="shadow-2xl rounded-[2.5rem] bg-white transition-transform duration-200"
        >
          <CanvasBoard 
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            shape={shape}
            tool={tool}
            brushColor={brushColor}
            brushSize={brushSize}
            onInteract={() => {}}
            onHistoryChange={(undo, redo) => {
              setCanUndo(undo);
              setCanRedo(redo);
            }}
            className="rounded-[2.5rem]" // Matches parent radius
          />
        </div>
      </div>

      {/* --- Bottom Dock (Drawing Tools) --- */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-4xl">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-3 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between overflow-visible">
            
            {/* Left: Tools & Size */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
               {/* Tool Switcher */}
               <div className="bg-slate-100 p-1 rounded-full flex shrink-0">
                  <button 
                    onClick={() => setTool(ToolType.PEN)}
                    className={`p-3 rounded-full transition-all ${tool === ToolType.PEN ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Pen"
                  >
                    <PenToolIcon className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setTool(ToolType.ERASER)}
                    className={`p-3 rounded-full transition-all ${tool === ToolType.ERASER ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Eraser"
                  >
                    <EraserToolIcon className="w-6 h-6" />
                  </button>
               </div>

               {/* Size Slider */}
               <div className="flex items-center gap-2 px-2 shrink-0">
                  <div className={`w-2 h-2 rounded-full bg-slate-300 ${brushSize < 5 ? 'bg-slate-800' : ''}`} />
                  <input 
                    type="range" 
                    min="2" 
                    max="40" 
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-24 sm:w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                  />
                  <div className={`w-4 h-4 rounded-full bg-slate-300 ${brushSize > 20 ? 'bg-slate-800' : ''}`} />
               </div>
            </div>

            {/* Separator (Desktop) */}
            <div className="hidden sm:block w-px h-10 bg-slate-200" />

            {/* Right: Colors */}
            <div 
              className="flex gap-2 overflow-x-auto overflow-y-visible py-2 w-full sm:w-auto px-1 hide-scrollbar"
              style={{ touchAction: 'pan-y' }}
            >
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBrushColor(c);
                      setTool(ToolType.PEN);
                      playFillSound();
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 border-[3px] transition-all ${brushColor === c && tool === ToolType.PEN ? 'scale-110 border-slate-200 shadow-md' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

// Helper Component for Top Bar Buttons
const IconButton = ({ onClick, icon, disabled, label }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className="p-2 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors group relative"
  >
    {icon}
    <span className="sr-only">{label}</span>
  </button>
);

export default App;