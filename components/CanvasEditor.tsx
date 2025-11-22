import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColoringPage } from '../types';
import { PALETTE_COLORS } from '../constants';
import { floodFill } from '../utils/floodFill';
import { Home, Eraser, Download, Undo, Redo, Printer } from 'lucide-react';

interface CanvasEditorProps {
  page: ColoringPage;
  onBack: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ page, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[2]); 
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Undo/Redo state
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const maxHistorySize = 50;

  // Save state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create a deep copy of the current canvas state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const clonedImageData = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );
    
    // Remove any future history if we're not at the end (user has undone some actions)
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    
    // Add new state to history
    historyRef.current.push(clonedImageData);
    
    // Update index to point to the new state
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Limit history size (remove oldest entries if needed)
    while (historyRef.current.length > maxHistorySize) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
    
    // Update button states
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      
      // Update button states
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      
      // Update button states
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = page.imageSrc;
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      // High resolution internal canvas
      const internalWidth = 1024; 
      const internalHeight = 1024;
      
      canvas.width = internalWidth;
      canvas.height = internalHeight;

      // IMPORTANT: Fill background with WHITE first.
      // This is crucial for transparent PNGs/SVGs to be colorable.
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scale to fit image
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.85;
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      // Save initial state to history
      const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const clonedInitialImageData = new ImageData(
        new Uint8ClampedArray(initialImageData.data),
        initialImageData.width,
        initialImageData.height
      );
      historyRef.current = [clonedInitialImageData];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);
      
      setIsReady(true);
    };
  }, [page, saveToHistory]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

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

  // Play sound effect
  const playFillSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(() => {
        // Ignore errors (e.g., if user hasn't interacted with page yet)
      });
    }
  }, []);


  // Get canvas coordinates from mouse/touch event
  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);
    
    return { x, y };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    // Perform the fill first
    floodFill(ctx, coords.x, coords.y, selectedColor);
    // Play sound effect
    playFillSound();
    // Then save the new state AFTER the change
    saveToHistory();
  };

  // Touch event handlers for mobile devices
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    if (!coords) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Perform the fill first
    floodFill(ctx, coords.x, coords.y, selectedColor);
    // Play sound effect
    playFillSound();
    // Then save the new state AFTER the change
    saveToHistory();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary link
    const link = document.createElement('a');
    link.download = `${page.title.replace(/\s+/g, '-').toLowerCase()}-colored.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print - ${page.title}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: white;
            }
            img {
              max-width: 100%;
              height: auto;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            @media print {
              body {
                padding: 0;
              }
              img {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="${page.title}" />
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gray-50 safe-area-container">
      <style>{`
        .safe-area-container {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        .top-bar-safe {
          padding-top: calc(1rem + env(safe-area-inset-top));
          padding-bottom: 0.75rem;
        }
        @media (min-width: 640px) {
          .top-bar-safe {
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
        }
        .color-bar-safe {
          padding-top: 1rem;
          padding-bottom: calc(1rem + env(safe-area-inset-bottom));
        }
        @media (min-width: 640px) {
          .color-bar-safe {
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
        }
        .canvas-container {
          width: min(85vw, calc(100vh - 200px));
          height: min(85vw, calc(100vh - 200px));
          max-width: 100%;
          max-height: 100%;
        }
        @media (min-width: 640px) {
          .canvas-container {
            width: min(75vw, calc(100vh - 250px));
            height: min(75vw, calc(100vh - 250px));
          }
        }
        @media (min-width: 1024px) {
          .canvas-container {
            width: min(70vw, 70vh);
            height: min(70vw, 70vh);
          }
        }
      `}</style>
      {/* Modern Top Control Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 top-bar-safe px-4 sm:px-5 flex items-center justify-between z-10 gap-3 shadow-sm animate-slide-in-left overflow-x-auto">
        <div className="flex gap-3 items-center flex-shrink-0">
          <button 
            onClick={onBack}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all font-rounded flex-shrink-0"
          >
            <Home size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Home</span>
          </button>

          <button 
            onClick={handleUndo}
            disabled={!canUndo}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-rounded flex-shrink-0"
          >
            <Undo size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Undo</span>
          </button>

          <button 
            onClick={handleRedo}
            disabled={!canRedo}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-rounded flex-shrink-0"
          >
            <Redo size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Redo</span>
          </button>
        </div>
        
        <div className="flex gap-3 items-center flex-shrink-0">
          <button 
            onClick={initCanvas}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all font-rounded flex-shrink-0"
          >
            <Eraser size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Clear</span>
          </button>

          <button 
            onClick={handleDownload}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0"
          >
            <Download size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Save</span>
          </button>

          <button 
            onClick={handlePrint}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0"
          >
            <Printer size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Modern Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-8 overflow-hidden min-h-0" ref={containerRef}>
        <div 
          className="canvas-container relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/50 shadow-2xl animate-scale-in"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          <canvas 
            ref={canvasRef}
            className="w-full h-full object-contain cursor-crosshair"
            onClick={handleCanvasClick}
            onTouchStart={handleCanvasTouchStart}
          />
        </div>
      </div>

      {/* Modern Palette Footer */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 color-bar-safe px-3 sm:px-4 z-20 shadow-sm animate-slide-in-right">
        <div className="flex overflow-x-auto py-2 gap-2 sm:gap-3 max-w-5xl mx-auto px-3 sm:px-4 scrollbar-hide items-center">
          {PALETTE_COLORS.map((color, index) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`
                flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all border-2 shadow-sm hover:shadow-md color-button grid-item
                ${selectedColor === color 
                  ? 'ring-4 ring-gray-900 scale-110 border-gray-900' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              style={{ 
                backgroundColor: color,
                animationDelay: `${index * 0.02}s`
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
